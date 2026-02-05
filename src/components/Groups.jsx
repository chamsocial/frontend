import React from 'react'
import { gql, useQuery } from '@apollo/client'
import { Link } from 'react-router-dom'

const GROUPS_LIST = gql`query groupsListQuery {
  groups {
    id
    slug
    title
  }
}`


function Groups({ activeId }) {
  const { loading, error, data } = useQuery(GROUPS_LIST)
  if (loading || error) return null

  return (
    <div className="block">
      <h1>Groups</h1>
      <ul className="list list--lined">
        {data.groups.map(group => (
          <li key={group.id} className={activeId === group.id ? 'active' : ''}>
            <Link to={`/groups/${group.slug}`}>{group.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}


export default Groups
