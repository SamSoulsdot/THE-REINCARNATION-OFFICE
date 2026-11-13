import type { GameState } from './types';

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'N. N.';
  return parts.map((p) => p[0].toUpperCase() + '.').join(' ');
}

/** Sostituisce i segnaposto narrativi ({nome}, {iniziali}, {dopodomani}). */
export function fmt(g: Pick<GameState, 'playerName' | 'day'>, text: string): string {
  return text
    .replaceAll('{nome}', g.playerName)
    .replaceAll('{iniziali}', initials(g.playerName))
    .replaceAll('{dopodomani}', String(g.day + 2) + ' del registro corrente');
}

export const DEST_LABEL = {
  ascension: 'L\'Ascensione',
  renewal: 'Il Rinnovo',
  trial: 'La Prova',
  otherForm: 'L\'Altra Forma',
  waitingRoom: 'La Sala d\'Attesa',
} as const;
