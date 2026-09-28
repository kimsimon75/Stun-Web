import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, copyFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import builder from '../scripts/build-functions.cjs';

test('function boots without node_modules beside the deployed file',async()=>{
    await builder.buildFunctions();
    const directory=await mkdtemp(path.join(tmpdir(),'stun-function-'));
    try {
        const file=path.join(directory,'unit-snapshots.mjs');
        await copyFile('.functions-build/unit-snapshots.mjs',file);
        const module=await import(pathToFileURL(file).href);
        let saved;
        const token='a'.repeat(64);
        const handler=module.createHandler({token,store:()=>({setJSON:async(k,v)=>{saved=v;}})});
        assert.equal((await handler(new Request('https://example.test/'))).status,401);
        const result=await handler(new Request('https://example.test/',{method:'POST',headers:{authorization:'Bearer '+token},body:JSON.stringify({mapVersion:'2.322',units:[]})}));
        assert.equal(result.status,200);assert.equal(saved.total,0);
    } finally {
        // mkdtemp creates a new test-owned directory directly within the temp root.
        assert.equal(path.dirname(directory),path.resolve(tmpdir()));
        await rm(directory,{recursive:true,force:true});
    }
});
