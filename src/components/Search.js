import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


function Search({ urlPath, label }) {
  const currentUrlParams = new URLSearchParams(window.location.search)
  const [searchTerm, setSearchTerm] = useState(currentUrlParams.get('q') || '')
  const history = useHistory()

  const onSearch = evt => {
    evt.preventDefault()
    const searchPath = urlPath || '/posts'
    history.push(`${searchPath}?q=${encodeURIComponent(searchTerm)}`)
  }

  return (
    <div className="block">
      <label htmlFor="search">
        <h1>
          Search
          {!!label && (
            <span className="desc input-desc">
              {' '}in {label}
            </span>
          )}
        </h1>
      </label>
      <form onSubmit={onSearch}>
        <div className="input-btn">
          <div className="input-clear">
            <input
              className="input"
              value={searchTerm}
              onChange={evt => setSearchTerm(evt.target.value)}
              minLength="3"
              id="search"
              required
            />
            {searchTerm && (
              <button type="button" aria-label="Search" className="clear" onClick={() => setSearchTerm('')}>
                <FontAwesomeIcon icon="times" />
              </button>
            )}
          </div>
          <button type="submit" className="btn">
            <FontAwesomeIcon icon="search" />
          </button>
        </div>
      </form>
    </div>
  )
}


export default Search
