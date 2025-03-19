
setInterval(() => {
    if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ action: "ping" }));
        console.log("📡 Ping 메시지 전송");
    }
}, 50000); // 50초마다 Ping 전송

const unitRates = {
    특별함: ["특별함",0],
    희귀함: ["희귀함", 1],
    전설적인: ["전설적인", 2],
    히든: ["히든", 3],
    제한됨: ["제한됨", 4],
    초월함: ["초월함", 5],
    불멸의: ["불멸의", 6],
    영원함: ["영원함",7],
    신비함: ["신비함", 8],
    특수함: ["특수함", 9]
}

const unitState = [
    [["희귀함"],
    ['바제스', 1.3, 0.85, 0.1, 0.9, 0, 0, 0, 0, 0],
    ['아오키지', 1.3,0.94, 0.1, 0.95, 0, 0, 0, 0, 0],
    ['이완코브', 1.3, 0.95, 0.07, 1.4, 0, 0, 0, 0, 0],
        ['우솝', 1.3, 1, 0.1, 1.15, 0, 0, 0, 0, 0],

        ['죠즈', 1.3, 0.97, 0.11, 0.9, 0, 0, 0, 0, 0]],


    [["전설적인"],
    ['드래곤', 3, 0.77, 0.1, 2.85, 0, 0, 0, 0, 5],
    ['라분', 1.32, 1.33, 0.27, 2.15, 0, 0, 0, 0, 17],
    ['바르톨로메오', 2.95, 0.71, 0.1, 2.75, 0, 0, 0, 0, 0],
    ['샹크스', 2.95, 0.66, 0.1, 2, 0, 0, 0, 0, 0],
    ['시키', 2.95, 0.75, 0.1, 3, 0, 0, 0, 0, 0],
    ['쿠마', 2.95, 0.69, 0.1, 1.4, 0, 0, 0, 0, 0],
    ['후지토라', 2.16, 0.95, 0.14, 2.4, 0, 0, 0, 0, 0]],

    [['히든'],
    ['봉쿠레', 2.6, 0.94, 0.09, 1.55, 0, 0, 0, 0, 0],
    ['아오키지', 2.6, 0.79, 0.1, 1.35, 0, 0, 0, 0, 0],
    ['이완코브', 2.6, 0.86, 0.12, 1.8, 0, 0, 0, 0, 0],
        ['피셔타이거', 2.6, 0.49, 0.1, 2, 0, 0, 0, 0, 0],
        ['퀸', 2.6, 0.92, 0.15, 0.95, 0, 0, 0, 0, 0]],

    [['초월함'],
        ['로빈', 3.35, 0.71, 0.1, 2.85, 0, 0, 0, 0, 0],
        ['루피', 3.35, 0.38, 0.125, 1.5, 0, 0, 160, 2.15, 0],
    ['시라호시', 3.35, 0.7, 0.12, 2.35, 0, 0, 120, 3, 0],
    ['샹크스', 3.55, 0.6, 0.1, 2, 0.1, 1.8, 35, 3, 0],
    ['아오키지', 3.35, 0.69, 0.1, 2.3, 0, 0, 0, 0, 0],
    ['조로', 3.35, 0.67, 0.03, 2.5, 0, 0, 145, 3, 0],
    ['키자루', 3.35, 0.64, 0.0825, 2.75, 0, 0, 0, 0, 0],
    ['후지토라', 2.16, 0.94, 0.15, 2.6, 0.0415, 2.5, 0, 0, 0],],

    [['불멸의'],
    ['거프', 3.3, 0.63, 0.1, 2.5, 0, 0, 0, 0, 0],
    ['드래곤', 3.5, 0.61, 0.1, 3, 0, 0, 0, 0, 20],
    ['센고쿠', 3.3, 0.7, 0.1, 2.85, 0, 0, 0, 0, 0],
    ['센고쿠(특강)', 3.3, 0.7, 0.1, 2.85, 0.08, 2.5, 0, 0, 0],
    ['시키', 3.3, 0.49, 0.1, 3, 0, 0, 125, 3, 0],
    ['흰수염', 3.3, 0.73, 0.05, 3, 0, 0, 115, 3, 0],],

    [['영원함'],
    ['니카', 3.35, 0.57, 0.04, 2, 0, 0, 150, 3, 25],
    ['우타', 3.37, 0.67, 0.1, 1.5, 0, 0, 0, 0, 27],
    ['카벤딧슈', 3.15, 0.71, 0.1, 2.3, 0, 0, 0, 0, 0],
    ['핸콕', 3.3, 0.74, 0.075, 2.75, 0, 0, 175, 4, 0],
    ['핸콕(특강)', 3.3, 0.74, 0.1, 2.75, 0, 0, 175, 4, 0],],

    [['제한됨'],
    ['크로커다일', 2.85, 0.56, 0.05, 2.5, 0, 0, 0, 0, 0],
        ['크로커다일(특강)', 2.85, 0.56, 0.05, 2.5, 0, 0, 80, 1.4, 0],],

    [['신비함'],
    ['K', 3.3, 0.58, 0.03, 3, 0, 0, 0, 0, 0],
    ['고죠 사토루', 3.3, 1.01, 0.1, 2, 0, 0, 185, 5, 0],
    ['나루토', 3.05, 0.5, 0.05, 2.85, 0, 0, 0, 0, 0],
    ['미나토', 3.42, 0.73, 0.0425, 3, 0.16, 2.75, 100, 2.75, 0],
    ['타츠마키', 3.3, 0.79, 0.1425, 1.75, 0, 0, 50, 1.75, 0],]
]

const stunRange = [
    [[500, 0, 0], //바제스
        [405, 0, 0],  // 아오키지
        [500, 0, 0],  // 이완코브
        [485, 0, 0],
    [600,0,0]],  // 우솝
    [
        [500, 0, 0], //드래곤
        [575, 0, 0], //라분
        [550, 0, 0], //바르톨로메오
        [600, 0, 0], //샹크스
        [525, 0, 0], //시키
        [500, 0, 0], //쿠마
        [450, 0, 0], //후지토라
    ],

    [
        [500, 0, 0], //봉쿠레
        [415, 0, 0], //아오키지
        [500, 0, 0], //이완코브
        [515, 0, 0], //피셔타이거
        [500, 0, 0], // 퀸
    ],
    [
        [525, 0, 0], //로빈
        [500, 0, 600],//루피
        [600, 0, 800], //시라호시
        [800, 800, 1100], //샹크스
        [550, 0, 700], //아오키지
        [500, 0, 525], //조로
        [500, 0, 0], //키자루
        [475, 475, 0], //후지토라
    ],
    [
        [500, 0, 0], //거프
        [525, 0, 0], //드래곤
        [525, 0, 0], //센고쿠
        [525, 500, 0], //센고쿠(특강)
        [600, 0, 600], //시키
        [625, 0, 0], //흰수염
    ],
    [
        [500, 0, 750], // 니카
        [500, 0, 0], //우타
        [550, 0, 0], //카벤딧슈
        [650, 0, 750], //핸콕
        [650, 0, 750], //핸콕(특강)
    ],
    [
        [550, 0, 0], //크로커다일
        [550, 0, 500] //크로커다일(특강)
    ],
    [
        [460, 0, 0], //K
        [600, 0, NaN], // 고죠 사토루
        [550, 0, 0], //나루토
        [600, 525, 525], //미나토
        [525, 0, 525] , //타츠마키
    ]
]

const speedState = // 공속 보너스, 공속, 발이감 확률, 발이감 지속시간, 발이감 수치, 여진 확률, 여진 지속시간, 여진 수치
    [
        ['나미', unitRates.전설적인, 2.95, 5.985, 0, 0, 0, 0.0915, 3.25, 42],

        ['흰수염', unitRates.전설적인, 2.95, 5.338, 0.11, 3, 25, 0.11, 3, 10],

        ['방주맥심', unitRates.히든, 2.6, 5.625, 0, 0, 0, 0.125, 3, 30],

        ['검은수염', unitRates.초월함, 3.35, 7.1, 0.1, 3, 75, 0.1, 2, 15],

        ['료쿠규', unitRates.초월함, 3.35, 5.2, 0.12, 3, 25, 0.164, 3, 20],

        ['나미', unitRates.초월함, 3.55, 7.2, 0, 0, 0, 0.05, 5, 45],

        ['로우', unitRates.초월함, 3.35, 6.8, 0.125, 3, 40, 0, 0, 0],

        ['루피', unitRates.초월함, 3.35, 11.4, 0.175, 2, 33, 0, 0, 0],

        ['사보', unitRates.초월함, 2.57, 4.5, 0.1, 2, 30, 0, 0, 0],

        ['상디', unitRates.초월함, 3.35, 9.5, 0.05, 3.5, 50, 0, 0, 0],

        ['아카이누', unitRates.초월함, 3.35, 6, 0, 0, 0, 0.1675, 2, 12],

        ['징베', unitRates.초월함, 2.90, 4.4, 0.0625, 3, 50, 0, 0, 0],

        ['사토루', unitRates.신비함, 3.30, 4.257, 0, 0, 0, 0.1, 2, 20],

        ['흰수염', unitRates.불멸의, 3.30, 5.89, 0.125, 3.5, 45, 0.125, 3, 15],

        ['핸콕', unitRates.영원함, 3.30, 5.811, 0.075, 2.5, 60, 0, 0, 0],

        ['에넬', unitRates.제한됨, 2.85, 5.133, 0, 0, 0, 0.1, 4, 35],

        ['도플라밍고', unitRates.초월함, 3.35, 7, 0.2, 4, 250, 0.2, 3, 45],

        ['상디(강화)', unitRates.초월함, 4, 11.4, 0.0575, 3.5, 55, 0, 0, 0],

        ['레베카', unitRates.제한됨, 1.4, 2.727, 0.0825, 3, 50, 0, 0, 0],

        ['아카이누', unitRates.히든, 2.6, 4.8, 0, 0, 0, 0.16, 2, 10],

        ['나미', unitRates.특별함, 0.53, 1.530, 0, 0, 0, 0.1, 4, 5],

        ['요우무', unitRates.신비함, 3.30, 6.056, 0, 0, 0, 0.1, 3, 50],

        ['료쿠규', unitRates.히든, 2.60, 4.8, 0, 0, 0, 0.08, 3, 20],

        ['시키(1레벨)', unitRates.불멸의, 3.3, 8.776, 0, 0, 0, 0.03, 5, 35],

        ['시키(2레벨)', unitRates.불멸의, 3.3, 8.776, 0, 0, 0, 0.035, 5, 35],

        ['시키(3레벨)', unitRates.불멸의, 3.3, 8.776, 0, 0, 0, 0.04, 5, 35],

        ['시키(4레벨)', unitRates.불멸의, 3.3, 8.776, 0, 0, 0, 0.045, 5, 35],
    ];

