

const container = document.getElementsByClassName("container")[0];

const containerGrid = 20;
const GridHeight = 40 / containerGrid;

document.getElementsByClassName("container")[0].style.gridTemplateRows = `repeat(${containerGrid}, 1fr)`;
const unitRates = {
    특별함: ["특별함",0],
    희귀함: ["희귀함", 1],
    전설적인: ["전설적인", 2],
    히든: ["히든", 3],
    제한됨: ["제한됨", 4],
    초월함: ["초월함", 5],
    불멸의: ["불멸의", 6],
    영원한: ["영원한",7],
    신비함: ["신비함", 8],
    특수함: ["특수함", 9]
}

const unitState = [ // 이름, 공속보너스, 공격주기, 스턴1 확률, 스턴1 지속시간, 스턴2 확률, 스턴2 지속시간, 마나통, 마나지속시간, 공속버프
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
    ['흰수염', 3.3, 0.73, 0.05, 3, 0, 0, 115, 3, 0],
    ['흰수염(약주)', 3.3, 0.73, 0.05, 3, 0, 0, 115, 3, 0]],

    [['영원한'],
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

        ['핸콕', unitRates.영원한, 3.30, 5.811, 0.075, 2.5, 60, 0, 0, 0],

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
    ['아냐 포저', "신비함", 30, 1.75, 2, 40, 0],
    ['츠바사', "랜덤", 20, 0, 0, 0, 0],
    ['베티', "특수함", 11, 1.25, 2, 0, 0],
    ['버기', "영원한", 65, 0, 0, 0, 0],
    ['레일리', "불멸의", 45, 0, 0, 0, 0],
    ['사보', "초월함", 20, 0, 0, 0, 0],
    ['상디(강화)', "초월함", 15, 0, 0, 0, 0],
    ['우타의 헤드셋', "아이템", 12, 0, 0, 0, 0],
    ['징베', "초월함", 20, 3, 0, 0, 0],
    ['쵸파', "초월함", 28, 0, 0, 0, 0],
    ['코비', "초월함", 10, 0, 0, 0, 0],
    ['발라티에', "히든", 22, 0, 0, 0, 0],
    ['크래커', "전설적인", 9, 0, 0, 0, 0],
    ['레일리', "전설적인", 20, 0, 0, 0, 0],
    ['토키', "전설적인", 20, 0, 0, 25, 0],
    ['브룩', "희귀함", 10, 0, 0, 0, 0],
    ['식량 보급', '연구소', 0, 0.8, 0, 0, 0],
    ['키쿄우', '신비함', 0, 1.5, 1.5, 0, 0],
    ['카이조 토우마', '랜덤', 0, 0.3, 0.3, 0, 0],
    ['요츠바', '랜덤', 0, 2.5, 0, 0, 0],
    ['프랑키', '초월함', 0, 5, 0, 0, 0],
    ['에넬', '제한됨', 0, 1.5, 0, 0, 0],
    ['코알라', '히든', 0, 3.25, 0, 0, 0],
    ['슈가', '전설적인', 0, 1.25, 0, 0, 0],
    ['징베', '전설적인', 0, 2.5, 0, 0, 0],
    ['슈가', '희귀함', 0, 0.6, 0, 0, 0],
    ['해상 디너', '아이템',0, 0, 0.45, 0, 0],
    ['불사조의 깃털', '아이템', 0, 0, 0.3, 0, 0],
    ['마르코', '제한됨', 0, 0, 3, 45, 0],
    ['마르코(특강)', '제한됨', 0, 0, 4, 60, 0],
    ['카타쿠리', '제한됨', 0, 0, 2.85, 0, 0],
    ['모비딕 호', '히든', 0, 0, 1.25, 40, 0],
    ['히루루크', '전설적인', 0, 0, 1.6, 0, 0],
    ['드래곤', '전설적인', 5, 0, 0, 10, 0],
    ['라분', '전설적인', 17, 0, 0, 0, 0],
    ['드래곤', '불멸의', 20, 0, 0, 0, 0],
    ['니카', '영원한', 25, 0, 0, 0, 0],
    ['우타', '영원한', 27, 0, 0, 0, 0],
    ['퀸', '히든', 0, 1, 1, 0, 0],
    ['둔화의 지팡이', '아이템', 0, 0, 0, 12, 0],
    ['비구름생성기', '아이템', 0, 0, 0, 12, 0],
    ['기후 변화', '연구소', 0, 0, 0, 10, 0],
    ['냉철함', '연구소', 0, 0, 0, 6, 0],
    ['패왕의 길', '항법', 0, 0, 0, 5, 0],
    ['사토루', '신비함', 0, 0, 0, 30, 0],
    ['히그마', '신비함', 0, 0, 0, 30, 0],
    ['쿠치키 뱌쿠야', '신비함', 0, 0, 0, 35, 0],
    ['타츠마키', '신비함', 0, 0, 0, 50, 0],
    ['엘리자베스', '신비함', 0, 0, 0, 20, 0],
    ['버기', '영원한', 0, 0, 0, 25, 0],
    ['우타', '영원한', 0, 0, 0, 45, 0],
    ['미호크', '영원한', 0, 0, 0, 45, 0],
    ['에이스', '영원한', 0, 0, 0, 45, 0],
    ['로져', '불멸의', 0, 0, 0, 50, 0],
    ['빅맘', '불멸의', 0, 0, 0, 70, 0],
    ['제트', '불멸의', 0, 0, 0, 35, 0],
    ['카이도', '불멸의', 0, 0, 0, 60, 0],
    ['조로', '초월함', 0, 0, 0, 30, 0],
    ['조로(강화)', '초월함', 0, 0, 0, 45, 0],
    ['조로(염왕)', '초월함', 0, 0, 0, 50, 0],
    ['바질 호킨스', '초월함', 0, 0, 0, 7, 0],
    ['브룩', '초월함', 0, 0, 0, 15, 0],
    ['사보', '초월함', 0, 0, 0, 35, 0],
    ['야마토', '초월함', 0, 0, 0, -15, 0],
    ['아오키지', '초월함', 0, 0, 0, 80, 0],
    ['키드', '초월함', 0, 0, 0, 33, 0],
    ['후지토라', '초월함', 0, 0, 0, 55, 0],
    ['시노부', '제한됨', 0, 0, 0, 30, 0],
    ['크로커다일', '제한됨', 0, 0, 0, 40, 0],
    ['비비', '변화된', 0, 0, 0, 20, 0],
    ['에이스', '변화된', 0, 0, 0, 20, 0],
    ['사보', '히든', 0, 0, 0, 25, 0],
    ['아오키지', '히든', 0, 0, 0, 35, 0],
    ['페로나', '히든', 0, 0, 0, 45, 0],
    ['모리아', '전설적인', 0, 0, 0, 30, 0],
    ['네코마무시', '전설적인', 0, 0, 0, 30, 0],
    ['마르코', '전설적인', 0, 0, 0, 30, 0],
    ['레이쥬', '전설적인', 0, 0, 0, 35, 0],
    ['센고쿠', '전설적인', 0, 0, 0, 20, 0],
    ['스모커', '전설적인', 0, 0, 0, 50, 0],
    ['킹', '전설적인', 0, 0, 0, 10, 0],
    ['후지토라', '전설적인', 0, 0, 0, 24, 0],
    ['X-드레이크', '전설적인', 0, 0, 0, 10, 0],
    ['키드', '희귀함', 0, 0, 0, 15, 0],
    ['아오키지', '희귀함', 0, 0, 0, 10, 0],
    ['크로커다일', '희귀함', 0, 0, 0, 15, 0],
    ['페로나', '희귀함', 0, 0, 0, 20, 0],
    ['스모커', '특별함', 0, 0, 0, 5, 0],
    ['키드', '특별함', 0, 0, 0, 5, 0],
    ['크로커다일', '특별함', 0, 0, 0, 5, 0],
]

const Rate = [
    ['우타의 헤드셋', '우타'],
    ['불사조의 깃털', '마르코', '마르코(특강)'],
]



let unitRate = [];
let stunCount = [];
let Sort = [];

for (var sortCount = 0; sortCount < 8; sortCount++) {
    unitRate[sortCount] = [];
    stunCount[sortCount] = [];
}

for (let sortCount = 0; sortCount < 8; sortCount++) {
    for (let unitCount = 0; unitCount < 10; unitCount++) {
        unitRate[sortCount][unitCount] = 0;
        stunCount[sortCount][unitCount] = 0;
    }
}

var speedDebuff= 0;
var speedBonusEx = 0;
var mana = true;
var manaRegen = 0;
var healthRegen = 0;
var totalStun = 0;

var m_nightmare = 0;
var m_god = 0;

var nameSort = 1;
var rateSort = 0;
var moveSpeedSort = 0;
var afterShockSort = 0;

const StunCalCulator =(T,X,S,L) =>
    {
        if(T==0 || X==0 || S==0 || L==0)
            return 0;
        const n = Math.floor((S - L)/T) + 1;
        const stun_duration = (L-T) * ( 1 - Math.pow(1 - X, n) ) + T / X * (1 - (n * X + 1) * Math.pow(1 - X, n)) + S *  Math.pow(1-X,n);
        const total_duration = L-T + T / X;
    
        return stun_duration / total_duration;
    }

