import test from 'node:test';
import assert from 'node:assert/strict';
import { linkedRows, applyLinkedCounts } from '../main/linked-unit-counts.js';

test('등록되지 않은 중립몹과 수동 항목을 제외하고 선택한 사용자 수량만 반영한다', () => {
    const units = [
        { rank: '희귀함', name: '죠즈', rawcode: 'h02E', Check: 9 },
        { rank: '아이템', name: '우타의 헤드셋', rawcode: 'A0KM', Check: 1 },
    ];
    const data = { kind: 'live-observer', units: [
        { typeId: 'h02E', count: 2, playerId: 0 }, { typeId: 'h02E', count: 4, playerId: 1 },
        { typeId: 'n000', count: 99, playerId: 0 }, { typeId: 'A0KM', count: 3, playerId: 0 },
    ] };
    assert.deepEqual(linkedRows(data, units, '1').map(row => [row.name, row.count]), [['죠즈', 2]]);
    assert.equal(applyLinkedCounts(data, 'all', units), false);
    assert.equal(applyLinkedCounts(data, '1', units), true);
    assert.deepEqual(units.map(unit => unit.Check), [2, 1]);
    assert.equal(applyLinkedCounts(data, '1', units), false);
    applyLinkedCounts(data, '2', units);
    assert.equal(units[0].Check, 4);
});

test('변환 rawcode는 별도 유닛으로, 같은 rawcode 상태 항목은 기본 항목으로 집계한다', () => {
    const units = [
        { rank: '초월함', name: '상디', rawcode: 'H09H', Check: 1 },
        { rank: '초월함', name: '상디(강화)', rawcode: 'H09G', Check: 0 },
        { rank: '제한됨', name: '크로커다일(특강)', rawcode: 'h05F', Check: 1 },
        { rank: '제한됨', name: '크로커다일', rawcode: 'h05F', Check: 0 },
    ];
    applyLinkedCounts({ kind: 'live-observer', units: [
        { typeId: 'H09G', count: 1, playerId: 0 }, { typeId: 'h05F', count: 1, playerId: 0 },
    ] }, '1', units);
    assert.deepEqual(units.map(unit => unit.Check), [0, 1, 0, 1]);
});