const BuffState = [ // 이름, 등급, 공속, 마나, 체력, 체크
    ['아냐 포저', "신비함", 30, 1.75, 2, 0],
    ['츠바사', "랜덤", 20, 0, 0, 0],
    ['베티', "특수함", 11, 1.25, 2, 0],
    ['버기', "영원한", 65, 0, 0, 0],
    ['레일리', "불멸의", 45, 0, 0, 0],
    ['사보', "초월함", 20, 0, 0, 0],
    ['상디(강화)', "초월함", 15, 0, 0, 0],
    ['우타의 헤드셋', "초월함", 12, 0, 0, 0],
    ['징베', "초월함", 20, 3, 0, 0],
    ['쵸파', "초월함", 28, 0, 0, 0],
    ['코비', "초월함", 10, 0, 0, 0],
    ['발라티에', "히든", 22, 0, 0, 0],
    ['크래커', "전설적인", 9, 0, 0, 0],
    ['레일리', "전설적인", 20, 0, 0, 0],
    ['토키', "전설적인", 20, 0, 0, 0],
    ['브룩', "희귀함", 10, 0, 0, 0],
    ['식량 보급', '연구소', 0, 0.8, 0, 0],
    ['키쿄우', '신비함', 0, 1.5, 1.5, 0],
    ['카이조 토우마', '랜덤', 0, 0.3, 0.3, 0],
    ['요츠바', '랜덤', 0, 2.5, 0, 0],
    ['프랑키', '초월함', 0, 5, 0, 0],
    ['에넬', '제한됨', 0, 1.5, 0, 0],
    ['코알라', '히든', 0, 3.25, 0, 0],
    ['슈가', '전설적인', 0, 1.25, 0, 0],
    ['징베', '전설적인', 0, 2.5, 0, 0],
    ['슈가', '희귀함', 0, 0.6, 0, 0],
    ['해상 디너', '아이템',0, 0, 0.45, 0],
    ['불사조의 깃털', '아이템', 0, 0, 0.3, 0],
    ['마르코', '제한됨', 0, 0, 3, 0],
    ['마르코(특강)', '제한됨', 0, 0, 4, 0],
    ['카타쿠리', '제한됨', 0, 0, 2.85, 0],
    ['모비딕호', '히든', 0, 0, 1.25, 0],
    ['히루루크', '전설적인', 0, 0, 1.6, 0],
]

let unitRate = [];
let stunCount = [];
let MyArray = [];

for (var i = 0; i < 8; i++) {
    unitRate[i] = [];
    stunCount[i] = [];
}

for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 10; j++) {
        unitRate[i][j] = 0;
        stunCount[i][j] = 0;
    }
}

var speedBonus = 0;
var speedBonusEx = 0;
var mana = true;
var manaRegen = 0;
var healthRegen = 0;
var totalStun = 0;

var nameSort = 1;
var rateSort = 0;
var moveSpeedSort = 0;
var afterShockSort = 0;


const UnitTotalStun = () => {

    speedBonus = parseFloat(speedBonus.toFixed(3));
    speedBonusEx = parseFloat(speedBonusEx.toFixed(3));
    manaRegen = parseFloat(manaRegen.toFixed(3));
    healthRegen = parseFloat(healthRegen.toFixed(3));

    for (var i = 0; i < 8; i++)
    {
        for (var j = 1; j < unitState[i].length; j++)
        {
            
            var x1 = unitState[i][j][3];
            var x2 = unitState[i][j][5];
            var s1 = unitState[i][j][4];
            var s2 = unitState[i][j][6];
            let t = 1 / unitState[i][j][2] * ((1 + unitState[i][j][1] + parseFloat((((stunCount[i][j]) ? 0 : speedBonus + speedBonusEx) / 100).toFixed(3)) > 5) ? 5 : (1 + unitState[i][j][1] + parseFloat((((stunCount[i][j]) ? 0 : speedBonus + speedBonusEx) / 100).toFixed(3))));
            
            var maxMana = unitState[i][j][7];
            var m_stun = unitState[i][j][8];
            var n1 = Math.floor(s1 * t);
            var n2 = Math.floor(s2 * t);
            var stun = 0;

            if (unitState[i][j][0] === "라분") // 라분
            {
                for (var k = 0; k < 6; k++) {
                    window['time' + k] = k / t;
                }
                stun = Math.log(1 - (((0.65 + time0 > 2.15) ? 2.15 : (0.65 + time0)) * 0.27 + ((0.65 + time1 > 2.15) ? 2.15 : (0.65 + time1)) * 0.27 * (1 - 0.27) + ((0.65 + time2 > 2.15) ? 2.15 : (0.65 + time2)) * 0.27 * Math.pow(1 - 0.27, 2) + ((0.65 + time3 > 2.15) ? 2.15 : (0.65 + time3)) * 0.27 * Math.pow(1 - 0.27, 3) + ((0.65 + time4 > 2.15) ? 2.15 : (0.65 + time4)) * 0.27 * Math.pow(1 - 0.27, 4) + ((0.65 + time5 > 2.15) ? 2.15 : (0.65 + time5)) * (1 - 0.27 - 0.27 * (1 - 0.27) - 0.27 * Math.pow(1 - 0.27, 2) - 0.27 * Math.pow(1 - 0.27, 3) - 0.27 * Math.pow(1 - 0.27, 4))) / ((0.65 + time0) * 0.27 + (0.65 + time1) * 0.27 * (1 - 0.27) + (0.65 + time2) * 0.27 * Math.pow(1 - 0.27, 2) + (0.65 + time3) * 0.27 * Math.pow(1 - 0.27, 3) + (0.65 + time4) * 0.27 * Math.pow(1 - 0.27, 4) + (0.65 + time5 ) * (1 - (0.27 + 0.27 * Math.pow(1 - 0.27, 1) + 0.27 * Math.pow(1 - 0.27, 2) + 0.27 * Math.pow(1 - 0.27, 3) + 0.27 * Math.pow(1 - 0.27, 4))))) / Math.log(0.2);
            }
            else if (unitState[i][0][0] === '초월함' && unitState[i][j][0] === "샹크스") // 샹크스
            {
                stun = Math.log(-(x1 * s1 * t - n1 * x1 - 1) * Math.pow(1 - x1, n1) * -(x2 * s2 * t - n2 * x2 - 1) * Math.pow(1 - x2, n2) * (1 - 3 / 14.25) * (1 - 3 * (1.35 + manaRegen) / 35)) / Math.log(0.2);
            }
            else if (unitState[i][0][0] === '초월함' && unitState[i][j][0] === "루피")
            {
                let n3 = Math.ceil(1.75 * t);
                let time = n3 / t;
                let n4 = Math.floor((2.75 - time) * t);
                if (mana)
                    stun = Math.log((1 - ((time + 1 / t / 0.0125 * (1 - (n4 * 0.0125 + 1) * Math.pow(1 - 0.0125, n4))) / (time + 1 / t / 0.0125)) * (1 + (x1 * s1 * t - n1 * x1 - 1) * Math.pow(1 - x1, n1))) * (1 - ((maxMana != 0) ? m_stun / (maxMana / (t + manaRegen)) : 0))) / Math.log(0.2);
                else
                    stun = Math.log(1 - ((time + 1 / t / 0.0125 * (1 - (n4 * 0.0125 + 1) * Math.pow(1 - 0.0125, n4))) / (time + 1 / t / 0.0125)) * (1 + (x1 * s1 * t - n1 * x1 - 1) * Math.pow(1 - x1, n1))) / Math.log(0.2);
            }
            else if (unitState[i][0][0] ==='초월함' &&  unitState[i][j][0] === "아오키지") // 아오키지
            {
                stun = Math.log(-(x1 * s1 * t - n1 * x1 - 1) * Math.pow(1 - x1, n1) * (1 - 3 / (1 / t / 0.125 * Math.pow(1 - 0.125, Math.floor(25 / (1 + 1 / t * manaRegen))) + 50 / (t + manaRegen)))) / Math.log(0.2);
            }
            else if (unitState[i][j][0] === "흰수염") // 흰수염
            {
                if(mana)
                    stun = Math.log(-(x1 * s1 * t - n1 * x1 - 1) * Math.pow(1 - x1, n1) *
                        -(x2 * s2 * t - n2 * x2 - 1) * Math.pow(1 - x2, n2) *
                        (1 - ( m_stun / (maxMana / (t + healthRegen + 0.5))))) / Math.log(0.2);
                else
                    stun = Math.log(-(x1 * s1 * t - n1 * x1 - 1) * Math.pow(1 - x1, n1) * -(x2 * s2 * t - n2 * x2 - 1) * Math.pow(1 - x2, n2)) / Math.log(0.2);
            }
            else if (unitState[i][j][0]==="타츠마키") // 타츠마키
            {
                if(mana)
                    stun = Math.log(-(x1 * s1 * t - n1 * x1 - 1) * Math.pow(1 - x1, n1) * -(x2 * s2 * t - n2 * x2 - 1) * Math.pow(1 - x2, n2) * (1 - (m_stun / (maxMana / (t + healthRegen))))) / Math.log(0.2);
                else
                    stun = Math.log(-(x1 * s1 * t - n1 * x1 - 1) * Math.pow(1 - x1, n1) * -(x2 * s2 * t - n2 * x2 - 1) * Math.pow(1 - x2, n2)) / Math.log(0.2);
            }
            else if (unitState[i][j][0] === "크로커다일(특강)")
            {
                if (mana)
                    stun = Math.log(-(x1 * s1 * t - n1 * x1 - 1) * Math.pow(1 - x1, n1) * -(x2 * s2 * t - n2 * x2 - 1) * Math.pow(1 - x2, n2) * (1 - ((maxMana != 0) ? m_stun / (maxMana / (t + healthRegen)) : 0))) / Math.log(0.2);
                else
                    stun = Math.log(-(x1 * s1 * t - n1 * x1 - 1) * Math.pow(1 - x1, n1) * -(x2 * s2 * t - n2 * x2 - 1) * Math.pow(1 - x2, n2)) / Math.log(0.2);
            }
            else if (unitState[i][j][0] === "니카")
            {
                let t2 = 1 / unitState[i][j][2] * (((1 + unitState[i][j][1] - 2.25 + speedBonus + speedBonusEx) > 5) ? 5 : (1 + unitState[i][j][1] - 2.25 + speedBonus + speedBonusEx));
                let time = (4.25 + ((115 - 4.25 * (t2 + healthRegen + 0.25)) / (t + healthRegen + 0.25)) <= 4.25) ? 4.25 : (4.25 + ((115 - 4.25 * (t2 + healthRegen + 0.25)) / (t + healthRegen + 0.25)));
                n2 = Math.floor(s1 * t2);

                if (mana)
                    stun = Math.log(
                        ((1 - (1 + (0.18 * s1 * t2 - n2 * 0.18 - 1) * Math.pow(1 - 0.18, n2)) * 4.25 / time - (1 + (x1 * s1 * t - n1 * x1 - 1) * Math.pow(1 - x1, n1)) * (time - 4.25) / time)) * (1 - m_stun / maxMana * ((4.25 * t2 + (time - 4.25) * t) / time + manaRegen)))
                        / Math.log(0.2);
                else
                    stun = Math.log((1-(1 + (0.18 * s1 * t2 - n2 * 0.18 - 1) * Math.pow(1 - 0.18, n2)) * 4.25 / time )) / Math.log(0.2);
            }
            else if (mana)
                stun = Math.log(-(x1 * s1 * t - n1 * x1 - 1) * Math.pow(1 - x1, n1) * -(x2 * s2 * t - n2 * x2 - 1) * Math.pow(1 - x2, n2) * (1 - ((maxMana != 0) ? m_stun / (maxMana / (t + manaRegen)) : 0))) / Math.log(0.2);
            else
                stun = Math.log(-(x1 * s1 * t - n1 * x1 - 1) * Math.pow(1 - x1, n1) * -(x2 * s2 * t - n2 * x2 - 1) * Math.pow(1 - x2, n2)) / Math.log(0.2);

            unitRate[i][j] = stun;
        }
    }
}

