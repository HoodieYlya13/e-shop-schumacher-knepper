## Navigate to [Creator's recommendations](#creators-recommendations)

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, add PUBLIC_STORE_DOMAIN, PUBLIC_STOREFRONT_API_TOKEN, PRIVATE_STOREFRONT_API_TOKEN, SHOPIFY_ADMIN_API_ACCESS_TOKEN and SHOPIFY_API_VERSION inside .env.local.

Then, run the development server:

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

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Creator's Recommendations

**IF THE DOMAIN CHANGES OR THIS TEMPLATE IS REUSED**

You must modify the **redirection-theme** after importing it into Shopify for production.

Replace all instances of `http://localhost:3000` with your actual app URL inside `theme.liquid` and `header.liquid`.

Still on Shopify, go to "Edit Customer account password reset" and replace `{{ customer.reset_password_url }}` with `shop.website.com/auth?reset_password_url={{ customer.reset_password_url }}`.

### Recommended Subdomain Architecture

- `website.com` — Main website
- `shop.website.com` — Next.js commerce app (this app)
- `checkout.website.com` — Shopify default store using **redirection-theme**  
  Used **only** for checkout, while other routes redirect to `shop.website.com`

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
