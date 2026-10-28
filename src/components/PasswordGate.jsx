import { useState } from 'react'

// This only keeps casual visitors out: the phrase ships in the JS bundle.
const PASSPHRASE = 'and i will allow us to be'

const normalize = (text) => text.toLowerCase().replace(/\s+/g, ' ').trim()

export default function PasswordGate({ onUnlock }) {
  const [value, setValue] = useState('')

  const handleChange = (event) => {
    setValue(event.target.value)
    if (normalize(event.target.value) === PASSPHRASE) onUnlock()
  }

  return (
    <main className="gate">
      <h1 className="gate-title">We Are Only Human</h1>
      <input
        className="gate-input"
        type="text"
        placeholder="Enter the phrase"
        aria-label="Passphrase"
        autoComplete="off"
        autoCapitalize="none"
        spellCheck={false}
        autoFocus
        value={value}
        onChange={handleChange}
      />
    </main>
  )
}
