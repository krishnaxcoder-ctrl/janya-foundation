'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function ContactPage() {
  const [showDonationForm, setShowDonationForm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    city: '',
    state: '',
    subject: '',
    message: '',
    services: []
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const serviceOptions = [
    { id: 'donation', label: 'Donation Inquiry' },
    { id: 'marathon', label: 'Marathon Registration' },
    { id: 'volunteer', label: 'Volunteering' },
    { id: 'partnership', label: 'Partnership' },
    { id: 'csr', label: 'CSR Programs' },
    { id: 'other', label: 'Other' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to send message');
      }

      setSubmitted(true);
    } catch (err) {
      console.error('Contact form error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleServiceChange = (serviceId) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter(id => id !== serviceId)
        : [...prev.services, serviceId]
    }));
  };

  return (
    <div
      className="min-h-screen bg-cover bg-no-repeat bg-fixed"
      style={{ backgroundImage: 'url(https://img.freepik.com/free-vector/elegant-flowing-pink-business-wave-background_1035-23193.jpg?w=1480)', backgroundPosition: 'center center' }}
    >
      {/* Header */}
      <Header setShowDonationForm={setShowDonationForm} />

      {/* Hero Header */}
      <div className="max-w-[1360px] mx-auto px-5 sm:px-6 lg:px-10 pt-24 pb-4 sm:pt-28 sm:pb-6">
        <div className="text-left">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2 tracking-tight">
            Contact our team
          </h1>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl">
            Got any questions about our programs, donations, or marathon? We're here to help.
            Reach out to our friendly team and we'll respond within 24 hours.
          </p>
        </div>
      </div>

      <main className="max-w-[1360px] mx-auto px-5 sm:px-6 lg:px-10 py-12 sm:py-4 relative z-10">

        {submitted ? (
          <div className="max-w-md mx-auto text-center py-12">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Message sent!</h2>
            <p className="text-gray-600 mb-6">Thank you for reaching out. We'll get back to you within 24 hours.</p>
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({ firstName: '', lastName: '', email: '', phone: '', company: '', city: '', state: '', subject: '', message: '', services: [] });
              }}
              className="text-pink-600 hover:text-pink-700 font-medium"
            >
              Send another message
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Contact Info Cards - Top Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Call */}
              <a
                href="tel:+919321496142"
                className="group block p-4 sm:p-5 bg-white border border-gray-200 rounded-2xl hover:border-pink-200 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Call us</h3>
                    <p className="text-xs sm:text-sm text-gray-500">Mon-Sat 9am to 6pm</p>
                  </div>
                  <div className="w-10 h-10 sm:w-11 sm:h-11 bg-pink-100 rounded-xl flex items-center justify-center group-hover:bg-pink-200 transition-colors flex-shrink-0">
                    <svg className="w-5 h-5 sm:w-5 sm:h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                </div>
                <p className="text-xs sm:text-sm font-medium text-pink-600">+91 93214 96142</p>
              </a>

              {/* Email */}
              <a
                href="mailto:janyafoundation.04@gmail.com"
                className="group block p-4 sm:p-5 bg-white border border-gray-200 rounded-2xl hover:border-blue-200 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Email us</h3>
                    <p className="text-xs sm:text-sm text-gray-500">We'll respond in 24h</p>
                  </div>
                  <div className="w-10 h-10 sm:w-11 sm:h-11 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors flex-shrink-0">
                    <svg className="w-5 h-5 sm:w-5 sm:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <p className="text-xs sm:text-sm font-medium text-blue-600 truncate">janyafoundation.04@gmail.com</p>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/919321496142"
                target="_blank"
                rel="noopener noreferrer"
                className="group block p-4 sm:p-5 bg-white border border-gray-200 rounded-2xl hover:border-green-200 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">WhatsApp</h3>
                    <p className="text-xs sm:text-sm text-gray-500">Chat instantly</p>
                  </div>
                  <div className="w-10 h-10 sm:w-11 sm:h-11 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors flex-shrink-0">
                    <svg className="w-5 h-5 sm:w-5 sm:h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                </div>
                <p className="text-xs sm:text-sm font-medium text-green-600">+91 93214 96142</p>
              </a>

              {/* Location */}
              <a
                href="https://maps.google.com/?q=Navi+Mumbai+Maharashtra+India"
                target="_blank"
                rel="noopener noreferrer"
                className="group block p-4 sm:p-5 bg-white border border-gray-200 rounded-2xl hover:border-purple-200 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Visit us</h3>
                    <p className="text-xs sm:text-sm text-gray-500">Come say hello</p>
                  </div>
                  <div className="w-10 h-10 sm:w-11 sm:h-11 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors flex-shrink-0">
                    <svg className="w-5 h-5 sm:w-5 sm:h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-xs sm:text-sm font-medium text-purple-600">Navi Mumbai, India</p>
              </a>
            </div>

            {/* Contact Form - 2 Column Form + Submit Column */}
            <div>
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200">
                <form onSubmit={handleSubmit}>
                  {error && (
                    <div className="bg-red-50 text-red-600 px-3 py-2 rounded-lg text-sm mb-3">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Left 2 Columns - Form Fields */}
                    <div className="lg:col-span-2 space-y-3">
                      <h2 className="text-sm font-medium text-gray-900 pb-1 border-b border-gray-100">Send us a message</h2>
                      {/* Row 1: First Name, Last Name */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label htmlFor="firstName" className="text-xs">
                            First name <span className="text-pink-500">*</span>
                          </Label>
                          <Input
                            id="firstName"
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="John"
                            required
                            className="h-9 text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="lastName" className="text-xs">
                            Last name <span className="text-pink-500">*</span>
                          </Label>
                          <Input
                            id="lastName"
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Doe"
                            required
                            className="h-9 text-sm"
                          />
                        </div>
                      </div>

                      {/* Row 2: Email, Phone */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label htmlFor="email" className="text-xs">
                            Email <span className="text-pink-500">*</span>
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="john@example.com"
                            required
                            className="h-9 text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="phone" className="text-xs">
                            Phone <span className="text-pink-500">*</span>
                          </Label>
                          <div className="flex">
                            <div className="flex items-center px-2 h-9 border border-r-0 border-input rounded-l-md bg-muted text-muted-foreground">
                              <span className="text-xs font-medium">+91</span>
                            </div>
                            <Input
                              id="phone"
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              placeholder="98765 43210"
                              required
                              className="rounded-l-none h-9 text-sm"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Row 3: Company, Subject */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label htmlFor="company" className="text-xs">Company</Label>
                          <Input
                            id="company"
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            placeholder="Your company"
                            className="h-9 text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="subject" className="text-xs">Subject</Label>
                          <Select
                            value={formData.subject}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, subject: value }))}
                          >
                            <SelectTrigger className="h-9 text-sm">
                              <SelectValue placeholder="Select topic" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="donation">Donation Inquiry</SelectItem>
                              <SelectItem value="marathon">Marathon Registration</SelectItem>
                              <SelectItem value="volunteer">Volunteering</SelectItem>
                              <SelectItem value="partnership">Partnership</SelectItem>
                              <SelectItem value="csr">CSR Programs</SelectItem>
                              <SelectItem value="media">Media / Press</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Row 4: City, State */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label htmlFor="city" className="text-xs">City</Label>
                          <Input
                            id="city"
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="Mumbai"
                            className="h-9 text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="state" className="text-xs">State</Label>
                          <Input
                            id="state"
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            placeholder="Maharashtra"
                            className="h-9 text-sm"
                          />
                        </div>
                      </div>

                      {/* Row 5: Interest, Message */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs">Interest</Label>
                          <Select
                            value={formData.services[0] || ''}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, services: [value] }))}
                          >
                            <SelectTrigger className="h-9 text-sm">
                              <SelectValue placeholder="Select interest" />
                            </SelectTrigger>
                            <SelectContent>
                              {serviceOptions.map((service) => (
                                <SelectItem key={service.id} value={service.id}>{service.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="message" className="text-xs">Message</Label>
                          <Textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="How can we help you?"
                            className="resize-none text-sm min-h-[36px]"
                            rows={1}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Secure & Submit */}
                    <div className="flex flex-col justify-start lg:border-l lg:border-gray-100 lg:pl-5">
                      <div className="bg-gradient-to-br from-gray-50 to-green-50/50 rounded-xl p-4 space-y-4">
                        {/* Header */}
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">Secure & Private</p>
                            <p className="text-[10px] text-green-600 font-medium">256-bit SSL encrypted</p>
                          </div>
                        </div>

                        {/* Trust Points */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <svg className="w-3.5 h-3.5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span>No spam, ever</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <svg className="w-3.5 h-3.5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span>Reply within 24 hours</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <svg className="w-3.5 h-3.5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span>Data never shared</span>
                          </div>
                        </div>

                        {/* Submit Button */}
                        <Button
                          type="submit"
                          disabled={loading}
                          className="bg-pink-600 hover:bg-pink-700 text-white h-11 text-sm w-full font-medium shadow-sm"
                        >
                          {loading ? (
                            <>
                              <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              Sending...
                            </>
                          ) : (
                            <>
                              Send message
                              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                              </svg>
                            </>
                          )}
                        </Button>

                        {/* Footer Note */}
                        <p className="text-[10px] text-center text-gray-400">
                          By submitting, you agree to our{' '}
                          <Link href="/privacy-policy" className="text-pink-500 hover:underline">Privacy Policy</Link>
                        </p>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
