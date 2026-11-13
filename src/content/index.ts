// Punto d'accesso unico ai contenuti. Per aggiungere una lingua: creare ./en con gli stessi
// moduli e scegliere qui il pacchetto in base alla lingua attiva (vedi src/i18n).
export { CURATED, CURATED_IDS } from './it/cases';
export { KNOWLEDGE, LINKS, MYSTERIES } from './it/knowledge';
export { TEMPLATES } from './it/templates';
export {
  NAMES_F, NAMES_M, SURNAMES, TOWNS, ERAS, OTHER_FORMS, PREDISPOSITION, TRAIT_LABEL, FEAR_BY_CAUSE, FEAR_DEFAULT, EVENTS, TEMPERS, VERDICT_REACTIONS,
} from './it/procedural';
export { ROLES, DEPARTMENTS, TOOLS, DIRECTIVES, ENDLESS_DIRECTIVES, CANDIDATE_ORIGINS } from './it/office';
export { NPCS, SPEAKERS, OBJ_LABEL, AREA_LABEL, AREA_LOCKED, ROOM_EVENTS, WORLD_PUZZLES, LORE, OVERHEARD, CONVOS } from './it/world';
export { CHAPTERS, DAYS, LAST_DAY, ENDINGS, CYCLE_REASONS, EPILOGUE } from './it/campaign';
export { ENDLESS_EVENTS, ENDLESS_GOALS, ENDLESS_BARKS } from './it/endless';
