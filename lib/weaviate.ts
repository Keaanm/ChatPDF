import weaviate, { WeaviateClient, ApiKey } from 'weaviate-ts-client';

  export const client: WeaviateClient = weaviate.client({
    scheme: 'https',
    host: 'chatpdf-4sqblf7n.weaviate.network',
    apiKey: new ApiKey('xXJVxC9gjGNnCbLMvSJs2s5dhsOuS30cqirQ'),
    headers: {
      "X-OpenAI-Api-Key": process.env.OPENAI_API_KEY!
  }
  });

//The Message Weaviate Schema
const response = await client
.schema
.classCreator()
.withClass({
  class: "ChatpdfV11",
  description: "Message sent by a user",
  vectorizer: 'text2vec-openai',
  moduleConfig: {
    'text2vec-openai': {
      model: "ada",
      modelVersion: "002",  
      type: "text"
    },
    'generative-openai': {
      model: "gpt-3.5-turbo",
    }
  },
  properties: [
    {
      name: "text",
      dataType: ["text"],
      description: "The text of the message",
    }
  ],
  multiTenancyConfig: { enabled: true },
})
// .do();
//console.log(JSON.stringify(response, null, 2));


