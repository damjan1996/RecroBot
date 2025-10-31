'use client'

import { useState } from 'react'
import { Download, ArrowLeft, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useInterviewStore } from '@/lib/store'
import { formatDuration } from '@/lib/utils'

export function InterviewControls() {
  const {
    applicant,
    interview,
    callStatus,
    transcript,
    duration,
    resetStore,
  } = useInterviewStore()

  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownloadTranscript = async () => {
    if (transcript.length === 0) return

    setIsDownloading(true)

    try {
      const transcriptText = transcript
        .map((msg) => {
          const role = msg.role === 'assistant' ? 'RecroBot' : applicant?.name || 'Bewerber'
          const timestamp = msg.timestamp.toLocaleString('de-DE')
          return `[${timestamp}] ${role}: ${msg.message}`
        })
        .join('\n\n')

      const content = `
RecroBot Interview Transkript
=============================

Bewerber: ${applicant?.name || 'Unbekannt'}
Position: ${applicant?.position || 'Unbekannt'}
E-Mail: ${applicant?.email || 'Unbekannt'}
Datum: ${new Date().toLocaleDateString('de-DE')}
Dauer: ${formatDuration(duration)}

Transkript:
-----------

${transcriptText}

---
Generiert von RecroBot - Everlast Consulting GmbH
      `.trim()

      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = `interview-${applicant?.name?.replace(/\s+/g, '-') || 'transcript'}-${Date.now()}.txt`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to download transcript:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  const handleStartNewInterview = () => {
    resetStore()
    window.location.href = '/'
  }

  const handleGoBack = () => {
    window.history.back()
  }

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="px-3 sm:px-6 py-3 sm:py-4">
        <CardTitle className="text-base sm:text-lg">Interview Kontrollen</CardTitle>
      </CardHeader>
      
      <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6 space-y-3 sm:space-y-4">
        {/* Interview Info */}
        {applicant && (
          <div className="space-y-2 p-2 sm:p-3 bg-gray-50 rounded-lg">
            <div className="text-xs sm:text-sm">
              <span className="font-medium">Bewerber:</span> {applicant.name}
            </div>
            <div className="text-xs sm:text-sm">
              <span className="font-medium">Position:</span> {applicant.position}
            </div>
            <div className="text-xs sm:text-sm">
              <span className="font-medium">Dauer:</span> {formatDuration(duration)}
            </div>
            <div className="text-xs sm:text-sm flex items-center gap-2">
              <span className="font-medium">Status:</span>
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  callStatus.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : callStatus.status === 'ended'
                    ? 'bg-gray-100 text-gray-800'
                    : callStatus.status === 'connecting'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {callStatus.status === 'active' && 'Aktiv'}
                {callStatus.status === 'ended' && 'Beendet'}
                {callStatus.status === 'connecting' && 'Verbinde'}
                {callStatus.status === 'idle' && 'Bereit'}
              </span>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="space-y-2">
          <Button
            onClick={handleDownloadTranscript}
            disabled={transcript.length === 0 || isDownloading}
            className="w-full h-10 sm:h-11 text-xs sm:text-sm"
            variant="outline"
          >
            <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">{isDownloading ? 'Wird heruntergeladen...' : 'Transkript herunterladen'}</span>
            <span className="sm:hidden">Download</span>
          </Button>

          {callStatus.status === 'ended' && (
            <Button
              onClick={handleStartNewInterview}
              className="w-full h-10 sm:h-11 text-xs sm:text-sm bg-blue-600 hover:bg-blue-700"
            >
              <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Neues Interview starten</span>
              <span className="sm:hidden">Neu starten</span>
            </Button>
          )}

          <Button
            onClick={handleGoBack}
            variant="ghost"
            className="w-full h-10 sm:h-11 text-xs sm:text-sm"
          >
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Zurück
          </Button>
        </div>

        {/* Statistics */}
        {transcript.length > 0 && (
          <div className="space-y-2 p-2 sm:p-3 bg-blue-50 rounded-lg">
            <div className="text-xs sm:text-sm font-medium text-blue-900">Statistiken</div>
            <div className="grid grid-cols-2 gap-1 sm:gap-2 text-xs text-blue-800">
              <div>
                <span className="font-medium">Nachrichten:</span> {transcript.length}
              </div>
              <div>
                <span className="font-medium">Dauer:</span> {formatDuration(duration)}
              </div>
              <div>
                <span className="font-medium">Bot:</span>{' '}
                {transcript.filter((m) => m.role === 'assistant').length}
              </div>
              <div>
                <span className="font-medium">Bewerber:</span>{' '}
                {transcript.filter((m) => m.role === 'user').length}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}