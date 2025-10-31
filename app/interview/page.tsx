'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { VoiceInterface } from '@/components/interview/VoiceInterface'
import { TranscriptDisplay } from '@/components/interview/TranscriptDisplay'
import { InterviewControls } from '@/components/interview/InterviewControls'
import { DebugPanel } from '@/components/interview/DebugPanel'
import { VapiDebugger } from '@/components/interview/VapiDebugger'
import { useInterviewStore } from '@/lib/store'

export default function InterviewPage() {
  const router = useRouter()
  const applicant = useInterviewStore((state) => state.applicant)

  useEffect(() => {
    // Redirect to home if no applicant data
    if (!applicant) {
      router.push('/')
    }
  }, [applicant, router])

  if (!applicant) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Keine Bewerberdaten gefunden
          </h2>
          <p className="text-gray-600 mb-8">
            Bitte fülle zuerst das Bewerbungsformular aus.
          </p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            Zur Startseite
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-[600px]">
        {/* Voice Interface - Main Area */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg border h-full">
            <div className="p-6 border-b">
              <h1 className="text-2xl font-bold text-gray-900">
                KI-Interview mit {applicant.name}
              </h1>
              <p className="text-gray-600">
                Position: {applicant.position}
              </p>
            </div>
            
            <div className="p-6 flex items-center justify-center min-h-[500px]">
              <VoiceInterface />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Transcript */}
          <div className="bg-white rounded-xl shadow-lg border">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">
                Live-Transkript
              </h2>
            </div>
            <div className="h-80">
              <TranscriptDisplay />
            </div>
          </div>

          {/* Controls */}
          <InterviewControls />
        </div>
      </div>

      {/* Mobile Layout Adjustments */}
      <style jsx>{`
        @media (max-width: 1024px) {
          .grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      
      {/* Debug Panels - nur im Development */}
      {process.env.NODE_ENV === 'development' && (
        <>
          <DebugPanel />
          <VapiDebugger />
        </>
      )}
    </div>
  )
}