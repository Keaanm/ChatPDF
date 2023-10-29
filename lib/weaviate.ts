import weaviate, { WeaviateClient, ApiKey } from 'weaviate-ts-client';

// Instantiate the client with the auth config
export const client = weaviate.client({
  scheme: 'https',
  host: 'chatpdf-s0sa75xq.weaviate.network',  // Replace with your endpoint
  //apiKey: new weaviate.ApiKey('learn-weaviate'),  // Replace w/ your Weaviate instance API key
});