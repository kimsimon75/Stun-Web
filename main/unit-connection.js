export function initializeUnitConnection() {
    const panel=document.createElement('section');
    panel.className='unit-connection';
    panel.setAttribute('aria-labelledby','unit-link-title');
    panel.innerHTML=`<div class="section-heading"><div><span class="section-index">LIVE</span><h2 id="unit-link-title">게임 유닛 연동</h2></div></div>
    <p>EXE 옆 <strong>web-read-token.txt</strong>의 연결 코드를 입력하세요. 관측 이력은 현재 보유 패와 다를 수 있어 계산기에 자동 적용하지 않습니다.</p>
    <form class="unit-link-form"><label for="unit-read-token">조회용 연결 코드</label><input id="unit-read-token" type="password" autocomplete="off" spellcheck="false" required pattern="[a-f0-9]{64}" placeholder="조회용 코드 64자리"><button type="submit">연결</button><button type="button" data-disconnect>연결 해제</button></form>
    <p data-status role="status" aria-live="polite">연결 대기</p><p data-summary></p>
    <label>기록의 플레이어 <select data-player><option value="all">전체</option></select></label>
    <div class="unit-link-scroll"><table><thead><tr><th>플레이어</th><th>유닛</th><th>관측 개체 수</th><th>마지막 관측</th></tr></thead><tbody></tbody></table></div>`;
    document.querySelector('.workspace').before(panel);
    const form=panel.querySelector('form'),input=panel.querySelector('input'),status=panel.querySelector('[data-status]'),summary=panel.querySelector('[data-summary]'),filter=panel.querySelector('select'),body=panel.querySelector('tbody');
    let timer,controller,epoch=0,token='',latest=null;
    const clock=ms=>`${Math.floor(ms/60000)}:${String(Math.floor(ms%60000/1000)).padStart(2,'0')}`;
    function render() {
        body.replaceChildren();
        if(!latest)return;
        const replay=latest.kind==='replay-observations';
        for(const unit of latest.units) {
            const player=replay?unit.observerPlayerId:unit.playerId+1;
            if(filter.value!=='all'&&String(player)!==filter.value)continue;
            const row=document.createElement('tr');
            for(const value of [player,unit.name,unit.count,replay?clock(unit.lastSeenMs):'—']){
                const cell=document.createElement('td');cell.textContent=String(value);row.append(cell);
            }
            body.append(row);
        }
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
            for(const player of [...new Set(data.units.map(u=>replay?u.observerPlayerId:u.playerId+1))].sort((a,b)=>a-b))filter.add(new Option(String(player),String(player)));
            if([...filter.options].some(o=>o.value===selected))filter.value=selected;
            const age=data.receivedAt?Math.max(0,Math.floor((Date.now()-Date.parse(data.receivedAt))/1000)):null;
            status.textContent=age===null?'연결됨 · 아직 EXE에서 받은 데이터가 없습니다.':`연결됨 · 마지막 수신 ${age}초 전${age>30?' · 새 기록을 기다리는 중':''}`;
            summary.textContent=replay?`ORDR ${data.mapVersion} · 리플레이 ${clock(data.replayTimeMs)} · 관측 개체 ${data.total} · 조합 시도 ${data.combinationAttempts}회. 플레이어는 선택 명령을 낸 사람이며 소유자를 뜻하지 않습니다.`:data.receivedAt?`기존 수정맵 수집 데이터 · ${data.total}개` : '';
            render();
        } catch(error){if(id===epoch)status.textContent=error.name==='AbortError'?'응답 지연 · 다시 연결합니다.':error.message;}
        finally{clearTimeout(timeout);if(id===epoch)timer=setTimeout(()=>poll(id),5000);}
    }
    form.addEventListener('submit',event=>{event.preventDefault();const value=input.value.trim();if(!/^[a-f0-9]{64}$/.test(value))return;stop();token=value;input.value='';status.textContent='연결 중…';poll(epoch);});
    panel.querySelector('[data-disconnect]').addEventListener('click',()=>{stop();input.value='';latest=null;body.replaceChildren();summary.textContent='';status.textContent='연결 해제됨';});
    filter.addEventListener('change',render);
    window.addEventListener('pagehide',stop);
}
