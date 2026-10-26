import React, { useState } from 'react'
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react'
import { useToast } from '../../contexts/ToastContext'

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)
  const { success } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
    success('Thank you! Your message has been dispatched to our care team.')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="text-center space-y-3 mb-12">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#267A50]">
          Get in Touch
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-[#29212A]">
          We’re Here for Your Ritual
        </h1>
        <p className="text-xs sm:text-sm text-[#71676D] max-w-md mx-auto leading-relaxed">
          Have questions about formulations, your order, or skin compatibility? Our specialists are delighted to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Information */}
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-white border border-[#EAE3E5]">
            <div className="w-10 h-10 rounded-xl bg-[#FFF0F5] text-[#267A50] flex items-center justify-center mb-3">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-sm text-[#29212A]">Email Inquiries</h3>
            <p className="text-xs text-[#71676D] mt-1">support@glowvia.com</p>
            <p className="text-[11px] text-[#71676D] mt-0.5">Response within 24 hours</p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#EAE3E5]">
            <div className="w-10 h-10 rounded-xl bg-[#FFF0F5] text-[#267A50] flex items-center justify-center mb-3">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-sm text-[#29212A]">Customer Helpline</h3>
            <p className="text-xs text-[#71676D] mt-1">+91 1800-GLOW-VIA</p>
            <p className="text-[11px] text-[#71676D] mt-0.5">Mon–Sat, 10 AM – 7 PM IST</p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#EAE3E5]">
            <div className="w-10 h-10 rounded-xl bg-[#FFF0F5] text-[#267A50] flex items-center justify-center mb-3">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-sm text-[#29212A]">Studio Location</h3>
            <p className="text-xs text-[#71676D] mt-1">Glowvia Atelier, Bandra West, Mumbai, Maharashtra 400050</p>
          </div>
        </div>

        {/* Message Form */}
        <div className="md:col-span-2 bg-white rounded-3xl border border-[#EAE3E5] p-6 sm:p-8 shadow-xs">
          {sent ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#FFF0F5] text-[#267A50] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-semibold text-lg text-[#29212A]">
                Message Received
              </h3>
              <p className="text-xs text-[#71676D] max-w-sm mx-auto">
                Thank you for reaching out. A Glowvia skincare advisor will respond to {email} shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold uppercase text-[#29212A] mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Aditi Sharma"
                    className="w-full p-2.5 rounded-xl border border-[#EAE3E5] focus:outline-none focus:border-[#267A50]"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase text-[#29212A] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full p-2.5 rounded-xl border border-[#EAE3E5] focus:outline-none focus:border-[#267A50]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold uppercase text-[#29212A] mb-1">
                  Subject / Topic
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Order inquiry, ingredient question, etc."
                  className="w-full p-2.5 rounded-xl border border-[#EAE3E5] focus:outline-none focus:border-[#267A50]"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-[#29212A] mb-1">
                  Message
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we assist your skincare ritual today?"
                  className="w-full p-2.5 rounded-xl border border-[#EAE3E5] focus:outline-none focus:border-[#267A50]"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-[#267A50] hover:bg-[#185C3A] text-white font-semibold text-xs uppercase tracking-wider transition-colors shadow-2xs flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Message</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

