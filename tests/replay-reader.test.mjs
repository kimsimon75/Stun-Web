import test from 'node:test';
import assert from 'node:assert/strict';
import {deflateSync} from 'node:zlib';
import reader from '../unit-bridge/replay/reader.cjs';

test('waits for complete compression blocks even with stale header counters',()=>{
 const h=Buffer.alloc(68);h.write('Warcraft III recorded game\x1a\0');h.writeUInt32LE(68,28);h.writeUInt16LE(7000,56);
 const payload=Buffer.from('live replay block');const z=deflateSync(payload),b=Buffer.alloc(12);b.writeUInt16LE(z.length);b.writeUInt16LE(payload.length,4);
 assert.equal(reader.decompressPrefix(Buffer.concat([h,b,z.subarray(0,-1)])).blocks,0);
 assert.deepEqual(reader.decompressPrefix(Buffer.concat([h,b,z])).data,payload);
});
test('does not parse a partial timeslot',()=>{
 const b=Buffer.from([0x1f,2,0,20,0,0x1f,2,0,20]);
 assert.equal(reader.completeGameData(b).length,5);
});
test('decodes raw 0x77 sync and preserves next frame record boundaries',()=>{
 const sync=Buffer.concat([Buffer.from([0x77]),Buffer.from('TEST\0value\0'),Buffer.alloc(4)]);
 const frame=Buffer.alloc(18);frame[0]=0x78;frame.writeUInt32LE(2,9);
 const a=new reader.ExtendedActions().parse(Buffer.concat([sync,frame]),true);
 assert.equal(a.length,2);assert.equal(a[0].identifier,'TEST');assert.equal(a[0].value,'value');assert.equal(a[1].id,0x79);
});
