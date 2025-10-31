'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { getVapiClient } from '@/lib/vapi'
import { Eye, EyeOff, RefreshCw, Zap } from 'lucide-react'

export function VapiDebugger() {
  const [isVisible, setIsVisible] = useState(false)
  const [vapiInfo, setVapiInfo] = useState<any>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const analyzeVapi = async () => {
    setIsAnalyzing(true)
    try {
      const client = getVapiClient()
      await client.initialize()
      
      // Access the internal vapi instance for analysis
      const vapiInstance = (client as any).vapi
      
      if (vapiInstance) {
        const analysis = {
          prototype: Object.getOwnPropertyNames(Object.getPrototypeOf(vapiInstance)),
          methods: Object.getOwnPropertyNames(vapiInstance).filter(prop => 
            typeof vapiInstance[prop] === 'function'
          ),
          properties: Object.getOwnPropertyNames(vapiInstance).filter(prop => 
            typeof vapiInstance[prop] !== 'function'
          ),
          hasEventMethods: {
            on: typeof vapiInstance.on === 'function',
            addEventListener: typeof vapiInstance.addEventListener === 'function',
            removeEventListener: typeof vapiInstance.removeEventListener === 'function',
            removeAllListeners: typeof vapiInstance.removeAllListeners === 'function',
          },
          hasCallMethods: {
            start: typeof vapiInstance.start === 'function',
            stop: typeof vapiInstance.stop === 'function',
            end: typeof vapiInstance.end === 'function',
          },
          hasMuteMethods: {
            isMuted: typeof vapiInstance.isMuted === 'function',
            setMuted: typeof vapiInstance.setMuted === 'function',
            toggleMute: typeof vapiInstance.toggleMute === 'function',
          },
          version: vapiInstance.version || 'unknown',
          constructor: vapiInstance.constructor.name,
        }
        
        setVapiInfo(analysis)
        console.log('Vapi Analysis:', analysis)
      }
    } catch (error) {
      console.error('Failed to analyze Vapi:', error)
      setVapiInfo({ error: error instanceof Error ? error.message : String(error) })
    } finally {
      setIsAnalyzing(false)
    }
  }

  useEffect(() => {
    if (isVisible && !vapiInfo) {
      analyzeVapi()
    }
  }, [isVisible, vapiInfo])

  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        variant="outline"
        size="sm"
        className="fixed bottom-20 right-4 z-50"
      >
        <Zap className="h-4 w-4 mr-2" />
        Vapi Debug
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-4 right-4 w-96 h-96 z-50 shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Vapi SDK Debugger</CardTitle>
          <div className="flex gap-1">
            <Button
              onClick={analyzeVapi}
              variant="ghost"
              size="sm"
              disabled={isAnalyzing}
            >
              <RefreshCw className={`h-4 w-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              onClick={() => setIsVisible(false)}
              variant="ghost"
              size="sm"
            >
              <EyeOff className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <ScrollArea className="h-80">
          {vapiInfo?.error ? (
            <div className="text-red-600 text-sm">
              Error: {vapiInfo.error}
            </div>
          ) : vapiInfo ? (
            <div className="space-y-3 text-xs">
              <div>
                <div className="font-semibold mb-1">SDK Info:</div>
                <div>Constructor: {vapiInfo.constructor}</div>
                <div>Version: {vapiInfo.version}</div>
              </div>

              <div>
                <div className="font-semibold mb-1">Event Methods:</div>
                <div className="flex flex-wrap gap-1">
                  {Object.entries(vapiInfo.hasEventMethods).map(([method, has]) => (
                    <Badge key={method} variant={has ? "default" : "secondary"}>
                      {method}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-semibold mb-1">Call Methods:</div>
                <div className="flex flex-wrap gap-1">
                  {Object.entries(vapiInfo.hasCallMethods).map(([method, has]) => (
                    <Badge key={method} variant={has ? "default" : "secondary"}>
                      {method}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-semibold mb-1">Mute Methods:</div>
                <div className="flex flex-wrap gap-1">
                  {Object.entries(vapiInfo.hasMuteMethods).map(([method, has]) => (
                    <Badge key={method} variant={has ? "default" : "secondary"}>
                      {method}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-semibold mb-1">All Methods ({vapiInfo.methods.length}):</div>
                <div className="text-xs text-gray-600 max-h-20 overflow-y-auto">
                  {vapiInfo.methods.join(', ')}
                </div>
              </div>

              <div>
                <div className="font-semibold mb-1">Properties ({vapiInfo.properties.length}):</div>
                <div className="text-xs text-gray-600 max-h-20 overflow-y-auto">
                  {vapiInfo.properties.join(', ')}
                </div>
              </div>

              <div>
                <div className="font-semibold mb-1">Prototype Methods:</div>
                <div className="text-xs text-gray-600 max-h-20 overflow-y-auto">
                  {vapiInfo.prototype.join(', ')}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500">Analyzing Vapi SDK...</div>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}