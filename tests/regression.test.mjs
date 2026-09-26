import test, { beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { Var } from '../Various.js';
import * as Unit from '../Unit.js';
import { UnitTotalStun } from '../function.js';
import { getSlowUnits } from '../main/slow-units.js';
import { refreshStunTable } from '../main/stun-table.js';
import { CheckEvent } from '../main/buff-events.js';
import { Collect } from '../main/buff-sync.js';
import { ClearAll } from '../main/clear-all.js';
import { parseStatValue } from '../main/stat-control.js';
import { renderManaTiming } from '../overlays/mana-timing.js';
import { renderStunCalculator } from '../overlays/stun-calculator.js';

class Element {
    constructor() { this.style = {}; this.children = []; this.events = {}; this.value = ''; this.innerText = ''; this.parentElement = { classList: { toggle() {} } }; }
    appendChild(child) { this.children.push(child); }
    addEventListener(type, fn) { this.events[type] = fn; }
    setAttribute() {}
    querySelectorAll() { return []; }
    remove() {}
}
let nodes;
const defaults = structuredClone(Var);
beforeEach(() => {
    Object.assign(Var, structuredClone(defaults));
    for (const u of [...Unit.allUnits, ...Object.values(Unit.unitStat).flat()]) u.Check = 0;
    nodes = new Map();
    globalThis.document = {
        getElementById(id) { if (['container1', 'container2', 'overlay'].includes(id)) return null; if (!nodes.has(id)) nodes.set(id, new Element()); return nodes.get(id); },
        getElementsByClassName() { return [new Element()]; },
        querySelectorAll() { return []; },
        createElement() { return new Element(); },
    };
    globalThis.ButtonColor = () => {};
    UnitTotalStun();
});

test('all unit calculations are numeric without browser globals', () => {
    for (const u of Object.values(Unit.unitStat).flat()) assert(Number.isFinite(u.StunCalCulate), u.rank + u.name);
    assert.equal(globalThis.time0, undefined);
});

test('slow sorting never mutates buff indexes and keeps zero-rate effects', () => {
    const original = Unit.allUnits.slice();
    Var.nameSort = 0; Var.rateSort = -1;
    const result = getSlowUnits();
    assert.deepEqual(Unit.allUnits, original);
    assert(result.every(u => u.slow1.type !== 'none' || u.slow2.type !== 'none'));
    assert(result.every((u, i) => i === 0 || Unit.unitRates[result[i - 1].rank] >= Unit.unitRates[u.rank]));
    result[0].SlowCalculate = 0;
    assert(getSlowUnits().includes(result[0]));
});

test('deviation mode preserves selected counts and total stun', () => {
    for (const name of ['샹크스', '키드']) Unit.allUnits.find(u => u.rank === '초월함' && u.name === name).Check = 2;
    refreshStunTable();
    const total = Var.totalStun;
    Var.deviationToggle = true;
    refreshStunTable();
    assert.equal(Var.totalStun, total);
    for (const name of ['샹크스', '키드']) {
        const pos = Unit.findUnitPos('초월함', name);
        assert.equal(nodes.get(`c-${pos.sortCount}-${pos.unitCount}`).innerText, 2);
    }
});

test('buff groups preserve lower-tier checks when activating higher tier', () => {
    const change = (name, rank, checked) => {
        const u = Unit.allUnits.find(u => u.name === name && u.rank === rank);
        const el = new Element(); CheckEvent(el, u, Unit.allUnits.indexOf(u));
        el.events.change({ target: { checked } });
    };
    change('우타의 헤드셋', '아이템', true);
    assert.equal(Var.speedBonusEx, 12);
    change('우타', '영원한', true);
    assert.equal(Var.speedBonusEx, 27);
    assert.equal(Unit.allUnits.find(u => u.name === '우타의 헤드셋').Check, 1);
    change('우타', '영원한', false);
    assert.equal(Var.speedBonusEx, 12);
});

test('checkbox sync tolerates missing controls and updates every copy', () => {
    const boxes = [{ checked: false }, { checked: false }, { checked: false }];
    document.getElementsByClassName = name => name === 's0' ? boxes : [];
    Collect({ Check: 2 }, 0);
    assert(boxes.every(box => box.checked));
});

test('stat parser rejects invalid numbers and accepts numeric zero', () => {
    for (const value of ['-1', 'Infinity', 'abc']) assert.equal(parseStatValue(value), null);
    assert.equal(parseStatValue('1.5', true), null);
    assert.equal(parseStatValue(''), 0);
    assert.equal(parseStatValue('12.5'), 12.5);
});

test('mana calculator works with Franky and Enel selected, without checkbox DOM', () => {
    for (const name of ['프랑키', '에넬']) Unit.allUnits.find(u => u.name === name).Check = 1;
    Var.dex = 30; Var.intel = 20;
    const list = new Element(); renderManaTiming({ itemList: list });
    assert.equal(list.children.length, Unit.Mana.length);
    for (const row of list.children) assert(!/NaN|undefined/.test(row.children[1].innerText));
});

test('stun calculator accepts zero speed bonus and compares durations numerically', () => {
    const content = new Element(); renderStunCalculator({ overlayContent: content });
    for (const [id, value] of Object.entries({attack_speed:'1',attack_speed_bonus:'0',stun1_prob:'10',stun1_duration:'10',stun2_prob:'20',stun2_duration:'2'})) document.getElementById(id).value = value;
    globalThis.alert = message => { throw Error(message); };
    content.children.at(-1).events.click();
    assert.equal(content.children.length, 14);
    assert(content.children.some(el => String(el.innerText).includes('총 스턴')));
    assert(content.children.every(el => !/NaN/.test(el.innerText)));
});

test('full reset clears input state, range list and unit selections repeatedly', () => {
    Object.assign(Var, { koby: 9, dex: 50, intel: 20, mana: false, deviationToggle: true, Sort: [[1, 2, 3]], speedBonusEx: 30 });
    Unit.allUnits[0].Check = 3;
    ClearAll(); ClearAll();
    for (const key of ['koby','dex','intel','speedBonusEx','speedDebuff','manaRegen','healthRegen','totalStun']) assert.equal(Var[key], 0);
    assert.deepEqual(Var.Sort, []);
    assert.equal(Var.mana, true);
    assert.equal(Var.deviationToggle, false);
    assert(Unit.allUnits.every(u => u.Check === 0));
});

test('range summary only contains selected finite ranges', async () => {
    const { CountOn } = await import('../main/refresh.js');
    const unit = Unit.allUnits.find(u => u.name === '바제스' && u.rank === '희귀함');
    unit.Check = 2;
    Var.Sort.push([1, 0, undefined], [1, 0, 0]);
    CountOn();
    assert.equal(Var.Sort.length, 1);
    assert.equal(Var.Sort[0][2], 500);
    unit.Check = 0;
    CountOn();
    assert.deepEqual(Var.Sort, []);
});
