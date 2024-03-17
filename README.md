# README

## Installation & Setup

To install the backend Python packages:

```bash
cd api && pip install -r requirements.txt && cd -
```

To install the frontend NPM packages:

```bash
npm install
```

You will need a `.env.local` in the root directory and a `.env` in the `api/` folder with the relevant Supabase environment variables in each file.

## Local Development

To start the frontend and backend locally together, simply run `npm run dev`. Ctrl+C will kill both processes.

### Backend

To run the local backend server individually: `npm run flask-dev`.

To lint the backend code: `python -m pylint *.py`.

To access the local backend server: `http://127.0.0.1:5328/api/ping`.

However, Next.js redirects API calls to the web app to the Python backend server, so the API is also accessible at: `http://localhost:3000/api/ping`. This is configured at `next.config.mjs`.

### Frontend

To run the local frontend application individually: `npm run next-dev`.

To lint the frontend code: `npm run lint`.

To access the local frontend application: `localhost:3000`.

## Misc

To save a Python package to `api/requirements.txt`, use `pigar`: `pip install pigar` then `pigar generate`. Do not use `pip freeze`.

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

<!-- 
## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details. -->
