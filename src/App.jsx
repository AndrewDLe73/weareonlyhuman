import { useEffect, useMemo, useRef, useState } from 'react'
import { useSwipeable } from 'react-swipeable'
import { CARDS_BY_ID } from './data/editions'
import { buildDeck, DEFAULT_SETTINGS, pickRandom } from './lib/deck'
import { useLocalStorage } from './hooks/useLocalStorage'
import PasswordGate from './components/PasswordGate'
import Card from './components/Card'
import SettingsPanel from './components/SettingsPanel'

// Must match --flip-ms in index.css.
const FLIP_MS = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 0 : 500

function App() {
  const [unlocked, setUnlocked] = useLocalStorage('woh:unlocked', false)
  const [storedSettings, setSettings] = useLocalStorage('woh:settings', DEFAULT_SETTINGS)
  const [history, setHistory] = useLocalStorage('woh:history', [])
  const [currentId, setCurrentId] = useState(null)
  const [isFlipped, setIsFlipped] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const dealTimer = useRef(null)

  // Merge so settings saved by an older version still have every key.
  const settings = useMemo(() => ({ ...DEFAULT_SETTINGS, ...storedSettings }), [storedSettings])
  const deck = useMemo(() => buildDeck(settings), [settings])
  const remaining = useMemo(() => {
    if (!settings.noRepeats) return deck
    const seen = new Set(history)
    return deck.filter((card) => !seen.has(card.id))
  }, [deck, history, settings.noRepeats])

  const currentCard = currentId ? CARDS_BY_ID.get(currentId) : null
  const exhausted = deck.length > 0 && remaining.length === 0

  // Flip the current card face down, then deal the next one face up.
  const advance = () => {
    if (dealTimer.current) return

    const pool = remaining.length > 1 ? remaining.filter((card) => card.id !== currentId) : remaining
    if (pool.length === 0) return
    const next = pickRandom(pool)

    setIsFlipped(false)
    dealTimer.current = setTimeout(() => {
      dealTimer.current = null
      setCurrentId(next.id)
      setHistory((h) => [...h.filter((id) => id !== next.id), next.id])
      setIsFlipped(true)
    }, isFlipped ? FLIP_MS : 0)
  }

  const showCard = (id) => {
    setCurrentId(id)
    setIsFlipped(true)
    setSettingsOpen(false)
  }

  const reshuffle = () => {
    setHistory([])
    setCurrentId(null)
    setIsFlipped(false)
  }

  useEffect(() => () => clearTimeout(dealTimer.current), [])

  // Keep the listener stable but always call the latest advance().
  const advanceRef = useRef(advance)
  advanceRef.current = advance

  useEffect(() => {
    if (!unlocked) return
    const onKeyDown = (e) => {
      if (e.target.closest?.('input, textarea, select')) return
      if (e.key === '`') return setSettingsOpen((open) => !open)
      if (e.key === 'Escape') return setSettingsOpen(false)
      if (settingsOpen) return
      // Space/Enter on a focused button already triggers its click.
      const onButton = e.target.closest?.('button')
      if (e.key === 'ArrowRight' || (!onButton && (e.key === ' ' || e.key === 'Enter'))) {
        e.preventDefault()
        advanceRef.current()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [unlocked, settingsOpen])

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => advance(),
    onSwipedDown: () => advance(),
    preventScrollOnSwipe: true,
  })

  if (!unlocked) return <PasswordGate onUnlock={() => setUnlocked(true)} />

  return (
    <div className="app">
      <header className="topbar">
        <span className="brand">We Are Only Human</span>
        <button type="button" className="icon-btn" onClick={() => setSettingsOpen(true)} aria-label="Open deck settings">
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0" />
            <circle cx="16" cy="6" r="2" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="10" cy="12" r="2" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="18" cy="18" r="2" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>
      </header>

      <main className="stage" {...swipeHandlers}>
        {deck.length === 0 ? (
          <div className="empty">
            <p>No cards match your settings.</p>
            <button type="button" className="btn" onClick={() => setSettingsOpen(true)}>Choose editions</button>
          </div>
        ) : (
          <Card card={currentCard} isFlipped={isFlipped} onClick={advance} />
        )}
      </main>

      {deck.length > 0 && (
        <footer className="controls">
          {exhausted ? (
            <>
              <p className="muted">You've drawn every card in this deck.</p>
              <button type="button" className="btn" onClick={reshuffle}>Reshuffle</button>
            </>
          ) : (
            <>
              <button type="button" className="btn" onClick={advance}>
                {currentCard ? 'Next card' : 'Deal a card'}
              </button>
              <p className="muted">
                {settings.noRepeats ? `${remaining.length} of ${deck.length} left` : `${deck.length} cards`}
                <span className="hint"> · tap the card, swipe, or press Space</span>
              </p>
            </>
          )}
        </footer>
      )}

      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onChange={setSettings}
        deckSize={deck.length}
        remaining={remaining.length}
        history={history}
        onSelectCard={showCard}
        onResetHistory={reshuffle}
      />
    </div>
  )
}

export default App
