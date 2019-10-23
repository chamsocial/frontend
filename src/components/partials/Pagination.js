import React from 'react'
import { Link } from 'react-router-dom'

function Plink({ page, children }) {
  const currentUrlParams = new URLSearchParams(window.location.search)
  currentUrlParams.set('p', page)
  const url = `${window.location.pathname}?${currentUrlParams.toString()}`
  return <Link to={url}>{children}</Link>
}

export default function Pagination({ totalCount, itemsPerPage = 10, page = 1 }) {
  const maxPages = 7
  const pageCount = Math.ceil(totalCount / itemsPerPage)
  const pages = pageCount < maxPages ? pageCount : maxPages

  const pageDiff = (page - 3 > 0) ? page - 3 : 1
  let i = pageDiff

  const pagination = []
  for (; i <= (pages + pageDiff - 1); i += 1) {
    if (i > pageCount) break
    const isActivePage = (parseInt(page, 10) === i)
    pagination.push((
      <li key={i} className={isActivePage ? 'active' : ''}>
        <Plink page={i}>{i}</Plink>
      </li>
    ))
  }

  pagination.unshift((
    <li key="prev" className="prev">
      {(page > 1) ? <Plink page={page - 1}>&laquo;</Plink> : null}
    </li>
  ))
  pagination.push((
    <li key="next" className="next">
      {(page !== pageCount) ? <Plink page={page + 1}>&raquo;</Plink> : null}
    </li>
  ))

  return (
    <nav aria-label="Page navigation">
      <ul className="pagination">{pagination}</ul>
    </nav>
  )
}