const Unit = unitState[0].length + unitState[1].length + unitState[2].length + unitState[3].length + unitState[4].length + unitState[5].length + unitState[6].length + unitState[7].length;

let CountOn = () => {
    if (document.getElementById("container1") != null)
    {
        totalStun = 0;  
        for (var sortCount = 0; sortCount < unitState.length; sortCount++) {
        for (var unitCount = 1; unitCount < unitState[sortCount].length; unitCount++) {
            const rate = document.getElementById(`r-${sortCount}-${unitCount}`);
            rate.innerText = unitRate[sortCount][unitCount].toFixed(3) + "스턴";

            const percentage = document.getElementById(`per-${sortCount}-${unitCount}`);
            percentage.innerText = ((1 - Math.pow(0.2, unitRate[sortCount][unitCount])) * 100).toFixed(2) + "%";

            totalStun += stunCount[sortCount][unitCount] ? unitRate[sortCount][unitCount] * stunCount[sortCount][unitCount] : 0;
        }
        }
    }

    document.getElementsByClassName("TotalStun")[0].innerText = totalStun.toFixed(3) + "스턴";
    document.getElementsByClassName("MRegen")[0].innerText = manaRegen;
    document.getElementsByClassName("HRegen")[0].innerText = healthRegen;
    document.getElementsByClassName("AttackSpeedEx")[0].innerText = speedBonusEx + "%";

    if (document.getElementById("container2") != null) {
        for (var unitCount = 0; unitCount < speedState.length; unitCount++) {
            const AfterShockRate = document.getElementById(`a-${unitCount}`);
            AfterShockRate.innerText = (lowSpeed(unitCount, 1) * 100).toFixed(2) + "%";

            const MoveSpeedRate = document.getElementById(`m-${unitCount}`);
            MoveSpeedRate.innerText = (lowSpeed(unitCount, 0) * 100).toFixed(2) + "%";

            const unitName = document.getElementById(`n-${unitCount}`);
            unitName.innerText = speedState[unitCount][0];

            const unitSort = document.getElementById(`s-${unitCount}`);
            unitSort.innerText = speedState[unitCount][1][0];
        }
        for (let i = 0; i < document.getElementsByClassName("UnitNameBar").length; i++) {

            document.getElementsByClassName("UnitNameBar")[i].textContent = (nameSort == 0) ? "유닛명" : (nameSort == -1) ? "유닛명 ⬇" : "유닛명 ⬆";
            document.getElementsByClassName("UnitSortBar")[i].textContent = (rateSort == 0) ? "등급" : (rateSort == -1) ? "등급 ⬇" : "등급 ⬆";
            document.getElementsByClassName("MoveSpeedBar")[i].textContent = (moveSpeedSort == 0) ? "이감 발동률" : (moveSpeedSort == -1) ? "이감 발동률 ⬇" : "이감 발동률 ⬆";
            document.getElementsByClassName("AfterShockBar")[i].textContent = (afterShockSort == 0) ? "여진 가동률" : (afterShockSort == -1) ? "여진 가동률 ⬇" : "여진 가동률 ⬆";
        }
    }
        
}

function lowSpeed(unitcount, AfterShock) {
    var Rate = 0;
    var x = 0;
    var s = 0;
    var t = 0;

    // 1. t 계산
    var t = speedState[unitcount][3] / (1 + speedState[unitcount][2]) *
        (((1 + speedState[unitcount][2] +
            parseFloat((speedBonus / 100).toFixed(3)) +
            parseFloat((speedBonusEx / 100).toFixed(3))) > 5) ? 5 :
            (1 + speedState[unitcount][2] +
                parseFloat((speedBonus / 100).toFixed(3)) +
                parseFloat((speedBonusEx / 100).toFixed(3))));

    // 2. AfterShock가 0일 때 계산
    if (AfterShock == 0) {
        x = speedState[unitcount][4]; // 발이감 확률
        s = speedState[unitcount][5]; // 발이감 지속시간
    }
    else {
        if (speedState[unitcount][0] == "료쿠규" && speedState[unitcount][1][0] == "초월함") {
            x = (1 -
                (1 - 0.05).toFixed(2) *
                (1 - 0.12).toFixed(2)
            ).toFixed(3)
        }
        else if (speedState[unitcount][0] == "아카이누" && speedState[unitcount][1][0] == "초월함")
        {
            x = (1 -
                (1 - 0.075).toFixed(3) *
                (1 - 0.1).toFixed(1)
            ).toFixed(4)
        }
        else
            x = speedState[unitcount][7];
        s = speedState[unitcount][8];

    }
    var n = Math.floor(s * t);


    if (speedState[unitcount][0] == "나미" && speedState[unitcount][1][0] == "초월함" && AfterShock==1)
        Rate = 1 - (1 - 3 / 3.5) * -(x * s * t - n * x - 1) * Math.pow((1 - x).toFixed(3), n);
    else if (speedState[unitcount][0] == "요우무" && speedState[unitcount][1][0] == "신비함" && AfterShock==1)
    {
        let spec = 25 / (200 / (1 + t + healthRegen));

        spec = spec > 1 ? 1 : spec;

        Rate = (1- Math.pow( - (x * s * t - n * x - 1) * Math.pow((1 - x).toFixed(3), n), 2)) * spec + (1 + (x * s * t - n * x - 1) * Math.pow((1 - x).toFixed(3), n)) * (1 - spec);
    }
    else
    Rate = 1 + (x * s * t - n * x - 1) * Math.pow((1 - x).toFixed(3), n)

    return Rate;
}

