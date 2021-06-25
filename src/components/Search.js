import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


function Search() {
  const currentUrlParams = new URLSearchParams(window.location.search)
  const [searchTerm, setSearchTerm] = useState(currentUrlParams.get('q') || '')
  const history = useHistory()

  const onSearch = evt => {
    evt.preventDefault()
    history.push(`/posts?q=${encodeURIComponent(searchTerm)}`)
  }

  return (
    <div className="block">
      <h1>Search</h1>
      <form onSubmit={onSearch}>
        <div className="input-btn">
          <div className="input-clear">
            <input
              className="input"
              value={searchTerm}
              onChange={evt => setSearchTerm(evt.target.value)}
              minLength="3"
              required
            />
            {searchTerm && (
              <button type="button" className="clear" onClick={() => setSearchTerm('')}>
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
