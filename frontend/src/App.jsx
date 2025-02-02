import React from 'react'
import PaperSearch from './components/Search'

const API_URL = "http://localhost:8000/api/v1"

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4">
          <h1 className="text-3xl font-bold text-primary">AIMarketHub</h1>
        </div>
      </header>
      <main>
        <PaperSearch />
      </main>
    </div>
  )
} 