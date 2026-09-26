// 마우스 효과는 Stun.css에서 일관되게 관리합니다.
export function ButtonColor(element) {
    element.classList.add("interactive");
    if (element.tagName !== "BUTTON") {
        element.setAttribute("role", "button");
        element.tabIndex = 0;
        element.addEventListener("keydown", (event) => {
            if (event.target !== element) return;
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                element.click();
            }
        });
    }
    if (element.tagName === "IMG") {
        element.alt = element.id.startsWith("p-") ? "유닛 추가" : "유닛 감소";
        element.setAttribute("aria-label", element.alt);
    }
}
