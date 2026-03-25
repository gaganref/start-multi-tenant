# TanStack Start + shadcn/ui

This is a template for a new TanStack Start project with React, TypeScript, and shadcn/ui.

## Adding components

To add components to your app, run the following command:

```bash
npx shadcn@latest add button
```

This will place the ui components in the `components` directory.

## Using components

To use the components in your app, import them as follows:

```tsx
import { Button } from "@/components/ui/button";
```

## Vercel deployment

This app is configured for Vercel with `vercel.ts` and a dedicated Vercel build:

```bash
pnpm run build:vercel
```

What it does:

- runs TypeScript type-checking before build
- forces Nitro's `vercel` preset only for Vercel-targeted builds
- lets local `pnpm build` continue using the default Nitro output

Useful commands:

```bash
pnpm run build
pnpm run build:vercel
pnpm run start
```
