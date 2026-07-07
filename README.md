# NURS 401 Quiz Bank

Static quiz-bank site for saved NURS 401 practice questions.

## Run locally

```sh
python3 -m http.server 4173 --directory .
```

Open `http://127.0.0.1:4173`.

## Update questions

Regenerate `data/questions.json` from the saved UWorld capture:

```sh
node scripts/import-nurs401-questions.js
```

The importer reads `school-assistant/captures/NURS401/2026-07-07-uworld-practice-quiz-1-answers.md`.

Rewrite the original generated course-practice questions while preserving captured questions:

```sh
node scripts/rewrite-generated-nurs401-questions.js
```
