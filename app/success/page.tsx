'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, Download, Home, RotateCcw, Clock, MessageSquare, User, Bot } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useInterviewStore } from '@/lib/store'
import { formatDuration } from '@/lib/utils'

export default function SuccessPage() {
  const router = useRouter()
  const {
    applicant,
    interview,
    transcript,
    duration,
    resetStore,
  } = useInterviewStore()

  const [isDownloading, setIsDownloading] = useState(false)

  useEffect(() => {
    // Redirect if no interview data
    if (!applicant || !interview || interview.status !== 'completed') {
      router.push('/')
    }
  }, [applicant, interview, router])

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
${applicant?.phone ? `Telefon: ${applicant.phone}` : ''}
Datum: ${interview?.startedAt?.toLocaleDateString('de-DE')}
Gestartet: ${interview?.startedAt?.toLocaleTimeString('de-DE')}
Beendet: ${interview?.endedAt?.toLocaleTimeString('de-DE')}
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
    router.push('/')
  }

  const handleGoHome = () => {
    router.push('/')
  }

  if (!applicant || !interview) {
    return (
      <div className="container mx-auto px-3 sm:px-4 py-8 sm:py-12 lg:py-16 text-center">
        <div className="max-w-md mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
            Keine Interview-Daten gefunden
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
            Bitte starte ein neues Interview.
          </p>
          <Button onClick={handleGoHome} className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
            Zur Startseite
          </Button>
        </div>
      </div>
    )
  }

  const assistantMessages = transcript.filter(msg => msg.role === 'assistant').length
  const userMessages = transcript.filter(msg => msg.role === 'user').length

  return (
    <div className="container mx-auto px-3 sm:px-4 py-8 sm:py-12 lg:py-16">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          <div className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <CheckCircle className="h-10 w-10 sm:h-11 sm:w-11 lg:h-12 lg:w-12 text-green-600" />
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
            Interview erfolgreich abgeschlossen!
          </h1>
          
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-2">
            Vielen Dank, {applicant.name}! Dein Interview für die Position 
            <span className="font-medium"> {applicant.position}</span> wurde 
            erfolgreich aufgezeichnet und wird nun ausgewertet.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-8 sm:mb-10 lg:mb-12">
          <Card>
            <CardContent className="flex items-center p-3 sm:p-4 lg:p-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-3 sm:mr-4">
                <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                  {formatDuration(duration)}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">Gesprächsdauer</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-3 sm:p-4 lg:p-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center mr-3 sm:mr-4">
                <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              </div>
              <div>
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                  {transcript.length}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">Nachrichten</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-3 sm:p-4 lg:p-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-3 sm:mr-4">
                <User className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                  {userMessages}/{assistantMessages}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">Du/RecroBot</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Interview Details */}
        <Card className="mb-6 sm:mb-8">
          <CardHeader className="px-3 sm:px-6 py-3 sm:py-4">
            <CardTitle className="text-base sm:text-lg">Interview Details</CardTitle>
            <CardDescription className="text-sm">
              Zusammenfassung deines Bewerbungsgesprächs
            </CardDescription>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6 space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <div className="text-xs sm:text-sm font-medium text-gray-700 mb-1">Bewerber</div>
                <div className="text-sm sm:text-base text-gray-900">{applicant.name}</div>
              </div>
              <div>
                <div className="text-xs sm:text-sm font-medium text-gray-700 mb-1">Position</div>
                <div className="text-sm sm:text-base text-gray-900">{applicant.position}</div>
              </div>
              <div>
                <div className="text-xs sm:text-sm font-medium text-gray-700 mb-1">E-Mail</div>
                <div className="text-sm sm:text-base text-gray-900">{applicant.email}</div>
              </div>
              {applicant.phone && (
                <div>
                  <div className="text-xs sm:text-sm font-medium text-gray-700 mb-1">Telefon</div>
                  <div className="text-sm sm:text-base text-gray-900">{applicant.phone}</div>
                </div>
              )}
              <div>
                <div className="text-xs sm:text-sm font-medium text-gray-700 mb-1">Gestartet</div>
                <div className="text-sm sm:text-base text-gray-900">
                  {interview.startedAt?.toLocaleString('de-DE')}
                </div>
              </div>
              <div>
                <div className="text-xs sm:text-sm font-medium text-gray-700 mb-1">Beendet</div>
                <div className="text-sm sm:text-base text-gray-900">
                  {interview.endedAt?.toLocaleString('de-DE')}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-6 sm:mb-8">
          <CardHeader className="px-3 sm:px-6 py-3 sm:py-4">
            <CardTitle className="text-base sm:text-lg">Wie geht es weiter?</CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start space-x-2 sm:space-x-3">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-blue-600">1</span>
                </div>
                <div>
                  <div className="text-sm sm:text-base font-medium text-gray-900">Auswertung</div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    Dein Interview wird von unserem HR-Team ausgewertet. Dies dauert normalerweise 2-3 Werktage.
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-2 sm:space-x-3">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-blue-600">2</span>
                </div>
                <div>
                  <div className="text-sm sm:text-base font-medium text-gray-900">Benachrichtigung</div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    Du erhältst eine E-Mail mit dem Ergebnis und den nächsten Schritten an {applicant.email}.
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-2 sm:space-x-3">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-blue-600">3</span>
                </div>
                <div>
                  <div className="text-sm sm:text-base font-medium text-gray-900">Weiteres Vorgehen</div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    Bei positiver Bewertung wirst du zu einem persönlichen Gespräch eingeladen.
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col gap-2 sm:gap-3 px-2">
          <Button
            onClick={handleDownloadTranscript}
            disabled={transcript.length === 0 || isDownloading}
            variant="outline"
            size="lg"
            className="w-full h-12 text-sm sm:text-base"
          >
            <Download className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            <span className="hidden sm:inline">{isDownloading ? 'Wird heruntergeladen...' : 'Transkript herunterladen'}</span>
            <span className="sm:hidden">Download Transkript</span>
          </Button>

          <Button
            onClick={handleStartNewInterview}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 w-full h-12 text-sm sm:text-base"
          >
            <RotateCcw className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            Neues Interview starten
          </Button>

          <Button
            onClick={handleGoHome}
            variant="ghost"
            size="lg"
            className="w-full h-12 text-sm sm:text-base"
          >
            <Home className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            Zur Startseite
          </Button>
        </div>
      </div>
    </div>
  )
}