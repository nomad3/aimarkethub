import React from 'react'
import { ArrowPathIcon } from '@heroicons/react/24/outline'

export default function Spinner({ size = 'md', global = false }) {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  }
  
  return (
    <div className={`${global ? 'fixed inset-0 z-50 bg-black/20 flex items-center justify-center' : ''}`}>
      <ArrowPathIcon 
        className={`${sizes[size]} animate-spin text-primary`} 
        aria-hidden="true"
      />
    </div>
  )
} 