function openOverlay(sortCount, unitCount) {

    
    // 1. 오버레이 div 생성
    const overlay = document.createElement("div");
    overlay.id = "overlay";
    overlay.style.position = "fixed";
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    overlay.style.zIndex = 1000;
    overlay.style.display = "flex";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";

    overlay.addEventListener("click", () => {
        document.body.removeChild(overlay);
    }) 

    // 2. 오버레이 내부의 콘텐츠 박스 div 생성
    const overlayContent = document.createElement("div");
    overlayContent.style.width = "22.5vw";
    overlayContent.style.height = "70vh";
    overlayContent.style.padding = "0.5rem";
    overlayContent.style.backgroundColor = "white";
    overlayContent.style.borderRadius = "5px";
    overlayContent.style.position = "relative";
    overlayContent.style.overflowY = "auto"; // 스크롤 가능하도록 설정

    // 3. 콘텐츠 박스 상단에 타이틀 추가
    const title = document.createElement("h2");
    title.style.textAlign = "center";
    title.style.marginBottom = "1vh";

    if (sortCount == 100 && unitCount == 100) 
        title.textContent = `${totalStun.toFixed(3)}스턴`;

    else if (sortCount == 200 && unitCount == 200)
        title.textContent = `가동률 공식`;
    else if (sortCount < 0)
        title.textContent = `${speedState[unitCount][0]} (${(speedState[unitCount][1])[0]})`;
    else
        title.textContent = `${unitState[sortCount][unitCount][0]} (${unitState[sortCount][0]})`;

    overlayContent.appendChild(title);

    // 4. 목록 추가
    const itemList = document.createElement("ul");
    itemList.style.listStyleType = "none";
    itemList.style.padding = 0;
    if (sortCount == 100 && unitCount == 100) {

        for (let i = 1; i <= 6; i++) {
            const item = document.createElement("li");
            item.textContent = `Item ${i}`;
            item.style.padding = "0.5rem 0";
            item.style.borderBottom = "0.1rem solid #ddd";

            switch (i) {
                case 1:
                    item.textContent = `스턴 가동률 : ${((1 - Math.pow(0.2, totalStun)) * 100).toFixed(2)}%`;
                    break;
                case 2:
                    item.textContent = `스턴 샐 확률 : ${(Math.pow(0.2, totalStun) * 100).toFixed(2)}%`;
                    break;
                case 3:
                    item.textContent = `초당 몹 이동 거리(풀이감 기준) : ${(70 * Math.pow(0.2, totalStun)).toFixed(2)}`;
                    break;
                case 4:
                    item.textContent = `35초 기준 몹 이동 거리(풀이감 기준) : ${(35 * 70 * Math.pow(0.2, totalStun)).toFixed(2)}`;
                    break;
                case 5:
                    item.textContent = `14초 기준 몹 이동 거리(풀이감 기준) : ${(14 * 70 * Math.pow(0.2, totalStun)).toFixed(2)}`;
                    break;
                case 6:
                    item.textContent = `최소 스턴 범위 : ${MyArray.length ? MyArray[0][2] : 0}`;
                    break;
            }

            itemList.appendChild(item);
        }
    }
    else if (sortCount == 200 && unitCount == 200) {
        for (let i = 0; i <= 9; i++) {
            const item = document.createElement("li");
            item.textContent = `Item ${i}`;
            item.style.padding = "0.5rem   0";
            item.style.borderBottom = "0.1rem solid #ddd";

            switch (i) {
                case 0:
                    item.textContent = `X = 확률`
                    break;
                case 1:
                    item.textContent = `S = 지속시간`
                    break;
                case 2:
                    item.textContent = `T = 공격 주기`
                    break;
                case 3:
                    item.textContent = `n = 지속시간 동안 타격 횟수(자연수)`
                    break;
                case 4:
                    item.textContent = `일반 공식 : 1+(XS/T - nX -1)*(1-X)^n`;
                    break;
                case 5:
                    item.textContent = `아오키지 : 1+(XS/T - nX -1)*(1-X)^n * (1 - 3 / (1 / T / 0.125 * (1 - 0.125) ^ (25 / (1 + 1 / T * 마나리젠))(자연수) ) + 50 / (T + 마나리젠))(자연수) )`;
                    break;
                case 6:
                    item.textContent = `(니카 한정) X2 : 거인화 시에 스턴 확률`;
                    break;
                case 7:
                    item.textContent = `(니카 한정) T2 : 거인화 시에 공격 주기`;
                    break;
                case 8:
                    item.textContent = `(니카 한정) n2 : 거인화 시에 스턴동안 타격 횟수(자연수)`;
                    break;
                case 9:
                    item.textContent = `니카 : ((1 - (1 + (X2 * S1 * T2 - n2 * X2 - 1) * (1 - X2)^n2) * 4.25 / 거인화 주기 - (1 + (X1 * S1 * T - n1 * X1 - 1) * (1 - X1) ^ n1) * (거인화 주기 - 4.25) / 거인화 주기)) * (1 - 마나스턴 시간 / 마나 크기 * ((4.25 * t2 + (거인화 주기 - 4.25) * t) / 거인화 주기 + 마나리젠))`;
                    break;
            }

            itemList.appendChild(item);
        }

    }
    else if (sortCount == -1) {
        if (speedState[unitCount][5] == 0)
            return;
        var t = speedState[unitCount][3] / (1 + speedState[unitCount][2]) *
            (((1 + speedState[unitCount][2] +
                parseFloat((speedBonus / 100).toFixed(3)) +
                parseFloat((speedBonusEx / 100).toFixed(3))) > 5) ? 5 :
                (1 + speedState[unitCount][2] +
                    parseFloat((speedBonus / 100).toFixed(3)) +
                    parseFloat((speedBonusEx / 100).toFixed(3))));
        var s = speedState[unitCount][5];
        var x = speedState[unitCount][4];
        for (let i = 0; i < 5; i++) {
            const item = document.createElement("li");
            item.textContent = `Item ${i}`;
            item.style.padding = "0.5rem 0";
            item.style.borderBottom = "0.1rem solid #ddd";

            switch (i) {
                case 0:
                    item.textContent = `이감 확률 : ${(x * 100).toFixed(0)}%`;
                    break;
                case 1:
                    item.textContent = `이감 지속시간 : ${s.toFixed(2)}초`;
                    break;
                case 2:
                    item.textContent = `이감 수치 : ${speedState[unitCount][6]}%`
                    break;
                case 3:
                    item.textContent = `이감 발동률 : ${(lowSpeed(unitCount, 0) * 100).toFixed(2)}%`;
                    break;
                case 4:
                    item.textContent = `이감이 다시 잡히는 평균 시간 : ${(1 / t / x).toFixed(3)}초`
                    break;
            }

            itemList.appendChild(item);
        }
    }
    else if (sortCount == -2) {
        if (speedState[unitCount][8] == 0)
            return;
        var t = speedState[unitCount][3] / (1 + speedState[unitCount][2]) *
            (((1 + speedState[unitCount][2] +
                parseFloat((speedBonus / 100).toFixed(3)) +
                parseFloat((speedBonusEx / 100).toFixed(3))) > 5) ? 5 :
                (1 + speedState[unitCount][2] +
                    parseFloat((speedBonus / 100).toFixed(3)) +
                    parseFloat((speedBonusEx / 100).toFixed(3))));
        var s = speedState[unitCount][8];
        var x = speedState[unitCount][7];
        for (let i = 0; i < 4; i++) {
            const item = document.createElement("li");
            item.textContent = `Item ${i}`;
            item.style.padding = "0.5rem 0";
            item.style.borderBottom = "0.1rem solid #ddd";

            switch (i) {
                case 0:
                    item.textContent = `여진 확률 : ${(x * 100).toFixed(0)}%`;
                    break;
                case 1:
                    item.textContent = `여진 지속시간 : ${s.toFixed(2)}초`;
                    break;
                case 2:
                    item.textContent = `여진 수치 : ${speedState[unitCount][9]}%`
                    break;
                case 3:
                    item.textContent = `여진 가동률 : ${(lowSpeed(unitCount, 1) * 100).toFixed(2)}%`;
                    break;
            }

            itemList.appendChild(item);
        }
    }
    else if (unitState[sortCount][unitCount][0] === "니카") {
        var x1 = unitState[sortCount][unitCount][3];
        var x2 = unitState[sortCount][unitCount][5];
        var s1 = unitState[sortCount][unitCount][4];
        let t = 1 / unitState[sortCount][unitCount][2] * ((1 + unitState[sortCount][unitCount][1] + parseFloat((((stunCount[sortCount][unitCount]) ? 0 : speedBonus + speedBonusEx) / 100).toFixed(3)) > 5) ? 5 : (1 + unitState[sortCount][unitCount][1] + parseFloat((((stunCount[sortCount][unitCount]) ? 0 : speedBonus + speedBonusEx) / 100).toFixed(3))));
        var t2 = parseFloat((3.7 / (1 + 1.1) * ((1 + 1.1 + parseFloat((speedBonus / 100).toFixed(3)) + parseFloat((speedBonusEx / 100).toFixed(3)) - ((stunCount[sortCount][unitCount]) ? parseFloat((110 / 100).toFixed(3)) : 0) > 5) ? 5 : (1 + 1.1 + parseFloat((speedBonus / 100).toFixed(3)) + parseFloat((speedBonusEx / 100).toFixed(3)) - ((stunCount[sortCount][unitCount]) ? parseFloat((unitState[sortCount][unitCount][9] / 100).toFixed(3)) : 0)))).toFixed(3));
        let time = (4.25 + ((115 - 4.25 * (t2 + healthRegen + 0.25)) / (t + healthRegen + 0.25)) <= 4.25) ? 4.25 : (4.25 + ((115 - 4.25 * (t2 + healthRegen + 0.25)) / (t + healthRegen + 0.25)));

        var maxMana = unitState[sortCount][unitCount][7];
        var m_stun = unitState[sortCount][unitCount][8];
        var n1 = Math.floor(s1 * t);
        var n2 = Math.floor(s1 * t2);

        for (let i = 0; i <= 21; i++) {

            const item = document.createElement("li");
            item.textContent = `Item ${i}`;
            item.style.padding = "0.5rem 0";
            item.style.borderBottom = "0.1rem solid #ddd";

            switch (i) {
                case 0:
                    item.textContent = `스턴 지수 : ${unitRate[sortCount][unitCount].toFixed(3)}스턴`
                    break;
                case 1:
                    item.textContent = `스턴 가동률 : ${((1 - Math.pow(0.2, unitRate[sortCount][unitCount])) * 100).toFixed(2)}%`
                    break;
                case 2:
                    item.textContent = `일반 모드 공속 : 초당${t.toFixed(3)}`
                    break;
                case 3:
                    item.textContent = `거인화 모드 공속 : 초당${t2.toFixed(3)}`
                    break;
                case 4:
                    item.textContent = `공속 보너스(자체 버프 포함) : ${(unitState[sortCount][unitCount][1] + parseFloat((speedBonus / 100).toFixed(3)) + parseFloat((speedBonusEx / 100).toFixed(3)) - ((stunCount[sortCount][unitCount]) ? parseFloat((unitState[sortCount][unitCount][9] / 100).toFixed(3)) : 0)) * 100}%`;
                    break;
                case 5:
                    item.innerText = `공속 버프 : ${unitState[sortCount][unitCount][9]}%`
                    break;
                case 6:
                    item.innerText = `스턴 지속시간 : ${s1}초 (거인화, 일반 동일)`;
                    break;
                case 7:
                    item.innerText = `스턴 범위 : ${stunRange[sortCount][unitCount - 1][0]} (거인화, 일반 동일)`;
                    break;
                case 8:
                    item.innerText = `일반 모드 스턴 확률 : ${(x1 * 100).toFixed(2)}%`
                    break;
                case 9:
                    item.innerText = `일반 모드 스턴 수치 : ${(Math.log(-(x1 * s1 * t - n1 * x1 - 1) * Math.pow(1 - x1, n1)) / Math.log(0.2)).toFixed(3)}스턴`;
                    break;
                case 10:
                    item.innerText = `일반 모드 스턴 가동률 : ${((1 + (x1 * s1 * t - n1 * x1 - 1) * Math.pow(1 - x1, n1)) * 100).toFixed(2)}%`;
                    break;
                case 11:
                    item.innerText = `거인화 모드 스턴 확률 : ${(0.18 * 100).toFixed(2)}%`
                    break;
                case 12:
                    item.innerText = `거인화 모드 스턴 가동률 : ${((1 + (0.18 * s1 * t2 - n2 * 0.18 - 1) * Math.pow(1 - 0.18, n2)) * 100).toFixed(2)}%`;
                    break;
                case 13:
                    item.innerText = `거인화 모드 스턴 수치 : ${(Math.log(-(0.18 * s1 * t2 - n2 * 0.18 - 1) * Math.pow(1 - 0.18, n2)) / Math.log(0.2)).toFixed(3)}스턴`;
                    break;
                case 14:
                    item.innerText = `거인화 모드 지속시간 : 4.25초`;
                    break;
                case 15:
                    item.innerText = `거인화 모드 주기 : ${time.toFixed(2)}초`;
                    break;
                case 16:
                    item.innerText = `거인화 모드 비중 : ${(4.25 / time * 100).toFixed(2)}%`;
                    break;
                case 17:
                    item.innerText = `마나통 : ${maxMana}`;
                    break;
                case 18:
                    item.innerText = `마나 스턴 지속시간 : ${m_stun}초`;
                    break;
                case 19:
                    item.innerText = `마나 스턴 범위 : ${stunRange[sortCount][unitCount - 1][2]}`;
                    break;
                case 20:
                    item.innerText = `마나 스턴 가동률 : ${(m_stun / maxMana * ((4.25 * t2 + (time - 4.25) * t) / time + manaRegen) * 100).toFixed(2)}%`
                    break;
                case 21:
                    item.innerText = `마나 스턴 수치 : ${(Math.log(1 - (m_stun / maxMana * ((4.25 * t2 + (time - 4.25) * t) / time + manaRegen))) / Math.log(0.2)).toFixed(3)}스턴`
                    break;
            }
            itemList.appendChild(item);
        }


    }
    else {
        var x1 = unitState[sortCount][unitCount][3];
        var x2 = unitState[sortCount][unitCount][5];
        var s1 = unitState[sortCount][unitCount][4];
        var s2 = unitState[sortCount][unitCount][6];
        let t = 1 / unitState[sortCount][unitCount][2] * ((1 + unitState[sortCount][unitCount][1] + parseFloat((((stunCount[sortCount][unitCount]) ? 0 : speedBonus + speedBonusEx) / 100).toFixed(3)) > 5) ? 5 : (1 + unitState[sortCount][unitCount][1] + parseFloat((((stunCount[sortCount][unitCount]) ? 0 : speedBonus + speedBonusEx) / 100).toFixed(3))));

        var maxMana = unitState[sortCount][unitCount][7];
        var m_stun = unitState[sortCount][unitCount][8];
        var n1 = Math.floor(s1 * t);
        var n2 = Math.floor(s2 * t);

        for (let i = 1; i <= 22; i++) {
            const item = document.createElement("li");
            item.textContent = `Item ${i}`;
            item.style.padding = "0.5rem 0";
            item.style.borderBottom = "0.1rem solid #ddd";

            if (s2 == 0 && i >= 11 && i <= 16)
                i = 18;
            if (maxMana == 0 && i >= 18 && i <= 22)
            {
                i = 22;
                continue;
            }
            switch (i) {
                case 1:
                    item.innerText = "스턴 지수 : " + unitRate[sortCount][unitCount].toFixed(3) + "스턴";
                    break;
                case 2:
                    item.innerText = "스턴 가동률 : " + ((1 - Math.pow(0.2,unitRate[sortCount][unitCount]))*100).toFixed(2) + "%";
                    break;
                case 3:
                    item.innerText = `공속 : 초당${t.toFixed(3)}`;
                    break;
                case 4:
                    item.innerText = `공속 보너스(자체 버프 포함) : ${((unitState[sortCount][unitCount][1] + parseFloat((speedBonus / 100).toFixed(3)) + parseFloat((speedBonusEx / 100).toFixed(3)) - ((stunCount[sortCount][unitCount]) ? parseFloat((unitState[sortCount][unitCount][9] / 100).toFixed(3)) : 0)) * 100).toFixed(2)}%`;
                    break;
                case 5:
                    item.innerText = `공속 버프 : ${unitState[sortCount][unitCount][9]}%`
                    break;
                case 6:
                    item.innerText = `스턴 1 확률 : ${(x1 * 100).toFixed(2)}%`
                    break;
                case 7:
                    item.innerText = `스턴 1 지속시간 : ${s1}초`;
                    break;
                case 8:
                    item.innerText = `스턴 1 범위 : ${stunRange[sortCount][unitCount - 1][0]}`;
                    break;
                case 9:
                    if (unitState[sortCount][unitCount][0] == "루피") {
                        let n3 = Math.ceil(1.75 * t);
                        let time = n3 / t;
                        let n4 = Math.floor((2.75 - time) * t);
                        item.innerText = `스턴 1 수치 : ${(Math.log(1 - ((time + 1 / t / 0.0125 * (1 - (n4 * 0.0125 + 1) * Math.pow(1 - 0.0125, n4))) / (time + 1 / t / 0.0125)) * (1 + (x1 * s1 * t - n1 * x1 - 1) * Math.pow(1 - x1, n1))) / Math.log(0.2)).toFixed(3)}스턴`;
                    }
                    else if (unitState[sortCount][unitCount][0] == "라분") {
                        item.innerText = `스턴 1 수치 : ${unitRate[sortCount][unitCount].toFixed(3)}스턴`;
                    }
                    else
                        item.innerText = `스턴 1 수치 : ${(Math.log(-(x1 * s1 * t - n1 * x1 - 1) * Math.pow(1 - x1, n1)) / Math.log(0.2)).toFixed(3)}스턴`;
                    break;
                case 10:
                    if (unitState[sortCount][unitCount][0] == "라분") {
                        item.innerText = `스턴 1 샐 확률 : ${(Math.pow(0.2, unitRate[sortCount][unitCount])*100).toFixed(2)}%`;
                    }
                    else if (unitState[sortCount][unitCount][0] == "루피")
                    {
                        let n3 = Math.ceil(1.75 * t);
                        let time = n3 / t;
                        let n4 = Math.floor((2.75 - time) * t);
                        item.innerText = `스턴 1 샐 확률 : ${((1 - ((time + 1 / t / 0.0125 * (1 - (n4 * 0.0125 + 1) * Math.pow(1 - 0.0125, n4))) / (time + 1 / t / 0.0125)) * (1 + (x1 * s1 * t - n1 * x1 - 1) * Math.pow(1 - x1, n1))) * 100).toFixed(2)}%`
                    }
                    else
                        item.innerText = `스턴 1 샐 확률 : ${(-(x1 * s1 * t - n1 * x1 - 1) * Math.pow(1 - x1, n1) * 100).toFixed(2)}%`;
                    break;
                case 11:
                    if (unitState[sortCount][unitCount][0] == "라분") {
                        let count = 0;
                        let time1 = 0.65 + 0 / t - 2.15;
                        if (time1 > 0)
                            count++;
                        else
                            time1 = 0;

                        let time2 = 0.65 + 1 / t - 2.15;
                        if (time2 > 0)
                            count++;
                        else
                            time2 = 0;

                        let time3 = 0.65 + 2 / t - 2.15;
                        if (time3 > 0)
                            count++;
                        else
                            time3 = 0;

                        let time4 = 0.65 + 3 / t - 2.15;
                        if (time4 > 0)
                            count++;
                        else
                            time4 = 0;

                        let time5 = 0.65 + 4 / t - 2.15;
                        if (time5 > 0)
                            count++;
                        else
                            time5 = 0;

                        let time6 = 0.65 + 5 / t - 2.15;
                        if (time6 > 0)
                            count++;
                        else
                            time6 = 0;
                        item.innerText = `스턴 1 편차 : ${((time1 * x1 * Math.pow(1 - x1, count - 6) + time2 * x1 * Math.pow(1 - x1, count - 5) + time3 * x1 * Math.pow(1 - x1, count - 4) + time4 * x1 * Math.pow(1 - x1, count - 3) + time5 * x1 * Math.pow(1 - x1, count - 2) + time6 * (1 - x1 - x1 * (1 - x1) - x1 * Math.pow(1 - x1, 2) - x1 * Math.pow(1 - x1, 3) - x1 * Math.pow(1 - x1, 4)))).toFixed(3)}초`;
                    }
                    else if (unitState[sortCount][unitCount] == "루피") {
                        item.innerText = `스턴 1 편차 : ${(1 / x1 / t).toFixed(3)}초`;
                    }
                    else
                        item.innerText = `스턴 1 편차 : ${(1 / x1 / t).toFixed(3)}초`;
                    break;
                case 12:
                    item.innerText = `스턴 2 확률 : ${(x2 * 100).toFixed(2)}%`
                    break;
                case 13:
                    item.innerText = `스턴 2 지속시간 : ${s2}초`;
                    break;
                case 14:
                    item.innerText = `스턴 2 범위 : ${stunRange[sortCount][unitCount - 1][1]}`;
                    break;
                case 15:
                    item.innerText = `스턴 2 수치 : ${(Math.log(-(x2 * s2 * t - n2 * x2 - 1) * Math.pow(1 - x2, n2)) / Math.log(0.2)).toFixed(3)}스턴`;
                    break;
                case 16:
                    item.innerText = `스턴 2 샐 확률 : ${(-(x2 * s2 * t - n2 * x2 - 1) * Math.pow(1 - x2, n2) * 100).toFixed(2)}%`;
                    break;
                case 17:
                    item.innerText = `스턴 2 편차 : ${(1 / x2 / t).toFixed(3)}초`;
                    break;
                case 18:
                    item.innerText = `마나(체력) 통 : ${maxMana}`;
                    break;
                case 19:
                    item.innerText = `마나(체력)스턴 지속시간 : ${m_stun}초`;
                    break;
                case 20:
                    item.innerText = `마나(체력)스턴 범위 : ${stunRange[sortCount][unitCount - 1][2]}`;
                    break;
                case 21:
                    item.innerText = `마나(체력)스턴 수치 : `;
                    if (unitState[sortCount][unitCount][0] === "샹크스") {
                        item.innerText += (Math.log((1 - 3 / 14.25) * (1 - 3 * (1.35 + manaRegen) / 35)) / Math.log(0.2)).toFixed(3);
                    }
                    else if (unitState[sortCount][unitCount][0] === "아오키지") {
                        item.innerText += (Math.log(1 - 3 / (1 / t / 0.125 * Math.pow(1 - 0.125, floor(25 / (1 + 1 / t * manaRegen))) + 50 / (t + manaRegen))) / Math.log(0.2)).toFixed(3);
                    }
                    else if (unitState[sortCount][unitCount][0] === "흰수염") {
                        item.innerText += (Math.log(1 - m_stun / (maxMana / (t + healthRegen + 0.5))) / Math.log(0.2)).toFixed(3);
                    }
                    else if (unitState[sortCount][unitCount][0] === "타츠마키") {
                        item.innerText += (Math.log((1 - m_stun / (maxMana / (t + healthRegen)))) / Math.log(0.2)).toFixed(3);
                    }
                    else if (maxMana)
                        item.innerText += (Math.log(1 - m_stun / (maxMana / (manaRegen + t))) / Math.log(0.2)).toFixed(3);
                    else
                        item.innerText += 0;
                    item.innerText += '스턴';
                    break;
                case 22:
                    item.innerText = `마나(체력)스턴 공백 :`;
                    if (unitState[sortCount][unitCount][0] === "샹크스") {
                        item.innerText += ((1 - 3 / 14.25) * (1 - 3 * (1.35 + manaRegen) / 35) * 100).toFixed(2);
                    }
                    else if (unitState[sortCount][unitCount][0] === "아오키지") {
                        item.innerText += ((1 - 3 / (1 / t / 0.125 * Math.pow(1 - 0.125, Math.floor(25 / (1 + 1 / t * manaRegen))) + 50 / (t + manaRegen))) * 100).toFixed(2);
                    }
                    else if (unitState[sortCount][unitCount][0] === "흰수염") {
                        item.innerText += ((1 - ((maxMana != 0) ? m_stun / (maxMana / (t + healthRegen + 0.5)) : 0)) * 100).toFixed(2);
                    }
                    else if (unitState[sortCount][unitCount][0] === "타츠마키") {
                        item.innerText += ((1 - ((maxMana != 0) ? m_stun / (maxMana / (t + healthRegen)) : 0)) * 100).toFixed(2);
                    }
                    else if (maxMana)
                        item.innerText += ((1 - m_stun / (maxMana / (manaRegen + t))) * 100).toFixed(2);
                    else
                        item.innerText = 0;
                    item.innerText += `%`;
                    break;

                }
  
                itemList.appendChild(item);
            }}
    overlayContent.appendChild(itemList);

    overlay.appendChild(overlayContent);

    // 7. 오버레이를 body에 추가
    document.body.appendChild(overlay);
}

