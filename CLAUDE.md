@AGENTS.md

Step 1: Learn the AI application architecture

Before writing code, make sure you can explain:

User Question
    ↓
Embedding
    ↓
Vector Search
    ↓
Retrieve Relevant Chunks
    ↓
Prompt Construction
    ↓
LLM
    ↓
Streaming Response

You already mostly understand this from your document.

So don't spend more than 1 day here.

Step 2: OpenAI Fundamentals

This is your first real technical milestone.

Ticket T1-1

Goal

Build a minimal Next.js application that can talk to OpenAI and stream responses.

** Acceptance Criteria
 Next.js app created
 OpenAI SDK configured
 User submits prompt
 AI responds
 Streaming enabled
 Error handling implemented

** Learning Objectives
API keys
Responses API
Streaming
Server Actions / Route Handlers
Vercel AI SDK basics

** What NOT to learn yet
RAG
pgvector
Agents
MCP

Step 3: Structured Outputs

Most AI beginners skip this.

Consulting projects often need:

{
  "category": "sales",
  "priority": "high",
  "summary": "..."
}

not paragraphs.

Ticket T1-2

Goal

Build an endpoint that extracts structured data from text.

Acceptance Criteria
 User submits text
 OpenAI returns JSON
 Zod validates JSON
 Validation errors handled
Example

Input:

Customer is angry because order 1234 is delayed.

Output:

{
  "sentiment": "negative",
  "priority": "high",
  "topic": "shipping"
}
Why

This is the foundation for:

Lead qualification
CRM automation
Support ticket classification
Step 4: Tool Calling

This is where AI becomes useful for business systems.

Ticket T1-3

Goal

Allow the LLM to call functions.

Example Functions
getOrder(id)
getCustomer(id)
getSupplier(id)
Acceptance Criteria
 At least 3 tools implemented
 Tool execution logged
 LLM chooses correct tool
 Result returned to user
Learning Objectives
Function calling
Tool calling
Vercel AI SDK tools
Step 5: PostgreSQL + Embeddings

Only now.

Ticket T1-4

Goal

Store and search embeddings in PostgreSQL.

Acceptance Criteria
 pgvector installed
 Embeddings generated
 Similarity search works
 Top 5 matches returned
Learning Objectives
Embeddings
Vector similarity
pgvector
Step 6: Build RAG

Now you're ready.

Ticket T1-5

Goal

Build the first version of AI Knowledge Copilot.

Acceptance Criteria
 PDF ingestion
 Chunking
 Embeddings
 Retrieval
 Answer generation
 Source citations
Step 7: Add Anthropic

Only after OpenAI works.

Ticket T1-6

Goal

Provider abstraction layer.

Acceptance Criteria
 OpenAI provider
 Anthropic provider
 Runtime switch
 Shared interface
Learning Objectives
Multi-provider architecture
Step 8: Build Reusable AI Package

This is where your senior engineer background becomes valuable.

Ticket T1-7

Goal

Create a reusable AI package.

Structure
packages/
  ai-core/
    chat/
    embeddings/
    rag/
    tools/
Acceptance Criteria
 Shared provider interface
 Shared embedding service
 Shared tool framework
 Reusable RAG service
Recommended order for YOU

Based on your CV, I would spend time like this:

Topic	Time
OpenAI + AI SDK	25%
Tool Calling	25%
RAG + pgvector	25%
Anthropic	10%
MCP	5%
Agent Workflows	10%

Most developers do:

RAG
RAG
RAG
RAG

But your future value comes from:

Business Systems
+
Tool Calling
+
Operational Data
+
AI

That's why I would prioritize Tool Calling before RAG. It aligns much more closely with your background in orders, inventory, suppliers, customers, and operational platforms, and it becomes the foundation for the AI Operations Copilot you'll build next.