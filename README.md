# EarnPouch

EarnPouch is a Next.js 15 editorial site with markdown-backed articles, legal pages, SEO metadata, and a token-protected publishing form. 

## Run locally

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local` and set the required values.
3. Run `npm run dev` and visit `http://localhost:3000`.

Required local and Vercel env vars:

- `ADMIN_USERNAME` — admin login username
- `ADMIN_PASSWORD` — admin login password
- `ADMIN_SESSION_SECRET` — long random string used to sign the admin session cookie
- `PUBLISH_TOKEN` — unique random value of at least 24 characters used to authorize article publishing
- `NEXT_PUBLIC_GA_ID` — optional GA4 measurement ID
- `GITHUB_CONTENT_TOKEN` and `GITHUB_REPOSITORY` — optional GitHub storage settings for server-side publishing instead of the local filesystem
- `GITHUB_BRANCH` — optional GitHub branch name, defaults to `main`

On PowerShell, a secure token can be generated with `[Convert]::ToHexString([Security.Cryptography.RandomNumberGenerator]::GetBytes(32))`.

## Vercel deployment

In the Vercel dashboard, open the project, then go to Settings → Environment Variables and add the same values used in `.env.local`.

Recommended production variables:

```bash
ADMIN_USERNAME=your-admin-username
ADMIN_PASSWORD=your-strong-password
ADMIN_SESSION_SECRET=generate-a-long-random-string
PUBLISH_TOKEN=generate-a-long-random-string
NEXT_PUBLIC_GA_ID=
GITHUB_CONTENT_TOKEN=
GITHUB_REPOSITORY=
GITHUB_BRANCH=main
```

If you use GitHub-backed content storage, leave `GITHUB_CONTENT_TOKEN` and `GITHUB_REPOSITORY` set. Otherwise the admin panel will save posts to the local filesystem at `content/posts/*.md`.

## Content publishing

Visit `/admin`, complete the article fields, and enter the same `PUBLISH_TOKEN` configured on the server. The API validates fields and writes frontmatter plus Markdown into `content/posts/[slug].md`. Posts with `published: false` are omitted from public pages and the sitemap.

This filesystem publisher is intended for local development or a persistent, writable Node.js host. Serverless platforms commonly use read-only or ephemeral deployments; for those, replace the write operation with a GitHub Contents API or a persistent CMS before enabling production publishing. Keep `PUBLISH_TOKEN` private and use HTTPS.

## Analytics and privacy

GA4 is loaded only after a visitor accepts optional analytics in the consent prompt. The choice is stored in browser local storage. Configure `NEXT_PUBLIC_GA_ID` with a GA4 measurement ID; leave it blank to omit analytics and its prompt.

## Checks

- `npm run lint`
- `npx tsc --noEmit`
- `npm run build`

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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