function ClearAll() {
    speedBonus = 0;
    speedBonusEx = 0;
    totalStun = 0;
    manaRegen = 0;
    healthRegen = 0;

    if (document.getElementById("container1" != null))
        for (var i = 0; i < unitState.length; i++) {
            for (var j = 1; j < unitState[i].length; j++) {
                stunCount[i][j] = 0;
                document.getElementById(`c-${i}-${j}`).innerText = "0";
            }
        }
    document.getElementsByClassName("MRegen")[0].innerText = 0;
    document.getElementsByClassName("HRegen")[0].innerText = 0;
    document.getElementsByClassName("AttackSpeed")[0].innerText = 0 + "%";
    document.getElementsByClassName("AttackSpeedEx")[0].innerText = 0 + "%";

    BuffState.forEach((item) => {
        item[5] = false;
    })

    document.querySelectorAll("input[type='checkbox']").forEach(checkbox => {
        checkbox.checked = false;
    })

    UnitTotalStun();
    CountOn();
}

function SortFunction(a, b) {
    if (lowSpeed(speedState.indexOf(a), 1) < lowSpeed(speedState.indexOf(b), 1)) return 1;
    if (lowSpeed(speedState.indexOf(a), 1) > lowSpeed(speedState.indexOf(b), 1)) return -1;

    if (lowSpeed(speedState.indexOf(a), 0) < lowSpeed(speedState.indexOf(b), 0)) return 1;
    if (lowSpeed(speedState.indexOf(a), 0) > lowSpeed(speedState.indexOf(b), 0)) return -1;

    if (a[0] < b[0]) return -1;
    if (a[0] > b[0]) return 1;

    if (a[1][1] < b[1][1]) return 1;
    if (a[1][1] > b[1][1]) return -1;

    return 0;
}


