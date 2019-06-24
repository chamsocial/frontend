import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import Downshift from 'downshift'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


function filterMatches(inputValue) {
  return item => !inputValue || item.title.toLowerCase().includes(inputValue.toLowerCase())
}


const GroupSelect = React.memo(({
  setGroup, group, groupInput, groupsList,
}) => {
  if (groupsList.loading || groupsList.error) return null
  const { groups } = groupsList

  return (
    <Downshift
      onChange={setGroup}
      itemToString={item => (item ? item.title : '')}
      selectedItem={group || ''}
      initialInputValue={group ? group.title : ''}
    >
      {({
        getInputProps,
        getItemProps,
        getMenuProps,
        isOpen,
        inputValue,
        selectedItem,
        openMenu,
        clearSelection,
        highlightedIndex,
      }) => (
        <div className="downshift">
          <label htmlFor="group">Group</label>
          <div className="downshift__input">
            <input
              {...getInputProps({
                id: 'group',
                ref: groupInput,
                className: 'form-control',
                placeholder: 'Select group',
                required: true,
                onFocus: () => {
                  clearSelection()
                  openMenu()
                },
              })}
            />

            {selectedItem && (
              <button type="button" onClick={() => groupInput.current.focus()} className="downshift__clear">
                <FontAwesomeIcon icon="times-circle" />
              </button>
            )}

            {isOpen && (
              <ul {...getMenuProps()} className="downshift__dropdown">
                {groups
                  .filter(filterMatches(inputValue))
                  .map((item, index) => {
                    const itemProps = {
                      key: item.id,
                      index,
                      item,
                      style: {
                        backgroundColor: highlightedIndex === index ? 'lightgray' : 'white',
                        fontWeight: selectedItem === item ? 'bold' : 'normal',
                      },
                    }
                    return (
                      <li {...getItemProps(itemProps)}>
                        {item.title}
                        <div className="desc">{item.description}</div>
                      </li>
                    )
                  })
                }
              </ul>
            )}
          </div>
        </div>
      )}
    </Downshift>
  )
})
GroupSelect.defaultProps = {
  group: null,
}
GroupSelect.propTypes = {
  group: PropTypes.shape({
    title: PropTypes.string.isRequired,
  }),
  setGroup: PropTypes.func.isRequired,
  groupInput: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired,
  groupsList: PropTypes.shape({ loading: PropTypes.bool }).isRequired,
}


const GET_GROUPS = gql`
  query getGroupsQuery {
    groups {
      id
      title
      description
    }
  }
`


export default graphql(GET_GROUPS, { name: 'groupsList' })(GroupSelect)
