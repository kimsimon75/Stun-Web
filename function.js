import {Var, Unit} from "./import.js";

export const SetElemental = function(){
    document.getElementsByClassName("TotalStun")[0].innerText = Var.totalStun.toFixed(3) + "스턴";
    document.getElementsByClassName("MRegen")[0].innerText = Var.manaRegen;
    document.getElementsByClassName("HRegen")[0].innerText = Var.healthRegen;
    document.getElementsByClassName("AttackSpeedEx")[0].innerText = Var.speedBonusEx + "%";
    document.getElementsByClassName("Debuff")[0].innerText = Var.speedDebuff + "%";
}

export function RoundX(x, n) {
    if (typeof n !== "number" || n <= 0 || !Number.isInteger(n)) {
        console.warn("❌ RoundX 경고: n이 잘못됐습니다. 기본값 3으로 처리합니다.");
        n = 3;
    }
    return Math.round(x * Math.pow(10, n)) / Math.pow(10, n);
}

export function Brave(koby){
    let t = 1 / 0.57 * Math.min(RoundX(1 + 2.95 + Var.speedBonusEx / 100, 3) / 1000, 5);
    let core = (115 - koby * 5) / (t + Var.manaRegen);
    if(core < koby*5)
        return 1;
    else 
        return (koby * 5 / core);
}



export function StunCalCulator(T,X,S,L,luffy = 0)
    {
        if(T==0 || X==0 || S==0 || L==0)
            return 0;

        if(luffy == 0)
        {
        const n = Math.floor((S - L)/T) + 1;
        const stun_duration = (L-T) * X * ( 1 - Math.pow(1 - X, n) ) + T / X * (1 - (n * X + 1) * Math.pow(1 - X, n)) + S *  Math.pow(1-X,n);
        const total_duration = L-T + T / X;
    
        return stun_duration / total_duration;
        }
        else
        {
            const n = Math.floor(S / T);
            const delay_n = Math.ceil(luffy / T);
            const delay_T = T * delay_n;
            const realN = n - delay_n;

            const stun_duration = T / X * (1 - (realN * X + 1) * Math.pow(1 - X, realN)) + (S - delay_T) *  Math.pow(1-X,realN) + delay_T;
            const total_duration = T / X + delay_T;
            return stun_duration / total_duration;
        }
    }



