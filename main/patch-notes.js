export async function initializePatchNotes() {
    const selector = document.getElementById("versionSelector");
    const content = document.getElementById("content");
    if (!selector || !content) return;
    const base = "https://patchnote.s3.ap-northeast-2.amazonaws.com/patchnotes/";
    selector.disabled = true;
    let request = 0;
    try {
        // 패치노트 서비스가 실패해도 계산기 초기화는 중단되지 않습니다.
        const { marked } = await import("https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js");
        const response = await fetch(base + "index.json", { cache: "no-store" });
        if (!response.ok) throw new Error("버전 목록을 가져오지 못했습니다.");
        const versions = await response.json();
        if (!Array.isArray(versions) || !versions.length) throw new Error("등록된 패치노트가 없습니다.");
        selector.replaceChildren();
        versions.forEach(entry => {
            const option = document.createElement("option");
            option.value = entry.version;
            option.textContent = `${entry.version} (${entry.date})`;
            selector.appendChild(option);
        });
        async function loadMarkdown(version) {
            const id = ++request;
            content.textContent = "패치노트를 불러오는 중입니다.";
            try {
                const response = await fetch(base + encodeURIComponent(version) + ".md");
                if (!response.ok) throw new Error("패치노트를 가져오지 못했습니다.");
                const markdown = await response.text();
                if (id === request) content.innerHTML = marked.parse(markdown);
            } catch (error) {
                if (id === request) content.textContent = error.message;
            }
        }
        selector.disabled = false;
        selector.addEventListener("change", () => loadMarkdown(selector.value));
        await loadMarkdown(selector.value);
    } catch (error) {
        content.textContent = "패치노트를 불러올 수 없습니다. " + error.message;
    }
}
