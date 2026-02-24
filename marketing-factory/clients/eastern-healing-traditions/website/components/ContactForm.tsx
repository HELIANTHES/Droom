"use client";

import { useState, FormEvent } from "react";
import { useUTMParams } from "@/lib/hooks/useUTMParams";

interface FormErrors {
  [key: string]: string;
}

export default function ContactForm() {
  const utm = useUTMParams();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const errs: FormErrors = {};

    if (!form.get("name")) errs.name = "Required";
    const email = form.get("email") as string;
    if (!email) errs.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Invalid email";
    if (!form.get("message")) errs.message = "Required";

    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setSubmitting(true);

    try {
      const body = {
        name: form.get("name"),
        email: form.get("email"),
        message: form.get("message"),
        ...utm,
      };
      const res = await fetch("/api/forms/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setSuccess(true);
        (e.target as HTMLFormElement).reset();
      } else {
        setErrors({ form: "Something went wrong." });
      }
    } catch {
      setErrors({ form: "Something went wrong. Please call (224) 541-0022." });
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="bg-primary/5 p-8 text-center">
        <p className="font-serif text-xl text-secondary mb-2">Message sent</p>
        <p className="text-secondary-light text-sm">
          We'll get back to you within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div>
        <label className="label block mb-2">Name</label>
        <input
          type="text"
          name="name"
          className={`w-full px-4 py-3 border bg-white text-secondary focus:ring-1 focus:ring-primary focus:border-primary outline-none transition ${
            errors.name ? "border-red-400" : "border-warm-200"
          }`}
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>

      <div>
        <label className="label block mb-2">Email</label>
        <input
          type="email"
          name="email"
          className={`w-full px-4 py-3 border bg-white text-secondary focus:ring-1 focus:ring-primary focus:border-primary outline-none transition ${
            errors.email ? "border-red-400" : "border-warm-200"
          }`}
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>

      <div>
        <label className="label block mb-2">Message</label>
        <textarea
          name="message"
          rows={5}
          className={`w-full px-4 py-3 border bg-white text-secondary focus:ring-1 focus:ring-primary focus:border-primary outline-none transition ${
            errors.message ? "border-red-400" : "border-warm-200"
          }`}
          placeholder="How can we help?"
        />
        {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
      </div>

      {errors.form && <p className="text-red-500 text-sm bg-red-50 p-3">{errors.form}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-primary hover:bg-primary-dark disabled:opacity-60 text-white py-3 text-sm tracking-label uppercase transition-colors"
      >
        {submitting ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
