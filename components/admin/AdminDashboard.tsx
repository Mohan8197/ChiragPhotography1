"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type Customer = {
  id: string;
  full_name: string;
  mobile: string;
  email: string | null;
  address: string | null;
  notes: string | null;
};

type BookingProject = {
  id: string;
  customer_id: string;
  project_name: string;
  event_type: string;
  package_name: string | null;
  total_amount: number;
  status: string;
  notes: string | null;
  customer_name?: string;
  event_date?: string;
  venue?: string;
  reporting_time?: string;
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

const money = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const nav = [
  { label: "Overview", icon: "◫" },
  { label: "Customers", icon: "♙" },
  { label: "Projects & events", icon: "▣" },
  { label: "Enquiries", icon: "✉" },
  { label: "Quotations", icon: "▤" },
  { label: "Payments", icon: "₹" },
  { label: "Team & assignments", icon: "♧" },
  { label: "Calendar", icon: "▦" },
  { label: "Galleries", icon: "▧" },
  { label: "Reports", icon: "▥" },
  { label: "Settings", icon: "⚙" },
];

export function AdminDashboard() {
  const [active, setActive] = useState("Overview");

  // Customer state
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerLoading, setCustomerLoading] = useState(true);
  const [customerError, setCustomerError] = useState("");
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerMobile, setCustomerMobile] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");
  const [savingCustomer, setSavingCustomer] = useState(false);

  // Project state
  const [projects, setProjects] = useState<BookingProject[]>([]);
  const [projectLoading, setProjectLoading] = useState(true);
  const [projectError, setProjectError] = useState("");
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [savingProject, setSavingProject] = useState(false);
  const [projectSearch, setProjectSearch] = useState("");

  // New project form fields
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [projectName, setProjectName] = useState("");
  const [eventType, setEventType] = useState("Wedding");
  const [eventDate, setEventDate] = useState("");
  const [venue, setVenue] = useState("");
  const [reportingTime, setReportingTime] = useState("09:00");
  const [packageName, setPackageName] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [projectStatus, setProjectStatus] = useState("enquiry");
  const [projectNotes, setProjectNotes] = useState("");

  const [query, setQuery] = useState("");

  // Payment state
  const [payments, setPayments] = useState<Payment[]>([]);
  const [paymentLoading, setPaymentLoading] = useState(true);
  const [paymentError, setPaymentError] = useState("");
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [savingPayment, setSavingPayment] = useState(false);
  const [paymentSearch, setPaymentSearch] = useState("");
  const [paymentProjectId, setPaymentProjectId] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [paymentReference, setPaymentReference] = useState("");
  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [paymentNotes, setPaymentNotes] = useState("");

  // Load customers and projects
  useEffect(() => {
    async function loadCustomers() {
      const { data, error } = await supabase
        .from("customers")
        .select("id, full_name, mobile, email, address, notes")
        .order("created_at", { ascending: false });

      if (error) {
        setCustomerError(error.message);
      } else {
        setCustomers(data ?? []);
      }

      setCustomerLoading(false);
    }

    async function loadProjects() {
      const { data, error } = await supabase
        .from("projects")
        .select(
          "id, customer_id, project_name, event_type, package_name, total_amount, status, notes"
        )
        .order("created_at", { ascending: false });

      if (error) {
        setProjectError(error.message);
        setProjectLoading(false);
        return;
      }

      const { data: eventData, error: eventError } = await supabase
        .from("events")
        .select("project_id, event_date, venue, reporting_time");

      if (eventError) {
        setProjectError(eventError.message);
      }

      const eventRows = eventData ?? [];

      const mappedProjects = (data ?? []).map((project) => {
        const eventInfo = eventRows.find(
          (item) => item.project_id === project.id
        );

        return {
          ...project,
          total_amount: Number(project.total_amount ?? 0),
          customer_name:
            customers.find((customer) => customer.id === project.customer_id)
              ?.full_name ?? "",
          event_date: eventInfo?.event_date ?? "",
          venue: eventInfo?.venue ?? "",
          reporting_time: eventInfo?.reporting_time ?? "",
        };
      });

      setProjects(mappedProjects);
      setProjectLoading(false);
    }

    loadCustomers();
    loadProjects();
  }, [customers.length === 0 ? "initial" : "loaded"]);

  // Load payment history
  useEffect(() => {
    async function loadPayments() {
      const { data, error } = await supabase
        .from("payments")
        .select(
          "id, project_id, amount, payment_method, transaction_reference, payment_date, notes"
        )
        .order("payment_date", { ascending: false });

      if (error) {
        setPaymentError(error.message);
      } else {
        setPayments(
          (data ?? []).map((payment) => ({
            ...payment,
            amount: Number(payment.amount ?? 0),
          }))
        );
      }

      setPaymentLoading(false);
    }

    loadPayments();
  }, []);

  // Add customer
  async function addCustomer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!customerName.trim() || !customerMobile.trim()) {
      setCustomerError("Customer name and mobile number are required.");
      return;
    }

    setSavingCustomer(true);
    setCustomerError("");

    const { data, error } = await supabase
      .from("customers")
      .insert({
        full_name: customerName.trim(),
        mobile: customerMobile.trim(),
        email: customerEmail.trim() || null,
        address: customerAddress.trim() || null,
        notes: customerNotes.trim() || null,
      })
      .select("id, full_name, mobile, email, address, notes")
      .single();

    if (error) {
      setCustomerError(error.message);
    } else {
      setCustomers((current) => [data, ...current]);
      setCustomerName("");
      setCustomerMobile("");
      setCustomerEmail("");
      setCustomerAddress("");
      setCustomerNotes("");
      setShowCustomerForm(false);
    }

    setSavingCustomer(false);
  }

  // Add project and its event
  async function addProject(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!selectedCustomer || !projectName.trim() || !eventDate) {
      setProjectError(
        "Please select a customer, enter a project name and event date."
      );
      return;
    }

    setSavingProject(true);
    setProjectError("");

    const { data: project, error: projectInsertError } = await supabase
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
      .select(
        "id, customer_id, project_name, event_type, package_name, total_amount, status, notes"
      )
      .single();

    if (projectInsertError) {
      setProjectError(projectInsertError.message);
      setSavingProject(false);
      return;
    }

    const reportingDateTime = `${eventDate}T${reportingTime || "09:00"}:00`;

    const { error: eventInsertError } = await supabase.from("events").insert({
      project_id: project.id,
      event_name: projectName.trim(),
      event_date: eventDate,
      venue: venue.trim() || null,
      reporting_time: reportingDateTime,
    });

    if (eventInsertError) {
      setProjectError(
        `The project was saved, but its event details could not be saved: ${eventInsertError.message}`
      );
      setSavingProject(false);
      return;
    }

    const customer = customers.find((item) => item.id === selectedCustomer);

    setProjects((current) => [
      {
        ...project,
        total_amount: Number(project.total_amount ?? 0),
        customer_name: customer?.full_name ?? "",
        event_date: eventDate,
        venue,
        reporting_time: reportingDateTime,
      },
      ...current,
    ]);

    setSelectedCustomer("");
    setProjectName("");
    setEventType("Wedding");
    setEventDate("");
    setVenue("");
    setReportingTime("09:00");
    setPackageName("");
    setTotalAmount("");
    setProjectStatus("enquiry");
    setProjectNotes("");
    setShowProjectForm(false);
    setActive("Projects & events");
    setSavingProject(false);
  }

  // Record a payment against a project
  async function addPayment(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const amount = Number(paymentAmount);

    if (
      !paymentProjectId ||
      !Number.isFinite(amount) ||
      amount <= 0 ||
      !paymentDate
    ) {
      setPaymentError(
        "Select a booking, enter a valid amount and choose a payment date."
      );
      return;
    }

    const selectedProject = projects.find(
      (project) => project.id === paymentProjectId
    );

    if (!selectedProject) {
      setPaymentError(
        "The selected booking could not be found. Refresh and try again."
      );
      return;
    }

    const alreadyReceived = payments
      .filter((payment) => payment.project_id === paymentProjectId)
      .reduce((sum, payment) => sum + payment.amount, 0);

    const balance = selectedProject.total_amount - alreadyReceived;

    if (amount > balance) {
      setPaymentError(
        `This amount is greater than the remaining balance of ${money(
          Math.max(balance, 0)
        )}.`
      );
      return;
    }

    setSavingPayment(true);
    setPaymentError("");

    const { data, error } = await supabase
      .from("payments")
      .insert({
        project_id: paymentProjectId,
        amount,
        payment_method: paymentMethod,
        transaction_reference: paymentReference.trim() || null,
        payment_date: new Date(`${paymentDate}T12:00:00`).toISOString(),
        notes: paymentNotes.trim() || null,
      })
      .select(
        "id, project_id, amount, payment_method, transaction_reference, payment_date, notes"
      )
      .single();

    if (error) {
      setPaymentError(error.message);
      setSavingPayment(false);
      return;
    }

    setPayments((current) => [
      { ...data, amount: Number(data.amount ?? 0) },
      ...current,
    ]);

    setPaymentProjectId("");
    setPaymentAmount("");
    setPaymentMethod("UPI");
    setPaymentReference("");
    setPaymentDate(new Date().toISOString().slice(0, 10));
    setPaymentNotes("");
    setShowPaymentForm(false);
    setSavingPayment(false);
  }

  const paymentTotals = useMemo(() => {
    const receivedByProject = new Map<string, number>();

    for (const payment of payments) {
      receivedByProject.set(
        payment.project_id,
        (receivedByProject.get(payment.project_id) ?? 0) + payment.amount
      );
    }

    const totalReceived = payments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );

    const totalBalance = projects.reduce(
      (sum, project) =>
        sum +
        Math.max(
          project.total_amount - (receivedByProject.get(project.id) ?? 0),
          0
        ),
      0
    );

    return { receivedByProject, totalReceived, totalBalance };
  }, [payments, projects]);

  const filteredPayments = useMemo(() => {
    const search = paymentSearch.toLowerCase();

    return payments.filter((payment) => {
      const project = projects.find(
        (item) => item.id === payment.project_id
      );

      return [
        project?.project_name ?? "",
        project?.customer_name ?? "",
        payment.payment_method ?? "",
        payment.transaction_reference ?? "",
        payment.notes ?? "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(search);
    });
  }, [payments, projects, paymentSearch]);

  const filteredProjects = useMemo(() => {
    const search = projectSearch.toLowerCase();

    return projects.filter((project) =>
      [
        project.project_name,
        project.customer_name ?? "",
        project.event_type,
        project.venue ?? "",
        project.status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(search)
    );
  }, [projects, projectSearch]);

  const totalValue = projects.reduce(
    (sum, project) => sum + project.total_amount,
    0
  );

  const filteredCustomers = customers.filter((customer) =>
    [customer.full_name, customer.mobile, customer.email ?? ""]
      .join(" ")
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f6f4ef] text-[#22231f]">
      <div className="border-b border-[#e6e1d8] bg-[#fbfaf7] px-5 py-3 text-center text-[10px] font-semibold uppercase tracking-[.22em] text-[#8b7658]">
        Chirag Photography · Studio Management
      </div>

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
            {nav.map((item) => (
              <button
                key={item.label}
                onClick={() => setActive(item.label)}
                className={`flex w-full items-center gap-3 rounded-sm px-3 py-3 text-left text-[12px] transition ${
                  active === item.label
                    ? "bg-[#292a25] text-white shadow-sm"
                    : "text-[#625f58] hover:bg-white/70"
                }`}
              >
                <span className="w-5 text-center text-[15px]">
                  {item.icon}
                </span>
                {item.label}
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
                {active === "Overview" ? "Studio Dashboard" : active}
              </h1>
              <p className="mt-2 text-[12px] text-[#827c72]">
                Manage your customers, bookings and studio operations.
              </p>
            </div>

            {active === "Projects & events" && (
              <button
                onClick={() => {
                  setProjectError("");
                  setShowProjectForm(true);
                }}
                className="rounded-sm bg-[#292a25] px-4 py-3 text-[10px] font-semibold uppercase tracking-[.12em] text-white"
              >
                + New Booking
              </button>
            )}

            {active === "Payments" && (
              <button
                onClick={() => {
                  setPaymentError("");
                  setShowPaymentForm(true);
                }}
                disabled={projects.length === 0}
                className="rounded-sm bg-[#292a25] px-4 py-3 text-[10px] font-semibold uppercase tracking-[.12em] text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                + Record Payment
              </button>
            )}

            {active === "Customers" && (
              <button
                onClick={() => {
                  setCustomerError("");
                  setShowCustomerForm(true);
                }}
                className="rounded-sm bg-[#292a25] px-4 py-3 text-[10px] font-semibold uppercase tracking-[.12em] text-white"
              >
                + Add Customer
              </button>
            )}
          </div>

          {active === "Overview" && (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="border border-[#e6e1d8] bg-[#fbfaf7] p-5">
                  <div className="text-[10px] uppercase tracking-wider text-[#91897e]">
                    Total Customers
                  </div>
                  <div className="mt-3 font-serif text-3xl">
                    {customers.length}
                  </div>
                </div>

                <div className="border border-[#e6e1d8] bg-[#fbfaf7] p-5">
                  <div className="text-[10px] uppercase tracking-wider text-[#91897e]">
                    Total Projects
                  </div>
                  <div className="mt-3 font-serif text-3xl">
                    {projects.length}
                  </div>
                </div>

                <div className="border border-[#e6e1d8] bg-[#fbfaf7] p-5">
                  <div className="text-[10px] uppercase tracking-wider text-[#91897e]">
                    Project Value
                  </div>
                  <div className="mt-3 break-words font-serif text-2xl">
                    {money(totalValue)}
                  </div>
                </div>
              </div>

              <section className="mt-8 border border-[#e6e1d8] bg-[#fbfaf7] p-5">
                <h2 className="font-serif text-2xl">Recent Projects</h2>
                {projects.length === 0 ? (
                  <p className="mt-4 text-sm text-[#827c72]">
                    No projects have been created yet.
                  </p>
                ) : (
                  <div className="mt-4 space-y-3">
                    {projects.slice(0, 5).map((project) => (
                      <div
                        key={project.id}
                        className="flex flex-wrap justify-between gap-2 border-b border-[#e9e4dc] py-3 text-sm"
                      >
                        <div>
                          <div className="font-medium">
                            {project.project_name}
                          </div>
                          <div className="text-xs text-[#827c72]">
                            {project.customer_name} · {project.event_type}
                          </div>
                        </div>
                        <div className="text-sm">
                          {money(project.total_amount)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}

          {active === "Customers" && (
            <section className="min-h-[520px] border border-[#e6e1d8] bg-white p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl">Customer Records</h2>
                  <p className="mt-1 text-sm text-[#827c72]">
                    Manage your photography studio customers.
                  </p>
                </div>
                <div className="text-sm text-[#827c72]">
                  Total Customers: {customers.length}
                </div>
              </div>

              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search customers..."
                className="mt-6 w-full border border-[#e1dbd1] px-3 py-3 text-sm sm:max-w-sm"
              />

              {customerError && (
                <p className="mt-4 text-sm text-red-600">{customerError}</p>
              )}

              {customerLoading ? (
                <p className="mt-6 text-sm">Loading customers...</p>
              ) : filteredCustomers.length === 0 ? (
                <p className="mt-6 text-sm text-[#827c72]">
                  No customers found.
                </p>
              ) : (
                <div className="mt-6 overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b text-[#827c72]">
                        <th className="p-3">Name</th>
                        <th className="p-3">Mobile</th>
                        <th className="p-3">Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCustomers.map((customer) => (
                        <tr key={customer.id} className="border-b">
                          <td className="p-3 font-medium">
                            {customer.full_name}
                          </td>
                          <td className="p-3">{customer.mobile}</td>
                          <td className="p-3">{customer.email || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}

          {active === "Projects & events" && (
            <section className="min-h-[520px] border border-[#e6e1d8] bg-white p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl">Projects & Events</h2>
                  <p className="mt-1 text-sm text-[#827c72]">
                    Track bookings, customers and event schedules.
                  </p>
                </div>
                <div className="text-sm text-[#827c72]">
                  Total Projects: {projects.length}
                </div>
              </div>

              <input
                value={projectSearch}
                onChange={(e) => setProjectSearch(e.target.value)}
                placeholder="Search projects..."
                className="mt-6 w-full border border-[#e1dbd1] px-3 py-3 text-sm sm:max-w-sm"
              />

              {projectError && (
                <p className="mt-4 text-sm text-red-600">{projectError}</p>
              )}

              {projectLoading ? (
                <p className="mt-6 text-sm">Loading projects...</p>
              ) : filteredProjects.length === 0 ? (
                <p className="mt-6 text-sm text-[#827c72]">
                  No projects found. Click New Booking to create one.
                </p>
              ) : (
                <div className="mt-6 overflow-x-auto">
                  <table className="w-full min-w-[750px] text-left text-sm">
                    <thead>
                      <tr className="border-b text-[#827c72]">
                        <th className="p-3">Project</th>
                        <th className="p-3">Customer</th>
                        <th className="p-3">Event Date</th>
                        <th className="p-3">Venue</th>
                        <th className="p-3">Amount</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProjects.map((project) => (
                        <tr key={project.id} className="border-b">
                          <td className="p-3 font-medium">
                            {project.project_name}
                            <div className="text-xs text-[#827c72]">
                              {project.event_type}
                            </div>
                          </td>
                          <td className="p-3">
                            {project.customer_name || "—"}
                          </td>
                          <td className="p-3">
                            {project.event_date || "—"}
                          </td>
                          <td className="p-3">{project.venue || "—"}</td>
                          <td className="p-3">
                            {money(project.total_amount)}
                          </td>
                          <td className="p-3">{project.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}

          {active === "Payments" && (
            <section className="min-h-[520px] border border-[#e6e1d8] bg-white p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl">Payments & Balances</h2>
                  <p className="mt-1 text-sm text-[#827c72]">
                    Record customer payments and track outstanding booking balances.
                  </p>
                </div>
                <div className="text-sm text-[#827c72]">
                  {payments.length} payment{payments.length === 1 ? "" : "s"} recorded
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="border border-[#e6e1d8] bg-[#fbfaf7] p-5">
                  <div className="text-[10px] uppercase tracking-wider text-[#91897e]">
                    Total Booking Value
                  </div>
                  <div className="mt-3 font-serif text-2xl">
                    {money(totalValue)}
                  </div>
                </div>

                <div className="border border-[#e6e1d8] bg-[#fbfaf7] p-5">
                  <div className="text-[10px] uppercase tracking-wider text-[#91897e]">
                    Total Received
                  </div>
                  <div className="mt-3 font-serif text-2xl">
                    {money(paymentTotals.totalReceived)}
                  </div>
                </div>

                <div className="border border-[#e6e1d8] bg-[#fbfaf7] p-5">
                  <div className="text-[10px] uppercase tracking-wider text-[#91897e]">
                    Outstanding Balance
                  </div>
                  <div className="mt-3 font-serif text-2xl">
                    {money(paymentTotals.totalBalance)}
                  </div>
                </div>
              </div>

              {paymentError && (
                <p className="mt-4 text-sm text-red-600">{paymentError}</p>
              )}

              <h3 className="mt-8 font-serif text-xl">Booking balances</h3>

              {projectLoading ? (
                <p className="mt-4 text-sm text-[#827c72]">
                  Loading bookings...
                </p>
              ) : projects.length === 0 ? (
                <p className="mt-4 text-sm text-[#827c72]">
                  Create a booking before recording a payment.
                </p>
              ) : (
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[650px] text-left text-sm">
                    <thead>
                      <tr className="border-b text-[#827c72]">
                        <th className="p-3">Project</th>
                        <th className="p-3">Customer</th>
                        <th className="p-3">Booking Amount</th>
                        <th className="p-3">Received</th>
                        <th className="p-3">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.map((project) => {
                        const received =
                          paymentTotals.receivedByProject.get(project.id) ?? 0;
                        const balance = Math.max(
                          project.total_amount - received,
                          0
                        );

                        return (
                          <tr key={project.id} className="border-b">
                            <td className="p-3 font-medium">
                              {project.project_name}
                            </td>
                            <td className="p-3">
                              {project.customer_name || "—"}
                            </td>
                            <td className="p-3">
                              {money(project.total_amount)}
                            </td>
                            <td className="p-3">{money(received)}</td>
                            <td className="p-3 font-medium">
                              {money(balance)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="mt-9 flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-serif text-xl">Payment history</h3>
                <input
                  value={paymentSearch}
                  onChange={(e) => setPaymentSearch(e.target.value)}
                  placeholder="Search payments..."
                  className="w-full border border-[#e1dbd1] px-3 py-3 text-sm sm:max-w-sm"
                />
              </div>

              {paymentLoading ? (
                <p className="mt-4 text-sm text-[#827c72]">
                  Loading payments...
                </p>
              ) : filteredPayments.length === 0 ? (
                <p className="mt-4 text-sm text-[#827c72]">
                  No payments found yet.
                </p>
              ) : (
                <div className="mt-4 overflow-x-auto">
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
                      {filteredPayments.map((payment) => {
                        const project = projects.find(
                          (item) => item.id === payment.project_id
                        );

                        return (
                          <tr key={payment.id} className="border-b">
                            <td className="p-3">
                              {payment.payment_date
                                ? new Date(
                                    payment.payment_date
                                  ).toLocaleDateString("en-IN")
                                : "—"}
                            </td>
                            <td className="p-3">
                              {project?.project_name ?? "—"}
                            </td>
                            <td className="p-3">
                              {project?.customer_name ?? "—"}
                            </td>
                            <td className="p-3">
                              {payment.payment_method || "—"}
                            </td>
                            <td className="p-3">
                              {payment.transaction_reference || "—"}
                            </td>
                            <td className="p-3 font-medium">
                              {money(payment.amount)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}

          {![
            "Overview",
            "Customers",
            "Projects & events",
            "Payments",
          ].includes(active) && (
            <section className="min-h-[520px] border border-[#e6e1d8] bg-[#fbfaf7] p-6 sm:p-8">
              <div className="text-[9px] uppercase tracking-[.2em] text-[#9b8a70]">
                Chirag Photography / {active}
              </div>
              <h2 className="mt-3 font-serif text-[30px]">{active}</h2>
              <p className="mt-2 text-sm leading-6 text-[#827c72]">
                This workspace will be connected in the next development phase.
              </p>
            </section>
          )}
        </main>
      </div>

      {/* Add Customer Form */}
      {showCustomerForm && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center overflow-y-auto bg-black/40 p-4">
          <form
            onSubmit={addCustomer}
            className="my-6 w-full max-w-lg border border-[#e6e1d8] bg-[#fbfaf7] p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl">Add Customer</h2>
              <button
                type="button"
                onClick={() => setShowCustomerForm(false)}
                className="text-2xl"
              >
                ×
              </button>
            </div>

            <label className="mt-5 block text-sm">
              Customer Name *
              <input
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="mt-2 w-full border p-3"
                placeholder="Full name"
              />
            </label>

            <label className="mt-4 block text-sm">
              Mobile Number *
              <input
                required
                type="tel"
                value={customerMobile}
                onChange={(e) => setCustomerMobile(e.target.value)}
                className="mt-2 w-full border p-3"
                placeholder="Mobile number"
              />
            </label>

            <label className="mt-4 block text-sm">
              Email
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="mt-2 w-full border p-3"
                placeholder="Email address"
              />
            </label>

            <label className="mt-4 block text-sm">
              Address
              <input
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                className="mt-2 w-full border p-3"
                placeholder="Customer address"
              />
            </label>

            <label className="mt-4 block text-sm">
              Notes
              <textarea
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                className="mt-2 w-full border p-3"
                rows={3}
                placeholder="Additional notes"
              />
            </label>

            {customerError && (
              <p className="mt-3 text-sm text-red-600">{customerError}</p>
            )}

            <button
              type="submit"
              disabled={savingCustomer}
              className="mt-5 w-full bg-[#292a25] px-5 py-3 text-sm text-white disabled:opacity-50"
            >
              {savingCustomer ? "Saving..." : "Save Customer"}
            </button>
          </form>
        </div>
      )}

      {/* New Project Form */}
      {showProjectForm && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center overflow-y-auto bg-black/40 p-4">
          <form
            onSubmit={addProject}
            className="my-6 w-full max-w-2xl border border-[#e6e1d8] bg-[#fbfaf7] p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[9px] uppercase tracking-[.2em] text-[#9b8a70]">
                  Project intake
                </div>
                <h2 className="mt-2 font-serif text-2xl">New Booking</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowProjectForm(false)}
                className="text-2xl"
              >
                ×
              </button>
            </div>

            {customers.length === 0 ? (
              <p className="mt-5 text-sm text-red-600">
                Please add a customer before creating a booking.
              </p>
            ) : (
              <>
                <label className="mt-5 block text-sm">
                  Select Customer *
                  <select
                    required
                    value={selectedCustomer}
                    onChange={(e) => setSelectedCustomer(e.target.value)}
                    className="mt-2 w-full border bg-white p-3"
                  >
                    <option value="">Choose a customer</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.full_name} — {customer.mobile}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="mt-4 block text-sm">
                  Project / Booking Name *
                  <input
                    required
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="mt-2 w-full border p-3"
                    placeholder="Example: Rahul Wedding"
                  />
                </label>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm">
                    Event Type
                    <select
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value)}
                      className="mt-2 w-full border bg-white p-3"
                    >
                      <option>Wedding</option>
                      <option>Engagement</option>
                      <option>Reception</option>
                      <option>Birthday</option>
                      <option>Baby shower</option>
                      <option>Pre-wedding</option>
                      <option>Maternity</option>
                      <option>Corporate</option>
                      <option>Other</option>
                    </select>
                  </label>

                  <label className="block text-sm">
                    Event Date *
                    <input
                      required
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="mt-2 w-full border bg-white p-3"
                    />
                  </label>

                  <label className="block text-sm">
                    Reporting Time
                    <input
                      type="time"
                      value={reportingTime}
                      onChange={(e) => setReportingTime(e.target.value)}
                      className="mt-2 w-full border bg-white p-3"
                    />
                  </label>

                  <label className="block text-sm">
                    Package Name
                    <input
                      value={packageName}
                      onChange={(e) => setPackageName(e.target.value)}
                      className="mt-2 w-full border p-3"
                      placeholder="Gold / Platinum / Premium"
                    />
                  </label>
                </div>

                <label className="mt-4 block text-sm">
                  Venue
                  <input
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    className="mt-2 w-full border p-3"
                    placeholder="Event venue and address"
                  />
                </label>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm">
                    Total Amount (₹)
                    <input
                      type="number"
                      min="0"
                      value={totalAmount}
                      onChange={(e) => setTotalAmount(e.target.value)}
                      className="mt-2 w-full border p-3"
                      placeholder="Example: 75000"
                    />
                  </label>

                  <label className="block text-sm">
                    Booking Status
                    <select
                      value={projectStatus}
                      onChange={(e) => setProjectStatus(e.target.value)}
                      className="mt-2 w-full border bg-white p-3"
                    >
                      <option value="enquiry">Enquiry</option>
                      <option value="quoted">Quoted</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </label>
                </div>

                <label className="mt-4 block text-sm">
                  Notes
                  <textarea
                    value={projectNotes}
                    onChange={(e) => setProjectNotes(e.target.value)}
                    className="mt-2 w-full border p-3"
                    rows={3}
                    placeholder="Additional booking details"
                  />
                </label>
              </>
            )}

            {projectError && (
              <p className="mt-4 text-sm text-red-600">{projectError}</p>
            )}

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setShowProjectForm(false)}
                className="flex-1 border border-[#ddd6cb] px-4 py-3 text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingProject || customers.length === 0}
                className="flex-1 bg-[#292a25] px-4 py-3 text-sm text-white disabled:opacity-50"
              >
                {savingProject ? "Saving..." : "Save Booking"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Record Payment Form */}
      {showPaymentForm && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center overflow-y-auto bg-black/40 p-4">
          <form
            onSubmit={addPayment}
            className="my-6 w-full max-w-xl border border-[#e6e1d8] bg-[#fbfaf7] p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[9px] uppercase tracking-[.2em] text-[#9b8a70]">
                  Payment entry
                </div>
                <h2 className="mt-2 font-serif text-2xl">Record Payment</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowPaymentForm(false)}
                className="text-2xl"
              >
                ×
              </button>
            </div>

            <label className="mt-5 block text-sm">
              Booking *
              <select
                required
                value={paymentProjectId}
                onChange={(e) => setPaymentProjectId(e.target.value)}
                className="mt-2 w-full border bg-white p-3"
              >
                <option value="">Choose a booking</option>
                {projects.map((project) => {
                  const received =
                    paymentTotals.receivedByProject.get(project.id) ?? 0;
                  const balance = Math.max(
                    project.total_amount - received,
                    0
                  );

                  return (
                    <option key={project.id} value={project.id}>
                      {project.project_name} — {project.customer_name || "Customer"} — Balance {money(balance)}
                    </option>
                  );
                })}
              </select>
            </label>

            {paymentProjectId && (
              <div className="mt-3 border border-[#e6e1d8] bg-white p-3 text-sm">
                {(() => {
                  const selected = projects.find(
                    (project) => project.id === paymentProjectId
                  );
                  const received =
                    paymentTotals.receivedByProject.get(paymentProjectId) ?? 0;
                  const balance = Math.max(
                    (selected?.total_amount ?? 0) - received,
                    0
                  );

                  return (
                    <div className="flex flex-wrap justify-between gap-2">
                      <span>
                        Booking: {money(selected?.total_amount ?? 0)}
                      </span>
                      <span>Received: {money(received)}</span>
                      <strong>Balance: {money(balance)}</strong>
                    </div>
                  );
                })()}
              </div>
            )}

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block text-sm">
                Amount Received (₹) *
                <input
                  required
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="mt-2 w-full border bg-white p-3"
                  placeholder="Example: 15000"
                />
              </label>

              <label className="block text-sm">
                Payment Date *
                <input
                  required
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="mt-2 w-full border bg-white p-3"
                />
              </label>

              <label className="block text-sm">
                Payment Method *
                <select
                  required
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mt-2 w-full border bg-white p-3"
                >
                  <option value="UPI">UPI</option>
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Card">Card</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Other">Other</option>
                </select>
              </label>

              <label className="block text-sm">
                Transaction Reference
                <input
                  value={paymentReference}
                  onChange={(e) => setPaymentReference(e.target.value)}
                  className="mt-2 w-full border bg-white p-3"
                  placeholder="UPI / bank reference"
                />
              </label>
            </div>

            <label className="mt-4 block text-sm">
              Notes
              <textarea
                value={paymentNotes}
                onChange={(e) => setPaymentNotes(e.target.value)}
                className="mt-2 w-full border bg-white p-3"
                rows={3}
                placeholder="Advance, second instalment, final payment..."
              />
            </label>

            {paymentError && (
              <p className="mt-4 text-sm text-red-600">{paymentError}</p>
            )}

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setShowPaymentForm(false)}
                className="flex-1 border border-[#ddd6cb] px-4 py-3 text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingPayment || projects.length === 0}
                className="flex-1 bg-[#292a25] px-4 py-3 text-sm text-white disabled:opacity-50"
              >
                {savingPayment ? "Saving..." : "Save Payment"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
