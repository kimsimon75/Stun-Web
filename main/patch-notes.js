import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";

export function initializePatchNotes() {
    const selector = document.getElementById("versionSelector");
    const contentDiv = document.getElementById("content");

    // index.json 가져와서 버전 목록 표시
    fetch("https://patchnote.s3.ap-northeast-2.amazonaws.com/patchnotes/index.json", {
        cache: "no-store"
    })
        .then(res => res.json())
        .then(versions => {
            versions.forEach(entry => {
                const option = document.createElement("option");
                option.value = entry.version;
                option.textContent = `${entry.version} (${entry.date})`;
                selector.appendChild(option);
            });

            // 첫 번째 자동 로딩
            loadMarkdown(versions[0].version);
        });

    selector.addEventListener("change", () => {
        const version = selector.value;
        loadMarkdown(version);
    });

    function loadMarkdown(version) {
        const url = `https://patchnote.s3.ap-northeast-2.amazonaws.com/patchnotes/${version}.md`;
        fetch(url)
            .then(res => res.text())
            .then(md => {
                contentDiv.innerHTML = marked.parse(md);
            })
            .catch(err => {
                contentDiv.innerHTML = `<p style="color:red;">❌ 로딩 실패: ${err.message}</p>`;
            });
    }
}
