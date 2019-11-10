import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Downshift from 'downshift'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const GET_USERS = gql`query messageUsersQuery($search: String!) {
  userSearch(search: $search) {
    id
    username
  }
}`

function SelectUsers({ setUser, removeUser, users }) {
  const [search, setSearch] = useState('')
  const { data } = useQuery(GET_USERS, { skip: !search, variables: { search } })
  const userList = data ? data.userSearch : []

  return (
    <Downshift
      onChange={setUser}
      onInputValueChange={setSearch}
      itemToString={() => ''}
      inputValue={search}
    >
      {({
        getInputProps,
        getItemProps,
        getMenuProps,
        isOpen,
        inputValue,
        openMenu,
        clearSelection,
      }) => (
        <div className="downshift">
          <label htmlFor="group">Recipients</label>
          <div className="downshift__input">
            <div className="downshift__multi input">
              {users.map(user => (
                <div className="downshift__multi__item" key={user.id}>
                  {user.username}
                  {' '}
                  <button type="button" className="btn btn--link" onClick={() => removeUser(user.id)}>
                    <FontAwesomeIcon icon="times" />
                  </button>
                </div>
              ))}
              <input
                {...getInputProps({
                  id: 'group',
                  className: 'input',
                  placeholder: 'Select group',
                  required: true,
                  value: inputValue,
                  onFocus: () => {
                    clearSelection()
                    openMenu()
                  },
                })}
              />
            </div>
            {isOpen && (
              <ul {...getMenuProps()} className="downshift__dropdown">
                {userList.map(user => (
                  <li {...getItemProps({ key: user.id, item: user })}>
                    {user.username}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </Downshift>
  )
}
SelectUsers.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    username: PropTypes.string,
  })).isRequired,
  setUser: PropTypes.func.isRequired,
  removeUser: PropTypes.func.isRequired,
}

export default SelectUsers