const UnitTotalStun = () => {

    speedBonusEx = parseFloat(speedBonusEx.toFixed(3));
    manaRegen = parseFloat(manaRegen.toFixed(3));
    healthRegen = parseFloat(healthRegen.toFixed(3));
    speedDebuff = parseFloat(speedDebuff.toFixed(3));

    m_god = parseFloat((484.625-3.875*speedDebuff).toFixed(3)) < 70 ? 70 : parseFloat((484.625-3.875*speedDebuff).toFixed(3)) > 490 ? 490 : parseFloat((484.625-3.875*speedDebuff).toFixed(3));
    m_nightmare = parseFloat((542.75-3.875*speedDebuff).toFixed(3)) < 70 ? 70 : parseFloat((542.75-3.875*speedDebuff).toFixed(3)) > 490 ? 490 : parseFloat((542.75-3.875*speedDebuff).toFixed(3));

    for (var sortCount = 0; sortCount < 8; sortCount++)
    {
        for (var unitCount = 1; unitCount < unitState[sortCount].length; unitCount++)
        {
            
            var x1 = unitState[sortCount][unitCount][3];
            var x2 = (1 - unitState[sortCount][unitCount][3]) * unitState[sortCount][unitCount][5];
            var s1 = unitState[sortCount][unitCount][4];
            var s2 = unitState[sortCount][unitCount][6];
            let t = 1 / unitState[sortCount][unitCount][2] * ((1 + unitState[sortCount][unitCount][1] + parseFloat((((stunCount[sortCount][unitCount]) ? speedBonusEx - unitState[sortCount][unitCount][9] : speedBonusEx) / 100).toFixed(3)) > 5) ? 5 : (1 + unitState[sortCount][unitCount][1] + parseFloat((((stunCount[sortCount][unitCount]) ? speedBonusEx - unitState[sortCount][unitCount][9] : speedBonusEx) / 100).toFixed(3))));

            if(unitState[sortCount][unitCount][0]==="우타")
            {
                const index = BuffState.findIndex((items) => {return items.includes("우타의 헤드셋")});
                t = 1 / unitState[sortCount][unitCount][2] * ((1 + unitState[sortCount][unitCount][1] + parseFloat((( speedBonusEx - (stunCount[sortCount][unitCount] ? unitState[sortCount][unitCount][9] - BuffState[index][2] : 0) - (BuffState[index][6] ? BuffState[index][2] : 0)) / 100).toFixed(3)) > 5) ? 5 : (1 + unitState[sortCount][unitCount][1] + parseFloat((( speedBonusEx - (stunCount[sortCount][unitCount] ? unitState[sortCount][unitCount][9] - BuffState[index][2]: 0) - (BuffState[index][6] ? BuffState[index][2] : 0)) / 100).toFixed(3))));
            }
            var maxMana = unitState[sortCount][unitCount][7];
            var m_stun = unitState[sortCount][unitCount][8];
            var n1 = Math.floor(s1 * t);
            var n2 = Math.floor(s2 * t);
            var stun = 0;

            if (unitState[sortCount][unitCount][0] === "라분") // 라분
            {
                for (var k = 0; k < 6; k++) {
                    window['time' + k] = k / t;
                }
                stun = Math.log(1 - (((0.65 + time0 > 2.15) ? 2.15 : (0.65 + time0)) * 0.27 + ((0.65 + time1 > 2.15) ? 2.15 : (0.65 + time1)) * 0.27 * (1 - 0.27) + ((0.65 + time2 > 2.15) ? 2.15 : (0.65 + time2)) * 0.27 * Math.pow(1 - 0.27, 2) + ((0.65 + time3 > 2.15) ? 2.15 : (0.65 + time3)) * 0.27 * Math.pow(1 - 0.27, 3) + ((0.65 + time4 > 2.15) ? 2.15 : (0.65 + time4)) * 0.27 * Math.pow(1 - 0.27, 4) + ((0.65 + time5 > 2.15) ? 2.15 : (0.65 + time5)) * (1 - 0.27 - 0.27 * (1 - 0.27) - 0.27 * Math.pow(1 - 0.27, 2) - 0.27 * Math.pow(1 - 0.27, 3) - 0.27 * Math.pow(1 - 0.27, 4))) / ((0.65 + time0) * 0.27 + (0.65 + time1) * 0.27 * (1 - 0.27) + (0.65 + time2) * 0.27 * Math.pow(1 - 0.27, 2) + (0.65 + time3) * 0.27 * Math.pow(1 - 0.27, 3) + (0.65 + time4) * 0.27 * Math.pow(1 - 0.27, 4) + (0.65 + time5 ) * (1 - (0.27 + 0.27 * Math.pow(1 - 0.27, 1) + 0.27 * Math.pow(1 - 0.27, 2) + 0.27 * Math.pow(1 - 0.27, 3) + 0.27 * Math.pow(1 - 0.27, 4))))) / Math.log(0.2);
            }
            else if(unitState[sortCount][unitCount][0] === "죠즈")
            {
                stun = Math.log(1 - StunCalCulator(1/t, x1, s1, 0.855)) / Math.log(0.2);
            }
            else if (unitState[sortCount][0][0] === '초월함' && unitState[sortCount][unitCount][0] === "샹크스") // 샹크스
            {
                stun = Math.log(-(x1 * s1 * t - n1 * x1 - 1) * Math.pow(1 - x1, n1) * -(x2 * s2 * t - n2 * x2 - 1) * Math.pow(1 - x2, n2) * (1 - 3 / 14.25) * (1 - 3 * (1.35 + manaRegen) / 35)) / Math.log(0.2);
            }
            else if (unitState[sortCount][0][0] === '초월함' && unitState[sortCount][unitCount][0] === "루피")
            {
                let n3 = Math.ceil(1.75 * t);
                let time = n3 / t;
                let n4 = Math.floor((2.75 - time) * t);
                if (mana)
                    stun = Math.log((1 - ((time + 1 / t / 0.0125 * (1 - (n4 * 0.0125 + 1) * Math.pow(1 - 0.0125, n4))) / (time + 1 / t / 0.0125)) * (1 + (x1 * s1 * t - n1 * x1 - 1) * Math.pow(1 - x1, n1))) * (1 - ((maxMana != 0) ? m_stun / (maxMana / (t + manaRegen)) : 0))) / Math.log(0.2);
                else
                    stun = Math.log(1 - ((time + 1 / t / 0.0125 * (1 - (n4 * 0.0125 + 1) * Math.pow(1 - 0.0125, n4))) / (time + 1 / t / 0.0125)) * (1 + (x1 * s1 * t - n1 * x1 - 1) * Math.pow(1 - x1, n1))) / Math.log(0.2);
            }
            else if (unitState[sortCount][0][0] ==='초월함' &&  unitState[sortCount][unitCount][0] === "아오키지") // 아오키지
            {
                stun = Math.log(-(x1 * s1 * t - n1 * x1 - 1) * Math.pow(1 - x1, n1) * (1 - 3 / (1 / t / 0.125 * Math.pow(1 - 0.125, Math.floor(25 / (1 + 1 / t * manaRegen))) + 50 / (t + manaRegen)))) / Math.log(0.2);
            }
            else if (unitState[sortCount][unitCount][0] === "흰수염") // 흰수염
            {
                if(mana)
                    stun = Math.log((1 - StunCalCulator(1/t, x1, s1, 0.69)) *
                        (1 - ( m_stun / (maxMana / (t + healthRegen + 0.5))))) / Math.log(0.2);
                else
                    stun = Math.log(1 - StunCalCulator(1/t, x1, s1, 0.69)) / Math.log(0.2);
            }
            else if(unitState[sortCount][unitCount][0] === "흰수염(약주)")
            {
                if(mana)
                    stun = Math.log((1 - StunCalCulator(1/t, x1, s1, 0.49)) *
                (1 - ( m_stun / (maxMana / (t + healthRegen + 0.5))))) / Math.log(0.2);
                else
                    stun = Math.log(1 - StunCalCulator(1/t, x1, s1, 0.49)) / Math.log(0.2);
                
            }
            else if (unitState[sortCount][unitCount][0]==="타츠마키") // 타츠마키
            {
                if(mana)
                    stun = Math.log(-(x1 * s1 * t - n1 * x1 - 1) * Math.pow(1 - x1, n1) * -(x2 * s2 * t - n2 * x2 - 1) * Math.pow(1 - x2, n2) * (1 - (m_stun / (maxMana / (t + healthRegen))))) / Math.log(0.2);
                else
                    stun = Math.log(-(x1 * s1 * t - n1 * x1 - 1) * Math.pow(1 - x1, n1) * -(x2 * s2 * t - n2 * x2 - 1) * Math.pow(1 - x2, n2)) / Math.log(0.2);
            }
            else if (unitState[sortCount][unitCount][0] === "크로커다일(특강)")
            {
                if (mana)
                    stun = Math.log(-(x1 * s1 * t - n1 * x1 - 1) * Math.pow(1 - x1, n1) * -(x2 * s2 * t - n2 * x2 - 1) * Math.pow(1 - x2, n2) * (1 - ((maxMana != 0) ? m_stun / (maxMana / (t + healthRegen)) : 0))) / Math.log(0.2);
                else
                    stun = Math.log(-(x1 * s1 * t - n1 * x1 - 1) * Math.pow(1 - x1, n1) * -(x2 * s2 * t - n2 * x2 - 1) * Math.pow(1 - x2, n2)) / Math.log(0.2);
            }
            else if (unitState[sortCount][unitCount][0] === "니카")
            {
                let t2 = 1 / unitState[sortCount][unitCount][2] * ((1 + unitState[sortCount][unitCount][1] + parseFloat((((stunCount[sortCount][unitCount]) ? speedBonusEx - unitState[sortCount][unitCount][9] : speedBonusEx) / 100).toFixed(3)) - 2.25 > 5) ? 5 : (1 + unitState[sortCount][unitCount][1] + parseFloat((((stunCount[sortCount][unitCount]) ? speedBonusEx - unitState[sortCount][unitCount][9] : speedBonusEx) / 100).toFixed(3))- 2.25));
                let time = (4.25 + ((115 - 4.25 * (t2 + healthRegen + 0.25)) / (t + healthRegen + 0.25)) <= 4.25) ? 4.25 : (4.25 + ((115 - 4.25 * (t2 + healthRegen + 0.25)) / (t + healthRegen + 0.25)));
                n2 = Math.floor(s1 * t2);

                if (mana)
                    stun = Math.log(
                        ((1 - (1 + (0.18 * s1 * t2 - n2 * 0.18 - 1) * Math.pow(1 - 0.18, n2)) * 4.25 / time - (1 + (x1 * s1 * t - n1 * x1 - 1) * Math.pow(1 - x1, n1)) * (time - 4.25) / time)) * (1 - m_stun / maxMana * ((4.25 * t2 + (time - 4.25) * t) / time + manaRegen)))
                        / Math.log(0.2);
                else
                    stun = Math.log((1-(1 + (0.18 * s1 * t2 - n2 * 0.18 - 1) * Math.pow(1 - 0.18, n2)) * 4.25 / time )- (1 + (x1 * s1 * t - n1 * x1 - 1) * Math.pow(1 - x1, n1))* (time - 4.25) / time) / Math.log(0.2);
            }
            else if (mana)
                stun = Math.log((1-StunCalCulator(1/t, x1, s1, 1/t)) * (1-StunCalCulator(1/t, x2, s2, 1/t)) * (1 - ((maxMana != 0) ? m_stun / (maxMana / (t + manaRegen)) : 0))) / Math.log(0.2);
            else
                stun = Math.log(-(x1 * s1 * t - n1 * x1 - 1) * Math.pow(1 - x1, n1) * -(x2 * s2 * t - n2 * x2 - 1) * Math.pow(1 - x2, n2)) / Math.log(0.2);

            unitRate[sortCount][unitCount] = stun;
        }
    }
}

