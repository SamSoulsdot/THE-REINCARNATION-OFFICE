import { IsoView } from './presentation/iso/view';
import { newCampaign } from './engine/sim';
import { startDay } from './engine/campaign';

const host = document.getElementById('root')!;
host.style.cssText = 'position:fixed;inset:0;background:#08070b';
const g = newCampaign('Ada Loris', 5);
g.areas = ['reception', 'judgment', 'employee', 'interview', 'archive', 'management', 'restricted', 'director'];
g.day = 10; g.chapter = 4; g.flags['nn_custodia'] = true;
startDay(g);
const q = new URLSearchParams(location.search);
g.player = { x: Number(q.get('x') ?? 12), y: Number(q.get('y') ?? 15) };
const view = new IsoView(host, { canAct: () => true, onInteract: (t) => console.log('interact', t.id), onArrive: () => {}, onRoom: (r) => console.log('room', r), onLocked: (a) => console.log('locked', a), onStep: () => {}, onNear: () => {}, onDoor: () => {}, onOverheard: () => {} });
(window as any).view = view;
view.init().then(() => { view.sync(g, { soulSprite: 'soul', waiting: 3, ambient: Number(q.get('amb') ?? 0x6a6478), flicker: 0.08 }); (window as any).ready = true; });
