import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy | Suburb Intel AU',
  description: 'Privacy Policy for Suburb Intel AU - How we collect, use, and protect your data',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-teal-600 hover:underline mb-6 inline-block">
          ← Back to Home
        </Link>

        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-gray-600 mb-2">
            <strong>Quantum Leap Ventures Pvt Ltd</strong>
          </p>
          <p className="text-gray-600 mb-8">Last Updated: November 11, 2025</p>

          <div className="space-y-8 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">1. Introduction</h2>
              <p>
                Welcome to Suburb Intel AU, a product of <strong>Quantum Leap Ventures Pvt Ltd</strong> ("we," "our," or "us"). 
                We respect your privacy and are committed to protecting your personal data. 
                This privacy policy explains how we collect, use, and safeguard your information when you use our website and services.
              </p>
              <p className="mt-3 text-sm bg-blue-50 p-3 rounded">
                <strong>Company Details:</strong> Suburb Intel AU is owned and operated by Quantum Leap Ventures Pvt Ltd, 
                an Australian-registered company specializing in property intelligence platforms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">2. Information We Collect</h2>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">2.1 Information You Provide</h3>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Account information (name, email address) when you register</li>
                <li>Payment information processed securely through Stripe</li>
                <li>Search queries and suburb preferences</li>
                <li>Feedback and communications with us</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-gray-800">2.2 Automatically Collected Information</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Browser type, IP address, and device information</li>
                <li>Usage data (pages visited, features used, time spent)</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">3. How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>To provide and improve our services</li>
                <li>To process payments and manage subscriptions</li>
                <li>To send service updates and marketing communications (with consent)</li>
                <li>To analyze usage patterns and improve user experience</li>
                <li>To detect fraud and ensure platform security</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">4. Data Sharing and Disclosure</h2>
              <p className="mb-3">We do not sell your personal information. We may share data with:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Service Providers:</strong> Stripe (payments), Google Cloud (hosting), SendGrid (emails)</li>
                <li><strong>Data Sources:</strong> We access FREE government data from:
                  <ul className="list-circle pl-6 mt-1 text-sm">
                    <li>NSW/VIC/QLD Valuer-General offices (property valuations)</li>
                    <li>Australian Bureau of Statistics (demographics, census data)</li>
                    <li>State government open data portals</li>
                  </ul>
                </li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect rights and safety</li>
                <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale of assets</li>
              </ul>
              <p className="mt-3 text-sm bg-green-50 p-3 rounded">
                <strong>Note:</strong> Property data displayed on our platform comes from official Australian government sources. 
                We do not share your personal information with these government agencies - we only access their publicly available data APIs.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">5. Data Security</h2>
              <p>
                We implement industry-standard security measures including encryption, secure servers, and regular security audits. 
                However, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">6. Your Rights</h2>
              <p className="mb-3">You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Access:</strong> Request copies of your personal data</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal data</li>
                <li><strong>Opt-out:</strong> Unsubscribe from marketing emails</li>
                <li><strong>Data Portability:</strong> Request your data in a portable format</li>
              </ul>
              <p className="mt-4">
                To exercise these rights, contact us at <a href="mailto:saravananvijayakumar@quantumleapventures.com.au" className="text-teal-600 underline">saravananvijayakumar@quantumleapventures.com.au</a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">7. Cookies and Tracking</h2>
              <p>
                We use cookies to enhance your experience, analyze usage, and deliver personalized content. You can control cookies through 
                your browser settings. Disabling cookies may limit some functionality.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">8. Third-Party Services</h2>
              <p className="mb-3">Our platform integrates with third-party services that have their own privacy policies:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Stripe:</strong> Payment processing - <a href="https://stripe.com/privacy" className="text-teal-600 underline" target="_blank" rel="noopener noreferrer">Stripe Privacy Policy</a></li>
                <li><strong>Google Cloud:</strong> Hosting and infrastructure - <a href="https://cloud.google.com/privacy" className="text-teal-600 underline" target="_blank" rel="noopener noreferrer">Google Cloud Privacy</a></li>
              </ul>
              
              <h3 className="text-xl font-semibold mb-3 text-gray-800 mt-4">Government Data Sources (No Personal Data Shared)</h3>
              <p className="mb-3">We access property data from official government sources. These sources do NOT receive your personal information:</p>
              <ul className="list-disc pl-6 space-y-2 text-sm">
                <li><strong>NSW Valuer-General:</strong> <a href="https://www.valuergeneral.nsw.gov.au/" className="text-teal-600 underline" target="_blank" rel="noopener noreferrer">valuergeneral.nsw.gov.au</a></li>
                <li><strong>Victorian Valuer-General:</strong> <a href="https://www.land.vic.gov.au/" className="text-teal-600 underline" target="_blank" rel="noopener noreferrer">land.vic.gov.au</a></li>
                <li><strong>Queensland Valuer-General:</strong> <a href="https://www.qld.gov.au/environment/land/title/valuation" className="text-teal-600 underline" target="_blank" rel="noopener noreferrer">qld.gov.au</a></li>
                <li><strong>Australian Bureau of Statistics:</strong> <a href="https://www.abs.gov.au/" className="text-teal-600 underline" target="_blank" rel="noopener noreferrer">abs.gov.au</a></li>
              </ul>
              <p className="text-sm bg-blue-50 p-3 rounded mt-3">
                <strong>Privacy Protection:</strong> When you search for suburbs on our platform, we fetch data from government APIs 
                without sharing your personal information. Your search queries are processed on our servers only.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">9. Children's Privacy</h2>
              <p>
                Our services are not intended for individuals under 18 years of age. We do not knowingly collect personal information 
                from children. If you believe we have collected data from a minor, please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">10. Data Retention</h2>
              <p>
                We retain your personal data for as long as necessary to provide services and comply with legal obligations. 
                Inactive accounts may be deleted after 24 months of inactivity with prior notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">11. International Data Transfers</h2>
              <p>
                Your data may be transferred to and stored in countries outside Australia. We ensure appropriate safeguards are in place 
                to protect your data in accordance with this privacy policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">12. Changes to This Policy</h2>
              <p>
                We may update this privacy policy periodically. Significant changes will be communicated via email or prominent notice 
                on our website. Continued use of our services after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">13. Contact Us</h2>
              <p className="mb-3">For privacy-related questions or concerns, contact us:</p>
              <div className="bg-teal-50 p-4 rounded-lg">
                <p className="mb-2"><strong>Company:</strong> Quantum Leap Ventures Pvt Ltd</p>
                <p className="mb-2"><strong>Product:</strong> Suburb Intel AU</p>
                <p className="mb-2"><strong>Contact:</strong> <a href="mailto:saravananvijayakumar@quantumleapventures.com.au" className="text-teal-600 underline">saravananvijayakumar@quantumleapventures.com.au</a></p>
              </div>
            </section>

            <section className="border-t pt-6 mt-8">
              <p className="text-sm text-gray-600 mb-3">
                <strong>Australian Privacy Act Compliance:</strong> This privacy policy complies with the Australian Privacy Principles (APPs) 
                under the Privacy Act 1988 (Cth).
              </p>
              <p className="text-sm text-gray-600">
                <strong>Company:</strong> Quantum Leap Ventures Pvt Ltd | <strong>Product:</strong> Suburb Intel AU
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
