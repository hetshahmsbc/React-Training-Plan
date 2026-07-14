import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

// The shape of our contact form data.
interface ContactForm {
  name: string;
  email: string;
  message: string;
}

const EMPTY_FORM: ContactForm = { name: "", email: "", message: "" };

// Static contact details shown alongside the form.
const CONTACT_INFO = [
  { icon: "📍", label: "Address", value: "221B Market Street, San Francisco, CA" },
  { icon: "✉️", label: "Email", value: "support@shopverse.example" },
  { icon: "📞", label: "Phone", value: "+1 (555) 012-3456" },
  { icon: "🕘", label: "Hours", value: "Mon–Fri, 9am–6pm" },
];

export function ContactPage() {
  const [form, setForm] = useState<ContactForm>(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);

  // One handler updates whichever field changed, using its `name` attribute.
  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault(); // stop the browser from reloading the page
    // In a real app you'd send this to a server here (e.g. fetch POST).
    setSubmitted(true);
    setForm(EMPTY_FORM);
  }

  return (
    <div className="page">
      <section className="page__hero">
        <h1>Get in touch</h1>
        <p>
          Have a question about an order, a product, or a partnership? We'd love
          to hear from you.
        </p>
      </section>

      <div className="contact">
        {/* ---------- Contact details ---------- */}
        <aside className="contact__info">
          {CONTACT_INFO.map((info) => (
            <div key={info.label} className="contact__item">
              <span className="contact__icon">{info.icon}</span>
              <div>
                <p className="contact__label">{info.label}</p>
                <p className="contact__value">{info.value}</p>
              </div>
            </div>
          ))}
        </aside>

        {/* ---------- Form ---------- */}
        <form className="contact__form" onSubmit={handleSubmit}>
          {submitted && (
            <p className="contact__success" role="status">
              ✅ Thanks! Your message has been sent. We'll be in touch soon.
            </p>
          )}

          <label className="field">
            <span>Name</span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
              required
            />
          </label>

          <label className="field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </label>

          <label className="field">
            <span>Message</span>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="How can we help?"
              rows={5}
              required
            />
          </label>

          <button type="submit" className="btn btn--lg">
            Send message
          </button>
        </form>
      </div>
    </div>
  );
}
