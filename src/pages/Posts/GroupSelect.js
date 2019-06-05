import React from 'react'
import PropTypes from 'prop-types'
import Downshift from 'downshift'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const groups = [
  /* eslint-disable */
  {"id":1,"title":"Chamshare","description":"The main Chamshare list. General chat, shoutouts, discussions, questions...","slug":"chamshare","post_count":55373},
  {"id":2,"title":"Trade","description":"Need to buy something or have something to sell?","lang":"en","slug":"trade","post_count":13551},
  {"id":3,"title":"Accommodation","description":"Housemates / roommates / flat shares wanted or offered","lang":"en","slug":"accommodation","post_count":6311},
  {"id":4,"title":"Jobs","description":"Work wanted or offered in the valley","lang":"en","slug":"jobs","post_count":3649},
  {"id":5,"title":"Transfers","description":"Transfers offers/requests","lang":"en","slug":"transfers","post_count":2014},
  {"id":6,"title":"News","description":"News about Chamsocial","lang":"en","slug":"news","post_count":886},
  {"id":7,"title":"Kids","description":"For valley parents - everything and anything to do with children","lang":"en","slug":"kids","post_count":247},
  {"id":8,"title":"Mountain friends","description":"Looking for friends for a mountain activity? (e.g Ski, climbing, cycling, hikingbuddy)","lang":"en","slug":"mountainfriends","post_count":180},
  {"id":9,"title":"Pets in cham","description":"Discussion related to pets in the valley","lang":"en","slug":"cham-pets","post_count":70},
  {"id":10,"title":"Website feedback","description":"Feedback and bug reporting for the Chamsocial web site","lang":"en","slug":"new-chamsocial","post_count":31},
  {"id":11,"title":"Singletrack","description":"Single Track Chamonix group is all about biking, free spirit, comunity and solidarity. Get involved!","lang":"en","slug":"singletrack","post_count":26},
  /* eslint-enable */
]

function filterMatches(inputValue) {
  return item => !inputValue || item.title.toLowerCase().includes(inputValue.toLowerCase())
}

const GroupSelect = React.memo(({
  setGroup, group, unsetGroup, groupInput,
}) => (
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
    }) => (
      <div className="downshift">
        {console.log('Group')}
        <label htmlFor="group">Group</label>
        <div className="downshift__input">
          <input
            {...getInputProps({
              id: 'group',
              ref: groupInput,
              className: 'form-control',
              placeholder: 'Select group',
              onFocus: () => openMenu(),
            })}
          />

          {selectedItem && (
            <button type="button" onClick={unsetGroup} className="downshift__clear">
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
))
GroupSelect.defaultProps = {
  group: null,
}
GroupSelect.propTypes = {
  group: PropTypes.shape({
    title: PropTypes.string.isRequired,
  }),
  setGroup: PropTypes.func.isRequired,
  unsetGroup: PropTypes.func.isRequired,
  groupInput: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired,
}

export default GroupSelect
