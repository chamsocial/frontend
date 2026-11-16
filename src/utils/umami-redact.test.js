import { describe, expect, it } from 'vitest'
import { umamiBeforeSend } from './umami-redact'

const ORIGIN = 'https://www.chamsocial.com'
const view = (path, title = 'ChamSocial') => ({ url: ORIGIN + path, title })

describe('umamiBeforeSend: what the tracker may report', () => {
  it.each([
    ['/reset-password/3f9a1c7e5b', '/reset-password/:token'],
    ['/users/activate/a1b2c3d4', '/users/activate/:code'],
    ['/messages/4821', '/messages/:threadId'],
    ['/messages/to/some-member', '/messages/to/:slug'],
    ['/unsubscribe/kX9vQ2/Zr81LmP/12', '/unsubscribe/:user/:time/:group'],
    ['/unsubscribe/kX9vQ2/Zr81LmP/daily', '/unsubscribe/:user/:time/:group'],
  ])('hides %s as %s and drops the title', (path, shape) => {
    expect(umamiBeforeSend('event', view(path))).toEqual({ url: ORIGIN + shape })
  })

  // Every other route in src/Routes.jsx, plus near misses of the hidden ones.
  it.each([
    '/',
    '/login',
    '/forgot-password',
    '/signup',
    '/logout',
    '/about',
    '/contact',
    '/map/quarantine',
    '/curfew/am-i-allowed-outside',
    '/users/emails',
    '/users/edit',
    '/users/bookmarks',
    '/users/posts-comments',
    '/users/some-member',
    '/users/activate',
    '/posts',
    '/posts/create',
    '/posts/4821/edit',
    '/posts/the-lift-is-open',
    '/messages',
    '/messages/',
    '/messages/new',
    '/messages/to',
    '/blog',
    '/blog/reset-password',
    '/groups/chamonix',
    '/reset-password',
    '/reset-password/',
    '/unsubscribe',
    '/no-such-page',
  ])('leaves %s alone, title included', path => {
    expect(umamiBeforeSend('event', view(path))).toEqual(view(path))
  })

  // React Router matches /Reset-Password/x, /reset-password/x/ and /reset%2Dpassword/x
  // to the reset page as well, so those must be hidden too.
  it.each([
    ['/Reset-Password/3f9a1c7e5b', '/reset-password/:token'],
    ['/USERS/Activate/a1b2c3d4', '/users/activate/:code'],
    ['/Messages/4821', '/messages/:threadId'],
    ['/messages/TO/some-member', '/messages/to/:slug'],
    ['/reset-password/3f9a1c7e5b/', '/reset-password/:token/'],
    ['//reset-password//3f9a1c7e5b', '/reset-password/:token'],
    ['/reset%2Dpassword/3f9a1c7e5b', '/reset-password/:token'],
    ['/%6Dessages/4821', '/messages/:threadId'],
    ['/messages/newer', '/messages/:threadId'],
    ['/messages/tomorrow', '/messages/:threadId'],
  ])('hides %s however it is written', (path, shape) => {
    expect(umamiBeforeSend('event', view(path))).toEqual({ url: ORIGIN + shape })
  })

  it('leaves a path with a malformed escape alone unless it matches as written', () => {
    expect(umamiBeforeSend('event', view('/posts/100%-off'))).toEqual(view('/posts/100%-off'))
    expect(umamiBeforeSend('event', view('/messages/100%-off'))).toEqual({
      url: `${ORIGIN}/messages/:threadId`,
    })
  })

  it('hides the secret in a same-site referrer, which has no origin', () => {
    const payload = { url: `${ORIGIN}/`, title: 'ChamSocial', referrer: '/reset-password/3f9a1c' }
    expect(umamiBeforeSend('event', payload)).toEqual({
      url: `${ORIGIN}/`,
      title: 'ChamSocial',
      referrer: '/reset-password/:token',
    })
  })

  it('keeps an outside referrer as it is', () => {
    const payload = { ...view('/'), referrer: 'https://news.example.com/2026/chamonix' }
    expect(umamiBeforeSend('event', payload)).toEqual(payload)
  })

  it('hides the same paths on any origin: the old site and the beta share them', () => {
    const payload = { ...view('/'), referrer: 'https://beta.chamsocial.com/reset-password/3f9a' }
    expect(umamiBeforeSend('event', payload).referrer).toBe(
      'https://beta.chamsocial.com/reset-password/:token',
    )
  })

  it('keeps whatever follows the hidden part', () => {
    expect(umamiBeforeSend('event', { url: `${ORIGIN}/messages/4821#latest` })).toEqual({
      url: `${ORIGIN}/messages/:threadId#latest`,
    })
    expect(umamiBeforeSend('event', { url: `${ORIGIN}/messages/4821?page=2` })).toEqual({
      url: `${ORIGIN}/messages/:threadId?page=2`,
    })
  })

  it('hides the path on any payload, not only on a page view', () => {
    expect(umamiBeforeSend('event', { ...view('/messages/4821'), name: 'reply' })).toEqual({
      url: `${ORIGIN}/messages/:threadId`,
      name: 'reply',
    })
  })

  it('keeps the rest of the payload and does not change the one it was given', () => {
    const payload = {
      website: 'w', hostname: 'www.chamsocial.com', tag: 'legacy', ...view('/messages/4821'),
    }
    const copy = { ...payload }
    expect(umamiBeforeSend('event', payload)).toEqual({
      website: 'w', hostname: 'www.chamsocial.com', tag: 'legacy', url: `${ORIGIN}/messages/:threadId`,
    })
    expect(payload).toEqual(copy)
  })

  it('passes an empty payload through', () => {
    expect(umamiBeforeSend('event', null)).toBeNull()
    expect(umamiBeforeSend('event', undefined)).toBeUndefined()
  })
})
