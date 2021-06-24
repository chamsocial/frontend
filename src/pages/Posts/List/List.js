import React from 'react'
import { Link } from 'react-router-dom'
import Groups from 'components/Groups'
import Search from 'components/Search'
import PostList from './PostList'


function PostsList({ location }) {
  return (
    <div className="layout-posts">
      <div className="content box">
        <h1 className="space-between">
          Posts
        </h1>
        <PostList queryParams={location.search} />
      </div>

      <div className="sidebar-top">
        <div className="box">
          <p>
            <Link to="/posts/create" className="btn btn--block">Create a post</Link>
          </p>
          <hr />
          <Search />
          <hr />
          <Groups />
        </div>
      </div>
    </div>
  )
}


export default PostsList
