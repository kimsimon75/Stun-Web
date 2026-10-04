import { createKobyControl } from "./koby-control.js";
import { createDexterityControl } from "./dexterity-control.js";
import { createIntelligenceControl } from "./intelligence-control.js";
import { createCalculatorButtons } from "./calculator-buttons.js";
import { createDifficultyControl } from "./difficulty-control.js";

export function createToolbar() {
    const bar = document.getElementById("bar");
    createKobyControl(bar);
    createDexterityControl(bar);
    createIntelligenceControl(bar);
    createCalculatorButtons(bar);
    createDifficultyControl(bar);
}
