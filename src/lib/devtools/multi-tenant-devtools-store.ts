import { useSyncExternalStore } from "react"
import type { ResolvedTenantContext } from "@/lib/tenant/mock-tenant-context"
import type { RequestDebugInfo } from "@/lib/tenant/request-debug-info"

type MultiTenantDevtoolsSnapshot = {
  resolvedTenant: ResolvedTenantContext | null
  requestDebug: RequestDebugInfo | null
}

let snapshot: MultiTenantDevtoolsSnapshot = {
  resolvedTenant: null,
  requestDebug: null,
}

const listeners = new Set<() => void>()

function emitChange() {
  for (const listener of listeners) {
    listener()
  }
}

export function setMultiTenantDevtoolsSnapshot(
  nextSnapshot: MultiTenantDevtoolsSnapshot
) {
  snapshot = nextSnapshot
  emitChange()
}

export function clearMultiTenantDevtoolsSnapshot() {
  snapshot = {
    resolvedTenant: null,
    requestDebug: null,
  }
  emitChange()
}

function subscribe(listener: () => void) {
  listeners.add(listener)

  return () => {
    listeners.delete(listener)
  }
}

export function useMultiTenantDevtoolsSnapshot() {
  return useSyncExternalStore(subscribe, () => snapshot, () => snapshot)
}
