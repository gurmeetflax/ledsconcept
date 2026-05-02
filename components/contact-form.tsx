"use client";

import { useState } from "react";

const sectors = ["Architectural", "Events", "Nightclubs", "Other"];

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError(null);
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to send");
      setStatus("ok");
      e.currentTarget.reset();
    } catch (err) {
      setStatus("error");
      setError((err as Error).message);
    }
  }

  if (status === "ok") {
    return (
      <div className="rounded-2xl border border-white/15 bg-white/[0.03] p-8">
        <h2 className="font-display text-2xl">Thanks — we got it.</h2>
        <p className="mt-2 text-white/70">We'll be in touch within one business day.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input type="text" name="company_website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="name" label="Name" required />
        <Field name="email" type="email" label="Email" required />
        <Field name="phone" label="Phone" />
        <Field name="company" label="Company" />
      </div>
      <div>
        <label className="mb-1 block text-xs uppercase tracking-widest text-white/50">Sector</label>
        <select
          name="sector"
          defaultValue=""
          className="w-full rounded-xl border border-white/15 bg-transparent px-4 py-3 text-sm focus:border-white focus:outline-none"
        >
          <option value="" disabled>Choose a sector</option>
          {sectors.map((s) => (
            <option key={s} value={s} className="bg-ink">{s}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-xs uppercase tracking-widest text-white/50">Message</label>
        <textarea
          name="message"
          required
          rows={5}
          className="w-full rounded-xl border border-white/15 bg-transparent px-4 py-3 text-sm focus:border-white focus:outline-none"
          placeholder="Tell us about your project, scope, timing…"
        />
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-full bg-neon-grad px-6 py-3 text-sm font-medium text-ink disabled:opacity-60"
      >
        {status === "loading" ? "Sending…" : "Send enquiry"}
      </button>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs uppercase tracking-widest text-white/50">
        {label}{required && <span className="text-neon-magenta"> *</span>}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full rounded-xl border border-white/15 bg-transparent px-4 py-3 text-sm focus:border-white focus:outline-none"
      />
    </div>
  );
}
