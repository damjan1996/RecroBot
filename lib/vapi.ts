import Vapi from '@vapi-ai/web'
import { 
  VapiConfig, 
  VapiCallStartEvent, 
  VapiCallEndEvent, 
  VapiErrorEvent, 
  VapiVolumeEvent,
  VapiMessage 
} from '@/types'

// Utility: kompatibles "on" - unterstützt .on oder .addEventListener
function onSafe(target: any, event: string, handler: (...args: any[]) => void) {
  const fn = target?.on ?? target?.addEventListener;
  if (typeof fn !== 'function') {
    throw new TypeError('Vapi-Instance unterstützt weder .on noch .addEventListener');
  }
  fn.call(target, event, handler);
}

export class VapiClient {
  private vapi: Vapi | null = null
  private config: VapiConfig
  private transcriptTimeout: NodeJS.Timeout | null = null
  private isInitialized = false
  private lastPartialMessage: { role: 'assistant' | 'user'; text: string; timestamp: number } | null = null

  constructor(config: VapiConfig) {
    this.config = config
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return

    try {
      this.vapi = new Vapi(this.config.publicKey)

      // Runtime Check - hilft beim schnellen Eingrenzen
      const hasOn = typeof (this.vapi as any).on === 'function';
      const hasAdd = typeof (this.vapi as any).addEventListener === 'function';
      if (!hasOn && !hasAdd) {
        console.error('Vapi instance missing .on/.addEventListener', this.vapi);
        throw new Error('Inkompatible Vapi-Instanz – läuft der Code wirklich im Browser?');
      }

      console.log('Vapi initialized successfully. Event methods available:', { hasOn, hasAdd });
      this.isInitialized = true
    } catch (error) {
      console.error('Failed to initialize Vapi:', error)
      throw new Error('Vapi initialization failed')
    }
  }

  async startCall(
    onCallStart?: (event: VapiCallStartEvent) => void,
    onCallEnd?: (event: VapiCallEndEvent) => void,
    onSpeechStart?: () => void,
    onSpeechEnd?: () => void,
    onMessage?: (message: VapiMessage) => void,
    onError?: (event: VapiErrorEvent) => void,
    onVolumeLevel?: (event: VapiVolumeEvent) => void
  ): Promise<void> {
    if (!this.vapi || !this.isInitialized) {
      throw new Error('Vapi not initialized')
    }

    try {
      // Runtime Guard vor Event-Registrierung
      const _on = (this.vapi as any).on ?? (this.vapi as any).addEventListener;
      if (typeof _on !== 'function') {
        throw new Error('Vapi instance has no .on/.addEventListener – Version/Runtime prüfen');
      }

      console.log('Setting up Vapi event listeners with onSafe...')

      // Event-Handler mit onSafe registrieren
      if (onCallStart) {
        onSafe(this.vapi, 'call-start', (event: any) => {
          console.log('Call started:', event)
          onCallStart(event as VapiCallStartEvent)
        })
      }

      if (onCallEnd) {
        onSafe(this.vapi, 'call-end', (event: any) => {
          console.log('Call ended:', event)
          onCallEnd(event as VapiCallEndEvent)
        })
      }

      if (onSpeechStart) {
        onSafe(this.vapi, 'speech-start', () => {
          console.log('Speech started')
          onSpeechStart()
        })
      }

      if (onSpeechEnd) {
        onSafe(this.vapi, 'speech-end', () => {
          console.log('Speech ended')
          onSpeechEnd()
        })
      }

      if (onVolumeLevel) {
        onSafe(this.vapi, 'volume-level', (volume: any) => {
          console.log('Volume level:', volume)
          const vol = typeof volume === 'number' ? volume : volume?.detail || volume?.volume || 0
          onVolumeLevel({ volume: vol })
        })
      }

      if (onError) {
        onSafe(this.vapi, 'error', (error: any) => {
          console.error('Vapi error:', error)
          onError({ error: { message: error.message || 'Unknown error', code: error.code } })
        })
      }

      if (onMessage) {
        // Message events
        onSafe(this.vapi, 'message', (message: any) => {
          console.log('Vapi message event:', message)
          this.handleMessage(message, onMessage)
        })

        // Transcript events (zusätzlich)
        onSafe(this.vapi, 'transcript', (transcript: any) => {
          console.log('Vapi transcript event:', transcript)
          this.handleMessage(transcript, onMessage)
        })
      }

      console.log('Starting Vapi call with assistant:', this.config.assistantId)
      await this.vapi.start(this.config.assistantId)
    } catch (error) {
      console.error('Failed to start call:', error)
      throw new Error('Failed to start voice call')
    }
  }

