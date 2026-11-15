
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Customer = {
  id: string;
  full_name: string;
  mobile: string;
  email: string | null;
  address: string | null;
  notes: string | null;
};

type Project = {
  id: string;
  customer_id: string;
  project_name: string;
  event_type: string | null;
  package_name: string | null;
  total_amount: number;
  status: string;
  notes: string | null;
  customer_name?: string;
};

type StudioEvent = {
  id: string;
  project_id: string;
  event_name: string;
  event_date: string;
  start_time: string | null;
  end_time: string | null;
  venue: string | null;
  reporting_time: string | null;
  project_name?: string;
  customer_name?: string;
};

type Payment = {
  id: string;
  project_id: string;
  amount: number;
  payment_method: string | null;
  transaction_reference: string | null;
  payment_date: string | null;
  notes: string | null;
};

type Expense = {
  id: string;
  project_id: string | null;
  expense_name: string;
  amount: number;
  expense_date: string | null;
  notes: string | null;
};

type Profile = {
  id: string;
  full_name: string;
  mobile: string | null;
  role: string;
  customer_id: string | null;
};

type Assignment = {
  id: string;
  event_id: string;
  staff_id: string;
  assignment_role: string | null;
  payment_amount: number;
  status: string;
};

const nav = [
  ["Overview", "◫"],
  ["Customers", "♙"],
  ["Projects & events", "▣"],
  ["Enquiries", "✉"],
  ["Quotations", "▤"],
  ["Payments", "₹"],
  ["Expenses", "−"],
  ["Team & assignments", "♧"],
  ["Calendar", "▦"],
  ["Galleries", "▧"],
  ["Reports", "▥"],
  ["Settings", "⚙"],
];

const statuses = [
  "enquiry",
  "quoted",
  "confirmed",
  "in_progress",
  "completed",
  "cancelled",
];

const money = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n || 0);

const today = () => new Date().toISOString().slice(0, 10);

const inputClass =
  "mt-1 w-full border border-[#ded8ce] bg-white px-3 py-3 text-sm outline-none focus:border-[#8b7658]";

const buttonClass =
  "bg-[#292a25] px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white disabled:opacity-50";