export function lowSpeed(sortCount, unitCount, AfterShock) {
    let Rate = 0;
    let x = 0;
    let s = 0;

    // 1. t 계산
    
    const u = Unit.getUnit(sortCount, unitCount);
    if(u.slow1.type == "none" && u.slow2.type == "none") return;

    if((AfterShock == 0 && u.slow1.type == "none") || (AfterShock == 1 && u.slow2.type == "none")) return;

    const slowIndex = Unit.allUnits.findIndex(item => item.rank == Unit.idxToRank(sortCount) && item.name == u.name);
    const slowU = Unit.allUnits[slowIndex]
    let t = 1 / u.attackCycle * Math.min(RoundX(1 + slowU.atkSpeedBonus + (Var.speedBonusEx + Var.dex) / 100,3), 5);


    if(slowU.rank == "희귀함"
        || slowU.rank == "전설적인" 
        || slowU.rank == "히든" 
        || slowU.rank == "왜곡됨"
        || slowU.rank == "특별함")
    {
        const royal = Unit.allUnits.find(items => items.rank == "항법" && items.name == "로얄로더");
        if(royal.Check)
        {
            t = 1 / slowU.attackCycle * Math.min(RoundX(1 + slowU.atkSpeedBonus + (Var.speedBonusEx - royal.atkSpeedBuff) / 100,3), 5);
        }
    }    
    // 2. AfterShock가 0일 때 계산
    if (AfterShock == 0) {
        x = slowU.slow1.p; // 발이감 확률
        s = slowU.slow1.dur; // 발이감 지속시간

    }
    else {
        if (slowU.name == "료쿠규" && slowU.rank == "초월함") {
            x = RoundX(1 - RoundX(1 - 0.05, 2) * RoundX(1 - 0.12, 2),3);
        }
        else if (slowU.name == "아카이누" && slowU.rank == "초월함")
        {
            x = RoundX(1 - RoundX(1 - 0.075, 3) * RoundX(1 - 0.1, 1), 4);
        }
        else
            x = slowU.slow2.p;
        s = slowU.slow2.dur;

    }
    let n = Math.floor(s * t);

    if (slowU.name == "나미" && slowU.rank == "초월함" && AfterShock==1)
        Rate = 1 - (1 - 3 / 3.5) * -(x * s * t - n * x - 1) * Math.pow(RoundX(1 - x,4), n);
    else if (slowU.name == "요우무" && slowU.rank == "신비함" && AfterShock==1)
    {
        let spec = 25 / (200 / (1 + t + Var.healthRegen));

        spec = spec > 1 ? 1 : spec;

        Rate = (1- Math.pow( - (x * s * t - n * x - 1) * Math.pow(RoundX(1 - x,4), n), 2)) * spec + (1 + (x * s * t - n * x - 1) * Math.pow(RoundX(1 - x,4), n)) * (1 - spec);
    }
    else
        Rate = 1 + (x * s * t - n * x - 1) * Math.pow(RoundX(1-x,4), n);

    if(x === 0 || s === 0)
        return 0;

    if(AfterShock) slowU.EarthCalculate = Rate;
    else slowU.SlowCalculate = Rate;
    return Rate;
}

 export function UnitTotalStun() {
    
        Var.speedBonusEx = RoundX(Var.speedBonusEx, 3);
        Var.manaRegen    = RoundX(Var.manaRegen, 3);
        Var.healthRegen  = RoundX(Var.healthRegen, 3);
        Var.speedDebuff  = RoundX(Var.speedDebuff, 3);
    
    
    
        for (let sortCount = 0; sortCount < Object.keys(Unit.unitStat).length; sortCount++)
        {
            for (let unitCount = 0; unitCount < Unit.unitStat[Unit.idxToRank(sortCount)].length; unitCount++)
            {
                lowSpeed(sortCount, unitCount, 0);
                lowSpeed(sortCount, unitCount, 1);
                const u = Unit.getUnit(sortCount, unitCount);
                if (!u) {
                console.error("u가 null/undefined임", u);
                return;
                }
    
                const stun1 = u.stun1 ?? STUN.none(); 
                if(u.stun1.type == "none" && u.manaRange == 0){
                    continue;
                }
                let x1 = 0;
                let cooldown = 0;
                if(u.stun1.type == "chance")
                    x1 = u.stun1.p;
                else if(u.stun1.type == "cooldown")
                    cooldown = u.stun1.cd;
    
                let x2 = (1 - u.stun1.p) * (u.stun2.type != "none" ? u.stun2.p : 0);
                let s1 = u.stun1.dur;
                let s2 = u.stun2.type != "none" ? u.stun2.dur : 0;
                let CheckU = Unit.allUnits.find(items => items.rank === u.rank && items.name === u.name);
    
                let unitSpeedBonusEx = RoundX(u.atkSpeedBonus + RoundX((CheckU.Check ? (Var.speedBonusEx - u.atkSpeedBuff) : Var.speedBonusEx) / 100, 3), 3);
    
                const uta = Unit.allUnits.find(items => items.name == "우타의 헤드셋" && items.rank == "아이템");
                
                if(u.name == "우타" && uta.Check)
                    {
                        unitSpeedBonusEx = RoundX(
                        u.atkSpeedBonus +
                            RoundX(
                            ((CheckU.Check > 0)
                            ? Var.speedBonusEx - u.atkSpeedBuff
                            : Var.speedBonusEx - (uta.atkSpeedBuff)
                            ) / 100,
                            3
                        ),
                        3
                        );
    
        
                    }
                if(Unit.idxToRank(sortCount) == "초월함" || u.name == "니카")
                    unitSpeedBonusEx = RoundX(unitSpeedBonusEx + Var.dex / 100, 3);
                let t = u.attackCycle / ((1 + unitSpeedBonusEx) > 5 ? 5 : (1 + unitSpeedBonusEx));
    
    
                if(Unit.idxToRank(sortCount)  == "희귀함"
                     || Unit.idxToRank(sortCount)  == "전설적인" 
                     || Unit.idxToRank(sortCount)  == "히든" 
                     || Unit.idxToRank(sortCount)  == "왜곡됨")
                {
                    const royal = Unit.allUnits.find(items => items.rank == "항법" && items.name == "로얄로더");
                    if(royal.Check > 0)
                    {
                        t =  u.attackCycle / (Math.min(5, 1 + unitSpeedBonusEx - RoundX(royal.atkSpeedBuff / 100, 3)));
                    }
                }           
                 
    
                let unitManaRegen = Var.manaRegen + Brave(Var.koby) + ((Unit.idxToRank(sortCount)  === "초월함" || u.name === "니카") ? Var.intel * 0.08 : 0);
                let unitHealthRegen = Var.healthRegen + Brave(Var.koby) + ((Unit.idxToRank(sortCount)  === "초월함" || u.name === "니카") ? Var.intel * 0.04 : 0);
    
                let maxMana = u.mana;
                let m_stun = u.manaDuration;
                let stun = 0;
    
                if (u.name === "라분") // 라분
                {
                    let delay = 0.39/ ((1 + unitSpeedBonusEx) > 5 ? 5 : (1 + unitSpeedBonusEx))
                    for (let k = 0; k < 7; k++) {
                        window['time' + k] = k * t + delay;
                    }
                    stun = Math.log(1 - (
                    ((0.65 + time0 > 2.15) ? 2.15 : (0.65 + time0)) * 0.27 + 
                    ((0.65 + time1 > 2.15) ? 2.15 : (0.65 + time1)) * 0.27 * (1 - 0.27) + 
                    ((0.65 + time2 > 2.15) ? 2.15 : (0.65 + time2)) * 0.27 * Math.pow(1 - 0.27, 2) + 
                    ((0.65 + time3 > 2.15) ? 2.15 : (0.65 + time3)) * 0.27 * Math.pow(1 - 0.27, 3) + 
                    ((0.65 + time4 > 2.15) ? 2.15 : (0.65 + time4)) * 0.27 * Math.pow(1 - 0.27, 4) + 
                    ((0.65 + time5 > 2.15) ? 2.15 : (0.65 + time5)) * 0.27 * Math.pow(1 - 0.27, 5) + 
                    ((0.65 + time6 > 2.15) ? 2.15 : (0.65 + time6)) * 
                    (1 - 
                        0.27 - 
                        0.27 * (1 - 0.27) - 
                        0.27 * Math.pow(1 - 0.27, 2) -
                        0.27 * Math.pow(1 - 0.27, 3) - 
                        0.27 * Math.pow(1 - 0.27, 4)- 
                        0.27 * Math.pow(1 - 0.27, 5))) / 
                        ((0.65 + time0) * 0.27 +
                        (0.65 + time1) * 0.27 * (1 - 0.27) + 
                        (0.65 + time2) * 0.27 * Math.pow(1 - 0.27, 2) + 
                        (0.65 + time3) * 0.27 * Math.pow(1 - 0.27, 3) + 
                        (0.65 + time4) * 0.27 * Math.pow(1 - 0.27, 4) + 
                        (0.65 + time5) * 0.27 * Math.pow(1 - 0.27, 5) + 
                        (0.65 + time6 ) * 
                        (1 - 
                            (0.27 + 0.27 * Math.pow(1 - 0.27, 1) + 
                        0.27 * Math.pow(1 - 0.27, 2) + 
                        0.27 * Math.pow(1 - 0.27, 3) + 
                        0.27 * Math.pow(1 - 0.27, 4) + 
                        0.27 * Math.pow(1 - 0.27, 5))))) / Math.log(Var.StunCalCulation);
                }
                else if(u.name === "죠즈")
                {
                    stun = Math.log(1 - StunCalCulator(t, x1, s1, 0.855)) / Math.log(Var.StunCalCulation);
                }
                else if(Unit.idxToRank(sortCount)  == "왜곡됨" && u.name == "블랙마리아")
                {
                    stun = Math.log(1 -RoundX(s1 / cooldown, 3)) / Math.log(Var.StunCalCulation);
                }
                else if (Unit.idxToRank(sortCount)  === '초월함' && u.name === "샹크스") // 샹크스
                {
                    stun = Math.log((1-StunCalCulator(t,x1,s1,t))* (1-StunCalCulator(t, x2, s2, t)) * (1 - 3 / 14.25) * (1 - 3 * (1.35 + unitManaRegen) / 35)) / Math.log(Var.StunCalCulation);
                }
                else if (Unit.idxToRank(sortCount)  === '초월함' && u.name === "루피")
                    {
                        x2 = 0.125;
                        s2 = 1.5;
                        if (Var.mana)
                            stun = Math.log(1 - StunCalCulator(t, x2, s2, t) * (StunCalCulator(t, x1, s1, t, 1.75)))  / Math.log(Var.StunCalCulation);
                        else
                            stun = Math.log(StunCalCulator(t, x1, 3.5, t)) / Math.log(Var.StunCalCulation);
                    }
                else if(u.name === "보니")
                {
                    let n3 = Math.ceil(2 / t);
                    let time = n3 * t;
                    stun = Math.log(StunCalCulator(t, x1, s1, t, time)) / Math.log(Var.StunCalCulation);
                }
                else if (Unit.idxToRank(sortCount)  ==='초월함' &&  u.name === "아오키지") // 아오키지
                {
                    stun = Math.log((1-StunCalCulator(t, x1, s1, t)) * (1 - 3 / (t / 0.125 * Math.pow(1 - 0.125, Math.floor(25 / (1 + t * unitManaRegen))) + 50 / (1 / t + unitManaRegen)))) / Math.log(Var.StunCalCulation);
                }
                else if(Unit.idxToRank(sortCount)  === "초월함" && u.name === "키드")
                {
                    stun = Math.log(1 - (m_stun / (maxMana / (1/ t + unitHealthRegen + 0.2)))) / Math.log(Var.StunCalCulation);
                }
                else if (u.name === "흰수염") // 흰수염
                {
                    if(Var.mana)
                        stun = Math.log((1 - StunCalCulator(t, x1, s1, 0.69)) *
                            (1 - ( m_stun / (maxMana / (1 /t + unitHealthRegen + 0.5))))) / Math.log(Var.StunCalCulation);
                    else
                        stun = Math.log(1 - StunCalCulator(t, x1, s1, 0.69)) / Math.log(Var.StunCalCulation);
                }
                else if(u.name === "흰수염(약주)")
                {
                    if(Var.mana)
                        stun = Math.log((1 - StunCalCulator(t, x1, s1, 0.49)) *
                    (1 - ( m_stun / (maxMana / (1 / t + unitHealthRegen + 0.5))))) / Math.log(Var.StunCalCulation);
                    else
                        stun = Math.log(1 - StunCalCulator(t, x1, s1, 0.49)) / Math.log(Var.StunCalCulation);
                    
                }
                else if (u.name === "크로커다일(특강)")
                {
                    if (Var.mana)
                        stun = Math.log((1-StunCalCulator(t, x1, s1, t)) * (1 - ((maxMana != 0) ? m_stun / (maxMana / (1 / t + unitHealthRegen)) : 0))) / Math.log(Var.StunCalCulation);
                    else
                        stun = Math.log((1-StunCalCulator(t, x1, s1, t)))/ Math.log(Var.StunCalCulation);
                }
                else if (u.name === "니카")
                {
                    const nikkaBuff = RoundX(unitSpeedBonusEx - 2.25 , 3);
                    let t2 =  u.attackCycle / ((1 + nikkaBuff) > 5 ? 5 : (1 + nikkaBuff));
                    let time = (4.25 + ((115 - 4.25 * (1 / t2 + unitHealthRegen + 0.25)) / (1 / t + unitHealthRegen + 0.25)) <= 4.25) ? 4.25 : (4.25 + ((115 - 4.25 * (1 /t2 + unitHealthRegen + 0.25)) / (1 / t + unitHealthRegen + 0.25)));
    
                    if (Var.mana)
                        stun = Math.log(
                            (((1-StunCalCulator(t2, 0.2, s1, t2)) * 4.25 / time + (1-StunCalCulator(t, x1, s1, t)) * (time - 4.25) / time)) * (1 - m_stun / maxMana * ((4.25 * 1 / t2 + (time - 4.25) * 1/ t) / time + unitManaRegen)))
                            / Math.log(Var.StunCalCulation);
                    else
                        stun = Math.log(((1-StunCalCulator(t2, 0.2, s1, t2)) * 4.25 / time ) + (1-StunCalCulator(t, x1, s1, t))* (time - 4.25) / time) / Math.log(Var.StunCalCulation);
                }
                else if (Var.mana)
                    stun = Math.log((1-StunCalCulator(t, x1, s1, t)) * (1-StunCalCulator(t, x2, s2, t)) * (1 - ((maxMana != 0) ? m_stun / (maxMana / (1 / t + unitManaRegen)) : 0))) / Math.log(Var.StunCalCulation);
                else
                    stun = Math.log((1-StunCalCulator(t, x1, s1, t)) * (1-StunCalCulator(t, x2, s2, t))) / Math.log(Var.StunCalCulation);
                u.StunCalCulate = stun;
            }
        }
    }