const Unit = unitState[0].length + unitState[1].length + unitState[2].length + unitState[3].length + unitState[4].length + unitState[5].length + unitState[6].length + unitState[7].length;

function SetElemental(){
    document.getElementsByClassName("TotalStun")[0].innerText = totalStun.toFixed(3) + "스턴";
    document.getElementsByClassName("MRegen")[0].innerText = manaRegen;
    document.getElementsByClassName("HRegen")[0].innerText = healthRegen;
    document.getElementsByClassName("AttackSpeedEx")[0].innerText = speedBonusEx + "%";
    document.getElementsByClassName("Debuff")[0].innerText = speedDebuff + "%";
}

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

            const Count = document.getElementById(`c-${sortCount}-${unitCount}`);
            Count.innerText = stunCount[sortCount][unitCount];

            totalStun += stunCount[sortCount][unitCount] ? unitRate[sortCount][unitCount] * stunCount[sortCount][unitCount] : 0;
        }
        }
    }
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

    SetElemental();
}

function lowSpeed(unitcount, AfterShock) {
    var Rate = 0;
    var x = 0;
    var s = 0;
    var t = 0;

    // 1. t 계산
    var t = speedState[unitcount][3] / (1 + speedState[unitcount][2]) *
        (((1 + speedState[unitcount][2] +
            parseFloat((speedBonusEx / 100).toFixed(3))) > 5) ? 5 :
            (1 + speedState[unitcount][2] +
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
        if(sortCount!==400 || unitCount !== 400)
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

    overlayContent.addEventListener("click", function (event) {
        event.stopPropagation();
    });
    if(sortCount === 400 && unitCount === 400)
        {
            const closeButton = document.createElement("button");
            closeButton.innerText = "X";
            closeButton.style.position = "absolute";
            closeButton.style.top = "10px";
            closeButton.style.right = "10px";
            closeButton.style.background = "red";
            closeButton.style.color = "white";
            closeButton.style.border = "none";
            closeButton.style.padding = "5px 10px";
            closeButton.style.cursor = "pointer";
            closeButton.style.fontSize = "16px";
            closeButton.style.borderRadius = "5px";
            closeButton.onclick = () => document.body.removeChild(overlay);
        
            overlayContent.appendChild(closeButton);
        }



    // 3. 콘텐츠 박스 상단에 타이틀 추가
    const title = document.createElement("h2");
    title.style.textAlign = "center";
    title.style.marginBottom = "1vh";

    if (sortCount == 100 && unitCount == 100) 
        title.textContent = `${totalStun.toFixed(3)}스턴`;
    else if (sortCount == 200 && unitCount == 200)
        title.textContent = `가동률 공식`;
    else if (sortCount == 300 && unitCount == 300)
        title.textContent = "이동속도 감소";
    else if(sortCount == 400 && unitCount == 400)
        title.textContent = "스턴 계산기";
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

        for (let i = 1; i <= 10; i++) {
            const item = document.createElement("li");
            item.textContent = ``;
            item.style.padding = "0.5rem 0";
            item.style.borderBottom = "0.1rem solid #ddd";
            let result = 0;
            switch (i) {
                case 1:
                    item.textContent = `스턴 가동률 : ${((1 - Math.pow(0.2, totalStun)) * 100).toFixed(2)}%`;
                    break;
                case 2:
                    item.textContent = `스턴 샐 확률 : ${(Math.pow(0.2, totalStun) * 100).toFixed(2)}%`;
                    break;
                case 3:
                    result = m_god * Math.pow(0.2, totalStun)
                    result = result % 1 === 0 ? result.toString() : result.toFixed(3);

                    item.textContent = `초당 몹 이동 거리(신 기준) : ${result}`;
                    break;
                case 4:                    
                    result = 35 * m_god * Math.pow(0.2, totalStun)
                    result = result % 1 === 0 ? result.toString() : result.toFixed(3);
                    item.textContent = `35초 후 몹 이동 거리(신 기준) : ${result}`;
                    break;
                case 5:
                    result = 14 * m_god * Math.pow(0.2, totalStun)
                    result = result % 1 === 0 ? result.toString() : result.toFixed(3);
                    item.textContent = `14초 후 몹 이동 거리(신 기준) : ${result}`;
                    break;
                case 6:
                    break;
                case 7:
                    result = m_nightmare * Math.pow(0.2, totalStun)
                    result = result % 1 === 0 ? result.toString() : result.toFixed(3);
                    item.textContent = `초당 몹 이동 거리(악몽 기준) : ${result}`;
                    break;
                case 8:
                    result = 35 * m_nightmare * Math.pow(0.2, totalStun)
                    result = result % 1 === 0 ? result.toString() : result.toFixed(3);
                    item.textContent = `35초 후 몹 이동 거리(악몽 기준) : ${result}`;
                    break;
                case 9:
                    result = 14 * m_nightmare * Math.pow(0.2, totalStun)
                    result = result % 1 === 0 ? result.toString() : result.toFixed(3);
                    item.textContent = `14초 후 몹 이동 거리(악몽 기준) : ${result}`;
                    break;
                case 10:
                    item.textContent = `최소 스턴 범위 : ${Sort.length ? Sort[0][2] : 0}`;
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
    else if (sortCount == 300 && unitCount == 300)
    {
        for (let i = 0; i <= 6; i++) {
            const item = document.createElement("li");
            item.textContent = `Item ${i}`;
            item.style.padding = "0.5rem   0";
            item.style.borderBottom = "0.1rem solid #ddd";

            switch (i) {
                case 0:
                    item.textContent = `수치 : ${speedDebuff}%`
                    break;
                case 1:
                    item.textContent = `※이감 40%당 이속 155 감소`
                    break;
                case 2:
                    item.textContent = `※이감 1%당 이속 3.875 감소`
                    break;
                case 3:
                    item.textContent = `신 최대 이감 : 107%`
                    break;
                case 4:
                    item.textContent = `악몽 최대 이감 : 122%`;
                    break;
                case 5:
                    item.textContent = `몹 이동속도(신) : ${m_god}`;
                    break;
                case 6:
                    item.textContent = `몹 이동속도(악몽) : ${m_nightmare}`;
                    break;
            }

            itemList.appendChild(item);
        }
    }
    else if(sortCount == 400 && unitCount == 400)
    {
        for(let i=0; i<=5;i++)
        {   overlayContent.style.margin = "auto";

            const item = document.createElement("div");

            const input = document.createElement("input");
            input.type = "number";
            input.style.width = "90%";
            input.style.padding = "8px";
            input.style.margin = "5px 5px";

            switch(i)
            {
                case 0:            
                    item.textContent = "공격 주기: ";
                    input.id = "attack_speed";
                    break;
                case 1:
                    item.textContent = "공속 보너스 (%): ";
                    input.id = "attack_speed_bonus";
                    break;
                    case 2:
                        item.textContent = "스턴 1 확률 (%): ";
                        input.id = "stun1_prob";
                        break;
                    case 3:
                        item.textContent = "스턴 1 지속시간 (초): ";
                        input.id = "stun1_duration";
                        break;                
                        case 4:
                        item.textContent = "스턴 2 확률 (%): ";
                        input.id = "stun2_prob";
                        break;
                    case 5:
                        item.textContent = "스턴 2 지속시간 (초): ";
                        input.id = "stun2_duration";
                        break;
            }
            item.appendChild(input);
            overlayContent.appendChild(item);

        }
        
        const StunButton = document.createElement("button");
        StunButton.className = "Button";
        StunButton.style.fontSize = "1.1vw";
        StunButton.innerText = "입  력";
        StunButton.style.width = "100%";
        StunButton.style.padding = "10px";
        StunButton.style.marginTop = "10px";

        ButtonColor(StunButton);

        StunButton.addEventListener("click", ()=>{
            document.querySelectorAll(".StunDocument").forEach(el => overlayContent.removeChild(el));

           
            const attack_speed = document.getElementById("attack_speed").value;
            const attack_speed_bonus = document.getElementById("attack_speed_bonus").value;
            const t = 1 / attack_speed *( (1 + parseFloat((attack_speed_bonus/100).toFixed(3)) ) > 5 ? 5 : (1 + parseFloat((attack_speed_bonus/100).toFixed(3))) );
            const bigOne = document.getElementById("stun1_duration").value > document.getElementById("stun2_duration").value ? true : false;

            let x1 = parseFloat((document.getElementById("stun1_prob").value / 100).toFixed(3));
            const s1 = document.getElementById("stun1_duration").value;
            const n1 = Math.floor(s1 * t);
            let x2 = parseFloat((document.getElementById("stun2_prob").value / 100).toFixed(3));
            const s2 = document.getElementById("stun2_duration").value;
            const n2 = Math.floor(s2 * t);

            x1 = bigOne ? x1 : (x1 - x1 * x2);
            x2 = !bigOne ? x2 : (x2 - x1 * x2);
            
            const degree1 = 1 + ( x1 * s1 * t - n1 * x1 -1 ) * Math.pow( 1 - x1 , n1 );
            const degree2 = 1 + ( x2 * s2 * t - n2 * x2 -1 ) * Math.pow( 1 - x2 , n2 );
            if(attack_speed===0 || attack_speed_bonus === 0 || x1 === 0 || s1 === 0)
                alert("잘못된 정보입니다.");
            else
            for(let i=0;i<=5;i++)
            {   
                const Stun = document.createElement("div");
                Stun.className = "StunDocument"
                switch(i)
                {
                    case 0:
                        Stun.innerText = `공격 속도 : ${t.toFixed(3)}`
                        break;
                    case 1:
                        Stun.innerText = `스턴 1 등급 : ${(Math.log(1-degree1) / Math.log(0.2)).toFixed(3)} 스턴`
                        break;
                    case 2:
                        Stun.innerText = `스턴 1 가동률 : ${(degree1*100).toFixed(3)} %`
                        break;                    
                    case 3:
                        Stun.innerText = `스턴 2 등급 : ${(Math.log(1-degree2) / Math.log(0.2)).toFixed(3)} 스턴`
                        break;
                    case 4:
                        Stun.innerText = `스턴 2 가동률 : ${(degree2*100).toFixed(3)} %`
                        break;
                }
                overlayContent.appendChild(Stun);
            }
        })

        overlayContent.appendChild(StunButton);
    }
    else if (sortCount == -1) {
        if (speedState[unitCount][5] == 0)
            return;
        var t = speedState[unitCount][3] / (1 + speedState[unitCount][2]) *
            (((1 + speedState[unitCount][2] +
                parseFloat((speedBonusEx / 100).toFixed(3))) > 5) ? 5 :
                (1 + speedState[unitCount][2] +
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
                parseFloat((speedBonusEx / 100).toFixed(3))) > 5) ? 5 :
                (1 + speedState[unitCount][2] +
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
        let t = 1 / unitState[sortCount][unitCount][2] * ((1 + unitState[sortCount][unitCount][1] + parseFloat((((stunCount[sortCount][unitCount]) ? speedBonusEx - unitState[sortCount][unitCount][9] : speedBonusEx) / 100).toFixed(3)) > 5) ? 5 : (1 + unitState[sortCount][unitCount][1] + parseFloat((((stunCount[sortCount][unitCount]) ?  speedBonusEx - unitState[sortCount][unitCount][9] : speedBonusEx) / 100).toFixed(3))));
        let t2 = 1 / unitState[sortCount][unitCount][2] * ((1 + unitState[sortCount][unitCount][1] + parseFloat((((stunCount[sortCount][unitCount]) ?  speedBonusEx - unitState[sortCount][unitCount][9] : speedBonusEx) / 100).toFixed(3)) - 2.25 > 5) ? 5 : (1 + unitState[sortCount][unitCount][1] + parseFloat((((stunCount[sortCount][unitCount]) ?  speedBonusEx - unitState[sortCount][unitCount][9] : speedBonusEx) / 100).toFixed(3))- 2.25));
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
                    item.textContent = `공속 보너스(자체 버프 포함) : ${(unitState[sortCount][unitCount][1] + parseFloat((speedBonusEx / 100).toFixed(3)) - ((stunCount[sortCount][unitCount]) ? parseFloat((unitState[sortCount][unitCount][9] / 100).toFixed(3)) : 0)) * 100}%`;
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
        var x2 = (1 - unitState[sortCount][unitCount][3]) * unitState[sortCount][unitCount][5];
        var s1 = unitState[sortCount][unitCount][4];
        var s2 = unitState[sortCount][unitCount][6];
        let t = 1 / unitState[sortCount][unitCount][2] * ((1 + unitState[sortCount][unitCount][1] + parseFloat((((stunCount[sortCount][unitCount]) ? 0 : speedBonusEx) / 100).toFixed(3)) > 5) ? 5 : (1 + unitState[sortCount][unitCount][1] + parseFloat((((stunCount[sortCount][unitCount]) ? 0 : speedBonusEx) / 100).toFixed(3))));

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
                    item.innerText = `공속 보너스(자체 버프 포함) : ${((unitState[sortCount][unitCount][1] + parseFloat((speedBonusEx / 100).toFixed(3)) - ((stunCount[sortCount][unitCount]) ? parseFloat((unitState[sortCount][unitCount][9] / 100).toFixed(3)) : 0)) * 100).toFixed(2)}%`;
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
                    item.innerText = `스턴 2 확률 : ${(unitState[sortCount][unitCount][5] * 100).toFixed(2)}%`
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
    speedBonusEx = 0;
    totalStun = 0;
    manaRegen = 0;
    healthRegen = 0;
    speedDebuff = 0;


    if (document.getElementById("container1") != null)
        for (var sortCount = 0; sortCount < unitState.length; sortCount++) {
            for (var unitCount = 1; unitCount < unitState[sortCount].length; unitCount++) {
                stunCount[sortCount][unitCount] = 0;
                document.getElementById(`c-${sortCount}-${unitCount}`).innerText = "0";
            }
        }

    BuffState.forEach((item) => {
        item[6] = false;
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

function BuffAdd(checked, item)
{
    speedBonusEx += checked ? item[2] : -item[2];
    manaRegen += checked ? item[3] : -item[3];
    healthRegen += checked ? item[4] : -item[4];
    speedDebuff += checked ? item[5] : -item[5];
    item[6] = checked ? true : false;
}


function Collect(item, index)
{
    const ClassN = [`s${index}`, `m${index}`, `h${index}`, `d${index}`]
    for(let i=0;i<=3;i++)
    {
        if(item[i+2] != 0)
        {
            document.getElementsByClassName(ClassN[i])[0].checked = item[6];
        }
    }        
}

function CheckEvent(Check, item, index) {
    Check.addEventListener("change", (event) => {

        let sortCount = unitState.findIndex(items => items[0][0] === item[1]);
        let unitCount = -1;

        if(sortCount !== -1)
            unitCount = unitState[sortCount].findIndex(items => items[0] === item[0]);

        if (event.target.checked) {

            if(sortCount !== -1 && unitCount !== -1 && !stunCount[sortCount][unitCount])
            {
                stunCount[sortCount][unitCount] = 1;
            }

            let int = Rate.findIndex((items) => {
                return items.includes(item[0]);
            })  ;
            if(int !== -1)
            {
                let row = Rate[int].findIndex(items => items === item[0]);

                BuffAdd(event.target.checked,BuffState[index]);    
                
                let find = -1;
                for(let i = row-1; i>=0;i--)
                {
                    if(BuffState[BuffState.findIndex(items => items[0] === Rate[int][i] )][6]==true)
                    {
                        find = BuffState.findIndex((items => items[0] === Rate[int][i]));
                        break;
                    }
                }
   
                if(find !== -1)
                {
                    event.target.checked = false;
                     BuffAdd(event.target.checked, BuffState[find]);
                     event.target.checked = true;
                }
                
                for(let i=row; i>=0;i--)
                {
                    let col = BuffState.findIndex(items => items[0] === Rate[int][i] );
                    BuffState[col][6] = true;
                    Collect(BuffState[col], col);
                }


            }
            else
            {
                BuffAdd(event.target.checked, BuffState[index]);
                Collect(BuffState[index], index);
            }
        }
        else {

            if(sortCount !== -1 && unitCount !== -1 && stunCount[sortCount][unitCount])
                {
                    stunCount[sortCount][unitCount] = 0;
                }

            let int = Rate.findIndex((items => items.includes(item[0])));

            if(int !== -1)
            {
                let row = Rate[int].findIndex((items => items === item[0] ));
                let length = Rate[int].length;

                let find = -1;
                for(let i = length-1; i >= row; i--)
                {
                    if(BuffState[BuffState.findIndex(items => items[0] === Rate[int][i] )][6]==true)
                    {
                        find = BuffState.findIndex(items => items[0] === Rate[int][i]);
                        break;
                    }
                }
                BuffAdd(event.target.checked, BuffState[find]);



                if(row !== 0)
                {
                    event.target.checked = true;
                    BuffAdd(event.target.checked, BuffState[BuffState.findIndex(items => items[0] === Rate[int][row-1])]);
                    event.target.checked = false;
                }

                for(let i=row;i<length;i++)
                {
                    let col = BuffState.findIndex(items => items[0] === Rate[int][i] );
                    BuffState[col][6] = false;
                    Collect(BuffState[col], col);
                }
            }
            else
            {
                BuffAdd(event.target.checked, BuffState[index]);
                Collect(BuffState[index], index);
            }
        }
        UnitTotalStun();
        CountOn();
    })

}

function ButtonColor(name) {
    name.style.background = "rgb(235, 235, 235)";

    name.addEventListener('mouseenter', () => {
        name.style.background = "rgb(215, 215, 215)";
    });

    name.addEventListener('mouseleave', () => {
        name.style.background ="rgb(235, 235, 235)";
    });

    name.addEventListener('mousedown', () => {
        name.style.background = "rgb(250, 250, 250)";
    });

    name.addEventListener('mouseup', () => {
        name.style.background = "rgb(225, 225, 225)";
    });
}

function separateKorean(text) {
    const CHO = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ";
    const JUNG = "ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ";
    const JONG = "ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ";

    let result = "";
    
    for (let char of text) {
        const code = char.charCodeAt(0) - 44032;
        
        if (code < 0 || code > 11171) {
            result += char; // 한글이 아니면 그대로 추가
            continue;
        }
        
        const cho = CHO[Math.floor(code / 588)];
        const jung = JUNG[Math.floor((code % 588) / 28)];
        const jong = JONG[(code % 28) - 1] || ""; // 받침이 없으면 빈 문자열

        result += cho + jung + jong; // 초성 + 중성 + 종성 합쳐서 저장
    }
    
    return result;
}


function Stack() {

    for (let i = 0; i <= 4; i++) {
        const Stack = document.createElement("div");
        Stack.className = `Stack${i}`
        Stack.style.display = "grid";   
        Stack.style.gridArea = ` ${containerGrid - i} / 3 /  ${containerGrid + 1 - i} / 4`;

        document.getElementsByClassName("container")[0].appendChild(Stack);

        if (i === 0)
            Stack.style.gridTemplateColumns = "6fr 4fr";
        else
            Stack.style.gridTemplateColumns = "repeat(4, 1fr)";
    }
    


    const TotalStun = document.createElement("div");
    TotalStun.className = 'Button TotalStun BigFont';
    TotalStun.addEventListener('click', () => {
        openOverlay(100, 100);
    });
    TotalStun.innerText = `${totalStun.toFixed(3)}스턴`;
    ButtonColor(TotalStun);

    document.getElementsByClassName(`Stack0`)[0].appendChild(TotalStun);


    const clear = document.createElement("div");
    clear.className = "Button clear BigFont";
    clear.innerText = '초기화';
    clear.addEventListener("click", ClearAll);
    ButtonColor(clear);

    document.getElementsByClassName(`Stack0`)[0].appendChild(clear);

    const DebuffOverlay = document.createElement("div");
    DebuffOverlay.className = "SpeedBonusExOverlay";
    DebuffOverlay.style.position = "fixed";
    DebuffOverlay.style.top = 0;
    DebuffOverlay.style.left = 0;
    DebuffOverlay.style.width = "100%";
    DebuffOverlay.style.height = "100%";
    DebuffOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    DebuffOverlay.style.zIndex = 1000;
    DebuffOverlay.style.display = "flex";
    DebuffOverlay.style.justifyContent = "center";
    DebuffOverlay.style.alignItems = "center";
    DebuffOverlay.style.visibility = "hidden";

    DebuffOverlay.addEventListener("click", () => {
        DebuffOverlay.style.visibility = (DebuffOverlay.style.visibility === "hidden") ? "visible" : "hidden";
        DebuffScroll.style.visibility = (DebuffScroll.style.visibility === "hidden") ? "visible" : "hidden";

        DebuffspeedBonusExSearchBar.querySelector("input").value = ""; 

        // 모든 항목 다시 보이게 설정
        let items = document.querySelectorAll(".CheckBox-Stack");
        items.forEach(item => {
            item.style.display = "flex"; // 모든 항목을 표시
        });
    });

    document.body.appendChild(DebuffOverlay);

// ✅ 1️⃣ 스크롤 가능한 컨테이너(`DebuffScroll`) 동적 생성
    const DebuffScroll = document.createElement("div");
    DebuffScroll.className = "SmallFont";
    DebuffScroll.style.position = "absolute";
    DebuffScroll.style.height = "60vh";
    DebuffScroll.style.overflowY = "auto";  // 스크롤 가능하게 설정
    DebuffScroll.style.background = "white";
    DebuffScroll.style.border = "0.05rem solid #ccc";
    DebuffScroll.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.2)";

    // ✅ 2️⃣ 검색창(`DebuffspeedBonusExSearchBar`)을 `DebuffScroll` 안에 동적으로 추가
    const DebuffspeedBonusExSearchBar = document.createElement("div");
    DebuffspeedBonusExSearchBar.className = "search-bar";
    DebuffspeedBonusExSearchBar.style.position = "sticky"; // ✅ 스크롤해도 고정되게 설정
    DebuffspeedBonusExSearchBar.style.zIndex = 1000;
    DebuffspeedBonusExSearchBar.style.top = "0";
    DebuffspeedBonusExSearchBar.style.left = "0";
    DebuffspeedBonusExSearchBar.style.width = "100%";
    DebuffspeedBonusExSearchBar.style.background = "white";
    DebuffspeedBonusExSearchBar.style.padding = "10px";
    DebuffspeedBonusExSearchBar.style.borderBottom = "1px solid #ccc";
    DebuffspeedBonusExSearchBar.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.2)";
    DebuffspeedBonusExSearchBar.innerHTML = `<input type="text" placeholder="검색어 입력..." style="width: 80%; padding: 8px;">`;

    DebuffspeedBonusExSearchBar.querySelector("input").addEventListener("input", function () {
        let query = this.value.trim().toLowerCase(); // 검색어를 공백을 제외한 소문자로 변환
        query = separateKorean(query); // 검색어 한글 분리
    
        let items = document.querySelectorAll(".CheckBox-Stack");
    
        if (query === "") {
            items.forEach(item => {
                item.style.display = "flex"; // 검색어가 없으면 모든 항목 표시
            });
        } else {
            items.forEach(item => {
                let text = item.innerText.toLowerCase(); // 텍스트 가져오기
                let separatedText = separateKorean(text); // 리스트 항목도 한글 분리
    
                if (separatedText.includes(query)) {
                    item.style.display = "flex"; // 검색어가 포함되면 표시
                } else {
                    item.style.display = "none"; // 검색어가 없으면 숨김
                }
            });
        }
    });

// ✅ 3️⃣ `DebuffScroll`에 `DebuffspeedBonusExSearchBar` 추가 + `body`에 추가
    DebuffScroll.appendChild(DebuffspeedBonusExSearchBar);  // 검색창을 스크롤 박스 안에 추가

// ✅ 4️⃣ `scroll` 이벤트 필요 없음 (CSS `sticky` 사용)

    
    // ✅ 클릭 이벤트 방지 (필요하면 유지)
    DebuffScroll.addEventListener("click", function (event) {
        event.stopPropagation();
    });
    

    const SpeedBonusExButton = document.createElement("div");
    SpeedBonusExButton.className = "AttackSpeedEx Button BigFont";
    SpeedBonusExButton.innerText = `${speedBonusEx}%`;
    SpeedBonusExButton.style.textAlign = "right";
    SpeedBonusExButton.style.alignContent = "center";
    SpeedBonusExButton.style.paddingRight = "0.25vw";
    ButtonColor(SpeedBonusExButton);
    

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
    SpeedBonusExOverlay.style.visibility = "hidden";

    SpeedBonusExOverlay.addEventListener("click", () => {
        SpeedBonusExOverlay.style.visibility = (SpeedBonusExOverlay.style.visibility === "hidden") ? "visible" : "hidden";
        speedBonusExScroll.style.visibility = (speedBonusExScroll.style.visibility === "hidden") ? "visible" : "hidden";

        speedBonusExSearchBar.querySelector("input").value = ""; 

        // 모든 항목 다시 보이게 설정
        let items = document.querySelectorAll(".CheckBox-Stack");
        items.forEach(item => {
            item.style.display = "flex"; // 모든 항목을 표시
        });
        
       });

    document.body.appendChild(SpeedBonusExOverlay);

    const speedBonusExScroll = document.createElement("div");
    speedBonusExScroll.className = "SmallFont";
    speedBonusExScroll.style.position = "absolute";
    speedBonusExScroll.style.height = "60vh";
    speedBonusExScroll.style.overflowY = "auto";
    speedBonusExScroll.style.background = "white";
    speedBonusExScroll.style.border = "0.05rem solid #ccc";
    speedBonusExScroll.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.2)";

    speedBonusExScroll.addEventListener("click", function (event) {
        event.stopPropagation();
    });

    const speedBonusExSearchBar = document.createElement("div");
    speedBonusExSearchBar.className = "search-bar";
    speedBonusExSearchBar.style.position = "sticky"; // ✅ 스크롤해도 고정되게 설정
    speedBonusExSearchBar.style.zIndex = 1000;
    speedBonusExSearchBar.style.top = "0";
    speedBonusExSearchBar.style.left = "0";
    speedBonusExSearchBar.style.width = "100%";
    speedBonusExSearchBar.style.background = "white";
    speedBonusExSearchBar.style.padding = "10px";
    speedBonusExSearchBar.style.borderBottom = "1px solid #ccc";
    speedBonusExSearchBar.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.2)";
    speedBonusExSearchBar.innerHTML = `<input type="text" placeholder="검색어 입력..." style="width: 80%; padding: 8px;">`;

    speedBonusExSearchBar.querySelector("input").addEventListener("input", function () {
        let query = this.value.trim().toLowerCase(); // 검색어를 공백을 제외한 소문자로 변환
        query = separateKorean(query); // 검색어 한글 분리
    
        let items = document.querySelectorAll(".CheckBox-Stack");
    
        if (query === "") {
            items.forEach(item => {
                item.style.display = "flex"; // 검색어가 없으면 모든 항목 표시
            });
        } else {
            items.forEach(item => {
                let text = item.innerText.toLowerCase(); // 텍스트 가져오기
                let separatedText = separateKorean(text); // 리스트 항목도 한글 분리
    
                if (separatedText.includes(query)) {
                    item.style.display = "flex"; // 검색어가 포함되면 표시
                } else {
                    item.style.display = "none"; // 검색어가 없으면 숨김
                }
            });
        }
    });
    speedBonusExScroll.appendChild(speedBonusExSearchBar);  // 검색창을 스크롤 박스 안에 추가

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
    MRegenOverlay.style.visibility = "hidden";

    MRegenOverlay.addEventListener("click", () => {
        MRegenOverlay.style.visibility = (MRegenOverlay.style.visibility === "hidden") ? "visible" : "hidden";
        MRegenScroll.style.visibility = (MRegenScroll.style.visibility === "hidden") ? "visible" : "hidden";
    });

    document.body.appendChild(MRegenOverlay);

    const MRegenScroll = document.createElement("div");
    MRegenScroll.style.position = "absolute";
    MRegenScroll.className = "SmallFont";
    MRegenScroll.style.height = "60vh";
    MRegenScroll.style.overflowY = "auto";
    MRegenScroll.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.2)";
    MRegenScroll.style.border = "0.05rem solid #ccc";
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
    HRegenOverlay.style.visibility = "hidden";

    HRegenOverlay.addEventListener("click", () => {
        HRegenOverlay.style.visibility = (HRegenOverlay.style.visibility === "hidden") ? "visible" : "hidden";
        HRegenScroll.style.visibility = (HRegenScroll.style.visibility === "hidden") ? "visible" : "hidden";
    });

    document.body.appendChild(HRegenOverlay);

    const HRegenScroll = document.createElement("div");
    HRegenScroll.style.position = "absolute";
    HRegenScroll.className = "SmallFont";
    HRegenScroll.style.height = "60vh";
    HRegenScroll.style.overflowY = "auto";
    HRegenScroll.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.2)";
    HRegenScroll.style.border = "0.05rem solid #ccc";
    HRegenScroll.style.background = "white";

    HRegenScroll.addEventListener("click", function (event) {
        event.stopPropagation();
    });

    DebuffOverlay.appendChild(DebuffScroll);
    HRegenOverlay.appendChild(HRegenScroll);
    MRegenOverlay.appendChild(MRegenScroll);
    SpeedBonusExOverlay.appendChild(speedBonusExScroll);

    const Scrolls = [speedBonusExScroll, MRegenScroll, HRegenScroll, DebuffScroll];

    BuffState.forEach((item, index) => {

        for(let i=0;i<=3;i++)
        {
            if(item[2+i]!==0)
            {

                const menu = document.createElement("label");
                menu.className = "CheckBox-Stack";
                menu.style.border = "0.001rem solid black";
                Scrolls[i].appendChild(menu);
    
                const unitName = document.createElement("p");
                unitName.innerText = `${item[0]}(${item[1]}) ${item[2+i]}${(i===0||i==3) ? "%" : ""}`;
                switch(i)
                {
                    case 0:
                        unitName.className = `u-s${index}`;
                        break;
                        case 1:
                            unitName.className = `u-m${index}`;
                            break;
                            case 2:
                                unitName.className = `u-h${index}`;
                                break;
                                case 3:
                                    unitName.className = `u-d${index}`;
                                    break;
                }
                unitName.style.margin = "0";
                unitName.style.padding = "0.5rem";
                menu.appendChild(unitName);
    
                const Check = document.createElement("input");
                Check.type = "checkbox";
                Check.style.position = 'relative';
                Check.style.zIndex = 10;
                Check.style.marginRight = "0.7vw";
                Check.style.transform = "scale(1.5)";
                Check.dataset.value = item[2+i];
                Check.checked = item[6];        
                switch(i)
                {
                    case 0:
                        Check.className = `s${index}`;
                        break;
                        case 1:
                            Check.className = `m${index}`;
                            break;
                            case 2:
                                Check.className = `h${index}`;
                                break;
                                case 3:
                                Check.className = `d${index}`;
                                break;
                }
    
                CheckEvent(Check, item, index);
    
                menu.appendChild(Check);
            }
        }

    })

    const MoveSpeedDebuffButton = document.createElement("div");
    MoveSpeedDebuffButton.className = "Debuff Button BigFont";
    MoveSpeedDebuffButton.style.textAlign = "right";
    MoveSpeedDebuffButton.style.alignContent = "center";
    MoveSpeedDebuffButton.style.paddingRight = "0.25vw";
    MoveSpeedDebuffButton.innerText = speedDebuff + "%";

    ButtonColor(MoveSpeedDebuffButton);

    MoveSpeedDebuffButton.addEventListener("click", (event) => {
        event.stopPropagation();


        if (DebuffOverlay.style.visibility === "hidden") {
            DebuffOverlay.style.visibility = "visible";
            DebuffScroll.style.visibility = "visible";
            const rect = MoveSpeedDebuffButton.getBoundingClientRect();
            const dropdownHeight = DebuffScroll.offsetHeight || 160;

            DebuffScroll.style.left = `${rect.left / window.innerWidth * 100}vw`; // vw 사용
            DebuffScroll.style.top = `${(rect.top - dropdownHeight) / window.innerHeight * 100}vh`;
        }
        else {
            DebuffScroll.style.visibility = "hidden";
            DebuffOverlay.style.visibility = "hidden";
        }
    });

    document.getElementsByClassName('Stack1')[0].appendChild(MoveSpeedDebuffButton);


    const Debuff = document.createElement("div");
    Debuff.className = "Button Bonus SmallFont";
    Debuff.innerText = "이속 감소";

    ButtonColor(Debuff);
    
    Debuff.addEventListener("click", () =>openOverlay(300, 300));

    document.getElementsByClassName('Stack1')[0].appendChild(Debuff);

    SpeedBonusExButton.addEventListener("click", (event) => {
        event.stopPropagation();


        if (SpeedBonusExOverlay.style.visibility === "hidden") {
            SpeedBonusExOverlay.style.visibility = "visible";
            speedBonusExScroll.style.visibility = "visible";
            const rect = SpeedBonusExButton.getBoundingClientRect();
            const dropdownHeight = speedBonusExScroll.offsetHeight || 160;

            speedBonusExScroll.style.left = `${rect.left / window.innerWidth * 100}vw`; // vw 사용
            speedBonusExScroll.style.top = `${(rect.top - dropdownHeight) / window.innerHeight * 100}vh`;
        }
        else {
            speedBonusExScroll.style.visibility = "hidden";
            SpeedBonusExOverlay.style.visibility = "hidden";
        }
    });

    document.getElementsByClassName('Stack1')[0].appendChild(SpeedBonusExButton);
    speedBonusExScroll.style.width = `${(SpeedBonusExButton.offsetWidth * 2) / window.innerWidth * 100}vw`;

    const SpeedBonusEx = document.createElement("div");
    SpeedBonusEx.className = "Bonus SmallFont";
    SpeedBonusEx.innerText = "추가 공속";

    document.getElementsByClassName('Stack1')[0].appendChild(SpeedBonusEx);


    const MRegenButton = document.createElement("div");
    MRegenButton.className = "MRegen Button BigFont";
    MRegenButton.id = "MRegen";
    MRegenButton.innerText = `${manaRegen}`;
    MRegenButton.style.boxSizing = "border-box";
    MRegenButton.style.textAlign = "right";
    MRegenButton.style.alignContent = "center";
    MRegenButton.style.paddingRight = "0.25vw";
    ButtonColor(MRegenButton);

    MRegenButton.addEventListener("click", (event) => {
        event.stopPropagation();


        if (MRegenOverlay.style.visibility === "hidden") {
            MRegenScroll.style.visibility = "visible";
            MRegenOverlay.style.visibility = "visible";
            const rect = MRegenButton.getBoundingClientRect();
            const dropdownHeight = MRegenScroll.offsetHeight || 160;

            MRegenScroll.style.left = `${rect.left / window.innerWidth * 100}vw`; // vw 사용
            MRegenScroll.style.top = `${(rect.top - dropdownHeight) / window.innerHeight * 100}vh`;
        }
        else {
            MRegenScroll.style.visibility = "hidden";
            MRegenOverlay.style.visibility = "hidden";
        }

    });

    document.getElementsByClassName('Stack2')[0].appendChild(MRegenButton);
    MRegenScroll.style.width = `${(MRegenButton.offsetWidth * 2) / window.innerWidth * 100}vw`;

    const MRegen = document.createElement("div");
    MRegen.className = "Bonus SmallFont";
    MRegen.innerText = "마나 리젠";
    MRegen.style.boxSizing = "border-box";

    document.getElementsByClassName('Stack2')[0].appendChild(MRegen);

    const HRegenButton = document.createElement("div");
    HRegenButton.className = "HRegen Button BigFont";
    HRegenButton.id = "HRegen";
    HRegenButton.innerText = `${healthRegen}`;
    HRegenButton.style.boxSizing = "border-box";
    HRegenButton.style.textAlign = "right";
    HRegenButton.style.alignContent = "center";
    HRegenButton.style.paddingRight = "0.25vw";
    ButtonColor(HRegenButton);

    HRegenButton.addEventListener("click", (event) => {
        event.stopPropagation();


        if (HRegenOverlay.style.visibility === "hidden") {
            HRegenScroll.style.visibility = "visible";
            HRegenOverlay.style.visibility = "visible";
            const rect = HRegenButton.getBoundingClientRect();
            const dropdownHeight = HRegenScroll.offsetHeight || 160;

            HRegenScroll.style.left = `${rect.left / window.innerWidth * 100}vw`; // vw 사용
            HRegenScroll.style.top = `${(rect.top - dropdownHeight) / window.innerHeight * 100}vh`;
        }
        else {
            HRegenScroll.style.visibility = "hidden"; 
            MRegenOverlay.style.visibility = "hidden";
        }

    });

    document.getElementsByClassName('Stack2')[0].appendChild(HRegenButton);
    HRegenScroll.style.width = `${(HRegenButton.offsetWidth * 2) / window.innerWidth * 100}vw`;

    const HRegen = document.createElement("div");
    HRegen.className = "Bonus SmallFont";
    HRegen.innerText = "체력 리젠";
    HRegen.style.boxSizing = "border-box";

    document.getElementsByClassName('Stack2')[0].appendChild(HRegen);

    const Formula = document.createElement("div");
    Formula.className = "Button Formula SmallFont";
    Formula.innerText = "가동률 공식";
    Formula.style.gridArea = "1/ 1/ 2/ 2"
    Formula.style.alignContent = "center";
    Formula.style.textAlign = "center";
    Formula.addEventListener("click", () => {
        openOverlay(200, 200);
    });
    ButtonColor(Formula);

    document.getElementsByClassName(`Stack3`)[0].appendChild(Formula);

    const StunCalCulateMachine = document.createElement("div");
    StunCalCulateMachine.className = "Button Machine SmallFont";
    StunCalCulateMachine.innerText = "스턴 계산기";
    StunCalCulateMachine.style.gridArea = "1/ 2/ 2/ 3";
    StunCalCulateMachine.style.alignContent = "center";
    StunCalCulateMachine.style.textAlign = "center";
    StunCalCulateMachine.addEventListener("click", () =>
    {
        openOverlay(400, 400);
    })

    document.getElementsByClassName(`Stack3`)[0].appendChild(StunCalCulateMachine);
    ButtonColor(StunCalCulateMachine);

    if (document.getElementById("container1")) {
        const Mana = document.createElement("div");
        Mana.className = "Button Mana SmallFont";
        Mana.innerText = "마나 끄기";
        Mana.style.gridArea = "1/ 4/ 2/ 5"
        Mana.style.alignContent = "center";
        Mana.style.textAlign = "center";
        Mana.addEventListener("click", () => {
            if (mana)
                Mana.innerText = "마나 켜기";
            else
                Mana.innerText = "마나 끄기";
            mana = !mana;
            UnitTotalStun();
            CountOn();
        });

        ButtonColor(Mana);
        document.getElementsByClassName(`Stack3`)[0].appendChild(Mana);
    }

}

function Checked(target, sort, unit)
        {
            if(unitState[sort][unit][0]==="퀸")
                {
                    if(target.id.split(`-`)[0] === "p")
                    {
                        manaRegen += 1;
                        healthRegen += 1;
                    }
                    else
                    {
                        manaRegen -= 1;
                        healthRegen -= 1;
                    }
                    let index = BuffState.findIndex((items => items.includes("퀸")&&items.includes("히든")));
                    BuffState[index][6] = target.id.split(`-`)[0]==="p" ? true : false;
                    document.getElementsByClassName(`m${index}`)[0].checked = target.id.split(`-`)[0]==="p" ? true : false;
                    document.getElementsByClassName(`h${index}`)[0].checked = target.id.split(`-`)[0]==="p" ? true : false;
                }
            else if(unitState[sort][unit][0] === '우타')
            {
                let index = BuffState.findIndex((items => items.includes(`우타의 헤드셋`)));

                if(target.id.split(`-`)[0] === "p")
                {
                    if(!BuffState[index][6])
                    {
                        BuffState[index][6] = true;
                        document.getElementsByClassName(`s${index}`)[0].checked = true;
                    }
                    else
                    {
                        speedBonusEx -= BuffState[index][2];
                    }
                }
                else
                {
                    speedBonusEx += BuffState[index][2];
                    index = BuffState.findIndex((items => items[0] === '우타'));
                    BuffState[index][6] = false;
                    Collect(BuffState[index], index);
                }

            }
            else{
                let index = BuffState.findIndex((items => items.includes(`${unitState[sort][unit][0]}`)&&items.includes(`${unitState[sort][0][0]}`)));
                if(index !== -1)
                {
                    BuffState[index][6] = target.id.split(`-`)[0] === "p" ? true : false;
                    BuffAdd(BuffState[index][6], BuffState[index]);
                    Collect(BuffState[index], index);
                }
            }
        }

UnitTotalStun();


speedState.sort((a, b) => {

    if (a[0] < b[0]) return -1;
    if (a[0]  > b[0]) return  1;

    return SortFunction(a, b);
})

for (var i = 0, sortCount = 0, unitCount = 0; i < Unit; i++, unitCount++) {
    if (unitCount >= unitState[sortCount].length) {
        sortCount++;
        unitCount = 0;
    }

    const UnitBar = document.createElement("div");
    UnitBar.style.display = "flex";
    UnitBar.style.boxSizing = "border-box";
    container.appendChild(UnitBar);

    if (unitCount == 0) {
        const newChild = document.createElement("div");
        newChild.className = 'unitSort BigFont';
        newChild.innerText = unitState[sortCount][unitCount][0];
        newChild.style.border = "0.001rem solid black";
        newChild.style.width = "100%";

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

        const UnitChildBar = document.createElement("div");
        UnitChildBar.style.display = "grid";
        UnitChildBar.style.gridTemplateColumns = "repeat(3, 1fr)";
        UnitChildBar.style.width = "100%";

        UnitBar.appendChild(UnitChildBar);

        const unitName = document.createElement("button");
        unitName.className = 'Button unitName SmallFont';
        unitName.id = `n-${sortCount}-${unitCount}`;
        unitName.innerText = unitState[sortCount][unitCount][0];
        if (unitState[sortCount][unitCount][0] === "크로커다일(특강)")
            unitName.style.fontSize = "0.65vw";

        unitName.addEventListener("click", (event) => {
            openOverlay(event.target.id.split('-')[1], event.target.id.split('-')[2]);
        })
        ButtonColor(unitName);

        const stunRate = document.createElement("div");
        stunRate.className = 'Rate SmallFont';
        stunRate.id = `r-${sortCount}-${unitCount}`;
        stunRate.style.boxSizing = 'border-box';
        stunRate.innerText = unitRate[sortCount][unitCount].toFixed(3) + "스턴";
        stunRate.style.justifyContent = "center";

        const percentage = document.createElement("div");
        percentage.className = 'Rate SmallFont';
        percentage.id = `per-${sortCount}-${unitCount}`;
        percentage.style.boxSizing = 'border-box';
        percentage.innerText = ((1 - Math.pow(0.2, unitRate[sortCount][unitCount])) * 100).toFixed(2) + "%";
        percentage.style.justifyContent = "center";

        const count = document.createElement("div");
        count.className = 'Count SmallFont';
        count.id = `c-${sortCount}-${unitCount}`;
        count.innerText = `${stunCount[sortCount][unitCount]}`;
        count.style.justifyContent = "center";
        count.style.aspectRatio = "1";
        count.style.height = `${GridHeight}vw`;
        count.style.boxSizing = "border-box";

        const plus = document.createElement("img");
        plus.className = 'IMG SmallFont';
        plus.src = "plus.png";
        plus.id = `p-${sortCount}-${unitCount}`;
        plus.style.height = `${GridHeight}vw`;
        plus.style.aspectRatio = "1";
        plus.style.boxSizing = "border-box";
        plus.addEventListener('click', () => {
            const id = plus.id.split(`-`);
            const sort = id[1];
            const unit = id[2];
            stunCount[sort][unit]++;
            if (stunCount[sort][unit] == 1) {
                speedBonusEx += unitState[sort][unit][9];

                Checked(plus, sort, unit);

                for (let k = 0; k < 3; k++) {
                    if (stunRange[sort][unit - 1][k])
                        Sort.push([sort, unit, stunRange[sort][unit - 1][k]]);
                }
                Sort.sort((a, b) => a[2] - b[2]);
            }
            UnitTotalStun();
            CountOn();
        });                
        ButtonColor(plus);

        const minus = document.createElement("IMG");
        minus.className = 'IMG SmallFont';
        minus.src = "minus.png";
        minus.id = `m-${sortCount}-${unitCount}`;
        minus.style.height = `${GridHeight}vw`;
        minus.style.aspectRatio = "1";
        minus.style.boxSizing = "border-box";
        minus.addEventListener('click', () => {
            const id = minus.id.split(`-`);
            const sort = id[1];
            const unit = id[2];
            stunCount[sort][unit]--;
            if (stunCount[sort][unit] < 0){
                stunCount[sort][unit] = 0;
            }
            else if (stunCount[sort][unit] == 0) {
                speedBonusEx -= unitState[sort][unit][9];
                Checked(minus, sort, unit);

                Sort = Sort.filter(item => item[0] !== sort || item[1] !== unit || item[2] !== stunRange[sort][unit - 1][0]);
                Sort = Sort.filter(item => item[0] !== sort || item[1] !== unit || item[2] !== stunRange[sort][unit - 1][1]);
                Sort = Sort.filter(item => item[0] !== sort || item[1] !== unit || item[2] !== stunRange[sort][unit - 1][2]);
  
            }  
            UnitTotalStun();
            CountOn();
        }
        );

        ButtonColor(minus);

        UnitChildBar.appendChild(unitName);
        UnitChildBar.appendChild(stunRate);
        UnitChildBar.appendChild(percentage);
        UnitBar.appendChild(count);
        UnitBar.appendChild(plus);
        UnitBar.appendChild(minus);
    }
}

Stack();

const MoveSpeedPage = document.createElement("button");
MoveSpeedPage.className = "Button MoveSpeedPage SmallFont";
MoveSpeedPage.innerText = "발동 이감";
MoveSpeedPage.style.gridArea = "1/4/2/5";

MoveSpeedPage.addEventListener('click', () => {

    const Container2 = document.createElement('div');
    Container2.className = "container";
    Container2.id = "container2";
    Container2.style.gridTemplateRows = `repeat(${containerGrid}, 1fr)`;

    container.replaceWith(Container2);
    for (let i = 0; i <= speedState.length+Math.floor(i/containerGrid); i++) {

        const Unit = document.createElement("div");
        Unit.id = `u-${i}`;
        Unit.style.boxSizing = "border-box";
        Unit.style.display = "grid";
        Unit.style.gridTemplateColumns = "repeat(4, 1fr)";
        Container2.appendChild(Unit);

        if (i % containerGrid == 0) {
            const UnitName = document.createElement("button");
            UnitName.className = "Button unitSort MoreSmallFont UnitNameBar";
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

            ButtonColor(UnitName);
            Unit.append(UnitName);

            const UnitSort = document.createElement("button");
            UnitSort.className = "Button unitSort MoreSmallFont UnitSortBar";
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

            ButtonColor(UnitSort);
            Unit.append(UnitSort);

            const MoveSpeed = document.createElement("button");
            MoveSpeed.className = "Button unitSort MoreSmallFont MoveSpeedBar";
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

            ButtonColor(MoveSpeed);
            Unit.appendChild(MoveSpeed);

            const AfterShock = document.createElement("button");
            AfterShock.className = "Button unitSort MoreSmallFont AfterShockBar";
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

            ButtonColor(AfterShock);
            Unit.appendChild(AfterShock);
        }
        else {
            const UnitName = document.createElement("div");
            UnitName.className = "unitName SmallFont";
            UnitName.id = `n-${i - 1 - Math.floor(i / containerGrid) }`;
            UnitName.style.border = "0.001rem solid black";
            UnitName.style.boxSizing = "border-box"; // boxSizing 추가
            UnitName.textContent = `${speedState[i - 1 - parseInt(Math.floor(i / containerGrid))][0]}`;

            Unit.appendChild(UnitName);

            const UnitSort = document.createElement("div");
            UnitSort.className = "unitName SmallFont";
            UnitSort.id = `s-${i - 1 - Math.floor(i / containerGrid) }`;
            UnitSort.style.border = "0.001rem solid black";
            UnitSort.boxSizing = "border-box";
            UnitSort.textContent = `${speedState[i - 1 - Math.floor(i / containerGrid)][1][0]}`;

            Unit.append(UnitSort);

            const MoveSpeed = document.createElement("button");
            MoveSpeed.className = "Button SmallFont";
            MoveSpeed.id = `m-${i - 1 - Math.floor(i / containerGrid)}`;
            MoveSpeed.style.boxSizing = "border-box"; // boxSizing 추가
            MoveSpeed.addEventListener('click', () => {
                const id = MoveSpeed.parentElement.id.split('-');
                openOverlay(-1, id[1] - 1 - Math.floor(i/containerGrid));

            })

            ButtonColor(MoveSpeed);
            Unit.appendChild(MoveSpeed);
            MoveSpeed.textContent = `${(lowSpeed(MoveSpeed.parentElement.id.split('-')[1] - 1 - Math.floor(i/containerGrid), 0) * 100).toFixed(2)}%`;

            const AfterShock = document.createElement("button");
            AfterShock.className = "Button SmallFont";
            AfterShock.id = `a-${i - 1 - Math.floor(i / containerGrid)}`;
            AfterShock.style.boxSizing = "border-box"; // boxSizing 추가
            AfterShock.addEventListener('click', () => {
                const id = AfterShock.parentElement.id.split('-');
                openOverlay(-2, id[1] - 1 - Math.floor(i / containerGrid));
            })

            ButtonColor(AfterShock);
            Unit.appendChild(AfterShock);
            AfterShock.textContent = `${(lowSpeed(MoveSpeed.parentElement.id.split('-')[1] - 1 - Math.floor(i / containerGrid), 1) * 100).toFixed(2)}%`;
        }
        
        
    }


    Stack();


    const StunPage = document.createElement("button");
    StunPage.className = "Button Stun SmallFont";
    StunPage.innerText = "스턴";
    StunPage.style.gridArea = "1/4/2/5";

    StunPage.addEventListener('click', () => {

        Container2.replaceWith(container);
        SetElemental();
    })

    ButtonColor(StunPage);
    document.getElementsByClassName(`Stack4`)[0].appendChild(StunPage);

})

ButtonColor(MoveSpeedPage);
document.getElementsByClassName(`Stack4`)[0].appendChild(MoveSpeedPage);



let socket;
let reconnectAttempts = 0;

function connectWebSocket(){
    socket = new WebSocket("wss://4ixs2roym1.execute-api.ap-northeast-2.amazonaws.com/production");

 
    socket.onopen = (event) => {
        console.log("✅ WebSocket 연결 성공!");
        reconnectAttempts = 0;
    };
    
    socket.onmessage = (event) => {
    
            alert("📢 새로운 업데이트가 있습니다!\n 새로고침해 주세요!");
    };
    
    socket.onerror = (error) => {
        console.error("❌ WebSocket 오류 발생:", error);
    };
    
    socket.onclose = (event) => {
        console.warn("⚠️ WebSocket 연결 종료! 코드:", event.code, "이유:", event.reason);

        // 백오프 전략 적용 (최대 30초까지 증가)
        let delay = Math.min(3000 * (2 ** reconnectAttempts), 30000);
        console.log(`⏳ ${delay / 1000}초 후 재연결 시도...`);
        setTimeout(connectWebSocket, delay);

        reconnectAttempts++;
    };
}

connectWebSocket();