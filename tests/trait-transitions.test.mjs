import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {applyTraitCounts,traitBuffTotals} from '../main/trait-counts.js';
const require=createRequire(import.meta.url);
const {findTraitTransitions}=require('../unit-bridge/replay/trait-transitions.cjs');
const {normalizeSnapshot}=require('../unit-bridge/core.cjs');
const source={objectTag:'1:2',typeId:'H09H',commandPlayerId:1,timeMs:100};
const target={objectTag:'3:4',typeId:'H09G',commandPlayerId:1,timeMs:300};
const command={sourceTag:'1:2',abilityId:'A04X',commandPlayerId:1,timeMs:200};
test('trait transition needs source, command and unique new transformed observation',()=>{
 assert.equal(findTraitTransitions({observations:[source],commands:[command]}).length,0);
 assert.equal(findTraitTransitions({observations:[source,target],commands:[]}).length,0);
 assert.equal(findTraitTransitions({observations:[source,target,{...target,objectTag:'5:6'}],commands:[command]}).length,0);
 assert.equal(findTraitTransitions({observations:[source,target,{...source,timeMs:400}],commands:[command]}).length,0);
 assert.equal(findTraitTransitions({observations:[source,target],commands:[command,command]}).length,1);
});
test('snapshot drops old count; calculator transfers one unit once for selected player',()=>{
 const traitTransitions=findTraitTransitions({observations:[source,target],commands:[command]});
 const data={kind:'replay-observations',mapVersion:'2.323',replayId:'a'.repeat(64),replayTimeMs:400,combinationAttempts:0,traitTransitions,units:[source,target].map(o=>({instanceId:o.objectTag,typeId:o.typeId,observerPlayerId:o.commandPlayerId,lastSeenMs:o.timeMs}))};
 const normalized=normalizeSnapshot(data);
 assert.equal(normalized.total,1);assert.equal(normalized.units[0].typeId,'H09G');
 const units=[{rawcode:'H09H',Check:2},{rawcode:'H09G',Check:0}],seen=new Set();
 assert.equal(applyTraitCounts(normalized,'all',units,seen),0);
 assert.equal(applyTraitCounts(normalized,'2',units,seen),0);
 assert.equal(applyTraitCounts(normalized,'1',units,seen),1);
 assert.deepEqual(units.map(u=>u.Check),[1,1]);
 assert.equal(applyTraitCounts(normalized,'1',units,seen),0);
 assert.throws(()=>normalizeSnapshot({...data,traitTransitions:[{...traitTransitions[0],toTypeId:'h02E'}]}));
});
test('group buff switches without stacking base and enhanced values',()=>{
 const units=[{rank:'r',name:'base',Check:0,slow:45},{rank:'r',name:'enhanced',Check:1,slow:60}];
 assert.equal(traitBuffTotals(units,[[['base','r'],['enhanced','r']]]).slow,60);
});
