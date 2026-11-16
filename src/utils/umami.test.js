import {
  afterEach, describe, expect, it, vi,
} from 'vitest'
import { installUmami, resolveUmamiEnv } from './umami'
import { umamiBeforeSend } from './umami-redact'

const SRC = '/u/script.js'
const WEBSITE_ID = '00000000-0000-4000-8000-000000000000' // made up, not a real website

describe('resolveUmamiEnv', () => {
  it('is on when both values are set', () => {
    expect(resolveUmamiEnv({ src: SRC, websiteId: WEBSITE_ID, mode: 'production' }))
      .toEqual({ src: SRC, websiteId: WEBSITE_ID })
    expect(resolveUmamiEnv({ src: ` ${SRC} `, websiteId: ` ${WEBSITE_ID}\n`, mode: 'development' }))
      .toEqual({ src: SRC, websiteId: WEBSITE_ID })
  })

  it.each([
    ['no src', { src: undefined, websiteId: WEBSITE_ID }],
    ['no website id', { src: SRC, websiteId: undefined }],
    ['neither', { src: undefined, websiteId: undefined }],
    ['an empty src', { src: '', websiteId: WEBSITE_ID }],
    ['a blank website id', { src: SRC, websiteId: '   ' }],
    ['a value that is not a string', { src: SRC, websiteId: 42 }],
  ])('is off with %s', (_name, input) => {
    expect(resolveUmamiEnv({ ...input, mode: 'production' })).toBeUndefined()
  })

  it('is off under Vitest even when both values are set', () => {
    expect(resolveUmamiEnv({ src: SRC, websiteId: WEBSITE_ID, mode: 'test' })).toBeUndefined()
  })
})

describe('umamiEnv', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  it('is undefined in a test run that has both vars', async () => {
    vi.stubEnv('VITE_UMAMI_SRC', SRC)
    vi.stubEnv('VITE_UMAMI_WEBSITE_ID', WEBSITE_ID)
    vi.resetModules()
    const { umamiEnv } = await import('./umami')
    expect(import.meta.env.VITE_UMAMI_SRC).toBe(SRC)
    expect(import.meta.env.MODE).toBe('test')
    expect(umamiEnv).toBeUndefined()
  })
})

// A stand-in for the browser's window: records the script tag and what was on `window`
// at the moment the tag went into the page.
function fakeWindow() {
  const win = {
    appended: [],
    document: {
      createElement: tagName => ({
        tagName,
        attributes: {},
        setAttribute(name, value) { this.attributes[name] = value },
      }),
      head: {
        appendChild(element) {
          win.appended.push({ element, beforeSendAtAppend: win.umamiBeforeSend })
        },
      },
    },
  }
  return win
}

describe('installUmami', () => {
  it('adds nothing to the page when it is not configured', () => {
    const win = fakeWindow()
    installUmami(undefined, win)
    expect(win.appended).toEqual([])
    expect(win.umamiBeforeSend).toBeUndefined()
  })

  it('adds one script tag with the settings the tracker reads', () => {
    const win = fakeWindow()
    installUmami({ src: SRC, websiteId: WEBSITE_ID }, win)
    expect(win.appended).toHaveLength(1)
    const { element } = win.appended[0]
    expect(element.tagName).toBe('script')
    expect(element.src).toBe(SRC)
    expect(element.defer).toBe(true)
    expect(element.attributes).toEqual({
      'data-website-id': WEBSITE_ID,
      'data-exclude-search': 'true',
      'data-before-send': 'umamiBeforeSend',
      'data-tag': 'legacy',
    })
  })

  it('puts the redaction on window before the tracker tag is in the page', () => {
    const win = fakeWindow()
    installUmami({ src: SRC, websiteId: WEBSITE_ID }, win)
    expect(win.appended[0].beforeSendAtAppend).toBe(umamiBeforeSend)
  })
})
