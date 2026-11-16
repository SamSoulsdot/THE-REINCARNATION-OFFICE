import { expect, test, type Page } from '@playwright/test';

type Office = { store: { getState(): any }; view(): any };
declare global { interface Window { __office: Office } }

const state = (p: Page) => p.evaluate(() => {
  const s = window.__office.store.getState();
  return { screen: s.screen, panel: s.panel, scene: !!s.scene, kind: s.scene?.item?.kind, room: s.roomLabel, day: s.game?.day, decisions: s.game?.decisions.length ?? 0, active: s.game?.activeCase?.caseId ?? null, mode: s.game?.mode };
});

async function finishScene(p: Page) {
  for (let i = 0; i < 60; i++) {
    const s = await state(p);
    if (!s.scene) return;
    if (s.kind === 'choice') await p.getByTestId('choice-0').click();
    else await p.getByTestId('scene').click({ position: { x: 5, y: 5 } });
    await p.waitForTimeout(40);
  }
}

async function newCampaign(p: Page, name = 'Ada Loris') {
  await p.goto('/');
  await expect(p.getByTestId('main-menu')).toBeVisible();
  await p.getByTestId('menu-new').click();
  await p.getByTestId('player-name').fill(name);
  await p.getByTestId('start-game').click();
  await expect(p.getByTestId('day-start')).toBeVisible();
  await p.getByTestId('begin-day').click();
  await expect(p.getByTestId('day-start')).toBeHidden();
  await p.evaluate(() => window.__office.store.getState().setSettings({ textSpeed: 'immediata' }));
}

async function noHorizontalOverflow(p: Page) {
  const o = await p.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
  expect(o.sw).toBeLessThanOrEqual(o.cw);
}

/** Porta in primo piano il caso 1 seguendo il percorso del giocatore: Pim, poi scrivania 7. */
async function reachDesk(p: Page) {
  await p.evaluate(() => window.__office.view().interactWith('pim'));
  await expect.poll(async () => (await state(p)).scene, { timeout: 45000 }).toBe(true);
  await finishScene(p);
  await p.evaluate(() => window.__office.view().interactWith('scrivania7'));
  await expect.poll(async () => { const s = await state(p); if (s.scene) await finishScene(p); return (await state(p)).panel; }, { timeout: 60000 }).toBe('desk');
}

test('avvio e menu principale', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Reincarnation Office/);
  await expect(page.getByTestId('main-menu')).toBeVisible();
  for (const id of ['menu-new', 'menu-endless', 'menu-saves', 'menu-settings', 'menu-endings']) await expect(page.getByTestId(id)).toBeVisible();
  await page.getByTestId('menu-settings').click();
  await expect(page.getByTestId('settings')).toBeVisible();
  await page.getByTestId('sheet-close').click();
  await page.getByTestId('menu-endings').click();
  await expect(page.getByTestId('endings')).toContainText('0 di 5');
  await noHorizontalOverflow(page);
});

test('nuova campagna: rendering dell\'ufficio isometrico', async ({ page }) => {
  await newCampaign(page);
  await expect(page.getByTestId('hud-where')).toContainText('Capitolo I');
  await expect(page.locator('canvas.iso-canvas')).toBeVisible();
  await page.waitForTimeout(800);
  const shot = await page.locator('[data-testid=iso-host]').screenshot();
  // Una scena vuota o nera comprime in pochi KB; l'ufficio dettagliato no.
  expect(shot.byteLength).toBeGreaterThan(60_000);
  const s = await state(page);
  expect(s.room).toBe('Reception');
  await noHorizontalOverflow(page);
});

