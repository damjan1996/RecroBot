export interface Applicant {
  id: string;
  name: string;
  email: string;
  position: string;
  phone?: string;
  createdAt: Date;
}

export interface Interview {
  id: string;
  applicantId: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  startedAt?: Date;
  endedAt?: Date;
  duration?: number;
  transcript: TranscriptMessage[];
}

export interface TranscriptMessage {
  role: 'assistant' | 'user';
  message: string;
  timestamp: Date;
}

export interface VapiCallStatus {
  status: 'idle' | 'connecting' | 'active' | 'ended';
  isConnected: boolean;
  isMuted: boolean;
  volumeLevel: number;
  error?: string;
}

export interface ApplicationFormData {
  name: string;
  email: string;
  position: string;
  phone?: string;
}

export interface InterviewState {
  applicant: Applicant | null;
  interview: Interview | null;
  callStatus: VapiCallStatus;
  transcript: TranscriptMessage[];
  duration: number;
  isRecording: boolean;
}

export interface VapiConfig {
  publicKey: string;
  assistantId: string;
}

export interface VapiMessage {
  role: 'assistant' | 'user';
  content: string;
  timestamp: number;
}

export interface VapiCallStartEvent {
  call: {
    id: string;
    assistantId: string;
  };
}

export interface VapiCallEndEvent {
  call: {
    id: string;
    endedReason: string;
  };
  artifact?: {
    transcript: string;
    summary: string;
  };
}

export interface VapiErrorEvent {
  error: {
    message: string;
    code?: string;
  };
}

export interface VapiVolumeEvent {
  volume: number;
}