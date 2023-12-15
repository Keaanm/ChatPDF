# ChatPDF SaaS

ChatPDF is a versatile SaaS (Software as a Service) platform that empowers you to interact with PDF documents like never before. With a powerful tech stack at its core, this full-stack application combines the best of Next.js, Weaviate, Neon, Clerk, and OpenAI to provide an intelligent and user-friendly PDF experience. Additionally, it integrates seamlessly with Stripe for efficient payment processing.

## Features

- **Conversational PDF Interaction**: Chat with your PDF documents as if you were chatting with a knowledgeable assistant. Ask questions, explore your content effortlessly, and enjoy intelligent answers powered by OpenAI's LLM (Large Language Model).

- **Vector Database with Weaviate**: Harness the power of Weaviate, a vector database, for seamless document data management. Easily organize and access your PDFs.

- **Cloud-Managed SQL Database**: Our cloud-managed SQL database, powered by Neon, ensures robust and secure data storage.

- **Authentication with Clerk**: Secure your account and access with Clerk, offering user-friendly and efficient authentication.

- **Stripe Integration**: Seamlessly process payments, subscriptions, and transactions using Stripe's payment processing capabilities.

## Getting Started

1. **Installation**: Start by cloning the repository and installing the necessary dependencies:

   ```bash
   git clone https://github.com/Keaanm/ChatPDF.git
   cd ChatPDF
   npm install
   ```

2. **Database Setup**: Set up and configure your cloud-managed SQL database using Neon. Update the database configuration in your project.

3. **Weaviate Integration**: Integrate Weaviate with your application to leverage its powerful vector database capabilities.

4. **Clerk Authentication**: Implement Clerk for secure and user-friendly authentication and account management.

5. **Stripe Configuration**: Configure Stripe integration by adding your Stripe API keys and setting up your payment processing logic.

6. **Start Chatting**: Launch your ChatPDF application:

   ```bash
   npm run dev
   ```

7. **Explore PDFs**: Open your web browser, navigate to `http://localhost:3000`, and begin your journey of interactive PDF exploration.

## Usage

1. **Upload PDFs**: Start by uploading your PDF documents to the platform. Weaviate ensures efficient data organization and retrieval.

2. **Chat with Your PDFs**: Select a PDF, initiate a chat session, and engage in natural language interactions. Pose questions and seek explanations to discover insights from your documents.

3. **Secure Access**: Clerk handles authentication, ensuring a secure and user-friendly experience.

4. **Efficient Payments**: Leverage Stripe's payment processing capabilities to seamlessly handle payments, subscriptions, and transactions within your application.
