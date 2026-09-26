export function Collect(item, index) {
    for (const prefix of ["s", "m", "h", "d"]) {
        for (const checkbox of document.getElementsByClassName(prefix + index)) {
            checkbox.checked = item.Check > 0;
        }
    }
}
