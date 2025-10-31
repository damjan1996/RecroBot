'use client'

import { useEffect, useState } from 'react'
import { Mic, MicOff, Phone, PhoneOff, Bot } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useInterviewStore } from '@/lib/store'
import { getVapiClient } from '@/lib/vapi'
import { formatDuration } from '@/lib/utils'

export function VoiceInterface() {
  const {
    callStatus,
    duration,
    applicant,
    isRecording,
    setConnected,
    setMuted,
    setVolumeLevel,
    setError,
    setRecording,
    incrementDuration,
    startInterview,
    endInterview,
    addTranscriptMessage,
  } = useInterviewStore()

  const [vapiClient] = useState(() => getVapiClient())
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (callStatus.status === 'active') {
      interval = setInterval(() => {
        incrementDuration()
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [callStatus.status, incrementDuration])

  const initializeVapi = async () => {
    if (isInitialized) return

    try {
      await vapiClient.initialize()
      setIsInitialized(true)
    } catch (error) {
      console.error('Failed to initialize Vapi:', error)
      setError('Fehler beim Initialisieren der Voice AI')
    }
  }

  const handleStartCall = async () => {
    if (!applicant) {
      setError('Keine Bewerberdaten gefunden')
      return
    }

    try {
      await initializeVapi()
      startInterview()
      setRecording(true)
      setError(undefined)

      await vapiClient.startCall(
        // onCallStart
        (event) => {
          console.log('Call started:', event)
          setConnected(true)
        },
        // onCallEnd
        (event) => {
          console.log('Call ended:', event)
          setConnected(false)
          setRecording(false)
          endInterview()
        },
        // onSpeechStart
        () => {
          console.log('Speech started')
        },
        // onSpeechEnd
        () => {
          console.log('Speech ended')
        },
        // onMessage
        (message) => {
          console.log('VoiceInterface - Message received:', message)
          if (message && message.content && message.content.trim()) {
            addTranscriptMessage({
              role: message.role,
              message: message.content,
            })
          } else {
            console.log('VoiceInterface - Ignoring empty message:', message)
          }
        },
        // onError
        (error) => {
          console.error('Vapi error:', error)
          setError(error.error.message)
          setConnected(false)
          setRecording(false)
        },
        // onVolumeLevel
        (volumeEvent) => {
          console.log('Volume level received:', volumeEvent)
          // Extract volume from different possible formats
          let volume = 0
          if (typeof volumeEvent === 'number') {
            volume = volumeEvent
          } else if (volumeEvent?.volume !== undefined) {
            volume = volumeEvent.volume
          } else if ((volumeEvent as any)?.detail !== undefined) {
            volume = (volumeEvent as any).detail
          } else if ((volumeEvent as any)?.level !== undefined) {
            volume = (volumeEvent as any).level
          }
          
          if (typeof volume === 'number' && !isNaN(volume)) {
            console.log('✅ Setting volume level:', volume)
            setVolumeLevel(volume)
          } else {
            console.log('❌ Invalid volume format:', volumeEvent)
          }
        }
      )
    } catch (error) {
      console.error('Failed to start call:', error)
      setError('Fehler beim Starten des Anrufs')
      setRecording(false)
    }
  }

  const handleEndCall = async () => {
    try {
      await vapiClient.endCall()
      setConnected(false)
      setRecording(false)
      endInterview()
    } catch (error) {
      console.error('Failed to end call:', error)
      setError('Fehler beim Beenden des Anrufs')
    }
  }

  const handleToggleMute = async () => {
    try {
      const isMuted = await vapiClient.toggleMute()
      setMuted(isMuted)
    } catch (error) {
      console.error('Failed to toggle mute:', error)
      setError('Fehler beim Stumm-/Entstummen')
    }
  }

  const getStatusIcon = () => {
    switch (callStatus.status) {
      case 'idle':
        return <Bot className="h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 text-gray-400" />
      case 'connecting':
        return <Bot className="h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 text-blue-600 animate-pulse" />
      case 'active':
        return <Bot className="h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 text-green-600 animate-pulse-slow" />
      case 'ended':
        return <Bot className="h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 text-gray-600" />
      default:
        return <Bot className="h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 text-gray-400" />
    }
  }

  const getStatusText = () => {
    switch (callStatus.status) {
      case 'idle':
        return 'Bereit zum Start'
      case 'connecting':
        return 'Verbinde...'
      case 'active':
        return 'Interview läuft'
      case 'ended':
        return 'Interview beendet'
      default:
        return 'Unbekannter Status'
    }
  }

  const getStatusColor = () => {
    switch (callStatus.status) {
      case 'idle':
        return 'text-gray-600'
      case 'connecting':
        return 'text-blue-600'
      case 'active':
        return 'text-green-600'
      case 'ended':
        return 'text-gray-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className="flex flex-col items-center space-y-4 sm:space-y-6 lg:space-y-8 p-4 sm:p-6 lg:p-8">
      {/* Status Display */}
      <div className="text-center">
        <div className="mb-3 sm:mb-4 p-4 sm:p-6 lg:p-8 bg-white rounded-full shadow-lg border-2 sm:border-4 border-gray-100">
          {getStatusIcon()}
        </div>
        
        <h2 className={`text-lg sm:text-xl lg:text-2xl font-bold mb-2 ${getStatusColor()}`}>
          {getStatusText()}
        </h2>
        
        {applicant && (
          <p className="text-sm sm:text-base text-gray-600 px-2">
            Interview mit {applicant.name} für {applicant.position}
          </p>
        )}
      </div>

      {/* Timer */}
      <div className="text-center">
        <div className="text-2xl sm:text-3xl lg:text-4xl font-mono font-bold text-gray-900 mb-1 sm:mb-2">
          {formatDuration(duration)}
        </div>
        <p className="text-xs sm:text-sm text-gray-500">Gesprächsdauer</p>
      </div>

      {/* Volume Level */}
      {callStatus.status === 'active' && (
        <div className="w-full max-w-xs px-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm text-gray-600">Audio Level</span>
            <span className="text-xs sm:text-sm text-gray-600">
              {isNaN(callStatus.volumeLevel) ? '0' : Math.round(callStatus.volumeLevel * 100)}%
            </span>
          </div>
          <Progress 
            value={isNaN(callStatus.volumeLevel) ? 0 : callStatus.volumeLevel * 100} 
            className="h-2 sm:h-3" 
          />
        </div>
      )}

      {/* Error Display */}
      {callStatus.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 max-w-md mx-2">
          <p className="text-red-700 text-xs sm:text-sm text-center">{callStatus.error}</p>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full max-w-sm px-2">
        {callStatus.status === 'idle' && (
          <Button
            onClick={handleStartCall}
            size="lg"
            className="bg-green-600 hover:bg-green-700 px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto text-sm sm:text-base"
            disabled={!applicant}
          >
            <Phone className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            Interview starten
          </Button>
        )}

        {(callStatus.status === 'connecting' || callStatus.status === 'active') && (
          <>
            <Button
              onClick={handleToggleMute}
              variant={callStatus.isMuted ? "destructive" : "outline"}
              size="lg"
              className="px-4 sm:px-6 py-3 sm:py-4 w-full sm:w-auto min-w-[60px]"
            >
              {callStatus.isMuted ? (
                <MicOff className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <Mic className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
              <span className="ml-2 sm:hidden">{callStatus.isMuted ? 'Stumm' : 'Aktiv'}</span>
            </Button>

            <Button
              onClick={handleEndCall}
              variant="destructive"
              size="lg"
              className="px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto text-sm sm:text-base"
            >
              <PhoneOff className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Beenden
            </Button>
          </>
        )}

        {callStatus.status === 'ended' && (
          <Button
            onClick={() => window.location.href = '/success'}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto text-sm sm:text-base"
          >
            Ergebnisse ansehen
          </Button>
        )}
      </div>

      {/* Recording Indicator */}
      {isRecording && (
        <div className="flex items-center space-x-2 text-red-600 bg-red-50 px-3 py-2 rounded-full">
          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-600 rounded-full animate-pulse"></div>
          <span className="text-xs sm:text-sm font-medium">Aufnahme läuft</span>
        </div>
      )}
    </div>
  )
}