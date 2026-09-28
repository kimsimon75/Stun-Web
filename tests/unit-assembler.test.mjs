import test from 'node:test';
import assert from 'node:assert/strict';
import { Assembler } from '../unit-bridge/assembler.cjs';
const unit = id => ({instanceId:String(id), typeId:'H08V',playerId:0});
const part = (index,final,units,snapshot=1) => ({protocol:'stun-units-v1',mapVersion:'2.322',session:'123-456',snapshot,part:index,final,units});
test('only completes after all parts arrive, handles order and replay',()=>{
 const a=new Assembler();
 assert.equal(a.accept(part(1,true,[unit(2)])),null);
 const result=a.accept(part(0,false,[unit(1)]));
 assert.deepEqual(result.units,[unit(1),unit(2)]);
 assert.equal(a.accept(part(0,false,[unit(1)])),null);
 assert.deepEqual(a.accept(part(0,true,[],2)).units,[]);
});
test('never joins different snapshots or expired partial data',()=>{
 const a=new Assembler();
 assert.equal(a.accept(part(0,false,[unit(1)]),0),null);
 assert.equal(a.accept(part(1,true,[unit(2)],2),1),null);
 assert.equal(a.accept(part(1,true,[unit(2)]),16000),null);
 assert.equal(a.accept(part(0,false,[unit(1)],2),16001),null);
});
test('rejects duplicate instances across parts and conflicting packet data',()=>{
 const a=new Assembler(); a.accept(part(0,false,[unit(1)]));
 assert.throws(()=>a.accept(part(1,true,[unit(1)])));
 const b=new Assembler(); b.accept(part(0,false,[unit(1)]));
 assert.throws(()=>b.accept(part(0,false,[unit(2)])));
 assert.throws(()=>b.accept(part(513,true,[])));
});
