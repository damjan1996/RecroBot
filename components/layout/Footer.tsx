export function Footer() {
  return (
    <footer className="border-t bg-gray-50 mt-auto">
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">RecroBot</h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Revolutioniere dein Recruiting mit KI-gestützten Interviews. 
              Schnell, effizient und DSGVO-konform.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Kontakt</h3>
            <div className="text-xs sm:text-sm text-gray-600 space-y-1 sm:space-y-2">
              <p>Everlast Consulting GmbH</p>
              <p>info@everlast-consulting.de</p>
              <p className="hidden sm:block">+49 (0) 123 456 789</p>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Rechtliches</h3>
            <div className="text-xs sm:text-sm text-gray-600 space-y-1 sm:space-y-2">
              <p>Datenschutz</p>
              <p>Impressum</p>
              <p>AGB</p>
            </div>
          </div>
        </div>
        
        <div className="border-t mt-6 sm:mt-8 pt-4 sm:pt-8 text-center text-xs sm:text-sm text-gray-500">
          © 2024 Everlast Consulting GmbH. Alle Rechte vorbehalten.
        </div>
      </div>
    </footer>
  )
}