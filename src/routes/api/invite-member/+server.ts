import { auth } from "$lib/server/auth";
import { json } from "@sveltejs/kit";

export async function POST({ request, locals }) {
  if (!locals.user) return json({ error: "Unauthorized" }, { status: 401 });

  const { email, role, organizationId } = await request.json();
  if (!email || !organizationId) {
    return json({ error: "email and organizationId required" }, { status: 400 });
  }

  try {
    await (auth.api as any).inviteMember({
      body: { email, role: role || "member", organizationId },
    });
    return json({ success: true });
  } catch (e: any) {
    return json({ error: e?.message || "Invitation failed" }, { status: 400 });
  }
}
