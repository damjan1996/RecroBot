'use client'

import { useRef } from 'react'
import { Hero } from '@/components/landing/Hero'
import { ApplicationForm } from '@/components/landing/ApplicationForm'

export default function LandingPage() {
  const formRef = useRef<HTMLDivElement>(null)

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    })
  }

  return (
    <>
      <Hero onStartApplication={scrollToForm} />
      <div ref={formRef}>
        <ApplicationForm />
      </div>
    </>
  )
}