test('caso completo: anima, dossier, documenti, interrogatorio, sentenza, reincarnazione', async ({ page }) => {
  await newCampaign(page);
  await reachDesk(page);
  await page.getByTestId('call-c01').click();
  await expect(page.getByTestId('case')).toBeVisible();
  await expect(page.getByTestId('soul-name')).toHaveText('Ettore Balducci');
  await page.getByTestId('register').click();
  // documenti: annotare le evidenze
  await page.getByTestId('tab-documenti').click();
  await page.getByTestId('doc-denuncia').click();
  await page.getByTestId('para-denuncia').click();
  await page.getByTestId('doc-lettera').click();
  await page.getByTestId('para-sapeva').click();
  await expect(page.getByTestId('para-sapeva')).toHaveClass(/noted/);
  // evidenze: contraddizione
  await page.getByTestId('tab-evidenze').click();
  await page.getByTestId('clue-denuncia').click();
  await page.getByTestId('clue-sapeva').click();
  await page.getByTestId('compare').click();
  await expect(page.getByTestId('compare-result')).toContainText('Contraddizione');
  // interrogatorio: la contestazione apre la verità
  await page.getByTestId('tab-colloquio').click();
  await page.getByTestId('ask-confronto').click();
  await expect(page.getByTestId('transcript')).toContainText('L\'ho visto');
  // sentenza
  await page.getByTestId('tab-sentenza').click();
  await page.getByTestId('dest-trial').click();
  await expect(page.getByTestId('irregularities')).toContainText('regolare');
  await page.getByTestId('issue-verdict').click();
  await page.getByTestId('confirm-yes').click();
  await expect(page.getByTestId('report')).toBeVisible();
  await expect(page.getByTestId('report-dest')).toContainText('La Prova');
  await expect(page.getByTestId('next-life')).toBeVisible();
  await page.getByTestId('close-report').click();
  const s = await state(page);
  expect(s.decisions).toBe(1);
  expect(s.active).toBeNull();
  const soul = await page.evaluate(() => { const g = window.__office.store.getState().game; return { n: g.souls['S-ETTORE'].incarnations.length, status: g.souls['S-ETTORE'].status }; });
  expect(soul).toEqual({ n: 2, status: 'reincarnata' });
  await noHorizontalOverflow(page);
});

test('salvataggio manuale, ricaricamento della pagina e caricamento', async ({ page }) => {
  await newCampaign(page, 'Ivo Sterni');
  await reachDesk(page);
  await page.getByTestId('call-c01').click();
  await page.getByTestId('tab-sentenza').click();
  await page.getByTestId('dest-renewal').click();
  await page.getByTestId('issue-verdict').click();
  await page.getByTestId('confirm-yes').click();
  await page.getByTestId('close-report').click();
  await page.getByTestId('btn-pause').click();
  await page.getByTestId('open-saves').click();
  await page.getByTestId('save-slot2').click();
  await expect(page.getByTestId('slot-slot2')).toContainText('Ivo Sterni');
  // persistenza reale: si ricarica la pagina
  await page.reload();
  await expect(page.getByTestId('main-menu')).toBeVisible();
  await expect(page.getByTestId('menu-continue')).toContainText('Ivo Sterni');
  await page.getByTestId('menu-saves').click();
  await page.getByTestId('load-slot2').click();
  await expect(page.getByTestId('game')).toBeVisible();
  const g = await page.evaluate(() => { const g = window.__office.store.getState().game; return { name: g.playerName, n: g.decisions.length, dest: g.decisions[0].destination, flag: !!g.flags['met_pim'] }; });
  expect(g).toEqual({ name: 'Ivo Sterni', n: 1, dest: 'renewal', flag: true });
});

test('esportazione e importazione JSON', async ({ page }) => {
  await newCampaign(page, 'Rina Valt');
  await page.getByTestId('btn-pause').click();
  await page.getByTestId('open-saves').click();
  await page.getByTestId('save-slot1').click();
  const [dl] = await Promise.all([page.waitForEvent('download'), page.getByTestId('export-slot1').click()]);
  const path = await dl.path();
  expect(path).toBeTruthy();
  await page.getByTestId('import-slot3').click();
  await page.getByTestId('import-input').setInputFiles(path!);
  await expect(page.getByTestId('slot-slot3')).toContainText('Rina Valt');
});

