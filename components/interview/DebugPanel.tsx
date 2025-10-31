'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useInterviewStore } from '@/lib/store'
import { Bug, Eye, EyeOff } from 'lucide-react'

export function DebugPanel() {
  const [isVisible, setIsVisible] = useState(false)
  const { addTranscriptMessage } = useInterviewStore()

  const testMessages = [
    { role: 'assistant' as const, message: 'Hallo! Schön, dass Sie heute hier sind. Können Sie sich bitte kurz vorstellen?' },
    { role: 'user' as const, message: 'Hallo, mein Name ist Max Mustermann und ich bewerbe mich als Software Entwickler.' },
    { role: 'assistant' as const, message: 'Vielen Dank für die Vorstellung. Können Sie mir etwas über Ihre bisherige Erfahrung erzählen?' }
  ]

  const addTestMessage = (index: number) => {
    const message = testMessages[index]
    if (message) {
      addTranscriptMessage(message)
    }
  }

  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-50"
      >
        <Bug className="h-4 w-4 mr-2" />
        Debug
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50 shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Debug Panel</CardTitle>
          <Button
            onClick={() => setIsVisible(false)}
            variant="ghost"
            size="sm"
          >
            <EyeOff className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-xs text-gray-600 mb-2">
          Test Transkript Nachrichten:
        </div>
        
        {testMessages.map((message, index) => (
          <Button
            key={index}
            onClick={() => addTestMessage(index)}
            variant="outline"
            size="sm"
            className="w-full text-xs h-auto p-2 text-left"
          >
            <div className="truncate">
              <span className="font-semibold">
                {message.role === 'assistant' ? 'Bot: ' : 'User: '}
              </span>
              {message.message.substring(0, 40)}...
            </div>
          </Button>
        ))}

        <div className="pt-2 border-t">
          <div className="text-xs text-gray-600 mb-1">
            Browser Console öffnen für Vapi Logs
          </div>
          <Button
            onClick={() => {
              console.log('=== Vapi Debug Test ===')
              console.log('Store State:', useInterviewStore.getState())
              console.log('Available Events:', Object.keys(window).filter(key => key.includes('vapi')))
            }}
            variant="ghost"
            size="sm"
            className="text-xs w-full"
          >
            Console Debug
          </Button>
          
          <Button
            onClick={() => {
              const { addTranscriptMessage } = useInterviewStore.getState()
              addTranscriptMessage({
                role: 'assistant',
                message: `Test Nachricht um ${new Date().toLocaleTimeString()}`
              })
            }}
            variant="ghost"
            size="sm"
            className="text-xs w-full mt-1"
          >
            Test Transcript
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}