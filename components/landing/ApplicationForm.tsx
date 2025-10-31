'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useInterviewStore } from '@/lib/store'
import { ApplicationFormData } from '@/types'

export function ApplicationForm() {
  const router = useRouter()
  const setApplicant = useInterviewStore((state) => state.setApplicant)
  
  const [formData, setFormData] = useState<ApplicationFormData>({
    name: '',
    email: '',
    position: '',
    phone: '',
  })
  
  const [errors, setErrors] = useState<Partial<ApplicationFormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: Partial<ApplicationFormData> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name ist erforderlich'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-Mail ist erforderlich'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Ungültige E-Mail-Adresse'
    }

    if (!formData.position.trim()) {
      newErrors.position = 'Position ist erforderlich'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Save applicant data to store
      setApplicant(formData)
      
      // Navigate to interview page
      router.push('/interview')
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof ApplicationFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <div id="application-form" className="container mx-auto px-3 sm:px-4 py-8 sm:py-12 lg:py-16">
      <div className="max-w-sm sm:max-w-md mx-auto">
        <Card className="shadow-lg mx-2 sm:mx-0">
          <CardHeader className="text-center px-4 sm:px-6 py-4 sm:py-6">
            <CardTitle className="text-xl sm:text-2xl font-bold">Bewerbung starten</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Fülle das Formular aus, um dein KI-Interview zu beginnen
            </CardDescription>
          </CardHeader>
          
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">Vollständiger Name *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Max Mustermann"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`h-12 text-base ${errors.name ? 'border-red-500' : ''}`}
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <p className="text-xs sm:text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">E-Mail-Adresse *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="max@beispiel.de"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`h-12 text-base ${errors.email ? 'border-red-500' : ''}`}
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <p className="text-xs sm:text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="position" className="text-sm font-medium">Gewünschte Position *</Label>
                <Input
                  id="position"
                  type="text"
                  placeholder="Software Developer"
                  value={formData.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  className={`h-12 text-base ${errors.position ? 'border-red-500' : ''}`}
                  disabled={isSubmitting}
                />
                {errors.position && (
                  <p className="text-xs sm:text-sm text-red-500">{errors.position}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">Telefonnummer (optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+49 123 456 789"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="h-12 text-base"
                  disabled={isSubmitting}
                />
              </div>

              <div className="pt-3 sm:pt-4">
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-base font-medium"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Wird verarbeitet...' : 'Interview starten'}
                </Button>
              </div>

              <div className="text-xs text-gray-500 text-center pt-2 px-2">
                Mit dem Klick auf &quot;Interview starten&quot; stimmst du unseren 
                Datenschutzbestimmungen zu.
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}