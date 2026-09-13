export const MAINTENANCE_COOKIE = "maintenance_bypass"

export function isMaintenanceEnabled() {
  return process.env.MAINTENANCE_MODE === "true"
}

export function getMaintenanceBypassSecret() {
  return process.env.MAINTENANCE_BYPASS_SECRET?.trim() || ""
}
