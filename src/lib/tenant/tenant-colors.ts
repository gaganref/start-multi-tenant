export type TenantAccent = "blue" | "amber" | "violet"

const slugToAccent: Record<string, TenantAccent> = {
  acme: "blue",
  globex: "amber",
  desapps: "violet",
}

export function getTenantAccent(slug: string): TenantAccent {
  return slugToAccent[slug] ?? "blue"
}

export const accentLabel: Record<TenantAccent, string> = {
  blue: "Radix Blue",
  amber: "Radix Amber",
  violet: "Radix Violet",
}
