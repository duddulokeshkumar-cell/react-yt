import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { API_KEY } from '../../data'
import './search-results.css'

const SearchResults = () => {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q')?.trim() || ''
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!query) {
      return undefined
    }

    const controller = new AbortController()

    const fetchResults = async () => {
      setLoading(true)
      setError('')

      try {
        const params = new URLSearchParams({
          part: 'snippet',
          type: 'video',
          maxResults: '25',
          q: query,
          key: API_KEY,
        })
        const response = await fetch(
          `https://youtube.googleapis.com/youtube/v3/search?${params}`,
          { signal: controller.signal }
        )
        const data = await response.json()

        if (!response.ok || data.error) {
          throw new Error(data.error?.message || 'Could not load search results.')
        }

        setResults(data.items || [])
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') {
          setError('Search results could not be loaded. Please try again.')
          console.error('Video search error:', fetchError)
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    fetchResults()
    return () => controller.abort()
  }, [query])

  return (
    <main className='search-results-page'>
      <h1>Search results for “{query}”</h1>
      {query && loading && <p className='search-results-status'>Searching videos...</p>}
      {query && error && <p className='search-results-status' role='alert'>{error}</p>}
      {!loading && !error && results.length === 0 && query && (
        <p className='search-results-status'>No videos found. Try a different search.</p>
      )}
      {!query && <p className='search-results-status'>Enter a search term to find videos.</p>}

      <div className='search-results-list'>
        {query && !loading && !error && results.map((item) => {
          const videoId = item.id?.videoId
          if (!videoId) return null

          return (
            <Link
              key={videoId}
              to={`/video/0/${videoId}`}
              className='search-result-card'
            >
              <img
                src={item.snippet?.thumbnails?.medium?.url || item.snippet?.thumbnails?.default?.url}
                alt=''
              />
              <div>
                <h2>{item.snippet?.title}</h2>
                <p>{item.snippet?.channelTitle}</p>
                <p>{item.snippet?.description}</p>
              </div>
            </Link>
          )
        })}
      </div>
    </main>
  )
}

export default SearchResults
