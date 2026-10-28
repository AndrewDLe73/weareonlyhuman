import { FriendshipEdition, BreakupEdition, HonestDatingEdition, CouplesEdition, CustomEdition, OpenBookEdition } from './cards'

// Display order for the settings panel. "Custom" is shown to players as "Core".
export const EDITIONS = [
  { key: 'Custom', label: 'Core', cards: CustomEdition },
  { key: 'OpenBook', label: 'Open Book', cards: OpenBookEdition },
  { key: 'Friendship', label: 'Friendship', cards: FriendshipEdition },
  { key: 'HonestDating', label: 'Honest Dating', cards: HonestDatingEdition },
  { key: 'Couples', label: 'Couples', cards: CouplesEdition },
  { key: 'Breakup', label: 'Breakup', cards: BreakupEdition },
]

export const CARDS_BY_ID = new Map(EDITIONS.flatMap((e) => e.cards).map((card) => [card.id, card]))

export const editionLabel = (key) => EDITIONS.find((e) => e.key === key)?.label ?? key
