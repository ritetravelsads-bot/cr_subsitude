"use client"

import { useState, useEffect, useCallback, useRef } from "react"

// Extend Window interface for Speech Recognition
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition
    webkitSpeechRecognition: new () => SpeechRecognition
  }
}

// SpeechRecognition interface for TypeScript
interface SpeechRecognition extends EventTarget {
  lang: string
  interimResults: boolean
  continuous: boolean
  maxAlternatives: number
  start(): void
  stop(): void
  abort(): void
  onstart: ((this: SpeechRecognition, ev: Event) => void) | null
  onend: ((this: SpeechRecognition, ev: Event) => void) | null
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void) | null
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
  message?: string
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
  resultIndex: number
}

interface SpeechRecognitionResultList {
  length: number
  item(index: number): SpeechRecognitionResult
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionResult {
  isFinal: boolean
  length: number
  item(index: number): SpeechRecognitionAlternative
  [index: number]: SpeechRecognitionAlternative
}

interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}

interface UseVoiceSearchOptions {
  lang?: string
  onResult?: (transcript: string) => void
  onError?: (error: string) => void
  onInterimResult?: (transcript: string) => void
}

interface UseVoiceSearchReturn {
  isListening: boolean
  transcript: string
  interimTranscript: string
  isSupported: boolean
  startListening: () => void
  stopListening: () => void
  error: string | null
  confidence: number | null
}

export function useVoiceSearch(options: UseVoiceSearchOptions = {}): UseVoiceSearchReturn {
  const { lang = "en-US", onResult, onError, onInterimResult } = options
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [interimTranscript, setInterimTranscript] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSupported, setIsSupported] = useState(false)
  const [confidence, setConfidence] = useState<number | null>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  useEffect(() => {
    const SpeechRecognitionAPI =
      typeof window !== "undefined"
        ? window.SpeechRecognition || window.webkitSpeechRecognition
        : null
    setIsSupported(!!SpeechRecognitionAPI)
  }, [])

  const startListening = useCallback(() => {
    const SpeechRecognitionAPI =
      typeof window !== "undefined"
        ? window.SpeechRecognition || window.webkitSpeechRecognition
        : null

    if (!SpeechRecognitionAPI) {
      const msg = "Voice search is not supported in this browser."
      setError(msg)
      onError?.(msg)
      return
    }

    // Stop any existing recognition
    if (recognitionRef.current) {
      recognitionRef.current.abort()
    }

    const recognition = new SpeechRecognitionAPI()
    recognitionRef.current = recognition

    recognition.lang = lang
    recognition.interimResults = true
    recognition.continuous = false
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      setIsListening(true)
      setError(null)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const current = event.results[event.results.length - 1]
      const text = current[0].transcript
      const resultConfidence = current[0].confidence

      if (current.isFinal) {
        setTranscript(text)
        setInterimTranscript("")
        setConfidence(resultConfidence)
        onResult?.(text)
      } else {
        setInterimTranscript(text)
        onInterimResult?.(text)
      }
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      let msg = "An error occurred during voice recognition."
      if (event.error === "not-allowed") {
        msg = "Microphone access was denied. Please allow microphone permissions."
      } else if (event.error === "no-speech") {
        msg = "No speech was detected. Please try again."
      } else if (event.error === "network") {
        msg = "Network error occurred. Please check your connection."
      } else if (event.error === "aborted") {
        // User aborted, not an error
        msg = ""
      } else if (event.error === "audio-capture") {
        msg = "No microphone found. Please check your audio input device."
      } else if (event.error === "service-not-allowed") {
        msg = "Speech recognition service is not allowed. Please check browser settings."
      }
      
      if (msg) {
        setError(msg)
        onError?.(msg)
      }
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
      recognitionRef.current = null
    }

    try {
      recognition.start()
    } catch {
      setError("Could not start voice recognition.")
      setIsListening(false)
    }
  }, [lang, onResult, onError])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
    }
  }, [])

  return {
    isListening,
    transcript,
    interimTranscript,
    isSupported,
    startListening,
    stopListening,
    error,
    confidence,
  }
}
