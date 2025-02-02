import React from 'react'
import { useQuery } from 'react-query'
import axios from 'axios'
import { useDebounce } from 'use-debounce'
import Spinner from './Spinner'
import PaperCard from './PaperCard'

const fetchPapers = async ({ queryKey }) => {
  const [_, { query }] = queryKey
  const { data } = await axios.get('/api/v1/papers', {
    params: { query }
  })
  return data
}

export default function PaperSearch() {
  const [query, setQuery] = React.useState('')
  const [debouncedQuery] = useDebounce(query, 500)  // Debounce 500ms
  
  const { data, isLoading } = useQuery(
    ['papers', { query: debouncedQuery }], 
    fetchPapers,
    {
      staleTime: 5 * 60 * 1000,
      keepPreviousData: true
    }
  )

  return (
    <div className="container mx-auto p-4">
      <div className="relative mb-6">
        <input 
          type="text"
          placeholder="🔍 Buscar papers..."
          className="w-full p-4 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {isLoading && (
          <div className="absolute right-4 top-4">
            <Spinner size="sm" />
          </div>
        )}
      </div>
      
      {data?.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No se encontraron resultados</h3>
          <p className="text-gray-500">Intenta con otros términos de búsqueda</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.map(paper => (
          <PaperCard key={paper.id} paper={paper} />
        ))}
      </div>
    </div>
  )
} 