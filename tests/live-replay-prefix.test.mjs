import test from 'node:test';
import assert from 'node:assert/strict';
import { deflateSync } from 'node:zlib';
import replayReader from '../unit-bridge/replay/reader.cjs';

test('진행 중 TempReplay의 0 헤더 뒤에서 완성된 압축 블록만 읽는다', () => {
    const source = Buffer.from('complete replay block');
    const compressed = deflateSync(source);
    const block = Buffer.alloc(12 + compressed.length);
    block.writeUInt32LE(compressed.length, 0);
    block.writeUInt32LE(source.length, 4);
    compressed.copy(block, 12);
    const partial = Buffer.from([1, 2, 3, 4, 5]);
    const result = replayReader.decompressPrefix(Buffer.concat([Buffer.alloc(68), block, partial]));
    assert.equal(result.activeReplay, true);
    assert.equal(result.blocks, 1);
    assert.deepEqual(result.data, source);
    assert.equal(result.pendingBytes, partial.length);
});
