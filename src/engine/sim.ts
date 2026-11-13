// Simulation Engine — creazione di una nuova partita.
import type { GameState } from './types';
import { SCHEMA_VERSION } from './types';
import { hashString } from './rng';
import { initGoals } from './endless';
import { SPOTS } from '../world/map';

function base(mode: 'campaign' | 'endless', playerName: string, seed: number): GameState {
  return {
    schema: SCHEMA_VERSION,
    mode,
    seed: seed >>> 0,
    playerName: playerName.trim() || 'Scrivano',
    day: 1,
    chapter: 1,
    phase: 0,
    dayStarted: false,
    flags: {},
    vars: {},
    credits: 80,
    stats: { efficienza: 50, morale: 60, pendenti: 4, reputazione: 50, irregolari: 0, ricorsi: 0, anomalie: 0, sospetto: 0 },
    rel: {},
    npc: {},
    souls: {},
    decisions: [],
    queue: [],
    activeCase: null,
    lastReport: null,
    closed: {},
    knowledge: {},
    links: [],
    linkAttempts: 0,
    convSeen: {},
    docsSeen: {},
    staff: [],
    candidates: [],
    departments: { reception: 0, judgment: 0, archive: 0, interview: 0, employee: 0, management: 0, restricted: 0 },
    tools: [],
    directives: [],
    areas: ['reception', 'judgment', 'employee'],
    player: { x: SPOTS.player_start.x, y: SPOTS.player_start.y },
    reports: [],
    endless: null,
    ending: null,
    playSeconds: 0,
    counter: 0,
  };
}

export function seedFrom(name: string, salt: number): number {
  return (hashString(name) ^ (salt >>> 0)) >>> 0 || 1;
}

export function newCampaign(playerName: string, seed: number): GameState {
  const g = base('campaign', playerName, seed);
  g.flags['chapter_intro_1'] = true;
  return g;
}

export function newEndless(playerName: string, seed: number): GameState {
  const g = base('endless', playerName, seed);
  g.areas = ['reception', 'judgment', 'employee', 'interview', 'archive', 'management'];
  g.credits = 120;
  g.chapter = 0;
  g.flags['met_pim'] = true;
  g.flags['at_desk'] = true;
  g.endless = { cycle: 1, goals: [], goalsDone: 0, totals: {}, eventLog: [] };
  initGoals(g);
  g.player = { x: SPOTS.player_desk.x, y: SPOTS.player_desk.y };
  return g;
}
