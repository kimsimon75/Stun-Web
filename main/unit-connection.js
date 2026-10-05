import { Unit, Var, Func } from '../import.js';
import { CountOn } from './refresh.js';
import { Collect } from './buff-sync.js';
import { traitBuffTotals } from './trait-counts.js';
import { linkedRows, applyLinkedCounts } from './linked-unit-counts.js';

const tokenKey = 'stun-live-read-token';

export function initializeUnitConnection() {
    const panel = document.createElement('section');
    panel.className = 'unit-connection';
    panel.setAttribute('aria-labelledby', 'unit-link-title');
    panel.innerHTML = `<div class="section-heading"><div><span class="section-index">LIVE</span><h2 id="unit-link-title">게임 유닛 실시간 연동</h2></div><p>2초마다 현재 보유량 반영</p></div>
    <div class="unit-link-content">
      <p>StunReplayLiveLink.exe가 진행 중 리플레이에서 확인한 사용자 유닛만 표시합니다. EXE 옆 <strong>web-read-token.txt</strong>의 연결 코드를 한 번 입력하세요.</p>
      <form class="unit-link-form"><label class="sr-only" for="unit-read-token">조회용 연결 코드</label><input id="unit-read-token" type="password" autocomplete="off" spellcheck="false" required pattern="[a-f0-9]{64}" placeholder="조회용 연결 코드 64자리"><button type="submit">연결</button><button type="button" data-disconnect>해제</button></form>
      <div class="unit-link-meta"><p data-status role="status" aria-live="polite">연결 대기</p><label>플레이어 <select data-player><option value="all">선택</option></select></label></div>
      <p data-summary></p>
      <div class="unit-link-scroll"><table><thead><tr><th>플레이어</th><th>유닛</th><th>현재 수량</th></tr></thead><tbody></tbody></table></div>
    </div>`;
    document.querySelector('.workspace').before(panel);

    const form = panel.querySelector('form');
    const input = panel.querySelector('input');
    const status = panel.querySelector('[data-status]');
    const summary = panel.querySelector('[data-summary]');
    const filter = panel.querySelector('select');
    const body = panel.querySelector('tbody');
    let timer, controller, epoch = 0, token = '', latest = null;

    function applyCounts() {
        const before = traitBuffTotals(Unit.allUnits, Unit.Rate);
        if (!applyLinkedCounts(latest, filter.value, Unit.allUnits)) return;
        const after = traitBuffTotals(Unit.allUnits, Unit.Rate);
        for (const [stat, key] of [['speedBonusEx', 'atkSpeedBuff'], ['manaRegen', 'manaRegen'], ['healthRegen', 'healthRegen'], ['speedDebuff', 'slow']]) Var[stat] += after[key] - before[key];
        Unit.allUnits.forEach((unit, index) => {
            const original = Unit.findUnit(unit.rank, unit.name);
            if (original) original.Check = unit.Check;
            Collect(unit, index);
        });
        Func.UnitTotalStun();
        CountOn();
    }

    const clock = milliseconds => `${Math.floor(milliseconds / 60000)}:${String(Math.floor(milliseconds % 60000 / 1000)).padStart(2, '0')}`;

    function render() {
        body.replaceChildren();
        if (!latest) return;
        applyCounts();
        const rows = linkedRows(latest, Unit.allUnits, filter.value);
        for (const unit of rows) {
            const row = document.createElement('tr');
            for (const value of [unit.playerId + 1, unit.name, unit.count]) {
                const cell = document.createElement('td');
                cell.textContent = String(value);
                row.append(cell);
            }
            body.append(row);
        }
        const selected = filter.value === 'all' ? '플레이어를 선택하면 계산기에 반영됩니다.' : `플레이어 ${filter.value} 수량 반영 중`;
        const mode = latest.kind === 'live-replay' ? '리플레이 관측 누적' : '현재 보유량';
        summary.textContent = `ORDR ${latest.mapVersion} · 게임 ${clock(latest.gameTimeMs || 0)} · ${mode} ${rows.reduce((sum, unit) => sum + unit.count, 0)}개 · ${selected}`;
    }

    function stop() { epoch++; clearTimeout(timer); controller?.abort(); token = ''; }

    async function poll(id) {
        const activeController = new AbortController();
        controller = activeController;
        const timeout = setTimeout(() => activeController.abort(), 8000);
        try {
            const response = await fetch('/.netlify/functions/unit-snapshots', {
                headers: { authorization: `Bearer ${token}` }, cache: 'no-store', signal: activeController.signal,
            });
            if (id !== epoch) return;
            if (response.status === 401) {
                localStorage.removeItem(tokenKey);
                stop();
                status.textContent = '연결 코드가 맞지 않습니다. web-read-token.txt 내용을 확인하세요.';
                return;
            }
            if (!response.ok) throw new Error(response.status === 503 ? 'Netlify의 UNIT_BRIDGE_TOKEN 설정이 필요합니다.' : `수신 오류 (${response.status})`);
            const data = await response.json();
            if (id !== epoch || !Array.isArray(data.units) || !Array.isArray(data.players)) throw new Error('올바른 유닛 응답이 아닙니다.');
            latest = data;

            const selected = filter.value;
            filter.replaceChildren(new Option('선택', 'all'));
            for (const player of data.players) filter.add(new Option(`${player.playerId + 1} · ${player.name || '사용자'}`, String(player.playerId + 1)));
            if ([...filter.options].some(option => option.value === selected)) filter.value = selected;
            else if (data.players.length === 1) filter.value = String(data.players[0].playerId + 1);

            const age = data.receivedAt ? Math.max(0, Math.floor((Date.now() - Date.parse(data.receivedAt)) / 1000)) : null;
            status.textContent = age === null ? '연결됨 · EXE의 첫 전송을 기다립니다.' : `연결됨 · 마지막 수신 ${age}초 전${age > 10 ? ' · EXE 상태를 확인하세요.' : ''}`;
            render();
        } catch (error) {
            if (id === epoch) status.textContent = error.name === 'AbortError' ? '응답 지연 · 다시 연결합니다.' : error.message;
        } finally {
            clearTimeout(timeout);
            if (id === epoch) timer = setTimeout(() => poll(id), 2000);
        }
    }

    function connect(value) {
        if (!/^[a-f0-9]{64}$/.test(value)) return;
        stop();
        token = value;
        localStorage.setItem(tokenKey, value);
        input.value = '';
        status.textContent = '연결 중…';
        poll(epoch);
    }

    form.addEventListener('submit', event => { event.preventDefault(); connect(input.value.trim()); });
    panel.querySelector('[data-disconnect]').addEventListener('click', () => {
        stop();
        localStorage.removeItem(tokenKey);
        latest = null;
        body.replaceChildren();
        summary.textContent = '';
        status.textContent = '연결 해제됨';
        filter.replaceChildren(new Option('선택', 'all'));
    });
    filter.addEventListener('change', render);
    window.addEventListener('pagehide', stop);

    const savedToken = localStorage.getItem(tokenKey);
    if (savedToken) connect(savedToken);
}
