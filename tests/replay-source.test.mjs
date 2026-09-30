import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import source from '../unit-bridge/replay/source.cjs';
import reader from '../unit-bridge/replay/reader.cjs';
test('folder switches from autosave to recently updated LastReplay',async()=>{
 const dir=await fs.mkdtemp(path.join(os.tmpdir(),'stun-replay-source-'));
 try{
  await fs.mkdir(path.join(dir,'Autosaved'));
  const old=path.join(dir,'Autosaved','old.w3g'),latest=path.join(dir,'LastReplay.w3g');
  const valid=Buffer.alloc(68);valid.write('Warcraft III recorded game\x1a');
  await fs.writeFile(old,valid);await fs.utimes(old,100,100);
  assert.equal((await source.resolveReplay(dir)).file,old);
  const empty=path.join(dir,'TempReplay.w3g');await fs.writeFile(empty,'');await fs.utimes(empty,300,300);
  assert.equal((await source.resolveReplay(dir)).file,old);
  await fs.writeFile(latest,valid);await fs.utimes(latest,200,200);
  assert.equal((await source.resolveReplay(dir)).file,latest);
  assert.equal((await source.resolveReplay(old)).file,old);
 }finally{assert.equal(path.dirname(dir),path.resolve(os.tmpdir()));await fs.rm(dir,{recursive:true,force:true});}
});
test('ignores a growing TempReplay without a finalized W3G header',async()=>{
 const dir=await fs.mkdtemp(path.join(os.tmpdir(),'stun-temp-replay-'));
 try{
  const last=path.join(dir,'LastReplay.w3g'),temp=path.join(dir,'TempReplay.w3g');
  const valid=Buffer.alloc(68);valid.write('Warcraft III recorded game\x1a');
  await fs.writeFile(last,valid);await fs.utimes(last,100,100);
  await fs.writeFile(temp,Buffer.alloc(1000,1));await fs.utimes(temp,200,200);
  assert.equal(await source.hasReplayHeader(temp),false);
  assert.equal((await source.resolveReplay(dir)).file,last);
  await fs.writeFile(last,Buffer.alloc(1000,1));
  await assert.rejects(source.resolveReplay(last),/정식 W3G 헤더/);
 }finally{assert.equal(path.dirname(dir),path.resolve(os.tmpdir()));await fs.rm(dir,{recursive:true,force:true});}
});
test('one-byte Reforged pause does not consume the next action',()=>{
 assert.deepEqual(new reader.ExtendedActions().parse(Buffer.from([1]),true),[{id:1}]);
 assert.deepEqual(new reader.ExtendedActions().parse(Buffer.from([1,0x61]),true),[{id:1},{id:0x61}]);
});
