import React, { useState } from "react";

export default function App() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    if (!form.name || !form.email || !form.phone || !form.message) {
      setStatus("All fields are required.");
      return;
    }
    if (!validateEmail(form.email)) {
      setStatus("Please enter a valid email.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("https://vernanbackend.ezlab.in/api/contact-us/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, message: form.message })
      });
      if (res.ok) {
        setStatus("Form Submitted ✅");
        setForm({ name: "", email: "", phone: "", message: "" });
      } else {
        const text = await res.text();
        setStatus("Failed to submit. Server returned status " + res.status + " - " + (text || "response"));
      }
    } catch (err) {
      setStatus("Network error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white rounded-2xl shadow p-6">
        <h1 className="text-2xl font-semibold text-center text-blue-600 mb-4">Contact Us</h1>

        <label className="block text-sm font-medium mb-1">Name</label>
        <input name="name" value={form.name} onChange={handleChange}
          className="w-full p-2 mb-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200" />

        <label className="block text-sm font-medium mb-1">Email</label>
        <input name="email" value={form.email} onChange={handleChange}
          className="w-full p-2 mb-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200" />

        <label className="block text-sm font-medium mb-1">Phone</label>
        <input name="phone" value={form.phone} onChange={handleChange}
          className="w-full p-2 mb-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200" />

        <label className="block text-sm font-medium mb-1">Message</label>
        <textarea name="message" value={form.message} onChange={handleChange} rows="4"
          className="w-full p-2 mb-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200" />

        <button type="submit" disabled={loading}
          className={"w-full py-2 rounded text-white " + (loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700")}>
          {loading ? "Submitting..." : "Submit"}
        </button>

        {status && <p className="mt-3 text-center text-sm text-gray-700">{status}</p>}

        <p className="mt-4 text-xs text-gray-500 text-center">Responsive demo — mobile & desktop friendly</p>
      </form>
    </div>
  );
}
