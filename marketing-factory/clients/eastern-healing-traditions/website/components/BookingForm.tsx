"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useUTMParams } from "@/lib/hooks/useUTMParams";
import { services } from "@/lib/data/services";

interface FormErrors {
  [key: string]: string;
}

export default function BookingForm() {
  const router = useRouter();
  const utm = useUTMParams();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  function validate(form: FormData): FormErrors {
    const errs: FormErrors = {};
    if (!form.get("firstName")) errs.firstName = "Required";
    if (!form.get("lastName")) errs.lastName = "Required";
    const email = form.get("email") as string;
    if (!email) errs.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = "Invalid email";
    const phone = form.get("phone") as string;
    if (!phone) errs.phone = "Required";
    else if (!/^[\d\s()+-]{7,}$/.test(phone))
      errs.phone = "Invalid phone number";
    if (!form.get("serviceInterest")) errs.serviceInterest = "Required";
    if (!form.get("preferredDate")) errs.preferredDate = "Required";
    if (!form.get("preferredTime")) errs.preferredTime = "Required";
    return errs;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const fieldErrors = validate(form);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);

    try {
      const body = {
        firstName: form.get("firstName"),
        lastName: form.get("lastName"),
        email: form.get("email"),
        phone: form.get("phone"),
        serviceInterest: form.get("serviceInterest"),
        preferredDate: form.get("preferredDate"),
        preferredTime: form.get("preferredTime"),
        message: form.get("message") || "",
        ...utm,
      };

      const res = await fetch("/api/forms/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        router.push("/thank-you");
      } else {
        const data = await res.json();
        setErrors({ form: data.message || "Something went wrong." });
      }
    } catch {
      setErrors({ form: "Something went wrong. Please call us at (224) 541-0022." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="First name" name="firstName" error={errors.firstName} />
        <Field label="Last name" name="lastName" error={errors.lastName} />
      </div>

      <Field label="Email" name="email" type="email" error={errors.email} />
      <Field label="Phone" name="phone" type="tel" error={errors.phone} />

      <div>
        <label className="label block mb-2">Service of interest</label>
        <select
          name="serviceInterest"
          defaultValue=""
          className={`w-full px-4 py-3 border bg-white text-secondary focus:ring-1 focus:ring-primary focus:border-primary outline-none transition ${
            errors.serviceInterest ? "border-red-400" : "border-warm-200"
          }`}
        >
          <option value="" disabled>Select a service...</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
          <option value="consultation">General Consultation</option>
        </select>
        {errors.serviceInterest && <p className="text-red-500 text-xs mt-1">{errors.serviceInterest}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Preferred date" name="preferredDate" type="date" error={errors.preferredDate} />
        <div>
          <label className="label block mb-2">Preferred time</label>
          <select
            name="preferredTime"
            defaultValue=""
            className={`w-full px-4 py-3 border bg-white text-secondary focus:ring-1 focus:ring-primary focus:border-primary outline-none transition ${
              errors.preferredTime ? "border-red-400" : "border-warm-200"
            }`}
          >
            <option value="" disabled>Select...</option>
            <option value="morning">Morning (9am - 12pm)</option>
            <option value="afternoon">Afternoon (12pm - 4pm)</option>
            <option value="evening">Evening (4pm - 7pm)</option>
          </select>
          {errors.preferredTime && <p className="text-red-500 text-xs mt-1">{errors.preferredTime}</p>}
        </div>
      </div>

      <div>
        <label className="label block mb-2">Message (optional)</label>
        <textarea
          name="message"
          rows={4}
          className="w-full px-4 py-3 border border-warm-200 bg-white text-secondary focus:ring-1 focus:ring-primary focus:border-primary outline-none transition"
          placeholder="Tell us about your condition..."
        />
      </div>

      {/* Hidden UTM fields */}
      <input type="hidden" name="utm_source" value={utm.utm_source} />
      <input type="hidden" name="utm_medium" value={utm.utm_medium} />
      <input type="hidden" name="utm_campaign" value={utm.utm_campaign} />
      <input type="hidden" name="utm_content" value={utm.utm_content} />
      <input type="hidden" name="utm_term" value={utm.utm_term} />

      {errors.form && (
        <p className="text-red-500 text-sm bg-red-50 p-3">{errors.form}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-accent hover:bg-accent-dark disabled:opacity-60 text-white py-3.5 text-sm tracking-label uppercase transition-colors"
      >
        {submitting ? "Submitting..." : "Request Appointment"}
      </button>

      <p className="text-xs text-secondary-light text-center">
        We'll contact you within 24 hours to confirm.
      </p>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  error,
}: {
  label: string;
  name: string;
  type?: string;
  error?: string;
}) {
  return (
    <div>
      <label className="label block mb-2">{label}</label>
      <input
        type={type}
        name={name}
        className={`w-full px-4 py-3 border bg-white text-secondary focus:ring-1 focus:ring-primary focus:border-primary outline-none transition ${
          error ? "border-red-400" : "border-warm-200"
        }`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
