import React, { useState } from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const GET_DRAFTS = gql`
  query getDraftsQuery {
    drafts {
      id
      title
    }
  }
`


function Drafts({ deleteDraft }) {
  const drafts = useQuery(GET_DRAFTS, { fetchPolicy: 'network-only' })
  const [show, setShow] = useState(true)
  const { loading, error, data } = drafts
  if (!show || loading || error || (data && !data.drafts.length)) return null

  function onDelete(id) {
    return () => {
      deleteDraft({ variables: { id }, refetchQueries: ['getDraftsQuery'] })
    }
  }

  return (
    <div>
      <strong>Drafts</strong>
      <p className="desc space-between">
        <span>Edit an existing draft or discard drafts</span>
        <button type="button" className="btn btn--small btn--link" onClick={() => setShow(false)}>Hide</button>
      </p>
      <ul className="list list--lined">
        {data.drafts.map(draft => (
          <li key={draft.id} className="space-between">
            <Link to={`/posts/${draft.id}/edit`}>
              {draft.title || 'Unnamed'}
            </Link>
            <button type="button" className="btn btn--link btn--link--desc" onClick={onDelete(draft.id)}>
              <FontAwesomeIcon icon="trash-alt" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
Drafts.propTypes = {
  deleteDraft: PropTypes.func.isRequired,
}


export default Drafts
