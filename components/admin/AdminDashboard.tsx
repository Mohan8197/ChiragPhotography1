"use client";

import { useMemo, useState } from "react";

type Project = {
  id: string;
  client: string;
  event: string;
  date: string;
  venue: string;
  amount: number;
  paid: number;
  status: "Confirmed" | "Enquiry" | "Editing";
};

const initialProjects: Project[] = [
  { id: "CP-026", client: "Ananya & Rahul", event: "Wedding", date: "08 Nov 2026", venue: "The Tamarind Tree, Bengaluru", amount: 185000, paid: 75000, status: "Confirmed" },
  { id: "CP-025", client: "Meera Sharma", event: "Baby shower", date: "10 Nov 2026", venue: "White Petals, Bengaluru", amount: 42000, paid: 15000, status: "Confirmed" },
  { id: "CP-024", client: "Arjun Kumar", event: "Birthday", date: "12 Nov 2026", venue: "Indiranagar, Bengaluru", amount: 28000, paid: 0, status: "Enquiry" },
  { id: "CP-023", client: "Kavya & Nikhil", event: "Engagement", date: "14 Nov 2026", venue: "The Leela Palace, Bengaluru", amount: 68000, paid: 30000, status: "Editing" },
];

const money = (value: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);

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
  const [query, setQuery] = useState("");
  const [projects, setProjects] = useState(initialProjects);
  const [showNew, setShowNew] = useState(false);
  const [client, setClient] = useState("");
  const [event, setEvent] = useState("Wedding");
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");

  const filtered = useMemo(() => projects.filter((p) => [p.id, p.client, p.event, p.venue].join(" ").toLowerCase().includes(query.toLowerCase())), [projects, query]);

  function addProject(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!client.trim() || !date) return;
    setProjects((items) => [{ id: `CP-${String(27 + items.length - initialProjects.length).padStart(3, "0")}`, client: client.trim(), event, date: new Date(date + "T12:00:00").toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }), venue: "Venue to be confirmed", amount: Number(amount) || 0, paid: 0, status: "Enquiry" }, ...items]);
    setClient(""); setDate(""); setAmount(""); setShowNew(false); setActive("Projects & events");
  }

  const total = projects.reduce((sum, p) => sum + p.amount, 0);
  const received = projects.reduce((sum, p) => sum + p.paid, 0);

  return (
    <div className="min-h-screen bg-[#f6f4ef] text-[#22231f]">
      <div className="border-b border-[#e6e1d8] bg-[#fbfaf7] px-5 py-3 text-center text-[10px] font-semibold uppercase tracking-[.22em] text-[#8b7658]">Studio workspace · Preview mode · Sample records</div>
      <div className="mx-auto flex max-w-[1600px]">
        <aside className="hidden min-h-[calc(100vh-44px)] w-[250px] shrink-0 border-r border-[#e7e2d9] bg-[#f1eee8] px-5 py-7 lg:block">
          <div className="mb-10 px-2">
            <div className="font-serif text-[27px] leading-none">Chirag <span className="italic">Studio</span></div>
            <div className="mt-2 text-[9px] uppercase tracking-[.24em] text-[#8a8378]">Photography management</div>
          </div>
          <div className="mb-3 px-3 text-[9px] font-bold uppercase tracking-[.2em] text-[#9b9388]">Workspace</div>
          <nav className="space-y-1">
            {nav.map((item) => <button key={item.label} onClick={() => setActive(item.label)} className={`flex w-full items-center gap-3 rounded-sm px-3 py-3 text-left text-[12px] transition ${active === item.label ? "bg-[#292a25] text-white shadow-sm" : "text-[#625f58] hover:bg-white/70"}`}>
              <span className="w-5 text-center text-[15px]">{item.icon}</span>{item.label}
              {item.label === "Enquiries" && <span className="ml-auto rounded-full bg-[#d7c3a2] px-2 py-0.5 text-[9px] text-[#332b20]">3</span>}
            </button>)}
          </nav>
          <div className="mt-12 rounded-sm border border-[#dfd8cc] bg-[#f8f6f1] p-4">
            <div className="text-[9px] uppercase tracking-[.18em] text-[#8a8378]">Need a hand?</div>
            <p className="mt-2 font-serif text-[19px] leading-tight">Your studio, all in one place.</p>
            <p className="mt-2 text-[10px] leading-5 text-[#777168]">Customer, crew and event tools will live here.</p>
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-5 py-7 sm:px-8 lg:px-10 lg:py-9">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="mb-2 text-[9px] uppercase tracking-[.24em] text-[#968b7b]">Chirag Photography / Workspace</div>
              <h1 className="font-serif text-[36px] leading-none sm:text-[44px]">{active === "Overview" ? "Good morning, Chirag." : active}</h1>
              <p className="mt-2 text-[12px] text-[#827c72]">{active === "Overview" ? "Here’s what’s happening with your studio." : "Workspace preview — live data and permissions will be connected in the next phase."}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden rounded-full border border-[#e2ddd4] bg-white px-4 py-2 text-[10px] text-[#777168] sm:block">● Owner workspace</div>
              <button onClick={() => setShowNew(true)} className="rounded-sm bg-[#292a25] px-4 py-3 text-[10px] font-semibold uppercase tracking-[.12em] text-white transition hover:bg-[#494a42]">+ New project</button>
            </div>
          </div>

          {active === "Overview" ? (
          <div className="mb-8 grid grid-cols-2 gap-3 xl:grid-cols-4">
            {[
              ["Active projects", String(projects.filter(p => p.status !== "Enquiry").length).padStart(2, "0"), "Across current bookings"],
              ["Upcoming events", "08", "Next 30 days · sample"],
              ["Project value", money(total), "Total contract value"],
              ["Payments received", money(received), `${money(total - received)} outstanding`],
            ].map(([label, value, note], i) => <div key={label} className="border border-[#e6e1d8] bg-[#fbfaf7] p-4 sm:p-5">
              <div className="text-[9px] font-semibold uppercase tracking-[.16em] text-[#91897e]">{label}</div>
              <div className="mt-4 break-words font-serif text-[25px] sm:text-[30px]">{value}</div>
              <div className="mt-1 text-[10px] text-[#8b8479]">{note}</div>
              {i === 3 && <div className="mt-4 h-[3px] overflow-hidden bg-[#e8e3da]"><div className="h-full bg-[#a98e68]" style={{ width: total ? `${Math.min(100, received / total * 100)}%` : "0%" }} /></div>}
            </div>)}
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(260px,.8fr)]">
            <section className="min-w-0 border border-[#e6e1d8] bg-[#fbfaf7]">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e9e4dc] px-5 py-5">
                <div><h2 className="font-serif text-[25px]">Recent projects</h2><p className="mt-1 text-[10px] text-[#8b8479]">Bookings, enquiries and delivery status</p></div>
                <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search projects…" className="w-full border border-[#e4ded4] bg-white px-3 py-2 text-[11px] outline-none focus:border-[#a98e68] sm:w-48" />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[620px] text-left">
                  <thead><tr className="text-[9px] uppercase tracking-[.14em] text-[#938b80]"><th className="px-5 py-3 font-semibold">Client / ID</th><th className="px-3 py-3 font-semibold">Event date</th><th className="px-3 py-3 font-semibold">Value</th><th className="px-3 py-3 font-semibold">Balance</th><th className="px-5 py-3 font-semibold">Status</th></tr></thead>
                  <tbody>{filtered.map(p => <tr key={p.id} className="border-t border-[#eee9e1] text-[11px]">
                    <td className="px-5 py-4"><div className="font-semibold text-[#373832]">{p.client}</div><div className="mt-1 text-[9px] text-[#999186]">{p.id} · {p.event}</div></td>
                    <td className="px-3 py-4 text-[#69665f]">{p.date}</td>
                    <td className="px-3 py-4 tabular-nums">{money(p.amount)}</td>
                    <td className="px-3 py-4 tabular-nums">{money(p.amount-p.paid)}</td>
                    <td className="px-5 py-4"><span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[9px] ${p.status === "Confirmed" ? "bg-[#e6eee3] text-[#52694e]" : p.status === "Editing" ? "bg-[#eee8dc] text-[#806c4d]" : "bg-[#f3e8e3] text-[#96664f]"}`}>{p.status}</span></td>
                  </tr>)}</tbody>
                </table>
                {filtered.length === 0 && <p className="px-5 py-10 text-center text-[12px] text-[#8b8479]">No matching projects.</p>}
              </div>
              <div className="border-t border-[#e9e4dc] px-5 py-3 text-[9px] text-[#999186]">Sample data only — no customer records have been stored.</div>
            </section>

            <div className="space-y-6">
              <section className="border border-[#e6e1d8] bg-[#fbfaf7] p-5">
                <div className="flex items-center justify-between"><h2 className="font-serif text-[23px]">Next on the calendar</h2><button onClick={() => setActive("Calendar")} className="text-[9px] uppercase tracking-[.12em] text-[#8a7658]">View all ↗</button></div>
                <div className="mt-5 space-y-4">
                  {[["08","NOV","Ananya & Rahul","Wedding · 10:00 AM"],["10","NOV","Meera Sharma","Baby shower · 11:30 AM"],["12","NOV","Arjun Kumar","Birthday · 5:00 PM"]].map(([day,month,name,meta]) => <div key={name} className="flex gap-3 border-b border-[#eee9e1] pb-4 last:border-0 last:pb-0"><div className="w-11 shrink-0 text-center"><div className="font-serif text-[25px] leading-none">{day}</div><div className="mt-1 text-[8px] tracking-[.15em] text-[#948b7f]">{month}</div></div><div><div className="text-[11px] font-semibold">{name}</div><div className="mt-1 text-[9px] text-[#8b8479]">{meta}</div></div></div>)}
                </div>
              </section>
              <section className="bg-[#292a25] p-5 text-[#f7f4ee]">
                <div className="text-[9px] uppercase tracking-[.2em] text-[#c9b28e]">Studio checklist</div>
                <h2 className="mt-3 font-serif text-[25px] leading-tight">Build your workflow, one step at a time.</h2>
                <ul className="mt-4 space-y-3 text-[10px] text-[#d5d0c6]">{["Add customer & enquiry records","Create packages and quotations","Invite photographers & crew","Connect private NAS galleries"].map((s,i) => <li key={s} className="flex gap-2"><span className="text-[#c9b28e]">{String(i+1).padStart(2,"0")}</span>{s}</li>)}</ul>
              </section>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap justify-between gap-2 border-t border-[#e4ded4] pt-4 text-[9px] uppercase tracking-[.14em] text-[#a0998e]"><span>Chirag Photography · Bengaluru</span><span>Management workspace · Preview build</span></div>
          ) : (
            <section className="min-h-[520px] border border-[#e6e1d8] bg-[#fbfaf7] p-6 sm:p-8">
              <div className="text-[9px] uppercase tracking-[.2em] text-[#9b8a70]">Chirag Photography / {active}</div>
              <h2 className="mt-3 font-serif text-[30px]"> {active} </h2>
              <p className="mt-2 max-w-2xl text-[12px] leading-6 text-[#827c72]">This section now has its own workspace view. It is currently a layout preview with sample information; database saving, user login and role permissions are the next implementation steps.</p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {[
                  ["Workspace", active === "Customers" ? "Customer profiles and contact details" : active === "Projects & events" ? "Bookings, event details and delivery status" : active === "Enquiries" ? "New enquiries and follow-up status" : active === "Quotations" ? "Packages, estimates and quotation status" : active === "Payments" ? "Advances, instalments and outstanding balances" : active === "Team & assignments" ? "Photographer profiles and event assignments" : active === "Calendar" ? "Upcoming shoots, dates and reporting times" : active === "Galleries" ? "Private event albums and delivery status" : active === "Reports" ? "Business performance and project summaries" : "Studio preferences and access controls"],
                  ["Quick actions", "Add, review and update records will be enabled in the next build"],
                  ["Data status", "Preview only · No live customer or financial records are connected"]
                ].map(([label, value]) => <div key={label} className="border border-[#e6e1d8] bg-white p-5"><div className="text-[9px] font-semibold uppercase tracking-[.16em] text-[#91897e]">{label}</div><p className="mt-3 font-serif text-[19px] leading-snug">{value}</p></div>)}
              </div>
              <div className="mt-8 border-t border-[#e9e4dc] pt-5 text-[11px] text-[#8b8479]">Use the left menu to switch between workspace sections. Each menu item now opens a distinct section view.</div>
            </section>
          )}

        </main>
      </div>

      {showNew && <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true" aria-labelledby="new-project-title">
        <form onSubmit={addProject} className="w-full max-w-md border border-[#e6e1d8] bg-[#fbfaf7] p-6 shadow-2xl">
          <div className="flex items-start justify-between"><div><div className="text-[9px] uppercase tracking-[.2em] text-[#9b8a70]">Project intake</div><h2 id="new-project-title" className="mt-2 font-serif text-[30px]">New project</h2></div><button type="button" onClick={() => setShowNew(false)} className="text-xl text-[#81796e]" aria-label="Close">×</button></div>
          <label className="mt-5 block text-[10px] font-semibold uppercase tracking-[.12em] text-[#777168]">Customer name<input required value={client} onChange={e=>setClient(e.target.value)} className="mt-2 w-full border border-[#e1dbd1] bg-white px-3 py-3 text-[12px] normal-case tracking-normal outline-none focus:border-[#a98e68]" placeholder="Enter customer name" /></label>
          <div className="mt-4 grid grid-cols-2 gap-3"><label className="text-[10px] font-semibold uppercase tracking-[.12em] text-[#777168]">Event type<select value={event} onChange={e=>setEvent(e.target.value)} className="mt-2 w-full border border-[#e1dbd1] bg-white px-3 py-3 text-[11px] normal-case tracking-normal"><option>Wedding</option><option>Engagement</option><option>Birthday</option><option>Baby shower</option><option>Corporate</option><option>Other</option></select></label><label className="text-[10px] font-semibold uppercase tracking-[.12em] text-[#777168]">Event date<input required type="date" value={date} onChange={e=>setDate(e.target.value)} className="mt-2 w-full border border-[#e1dbd1] bg-white px-3 py-3 text-[11px] normal-case tracking-normal" /></label></div>
          <label className="mt-4 block text-[10px] font-semibold uppercase tracking-[.12em] text-[#777168]">Estimated value (₹)<input type="number" min="0" value={amount} onChange={e=>setAmount(e.target.value)} className="mt-2 w-full border border-[#e1dbd1] bg-white px-3 py-3 text-[12px] normal-case tracking-normal" placeholder="e.g. 50000" /></label>
          <p className="mt-4 text-[10px] leading-5 text-[#91897e]">Preview only. This form adds a temporary row in this browser session; it does not save to a database.</p>
          <div className="mt-5 flex gap-2"><button type="button" onClick={()=>setShowNew(false)} className="flex-1 border border-[#ddd6cb] px-4 py-3 text-[10px] uppercase tracking-[.12em]">Cancel</button><button type="submit" className="flex-1 bg-[#292a25] px-4 py-3 text-[10px] uppercase tracking-[.12em] text-white">Add project</button></div>
        </form>
      </div>}
    </div>
  );
}
