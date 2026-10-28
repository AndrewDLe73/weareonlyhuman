import { editionLabel } from '../data/editions'

export default function Card({ card, isFlipped, onClick }) {
  const typeClass = card?.Type ? `is-${card.Type.toLowerCase()}` : ''

  return (
    <button
      type="button"
      className={`card ${isFlipped ? 'is-flipped' : ''}`}
      onClick={onClick}
      aria-label={isFlipped && card ? card.Question : 'Deal a card'}
    >
      <span className="card-inner">
        <span className="card-face card-cover">
          <span className="card-cover-title">We Are<br />Only Human</span>
        </span>

        <span className={`card-face card-question ${typeClass}`} aria-hidden="true">
          {card && (
            <>
              <span className="card-meta">{card.Level ? `Level ${card.Level}` : ''}</span>
              <span className="card-text">{card.Question}</span>
              <span className="card-meta">{editionLabel(card.Edition)} Edition</span>
            </>
          )}
        </span>
      </span>
    </button>
  )
}
