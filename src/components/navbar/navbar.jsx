import { useEffect, useState } from 'react'
import './navbar.css'
import menu_icon from '../../assets/menu.png'
import logo from '../../assets/logo.png'
import search_icon from '../../assets/search.png'
import upload_icon from '../../assets/upload.png'
import more_icon from '../../assets/more.png'
import notification_icon from '../../assets/notification.png'
import profile_icon from '../../assets/jack.png'
import { Link, useNavigate } from 'react-router-dom'
import { API_KEY } from '../../data'

const Navbar = ({setSidebar}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [activeSuggestion, setActiveSuggestion] = useState(-1)
  const [suggestionError, setSuggestionError] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const query = searchQuery.trim()

    if (query.length < 2) {
      return undefined
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(async () => {
      try {
        const params = new URLSearchParams({
          part: 'snippet',
          type: 'video',
          maxResults: '6',
          q: query,
          key: API_KEY,
        })
        const response = await fetch(
          `https://youtube.googleapis.com/youtube/v3/search?${params}`,
          { signal: controller.signal }
        )
        const result = await response.json()

        if (!response.ok || result.error) {
          throw new Error(result.error?.message || 'Could not load search suggestions.')
        }

        setSuggestions(result.items || [])
        setSuggestionError('')
      } catch (error) {
        if (error.name !== 'AbortError') {
          setSuggestions([])
          setSuggestionError('Suggestions are currently unavailable.')
          console.error('Search suggestions error:', error)
        }
      }
    }, 300)

    return () => {
      clearTimeout(timeoutId)
      controller.abort()
    }
  }, [searchQuery])

  const submitSearch = (query = searchQuery) => {
    const trimmedQuery = query.trim()
    if (!trimmedQuery) return

    setShowSuggestions(false)
    setSuggestions([])
    navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`)
  }

  const selectSuggestion = (suggestion) => {
    const videoId = suggestion.id?.videoId
    if (!videoId) return

    setShowSuggestions(false)
    setSuggestions([])
    navigate(`/video/0/${videoId}`)
  }

  const handleSearchKeyDown = (event) => {
    if (event.key === 'Escape') {
      setShowSuggestions(false)
      setActiveSuggestion(-1)
      return
    }

    if (event.key === 'ArrowDown' && suggestions.length > 0) {
      event.preventDefault()
      setShowSuggestions(true)
      setActiveSuggestion((current) => (current + 1) % suggestions.length)
      return
    }

    if (event.key === 'ArrowUp' && suggestions.length > 0) {
      event.preventDefault()
      setActiveSuggestion((current) =>
        current <= 0 ? suggestions.length - 1 : current - 1
      )
      return
    }

    if (event.key === 'Enter') {
      event.preventDefault()
      if (showSuggestions && activeSuggestion >= 0) {
        selectSuggestion(suggestions[activeSuggestion])
      } else {
        submitSearch()
      }
    }
  }

  return (
    <nav className='flex-div'>
        <div className='nav-left flex-div'>
            <img src={menu_icon} alt="" className='menu-icon'
            onClick={() =>setSidebar(prev => prev === false ? true:false)}/>
          <Link to='/'><img src={logo} alt="" className='logo'/></Link>
        </div>

        <div className='nav-middle flex-div'>
            <div className='search-container'>
              <form
                className='search-box flex-div'
                role='search'
                onSubmit={(event) => {
                  event.preventDefault()
                  submitSearch()
                }}
              >
                  <input
                    type="search"
                    placeholder='Search'
                    value={searchQuery}
                    aria-label='Search YouTube'
                    aria-autocomplete='list'
                    aria-expanded={showSuggestions && suggestions.length > 0}
                    onChange={(event) => {
                      setSearchQuery(event.target.value)
                      setSuggestions([])
                      setSuggestionError('')
                      setActiveSuggestion(-1)
                      setShowSuggestions(true)
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setShowSuggestions(false)}
                    onKeyDown={handleSearchKeyDown}
                  />
                  <button type='submit' aria-label='Search'>
                    <img src={search_icon} alt="" />
                  </button>
              </form>
              {showSuggestions && searchQuery.trim().length >= 2 && (
                <div className='search-suggestions' role='listbox' aria-label='Search suggestions'>
                  {suggestions.map((suggestion, index) => (
                    <button
                      type='button'
                      role='option'
                      aria-selected={activeSuggestion === index}
                      className={activeSuggestion === index ? 'active' : ''}
                      key={suggestion.id?.videoId}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => selectSuggestion(suggestion)}
                    >
                      <img
                        src={suggestion.snippet?.thumbnails?.default?.url || search_icon}
                        alt=''
                      />
                      <span>
                        <strong>{suggestion.snippet?.title}</strong>
                        <small>{suggestion.snippet?.channelTitle}</small>
                      </span>
                    </button>
                  ))}
                  {suggestions.length === 0 && !suggestionError && (
                    <p className='suggestion-status'>Searching videos...</p>
                  )}
                  {suggestionError && (
                    <p className='suggestion-status'>{suggestionError}</p>
                  )}
                </div>
              )}
            </div>
        </div>

        <div className='nav-right flex-div'>
            <img src={upload_icon} alt="" />
            <img src={more_icon} alt="" />
            <img src={notification_icon} alt="" />
            <img src={profile_icon} alt="" className='user-icon' />
        </div>
    </nav>
  )
}

export default Navbar