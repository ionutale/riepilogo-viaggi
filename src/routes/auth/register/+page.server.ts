import { auth } from "$lib/server/auth";
import { fail } from "@sveltejs/kit";

export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const name = data.get("name") as string;
    const email = data.get("email") as string;
    const password = data.get("password") as string;

    if (!name || !email || !password) {
      return fail(400, { error: "All fields are required" });
    }
    if (password.length < 8) {
      return fail(400, { error: "Password must be at least 8 characters" });
    }

    try {
      await auth.api.signUpEmail({ body: { name, email, password } });
      return { success: true };
    } catch (e: any) {
      return fail(400, { error: e?.message || "Registration failed" });
    }
  },
};
