import { startMockServer, MockServer, createMockServer } from './server';
import { endpointModel } from './models/Endpoint';
import { processFakerTemplate, processObject, generateFakerValue, availableFakerMethods } from './utils/faker';
import { logger } from './utils/logger';
import * as types from './types';

const isMain = require.main === module || process.argv[1]?.includes('index.js') || process.argv[1]?.includes('index.ts');

if (isMain) {
  const port = parseInt(process.env.PORT || '3001');
  console.log(`Starting Mockly Server on port ${port}...`);
  startMockServer({ port });
}

export { MockServer, startMockServer, createMockServer };
export { endpointModel };
export { processFakerTemplate, processObject, generateFakerValue, availableFakerMethods };
export { logger };
export * from './types';
