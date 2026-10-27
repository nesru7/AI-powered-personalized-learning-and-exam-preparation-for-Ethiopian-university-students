# EthioLearn AI

EthioLearn AI is a personalized learning and exam-preparation platform for Ethiopian university students. It combines a university-focused course library, practice exams, spaced-repetition flashcards, progress tracking, and an AI tutor.

## Tech stack

- Next.js 14 App Router, React 18, and TypeScript
- PostgreSQL and Prisma
- NextAuth v4 credentials and optional Google sign-in
- Tailwind CSS and Radix UI
- OpenAI chat completions for tutor and content generation

## Requirements

- Node.js 22.13 or newer
- PostgreSQL 14 or newer, or Docker Desktop
- An OpenAI API key for AI tutoring and AI-generated content

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local` and set `DATABASE_URL` and `NEXTAUTH_SECRET`. Set `OPENAI_API_KEY` for AI features. Google OAuth values are optional.

3. Start PostgreSQL. With Docker Compose:

   ```bash
   docker compose up -d
   ```

4. Create/update the database and populate sample data:

   ```bash
   npx prisma db push
   npm run db:seed
   ```

5. Start the application:

   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000).

Administrators can upload text-based `.pdf` or `.pptx` course files from **Course materials → Manage materials**. The application extracts and stores up to 80,000 characters of readable text per file. Enrolled students can select a material in **AI tutor** to ask source-grounded questions, or generate five practice questions from a material in **Course materials**. AI features require `OPENAI_API_KEY`; selected material text is sent to the configured OpenAI API to answer questions and generate practice questions, so only upload content approved for that use. Scanned/image-only PDFs without selectable text are not supported for AI reading.

## Demo accounts

| Role | Email | Password |
| --- | --- | --- |
| Student | `student1@aau.edu.et` | `password123` |
| Student | `student2@ju.edu.et` | `password123` |
| Admin | `admin@platform.et` | `admin123` |

Use these accounts only with a local development database.

## Features

- Student registration, credentials login, and optional Google OAuth
- Course browsing, course details, and enrollment
- Admin PDF and PowerPoint uploads, AI tutoring grounded in course materials, and AI-generated practice questions for enrolled students
- Subject-based practice exams with scoring and explanations
- Flashcard decks with spaced-repetition review scheduling
- Progress summaries, course completion, and study-time charts
- AI tutor chat grounded in uploaded course materials and AI-generated questions from PDFs and PowerPoint presentations
- AI-generated exam questions and flashcards
- Responsive dashboard and light/dark theme

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection URL |
| `NEXTAUTH_URL` | Yes for deployment | Canonical application URL |
| `NEXTAUTH_SECRET` | Yes | Secret used to sign authentication tokens |
| `OPENAI_API_KEY` | For AI features | OpenAI API key |
| `GOOGLE_CLIENT_ID` | Optional | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Optional | Google OAuth client secret |
| `MATERIALS_STORAGE_DIR` | Optional | Directory for uploaded course materials (PDFs and PowerPoint presentations); defaults to `storage/materials` |

Uploaded course material files are stored outside the public web root. In a single-server deployment, ensure the configured storage directory is persistent and backed up. Serverless or multi-instance deployments should use shared object storage instead of local disk.

## Production notes

Deploy the Next.js application to Vercel or another Node.js host and use a managed PostgreSQL provider such as Neon. Configure environment variables in the hosting provider, run Prisma schema deployment as part of release operations, and never use the demo credentials in production.
