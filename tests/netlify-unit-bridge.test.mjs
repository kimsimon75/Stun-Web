import test from 'node:test';
import assert from 'node:assert/strict';
import core from '../unit-bridge/core.cjs';
import { createHandler } from '../netlify/functions/unit-snapshots.mjs';
const snapshot={mapVersion:'2.322',units:[{instanceId:'1',typeId:'H08V',playerId:0},{instanceId:'2',typeId:'H08V',playerId:0}]};
test('identifies units, counts owners and rejects duplicates',()=>{
    const result=core.identify(snapshot);
    assert.equal(result.total,2);assert.equal(result.units[0].count,2);assert.match(result.units[0].name,/나미/);
    assert.throws(()=>core.identify({...snapshot,units:[snapshot.units[0],snapshot.units[0]]}));
    assert.equal(core.identify({mapVersion:'2.322',units:[]}).total,0);
});
test('requires authorization before storage and saves only validated data',async()=>{
    const token='a'.repeat(64);let saved;
    const handler=createHandler({token,store:()=>({setJSON:async(key,data)=>{saved=data;},get:async()=>saved})});
    const request=(body,auth=true)=>new Request('https://example.netlify.app/.netlify/functions/unit-snapshots',{method:'POST',headers:auth?{authorization:`Bearer ${token}`}:{},body:JSON.stringify(body)});
    assert.equal((await handler(request(snapshot,false))).status,401);assert.equal(saved,undefined);
    assert.equal((await handler(request({}))).status,400);assert.equal(saved,undefined);
    assert.equal((await handler(request(snapshot))).status,200);assert.equal(saved.total,2);
});
test('client attaches token only to valid endpoint and rejects redirects',async()=>{
    const config={UNIT_API_URL:'https://example.netlify.app/.netlify/functions/unit-snapshots',UNIT_BRIDGE_TOKEN:'a'.repeat(64)};
    await core.send(snapshot,config,async(url,options)=>{assert.equal(options.redirect,'error');assert.equal(options.headers.authorization,'Bearer '+config.UNIT_BRIDGE_TOKEN);return {ok:true,json:async()=>({accepted:true})};});
    await assert.rejects(core.send(snapshot,{...config,UNIT_API_URL:'https://example.com/'}));
});
