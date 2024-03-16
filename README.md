# README

## Installation

To install the backend Python packages:

```bash
cd api && pip install -r requirements.txt && cd -
```

To install the frontend NPM packages:

```bash
cd frontend && npm install && cd -
```

## Backend

To run the backend server:

```bash
cd api
flask --app server run --debug
```

To lint the backend code:

```bash
python -m pylint *.py
```

To access the local backend server:

```plaintext
http://127.0.0.1:5000/api/ping
```

## Frontend

To run the frontend application:

```bash
cd frontend
npm run dev
```

To lint the frontend code:

```bash
npm run lint
```

To access the frontend application:

```plaintext
localhost:3000
```

## Misc

To save a Python package to `backend/requirements.txt`, use `pigar`: `pip install pigar` then `pigar generate`.

## Next.js README

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

### Getting Started

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

### Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
