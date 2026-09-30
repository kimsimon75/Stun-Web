import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import stable from '../unit-bridge/replay/stable-read.cjs';
test('empty, writing and replaced replay files wait; settled snapshots can be read',async()=>{
 const dir=await fs.mkdtemp(path.join(os.tmpdir(),'stun-stable-'));
 const file=path.join(dir,'TempReplay.w3g');
 try{
  await fs.writeFile(file,Buffer.alloc(0));
  assert.equal((await stable.readStableReplay(file)).waiting,true);
  await fs.writeFile(file,Buffer.alloc(100,7));
  assert.equal((await stable.readStableReplay(file,{settleMs:60000})).waiting,true);
  const read=await stable.readStableReplay(file,{settleMs:0});
  assert.equal(read.buffer.length,100);assert.equal(read.buffer[0],7);
  await fs.writeFile(file,Buffer.alloc(10));
  assert.equal((await stable.readStableReplay(file)).waiting,true);
  await fs.writeFile(file,Buffer.alloc(80,9));
  assert.equal((await stable.readStableReplay(file,{settleMs:0})).buffer[0],9);
  await assert.rejects(stable.readStableReplay(file,{maxBytes:70}));
 }finally{assert.equal(path.dirname(dir),path.resolve(os.tmpdir()));await fs.rm(dir,{recursive:true,force:true});}
});
