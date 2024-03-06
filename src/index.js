import React from 'react'
import ReactDOM from 'react-dom/client'
import * as Sentry from '@sentry/react'
import App from './App'
import './scss/index.scss'


Sentry.init({
  dsn: 'https://1c765368a22f372f7e105a62ebb339bb@o4505204785348608.ingest.us.sentry.io/4506862987968512',
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ['localhost', /^https:\/\/chamsocial\.com/, /^https:\/\/www\.chamsocial\.com/],
  // Session Replay
  // This sets the sample rate at 10%. You may want to change it to 100%
  // while in development and then sample at a lower rate in production.
  replaysSessionSampleRate: 0.1,
  // If you're not already sampling the entire session,
  // change the sample rate to 100% when sampling sessions where errors occur.
  replaysOnErrorSampleRate: 1.0,
})

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<App />)
