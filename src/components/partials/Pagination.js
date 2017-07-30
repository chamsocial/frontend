import React from 'react'
import { Link } from 'react-router-dom'

export default function Pagination ({ totalCount, itemsPerPage = 10, page = 1 }) {
  page = parseInt(page, 10)
  const maxPages = 7
  const pageCount = Math.ceil(totalCount / itemsPerPage)
  const pages = pageCount < maxPages ? pageCount : maxPages

  const pageDiff = (page - 3 > 0) ? page - 3 : 1
  let i = pageDiff

  const pagination = []
  for (; i <= (pages + pageDiff - 1); i++) {
    if (i > pageCount) break
    let isActivePage = (parseInt(page, 10) === i)
    pagination.push(<li key={i} className={isActivePage ? 'active' : ''}>
      <Link to={`/page/${i}`}>{i}</Link>
    </li>)
  }

  pagination.unshift(<li key='prev' className='prev'>
    {(page > 1) ? <Link to={`/page/${page - 1}`}>&laquo;</Link> : null}
  </li>)
  pagination.push(<li key='next' className='next'>
    {(page !== pageCount) ? <Link to={`/page/${page + 1}`}>&raquo;</Link> : null}
  </li>)

  return <nav aria-label='Page navigation'>
    <ul className='pagination'>{pagination}</ul>
  </nav>
}
