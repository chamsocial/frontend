import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


function Search() {
  const [searchTerm, setSearchTerm] = useState('')
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
          <input
            className="input"
            value={searchTerm}
            onChange={evt => setSearchTerm(evt.target.value)}
            minLength="3"
            required
          />
          <button type="submit" className="btn">
            <FontAwesomeIcon icon="search" />
          </button>
        </div>
      </form>
    </div>
  )
}


export default Search