function CheckEvent(Check, item, index) {
    Check.addEventListener("change", (event) => {
        if (event.target.checked) {
            speedBonusEx += item[2];
            manaRegen += item[3];
            healthRegen += item[4];
            item[5] = true;

            if (item[2] != 0) {
                document.getElementsByClassName(`s${index}`)[0].checked = true;
            }
            if (item[3] != 0) {
                document.getElementsByClassName(`m${index}`)[0].checked = true;
            }
            if (item[4] != 0) {
                document.getElementsByClassName(`h${index}`)[0].checked = true;
            }
        }
        else {
            speedBonusEx -= item[2];
            manaRegen -= item[3];
            healthRegen -= item[4];
            item[5] = false;

            if (item[2] != 0) {
                document.getElementsByClassName(`s${index}`)[0].checked = false;
            }
            if (item[3] != 0) {
                document.getElementsByClassName(`m${index}`)[0].checked = false;
            }
            if (item[4] != 0) {
                document.getElementsByClassName(`h${index}`)[0].checked = false;
            }
        }

        UnitTotalStun();
        CountOn();
    })

}

function ButtonColor(name) {
    name.style.aspectRatio = "1";
    name.style.background = "rgb(245, 245, 245)";

    name.addEventListener('mouseenter', () => {
        name.style.background = "rgb(225, 225, 225)";
    });

    name.addEventListener('mouseleave', () => {
        name.style.background = "rgb(245, 245, 245)";
    });

    name.addEventListener('mousedown', () => {
        name.style.background = "rgb(250, 250, 250)";
    });

    name.addEventListener('mouseup', () => {
        name.style.background = "rgb(225, 225, 225)";
    });
}

function Stack() {
    const Stack = document.createElement("div");
    Stack.className = "Stack";
    const container = document.getElementsByClassName("container")[0];

    if (document.getElementById("container1") != null) {
        const containerHeightPercentage = (container.offsetHeight / window.innerHeight) * 100;
        const unitAdjustment = (container.offsetHeight / window.innerHeight * 100 / 20) * (Unit - 40 > 0 ? (Unit - 40) : 0);
        Stack.style.height = `calc(${40 - 2 * (Unit - 40 > 0  ? (Unit - 40) : 0)}vw)`;
    }
    else {
        Stack.style.height = "40vw";
    }

    document.getElementById("div2").appendChild(Stack);

    for (var i = 0; i <= 3; i++) {
        const ChildStack = document.createElement("div");
        ChildStack.className = `ChildStack Stack${i}`;
        ChildStack.style.height = `2vw`;
        ChildStack.style.width = `calc(${(container.offsetWidth / window.innerWidth) * 100 / 3}vw)`;

        Stack.appendChild(ChildStack);
    }

    const TotalStun = document.createElement("button");
    TotalStun.className = 'TotalStun BigFont';
    TotalStun.style.height = "100%";
    TotalStun.style.width = `calc(${(container.offsetWidth / window.innerWidth) * 100 / 3 * 0.6}vw)`
    TotalStun.addEventListener('click', () => {
        openOverlay(100, 100);
    });
    TotalStun.innerText = `${totalStun.toFixed(3)}스턴`;
    document.getElementsByClassName(`Stack0`)[0].appendChild(TotalStun);


    const clear = document.createElement("button");
    clear.className = "clear BigFont";
    clear.innerText = '초기화';
    clear.style.height = "100%";
    clear.style.width = `calc(${(container.offsetWidth / window.innerWidth) * 100 / 3 * 0.4}vw)`
    clear.addEventListener("click", ClearAll);

    document.getElementsByClassName(`Stack0`)[0].appendChild(clear);

    const SpeedBonusButton = document.createElement("div");
    SpeedBonusButton.className = "AttackSpeed div BigFont";
    SpeedBonusButton.style.border = "0.001rem solid black";
    SpeedBonusButton.style.alignContent = "center";
    SpeedBonusButton.style.paddingRight = "0.25vw";
    SpeedBonusButton.style.fontWeight = 'bold';
    SpeedBonusButton.innerText = `${speedBonus}%`;
    SpeedBonusButton.style.boxSizing = "border-box";
    SpeedBonusButton.style.height = "100%";
    SpeedBonusButton.style.width = `calc(${(container.offsetWidth / window.innerWidth) * 100 / 12}vw)`;
    SpeedBonusButton.style.textAlign = "right";

    document.getElementsByClassName(`Stack1`)[0].appendChild(SpeedBonusButton);

    const SpeedBonus = document.createElement("div");
    SpeedBonus.className = "Bonus SmallFont";
    SpeedBonus.innerText = "공속 보너스";
    SpeedBonus.style.height = "100%";
    SpeedBonus.style.width = `calc(${(container.offsetWidth / window.innerWidth) * 100 / 12}vw)`;

    document.getElementsByClassName('Stack1')[0].appendChild(SpeedBonus);

    const SpeedBonusExButton = document.createElement("button");
    SpeedBonusExButton.className = "AttackSpeedEx Button BigFont";
    SpeedBonusExButton.innerText = `${speedBonusEx}%`;
    SpeedBonusExButton.style.boxSizing = "border-box";
    SpeedBonusExButton.style.height = "100%";
    SpeedBonusExButton.style.width = `calc(${(container.offsetWidth / window.innerWidth) * 100 / 12}vw)`;
    SpeedBonusExButton.style.textAlign = "right";

    const SpeedBonusExOverlay = document.createElement("div");
    SpeedBonusExOverlay.className = "SpeedBonusExOverlay";
    SpeedBonusExOverlay.style.position = "fixed";
    SpeedBonusExOverlay.style.top = 0;
    SpeedBonusExOverlay.style.left = 0;
    SpeedBonusExOverlay.style.width = "100%";
    SpeedBonusExOverlay.style.height = "100%";
    SpeedBonusExOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    SpeedBonusExOverlay.style.zIndex = 1000;
    SpeedBonusExOverlay.style.display = "flex";
    SpeedBonusExOverlay.style.justifyContent = "center";
    SpeedBonusExOverlay.style.alignItems = "center";
    SpeedBonusExOverlay.style.display = "none";

    SpeedBonusExOverlay.addEventListener("click", () => {
        SpeedBonusExOverlay.style.display = (SpeedBonusExOverlay.style.display === "none") ? "block" : "none";
    });

    document.body.appendChild(SpeedBonusExOverlay);

    const speedBonusExScroll = document.createElement("div");
    speedBonusExScroll.style.position = "absolute";
    speedBonusExScroll.style.height = "60vh";
    speedBonusExScroll.style.overflowY = "auto";
    speedBonusExScroll.style.background = "white";
    speedBonusExScroll.style.border = "0.05rem solid #ccc";
    speedBonusExScroll.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.2)";
    speedBonusExScroll.style.display = "none";

    speedBonusExScroll.addEventListener("click", function (event) {
        event.stopPropagation();
    });

    const MRegenOverlay = document.createElement("div");
    MRegenOverlay.className = "MRegenOverlay";
    MRegenOverlay.style.position = "fixed";
    MRegenOverlay.style.top = 0;
    MRegenOverlay.style.left = 0;
    MRegenOverlay.style.width = "100%";
    MRegenOverlay.style.height = "100%";
    MRegenOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    MRegenOverlay.style.zIndex = 1000;
    MRegenOverlay.style.display = "flex";
    MRegenOverlay.style.justifyContent = "center";
    MRegenOverlay.style.alignItems = "center";
    MRegenOverlay.style.display = "none";

    MRegenOverlay.addEventListener("click", () => {
        MRegenOverlay.style.display = (MRegenOverlay.style.display === "none") ? "block" : "none";
    });

    document.body.appendChild(MRegenOverlay);

    const MRegenScroll = document.createElement("div");
    MRegenScroll.style.position = "absolute";
    MRegenScroll.style.height = "60vh";
    MRegenScroll.style.overflowY = "auto";
    MRegenScroll.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.2)";
    MRegenScroll.style.border = "0.05rem solid #ccc";
    MRegenScroll.style.display = "none";
    MRegenScroll.style.background = "white";

    MRegenScroll.addEventListener("click", function (event) {
        event.stopPropagation();
    });

    const HRegenOverlay = document.createElement("div");
    HRegenOverlay.className = "HRegenOverlay";
    HRegenOverlay.style.position = "fixed";
    HRegenOverlay.style.top = 0;
    HRegenOverlay.style.left = 0;
    HRegenOverlay.style.width = "100%";
    HRegenOverlay.style.height = "100%";
    HRegenOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    HRegenOverlay.style.zIndex = 1000;
    HRegenOverlay.style.display = "flex";
    HRegenOverlay.style.justifyContent = "center";
    HRegenOverlay.style.alignItems = "center";
    HRegenOverlay.style.display = "none";

    HRegenOverlay.addEventListener("click", () => {
        HRegenOverlay.style.display = (HRegenOverlay.style.display === "none") ? "block" : "none";
    });

    document.body.appendChild(HRegenOverlay);

    const HRegenScroll = document.createElement("div");
    HRegenScroll.style.position = "absolute";
    HRegenScroll.style.height = "60vh";
    HRegenScroll.style.overflowY = "auto";
    HRegenScroll.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.2)";
    HRegenScroll.style.border = "0.05rem solid #ccc";
    HRegenScroll.style.display = "none";
    HRegenScroll.style.background = "white";

    HRegenScroll.addEventListener("click", function (event) {
        event.stopPropagation();
    });

    HRegenOverlay.appendChild(HRegenScroll);
    MRegenOverlay.appendChild(MRegenScroll);
    SpeedBonusExOverlay.appendChild(speedBonusExScroll);

    BuffState.forEach((item, index) => {

        if (item[2] != 0) {
            const menu = document.createElement("label");
            menu.className = "CheckBox-Stack";
            menu.style.border = "0.001rem solid black";
            speedBonusExScroll.appendChild(menu);

            const unitName = document.createElement("p");
            unitName.innerText = `${item[0]}(${item[1]}) ${item[2]}%`;
            unitName.className = `SmallFont s${index}`;
            unitName.style.margin = "0";
            unitName.style.padding = "0.5rem";
            menu.appendChild(unitName);

            const Check = document.createElement("input");
            Check.type = "checkbox";
            Check.style.marginRight = "0.7vw";
            Check.style.transform = "scale(1.5)";
            Check.dataset.value = item[2];
            Check.checked = item[5];

            CheckEvent(Check, item, index);

            menu.appendChild(Check);
        }

        if (item[3] != 0) {
            const menu = document.createElement("label");
            menu.className = "CheckBox-Stack";
            menu.style.border = "0.001rem solid black";
            MRegenScroll.appendChild(menu);

            const unitName = document.createElement("p");
            unitName.innerText = `${item[0]}(${item[1]}) ${item[3]}`;
            unitName.className = `SmallFont m${index}`;
            unitName.style.margin = "0";
            unitName.style.padding = "0.5rem";
            menu.appendChild(unitName);

            const Check = document.createElement("input");
            Check.type = "checkbox";
            Check.style.marginRight = "0.7vw";
            Check.style.transform = "scale(1.5)";
            Check.dataset.value = item[3];
            Check.checked = item[5];

            CheckEvent(Check, item, index);

            menu.appendChild(Check);
        }

        if (item[4] != 0) {
            const menu = document.createElement("label");
            menu.className = "CheckBox-Stack";
            menu.style.border = "0.001rem solid black";
            HRegenScroll.appendChild(menu);

            const unitName = document.createElement("p");
            unitName.innerText = `${item[0]}(${item[1]}) ${item[4]}`;
            unitName.className = `SmallFont h${index}`;
            unitName.style.margin = "0";
            unitName.style.padding = "0.5rem";
            menu.appendChild(unitName);

            const Check = document.createElement("input");
            Check.type = "checkbox";
            Check.style.marginRight = "0.7vw";
            Check.style.transform = "scale(1.5)";
            Check.dataset.value = item[4];
            Check.checked = item[5];

            CheckEvent(Check, item, index);

            menu.appendChild(Check);
        }

    })


    SpeedBonusExButton.addEventListener("click", (event) => {
        event.stopPropagation();


        if (SpeedBonusExOverlay.style.display === "none") {
            speedBonusExScroll.style.display = "block";
            SpeedBonusExOverlay.style.display = "block";
            const rect = SpeedBonusExButton.getBoundingClientRect();
            const dropdownHeight = speedBonusExScroll.offsetHeight || 160;

            speedBonusExScroll.style.left = `${rect.left / window.innerWidth * 100}vw`; // vw 사용
            speedBonusExScroll.style.top = `${(rect.top - dropdownHeight) / window.innerHeight * 100}vh`;
        }
        else {
            speedBonusExScroll.style.display = "none";
            SpeedBonusExOverlay.style.display = "none";
        }

    });

    document.getElementsByClassName('Stack1')[0].appendChild(SpeedBonusExButton);
    speedBonusExScroll.style.width = `${(SpeedBonusExButton.offsetWidth * 2) / window.innerWidth * 100}vw`;

    const SpeedBonusEx = document.createElement("div");
    SpeedBonusEx.className = "Bonus SmallFont";
    SpeedBonusEx.innerText = "추가 공속";
    SpeedBonusEx.style.height = "100%";
    SpeedBonusEx.style.width = `calc(${(container.offsetWidth / window.innerWidth) * 100 / 12}vw)`;

    document.getElementsByClassName('Stack1')[0].appendChild(SpeedBonusEx);


    const MRegenButton = document.createElement("button");
    MRegenButton.className = "MRegen Button BigFont";
    MRegenButton.id = "MRegen";
    MRegenButton.innerText = `${manaRegen}`;
    MRegenButton.style.boxSizing = "border-box";
    MRegenButton.style.height = "100%";
    MRegenButton.style.width = `calc(${(container.offsetWidth / window.innerWidth) * 100 / 12}vw)`;
    MRegenButton.style.textAlign = "right";

    MRegenButton.addEventListener("click", (event) => {
        event.stopPropagation();


        if (MRegenOverlay.style.display === "none") {
            MRegenScroll.style.display = "block";
            MRegenOverlay.style.display = "block";
            const rect = MRegenButton.getBoundingClientRect();
            const dropdownHeight = MRegenScroll.offsetHeight || 160;

            MRegenScroll.style.left = `${rect.left / window.innerWidth * 100}vw`; // vw 사용
            MRegenScroll.style.top = `${(rect.top - dropdownHeight) / window.innerHeight * 100}vh`;
        }
        else {
            MRegenScroll.style.display = "none";
            MRegenOverlay.style.display = "none";
        }

    });

    document.getElementsByClassName('Stack2')[0].appendChild(MRegenButton);
    MRegenScroll.style.width = `${(MRegenButton.offsetWidth * 2) / window.innerWidth * 100}vw`;

    const MRegen = document.createElement("div");
    MRegen.className = "Bonus SmallFont";
    MRegen.innerText = "마나 리젠";
    MRegen.style.boxSizing = "border-box";
    MRegen.style.height = "100%";
    MRegen.style.width = `calc(${(container.offsetWidth / window.innerWidth) * 100 / 12}vw)`;

    document.getElementsByClassName('Stack2')[0].appendChild(MRegen);

    const HRegenButton = document.createElement("button");
    HRegenButton.className = "HRegen Button BigFont";
    HRegenButton.id = "HRegen";
    HRegenButton.innerText = `${healthRegen}`;
    HRegenButton.style.boxSizing = "border-box";
    HRegenButton.style.height = "100%";
    HRegenButton.style.width = `calc(${(container.offsetWidth / window.innerWidth) * 100 / 12}vw)`;
    HRegenButton.style.textAlign = "right";

    HRegenButton.addEventListener("click", (event) => {
        event.stopPropagation();


        if (HRegenOverlay.style.display === "none") {
            HRegenScroll.style.display = "block";
            HRegenOverlay.style.display = "block";
            const rect = HRegenButton.getBoundingClientRect();
            const dropdownHeight = HRegenScroll.offsetHeight || 160;

            HRegenScroll.style.left = `${rect.left / window.innerWidth * 100}vw`; // vw 사용
            HRegenScroll.style.top = `${(rect.top - dropdownHeight) / window.innerHeight * 100}vh`;
        }
        else {
            HRegenScroll.style.display = "none";
            MRegenOverlay.style.display = "none";
        }

    });

    document.getElementsByClassName('Stack2')[0].appendChild(HRegenButton);

    const HRegen = document.createElement("div");
    HRegen.className = "Bonus SmallFont";
    HRegen.innerText = "체력 리젠";
    HRegen.style.boxSizing = "border-box";
    HRegen.style.height = "100%";
    HRegen.style.width = `calc(${(container.offsetWidth / window.innerWidth) * 100 / 12}vw)`;

    document.getElementsByClassName('Stack2')[0].appendChild(HRegen);

    const Formula = document.createElement("button");
    Formula.className = "Formula SmallFont";
    Formula.innerText = "가동률 공식";
    Formula.style.height = `2vw`;
    Formula.style.width = `calc(${(container.offsetWidth / window.innerWidth) * 100 / 12}vw)`;
    Formula.addEventListener("click", () => {
        openOverlay(200, 200);
    });

    document.getElementsByClassName(`Stack3`)[0].appendChild(Formula);

    if (document.getElementById("container1")) {
        const Mana = document.createElement("button");
        Mana.className = "Mana SmallFont";
        Mana.innerText = "마나 끄기";
        Mana.style.height = `2vw`;
        Mana.style.width = `calc(${(container.offsetWidth / window.innerWidth) * 100 / 12}vw)`;
        Mana.addEventListener("click", () => {
            if (mana)
                Mana.innerText = "마나 켜기";
            else
                Mana.innerText = "마나 끄기";
            mana = !mana;
            UnitTotalStun();
            CountOn();
        });
        document.getElementsByClassName(`Stack3`)[0].appendChild(Mana);
    }

}

