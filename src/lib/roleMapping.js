export const RoleMapping = {
  ADMIN: ["SECRETARY", "KAGAWAD", "SK_CHAIR"],
  STAFF: ["CLERK", "TANOD"],
};

export function getDashboardRoleFor(hierarchyRole) {
  for (const [dashboardRole, roles] of Object.entries(RoleMapping)) {
    if (roles.includes(hierarchyRole)) return dashboardRole;
  }
  return null;
}
