import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const NOTIFICATIONS = gql`query notificationsQuery {
  notifications {
    id
    type
    typeId
    title
  }
}`


function Notifications() {
  const [isOpen, toggleOpen] = useState(false)
  const { loading, data, refetch } = useQuery(NOTIFICATIONS)
  let count = null
  if (data && data.notifications) count = data.notifications.length
  const classNames = ['notif']
  if (loading) classNames.push('loading--pulse')
  if (!count) classNames.push('nofif--none')

  function openNotif() {
    toggleOpen(false)
    setTimeout(refetch, 400)
  }

  return (
    <div style={{ position: 'relative' }} className={classNames.join(' ')}>
      <button type="button" className="btn btn--header" onClick={() => toggleOpen(prev => !prev)}>
        <FontAwesomeIcon icon="bell" />
        {count !== null && <div className="notif-badge">{count}</div>}
      </button>
      {isOpen && !!count && (
        <div className="notif-list">
          {data.notifications.map(notif => (
            <Link key={notif.id} to={`/messages/${notif.typeId}`} onClick={openNotif}>
              {notif.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}


export default Notifications
