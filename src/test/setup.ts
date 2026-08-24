import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Testing Library only auto-registers its cleanup when Vitest globals are enabled, and they
// aren't here (tests import describe/it/expect explicitly). Without this, rendered trees pile
// up in document.body across tests and queries start matching elements from earlier ones.
afterEach(cleanup);
