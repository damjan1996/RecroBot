# RecroBot - KI-gestütztes Interview-System

Eine moderne Web-Anwendung für automatisierte Bewerbungsgespräche mit Vapi Voice AI Integration.

## 🚀 Features

- **KI-gestützte Interviews**: Natürliche Gesprächsführung mit Vapi Voice AI
- **Real-time Transkription**: Live-Mitschrift aller Gespräche
- **Responsive Design**: Optimiert für Desktop und Mobile
- **DSGVO-konform**: Datenschutzkonformes Interview-System
- **Intuitive Benutzeroberfläche**: Moderne UI mit Shadcn/ui Components
- **Automatische Auswertung**: Sofortige Verfügbarkeit der Interview-Daten

## 🛠 Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **UI Components**: Shadcn/ui, Lucide React Icons
- **State Management**: Zustand
- **Voice AI**: Vapi Web SDK
- **Styling**: Tailwind CSS mit Custom Design System

## 📋 Voraussetzungen

- Node.js 18+ 
- npm oder yarn
- Vapi Account mit API Keys

## 🔧 Installation

1. Repository klonen:
```bash
git clone <repository-url>
cd recrobot-interview
```

2. Dependencies installieren:
```bash
npm install
```

3. Environment Variables einrichten:
```bash
cp .env.local.example .env.local
```

Füge deine Vapi Credentials in `.env.local` ein:
```env
NEXT_PUBLIC_VAPI_PUBLIC_KEY=your_vapi_public_key
NEXT_PUBLIC_VAPI_ASSISTANT_ID=your_assistant_id
```

4. Development Server starten:
```bash
npm run dev
```

Die Anwendung ist unter [http://localhost:3000](http://localhost:3000) verfügbar.

## 🏗 Projektstruktur

```
recrobot-interview/
├── app/                     # Next.js App Router Pages
│   ├── interview/          # Interview Interface
│   ├── success/            # Success Page
│   ├── layout.tsx          # Root Layout
│   ├── page.tsx            # Landing Page
│   └── globals.css         # Global Styles
├── components/             # React Components
│   ├── landing/            # Landing Page Components
│   ├── interview/          # Interview Components
│   ├── layout/             # Layout Components
│   └── ui/                 # Shadcn UI Components
├── lib/                    # Utilities & Configuration
│   ├── store.ts            # Zustand State Management
│   ├── vapi.ts             # Vapi Integration
│   └── utils.ts            # Helper Functions
├── types/                  # TypeScript Type Definitions
│   └── index.ts
└── public/                 # Static Assets
```

## 🎯 Verwendung

### 1. Bewerbung starten
- Besuche die Startseite
- Fülle das Bewerbungsformular aus
- Klicke auf "Interview starten"

### 2. Interview durchführen
- Gewähre Mikrofon-Berechtigung
- Starte das Voice-Interview
- Führe ein natürliches Gespräch mit der KI
- Verfolge das Live-Transkript

### 3. Ergebnisse
- Interview automatisch beenden oder manuell stoppen
- Transkript herunterladen
- Zur Success-Page weiterleiten

## 📱 Responsive Design

Die Anwendung ist vollständig responsive und optimiert für:
- **Desktop**: Vollständige Zwei-Spalten-Layout
- **Tablet**: Angepasstes Layout mit vertikal gestapelten Bereichen
- **Mobile**: Touch-optimierte Single-Column-Ansicht

## 🔐 Sicherheit & Datenschutz

- Keine permanente Speicherung von Sprachdaten
- Lokale State-Verwaltung ohne externe Datenbankverbindungen
- DSGVO-konforme Datenverarbeitung
- Verschlüsselte Übertragung aller Daten

## ⚙️ Konfiguration

### Vapi Setup
1. Erstelle einen Account bei [Vapi.ai](https://vapi.ai)
2. Erstelle einen Assistant für Interview-Zwecke
3. Kopiere Public Key und Assistant ID
4. Füge die Credentials in `.env.local` ein

### Anpassungen
- **Branding**: Logos und Farben in `tailwind.config.ts` anpassen
- **Interview-Fragen**: Assistant-Konfiguration in Vapi Dashboard
- **Styling**: Globale Styles in `app/globals.css`

## 🚀 Deployment

### Vercel (Empfohlen)
```bash
npm install -g vercel
vercel
```

### Environment Variables in Vercel setzen:
- `NEXT_PUBLIC_VAPI_PUBLIC_KEY`
- `NEXT_PUBLIC_VAPI_ASSISTANT_ID`

### Build für Production
```bash
npm run build
npm run start
```

## 🧪 Testing

```bash
# Linting
npm run lint

# Type Check
npx tsc --noEmit

# Build Test
npm run build
```

## 📄 Browser-Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork das Repository
2. Erstelle einen Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit deine Änderungen (`git commit -m 'Add some AmazingFeature'`)
4. Push zum Branch (`git push origin feature/AmazingFeature`)
5. Öffne einen Pull Request

## 📝 Lizenz

Dieses Projekt ist unter der MIT Lizenz lizenziert - siehe [LICENSE](LICENSE) für Details.

## 👥 Team

**Everlast Consulting GmbH**
- E-Mail: info@everlast-consulting.de
- Website: [everlast-consulting.de](https://everlast-consulting.de)

## 🆘 Support

Bei Fragen oder Problemen:
1. Öffne ein Issue in diesem Repository
2. Kontaktiere uns unter info@everlast-consulting.de
3. Prüfe die [Dokumentation](docs/)

---

Made with ❤️ by Everlast Consulting GmbH