const zlib = require('node:zlib');
// Explicit paths let the standalone EXE packager include the low-level parser.
const { MetadataParser } = require('../../node_modules/w3gjs/dist/cjs/parsers/MetadataParser.js');
const { GameDataParser } = require('../../node_modules/w3gjs/dist/cjs/parsers/GameDataParser.js');
const { ActionParser } = require('../../node_modules/w3gjs/dist/cjs/parsers/ActionParser.js');
const catalog = require('./catalog-2.323.json');
const abilities = require('./abilities-2.323.json');
const fourcc = bytes => Buffer.from(bytes).reverse().toString('latin1');

class ExtendedActions extends ActionParser {
    parse(input, post) {
        this.initialize(input);
        const result = [];
        while(this.offset < input.length) {
            const action = this.parseAction(this.readUInt8(), post);
            if(action) result.push(action);
        }
        if(this.offset !== input.length) throw new Error('Action record exceeds its enclosing command block');
        return result;
    }
    parseAction(raw, post) {
        const id = post && raw > 0x77 ? raw + 1 : raw;
        // Reforged pause is a one-byte action; the legacy parser skips a byte.
        if(post && raw === 0x01) return {id:0x01};
        // In this post-2.0.2 replay raw 0x77 is sync, not the old W3API layout.
        if(post && raw === 0x77) return {id:0x78,identifier:this.readZeroTermString('utf8'),value:this.readZeroTermString('utf8'),tail:this.readUInt32LE()};
        if(id === 0x7b) return {id,source:this.readNetTag(),ability:this.readFourCC(),order:this.readFourCC()};
        if(id === 0x79) return {id,frame:this.readNetTag(),eventId:this.readUInt32LE(),val:this.readFloatLE(),text:this.readZeroTermString('utf8')};
        if(id === 0x60) return {id,unknown:[this.readUInt32LE(),this.readUInt32LE()],command:this.readZeroTermString('utf8')};
        return super.parseAction(raw, post);
    }
}

// Header counters may still describe an older prefix during an active write.
// Consume only physically complete compressed blocks, never a partial block.
function decompressPrefix(buffer) {
    if(buffer.length < 68) return {waiting:true,blocks:0};
    // TempReplay reserves the normal 68-byte header as zeroes until the game
    // finishes. Its complete compressed blocks already start at offset 68, so
    // they can be read safely from a detached file copy while WC3 keeps writing.
    const activeReplay=buffer.subarray(0,68).every(byte=>byte===0);
    if(!activeReplay && buffer.subarray(0,27).toString('ascii') !== 'Warcraft III recorded game\x1a') throw new Error('Not a W3G replay');
    const headerSize=activeReplay?68:buffer.readUInt32LE(28), build=activeReplay?10200:buffer.readUInt16LE(56);
    if(headerSize !== 68 || build < 6089) throw new Error('Only Reforged 68-byte replay headers are supported');
    let offset=headerSize; const chunks=[];
    while(offset+12 <= buffer.length) {
        const size=buffer.readUInt16LE(offset), expected=buffer.readUInt16LE(offset+4);
        if(!size || !expected) throw new Error('Invalid compressed block size');
        if(offset+12+size > buffer.length) break;
        const chunk=zlib.inflateSync(buffer.subarray(offset+12,offset+12+size), {finishFlush:zlib.constants.Z_SYNC_FLUSH,maxOutputLength:65536});
        if(chunk.length !== expected) throw new Error('Decompressed size mismatch; file may be changing');
        chunks.push(chunk); offset+=12+size;
    }
    return {data:Buffer.concat(chunks),blocks:chunks.length,consumedBytes:offset,pendingBytes:buffer.length-offset,headerDurationMs:activeReplay?0:buffer.readUInt32LE(60),activeReplay};
}

function completeGameData(data) {
    let offset=0;
    while(offset < data.length) {
        const id=data[offset]; let length;
        if(id === 0) break; // Replay block padding.
        if(id === 0x1e || id === 0x1f || id === 0x20) {
            const lengthOffset=id === 0x20 ? 2 : 1;
            if(offset+lengthOffset+2 > data.length) break;
            length=lengthOffset+2+data.readUInt16LE(offset+lengthOffset);
        } else if(id === 0x22) {
            if(offset+2 > data.length) break;
            length=2+data[offset+1];
        } else {
            length=({0x17:14,0x1a:5,0x1b:5,0x1c:5,0x23:11,0x2f:9})[id];
            if(!length) throw new Error(`Unknown replay block 0x${id.toString(16)} at ${offset}`);
        }
        if(offset+length > data.length) break;
        offset+=length;
    }
    return data.subarray(0,offset);
}

async function analyze(buffer) {
    const prefix=decompressPrefix(buffer);
    if(prefix.waiting || !prefix.blocks) return {waiting:true,blocks:prefix.blocks};
    let metadata;
    try { metadata=await new MetadataParser().parseData(prefix.data); }
    catch(error) { if(error instanceof RangeError) return {waiting:true,blocks:prefix.blocks}; throw error; }
    if(!metadata.isPost202ReplayFormat) throw new Error('This reader is validated only for post-2.0.2 replay actions');
    if(!/ORDR_S2_2\.323(?:\[R\])?\.w3x$/i.test(metadata.map.mapName)) throw new Error('A matching unit catalog is required for this map: '+metadata.map.mapName);
    const parser=new GameDataParser(); parser.actionParser=new ExtendedActions();
    let timeMs=0; const observations=[],commands=[],counts={},syncCounts={};
    parser.on('gamedatablock',block=>{
        if(block.id !== 0x1f) return;
        timeMs+=block.timeIncrement;
        for(const command of block.commandBlocks) for(const action of command.actions) {
            const id='0x'+action.id.toString(16); counts[id]=(counts[id]||0)+1;
            if(action.id === 0x19) {
                const typeId=fourcc(action.itemId),row=catalog[typeId];
                observations.push({timeMs,commandPlayerId:command.playerId,typeId,name:row?.heroName||row?.name||null,objectTag:action.object.join(':')});
            }
            if(action.id === 0x7b) {
                const abilityId=fourcc(action.ability),orderId=fourcc(action.order),definition=abilities[abilityId];
                commands.push({timeMs,commandPlayerId:command.playerId,sourceTag:action.source.join(':'),abilityId,orderHex:Buffer.from(action.order).reverse().toString('hex'),orderTypeId:catalog[orderId]?orderId:null,abilityName:definition?.name||null,tooltip:definition?.tooltip||'',isCombination:definition?.name==='[조합]'});
            }
            if(action.id === 0x78) syncCounts[action.identifier]=(syncCounts[action.identifier]||0)+1;
            if(action.id === 0x60 && /조합$/.test(action.command)) commands.push({timeMs,commandPlayerId:command.playerId,chatCombination:action.command,isCombination:true});
        }
    });
    await parser.parse(completeGameData(metadata.gameData),true);
    return {map:metadata.map.mapName,blocks:prefix.blocks,consumedBytes:prefix.consumedBytes,pendingBytes:prefix.pendingBytes,timeMs,counts,syncCounts,observations,commands};
}
module.exports={analyze,decompressPrefix,completeGameData,ExtendedActions};
