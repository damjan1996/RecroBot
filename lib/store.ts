import { create } from 'zustand'
import { 
  Applicant, 
  Interview, 
  TranscriptMessage, 
  VapiCallStatus, 
  ApplicationFormData,
  InterviewState 
} from '@/types'
import { generateId } from './utils'

interface InterviewStore extends InterviewState {
  // Applicant actions
  setApplicant: (data: ApplicationFormData) => void
  clearApplicant: () => void
  
  // Interview actions
  startInterview: () => void
  endInterview: () => void
  updateInterviewStatus: (status: Interview['status']) => void
  
  // Call status actions
  updateCallStatus: (status: Partial<VapiCallStatus>) => void
  setConnected: (connected: boolean) => void
  setMuted: (muted: boolean) => void
  setVolumeLevel: (level: number) => void
  setError: (error: string | undefined) => void
  
  // Transcript actions
  addTranscriptMessage: (message: Omit<TranscriptMessage, 'timestamp'>) => void
  clearTranscript: () => void
  
  // Duration actions
  incrementDuration: () => void
  resetDuration: () => void
  
  // Recording actions
  setRecording: (recording: boolean) => void
  
  // Reset all
  resetStore: () => void
}

const initialState: InterviewState = {
  applicant: null,
  interview: null,
  callStatus: {
    status: 'idle',
    isConnected: false,
    isMuted: false,
    volumeLevel: 0,
    error: undefined,
  },
  transcript: [],
  duration: 0,
  isRecording: false,
}

export const useInterviewStore = create<InterviewStore>((set, get) => ({
  ...initialState,

  // Applicant actions
  setApplicant: (data: ApplicationFormData) => {
    const applicant: Applicant = {
      id: generateId(),
      ...data,
      createdAt: new Date(),
    }
    set({ applicant })
  },

  clearApplicant: () => set({ applicant: null }),

  // Interview actions
  startInterview: () => {
    const { applicant } = get()
    if (!applicant) return

    const interview: Interview = {
      id: generateId(),
      applicantId: applicant.id,
      status: 'in-progress',
      startedAt: new Date(),
      transcript: [],
    }

    set({ 
      interview,
      callStatus: { ...get().callStatus, status: 'connecting' },
      duration: 0,
      transcript: [],
    })
  },

  endInterview: () => {
    const { interview, duration, transcript } = get()
    if (!interview) return

    const updatedInterview: Interview = {
      ...interview,
      status: 'completed',
      endedAt: new Date(),
      duration,
      transcript,
    }

    set({ 
      interview: updatedInterview,
      callStatus: { ...get().callStatus, status: 'ended' },
      isRecording: false,
    })
  },

  updateInterviewStatus: (status: Interview['status']) => {
    const { interview } = get()
    if (!interview) return

    set({
      interview: { ...interview, status }
    })
  },

  // Call status actions
  updateCallStatus: (status: Partial<VapiCallStatus>) => {
    set({
      callStatus: { ...get().callStatus, ...status }
    })
  },

  setConnected: (connected: boolean) => {
    set({
      callStatus: { 
        ...get().callStatus, 
        isConnected: connected,
        status: connected ? 'active' : 'idle'
      }
    })
  },

  setMuted: (muted: boolean) => {
    set({
      callStatus: { ...get().callStatus, isMuted: muted }
    })
  },

  setVolumeLevel: (level: number) => {
    set({
      callStatus: { ...get().callStatus, volumeLevel: level }
    })
  },

  setError: (error: string | undefined) => {
    set({
      callStatus: { ...get().callStatus, error }
    })
  },

  // Transcript actions
  addTranscriptMessage: (message: Omit<TranscriptMessage, 'timestamp'>) => {
    // Ignore empty messages
    if (!message.message || !message.message.trim()) {
      return
    }

    const newMessage: TranscriptMessage = {
      ...message,
      timestamp: new Date(),
    }
    
    const currentTranscript = get().transcript
    
    // Simple duplicate check - only avoid exact same messages
    const isDuplicate = currentTranscript.some(existingMessage => 
      existingMessage.message === newMessage.message &&
      existingMessage.role === newMessage.role
    )
    
    if (!isDuplicate) {
      console.log('✅ Adding transcript message:', newMessage.role, newMessage.message.substring(0, 50) + '...')
      set({
        transcript: [...currentTranscript, newMessage]
      })
    } else {
      console.log('⚠️ Skipping duplicate message:', newMessage.message.substring(0, 30) + '...')
    }
  },

  clearTranscript: () => set({ transcript: [] }),

  // Duration actions
  incrementDuration: () => {
    set({ duration: get().duration + 1 })
  },

  resetDuration: () => set({ duration: 0 }),

  // Recording actions
  setRecording: (recording: boolean) => {
    set({ isRecording: recording })
  },

  // Reset all
  resetStore: () => set(initialState),
}))