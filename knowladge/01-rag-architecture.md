# 01 — How the Knowledge Assistant Works (Plain English)

> Project P1-1 — an app that reads your company documents and answers questions
> about them, always showing which document the answer came from.
> Date: 2026-06-22.

---

## What we're building

Think of a smart assistant that has **read all your company's documents**. You ask it a
question in plain language, it answers, and it **tells you which document it got the
answer from** — so you can trust it. It runs on a website anyone can open, no login needed.

The whole approach has a name: **RAG** (*Retrieval-Augmented Generation*) — the AI
*retrieves* relevant pages first, then *generates* an answer from them.

---

## The big idea: it's an open-book exam

The assistant doesn't memorize your documents. Instead, every time you ask a question,
it quickly **looks up the few most relevant pages** and reads them before answering —
like a student doing an open-book exam. This is why it can cite sources and rarely makes
things up.

To do this fast, we prepare the documents ahead of time (like adding tabs and an index to
a textbook), then look things up live when someone asks.

---

## Step 1 — Preparing the documents (done once, in advance)

```
A document (PDF or text)
  → 1. Read the text out of it
  → 2. Cut it into small bite-sized pieces
  → 3. Turn each piece into a "meaning fingerprint" (a list of numbers)
  → 4. File those pieces away in a searchable library
```

- **Cut into pieces** (techie term: *chunking*) — a whole document is too big to read at
  once, so we slice it into paragraph-sized chunks. Pieces slightly overlap (*overlap*) so
  we don't cut a sentence in half and lose the meaning.
- **Meaning fingerprint** (techie term: *embedding*) — a computer can't compare text by
  "what it means" directly, so we convert each piece into a row of numbers that captures
  its meaning. Pieces about similar topics get similar numbers.
- **Searchable library** (techie term: *vector database* / *pgvector*) — we store the text,
  its fingerprint, and where it came from (which file, which page) so every answer can
  point back to a source.

We need at least **20 documents** loaded in before the assistant is useful.

---

## Step 2 — Answering a question (happens live, every time)

```
You type a question
  → 1. Turn your question into a "meaning fingerprint" too
  → 2. Find the handful of document pieces whose fingerprints are most similar
  → 3. Hand those pieces + your question to the AI
  → 4. The AI writes an answer using only those pieces, and names its sources
  → 5. The answer appears word-by-word on screen as it's written
```

The key trick in step 2 (techie term: *vector similarity search*): because both your
question and the documents are "fingerprints" (numbers), the computer can instantly find
the pieces that **mean** the same thing as your question — even if they don't use the
exact same words.

The "word-by-word on screen" part (step 5, techie term: *streaming*) is just so it feels
fast and alive, like watching someone type, instead of waiting and getting a wall of text.

---

## The pieces involved (and why each is here)

- **The website** (*Next.js*) — the screen you type into and the behind-the-scenes worker
  that handles your question.
- **The AI toolkit** (*Vercel AI SDK*) — the glue that talks to the AI and streams answers
  to your screen.
- **The AI itself** (*LLM*) — reads the relevant pieces and writes the answer.
- **The searchable library** (*Postgres + pgvector*) — stores document pieces and finds the
  relevant ones fast.
- **The document reader** (*PDF parser*) — pulls plain text out of PDF files.
- **Hosting** (*Vercel*) — puts the whole thing online at a public web address.

```
   Documents ─► reader ─► cut up ─► fingerprints ─► stored in library
                                                          │
   You ─► ask question ─► website ─► find matching pieces ─┘
                              │
                              └─► AI writes answer + sources ─► back to your screen
```

---

## Order we'll build it in

1. Set up the searchable library (the database).
2. Load the documents into it (read → cut up → fingerprint → store).
3. Build the part that answers a question (find pieces → ask AI).
4. Build the chat screen you type into.
5. Put it online so anyone can try it.

---

## Decisions we've made (and the trade-offs)

Plain-language record of the choices, so anyone can see *why* we did it this way.

- **D1 — Where to store documents.** Picked: one general-purpose database (Postgres) that
  can also search by meaning. Why: keeps everything in one place and we reuse it for the
  next project. Gave up: a specialized tool would be faster at massive scale, but we're
  nowhere near that. **Settled. ✅**
- **D2 — How we connect to the AI.** Picked: a single gateway that lets us swap AI providers
  easily. Why: one bill, easy to switch. Gave up: adds a tiny extra step. **Open.**
- **D3 — Which AI does the "fingerprinting".** To be decided when we start building.
  Whatever we pick, we must use the *same* one for documents and questions, or the lookups
  won't work. **Open.**
- **D4 — How big to slice documents.** Picked: paragraph-sized, with slight overlap. Why:
  overlap avoids cutting ideas in half. Gave up: bigger slices are cheaper but make
  citations less precise. **Open.**
- **D5 — How we read PDFs.** Picked: a reader that works smoothly on our hosting. Why: some
  readers need extra setup that breaks online — we'll pick the hassle-free one. **Open.**
- **D6 — How we show sources.** Picked: every answer carries the file + page it came from,
  and we tell the AI to cite. Why: simple and meets the goal. Note: the AI might cite
  loosely at first — we tighten that in the next ticket (quality + guardrails). **Open.**
- **D7 — Putting it online.** Picked: public, no login on the demo. Why: the goal says
  anyone should be able to try it without signing up. **Settled. ✅**

---

## Still to figure out

- Which AI to use for the "fingerprinting" — this also decides a setting in the library.
- Speed tuning for the library — not needed at 20 documents, only if it gets slow later.
- **Where the sample documents come from** — we need a real set of ~20 docs before any of
  this works. This is the first practical blocker.

---

## Glossary — plain term → techie term

Quick lookup so a non-technical reader and a developer can talk about the same thing.

- **The whole approach** → *RAG (Retrieval-Augmented Generation)* — look up relevant pages,
  then write an answer from them.
- **Cut into bite-sized pieces** → *chunking* — slicing a document into paragraph-sized parts.
- **Slight overlap between pieces** → *overlap* — pieces share a bit of text so ideas aren't
  cut in half.
- **Meaning fingerprint** → *embedding* — a row of numbers capturing what a piece of text means.
- **Searchable library** → *vector database / pgvector* — storage that finds text by meaning,
  not exact words.
- **Find the matching pieces** → *vector similarity search* — matching the question's
  fingerprint to document fingerprints.
- **Word-by-word on screen** → *streaming* — the answer appears as it's written, not all at once.
- **The AI** → *LLM (Large Language Model)* — the model that reads pieces and writes the answer.
- **The website + worker** → *Next.js* — the web framework running the screen and the backend.
- **The glue to the AI** → *Vercel AI SDK* — library that talks to the AI and streams the reply.
- **Hosting** → *Vercel* — where the app lives online, at a public address.
