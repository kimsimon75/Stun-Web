export function separateKorean(text) {

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
