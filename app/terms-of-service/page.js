'use client';

import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Page Title */}
      <div className="pt-24 sm:pt-28 pb-4 sm:pb-5 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[10px] sm:text-xs text-gray-400 mb-0.5">Last updated: {new Date().toLocaleDateString()}</p>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
            Terms of Service
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="border border-gray-200 rounded-2xl p-6 md:p-10 bg-white shadow-sm">

        {/* Quick Navigation */}
        <div className="bg-gray-50 rounded-xl p-5 mb-8 border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Quick Navigation</h3>
          <div className="flex flex-wrap gap-2">
            <a href="#acceptance" className="text-xs bg-white text-gray-700 border border-gray-300 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors">1. Acceptance</a>
            <a href="#about" className="text-xs bg-white text-gray-700 border border-gray-300 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors">2. About Us</a>
            <a href="#donations" className="text-xs bg-white text-gray-700 border border-gray-300 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors">3. Donations</a>
            <a href="#marathon" className="text-xs bg-pink-500 text-white px-3 py-1.5 rounded-full hover:bg-pink-600 transition-colors font-medium">4. Marathon T&C</a>
            <a href="#contact" className="text-xs bg-white text-gray-700 border border-gray-300 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors">10. Contact</a>
          </div>
        </div>

        <div className="space-y-8">

          <section id="acceptance" className="scroll-mt-20">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 text-sm font-bold">1</span>
              <h2 className="text-xl font-bold text-gray-900">Acceptance of Terms</h2>
            </div>
            <p className="text-gray-600 leading-relaxed pl-11">
              By accessing and using the Janya Foundation website and services, you accept and agree
              to be bound by the terms and provision of this agreement. If you do not agree to abide
              by the above, please do not use this service.
            </p>
          </section>

          <hr className="border-gray-100" />

          <section id="about" className="scroll-mt-20">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 text-sm font-bold">2</span>
              <h2 className="text-xl font-bold text-gray-900">About Janya Foundation</h2>
            </div>
            <div className="pl-11">
              <p className="text-gray-600 leading-relaxed mb-4">
                Janya Foundation is a registered non-profit organization dedicated to:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-gray-600">
                  <span className="text-pink-500 mt-1">•</span>
                  Breast cancer awareness and support
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <span className="text-pink-500 mt-1">•</span>
                  Education for underprivileged children
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <span className="text-pink-500 mt-1">•</span>
                  Women's empowerment and income generation
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <span className="text-pink-500 mt-1">•</span>
                  Menstrual hygiene education and support
                </li>
              </ul>
            </div>
          </section>

          <hr className="border-gray-100" />

          <section id="donations" className="scroll-mt-20">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 text-sm font-bold">3</span>
              <h2 className="text-xl font-bold text-gray-900">Donations</h2>
            </div>
            <div className="pl-11">
              <p className="text-gray-600 leading-relaxed mb-4">
                When you make a donation to Janya Foundation:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-gray-600">
                  <span className="text-pink-500 mt-1">•</span>
                  All donations are voluntary and non-refundable unless required by law
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <span className="text-pink-500 mt-1">•</span>
                  Donations will be used for the charitable purposes of the organization
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <span className="text-pink-500 mt-1">•</span>
                  You will receive a receipt for tax purposes where applicable
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <span className="text-pink-500 mt-1">•</span>
                  Recurring donations can be cancelled at any time
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <span className="text-pink-500 mt-1">•</span>
                  We reserve the right to refuse donations in certain circumstances
                </li>
              </ul>
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* Marathon Terms & Conditions - Highlighted Section */}
          <section id="marathon" className="scroll-mt-20 bg-gradient-to-br from-pink-50 to-white rounded-2xl p-6 border border-pink-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-500 text-white text-sm font-bold">4</span>
              <h2 className="text-xl font-bold text-pink-600">Janya Foundation Marathon 2026: Terms & Conditions</h2>
            </div>

            <div className="space-y-6 pl-2">
              <div className="bg-white rounded-xl p-5 border border-pink-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-pink-500">4.1</span> Age Requirements and Guardian Consent
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-gray-600 text-sm">
                    <span className="text-pink-500 mt-1">•</span>
                    Participants under the age of 16 must have their registration completed by a parent or legal guardian.
                  </li>
                  <li className="flex items-start gap-2 text-gray-600 text-sm">
                    <span className="text-pink-500 mt-1">•</span>
                    By registering a minor, the guardian acknowledges that the minor is physically capable of participating.
                  </li>
                  <li className="flex items-start gap-2 text-gray-600 text-sm">
                    <span className="text-pink-500 mt-1">•</span>
                    A parent or legal guardian must accompany runners below the age of 16 at the event venue and takes full responsibility for their safety and conduct throughout the event.
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-5 border border-pink-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-pink-500">4.2</span> Assumption of Risk and Liability
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Participation in the marathon involves physical activity that carries inherent risks. By registering, every participant (or their guardian) acknowledges these risks.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-gray-600 text-sm">
                    <span className="text-pink-500 mt-1">•</span>
                    <span><strong className="text-gray-700">Self-Responsibility:</strong> Each runner, regardless of age, is 100% responsible for their own health and safety.</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-600 text-sm">
                    <span className="text-pink-500 mt-1">•</span>
                    <span><strong className="text-gray-700">Waiver of Liability:</strong> Janya Foundation, its organizing team, sponsors, and volunteers shall not be held liable for any injury, illness, accident, permanent disability, or fatality that may occur during or after the event.</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-600 text-sm">
                    <span className="text-pink-500 mt-1">•</span>
                    Participants are responsible for any loss or damage to personal belongings.
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-5 border border-pink-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-pink-500">4.3</span> Physical Fitness and Health
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-gray-600 text-sm">
                    <span className="text-pink-500 mt-1">•</span>
                    <span><strong className="text-gray-700">Voluntary Participation:</strong> Janya Foundation and its team do not force or compel any individual to participate. Participation is entirely voluntary.</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-600 text-sm">
                    <span className="text-pink-500 mt-1">•</span>
                    <span><strong className="text-gray-700">Medical Fitness:</strong> It is the sole responsibility of the participant to ensure they are medically fit to run. We strongly recommend a medical check-up before participating.</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-600 text-sm">
                    <span className="text-pink-500 mt-1">•</span>
                    <span><strong className="text-gray-700">Right to Withdraw:</strong> If a participant feels unwell or physically unfit at any point before or during the race, they must withdraw immediately. The organizers reserve the right to remove any participant from the marathon who appears to be in medical distress.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-5 border border-pink-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-pink-500">4.4</span> Indemnity
                </h3>
                <p className="text-gray-600 text-sm">
                  By agreeing to these terms, the participant (or guardian) agrees to indemnify and hold harmless the Janya Foundation against all claims, costs, or damages arising from the participant's involvement in the marathon.
                </p>
              </div>

              <div className="bg-white rounded-xl p-5 border border-pink-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-pink-500">4.5</span> Code of Conduct & Disqualification
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-gray-600 text-sm">
                    <span className="text-pink-500 mt-1">•</span>
                    All participants must conduct themselves in a respectful and sportsmanlike manner throughout the event.
                  </li>
                  <li className="flex items-start gap-2 text-gray-600 text-sm">
                    <span className="text-pink-500 mt-1">•</span>
                    Any participant found violating event rules, misbehaving, using abusive language, or acting in an unsportsmanlike manner will be subject to immediate disqualification.
                  </li>
                  <li className="flex items-start gap-2 text-gray-600 text-sm">
                    <span className="text-pink-500 mt-1">•</span>
                    Participants must follow all instructions given by event officials, marshals, and volunteers.
                  </li>
                  <li className="flex items-start gap-2 text-gray-600 text-sm">
                    <span className="text-pink-500 mt-1">•</span>
                    Any form of cheating, including but not limited to course cutting, bib swapping, or using unauthorized transportation, will result in immediate disqualification.
                  </li>
                  <li className="flex items-start gap-2 text-gray-600 text-sm">
                    <span className="text-pink-500 mt-1">•</span>
                    <span><strong className="text-gray-700">Referee's Decision is Final:</strong> The decision of the Race Referee and Event Officials shall be final and binding in all matters related to the event, including but not limited to disqualification, timing disputes, and rule interpretations.</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-600 text-sm">
                    <span className="text-pink-500 mt-1">•</span>
                    The organizers reserve the right to remove any participant from the event premises for any behavior deemed inappropriate or dangerous.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <hr className="border-gray-100" />

          <section className="scroll-mt-20">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 text-sm font-bold">5</span>
              <h2 className="text-xl font-bold text-gray-900">Use of Website</h2>
            </div>
            <div className="pl-11">
              <p className="text-gray-600 leading-relaxed mb-4">You agree to use our website only for lawful purposes and in a way that does not:</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-gray-600">
                  <span className="text-pink-500 mt-1">•</span>
                  Infringe upon the rights of others
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <span className="text-pink-500 mt-1">•</span>
                  Restrict or inhibit anyone else's use of the website
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <span className="text-pink-500 mt-1">•</span>
                  Pose a security risk to our systems
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <span className="text-pink-500 mt-1">•</span>
                  Attempt to gain unauthorized access to our systems
                </li>
              </ul>
            </div>
          </section>

          <hr className="border-gray-100" />

          <section className="scroll-mt-20">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 text-sm font-bold">6</span>
              <h2 className="text-xl font-bold text-gray-900">Intellectual Property</h2>
            </div>
            <p className="text-gray-600 leading-relaxed pl-11">
              The content, organization, graphics, design, compilation, magnetic translation,
              digital conversion and other matters related to the website are protected under
              applicable copyrights, trademarks and other proprietary rights.
            </p>
          </section>

          <hr className="border-gray-100" />

          <section className="scroll-mt-20">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 text-sm font-bold">7</span>
              <h2 className="text-xl font-bold text-gray-900">Disclaimer</h2>
            </div>
            <p className="text-gray-600 leading-relaxed pl-11">
              The information on this website is provided on an "as is" basis. To the fullest
              extent permitted by law, Janya Foundation excludes all representations, warranties,
              conditions and terms relating to our website and the use of this website.
            </p>
          </section>

          <hr className="border-gray-100" />

          <section className="scroll-mt-20">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 text-sm font-bold">8</span>
              <h2 className="text-xl font-bold text-gray-900">Limitation of Liability</h2>
            </div>
            <p className="text-gray-600 leading-relaxed pl-11">
              Janya Foundation shall not be liable for any indirect, incidental, special,
              consequential or punitive damages, including without limitation, loss of profits,
              data, use, goodwill, or other intangible losses.
            </p>
          </section>

          <hr className="border-gray-100" />

          <section className="scroll-mt-20">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 text-sm font-bold">9</span>
              <h2 className="text-xl font-bold text-gray-900">Governing Law</h2>
            </div>
            <p className="text-gray-600 leading-relaxed pl-11">
              These terms and conditions are governed by and construed in accordance with the
              laws of India and you irrevocably submit to the exclusive jurisdiction of the
              courts in Mumbai, Maharashtra.
            </p>
          </section>

          <hr className="border-gray-100" />

          <section id="contact" className="scroll-mt-20">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 text-sm font-bold">10</span>
              <h2 className="text-xl font-bold text-gray-900">Contact Information</h2>
            </div>
            <div className="pl-11">
              <p className="text-gray-600 leading-relaxed mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 space-y-2">
                <p className="flex items-center gap-3 text-gray-700">
                  <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  janyafoundation.04@gmail.com
                </p>
                <p className="flex items-center gap-3 text-gray-700">
                  <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  9867275101 / 9321496142
                </p>
                <p className="flex items-center gap-3 text-gray-700">
                  <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Ulwe Navi Mumbai, Maharashtra
                </p>
              </div>
            </div>
          </section>

          <hr className="border-gray-100" />

          <section className="scroll-mt-20">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 text-sm font-bold">11</span>
              <h2 className="text-xl font-bold text-gray-900">Changes to Terms</h2>
            </div>
            <p className="text-gray-600 leading-relaxed pl-11">
              We reserve the right to modify these terms at any time. Changes will be effective
              immediately upon posting on the website. Your continued use of the website after
              changes constitutes acceptance of the new terms.
            </p>
          </section>

        </div>

        {/* Back to Top */}
        <div className="mt-12 text-center">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-pink-500 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            Back to top
          </button>
        </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
