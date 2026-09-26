import { createStatControl } from "./stat-control.js";

export function createDexterityControl(bar) {
    createStatControl(bar, "민첩성", "dex", false);
}
