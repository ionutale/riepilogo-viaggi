import { fail, redirect } from "@sveltejs/kit";

export const actions = {
  default: async ({ request, cookies }) => {
    const data = await request.formData();
    const email = data.get("email") as string;
    const password = data.get("password") as string;

    if (!email || !password) {
      return fail(400, { error: "Email and password are required" });
    }

    const res = await fetch(new URL("/api/auth/sign-in/email", request.url).toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      return fail(401, { error: "Invalid email or password" });
    }

    // Forward session cookies from Better Auth
    const setCookies = res.headers.getSetCookie?.();
    if (setCookies) {
      for (const cookie of setCookies) {
        const [nv] = cookie.split(";");
        const [n, ...v] = nv.split("=");
        cookies.set(n, v.join("="), { path: "/", httpOnly: true, sameSite: "lax" });
      }
    }

    redirect(303, "/");
  },
};
