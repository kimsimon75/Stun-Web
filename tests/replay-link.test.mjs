import test from 'node:test';
import assert from 'node:assert/strict';
import core from '../unit-bridge/core.cjs';
import {createHandler} from '../netlify/functions/unit-snapshots.mjs';
import {snapshot} from '../unit-bridge/replay/watch.cjs';
const data={kind:'replay-observations',mapVersion:'2.323',replayId:'b'.repeat(64),replayTimeMs:20000,combinationAttempts:2,units:[{instanceId:'1:2',typeId:'h02E',observerPlayerId:1,lastSeenMs:15000}]};
test('replay data is identified server-side and keeps observation semantics',()=>{
 const result=core.normalizeSnapshot(data);assert.equal(result.total,1);assert.match(result.units[0].name,/죠즈/);assert.equal(result.units[0].observerPlayerId,1);assert.equal(result.units[0].playerId,undefined);
 assert.throws(()=>core.normalizeSnapshot({...data,units:[data.units[0],data.units[0]]}));
 assert.throws(()=>core.normalizeSnapshot({...data,units:[{...data.units[0],lastSeenMs:30000}]}));
});
test('read credential can fetch but cannot write; publishing token is not a web credential',async()=>{
 const token='a'.repeat(64);let saved;
 const handler=createHandler({token,store:()=>({setJSON:async(k,v)=>saved=v,get:async()=>saved})});
 const request=(method,credential,body)=>new Request('https://example.netlify.app/.netlify/functions/unit-snapshots',{method,headers:{authorization:'Bearer '+credential},...(body?{body:JSON.stringify(body)}:{})});
 assert.equal((await handler(request('POST',core.readToken(token),data))).status,401);
 assert.equal(saved,undefined);
 assert.equal((await handler(request('POST',token,data))).status,200);
 const response=await handler(request('GET',core.readToken(token)));assert.equal(response.status,200);assert.equal((await response.json()).kind,'replay-observations');
 assert.equal((await handler(request('GET',token))).status,401);
});
test('repeated selections do not become multiple units and replay identity ignores changing header',()=>{
 const buffer=Buffer.alloc(100);buffer.writeUInt16LE(20,68);
 const result={timeMs:100,commands:[],observations:[{objectTag:'1:2',typeId:'h02E',commandPlayerId:1,timeMs:20},{objectTag:'1:2',typeId:'h02E',commandPlayerId:1,timeMs:90}]};
 const a=snapshot(result,buffer);assert.equal(a.units.length,1);assert.equal(a.units[0].lastSeenMs,90);
 buffer.writeUInt32LE(500,32);assert.equal(snapshot(result,buffer).replayId,a.replayId);
});
test('live observer data keeps current per-player counts',()=>{
 const live={kind:'live-observer',mapVersion:'2.323',gameTimeMs:12000,mapName:'ORDR 2.323',players:[{playerId:0,name:'player',traitPoints:4}],units:[{playerId:0,typeId:'h02E',count:2}]};
 const result=core.normalizeSnapshot(live);
 assert.equal(result.kind,'live-observer');assert.equal(result.units[0].count,2);assert.equal(result.players[0].traitPoints,4);
 assert.throws(()=>core.normalizeSnapshot({...live,units:[...live.units,...live.units]}));
});
