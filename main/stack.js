import { createStackLayout } from "./stack-layout.js";
import { createDebuffMenu } from "./debuff-menu.js";
import { createAttackSpeedMenu } from "./attack-speed-menu.js";
import { createManaMenu } from "./mana-menu.js";
import { createHealthMenu } from "./health-menu.js";
import { populateBuffMenus } from "./buff-list.js";
import { createDebuffControl } from "./debuff-control.js";
import { createAttackSpeedControl } from "./attack-speed-control.js";
import { createManaControl } from "./mana-control.js";
import { createHealthControl } from "./health-control.js";

export function Stack() {
    createStackLayout();
    const { DebuffOverlay, DebuffScroll } = createDebuffMenu();
    const { SpeedBonusExButton, SpeedBonusExOverlay, speedBonusExScroll } = createAttackSpeedMenu();
    const { MRegenOverlay, MRegenScroll } = createManaMenu();
    const { HRegenOverlay, HRegenScroll } = createHealthMenu();
    populateBuffMenus(DebuffOverlay, DebuffScroll, HRegenOverlay, HRegenScroll, MRegenOverlay, MRegenScroll, SpeedBonusExOverlay, speedBonusExScroll);
    createDebuffControl(DebuffOverlay, DebuffScroll);
    createAttackSpeedControl(SpeedBonusExButton, SpeedBonusExOverlay, speedBonusExScroll);
    createManaControl(MRegenOverlay, MRegenScroll);
    createHealthControl(HRegenOverlay, HRegenScroll, MRegenOverlay);
}
