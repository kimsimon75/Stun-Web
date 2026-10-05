import { Var, Func, StunView } from "./import.js";
import { CountOn } from "./main/refresh.js";
import { ClearAll } from "./main/clear-all.js";
import { Collect } from "./main/buff-sync.js";
import { ButtonColor } from "./main/button-style.js";
import { Stack } from "./main/stack.js";
import { createToolbar } from "./main/toolbar.js";
import { createViewButtons } from "./main/view-buttons.js";
import { initializePatchNotes } from "./main/patch-notes.js";
import { connectUpdates } from "./main/update-connection.js";
import { initializeUnitConnection } from "./main/unit-connection.js";

const container = document.getElementsByClassName("container")[0];
container.style.gridTemplateRows = `repeat(${Var.containerGrid}, 1fr)`;

// 기존 화면 모듈에서 사용하는 진입점.
Object.assign(window, { container, CountOn, ClearAll, Collect, ButtonColor, Stack });

Func.UnitTotalStun();
StunView();
Stack();
createToolbar();
createViewButtons();
initializeUnitConnection();
CountOn();
initializePatchNotes();
connectUpdates();
