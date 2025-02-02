import React from 'react'
import { motion } from 'framer-motion'
import { StarIcon, BookOpenIcon } from '@heroicons/react/24/solid'

const PaperCard = ({ paper }) => {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="group bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
    >
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
            <StarIcon className="w-4 h-4 mr-1" />
            {paper.market_score.toFixed(1)}
          </span>
          <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-gray-100 rounded-lg">
            <BookOpenIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        
        <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-2">
          {paper.title}
        </h3>
        
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <span className="flex items-center">
            {paper.authors.slice(0, 2).join(', ')}
            {paper.authors.length > 2 && ` +${paper.authors.length - 2}`}
          </span>
        </div>
      </div>
      
      <div className="border-t px-6 py-4 bg-gray-50 dark:bg-gray-700/20">
        <div className="flex items-center justify-between text-sm">
          <span className="text-primary font-medium">
            {paper.favorites_count} guardados
          </span>
          <a 
            href={paper.pdf_url}
            className="hover:text-primary transition-colors"
            target="_blank"
            rel="noopener"
          >
            Ver PDF →
          </a>
        </div>
      </div>
    </motion.div>
  )
}

export default PaperCard 