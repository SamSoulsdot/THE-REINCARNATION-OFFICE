import { describe, expect, it } from 'vitest';
import type { CaseDef, GameState } from '../../src/engine/types';
import { newCampaign } from '../../src/engine/sim';
import { resolveEnding, allies } from '../../src/engine/campaign';
import { solvedMysteries } from '../../src/engine/knowledge';
import { playDay, type BotOpts, type Pick } from '../helpers/bot';
import { LAST_DAY } from '../../src/content';

function playCampaign(opts: BotOpts, seed = 2024): GameState {
  const g = newCampaign('Ada Loris', seed);
  for (let d = 1; d <= LAST_DAY; d++) {
    expect(g.day).toBe(d);
    playDay(g, opts);
  }
  expect(g.flags['closed_c13']).toBe(true);
  return g;
}

const special = (sp: string[], id: string): string | undefined => (sp.includes(id) ? id : undefined);

/** Giocatore indagatore e compassionevole: cerca la verità e usa le sentenze speciali. */
function humane(final: 'trial' | 'renewal' | 'otherForm'): BotOpts {
  return {
    investigate: true,
    choice: (id) => (id === 'vesper_mv' ? 1 : 0),
    pick: (_g, def: CaseDef, sp): Pick => {
      switch (def.id) {
        case 'c01': return { dest: 'renewal' };
        case 'c02': return { dest: 'renewal' };
        case 'c03': return { dest: 'renewal', specialId: special(sp, 'rettifica') };
        case 'c04': return { dest: 'renewal' };
        case 'c05': return { dest: 'waitingRoom', specialId: special(sp, 'custodia') };
        case 'c06': return { dest: 'trial', specialId: special(sp, 'stessa_sorte') };
        case 'c07': return { dest: 'waitingRoom', specialId: special(sp, 'ricongiunzione') };
        case 'c08': return { dest: 'renewal' };
        case 'c09': return { dest: 'waitingRoom', specialId: special(sp, 'archiviare') };
        case 'c10': return { dest: 'renewal' };
        case 'c11': return { dest: 'renewal', specialId: special(sp, 'separazione') };
        case 'c12': return { dest: 'renewal', specialId: special(sp, 'memoria') };
        case 'c13': return { dest: final };
        default: return { dest: def.recommended };
      }
    },
  };
}

/** Impiegato modello: non indaga, applica le raccomandazioni, esegue gli ordini. */
const compliant: BotOpts = {
  investigate: false,
  choice: () => 0,
  pick: (_g, def, sp): Pick => {
    if (def.id === 'c10') return { dest: 'waitingRoom', specialId: special(sp, 'macerazione') };
    if (def.id === 'c12') return { dest: 'ascension' };
    if (def.id === 'c13') return { dest: 'ascension' };
    return { dest: def.recommended };
  },
};

describe('campagna completa (bot)', () => {
  it('si gioca dall\'inizio alla fine senza blocchi, con qualunque stile', () => {
    const g = playCampaign({ investigate: false, pick: (_g, def) => ({ dest: def.id === 'c13' ? 'waitingRoom' : def.recommended }) });
    expect(resolveEnding(g).id).toBe('cycle');
    expect(g.decisions.length).toBeGreaterThanOrEqual(13);
  });

  it('The Perfect Employee: obbedienza, reputazione alta, Direttore consegnato al Collegio', () => {
    const g = playCampaign(compliant);
    expect(g.flags['odile_macerata']).toBe(true);
    expect(g.stats.reputazione).toBeGreaterThanOrEqual(55);
    expect(resolveEnding(g).id).toBe('perfect');
  });

  it('The Reformer: verità, alleati e processo al Direttore', () => {
    const g = playCampaign(humane('trial'));
    expect(solvedMysteries(g)).toBeGreaterThanOrEqual(4);
    expect(allies(g).length).toBeGreaterThanOrEqual(2);
    expect(resolveEnding(g).id).toBe('reformer');
  });

  it('The Rebel: giudizi irregolari, mani amiche, istituzione disfatta', () => {
    const g = playCampaign(humane('otherForm'));
    expect(g.stats.irregolari).toBeGreaterThanOrEqual(5);
    expect(resolveEnding(g).id).toBe('rebel');
  });

  it('The New Beginning: memoria integra e Residuo restituito', () => {
    const g = playCampaign(humane('renewal'));
    expect(g.flags['self_memoria']).toBe(true);
    expect(solvedMysteries(g)).toBeGreaterThanOrEqual(5);
    expect(resolveEnding(g).id).toBe('newbeginning');
  });

  it('The Eternal Cycle: chi sceglie di dimenticare ricomincia, qualunque cosa decida sul Direttore', () => {
    const o = humane('trial');
    const g = playCampaign({ ...o, pick: (gg, def, sp) => (def.id === 'c12' ? { dest: 'renewal' } : o.pick(gg, def, sp)) });
    const e = resolveEnding(g);
    expect(e.id).toBe('cycle');
    expect(e.reason).toContain('settima volta');
  });

  it('la stessa scelta finale porta a finali diversi secondo ciò che si è fatto prima', () => {
    const lazy = playCampaign({ investigate: false, pick: (_g, def) => ({ dest: def.id === 'c13' ? 'trial' : def.recommended }) });
    expect(resolveEnding(lazy).id).toBe('cycle');
    expect(resolveEnding(playCampaign(humane('trial'))).id).toBe('reformer');
  });

  it('le anime giudicate ritornano e le decisioni lasciano traccia', () => {
    const g = playCampaign(humane('trial'));
    // Lorenz Hable torna nel capitolo III come nuova incarnazione della stessa anima.
    const lorenz = g.souls['S-LORENZ'];
    expect(lorenz.incarnations.length).toBeGreaterThanOrEqual(2);
    expect(lorenz.incarnations[1].name).toBe('Ines Dorn');
    expect(g.decisions.filter((d) => d.soulId === 'S-LORENZ').length).toBe(2);
    // Il caso Vos contiene l'atto di rettifica redatto chiudendo il caso Hable.
    expect(g.closed['c06'].clues).toContain('rettifica');
    // Anime procedurali ricorrenti: almeno una è tornata allo sportello.
    expect(g.decisions.some((d) => d.caseId.startsWith('p:') && !d.caseId.endsWith(':1'))).toBe(true);
    expect(g.flags['promessa_mantenuta']).toBe(true);
  });

  it('una perdita definitiva non blocca la campagna', () => {
    const o = humane('trial');
    const g = playCampaign({
      ...o,
      choice: (id) => (id === 'quill_intro' ? 1 : id === 'vesper_mv' ? 1 : 0),
      pick: (gg, def, sp) => (def.id === 'c09' ? { dest: 'otherForm' } : def.id === 'c05' ? { dest: 'waitingRoom' } : o.pick(gg, def, sp)),
    });
    expect(g.npc['ilse']).toBe('scomparso');
    expect(g.flags['ilse_arredo']).toBe(true);
    expect(g.npc['hoot']).toBe('scomparso');
    expect(g.flags['nn_attesa']).toBe(true);
    expect(g.flags['closed_c13']).toBe(true);
  });

  it('è deterministica: stesso seed e stesse scelte, stesso stato', () => {
    const a = playCampaign(humane('trial'), 77), b = playCampaign(humane('trial'), 77);
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });
});
