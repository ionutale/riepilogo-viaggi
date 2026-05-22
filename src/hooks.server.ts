import { auth } from "$lib/server/auth";
import { svelteKitHandler } from "better-auth/svelte-kit";
import { building } from "$app/environment";

const publicPaths = ["/auth/login", "/auth/register", "/auth/accept-invitation", "/admin/setup"];

export async function handle({ event, resolve }) {
  const response = await svelteKitHandler({ event, resolve, auth, building });

  if (response) return response;

  const session = await auth.api.getSession({ headers: event.request.headers });
  const path = event.url.pathname;

  if (!session && !publicPaths.some((p) => path.startsWith(p)) && path !== "/admin/setup") {
    return Response.redirect(`${event.url.origin}/auth/login`, 303);
  }

  if (session) {
    event.locals.user = session.user as any;
    event.locals.session = session.session;

    const activeCompanyId = event.cookies.get("active_company_id");
    const sessionUser = session.user as any;
    if (activeCompanyId) {
      const isMember = session.session.activeOrganizationId === activeCompanyId ||
        sessionUser?.superadmin;
      if (isMember) {
        event.locals.activeCompanyId = activeCompanyId;
      }
    }
  }

  return await resolve(event);
}
