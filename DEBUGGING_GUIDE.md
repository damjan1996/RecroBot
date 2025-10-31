# 🐛 Debugging Guide - Transkript & Audio Level

## 🚨 Aktueller Status
- ✅ Bot hört dich (Vapi-Verbindung funktioniert)
- ❌ Transkript ist leer
- ❌ Audio Level zeigt "NaN%"

## 🔍 Debugging-Schritte

### 1. Development Server starten
```bash
npm run dev
```

### 2. Browser Console öffnen
1. Interview starten
2. F12 drücken (Developer Tools)
3. "Console" Tab öffnen
4. Voice-Call starten

### 3. Console-Logs beobachten
Schaue nach diesen Logs:

```
🎯 Vapi Event [call-start]: {...}
🎯 Vapi Event [message]: {...}
🎯 Vapi Event [transcript]: {...}
🎯 Vapi Event [volume-level]: {...}
```

### 4. Debug-Panel nutzen
- Unten rechts "Debug" Button klicken
- "Console Debug" für Store-Status
- "Test Transcript" für manuellen Test
- Test-Nachrichten hinzufügen

## 🔧 Was wurde gefixt

### Event-Handler erweitert:
```typescript
// Alle möglichen Events werden jetzt abgefangen:
'call-start', 'call-end', 'speech-start', 'speech-end', 
'message', 'transcript', 'conversation-update', 'volume-level',
'error', 'mic-muted', 'mic-unmuted', 'assistant-message',
'user-message', 'function-call', 'hang', 'tool-calls'
```

### Audio Level Fix:
```typescript
// NaN% Problem behoben:
{isNaN(callStatus.volumeLevel) ? '0' : Math.round(callStatus.volumeLevel * 100)}%
```

### Message-Validierung:
```typescript
// Mehrere Fallbacks für verschiedene Message-Formate:
1. message.transcript.text
2. message.text  
3. message.content
```

## 🎯 Erwartete Console-Logs

### Bei funktionierendem Transkript:
```
🎯 Vapi Event [call-start]: {call: {...}}
🎯 Vapi Event [volume-level]: 0.5
Vapi message event: {transcript: {text: "Hallo", role: "user"}}
Adding transcript message: {role: "user", content: "Hallo"}
```

### Bei Audio Level:
```
🎯 Vapi Event [volume-level]: 0.3
Volume level received: {volume: 0.3}
```

## 🔍 Troubleshooting

### Wenn KEINE Events kommen:
1. **Vapi-Konfiguration prüfen:**
   - Ist der Assistant richtig konfiguriert?
   - Sind die API-Keys korrekt?
   - Funktioniert die Internetverbindung?

2. **Browser-Permissions:**
   - Mikrofon-Berechtigung erteilt?
   - HTTPS verwendet? (für Mikrofon erforderlich)

3. **Console Commands testen:**
```javascript
// Vapi-Status prüfen
console.log('Vapi instance:', window.vapi)

// Store-Status prüfen  
console.log('Store state:', useInterviewStore.getState())

// Test-Message hinzufügen
useInterviewStore.getState().addTranscriptMessage({
  role: 'assistant', 
  message: 'Test'
})
```

### Wenn Events kommen, aber Transkript leer:
1. **Message-Format prüfen:**
   - Welche Event-Struktur wird verwendet?
   - Wo steht der Text in der Message?

2. **Vapi Assistant-Konfiguration:**
   - Ist Transkription aktiviert?
   - Sind die richtigen Event-Webhooks konfiguriert?

### Console-Test-Commands:

```javascript
// 1. Alle registrierten Events anzeigen
Object.getOwnPropertyNames(vapi).filter(name => name.includes('on'))

// 2. Manual transcript test
const store = useInterviewStore.getState()
store.addTranscriptMessage({role: 'assistant', message: 'Test Bot Message'})
store.addTranscriptMessage({role: 'user', message: 'Test User Message'})

// 3. Volume test
store.setVolumeLevel(0.7)

// 4. Check current transcript
console.log('Current transcript:', store.transcript)
```

## 🎬 Step-by-Step Test

1. **Interview starten**
2. **Console öffnen**
3. **Sprechen und beobachten:**
   - Kommen `volume-level` Events?
   - Kommen `message` oder `transcript` Events?
   - Was steht in den Event-Daten?

4. **Debug-Panel testen:**
   - Test-Nachrichten hinzufügen
   - Funktioniert das Transkript grundsätzlich?

5. **Manual Fix versuchen:**
   - Falls Events kommen aber Format falsch ist
   - Event-Structure in Console analysieren
   - Anpassung in `lib/vapi.ts` vornehmen

## 📞 Kontakt bei Problemen

Wenn das Problem weiterhin besteht:
1. **Console-Logs kopieren** (besonders alle 🎯 Vapi Events)
2. **Screenshot des Debug-Panels**
3. **Vapi Dashboard-Konfiguration überprüfen**

Die erweiterte Event-Logging sollte jetzt alle Vapi-Events anzeigen und das genaue Problem identifizieren!