UnitTotalStun();
speedState.sort((a, b) => {

    if (a[0] < b[0]) return -1;
    if (a[0]  > b[0]) return  1;

    return SortFunction(a, b);
})

const container = document.getElementsByClassName("container")[0];

for (var i = 0; i < 3; i++) {
    const newDiv = document.createElement("div");
    newDiv.className = "div";
    newDiv.id = `div${i}`;
    container.appendChild(newDiv);
}

for (var i = 0, sortCount = 0, unitCount = 0; i < Unit; i++, unitCount++) {
    if (unitCount >= unitState[sortCount].length) {
        sortCount++;
        unitCount = 0;
    }

    const UnitBar = document.createElement("div");
    UnitBar.style.height = `2vw`;
    UnitBar.style.display = "flex";
    document.getElementById(`div${Math.floor(i / 20)}`).appendChild(UnitBar);

    if (unitCount == 0) {
        const newChild = document.createElement("div");
        newChild.className = 'unitSort BigFont';
        newChild.innerText = unitState[sortCount][unitCount][0];
        newChild.style.width = "100%";
        newChild.style.border = "0.001rem solid black";

        switch (sortCount) {
            case 0:
                newChild.style.color = "rgb(204,0,255)";
                break;
            case 1:
                newChild.style.color = "rgb(255,0,0)";
                break;
            case 2:
                newChild.style.color = "rgb(156,195,230)";
                break;
            case 3:
                newChild.style.color = "rgb(0,255,204)";
                newChild.style.background = "rgb(64,64,64)";
                break;
            case 4:
                newChild.style.color = "rgb(153,51,0)";
                break;
            case 5:
                newChild.style.color = "rgb(204,0,204)";
                break;
            case 6:
                newChild.style.color = "rgb(255 255,0)";
                newChild.style.background = "rgb(89,89,89)";
                break;
            case 7:
                newChild.style.color = "rgb(091,151,213)";
                break;
        }

        UnitBar.appendChild(newChild);
    }
    else {

        const unitName = document.createElement("button");
        unitName.className = 'Button unitName SmallFont';
        unitName.id = `n-${sortCount}-${unitCount}`;
        unitName.style.width = "100%";
        unitName.innerText = unitState[sortCount][unitCount][0];

        unitName.addEventListener("click", (event) => {
            openOverlay(event.target.id.split('-')[1], event.target.id.split('-')[2]);
        })

        const stunRate = document.createElement("div");
        stunRate.className = 'Rate SmallFont';
        stunRate.id = `r-${sortCount}-${unitCount}`;
        stunRate.style.boxSizing = 'border-box';
        stunRate.innerText = unitRate[sortCount][unitCount].toFixed(3) + "스턴";
        stunRate.style.justifyContent = "center";
        stunRate.style.width = "100%";

        const percentage = document.createElement("div");
        percentage.className = 'Rate SmallFont';
        percentage.id = `per-${sortCount}-${unitCount}`;
        percentage.style.boxSizing = 'border-box';
        percentage.innerText = ((1 - Math.pow(0.2, unitRate[sortCount][unitCount])) * 100).toFixed(2) + "%";
        percentage.style.justifyContent = "center";
        percentage.style.width = "100%";

        const count = document.createElement("div");
        count.className = 'Count SmallFont';
        count.id = `c-${sortCount}-${unitCount}`;
        count.innerText = `${stunCount[sortCount][unitCount]}`;
        count.style.justifyContent = "center";
        count.style.aspectRatio= "1";

        const plus = document.createElement("img");
        plus.className = 'IMG SmallFont';
        plus.src = "plus.png";
        plus.id = `p-${sortCount}-${unitCount}`;
        plus.addEventListener('click', () => {
            const id = plus.id.split(`-`);
            const sort = id[1];
            const unit = id[2];
            stunCount[sort][unit]++;
            document.getElementById(`c-${sort}-${unit}`).innerText = stunCount[sort][unit];
            if (stunCount[sort][unit] == 1) {
                speedBonus += unitState[sort][unit][9];
                if (unitState[sort][unit][0] === "퀸") {
                    manaRegen += 1;
                    healthRegen += 1;
                }
                for (let k = 0; k < 3; k++) {
                    if (stunRange[sort][unit - 1][k])
                        MyArray.push([sort, unit, stunRange[sort][unit - 1][k]]);
                }
                MyArray.sort((a, b) => a[2] - b[2]);
                document.getElementsByClassName(`AttackSpeed`)[0].innerText = (speedBonus).toFixed(0) + "%";
                UnitTotalStun();
                CountOn();
            }
            else
                totalStun += unitRate[sort][unit];
            document.getElementsByClassName("TotalStun")[0].innerText = totalStun.toFixed(3) + `스턴`;
        });
        ButtonColor(plus);

        const minus = document.createElement("IMG");
        minus.className = 'IMG SmallFont';
        minus.src = "minus.png";
        minus.id = `m-${sortCount}-${unitCount}`;
        minus.addEventListener('click', () => {
            const id = minus.id.split(`-`);
            const sort = id[1];
            const unit = id[2];
            stunCount[sort][unit]--;
            if (stunCount[sort][unit] < 0){
                stunCount[sort][unit] = 0;
            }
            else if (stunCount[sort][unit] == 0) {
                speedBonus -= unitState[sort][unit][9];
                if (unitState[sort][unit][0] === "퀸") {
                    manaRegen -= 1;
                    healthRegen -= 1;
                }
                MyArray = MyArray.filter(item => item[0] !== sort || item[1] !== unit || item[2] !== stunRange[sort][unit - 1][0]);
                MyArray = MyArray.filter(item => item[0] !== sort || item[1] !== unit || item[2] !== stunRange[sort][unit - 1][1]);
                MyArray = MyArray.filter(item => item[0] !== sort || item[1] !== unit || item[2] !== stunRange[sort][unit - 1][2]);
                document.getElementsByClassName(`AttackSpeed`)[0].innerText = (speedBonus).toFixed(0) + "%";
                UnitTotalStun();
                CountOn();
            }
            else
            {
                totalStun -= unitRate[sort][unit];
            }
            count.innerText = stunCount[sort][unit];
            document.getElementsByClassName("TotalStun")[0].innerText = totalStun.toFixed(3) +`스턴`;
        }
        );

        ButtonColor(minus);

        minus.style.height = `calc(${container.offsetHeight / 20})`;

        UnitBar.appendChild(unitName);
        UnitBar.appendChild(stunRate);
        UnitBar.appendChild(percentage);
        UnitBar.appendChild(count);
        UnitBar.appendChild(plus);
        UnitBar.appendChild(minus);
    }
}

