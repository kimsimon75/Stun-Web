import test, { beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { Var } from '../Various.js';
import * as Unit from '../Unit.js';
import { UnitTotalStun, StunCalCulator } from '../function.js';
import { getSlowUnits } from '../main/slow-units.js';
import { refreshStunTable } from '../main/stun-table.js';
import { CheckEvent } from '../main/buff-events.js';
import { Collect } from '../main/buff-sync.js';
import { ClearAll } from '../main/clear-all.js';
import { parseStatValue } from '../main/stat-control.js';
import { renderManaTiming } from '../overlays/mana-timing.js';
import { renderStunCalculator } from '../overlays/stun-calculator.js';
import { renderUnitDetail } from '../overlays/unit-detail.js';
import { applyFiveElderPercentDamageEffect } from '../units/five-elders-effects.js';

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

test('stun uptime matches a direct sum of geometric attack intervals', () => {
    for (const [interval, chance, duration, recovery] of [
        [0.97 / 2.3, 0.11, 0.9, 0.855], // 죠즈 기본 공속
        [0.97 / 5, 0.11, 0.9, 0.855], // 죠즈 공속 상한
        [0.2, 0.3, 1.4, 0.5], // 여러 공격에 걸쳐 기절이 겹치는 경우
        [0.3, 0.1, 0.9, 0.3], // 정지 시간이 없는 일반 확률형
    ]) {
        let probability = chance;
        let stunnedTime = 0;
        let elapsedTime = 0;
        for (let misses = 0; misses < 1000; misses++) {
            const gap = recovery + misses * interval;
            stunnedTime += probability * Math.min(duration, gap);
            elapsedTime += probability * gap;
            probability *= 1 - chance;
        }
        const actual = StunCalCulator(interval, chance, duration, recovery);
        assert(Math.abs(actual - stunnedTime / elapsedTime) < 1e-12);
    }
});

test('all unit calculations are numeric without browser globals', () => {
    for (const u of Object.values(Unit.unitStat).flat()) assert(Number.isFinite(u.StunCalCulate), u.rank + u.name);
    assert.equal(globalThis.time0, undefined);
});

test('York totals combine shotgun and rocket only when mana is enabled', () => {
    const u = Unit.unitStat['초월함'].find(u => u.name === '요크(베가펑크)');
    Var.mana = false;
    UnitTotalStun();
    const shotgun = u.StunCalCulate;
    assert(shotgun > 0 && Number.isFinite(shotgun));
    Var.mana = true;
    Var.intel = 10;
    UnitTotalStun();
    const combined = u.StunCalCulate;
    assert(Number.isFinite(combined) && combined > shotgun);
    Var.mana = false;
    UnitTotalStun();
    assert.equal(u.StunCalCulate, shotgun);
    Var.mana = true;
    const original = u.manaDuration;
    try {
        u.manaDuration = 0;
        UnitTotalStun();
        assert.equal(u.StunCalCulate, shotgun);
    } finally {
        u.manaDuration = original;
        UnitTotalStun();
    }
    assert.equal(u.StunCalCulate, combined);
    const itemList = new Element();
    renderUnitDetail({ itemList, ...Unit.findUnitPos('초월함', u.name), u });
    const text = itemList.children.map(item => item.innerText).join('\n');
    assert.match(text, /샷건 발동 확률 : 10.00%/);
    assert.match(text, /로켓 필요 마나 : 100/);
    assert.match(text, /로켓 마나 스턴 수치 \(별도\) : \d/);
    assert(!text.includes('NaN'));
});

test('Laboon calculation follows the catalog stun duration', () => {
    const unit = Unit.unitStat['전설적인'].find(u => u.name === '라분');
    const original = unit.stun1.dur;
    try {
        unit.stun1.dur = 1;
        UnitTotalStun();
        const shortStun = unit.StunCalCulate;
        unit.stun1.dur = 2.25;
        UnitTotalStun();
        assert(unit.StunCalCulate > shortStun);
        assert(Number.isFinite(unit.StunCalCulate));
    } finally {
        unit.stun1.dur = original;
        UnitTotalStun();
    }
    const itemList = new Element();
    renderUnitDetail({ itemList, ...Unit.findUnitPos('전설적인', '라분'), u: unit });
    const text = itemList.children.map(item => item.innerText).join('\n');
    assert.match(text, /7타는 확정 스턴/);
    assert.match(text, /스턴 1 편차 \(10초\) : ±\d+\.\d{2}%/);
    assert(!text.includes('NaN'));
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
    const pos = Unit.findUnitPos('초월함', '샹크스');
    const display = nodes.get(`r-${pos.sortCount}-${pos.unitCount}`);
    assert.match(display.innerText, /^±\d+\.\d{2}%$/);
    assert.match(display.title, /10초.*표준편차/);
    Var.deviationToggle = false;
    refreshStunTable();
    assert.match(display.innerText, /스턴$/);
    assert.equal(display.title, '');
});

test('buff groups preserve lower-tier checks when activating higher tier', () => {
    const change = (name, rank, checked) => {
        const u = Unit.allUnits.find(u => u.name === name && u.rank === rank);
        const el = new Element(); CheckEvent(el, u, Unit.allUnits.indexOf(u));
        el.events.change({ target: { checked } });
    };
    const uta = Unit.unitStat['영원한'].find(u => u.name === '우타');
    const utaWithoutHeadset = uta.StunCalCulate;
    change('우타의 헤드셋', '아이템', true);
    assert.equal(Var.speedBonusEx, 12);
    assert.equal(uta.StunCalCulate, utaWithoutHeadset, '헤드셋만 선택해도 우타의 스턴 가중치는 늘지 않아야 합니다.');
    change('우타', '영원한', true);
    assert.equal(Var.speedBonusEx, 27);
    assert.equal(Unit.allUnits.find(u => u.name === '우타의 헤드셋').Check, 1);
    UnitTotalStun();
    const interval = uta.attackCycle / Math.min(5, 1 + uta.atkSpeedBonus + 0.27);
    const expected = Math.log(1 - StunCalCulator(interval, uta.stun1.p, uta.stun1.dur, interval)) / Math.log(Var.StunCalCulation);
    assert(Math.abs(uta.StunCalCulate - expected) < 1e-12, '헤드셋 12%가 우타 자신의 스턴 가중치에 섞이면 안 됩니다.');
    change('우타', '영원한', false);
    assert.equal(Var.speedBonusEx, 12);
});

test('eternal Buggy receives external attack speed buffs without applying his own aura to himself', () => {
    const change = (name, rank, checked) => {
        const u = Unit.allUnits.find(u => u.name === name && u.rank === rank);
        const el = new Element(); CheckEvent(el, u, Unit.allUnits.indexOf(u));
        el.events.change({ target: { checked } });
    };
    const buggy = Unit.unitStat['영원한'].find(u => u.name === '버기');
    const baseStun = buggy.StunCalCulate;

    change('버기', '영원한', true);
    assert.equal(buggy.StunCalCulate, baseStun, '버기의 65% 팀 버프는 자신에게 적용되지 않아야 합니다.');

    change('가죽장갑', '아이템', true);
    assert(buggy.StunCalCulate > baseStun, '외부 공속 버프는 버기의 스턴 가중치를 높여야 합니다.');
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

test('Five Elders affect only their intended percent-damage types by difficulty', () => {
    const warcury = Unit.allUnits.find(u => u.name === '워큐리' && u.rank === '오로성');
    const saturn = Unit.allUnits.find(u => u.name === '새턴' && u.rank === '오로성');
    const apply = (elder, damageType, damageMultiplier, difficulty) => applyFiveElderPercentDamageEffect({
        elder, damageType, damageMultiplier, difficulty,
    });

    assert(Math.abs(apply(null, '마법', 0.8, 'nightmare') - 0.72) < 1e-12);
    assert(Math.abs(apply(null, '마법', 0.8, 'god') - 0.76) < 1e-12);
    assert(Math.abs(apply(warcury, '마법', 0.8, 'nightmare') - 0.64) < 1e-12);
    assert(Math.abs(apply(warcury, '마법', 0.8, 'god') - 0.704) < 1e-12);
    assert.equal(apply(warcury, '관통', 0.9, 'nightmare'), 0.9);
    assert(Math.abs(apply(saturn, '관통', 0.9, 'nightmare') - 0.81) < 1e-12);
    assert(Math.abs(apply(saturn, '관통', 0.9, 'god') - 0.837) < 1e-12);
    assert(Math.abs(apply(saturn, '마법', 0.8, 'nightmare') - 0.72) < 1e-12);
});
