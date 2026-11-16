"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Role = "manager" | "photographer" | "videographer" | "editor";
type EventRow = {
  id: string;
  event_name: string;
  event_date: string;
  start_time: string | null;
  end_time: string | null;
  venue: string | null;
};
type Assignment = {
  id: string;
  event_id: string;
  assignment_role: string | null;
  status: string;
};

export default function StaffWorkspace() {
  const router = useRouter();
  const [role, setRole] = useState<Role | null>(null);
  const [name, setName] = useState("");
  const [events, setEvents] = useState<EventRow[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [customers, setCustomers] = useState<{id:string;full_name:string;mobile:string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadWorkspace = useCallback(async () => {
    setLoading(true);
    setError("");
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      router.replace("/admin/login");
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("full_name,role")
      .eq("id", userData.user.id)
      .maybeSingle();

    if (profileError || !profile || !["manager","photographer","videographer","editor"].includes(profile.role)) {
      setError("This account does not have access to the staff workspace.");
      setLoading(false);
      return;
    }

    setRole(profile.role as Role);
    setName(profile.full_name);

    if (profile.role === "manager") {
      const [eventResult, customerResult] = await Promise.all([
        supabase.from("events").select("id,event_name,event_date,start_time,end_time,venue").order("event_date"),
        supabase.from("customers").select("id,full_name,mobile").order("full_name"),
      ]);
      if (eventResult.error) setError(eventResult.error.message);
      else setEvents((eventResult.data ?? []) as EventRow[]);
      if (customerResult.error) setError((current) => current || customerResult.error!.message);
      else setCustomers(customerResult.data ?? []);
      setAssignments([]);
    } else {
      const { data: assignmentRows, error: assignmentError } = await supabase
        .from("staff_assignments")
        .select("id,event_id,assignment_role,status")
        .eq("staff_id", userData.user.id)
        .neq("status", "cancelled");
      if (assignmentError) {
        setError(assignmentError.message);
        setLoading(false);
        return;
      }
      const rows = (assignmentRows ?? []) as Assignment[];
      setAssignments(rows);
      const eventIds = [...new Set(rows.map((row) => row.event_id))];
      if (eventIds.length) {
        const { data: eventRows, error: eventError } = await supabase
          .from("events")
          .select("id,event_name,event_date,start_time,end_time,venue")
          .in("id", eventIds)
          .order("event_date");
        if (eventError) setError(eventError.message);
        else setEvents((eventRows ?? []) as EventRow[]);
      } else {
        setEvents([]);
      }
      setCustomers([]);
    }
    setLoading(false);
  }, [router]);

  useEffect(() => { void loadWorkspace(); }, [loadWorkspace]);

  async function logout() {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  const roleLabel = role ? role.charAt(0).toUpperCase() + role.slice(1) : "Staff";

  return (
    <main className="min-h-screen bg-[#f6f4ef] text-[#22231f]">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e6e1d8] bg-[#fbfaf7] px-5 py-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[.22em] text-[#8b7658]">Chirag Photography</p>
          <h1 className="mt-1 font-serif text-3xl">Staff Workspace</h1>
        </div>
        <button onClick={logout} className="border border-[#d8cdbb] px-4 py-2 text-xs">Log out</button>
      </header>
      <div className="mx-auto max-w-6xl px-5 py-8">
        <div className="mb-6 border border-[#e6e1d8] bg-white p-5">
          <p className="text-sm text-[#827c72]">Welcome, {name || "team member"}</p>
          <p className="mt-1 text-lg font-medium">{roleLabel} access</p>
          <p className="mt-2 text-xs text-[#827c72]">
            {role === "manager" ? "Operational view only. Financial records and payment information are not available in this workspace." : "Only events assigned to your staff account are shown."}
          </p>
        </div>

        {error && <div className="mb-5 border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
        {loading ? <div className="bg-white p-6 text-sm">Loading your workspace…</div> : (
          <>
            {role === "manager" && (
              <section className="mb-6 border border-[#e6e1d8] bg-white p-5">
                <h2 className="font-serif text-2xl">Customers</h2>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead><tr className="border-b text-[#827c72]"><th className="p-3">Name</th><th className="p-3">Mobile</th></tr></thead>
                    <tbody>{customers.map((customer) => <tr key={customer.id} className="border-b"><td className="p-3">{customer.full_name}</td><td className="p-3">{customer.mobile}</td></tr>)}</tbody>
                  </table>
                  {!customers.length && <p className="p-3 text-sm text-[#827c72]">No customers found.</p>}
                </div>
              </section>
            )}
            <section className="border border-[#e6e1d8] bg-white p-5">
              <h2 className="font-serif text-2xl">{role === "manager" ? "Studio Events" : "My Assigned Events"}</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {events.map((event) => {
                  const assignment = assignments.find((item) => item.event_id === event.id);
                  return <article key={event.id} className="border border-[#e6e1d8] p-4">
                    <h3 className="font-medium">{event.event_name}</h3>
                    <p className="mt-2 text-sm text-[#625f58]">{event.event_date} · {event.start_time || "Time not set"}{event.end_time ? `–${event.end_time}` : ""}</p>
                    <p className="mt-1 text-sm text-[#827c72]">{event.venue || "Venue not added"}</p>
                    {assignment && <p className="mt-3 text-xs text-[#8b7658]">{assignment.assignment_role || roleLabel} · {assignment.status}</p>}
                  </article>;
                })}
              </div>
              {!events.length && <p className="mt-4 text-sm text-[#827c72]">No events are currently assigned or available.</p>}
            </section>
          </>
        )}
        <button onClick={() => void loadWorkspace()} className="mt-5 border border-[#d8d1c6] px-4 py-3 text-xs">Refresh workspace</button>
      </div>
    </main>
  );
}
