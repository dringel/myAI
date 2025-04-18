# 💼 IBMax — Your Investment Banking Recruiting Mentor

**Live Assistant**: https://my-ai-seven-zeta.vercel.app/

IBMax is a custom-built AI assistant designed to support students and early-career professionals breaking into the competitive field of **investment banking**. It provides mentorship across all major recruiting categories, including technical interviews, networking, behavioral preparation, and industry insights — personalized using Retrieval-Augmented Generation (RAG) with a high-quality document base.

---

## 🧠 What Can IBMax Do?

- 💬 **Answer questions** about investment banking careers, firm types, group differences, and recruitment timelines.
- 📄 **Give tailored advice** based on real-world technical guides, behavioral frameworks, and resume-building tips.
- 🧭 **Provide networking strategies** — from cold email templates to coffee chat best practices.
- 🧩 **Break down technical concepts** like DCF, comparables, LBO, and accounting.
- 🏛️ **Explain industry groups** (e.g., TMT, Healthcare, FIG) and their representative firms.
- 📬 **Summarize cover letter strategies** and deal experience walkthroughs.

---

## 🛠 Technologies Used

| Component | Description |
|----------|-------------|
| **Frontend** | Next.js (React) with custom UI modifications |
| **Backend Logic** | LLM (OpenAI) + RAG pipeline with Pinecone vector database |
| **Embedding Model** | `text-embedding-ada-002` for document vectorization |
| **LLM** | GPT-based model for response generation |
| **Deployment** | Vercel |
| **Data Loader** | RAGLoader for document ingestion and schema management |

---

## 📁 Customizations & Features

- ✅ **RAG-Enhanced Retrieval**: Documents are filtered based on user intention (e.g., technical, networking, behavioral) via intent detection logic using `IntentionModule` and metadata-aware Pinecone filtering.
- ✅ **Schema-Aware Document Ingestion**: Documents include custom metadata fields such as `category`, enabling focused retrieval based on query type.
- ✅ **Prompt Customization**: Dynamic prompt generation reflects user intention (e.g., tailoring answers if the user asks about networking or interviews).
- ✅ **UI Enhancements**:
  - 🧑‍🏫 Custom **headshot icon** and branding for IBMax
  - 📝 Refined **placeholder prompt**: “Type your question about investment banking here...”
  - 🪧 Personalized **header**: “Welcome to IBMax – Your Investment Banking Recruiting Mentor”
  - 📎 Footer branding: “IBMax: Your mentor to breaking into investment banking.”

---

## 🗂 Knowledge Base

IBMax’s knowledge base includes **dozens of hand-curated markdown files** derived from industry-standard sources such as:

- Mergers & Inquisitions
- Wall Street Oasis
- Breaking Into Wall Street (BIWS)
- Vault & firm guides
- Intern-to-analyst coaching notes
- Mock interview transcripts
- Group-specific breakdowns (e.g., TMT, Healthcare, Real Estate)
- Networking, cover letter, and resume resources

Each document is tagged by **intent category** (e.g., `technical`, `networking`, `behavioral`) for intent-aware retrieval.

---

## 🧪 How RAG Works in IBMax

1. User query → `IntentionModule` detects intent (e.g., "technical").
2. Query embedding → matched against Pinecone vector DB.
3. Matched chunks are **ranked by metadata category**.
4. Prompt is generated using top-ranked sources and passed to OpenAI.
5. Answer is returned with citations and injected into a conversational UI.

---

## 📎 Repository Structure Highlights