Stack();


const MoveSpeedPage = document.createElement("button");
MoveSpeedPage.className = "MoveSpeedPage MoreSmallFont";
MoveSpeedPage.innerText = "이동 속도 감소";
MoveSpeedPage.style.height = `2vw`;
MoveSpeedPage.style.width = `calc(${(container.offsetWidth / window.innerWidth) * 100 / 12}vw)`;
MoveSpeedPage.style.marginLeft = "auto";

MoveSpeedPage.addEventListener('click', () => {

    const Container2 = document.createElement('div');
    Container2.className = "container";
    Container2.id = "container2";

    document.body.appendChild(Container2);

    container.replaceWith(Container2);

    for (var i = 0; i < 3; i++) {
        const newDiv = document.createElement("div");
        newDiv.className = "div";
        newDiv.id = `div${i}`;
        Container2.appendChild(newDiv);
    }

    for (let i = 0; i <= speedState.length+Math.floor(i/20); i++) {

        const Unit = document.createElement("div");
        Unit.id = `u-${i}`;
        Unit.style.width = "100%";
        Unit.style.height = `calc(${Container2.offsetHeight / window.innerHeight * 100 / 20}vh)`
        Unit.style.parseFloat = "left";
        Unit.style.boxSizing = "border-box";
        Unit.style.display = "grid";
        Unit.style.gridTemplateColumns = "repeat(4,1fr)";

        document.getElementById(`div${Math.floor(i / 20)}`).appendChild(Unit);

        if (i % 20 == 0) {
            const UnitName = document.createElement("button");
            UnitName.className = "unitSort MoreSmallFont UnitNameBar";
            UnitName.style.height = "100%";
            UnitName.boxSizing = "border-box";
            UnitName.textContent = (nameSort == 0) ? "유닛명" : (nameSort == -1) ? "유닛명 ⬇" : "유닛명 ⬆";
            UnitName.addEventListener("click", () => {
                if (nameSort <= 0)
                    nameSort = 1;
                else
                    nameSort = -1;
                rateSort = 0;
                moveSpeedSort = 0;
                afterShockSort = 0;

                speedState.sort((a, b) => {
                    if (nameSort == 1) {    
                        if (a[0] < b[0]) return -1;
                        if (a[0] > b[0]) return 1;
                    }
                    if (nameSort == -1) {

                        if (a[0] < b[0]) return 1;
                        if (a[0] > b[0]) return -1;
                    }
                    return SortFunction(a, b);
                });
                CountOn();
            })

            Unit.append(UnitName);

            const UnitSort = document.createElement("button");
            UnitSort.className = "unitSort MoreSmallFont UnitSortBar";
            UnitSort.style.height = "100%";
            UnitSort.boxSizing = "border-box";
            UnitSort.textContent = "등급";
            UnitSort.addEventListener("click", () => {
                nameSort = 0;
                if (rateSort <= 0)
                    rateSort = 1;
                else
                    rateSort = -1;
                moveSpeedSort = 0;
                afterShockSort = 0;

                speedState.sort((a, b) => {
                    if (a[1][1] < b[1][1]) return (rateSort == 1) ? -1 : 1;
                    if (a[1][1] > b[1][1]) return (rateSort == 1) ? 1 : -1;

                    return SortFunction(a, b);
                });
                CountOn();
            })

            Unit.append(UnitSort);

            const MoveSpeed = document.createElement("button");
            MoveSpeed.className = "unitSort MoreSmallFont MoveSpeedBar";
            MoveSpeed.style.height = "100%";
            MoveSpeed.style.boxSizing = "border-box"; // boxSizing 추가
            MoveSpeed.textContent = "이감 발동률";
            MoveSpeed.addEventListener("click", () => {
                nameSort = 0;
                rateSort = 0;
                if (moveSpeedSort <=0)
                    moveSpeedSort = 1;
                else
                    moveSpeedSort = -1;
                afterShockSort = 0;

                speedState.sort((a, b) => {
                    if (lowSpeed(speedState.indexOf(a), 0) > lowSpeed(speedState.indexOf(b), 0)) return (moveSpeedSort == 1) ? -1 : 1;
                    if (lowSpeed(speedState.indexOf(a), 0) < lowSpeed(speedState.indexOf(b), 0)) return (moveSpeedSort == 1) ? 1 : -1;

                    return SortFunction(a, b);
                });
                CountOn();
            })

            Unit.appendChild(MoveSpeed);

            const AfterShock = document.createElement("button");
            AfterShock.className = "unitSort MoreSmallFont AfterShockBar";
            AfterShock.style.height = "100%";
            AfterShock.style.boxSizing = "border-box"; // boxSizing 추가
            AfterShock.textContent = "여진 가동률";

            AfterShock.addEventListener("click", () => {
                nameSort = 0;
                rateSort = 0;
                moveSpeedSort = 0;
                if (afterShockSort <= 0)
                    afterShockSort = 1;
                else
                    afterShockSort = -1;

                speedState.sort((a, b) => {
                    if (lowSpeed(speedState.indexOf(a), 1) > lowSpeed(speedState.indexOf(b), 1)) return (afterShockSort == 1) ? -1 : 1;
                    if (lowSpeed(speedState.indexOf(a), 1) < lowSpeed(speedState.indexOf(b), 1)) return (afterShockSort == 1) ? 1 : -1;

                    return SortFunction(a, b);
                });
                CountOn();
            })

            Unit.appendChild(AfterShock);
        }
        else {
            const UnitName = document.createElement("div");
            UnitName.className = "unitName SmallFont";
            UnitName.id = `n-${i - 1 - Math.floor(i / 20) }`;
            UnitName.style.height = "100%";
            UnitName.style.border = "0.001rem solid black";
            UnitName.style.boxSizing = "border-box"; // boxSizing 추가
            UnitName.textContent = `${speedState[i - 1 - parseInt(Math.floor(i / 20))][0]}`;

            Unit.appendChild(UnitName);

            const UnitSort = document.createElement("div");
            UnitSort.className = "unitName SmallFont";
            UnitSort.id = `s-${i - 1 - Math.floor(i / 20) }`;
            UnitSort.style.height = "100%";
            UnitSort.style.border = "0.001rem solid black";
            UnitSort.boxSizing = "border-box";
            UnitSort.textContent = `${speedState[i - 1 - Math.floor(i / 20)][1][0]}`;

            Unit.append(UnitSort);

            const MoveSpeed = document.createElement("button");
            MoveSpeed.className = "Button SmallFont";
            MoveSpeed.id = `m-${i - 1 - Math.floor(i / 20)}`;
            MoveSpeed.style.height = "100%";
            MoveSpeed.style.boxSizing = "border-box"; // boxSizing 추가
            MoveSpeed.addEventListener('click', () => {
                const id = MoveSpeed.parentElement.id.split('-');
                openOverlay(-1, id[1] - 1 - Math.floor(i/20));

            })

            Unit.appendChild(MoveSpeed);
            MoveSpeed.textContent = `${(lowSpeed(MoveSpeed.parentElement.id.split('-')[1] - 1 - Math.floor(i/20), 0) * 100).toFixed(2)}%`;

            const AfterShock = document.createElement("button");
            AfterShock.className = "Button SmallFont";
            AfterShock.id = `a-${i - 1 - Math.floor(i / 20)}`;
            AfterShock.style.height = "100%";
            AfterShock.style.boxSizing = "border-box"; // boxSizing 추가
            AfterShock.addEventListener('click', () => {
                const id = AfterShock.parentElement.id.split('-');
                openOverlay(-2, id[1] - 1 - Math.floor(i / 20));
            })

            Unit.appendChild(AfterShock);
            AfterShock.textContent = `${(lowSpeed(MoveSpeed.parentElement.id.split('-')[1] - 1 - Math.floor(i / 20), 1) * 100).toFixed(2)}%`;
        }
        
        
    }


    Stack();


    const ChildChildStack = document.createElement("div");
    ChildChildStack.style.height = `2vw`;
    ChildChildStack.style.display = "grid";
    ChildChildStack.style.gridTemplateColumns = "3fr 1fr";

    document.getElementsByClassName(`Stack`)[0].appendChild(ChildChildStack);

    const Void = document.createElement("div");

    ChildChildStack.appendChild(Void);

    const StunPage = document.createElement("button");
    StunPage.className = "Stun SmallFont";
    StunPage.innerText = "스턴";

    StunPage.addEventListener('click', () => {

        Container2.replaceWith(container);
        document.getElementsByClassName("AttackSpeedEx")[0].innerText = speedBonusEx + "%";
        document.getElementsByClassName("MRegen")[0].innerText = manaRegen;
        document.getElementsByClassName("HRegen")[0].innerText = healthRegen;
    })

    ChildChildStack.appendChild(StunPage);

})

document.getElementsByClassName(`Stack`)[0].appendChild(MoveSpeedPage);

