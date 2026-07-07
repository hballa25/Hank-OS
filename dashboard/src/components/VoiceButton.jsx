import React, { useRef, useState } from 'react'

// Tier-1 voice: Chrome's built-in speech recognition — no API key, no cost.
// Plain speech becomes an Inbox capture (the Gardener files it overnight).
// "find <x>" / "show me <x>" flies the galaxy; "go to finance|health|galaxy" switches tabs.
export default function VoiceButton({ onFind, onTab, onAsk }) {
  const [listening, setListening] = useState(false)
  const [toast, setToast] = useState('')
  const recRef = useRef(null)

  const SR = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!SR) return null // non-Chrome: hide the mic

  const toggle = () => {
    if (listening) {
      recRef.current?.stop()
      return
    }
    const rec = new SR()
    rec.lang = 'en-US'
    rec.interimResults = true
    rec.continuous = true
    let finalText = ''
    rec.onresult = (e) => {
      let interim = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript
        if (e.results[i].isFinal) finalText += t + ' '
        else interim += t
      }
      setToast(('🎙 ' + finalText + interim).trim())
    }
    rec.onend = async () => {
      setListening(false)
      const text = finalText.trim()
      if (!text) return setToast('')
      const lower = text.toLowerCase()
      const tabM = lower.match(/^(?:go to|switch to|show)\s+(galaxy|finance|health|connections|claude|browser)\b/)
      const findM = lower.match(/^(?:find|show me|open|search for|search)\s+(.+)/)
      const askM = lower.match(/^(what|when|where|who|how|why|which|do i|did i|am i|is |are |should i|can i)/)
      if (tabM) {
        onTab(tabM[1][0].toUpperCase() + tabM[1].slice(1))
        setToast(`→ ${tabM[1]}`)
      } else if (findM) {
        onFind(findM[1].replace(/[.?!]+$/, ''))
        setToast(`🔍 ${findM[1]}`)
      } else if (askM && onAsk) {
        onAsk(text)
        setToast(`🧠 asking your brain…`)
      } else {
        const r = await (
          await fetch('/api/capture', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, source: 'voice' }),
          })
        ).json()
        setToast(r.ok ? '🧠 Captured → Inbox. The Gardener files it tonight.' : `error: ${r.error}`)
      }
      setTimeout(() => setToast(''), 6000)
    }
    rec.onerror = (e) => {
      setListening(false)
      setToast(e.error === 'not-allowed' ? 'Mic blocked — allow it in Chrome site settings' : '')
    }
    recRef.current = rec
    rec.start()
    setListening(true)
    setToast('listening… (click again to stop)')
  }

  return (
    <>
      <button className={listening ? 'mic on' : 'mic'} onClick={toggle}
        title={'Voice — dictate a capture, or say "find …" / "go to finance"'}>
        {listening ? '🔴' : '🎤'}
      </button>
      {toast && <div className="voice-toast">{toast}</div>}
    </>
  )
}
