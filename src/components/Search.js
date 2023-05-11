import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


function Search({ urlPath, label }) {
  const currentUrlParams = new URLSearchParams(window.location.search)
  const [searchTerm, setSearchTerm] = useState(currentUrlParams.get('q') || '')
  const navigate = useNavigate()

  const onSearch = evt => {
    evt.preventDefault()
    const searchPath = urlPath || '/posts'
    navigate(`${searchPath}?q=${encodeURIComponent(searchTerm)}`)
  }

  return (
    <div className="block">
      <label htmlFor="search">
        <h1>
          Search
          {!!label && (
            <span className="desc">{' '}in {label}</span>
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
              placeholder="E.g. touring skis, gardner"
              required
            />
            {searchTerm && (
              <button type="button" aria-label="Clear search" className="clear" onClick={() => setSearchTerm('')}>
                <FontAwesomeIcon icon="times" />
              </button>
            )}
          </div>
          <button type="submit" aria-label="Search" className="btn">
            <FontAwesomeIcon icon="search" />
          </button>
        </div>
      </form>
    </div>
  )
}


export default Search
