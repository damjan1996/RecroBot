import { Bot } from 'lucide-react'

export function Header() {
  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-1.5 sm:p-2 bg-blue-600 rounded-lg">
              <Bot className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">RecroBot</h1>
              <p className="text-xs sm:text-sm text-gray-600 hidden xs:block">KI-gestütztes Interview-System</p>
            </div>
          </div>
          <div className="text-xs sm:text-sm text-gray-500 hidden sm:block">
            Everlast Consulting GmbH
          </div>
          <div className="text-xs text-gray-500 sm:hidden">
            Everlast
          </div>
        </div>
      </div>
    </header>
  )
}