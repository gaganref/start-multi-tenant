import { useMemo, useState } from "react"
import { useLocation, useRouterState } from "@tanstack/react-router"
import { HugeiconsIcon } from "@hugeicons/react"
import { cn } from "@/lib/utils"
import { useMultiTenantDevtoolsSnapshot } from "@/lib/devtools/multi-tenant-devtools-store"
import { IMPORTANT_HEADERS, TABS, type TabId } from "./devtools-constants"
import { StatusPill } from "./devtools-primitives"
import {
  TenantTab,
  LocationTab,
  RoutesTab,
  HeadersTab,
} from "./devtools-tabs"

export function MultiTenantDevtoolsPanel() {
  const [activeTab, setActiveTab] = useState<TabId>("tenant")
  const location = useLocation()
  const matches = useRouterState({
    select: (state) =>
      state.matches.map((match) => ({
        routeId: match.routeId,
        params: match.params,
      })),
  })
  const { requestDebug, resolvedTenant } = useMultiTenantDevtoolsSnapshot()
  const browserInfo =
    typeof window === "undefined"
      ? null
      : {
          href: window.location.href,
          host: window.location.host,
          hostname: window.location.hostname,
        }

  const headers = useMemo(
    () =>
      Object.entries(requestDebug?.headers ?? {}).sort(([a], [b]) =>
        a.localeCompare(b)
      ),
    [requestDebug]
  )

  const importantHeaders = headers.filter(([key]) =>
    IMPORTANT_HEADERS.has(key.toLowerCase())
  )

  const hasRewrite = location.href !== location.publicHref
  const hasTenant = !!resolvedTenant
  const isActive = resolvedTenant?.status === "active"

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#0c0c0e] font-sans text-xs text-[#e4e4e7]">
      {/* Toolbar */}
      <div className="flex h-8 shrink-0 items-center justify-between gap-2 border-b border-white/6 bg-linear-to-b from-white/2.5 to-transparent px-2 pr-2.5">
        <div className="flex min-w-0 items-center gap-1.5">
          <DevtoolsMark />
          <div className="flex items-center">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "inline-flex cursor-pointer items-center gap-1 border-b-2 border-transparent px-2 py-1.5 text-[11px] font-medium text-[#71717a] transition-colors",
                  activeTab === tab.id && "border-blue-500 text-[#e4e4e7]"
                )}
              >
                <HugeiconsIcon
                  icon={tab.icon}
                  size={12}
                  className={cn(
                    "opacity-45",
                    activeTab === tab.id && "opacity-100"
                  )}
                />
                {tab.label}
                {tab.id === "headers" && headers.length > 0 && (
                  <span className="rounded-full bg-white/8 px-1 text-[9px] font-semibold leading-3.5 text-[#a1a1aa]">
                    {headers.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <StatusPill
            active={hasTenant}
            label={hasTenant ? resolvedTenant.tenantName : "No tenant"}
            color={hasTenant ? (isActive ? "green" : "amber") : "neutral"}
          />
          <StatusPill
            active={hasRewrite}
            label={hasRewrite ? "Rewrite" : "Direct"}
            color={hasRewrite ? "blue" : "neutral"}
          />
        </div>
      </div>

      {/* Content */}
      <div className="min-h-0 flex-1 overflow-auto">
        {activeTab === "tenant" && (
          <TenantTab
            resolvedTenant={resolvedTenant}
            requestDebug={requestDebug}
          />
        )}
        {activeTab === "location" && (
          <LocationTab
            browserInfo={browserInfo}
            location={location}
            hasRewrite={hasRewrite}
          />
        )}
        {activeTab === "routes" && <RoutesTab matches={matches} />}
        {activeTab === "headers" && (
          <HeadersTab
            headers={headers}
            importantHeaders={importantHeaders}
          />
        )}
      </div>
    </div>
  )
}

function DevtoolsMark() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 48 48"
      fill="none"
      className="shrink-0"
    >
      <rect width="48" height="48" rx="12" fill="#4F46E5" />
      <g fillRule="evenodd" clipRule="evenodd">
        <path
          opacity="0.45"
          d="M34.94 12.3l-7.265-1.946c-.501-.135-.907.177-.907.696v7.521c0 .52.406 1.05.907 1.184l7.266 1.947c.501.134.908-.177.908-.696v-7.522c0-.519-.407-1.05-.908-1.184zm-7.265-4.767c-2.006-.537-3.632.71-3.632 2.787v7.522c0 2.077 1.626 4.197 3.632 4.734l7.266 1.947c2.006.537 3.632-.71 3.632-2.787v-7.522c0-2.077-1.626-4.197-3.632-4.734l-7.266-1.947z"
          fill="white"
        />
        <path
          opacity="0.65"
          d="M29.235 18.428l-9.081-2.433c-.501-.135-.908.177-.908.696v9.402c0 .519.407 1.049.908 1.184l9.081 2.433c.502.135.908-.176.908-.696v-9.402c0-.519-.406-1.049-.908-1.184zm-9.081-5.254c-2.006-.537-3.633.71-3.633 2.788v9.401c0 2.078 1.627 4.197 3.633 4.734l9.081 2.434c2.006.537 3.633-.71 3.633-2.788v-9.401c0-2.078-1.627-4.198-3.633-4.734l-9.081-2.434z"
          fill="white"
        />
        <path
          d="M23.53 24.556l-10.898-2.92c-.5-.135-.907.176-.907.696v11.282c0 .519.406 1.049.908 1.184l10.897 2.92c.501.134.908-.177.908-.697V25.74c0-.52-.407-1.05-.908-1.184zm-10.898-5.741c-2.006-.537-3.632.71-3.632 2.788v11.282c0 2.077 1.626 4.197 3.632 4.734l10.898 2.92c2.006.537 3.632-.71 3.632-2.788V26.47c0-2.078-1.626-4.198-3.632-4.734l-10.898-2.92z"
          fill="white"
        />
      </g>
    </svg>
  )
}
