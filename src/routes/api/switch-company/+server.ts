import { json } from "@sveltejs/kit";

export async function POST({ request, cookies, locals }) {
  if (!locals.user) return json({ error: "Unauthorized" }, { status: 401 });

  const { companyId } = await request.json();
  if (!companyId) return json({ error: "companyId required" }, { status: 400 });

  cookies.set("active_company_id", companyId, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });

  return json({ success: true });
}
