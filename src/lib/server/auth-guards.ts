import { redirect } from "@sveltejs/kit";

export function requireAuth(event: App.Locals) {
  if (!event.user) redirect(303, "/auth/login");
}

export function requireSuperadmin(event: App.Locals) {
  requireAuth(event);
  const user = event.user as any;
  if (!user?.superadmin) redirect(303, "/");
}

export function requireCompanyAccess(
  event: App.Locals,
  companyId?: string,
) {
  requireAuth(event);
  const targetId = companyId ?? event.activeCompanyId;
  if (!targetId) redirect(303, "/");

  const user = event.user as any;
  const isSuperadmin = user?.superadmin;
  if (!isSuperadmin) {
    const session = (event as any)?.session;
    if (session?.activeOrganizationId !== targetId) redirect(303, "/");
  }
}
