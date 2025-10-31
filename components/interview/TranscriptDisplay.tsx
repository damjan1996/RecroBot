'use client'

import { useEffect, useRef } from 'react'
import { Bot, User } from 'lucide-react'
import { useInterviewStore } from '@/lib/store'
import { formatTimestamp } from '@/lib/utils'

export function TranscriptDisplay() {
  const transcript = useInterviewStore((state) => state.transcript)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [transcript])

  if (transcript.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500 px-3">
        <div className="text-center">
          <Bot className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 mx-auto mb-3 sm:mb-4 text-gray-300" />
          <p className="text-sm sm:text-base">Das Transkript erscheint hier während des Gesprächs</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      ref={scrollRef}
      className="h-full overflow-y-auto p-2 sm:p-3 lg:p-4 space-y-3 sm:space-y-4 bg-gray-50 rounded-lg"
    >
      {transcript.map((message, index) => (
        <div
          key={index}
          className={`flex items-start space-x-2 sm:space-x-3 ${
            message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
          }`}
        >
          {/* Avatar */}
          <div
            className={`flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
              message.role === 'assistant'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-600 text-white'
            }`}
          >
            {message.role === 'assistant' ? (
              <Bot className="h-3 w-3 sm:h-4 sm:w-4" />
            ) : (
              <User className="h-3 w-3 sm:h-4 sm:w-4" />
            )}
          </div>

          {/* Message Bubble */}
          <div
            className={`max-w-[85%] sm:max-w-[80%] rounded-lg p-2 sm:p-3 ${
              message.role === 'assistant'
                ? 'bg-white border shadow-sm'
                : 'bg-blue-600 text-white'
            }`}
          >
            <div
              className={`text-xs sm:text-sm leading-relaxed ${
                message.role === 'assistant' ? 'text-gray-900' : 'text-white'
              }`}
            >
              {message.message}
            </div>
            
            <div
              className={`text-xs mt-1 sm:mt-2 ${
                message.role === 'assistant' ? 'text-gray-500' : 'text-blue-100'
              }`}
            >
              {formatTimestamp(message.timestamp)}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}