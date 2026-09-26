export function createAttackSpeedControl(SpeedBonusExButton, SpeedBonusExOverlay, speedBonusExScroll) {
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

}