test('modalità Endless', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('menu-endless').click();
  await page.getByTestId('player-name').fill('Zeno Laghi');
  await page.getByTestId('start-game').click();
  await page.getByTestId('begin-day').click();
  await page.evaluate(() => window.__office.store.getState().setSettings({ textSpeed: 'immediata' }));
  const s0 = await state(page);
  expect(s0.mode).toBe('endless');
  const n = await page.evaluate(() => window.__office.store.getState().game.queue.length);
  expect(n).toBeGreaterThanOrEqual(3);
  // giudica una pratica procedurale dalla scrivania
  await page.evaluate(() => window.__office.store.getState().openPanel('desk'));
  await page.locator('[data-testid^="call-p:"]').first().click();
  await expect(page.getByTestId('case')).toBeVisible();
  await page.getByTestId('tab-documenti').click();
  await page.getByTestId('doc-ufficiale').click();
  await page.getByTestId('para-ufficiale').click();
  await page.getByTestId('doc-teste').click();
  await page.getByTestId('para-teste').click();
  await page.getByTestId('tab-evidenze').click();
  await page.getByTestId('clue-ufficiale').click();
  await page.getByTestId('clue-teste').click();
  await page.getByTestId('compare').click();
  await expect(page.getByTestId('compare-result')).toContainText('Contraddizione');
  await page.getByTestId('tab-colloquio').click();
  await page.getByTestId('ask-atto').click();
  await page.getByTestId('ask-confronto').click();
  await page.getByTestId('tab-sentenza').click();
  await page.getByTestId('dest-renewal').click();
  await page.getByTestId('issue-verdict').click();
  await page.getByTestId('confirm-yes').click();
  await page.getByTestId('close-report').click();
  // chiusura del turno
  await page.evaluate(() => window.__office.store.getState().tryEndDay());
  await page.getByTestId('confirm-yes').click();
  await expect(page.getByTestId('day-end')).toBeVisible();
  await page.getByTestId('next-day').click();
  await page.getByTestId('begin-day').click();
  const s = await state(page);
  expect(s.day).toBe(2);
  expect(s.decisions).toBe(1);
});

test('diario e gestione si aprono e funzionano', async ({ page }) => {
  await newCampaign(page);
  await page.getByTestId('btn-journal').click();
  await expect(page.getByTestId('beats')).toContainText('Signorina Pim');
  await page.getByTestId('tab-codex').click();
  await expect(page.getByTestId('journal')).toContainText('Le cinque destinazioni');
  await page.getByTestId('sheet-close').click();
  await page.getByTestId('btn-office').click();
  await page.evaluate(() => { const s = window.__office.store.getState(); s.game.credits = 400; s.bump(); });
  await page.getByTestId('tab-personale').click();
  const cand = page.locator('[data-testid^="hire-"]').first();
  await expect(cand).toBeEnabled();
  await cand.click();
  await expect.poll(() => page.evaluate(() => window.__office.store.getState().game.staff.length)).toBe(1);
  await page.getByTestId('tab-reparti').click();
  await expect(page.getByTestId('dept-reception')).toBeVisible();
  await noHorizontalOverflow(page);
});

test('interazioni touch: tocco per camminare e per parlare', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'solo su dispositivo touch');
  await newCampaign(page);
  const before = await page.evaluate(() => window.__office.store.getState().game.player);
  const tile = await page.evaluate(() => window.__office.view().tileToScreen(14, 27));
  await page.touchscreen.tap(tile.x, tile.y);
  await expect.poll(() => page.evaluate(() => window.__office.view().debug().x + ',' + window.__office.view().debug().y), { timeout: 10000 }).not.toBe(before.x + ',' + before.y);
  const pim = await page.evaluate(() => window.__office.view().targetToScreen('pim'));
  await page.touchscreen.tap(pim.x, pim.y);
  await expect(page.getByTestId('scene')).toBeVisible({ timeout: 15000 });
  await page.getByTestId('scene').tap();
  await noHorizontalOverflow(page);
  // il pulsante «Esamina» funziona senza hover
  await finishScene(page);
  await expect(page.getByTestId('btn-act')).toBeVisible();
});