  private handleMessage(message: any, onMessage: (msg: VapiMessage) => void) {
    console.log('Handling message:', message)
    
    // Extract text and role from message
    let text = ''
    let role = 'assistant'

    // Check for direct transcript field (Vapi v2.5.0 format)
    if (message?.transcript && typeof message.transcript === 'string') {
      text = message.transcript
      role = message.role === 'user' ? 'user' : 'assistant'
    }
    // Check for nested transcript.text
    else if (message?.transcript?.text) {
      text = message.transcript.text
      role = message.transcript.role === 'user' ? 'user' : 'assistant'
    } 
    // Check for direct text field
    else if (message?.text) {
      text = message.text
      role = message.role || 'assistant'
    } 
    // Check for content field
    else if (message?.content) {
      text = message.content
      role = message.role || 'assistant'
    } 
    // Check if message itself is a string
    else if (typeof message === 'string') {
      text = message
      role = 'assistant'
    }

    if (!text || !text.trim()) {
      console.log('❌ No valid text found in message. Available fields:', Object.keys(message || {}))
      return
    }

    const transcriptType = message?.transcriptType || 'final'
    const currentRole = role as 'user' | 'assistant'
    
    // Handle partial transcripts with delay
    if (transcriptType !== 'final') {
      console.log('⏳ Partial transcript:', transcriptType, text.substring(0, 30) + '...')
      
      // Store partial message
      this.lastPartialMessage = {
        role: currentRole,
        text: text.trim(),
        timestamp: Date.now()
      }
      
      // Clear existing timeout
      if (this.transcriptTimeout) {
        clearTimeout(this.transcriptTimeout)
      }
      
      // Set 4-second delay before processing to allow complete sentences
      this.transcriptTimeout = setTimeout(() => {
        if (this.lastPartialMessage) {
          const finalMessage: VapiMessage = {
            role: this.lastPartialMessage.role,
            content: this.lastPartialMessage.text,
            timestamp: this.lastPartialMessage.timestamp,
          }
          
          console.log('✅ DELAYED transcript message:', finalMessage.content)
          onMessage(finalMessage)
          this.lastPartialMessage = null
        }
      }, 4000)
      
      return
    }

    // Process final transcripts immediately and clear any pending partial
    if (this.transcriptTimeout) {
      clearTimeout(this.transcriptTimeout)
      this.transcriptTimeout = null
      this.lastPartialMessage = null
    }

    const finalMessage: VapiMessage = {
      role: currentRole,
      content: text.trim(),
      timestamp: Date.now(),
    }
    
    console.log('✅ FINAL transcript message:', finalMessage.content)
    onMessage(finalMessage)
  }

  async endCall(): Promise<void> {
    if (!this.vapi) {
      throw new Error('Vapi not initialized')
    }

    try {
      await this.vapi.stop()
    } catch (error) {
      console.error('Failed to end call:', error)
      throw new Error('Failed to end voice call')
    }
  }

  async toggleMute(): Promise<boolean> {
    if (!this.vapi) {
      throw new Error('Vapi not initialized')
    }

    try {
      // Try different approaches for muting
      if (typeof (this.vapi as any).isMuted === 'function') {
        const isMuted = await (this.vapi as any).isMuted()
        if (isMuted) {
          await (this.vapi as any).setMuted(false)
          return false
        } else {
          await (this.vapi as any).setMuted(true)
          return true
        }
      } else if (typeof (this.vapi as any).toggleMute === 'function') {
        return await (this.vapi as any).toggleMute()
      } else {
        console.warn('Mute functionality not available in this Vapi version')
        return false
      }
    } catch (error) {
      console.error('Failed to toggle mute:', error)
      throw new Error('Failed to toggle mute')
    }
  }

  async isMuted(): Promise<boolean> {
    if (!this.vapi) {
      throw new Error('Vapi not initialized')
    }

    try {
      if (typeof (this.vapi as any).isMuted === 'function') {
        return await (this.vapi as any).isMuted()
      } else {
        console.warn('isMuted functionality not available in this Vapi version')
        return false
      }
    } catch (error) {
      console.error('Failed to check mute status:', error)
      return false
    }
  }

  removeAllListeners(): void {
    if (!this.vapi) return

    try {
      if (typeof (this.vapi as any).removeAllListeners === 'function') {
        (this.vapi as any).removeAllListeners()
      } else if (typeof (this.vapi as any).removeEventListener === 'function') {
        // Remove individual listeners if supported
        console.log('Removing individual event listeners')
      } else {
        console.warn('Remove listeners functionality not available in this Vapi version')
      }
    } catch (error) {
      console.error('Failed to remove listeners:', error)
    }
  }

  cleanup(): void {
    // Clear any pending transcript timeout
    if (this.transcriptTimeout) {
      clearTimeout(this.transcriptTimeout)
      this.transcriptTimeout = null
    }
    this.lastPartialMessage = null
    
    this.removeAllListeners()
    this.vapi = null
    this.isInitialized = false
  }
}

// Singleton instance
let vapiClient: VapiClient | null = null

export function getVapiClient(): VapiClient {
  if (!vapiClient) {
    const config: VapiConfig = {
      publicKey: process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || '',
      assistantId: process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID || '',
    }

    if (!config.publicKey || !config.assistantId) {
      throw new Error('Vapi configuration missing. Please check environment variables.')
    }

    vapiClient = new VapiClient(config)
  }

  return vapiClient
}