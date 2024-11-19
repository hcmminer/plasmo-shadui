// background/index.ts
import "@plasmohq/messaging/background";
import { startHub } from "@plasmohq/messaging/pub-sub";

console.log(`BGSW - Starting Hub`);
startHub();