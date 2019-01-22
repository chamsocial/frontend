import React, { Component } from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import Downshift from 'downshift'

// Import React FilePond
import { FilePond, File, registerPlugin } from 'react-filepond'

// Import FilePond styles
import 'filepond/dist/filepond.min.css'

// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'

import Button from '../../components/partials/Button'

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview)

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

class CreatePostComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      postId: false,
      title: '',
      content: '',
      group: null,
      files: [],
      uploadInit: false,
    }

    this.groupInput = React.createRef()

    this.update = this.update.bind(this)
    this.setGroup = this.setGroup.bind(this)
    this.unsetGroup = this.unsetGroup.bind(this)
    this.setInit = this.setInit.bind(this)
  }

  setGroup(group) {
    this.setState({ group })
  }

  setInit() {
    const { title, content, uploadInit } = this.state
    const { createPost } = this.props
    if (uploadInit) return uploadInit

    const postPromise = createPost({ title, content, status: 'draft' })
      .then(result => {
        this.setState({ postId: result.data.createPost.id })
        return result
      })
    this.setState({ uploadInit: postPromise })
    return postPromise
  }

  update(evt) {
    const { id, value } = evt.target
    this.setState({ [id]: value })
  }

  unsetGroup() {
    this.setState({ group: null }, () => {
      this.groupInput.current.focus()
    })
  }

  render() {
    const {
      title, content, group, files, postId,
    } = this.state

    return (
      <form onSubmit={this.onSubmit} className="narrow-form">
        <h1>Create post {postId}</h1>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input value={title} id="title" onChange={this.update} required />
        </div>
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea id="content" onChange={this.update} value={content} />
        </div>

        {/* Pass FilePond properties as attributes */}
        <FilePond
          ref={ref => { this.pond = ref }}
          allowMultiple
          maxFiles={3}
          beforeAddFile={item => {
            console.log(item)
            return this.setInit()
          }}
          server={{
            url: `${process.env.REACT_APP_API_URL}/upload/${postId}`,
            revert: {
              method: 'POST',
            },
          }}
          onupdatefiles={fileItems => {
            // Set current file objects to this.state
            this.setState({
              files: fileItems.map(fileItem => fileItem.file),
            })
          }}
        >
          {/* Update current files  */}
          {files.map(file => (
            <File key={file} src={file} origin="local" />
          ))}
        </FilePond>

        <div className="form-group">
          <Downshift
            onChange={this.setGroup}
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
                <label htmlFor="group">Group</label>
                <div className="downshift__input">
                  <input ref={this.groupInput} {...getInputProps({ id: 'group', className: 'form-control', onFocus: () => openMenu() })} />

                  {selectedItem && (
                    <button type="button" onClick={this.unsetGroup} className="downshift__clear">
                      ⓧ
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
        </div>

        <div className="form-group">
          <Button type="submit">Publish</Button>
        </div>
      </form>
    )
  }
}
CreatePostComponent.propTypes = {
  createPost: PropTypes.func.isRequired,
}

const CREATE_POST = gql`
  mutation createPostMutation($title: String! $content: String! $status: PostStatus) {
    createPost(title: $title, content: $content, status: $status) {
      id
    }
  }
`

const CreatePost = graphql(CREATE_POST, {
  props: ({ mutate }) => ({
    createPost: variables => mutate({ variables }),
  }),
})(CreatePostComponent)

export default CreatePost
