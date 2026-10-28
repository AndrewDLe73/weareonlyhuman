import { EDITIONS } from '../data/editions'

// Cards without a level (the Breakup edition) are matched by 'none'.
export const LEVELS = [
  { key: 1, label: 'Level 1' },
  { key: 2, label: 'Level 2' },
  { key: 3, label: 'Level 3' },
  { key: 'none', label: 'No level' },
]

// An empty `levels` list means "all levels", so the deck can never be emptied
// by the level filter alone.
export const DEFAULT_SETTINGS = {
  editions: ['Custom'],
  levels: [],
  includeWildcards: false,
  includeReminders: false,
  noRepeats: true,
}

export function buildDeck(settings) {
  const editions = new Set(settings.editions)
  const levels = new Set(settings.levels)

  return EDITIONS
    .filter((e) => editions.has(e.key))
    .flatMap((e) => e.cards)
    .filter((card) => {
      if (card.Type === 'Wildcard' && !settings.includeWildcards) return false
      if (card.Type === 'Reminder' && !settings.includeReminders) return false
      return levels.size === 0 || levels.has(card.Level ?? 'none')
    })
}

// How many cards each settings option contributes, given every other setting
// as it stands, so players can see what a toggle adds before flipping it.
export function optionCounts(settings) {
  const countWith = (patch) => buildDeck({ ...settings, ...patch }).length
  const countType = (type, patch) => buildDeck({ ...settings, ...patch }).filter((c) => c.Type === type).length

  return {
    editions: Object.fromEntries(EDITIONS.map((e) => [e.key, countWith({ editions: [e.key] })])),
    levels: Object.fromEntries(LEVELS.map((l) => [l.key, countWith({ levels: [l.key] })])),
    wildcards: countType('Wildcard', { includeWildcards: true }),
    reminders: countType('Reminder', { includeReminders: true }),
  }
}

// Toggle one level; picking every level collapses back to "all" ([]).
export function toggleLevel(levels, key) {
  const next = levels.includes(key) ? levels.filter((l) => l !== key) : [...levels, key]
  return LEVELS.every((l) => next.includes(l.key)) ? [] : next
}

export const pickRandom = (cards) => cards[Math.floor(Math.random() * cards.length)]
