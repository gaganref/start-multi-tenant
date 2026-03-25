import type { VercelConfig } from "@vercel/config/v1"

export const config: VercelConfig = {
  installCommand: "pnpm install --frozen-lockfile",
  buildCommand: "pnpm run build",
  devCommand: "pnpm dev",
  fluid: true,
}
