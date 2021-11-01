import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';

Sentry.init({
  dsn: 'https://fd00324a2a5542a5a963bf710165dd48@o1057215.ingest.sentry.io/6043899',
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 1.0
});