export function AdminDashboard() {
  const router = useRouter();
  const [active, setActive] = useState("Overview");
  const [loading, setLoading] = useState(true);
  const [accessChecking, setAccessChecking] = useState(true);
  const [accessMessage, setAccessMessage] = useState("");
  const [error, setError] = useState("");

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [events, setEvents] = useState<StudioEvent[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

  const [customerForm, setCustomerForm] = useState(false);
  const [projectForm, setProjectForm] = useState(false);
  const [paymentForm, setPaymentForm] = useState(false);
  const [expenseForm, setExpenseForm] = useState(false);
  const [assignmentForm, setAssignmentForm] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [customerMobile, setCustomerMobile] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");

  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [projectName, setProjectName] = useState("");
  const [eventType, setEventType] = useState("Wedding");
  const [packageName, setPackageName] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [projectStatus, setProjectStatus] = useState("enquiry");
  const [projectNotes, setProjectNotes] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("");
  const [venue, setVenue] = useState("");

  const [paymentProject, setPaymentProject] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [paymentReference, setPaymentReference] = useState("");
  const [paymentDate, setPaymentDate] = useState(today());
  const [paymentNotes, setPaymentNotes] = useState("");

  const [expenseName, setExpenseName] = useState("");
  const [expenseProject, setExpenseProject] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseDate, setExpenseDate] = useState(today());
  const [expenseNotes, setExpenseNotes] = useState("");

  const [assignmentEvent, setAssignmentEvent] = useState("");
  const [assignmentStaff, setAssignmentStaff] = useState("");
  const [assignmentRole, setAssignmentRole] = useState("Photographer");
  const [assignmentPayment, setAssignmentPayment] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    const results = await Promise.all([
      supabase
        .from("customers")
        .select("id,full_name,mobile,email,address,notes")
        .order("created_at", { ascending: false }),
      supabase
        .from("projects")
        .select(
          "id,customer_id,project_name,event_type,package_name,total_amount,status,notes"
        )
        .order("created_at", { ascending: false }),
      supabase
        .from("events")
        .select(
          "id,project_id,event_name,event_date,start_time,end_time,venue,reporting_time"
        )
        .order("event_date", { ascending: true }),
      supabase
        .from("payments")
        .select(
          "id,project_id,amount,payment_method,transaction_reference,payment_date,notes"
        )
        .order("payment_date", { ascending: false }),
      supabase
        .from("expenses")
        .select("id,project_id,expense_name,amount,expense_date,notes")
        .order("expense_date", { ascending: false }),
      supabase
        .from("profiles")
        .select("id,full_name,mobile,role,customer_id")
        .order("full_name"),
      supabase
        .from("staff_assignments")
        .select(
          "id,event_id,staff_id,assignment_role,payment_amount,status"
        ),
    ]);

    const labels = [
      "Customers",
      "Projects",
      "Events",
      "Payments",
      "Expenses",
      "Profiles",
      "Staff assignments",
    ];

    const failed = results.find((r) => r.error);

    if (failed?.error) {
      const index = results.findIndex((r) => r === failed);
      setError(`${labels[index]}: ${failed.error.message}`);
    }

    const [
      customerResult,
      projectResult,
      eventResult,
      paymentResult,
      expenseResult,
      profileResult,
      assignmentResult,
    ] = results;

    const customerRows = (customerResult.data ?? []) as Customer[];
    const projectRows = (projectResult.data ?? []).map((p) => ({
      ...p,
      total_amount: Number(p.total_amount ?? 0),
      customer_name:
        customerRows.find((c) => c.id === p.customer_id)?.full_name ?? "",
    })) as Project[];

    setCustomers(customerRows);
    setProjects(projectRows);
    setEvents((eventResult.data ?? []) as StudioEvent[]);
    setPayments(
      (paymentResult.data ?? []).map((p) => ({
        ...p,
        amount: Number(p.amount ?? 0),
      })) as Payment[]
    );
    setExpenses(
      (expenseResult.data ?? []).map((e) => ({
        ...e,
        amount: Number(e.amount ?? 0),
      })) as Expense[]
    );
    setProfiles((profileResult.data ?? []) as Profile[]);
    setAssignments(
      (assignmentResult.data ?? []).map((a) => ({
        ...a,
        payment_amount: Number(a.payment_amount ?? 0),
      })) as Assignment[]
    );

    setLoading(false);
  }, []);

  useEffect(() => {
    let active = true;

    async function verifyAdminAccess() {
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError || !userData.user) {
        router.replace("/admin/login");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userData.user.id)
        .maybeSingle();

      if (profileError || !profile || !["owner", "admin"].includes(profile.role)) {
        await supabase.auth.signOut();
        if (active) {
          setAccessMessage("This account is not authorised to access the studio dashboard.");
          setAccessChecking(false);
        }
        return;
      }

      if (active) {
        setAccessChecking(false);
        loadData();
      }
    }

    verifyAdminAccess();

    return () => {
      active = false;
    };
  }, [loadData, router]);

  const receivedByProject = useMemo(() => {
    const map = new Map<string, number>();
    payments.forEach((p) =>
      map.set(p.project_id, (map.get(p.project_id) ?? 0) + p.amount)
    );
    return map;
  }, [payments]);

  const totalBooking = projects.reduce(
    (sum, p) => sum + p.total_amount,
    0
  );
  const totalReceived = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const outstanding = projects.reduce(
    (sum, p) =>
      sum + Math.max(p.total_amount - (receivedByProject.get(p.id) ?? 0), 0),
    0
  );
  const profit = totalReceived - totalExpenses;

  const projectFor = (id: string) =>
    projects.find((p) => p.id === id);

  const customerFor = (id: string) =>
    customers.find((c) => c.id === id);

  const eventFor = (id: string) =>
    events.find((e) => e.id === id);

  const staffFor = (id: string) =>
    profiles.find((p) => p.id === id);

  function resetForms() {
    setCustomerName("");
    setCustomerMobile("");
    setCustomerEmail("");
    setCustomerAddress("");
    setCustomerNotes("");
    setSelectedCustomer("");
    setProjectName("");
    setEventType("Wedding");
    setPackageName("");
    setTotalAmount("");
    setProjectStatus("enquiry");
    setProjectNotes("");
    setEventDate("");
    setStartTime("09:00");
    setEndTime("");
    setVenue("");
    setPaymentProject("");
    setPaymentAmount("");
    setPaymentMethod("UPI");
    setPaymentReference("");
    setPaymentDate(today());
    setPaymentNotes("");
    setExpenseName("");
    setExpenseProject("");
    setExpenseAmount("");
    setExpenseDate(today());
    setExpenseNotes("");
    setAssignmentEvent("");
    setAssignmentStaff("");
    setAssignmentRole("Photographer");
    setAssignmentPayment("");
  }

  async function saveCustomer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const { error } = await supabase.from("customers").insert({
      full_name: customerName.trim(),
      mobile: customerMobile.trim(),
      email: customerEmail.trim() || null,
      address: customerAddress.trim() || null,
      notes: customerNotes.trim() || null,
    });

    if (error) setError(error.message);
    else {
      setCustomerForm(false);
      resetForms();
      await loadData();
    }
    setSaving(false);
  }

  async function saveProject(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!selectedCustomer || !projectName.trim() || !eventDate) {
      setError("Choose a customer, enter a project name and event date.");
      return;
    }

    setSaving(true);
    setError("");

    const { data: project, error: projectError } = await supabase
      .from("projects")
      .insert({
        customer_id: selectedCustomer,
        project_name: projectName.trim(),
        event_type: eventType,
        package_name: packageName.trim() || null,
        total_amount: Number(totalAmount) || 0,
        status: projectStatus,
        notes: projectNotes.trim() || null,
      })
      .select("id")
      .single();

    if (projectError || !project) {
      setError(projectError?.message ?? "Project could not be saved.");
      setSaving(false);
      return;
    }

    const { error: eventError } = await supabase.from("events").insert({
      project_id: project.id,
      event_name: projectName.trim(),
      event_date: eventDate,
      start_time: startTime || null,
      end_time: endTime || null,
      venue: venue.trim() || null,
      reporting_time: startTime
        ? `${eventDate}T${startTime}:00`
        : null,
    });

    if (eventError) {
      setError(
        `Project saved, but event creation failed: ${eventError.message}. Do not submit again; check Projects first.`
      );
      setSaving(false);
      await loadData();
      return;
    }

    setProjectForm(false);
    resetForms();
    await loadData();
    setActive("Projects & events");
    setSaving(false);
  }

  async function savePayment(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const amount = Number(paymentAmount);
    const project = projectFor(paymentProject);

    if (!project || !Number.isFinite(amount) || amount <= 0) {
      setError("Select a booking and enter a valid payment amount.");
      return;
    }

    const balance =
      project.total_amount - (receivedByProject.get(project.id) ?? 0);

    if (amount > balance) {
      setError(`Payment exceeds the remaining balance of ${money(balance)}.`);
      return;
    }

    setSaving(true);
    setError("");

    const { error } = await supabase.from("payments").insert({
      project_id: paymentProject,
      amount,
      payment_method: paymentMethod,
      transaction_reference: paymentReference.trim() || null,
      payment_date: new Date(`${paymentDate}T12:00:00`).toISOString(),
      notes: paymentNotes.trim() || null,
    });

    if (error) setError(error.message);
    else {
      setPaymentForm(false);
      resetForms();
      await loadData();
    }
    setSaving(false);
  }

  async function saveExpense(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const amount = Number(expenseAmount);

    if (!expenseName.trim() || !Number.isFinite(amount) || amount <= 0) {
      setError("Enter an expense name and a valid amount.");
      return;
    }

    setSaving(true);
    setError("");

    const { error } = await supabase.from("expenses").insert({
      project_id: expenseProject || null,
      expense_name: expenseName.trim(),
      amount,
      expense_date: expenseDate || today(),
      notes: expenseNotes.trim() || null,
    });

    if (error) setError(error.message);
    else {
      setExpenseForm(false);
      resetForms();
      await loadData();
    }
    setSaving(false);
  }

  async function saveAssignment(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!assignmentEvent || !assignmentStaff) {
      setError("Choose an event and a staff member.");
      return;
    }

    setSaving(true);
    setError("");

    const { error } = await supabase.from("staff_assignments").insert({
      event_id: assignmentEvent,
      staff_id: assignmentStaff,
      assignment_role: assignmentRole,
      payment_amount: Number(assignmentPayment) || 0,
      status: "assigned",
    });

    if (error) setError(error.message);
    else {
      setAssignmentForm(false);
      resetForms();
      await loadData();
    }
    setSaving(false);
  }

  async function updateAssignmentStatus(
    id: string,
    status: string
  ) {
    setError("");
    const { error } = await supabase
      .from("staff_assignments")
      .update({ status })
      .eq("id", id);

    if (error) setError(error.message);
    else await loadData();
  }

  async function updateProjectStatus(id: string, status: string) {
    setError("");
    const { error } = await supabase
      .from("projects")
      .update({ status })
      .eq("id", id);

    if (error) setError(error.message);
    else await loadData();
  }

  const filteredCustomers = customers.filter((c) =>
    [c.full_name, c.mobile, c.email ?? ""]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const filteredProjects = projects.filter((p) =>
    [
      p.project_name,
      p.customer_name ?? "",
      p.event_type ?? "",
      p.status,
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const filteredPayments = payments.filter((p) => {
    const project = projectFor(p.project_id);
    return [
      project?.project_name ?? "",
      project?.customer_name ?? "",
      p.payment_method ?? "",
      p.transaction_reference ?? "",
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase());
  });

  const filteredExpenses = expenses.filter((e) =>
    [
      e.expense_name,
      e.notes ?? "",
      projectFor(e.project_id ?? "")?.project_name ?? "",
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const pageTitle =
    active === "Overview" ? "Studio Dashboard" : active;

  if (accessChecking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6f4ef] text-sm text-[#625f58]">
        Checking your studio access...
      </main>
    );
  }

  if (accessMessage) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f6f4ef] px-6 text-center text-[#292a25]">
        <h1 className="font-serif text-3xl">Access restricted</h1>
        <p className="max-w-md text-sm text-[#625f58]">{accessMessage}</p>
        <button
          type="button"
          onClick={() => router.replace("/admin/login")}
          className="bg-[#292a25] px-5 py-3 text-xs font-semibold uppercase tracking-wider text-white"
        >
          Return to login
        </button>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f4ef] text-[#22231f]">
      <header className="flex items-center justify-between border-b border-[#e6e1d8] bg-[#fbfaf7] px-5 py-3">
        <div className="text-[10px] font-semibold uppercase tracking-[.22em] text-[#8b7658]">
          Chirag Photography · Studio Management
        </div>
        <button
          type="button"
          onClick={async () => {
            await supabase.auth.signOut();
            router.replace("/admin/login");
          }}
          className="border border-[#d8cdbb] px-4 py-2 text-[10px] font-semibold uppercase tracking-[.16em] text-[#625f58] transition hover:bg-[#292a25] hover:text-white"
        >
          Log out
        </button>
      </header>

      <div className="mx-auto flex max-w-[1600px]">
        <aside className="hidden min-h-[calc(100vh-44px)] w-[250px] shrink-0 border-r border-[#e7e2d9] bg-[#f1eee8] px-5 py-7 lg:block">
          <div className="mb-10 px-2">
            <div className="font-serif text-[27px] leading-none">
              Chirag <span className="italic">Studio</span>
            </div>
            <div className="mt-2 text-[9px] uppercase tracking-[.24em] text-[#8a8378]">
              Photography management
            </div>
          </div>

          <div className="mb-3 px-3 text-[9px] font-bold uppercase tracking-[.2em] text-[#9b9388]">
            Workspace
          </div>

          <nav className="space-y-1">
            {nav.map(([label, icon]) => (
              <button
                key={label}
                onClick={() => {
                  setActive(label);
                  setSearch("");
                  setError("");
                }}
                className={`flex w-full items-center gap-3 rounded-sm px-3 py-3 text-left text-[12px] transition ${
                  active === label
                    ? "bg-[#292a25] text-white shadow-sm"
                    : "text-[#625f58] hover:bg-white/70"
                }`}
              >
                <span className="w-5 text-center text-[15px]">
                  {icon}
                </span>
                {label}
              </button>
            ))}
          </nav>

          <div className="mt-12 rounded-sm border border-[#dfd8cc] bg-[#f8f6f1] p-4">
            <div className="text-[9px] uppercase tracking-[.18em] text-[#8a8378]">
              Studio workspace
            </div>
            <p className="mt-2 font-serif text-[19px] leading-tight">
              Your studio, all in one place.
            </p>
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-5 py-7 sm:px-8 lg:px-10 lg:py-9">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="mb-2 text-[9px] uppercase tracking-[.24em] text-[#968b7b]">
                Chirag Photography / Workspace
              </div>
              <h1 className="font-serif text-[36px] leading-none sm:text-[44px]">
                {pageTitle}
              </h1>
              <p className="mt-2 text-[12px] text-[#827c72]">
                Manage your customers, bookings and studio operations.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {active === "Customers" && (
                <button
                  className={buttonClass}
                  onClick={() => setCustomerForm(true)}
                >
                  + Add Customer
                </button>
              )}
              {active === "Projects & events" && (
                <button
                  className={buttonClass}
                  onClick={() => setProjectForm(true)}
                >
                  + New Booking
                </button>
              )}
              {active === "Payments" && (
                <button
                  className={buttonClass}
                  onClick={() => setPaymentForm(true)}
                  disabled={!projects.length}
                >
                  + Record Payment
                </button>
              )}
              {active === "Expenses" && (
                <button
                  className={buttonClass}
                  onClick={() => setExpenseForm(true)}
                >
                  + Add Expense
                </button>
              )}
              {active === "Team & assignments" && (
                <button
                  className={buttonClass}
                  onClick={() => setAssignmentForm(true)}
                  disabled={!events.length || !profiles.length}
                >
                  + Assign Staff
                </button>
              )}
              <button
                className="border border-[#d8d1c6] px-4 py-3 text-xs"
                onClick={loadData}
              >
                Refresh
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-5 border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="border border-[#e6e1d8] bg-white p-8 text-sm text-[#827c72]">
              Loading studio records...
            </div>
          ) : (
            <>
              {active === "Overview" && (
                <>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {[
                      ["Customers", customers.length.toString()],
                      ["Projects", projects.length.toString()],
                      ["Booking value", money(totalBooking)],
                      ["Received", money(totalReceived)],
                      ["Outstanding", money(outstanding)],
                      ["Expenses", money(totalExpenses)],
                      ["Net cash position", money(profit)],
                      ["Upcoming events", events.filter((e) => e.event_date >= today()).length.toString()],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="border border-[#e6e1d8] bg-[#fbfaf7] p-5"
                      >
                        <div className="text-[10px] uppercase tracking-wider text-[#91897e]">
                          {label}
                        </div>
                        <div className="mt-3 break-words font-serif text-2xl">
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>

                  <section className="mt-8 border border-[#e6e1d8] bg-[#fbfaf7] p-5">
                    <h2 className="font-serif text-2xl">Recent Projects</h2>
                    <div className="mt-4 space-y-3">
                      {projects.slice(0, 6).map((p) => (
                        <div
                          key={p.id}
                          className="flex flex-wrap justify-between gap-3 border-b border-[#e9e4dc] py-3 text-sm"
                        >
                          <div>
                            <div className="font-medium">{p.project_name}</div>
                            <div className="text-xs text-[#827c72]">
                              {p.customer_name} · {p.event_type}
                            </div>
                          </div>
                          <div className="text-right">
                            <div>{money(p.total_amount)}</div>
                            <div className="text-xs text-[#827c72]">
                              {p.status}
                            </div>
                          </div>
                        </div>
                      ))}
                      {!projects.length && (
                        <p className="text-sm text-[#827c72]">
                          No projects have been created yet.
                        </p>
                      )}
                    </div>
                  </section>
                </>
              )}

              {active === "Customers" && (
                <section className="border border-[#e6e1d8] bg-white p-6">
                  <h2 className="font-serif text-2xl">Customer Records</h2>
                  <input
                    className={`${inputClass} max-w-md`}
                    placeholder="Search customers..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <div className="mt-5 overflow-x-auto">
                    <table className="w-full min-w-[650px] text-left text-sm">
                      <thead>
                        <tr className="border-b text-[#827c72]">
                          <th className="p-3">Name</th>
                          <th className="p-3">Mobile</th>
                          <th className="p-3">Email</th>
                          <th className="p-3">Bookings</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCustomers.map((c) => (
                          <tr key={c.id} className="border-b">
                            <td className="p-3 font-medium">{c.full_name}</td>
                            <td className="p-3">{c.mobile}</td>
                            <td className="p-3">{c.email || "—"}</td>
                            <td className="p-3">
                              {projects.filter((p) => p.customer_id === c.id).length}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {!filteredCustomers.length && (
                      <p className="py-5 text-sm text-[#827c72]">
                        No customers found.
                      </p>
                    )}
                  </div>
                </section>
              )}

              {active === "Projects & events" && (
                <section className="border border-[#e6e1d8] bg-white p-6">
                  <h2 className="font-serif text-2xl">Projects & Events</h2>
                  <input
                    className={`${inputClass} max-w-md`}
                    placeholder="Search projects..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <div className="mt-5 overflow-x-auto">
                    <table className="w-full min-w-[850px] text-left text-sm">
                      <thead>
                        <tr className="border-b text-[#827c72]">
                          <th className="p-3">Project</th>
                          <th className="p-3">Customer</th>
                          <th className="p-3">Event date</th>
                          <th className="p-3">Venue</th>
                          <th className="p-3">Amount</th>
                          <th className="p-3">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProjects.map((p) => {
                          const ev = events.find((e) => e.project_id === p.id);
                          return (
                            <tr key={p.id} className="border-b">
                              <td className="p-3 font-medium">
                                {p.project_name}
                                <div className="text-xs text-[#827c72]">
                                  {p.event_type}
                                </div>
                              </td>
                              <td className="p-3">{p.customer_name || "—"}</td>
                              <td className="p-3">{ev?.event_date || "—"}</td>
                              <td className="p-3">{ev?.venue || "—"}</td>
                              <td className="p-3">{money(p.total_amount)}</td>
                              <td className="p-3">
                                <select
                                  className="border bg-white p-2 text-xs"
                                  value={p.status}
                                  onChange={(e) =>
                                    updateProjectStatus(p.id, e.target.value)
                                  }
                                >
                                  {statuses.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                  ))}
                                </select>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    {!filteredProjects.length && (
                      <p className="py-5 text-sm text-[#827c72]">
                        No projects found.
                      </p>
                    )}
                  </div>
                </section>
              )}

              {(active === "Enquiries" || active === "Quotations") && (
                <section className="border border-[#e6e1d8] bg-white p-6">
                  <h2 className="font-serif text-2xl">
                    {active === "Enquiries" ? "Enquiry Tracker" : "Quotation Tracker"}
                  </h2>
                  <p className="mt-2 text-sm text-[#827c72]">
                    {active === "Enquiries"
                      ? "Projects with enquiry status appear here. Change the status when a quotation is prepared."
                      : "Projects marked as quoted appear here. Update their status from Projects & Events."}
                  </p>
                  <div className="mt-5 overflow-x-auto">
                    <table className="w-full min-w-[650px] text-left text-sm">
                      <thead>
                        <tr className="border-b text-[#827c72]">
                          <th className="p-3">Project</th>
                          <th className="p-3">Customer</th>
                          <th className="p-3">Package</th>
                          <th className="p-3">Amount</th>
                          <th className="p-3">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {projects
                          .filter((p) =>
                            active === "Enquiries"
                              ? p.status === "enquiry"
                              : p.status === "quoted"
                          )
                          .map((p) => (
                            <tr key={p.id} className="border-b">
                              <td className="p-3">{p.project_name}</td>
                              <td className="p-3">{p.customer_name}</td>
                              <td className="p-3">{p.package_name || "—"}</td>
                              <td className="p-3">{money(p.total_amount)}</td>
                              <td className="p-3">{p.status}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {active === "Payments" && (
                <section className="border border-[#e6e1d8] bg-white p-6">
                  <h2 className="font-serif text-2xl">Payments & Balances</h2>
                  <p className="mt-1 text-sm text-[#827c72]">
                    Record customer payments and track outstanding booking balances.
                  </p>
                  <div className="mt-5 grid gap-4 sm:grid-cols-3">
                    {[
                      ["Booking value", money(totalBooking)],
                      ["Total received", money(totalReceived)],
                      ["Outstanding", money(outstanding)],
                    ].map(([label, value]) => (
                      <div key={label} className="border border-[#e6e1d8] p-5">
                        <div className="text-[10px] uppercase text-[#91897e]">{label}</div>
                        <div className="mt-3 font-serif text-2xl">{value}</div>
                      </div>
                    ))}
                  </div>

                  <h3 className="mt-8 font-serif text-xl">Booking balances</h3>
                  <div className="mt-3 overflow-x-auto">
                    <table className="w-full min-w-[650px] text-left text-sm">
                      <thead>
                        <tr className="border-b text-[#827c72]">
                          <th className="p-3">Project</th>
                          <th className="p-3">Customer</th>
                          <th className="p-3">Booking</th>
                          <th className="p-3">Received</th>
                          <th className="p-3">Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {projects.map((p) => {
                          const received = receivedByProject.get(p.id) ?? 0;
                          return (
                            <tr key={p.id} className="border-b">
                              <td className="p-3">{p.project_name}</td>
                              <td className="p-3">{p.customer_name}</td>
                              <td className="p-3">{money(p.total_amount)}</td>
                              <td className="p-3">{money(received)}</td>
                              <td className="p-3">{money(Math.max(p.total_amount - received, 0))}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <h3 className="mt-8 font-serif text-xl">Payment history</h3>
                  <input
                    className={`${inputClass} max-w-md`}
                    placeholder="Search payments..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <div className="mt-3 overflow-x-auto">
                    <table className="w-full min-w-[700px] text-left text-sm">
                      <thead>
                        <tr className="border-b text-[#827c72]">
                          <th className="p-3">Date</th>
                          <th className="p-3">Project</th>
                          <th className="p-3">Customer</th>
                          <th className="p-3">Method</th>
                          <th className="p-3">Reference</th>
                          <th className="p-3">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPayments.map((p) => {
                          const project = projectFor(p.project_id);
                          return (
                            <tr key={p.id} className="border-b">
                              <td className="p-3">
                                {p.payment_date
                                  ? new Date(p.payment_date).toLocaleDateString("en-IN")
                                  : "—"}
                              </td>
                              <td className="p-3">{project?.project_name || "—"}</td>
                              <td className="p-3">{project?.customer_name || "—"}</td>
                              <td className="p-3">{p.payment_method || "—"}</td>
                              <td className="p-3">{p.transaction_reference || "—"}</td>
                              <td className="p-3">{money(p.amount)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {active === "Expenses" && (
                <section className="border border-[#e6e1d8] bg-white p-6">
                  <h2 className="font-serif text-2xl">Studio Expenses</h2>
                  <div className="mt-5 grid gap-4 sm:grid-cols-3">
                    <div className="border p-5">
                      <div className="text-[10px] uppercase text-[#91897e]">Total expenses</div>
                      <div className="mt-3 font-serif text-2xl">{money(totalExpenses)}</div>
                    </div>
                    <div className="border p-5">
                      <div className="text-[10px] uppercase text-[#91897e]">Total received</div>
                      <div className="mt-3 font-serif text-2xl">{money(totalReceived)}</div>
                    </div>
                    <div className="border p-5">
                      <div className="text-[10px] uppercase text-[#91897e]">Net cash position</div>
                      <div className="mt-3 font-serif text-2xl">{money(profit)}</div>
                    </div>
                  </div>
                  <input
                    className={`${inputClass} max-w-md`}
                    placeholder="Search expenses..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full min-w-[650px] text-left text-sm">
                      <thead>
                        <tr className="border-b text-[#827c72]">
                          <th className="p-3">Date</th>
                          <th className="p-3">Expense</th>
                          <th className="p-3">Project</th>
                          <th className="p-3">Notes</th>
                          <th className="p-3">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredExpenses.map((e) => (
                          <tr key={e.id} className="border-b">
                            <td className="p-3">{e.expense_date || "—"}</td>
                            <td className="p-3">{e.expense_name}</td>
                            <td className="p-3">{projectFor(e.project_id ?? "")?.project_name || "Studio"}</td>
                            <td className="p-3">{e.notes || "—"}</td>
                            <td className="p-3">{money(e.amount)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {active === "Team & assignments" && (
                <section className="border border-[#e6e1d8] bg-white p-6">
                  <h2 className="font-serif text-2xl">Team & Assignments</h2>
                  <p className="mt-2 text-sm text-[#827c72]">
                    Staff members are loaded from profiles. Their profile IDs must belong to existing authenticated users.
                  </p>
                  <h3 className="mt-6 font-serif text-xl">Studio team</h3>
                  <div className="mt-3 overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b text-[#827c72]">
                          <th className="p-3">Name</th>
                          <th className="p-3">Mobile</th>
                          <th className="p-3">Role</th>
                        </tr>
                      </thead>
                      <tbody>
                        {profiles.filter((p) => p.role !== "customer").map((p) => (
                          <tr key={p.id} className="border-b">
                            <td className="p-3">{p.full_name}</td>
                            <td className="p-3">{p.mobile || "—"}</td>
                            <td className="p-3">{p.role}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <h3 className="mt-8 font-serif text-xl">Event assignments</h3>
                  <div className="mt-3 overflow-x-auto">
                    <table className="w-full min-w-[700px] text-left text-sm">
                      <thead>
                        <tr className="border-b text-[#827c72]">
                          <th className="p-3">Event</th>
                          <th className="p-3">Staff</th>
                          <th className="p-3">Assignment</th>
                          <th className="p-3">Payment</th>
                          <th className="p-3">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {assignments.map((a) => (
                          <tr key={a.id} className="border-b">
                            <td className="p-3">{eventFor(a.event_id)?.event_name || "—"}</td>
                            <td className="p-3">{staffFor(a.staff_id)?.full_name || "—"}</td>
                            <td className="p-3">{a.assignment_role || "—"}</td>
                            <td className="p-3">{money(a.payment_amount)}</td>
                            <td className="p-3">
                              <select
                                className="border p-2 text-xs"
                                value={a.status}
                                onChange={(e) => updateAssignmentStatus(a.id, e.target.value)}
                              >
                                {["assigned", "accepted", "completed", "cancelled"].map((s) => (
                                  <option key={s} value={s}>{s}</option>
                                ))}
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {active === "Calendar" && (
                <section className="border border-[#e6e1d8] bg-white p-6">
                  <h2 className="font-serif text-2xl">Event Calendar</h2>
                  <div className="mt-5 space-y-3">
                    {events.map((e) => (
                      <div key={e.id} className="flex flex-wrap justify-between gap-3 border-b py-4">
                        <div>
                          <div className="font-medium">{e.event_name}</div>
                          <div className="text-sm text-[#827c72]">
                            {projectFor(e.project_id)?.customer_name || "Customer"} · {e.venue || "Venue not added"}
                          </div>
                        </div>
                        <div className="text-right text-sm">
                          <div>{e.event_date}</div>
                          <div className="text-[#827c72]">{e.start_time || "Time not set"}</div>
                        </div>
                      </div>
                    ))}
                    {!events.length && <p className="text-sm text-[#827c72]">No events scheduled.</p>}
                  </div>
                </section>
              )}

              {active === "Reports" && (
                <section className="border border-[#e6e1d8] bg-white p-6">
                  <h2 className="font-serif text-2xl">Studio Reports</h2>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {[
                      ["Total customers", customers.length.toString()],
                      ["Total projects", projects.length.toString()],
                      ["Total booking value", money(totalBooking)],
                      ["Payments received", money(totalReceived)],
                      ["Outstanding balances", money(outstanding)],
                      ["Expenses recorded", money(totalExpenses)],
                      ["Net cash position", money(profit)],
                      ["Staff assignment costs", money(assignments.reduce((s, a) => s + a.payment_amount, 0))],
                    ].map(([label, value]) => (
                      <div key={label} className="border border-[#e6e1d8] p-5">
                        <div className="text-[10px] uppercase text-[#91897e]">{label}</div>
                        <div className="mt-3 font-serif text-2xl">{value}</div>
                      </div>
                    ))}
                  </div>
                  <p className="mt-5 text-xs text-[#827c72]">
                    Net cash position is payments received minus recorded expenses. It is not an accounting profit calculation.
                  </p>
                </section>
              )}

              {active === "Galleries" && (
                <section className="border border-[#e6e1d8] bg-white p-6">
                  <h2 className="font-serif text-2xl">Client Galleries</h2>
                  <p className="mt-3 text-sm leading-6 text-[#827c72]">
                    Gallery management is not connected yet. Private photo uploads, customer OTP access, download permissions and secure sharing require a Supabase Storage bucket, storage policies and a customer-facing gallery page. No private gallery links are created by this dashboard yet.
                  </p>
                </section>
              )}

              {active === "Settings" && (
                <section className="border border-[#e6e1d8] bg-white p-6">
                  <h2 className="font-serif text-2xl">Studio Settings</h2>
                  <p className="mt-3 text-sm leading-6 text-[#827c72]">
                    Your current profile records and roles are shown below. User creation and role changes should be handled through a secure server-side administrative process, not directly from this browser page.
                  </p>
                  <div className="mt-5 space-y-3">
                    {profiles.map((p) => (
                      <div key={p.id} className="flex justify-between border-b py-3 text-sm">
                        <span>{p.full_name}</span>
                        <span className="text-[#827c72]">{p.role}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </main>
      </div>

      {customerForm && (
        <Modal title="Add Customer" onClose={() => setCustomerForm(false)}>
          <form onSubmit={saveCustomer} className="space-y-3">
            <Field label="Customer name *">
              <input required className={inputClass} value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
            </Field>
            <Field label="Mobile number *">
              <input required className={inputClass} value={customerMobile} onChange={(e) => setCustomerMobile(e.target.value)} />
            </Field>
            <Field label="Email">
              <input type="email" className={inputClass} value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} />
            </Field>
            <Field label="Address">
              <input className={inputClass} value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} />
            </Field>
            <Field label="Notes">
              <textarea className={inputClass} rows={3} value={customerNotes} onChange={(e) => setCustomerNotes(e.target.value)} />
            </Field>
            <button disabled={saving} className={`${buttonClass} w-full`}>{saving ? "Saving..." : "Save Customer"}</button>
          </form>
        </Modal>
      )}

      {projectForm && (
        <Modal title="New Booking" onClose={() => setProjectForm(false)}>
          <form onSubmit={saveProject} className="space-y-3">
            <Field label="Customer *">
              <select required className={inputClass} value={selectedCustomer} onChange={(e) => setSelectedCustomer(e.target.value)}>
                <option value="">Choose customer</option>
                {customers.map((c) => <option key={c.id} value={c.id}>{c.full_name} — {c.mobile}</option>)}
              </select>
            </Field>
            <Field label="Project name *">
              <input required className={inputClass} value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="Example: Rahul Wedding" />
            </Field>
            <Field label="Event type">
              <select className={inputClass} value={eventType} onChange={(e) => setEventType(e.target.value)}>
                {["Wedding", "Engagement", "Reception", "Birthday", "Baby shower", "Pre-wedding", "Maternity", "Corporate", "Other"].map((v) => <option key={v}>{v}</option>)}
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Event date *">
                <input required type="date" className={inputClass} value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
              </Field>
              <Field label="Reporting time">
                <input type="time" className={inputClass} value={startTime} onChange={(e) => setStartTime(e.target.value)} />
              </Field>
              <Field label="End time">
                <input type="time" className={inputClass} value={endTime} onChange={(e) => setEndTime(e.target.value)} />
              </Field>
              <Field label="Package">
                <input className={inputClass} value={packageName} onChange={(e) => setPackageName(e.target.value)} placeholder="Gold / Platinum" />
              </Field>
            </div>
            <Field label="Venue">
              <input className={inputClass} value={venue} onChange={(e) => setVenue(e.target.value)} />
            </Field>
            <Field label="Total amount (₹)">
              <input type="number" min="0" className={inputClass} value={totalAmount} onChange={(e) => setTotalAmount(e.target.value)} />
            </Field>
            <Field label="Booking status">
              <select className={inputClass} value={projectStatus} onChange={(e) => setProjectStatus(e.target.value)}>
                {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Notes">
              <textarea rows={3} className={inputClass} value={projectNotes} onChange={(e) => setProjectNotes(e.target.value)} />
            </Field>
            <button disabled={saving || !customers.length} className={`${buttonClass} w-full`}>{saving ? "Saving..." : "Save Booking"}</button>
            {!customers.length && <p className="text-xs text-red-600">Add a customer first.</p>}
          </form>
        </Modal>
      )}

      {paymentForm && (
        <Modal title="Record Payment" onClose={() => setPaymentForm(false)}>
          <form onSubmit={savePayment} className="space-y-3">
            <Field label="Booking *">
              <select required className={inputClass} value={paymentProject} onChange={(e) => setPaymentProject(e.target.value)}>
                <option value="">Choose booking</option>
                {projects.map((p) => {
                  const balance = Math.max(p.total_amount - (receivedByProject.get(p.id) ?? 0), 0);
                  return <option key={p.id} value={p.id}>{p.project_name} — Balance {money(balance)}</option>;
                })}
              </select>
            </Field>
            <Field label="Amount received (₹) *">
              <input required type="number" min="0.01" step="0.01" className={inputClass} value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} />
            </Field>
            <Field label="Payment date">
              <input required type="date" className={inputClass} value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} />
            </Field>
            <Field label="Payment method">
              <select className={inputClass} value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                {["UPI", "Cash", "Bank Transfer", "Card", "Cheque", "Other"].map((m) => <option key={m}>{m}</option>)}
              </select>
            </Field>
            <Field label="Transaction reference">
              <input className={inputClass} value={paymentReference} onChange={(e) => setPaymentReference(e.target.value)} />
            </Field>
            <Field label="Notes">
              <textarea className={inputClass} rows={3} value={paymentNotes} onChange={(e) => setPaymentNotes(e.target.value)} />
            </Field>
            <button disabled={saving} className={`${buttonClass} w-full`}>{saving ? "Saving..." : "Save Payment"}</button>
          </form>
        </Modal>
      )}

      {expenseForm && (
        <Modal title="Add Expense" onClose={() => setExpenseForm(false)}>
          <form onSubmit={saveExpense} className="space-y-3">
            <Field label="Expense name *">
              <input required className={inputClass} value={expenseName} onChange={(e) => setExpenseName(e.target.value)} placeholder="Travel / equipment / food" />
            </Field>
            <Field label="Related project (optional)">
              <select className={inputClass} value={expenseProject} onChange={(e) => setExpenseProject(e.target.value)}>
                <option value="">Studio expense</option>
                {projects.map((p) => <option key={p.id} value={p.id}>{p.project_name}</option>)}
              </select>
            </Field>
            <Field label="Amount (₹) *">
              <input required type="number" min="0.01" step="0.01" className={inputClass} value={expenseAmount} onChange={(e) => setExpenseAmount(e.target.value)} />
            </Field>
            <Field label="Expense date">
              <input type="date" className={inputClass} value={expenseDate} onChange={(e) => setExpenseDate(e.target.value)} />
            </Field>
            <Field label="Notes">
              <textarea className={inputClass} rows={3} value={expenseNotes} onChange={(e) => setExpenseNotes(e.target.value)} />
            </Field>
            <button disabled={saving} className={`${buttonClass} w-full`}>{saving ? "Saving..." : "Save Expense"}</button>
          </form>
        </Modal>
      )}

      {assignmentForm && (
        <Modal title="Assign Staff to Event" onClose={() => setAssignmentForm(false)}>
          <form onSubmit={saveAssignment} className="space-y-3">
            <Field label="Event *">
              <select required className={inputClass} value={assignmentEvent} onChange={(e) => setAssignmentEvent(e.target.value)}>
                <option value="">Choose event</option>
                {events.map((e) => <option key={e.id} value={e.id}>{e.event_name} — {e.event_date}</option>)}
              </select>
            </Field>
            <Field label="Staff member *">
              <select required className={inputClass} value={assignmentStaff} onChange={(e) => setAssignmentStaff(e.target.value)}>
                <option value="">Choose staff</option>
                {profiles.filter((p) => ["owner", "admin", "photographer", "editor"].includes(p.role)).map((p) => <option key={p.id} value={p.id}>{p.full_name} — {p.role}</option>)}
              </select>
            </Field>
            <Field label="Assignment role">
              <select className={inputClass} value={assignmentRole} onChange={(e) => setAssignmentRole(e.target.value)}>
                {["Photographer", "Videographer", "Editor", "Drone operator", "Assistant", "Other"].map((r) => <option key={r}>{r}</option>)}
              </select>
            </Field>
            <Field label="Staff payment amount (₹)">
              <input type="number" min="0" className={inputClass} value={assignmentPayment} onChange={(e) => setAssignmentPayment(e.target.value)} />
            </Field>
            <button disabled={saving} className={`${buttonClass} w-full`}>{saving ? "Saving..." : "Save Assignment"}</button>
          </form>
        </Modal>
      )}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm">
      {label}
      {children}
    </label>
  );
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center overflow-y-auto bg-black/40 p-4">
      <div className="my-6 w-full max-w-xl border border-[#e6e1d8] bg-[#fbfaf7] p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-serif text-2xl">{title}</h2>
          <button type="button" onClick={onClose} className="text-2xl">×</button>
        </div>
        {children}
        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full border border-[#ddd6cb] px-4 py-3 text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
