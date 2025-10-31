import { Bot, Zap, Clock, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HeroProps {
  onStartApplication: () => void
}

export function Hero({ onStartApplication }: HeroProps) {
  return (
    <div className="container mx-auto px-3 sm:px-4 py-8 sm:py-12 lg:py-16">
      <div className="text-center max-w-4xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="p-3 sm:p-4 bg-blue-600 rounded-xl sm:rounded-2xl">
              <Bot className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
              Recro<span className="text-blue-600">Bot</span>
            </h1>
          </div>
          
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed px-2">
            Das intelligente Interview-System der Zukunft. Führe professionelle 
            Bewerbungsgespräche mit unserer fortschrittlichen KI-Technologie durch.
          </p>
          
          <div className="flex flex-col gap-3 sm:gap-4 justify-center items-center mb-8 sm:mb-12 px-4">
            <Button 
              onClick={onStartApplication}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg w-full sm:w-auto"
            >
              Jetzt Interview starten
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg w-full sm:w-auto"
            >
              Mehr erfahren
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-8 sm:mt-12 lg:mt-16">
          <div className="text-center p-4 sm:p-6 bg-white rounded-xl shadow-sm border">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Bot className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">KI-Powered</h3>
            <p className="text-xs sm:text-sm text-gray-600">
              Intelligente Gesprächsführung mit natürlicher Spracherkennung
            </p>
          </div>

          <div className="text-center p-4 sm:p-6 bg-white rounded-xl shadow-sm border">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">24/7 Verfügbar</h3>
            <p className="text-xs sm:text-sm text-gray-600">
              Interviews jederzeit und überall, ohne Terminkoordination
            </p>
          </div>

          <div className="text-center p-4 sm:p-6 bg-white rounded-xl shadow-sm border">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Schnell</h3>
            <p className="text-xs sm:text-sm text-gray-600">
              Ergebnisse in Minuten statt Wochen, sofortige Auswertung
            </p>
          </div>

          <div className="text-center p-4 sm:p-6 bg-white rounded-xl shadow-sm border">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">DSGVO-konform</h3>
            <p className="text-xs sm:text-sm text-gray-600">
              Höchste Datenschutzstandards und Compliance-Konformität
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}