import test from 'node:test';
import assert from 'node:assert/strict';
import guard from '../unit-bridge/replay/game-guard.cjs';
test('detects Warcraft process names without confusing bridge or launcher',()=>{
 for(const name of ['Warcraft III.exe','WarcraftIII.exe','Warcraft.exe','war3.exe'])assert.equal(guard.containsWarcraft(`"${name}","123","Console","1","1,000 K"`),true);
 assert.equal(guard.containsWarcraft('"StunReplayLink-v2.exe","10"\n"Battle.net.exe","11"'),false);
});
