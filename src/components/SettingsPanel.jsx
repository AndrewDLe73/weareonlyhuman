import { CARDS_BY_ID, EDITIONS, editionLabel } from '../data/editions'
import { useMemo } from 'react'
import { LEVELS, optionCounts, toggleLevel } from '../lib/deck'

const toggle = (list, item) => (list.includes(item) ? list.filter((x) => x !== item) : [...list, item])

function Chip({ checked, onChange, children }) {
  return (
    <label className="chip">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span>{children}</span>
    </label>
  )
}

export default function SettingsPanel({
  open, onClose, settings, onChange, deckSize, remaining, history, onSelectCard, onResetHistory,
}) {
  const update = (patch) => onChange({ ...settings, ...patch })
  const counts = useMemo(() => optionCounts(settings), [settings])
  const noEditions = settings.editions.length === 0
  const allLevels = settings.levels.length === 0
  // Only offer levels that exist in the chosen editions (e.g. "No level" is Breakup-only).
  const visibleLevels = LEVELS.filter((l) => counts.levels[l.key] > 0 || settings.levels.includes(l.key))

  return (
    <>
      <div className={`backdrop ${open ? 'is-open' : ''}`} onClick={onClose} />
      <aside className={`settings ${open ? 'is-open' : ''}`} aria-label="Deck settings" aria-hidden={!open}>
        <div className="settings-header">
          <h2>Deck settings</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close settings">✕</button>
        </div>

        <div className={`deck-count ${deckSize === 0 ? 'is-empty' : ''}`} aria-live="polite">
          <span className="deck-count-number">{deckSize}</span>
          <span className="deck-count-label">
            {deckSize === 1 ? 'card' : 'cards'} in deck
            <small>
              {noEditions
                ? 'Pick an edition below to start'
                : deckSize === 0
                  ? 'Nothing matches. Try another level'
                  : settings.noRepeats ? `${remaining} left to draw` : 'Cards can repeat'}
            </small>
          </span>
        </div>
        <p className="muted counts-hint">Numbers show how many cards each option adds.</p>

        <section className={noEditions ? 'needs-attention' : ''}>
          <h3><span className="step">1</span> Pick editions</h3>
          <div className="chips">
            {EDITIONS.map((e) => (
              <Chip key={e.key} checked={settings.editions.includes(e.key)}
                onChange={() => update({ editions: toggle(settings.editions, e.key) })}>
                {e.label} <small>{counts.editions[e.key]}</small>
              </Chip>
            ))}
          </div>
        </section>

        <section>
          <h3><span className="step">2</span> Levels <span className="optional">optional</span></h3>
          {noEditions ? (
            <p className="muted">Pick an edition first.</p>
          ) : (
            <div className="chips">
              <Chip checked={allLevels} onChange={() => update({ levels: [] })}>All</Chip>
              {visibleLevels.map((l) => (
                <Chip key={l.key} checked={settings.levels.includes(l.key)}
                  onChange={() => update({ levels: toggleLevel(settings.levels, l.key) })}>
                  {l.label} <small>{counts.levels[l.key]}</small>
                </Chip>
              ))}
            </div>
          )}
        </section>

        <section>
          <h3><span className="step">3</span> Extras <span className="optional">optional</span></h3>
          <div className="chips">
            <Chip checked={settings.includeWildcards} onChange={() => update({ includeWildcards: !settings.includeWildcards })}>
              Wildcards <small>{counts.wildcards}</small>
            </Chip>
            <Chip checked={settings.includeReminders} onChange={() => update({ includeReminders: !settings.includeReminders })}>
              Reminders <small>{counts.reminders}</small>
            </Chip>
            <Chip checked={settings.noRepeats} onChange={() => update({ noRepeats: !settings.noRepeats })}>
              Don't repeat cards
            </Chip>
          </div>
        </section>

        <section>
          <div className="section-row">
            <h3>History <small>{history.length}</small></h3>
            {history.length > 0 && (
              <button type="button" className="text-btn danger" onClick={onResetHistory}>Reshuffle</button>
            )}
          </div>
          {history.length === 0 ? (
            <p className="muted">Cards you draw will show up here.</p>
          ) : (
            <ol className="history">
              {[...history].reverse().map((id) => {
                const card = CARDS_BY_ID.get(id)
                if (!card) return null
                return (
                  <li key={id}>
                    <button type="button" onClick={() => onSelectCard(id)}>
                      <span className="history-text">{card.Question}</span>
                      <small>{editionLabel(card.Edition)}{card.Level ? ` · Level ${card.Level}` : ''}</small>
                    </button>
                  </li>
                )
              })}
            </ol>
          )}
        </section>

        <p className="muted shortcuts">
          Keyboard: <kbd>Space</kbd> next card · <kbd>`</kbd> settings · <kbd>Esc</kbd> close
        </p>
      </aside>
    </>
  )
}
