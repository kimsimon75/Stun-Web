import test from 'node:test';
import assert from 'node:assert/strict';
import {linkedRows,applyLinkedCounts} from '../main/linked-unit-counts.js';

test('filters unregistered creeps, selects player, replaces counts without accumulation',()=>{
 const units=[{rank:'희귀함',name:'죠즈',rawcode:'h02E',Check:9},{rank:'아이템',name:'item',rawcode:'A134',Check:1}];
 const data={kind:'replay-observations',units:[{typeId:'h02E',count:2,observerPlayerId:1},{typeId:'h02E',count:4,observerPlayerId:2},{typeId:'n000',count:99,observerPlayerId:1},{typeId:'A134',count:3,observerPlayerId:1}]};
 assert.equal(linkedRows(data,units,'1').length,1);
 assert.equal(applyLinkedCounts(data,'all',units),false);
 applyLinkedCounts(data,'1',units);assert.deepEqual(units.map(u=>u.Check),[2,1]);
 assert.equal(applyLinkedCounts(data,'1',units),false);
 applyLinkedCounts(data,'2',units);assert.equal(units[0].Check,4);
 applyLinkedCounts({...data,units:[]},'2',units);assert.equal(units[0].Check,0);
});

test('transformed rawcode replaces base and same-code variants are not duplicated',()=>{
 const units=[{rank:'초월함',name:'상디',rawcode:'H09H',Check:1},{rank:'초월함',name:'상디(강화)',rawcode:'H09G',Check:0},{rank:'제한됨',name:'크로커다일(특강)',rawcode:'h05F',Check:1},{rank:'제한됨',name:'크로커다일',rawcode:'h05F',Check:0}];
 applyLinkedCounts({mapVersion:'2.322',units:[{typeId:'H09G',count:1,playerId:0},{typeId:'h05F',count:1,playerId:0}]},'1',units);
 assert.deepEqual(units.map(u=>u.Check),[0,1,0,1]);
});
