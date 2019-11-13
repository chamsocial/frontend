import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Downshift from 'downshift'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo'


const GET_USERS = gql`query messageUsersQuery($search: String!) {
  userSearch(search: $search) {
    id
    username
  }
}`


function SelectUsers({ setUser, removeUser, users }) {
  const [search, setSearch] = useState('')
  const { data } = useQuery(GET_USERS, { skip: !search, variables: { search } })
  const userList = data
    ? data.userSearch.filter(u => !users.find(sUser => sUser.id === u.id))
    : []

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
          {users && !!users.length && (
            <div>
              {users.map(user => (
                <button
                  type="button"
                  className="downshift__multi__item"
                  title="Remove"
                  key={user.id}
                  onClick={() => removeUser(user.id)}
                >
                  {user.username}
                </button>
              ))}
            </div>
          )}
          <div className="downshift__input">
            <input
              {...getInputProps({
                id: 'users',
                className: 'input',
                placeholder: 'Add recipient',
                value: inputValue,
                onFocus: () => {
                  clearSelection()
                  openMenu()
                },
              })}
            />
            {isOpen && userList && !!userList.length && (
              <ul {...getMenuProps()} className="downshift__dropdown">
                {userList
                  .map(user => (
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
