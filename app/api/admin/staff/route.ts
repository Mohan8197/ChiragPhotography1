import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const allowedRoles = ["photographer", "videographer", "editor", "manager", "admin"] as const;
type StaffRole = (typeof allowedRoles)[number];

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: NextRequest) {
  const authorization = request.headers.get("authorization");
  const accessToken = authorization?.startsWith("Bearer ")
    ? authorization.slice(7)
    : "";

  if (!accessToken) return jsonError("You must be signed in.", 401);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !publishableKey || !serviceRoleKey) {
    return jsonError("Staff account service is not configured on the server.", 500);
  }

  const authClient = createClient(supabaseUrl, publishableKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: userData, error: userError } = await authClient.auth.getUser(accessToken);
  if (userError || !userData.user) return jsonError("Your session is invalid. Please sign in again.", 401);

  const { data: callerProfile, error: callerProfileError } = await adminClient
    .from("profiles")
    .select("role")
    .eq("id", userData.user.id)
    .maybeSingle();

  if (callerProfileError) return jsonError("Unable to verify your studio role.", 500);
  if (!callerProfile || !["owner", "admin"].includes(callerProfile.role)) {
    return jsonError("Only Owner or Admin can create staff accounts.", 403);
  }

  let body: { fullName?: string; email?: string; mobile?: string; password?: string; role?: string };
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid request body.", 400);
  }

  const fullName = body.fullName?.trim() ?? "";
  const email = body.email?.trim().toLowerCase() ?? "";
  const mobile = body.mobile?.trim() ?? "";
  const password = body.password ?? "";
  const role = body.role ?? "";

  if (!fullName || !email || !password || !allowedRoles.includes(role as StaffRole)) {
    return jsonError("Name, email, temporary password and a valid staff role are required.", 400);
  }
  if (password.length < 10) return jsonError("Temporary password must be at least 10 characters.", 400);
  if (password.length > 72) return jsonError("Temporary password is too long.", 400);

  const { data: created, error: createError } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });

  if (createError || !created.user) {
    return jsonError(createError?.message ?? "Could not create the authentication account.", 400);
  }

  const { error: profileError } = await adminClient.from("profiles").insert({
    id: created.user.id,
    full_name: fullName,
    mobile: mobile || null,
    role,
    customer_id: null,
  });

  if (profileError) {
    await adminClient.auth.admin.deleteUser(created.user.id);
    return jsonError(`Profile creation failed; the new login was rolled back. ${profileError.message}`, 400);
  }

  return NextResponse.json({
    success: true,
    staff: { id: created.user.id, full_name: fullName, email, mobile: mobile || null, role },
  });
}
