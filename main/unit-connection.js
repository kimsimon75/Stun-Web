import { Unit, Var, Func } from '../import.js';
import { CountOn } from './refresh.js';
import { Collect } from './buff-sync.js';
import { traitBuffTotals } from './trait-counts.js';
import { linkedRows, applyLinkedCounts } from './linked-unit-counts.js';

export function initializeUnitConnection() {
    const panel=document.createElement('section');
    panel.className='unit-connection';
    panel.setAttribute('aria-labelledby','unit-link-title');
    panel.innerHTML=`<div class="section-heading"><div><span class="section-index">LIVE</span><h2 id="unit-link-title">게임 유닛 연동</h2></div></div>
    <p>EXE 옆 <strong>web-read-token.txt</strong>의 연결 코드를 입력하세요. 게임 중 공유 메모리에서 읽은 현재 보유 유닛을 플레이어별로 집계합니다. 플레이어를 선택하면 해당 수량으로 계산기를 갱신합니다. 아이템·연구소·항법은 수동 입력을 유지합니다.</p>
    <form class="unit-link-form"><label for="unit-read-token">조회용 연결 코드</label><input id="unit-read-token" type="password" autocomplete="off" spellcheck="false" required pattern="[a-f0-9]{64}" placeholder="조회용 코드 64자리"><button type="submit">연결</button><button type="button" data-disconnect>연결 해제</button></form>
    <p data-status role="status" aria-live="polite">연결 대기</p><p data-summary></p>
    <label>기록의 플레이어 <select data-player><option value="all">전체</option></select></label>
    <div class="unit-link-scroll"><table><thead><tr><th>플레이어</th><th>유닛</th><th>관측 개체 수</th><th>마지막 관측</th></tr></thead><tbody></tbody></table></div>`;
    document.querySelector('.workspace').before(panel);
    const form=panel.querySelector('form'),input=panel.querySelector('input'),status=panel.querySelector('[data-status]'),summary=panel.querySelector('[data-summary]'),filter=panel.querySelector('select'),body=panel.querySelector('tbody');
    let timer,controller,epoch=0,token='',latest=null;
    function applyCounts(){
        const before=traitBuffTotals(Unit.allUnits,Unit.Rate);
        if(!applyLinkedCounts(latest,filter.value,Unit.allUnits))return;
        const after=traitBuffTotals(Unit.allUnits,Unit.Rate);
        for(const [stat,key] of [['speedBonusEx','atkSpeedBuff'],['manaRegen','manaRegen'],['healthRegen','healthRegen'],['speedDebuff','slow']])Var[stat]+=after[key]-before[key];
        Unit.allUnits.forEach((u,index)=>{const original=Unit.findUnit(u.rank,u.name);if(original)original.Check=u.Check;Collect(u,index);});
        Func.UnitTotalStun();CountOn();
    }
    const clock=ms=>`${Math.floor(ms/60000)}:${String(Math.floor(ms%60000/1000)).padStart(2,'0')}`;
    function render() {
        body.replaceChildren();
        if(!latest)return;
        applyCounts();
        const replay=latest.kind==='replay-observations',live=latest.kind==='live-observer';
        const rows=linkedRows(latest,Unit.allUnits,filter.value);
        for(const unit of rows) {
            const player=replay?unit.observerPlayerId:unit.playerId+1;
            if(filter.value!=='all'&&String(player)!==filter.value)continue;
            const row=document.createElement('tr');
            for(const value of [player,unit.name,unit.count,replay?clock(unit.lastSeenMs):'—']){
                const cell=document.createElement('td');cell.textContent=String(value);row.append(cell);
            }
            body.append(row);
        }
        summary.textContent=`ORDR ${latest.mapVersion} · 계산기 대상 ${rows.reduce((n,u)=>n+u.count,0)}개${replay?' · 리플레이 '+clock(latest.replayTimeMs)+' · 현재 보유량이 아닌 관측 이력':live?' · 게임 '+clock(latest.gameTimeMs)+' · 실시간 현재 보유량':''} · ${filter.value==='all'?'플레이어를 선택하면 계산기에 반영됩니다.':'플레이어 '+filter.value+' 수량 반영 중'}`;
    }
    function stop() {epoch++;clearTimeout(timer);controller?.abort();token='';}
    async function poll(id) {
        const activeController=new AbortController();controller=activeController;const timeout=setTimeout(()=>activeController.abort(),8000);
        try {
            const response=await fetch('/.netlify/functions/unit-snapshots',{headers:{authorization:`Bearer ${token}`},cache:'no-store',signal:activeController.signal});
            if(id!==epoch)return;
            if(response.status===401){stop();status.textContent='연결 코드가 맞지 않습니다. 쓰기 토큰이 아닌 web-read-token.txt 내용을 확인하세요.';return;}
            if(!response.ok)throw new Error(response.status===503?'Netlify 서버의 토큰 설정이 필요합니다.':`수신 오류 (${response.status}). 함수 배포 상태를 확인하세요.`);
            const data=await response.json();
            if(id!==epoch)return;
            if(!Array.isArray(data.units))throw new Error('올바른 유닛 응답이 아닙니다.');
            latest=data;
            const replay=data.kind==='replay-observations',selected=filter.value;
            filter.replaceChildren(new Option('전체','all'));
            const available=[...new Set(linkedRows(data,Unit.allUnits).map(u=>replay?u.observerPlayerId:u.playerId+1))].sort((a,b)=>a-b);
            for(const player of available)filter.add(new Option(String(player),String(player)));
            if([...filter.options].some(o=>o.value===selected))filter.value=selected;
            else if(data.kind==='live-observer'&&available.length===1)filter.value=String(available[0]);
            const age=data.receivedAt?Math.max(0,Math.floor((Date.now()-Date.parse(data.receivedAt))/1000)):null;
            status.textContent=age===null?'연결됨 · 아직 EXE에서 받은 데이터가 없습니다.':`연결됨 · 마지막 수신 ${age}초 전${age>30?' · 새 기록을 기다리는 중':''}`;
            summary.textContent=replay?`ORDR ${data.mapVersion} · 리플레이 ${clock(data.replayTimeMs)} · 관측 개체 ${data.total} · 조합 시도 ${data.combinationAttempts}회. 플레이어는 선택 명령을 낸 사람이며 소유자를 뜻하지 않습니다.`:data.kind==='live-observer'?`ORDR ${data.mapVersion} · 게임 ${clock(data.gameTimeMs)} · 현재 보유 유닛 ${data.total}개`:data.receivedAt?`기존 수정맵 수집 데이터 · ${data.total}개` : '';
            render();
        } catch(error){if(id===epoch)status.textContent=error.name==='AbortError'?'응답 지연 · 다시 연결합니다.':error.message;}
        finally{clearTimeout(timeout);if(id===epoch)timer=setTimeout(()=>poll(id),5000);}
    }
    form.addEventListener('submit',event=>{event.preventDefault();const value=input.value.trim();if(!/^[a-f0-9]{64}$/.test(value))return;stop();token=value;input.value='';status.textContent='연결 중…';poll(epoch);});
    panel.querySelector('[data-disconnect]').addEventListener('click',()=>{stop();input.value='';latest=null;body.replaceChildren();summary.textContent='';status.textContent='연결 해제됨';});
    filter.addEventListener('change',render);
    window.addEventListener('pagehide',stop);
}
