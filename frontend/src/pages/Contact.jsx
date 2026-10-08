import { useState } from "react";
import { Camera, Music2 } from "lucide-react";
import { submitContact } from "../services/api";
import SectionHeader from "../components/SectionHeader";
import { useSettings } from "../hooks/useSettings";

export default function Contact() {
  const { settings } = useSettings();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      await submitContact(form);
      setStatus("success");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err.response?.data?.message ||
          "Failed to send message. Please try again.",
      );
    }
  };

  return (
    <main className="pt-16">
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact info */}
            <div className="w-full md:col-span-2 md:mx-auto md:max-w-xl">
              <SectionHeader
                label="Contact"
                title="Get in touch"
                center={true}
              />
              <p className="text-gray-600 text-center mb-8">
                We'd love to hear from you!
                {/* Fill in the form and we'll be in
                touch shortly. */}
              </p>
              <a
                href="tel:0929903372"
                className="shadow-sm mt-4 mb-4 flex items-center gap-3 rounded-xl bg-emerald-50 px-4 py-3 font-semibold text-emerald-800 transition-colors hover:bg-emerald-100"
                aria-label="Call Sparkle Playschool at 0929903372"
              >
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-lg text-white"
                >
                  📞
                </span>
                0929903372
              </a>
              <div className="mb-8 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <h2 className="mb-4 font-semibold text-gray-900">Follow us</h2>
                <div className="grid grid-cols-3 gap-3">
                  <a
                    href="https://www.facebook.com/people/Sparkle-Playschool/61561514316027/"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Follow Sparkle Playschool on Facebook"
                    className="flex flex-col items-center gap-2 rounded-xl bg-gray-50 px-2 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-700"
                  >
                    <span
                      aria-hidden="true"
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white"
                    >
                      f
                    </span>
                    Facebook
                  </a>
                  <a
                    href="https://www.tiktok.com/@sparkle.playschool"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Follow Sparkle Playschool on TikTok"
                    className="flex flex-col items-center gap-2 rounded-xl bg-gray-50 px-2 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 hover:text-gray-950"
                  >
                    <span
                      aria-hidden="true"
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-950 text-white"
                    >
                      <Music2 size={20} />
                    </span>
                    TikTok
                  </a>
                  <a
                    href="https://www.instagram.com/sparkle_playschool"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Follow Sparkle Playschool on Instagram"
                    className="flex flex-col items-center gap-2 rounded-xl bg-gray-50 px-2 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-pink-50 hover:text-pink-700"
                  >
                    <span
                      aria-hidden="true"
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 text-white"
                    >
                      <Camera size={20} />
                    </span>
                    Instagram
                  </a>
                </div>
              </div>

              <ul className="space-y-4 text-gray-700">
                {settings?.phone && (
                  <li className="flex items-start gap-3">
                    <span className="text-xl">📞</span>
                    <span>{settings.phone}</span>
                  </li>
                )}
                {settings?.email && (
                  <li className="flex items-start gap-3">
                    <span className="text-xl">📧</span>
                    <span>{settings.email}</span>
                  </li>
                )}
                {settings?.address && (
                  <li className="flex items-start gap-3">
                    <span className="text-xl">📍</span>
                    <span>{settings.address}</span>
                  </li>
                )}
              </ul>
            </div>

            {/* Form */}
            {/* <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              {status === "success" ? (
                <div className="text-center py-8">
                  <div className="text-5xl mb-4">✅</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Message sent!
                  </h3>
                  <p className="text-gray-600">
                    We'll get back to you shortly.
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="mt-6 text-emerald-600 font-semibold hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Name <span aria-hidden="true">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Your full name"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Phone
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="0911..."
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Subject
                    </label>
                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      value={form.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Enrollment inquiry..."
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Message <span aria-hidden="true">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      value={form.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                      placeholder="Tell us about your child..."
                    />
                  </div>

                  {status === "error" && (
                    <p role="alert" className="text-red-600 text-sm">
                      {errorMsg}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full py-3.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                  >
                    {status === "loading" ? "Sending…" : "Send Message"}
                  </button>
                </form>
              )}
            </div> */}
          </div>
          <section
            className="max-w-5xl mx-auto mt-16"
            aria-labelledby="location-heading"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-5">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">
                  Find Us
                </p>
                <h2
                  id="location-heading"
                  className="text-2xl font-bold text-gray-900 mt-1"
                >
                  Visit Sparkle Playschool
                </h2>
              </div>
              <a
                href="https://maps.app.goo.gl/jskDR3aA3pUMrQu3A"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-emerald-700"
              >
                Get directions
              </a>
            </div>
            <div className="overflow-hidden rounded-3xl border border-gray-100 shadow-sm">
              <iframe
                title="Sparkle Playschool location map"
                src="https://www.google.com/maps?q=8.9846718,38.726695&z=16&output=embed"
                className="h-80 w-full sm:h-96"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
