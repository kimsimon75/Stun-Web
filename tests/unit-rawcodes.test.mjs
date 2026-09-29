import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';

test('rank rawcodes exist in the map and ambiguous states are explicit', async () => {
  const catalog = JSON.parse(readFileSync(new URL('../unit-bridge/catalog.json', import.meta.url)));
  const rows = [];
  for (const file of readdirSync(new URL('../units/ranks/', import.meta.url))) {
    const mod = await import(`../units/ranks/${file}`);
    rows.push(...Object.values(mod).flat());
  }
  const nonUnitRanks = new Set(['아이템', '항법', '연구소']);
  const mapped = rows.filter(row => row.rawcode && !nonUnitRanks.has(row.rank));
  assert.equal(mapped.length, 130);
  for (const row of mapped) {
    assert.ok(catalog[row.rawcode], `${row.rank}/${row.name}: ${row.rawcode}`);
  }
  assert.deepEqual(rows.filter(row => row.rawcode === null).map(row => row.name).sort(), ['X-드레이크', '비구름생성기', '키쿄우']);
  for (const row of rows) {
    assert.ok(Object.hasOwn(row, 'rawcode'), `${row.rank}/${row.name}`);
    assert.ok(row.rawcode === null || /^[A-Za-z0-9]{4}$/.test(row.rawcode));
    for (const key of ['abilityRawcode', 'itemRawcode', 'itemAbilityRawcode', 'researchRawcode']) {
      assert.equal(Object.hasOwn(row, key), false);
    }
  }
  const get = (rank, name) => rows.find(row => row.rank === rank && row.name === name);
  assert.equal(get('희귀함', '죠즈').rawcode, 'h02E');
  assert.equal(get('초월함', '요크(베가펑크)').rawcode, 'H0AM');
  assert.equal(get('초월함', '나미').rawcode, 'H08V'); // 분신 h068과 구분
  assert.equal(get('초월함', '우초 식물').rawcode, 'h09J'); // 해바라기가 아닌 백설콩
  assert.notEqual(get('초월함', '상디').rawcode, get('초월함', '상디(강화)').rawcode);
  assert.notEqual(get('불멸의', '센고쿠').rawcode, get('불멸의', '센고쿠(특강)').rawcode);
  for (const row of mapped) {
    const same = mapped.filter(other => other.rawcode === row.rawcode);
    if (same.length > 1) assert.equal(row.rawcodeRequiresState, true, `${row.rank}/${row.name}`);
  }
});
