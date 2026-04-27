export const metadata = {
  title: 'Privacy Policy — Dentist Booking App',
};

export default function PrivacyPolicyPage() {
  const emailAddress = 'support@atomic.group'
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-10 text-gray-800">
        <h1 className="text-3xl font-extrabold mb-2 text-black">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-8">Effective date: 1 January 2025 &nbsp;·&nbsp; Version 1.0</p>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">1. Introduction</h2>
          <p className="leading-relaxed">
            Welcome to the Dentist Booking App (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;). We are committed to protecting
            the personal information you share with us when scheduling dental appointments. This
            Privacy Policy explains what data we collect, how we use it, and your rights
            regarding that data.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">2. Information We Collect</h2>
          <ul className="list-disc list-inside space-y-2 leading-relaxed">
            <li><span className="font-semibold">Account information:</span> your name, email address, and telephone number when you register.</li>
            <li><span className="font-semibold">Booking information:</span> appointment dates, times, and the dentist you select.</li>
            <li><span className="font-semibold">Consent records:</span> the date and version of this policy you agreed to.</li>
            <li><span className="font-semibold">Usage data:</span> pages visited and actions taken within the application, collected anonymously.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">3. How We Use Your Information</h2>
          <ul className="list-disc list-inside space-y-2 leading-relaxed">
            <li>To create and manage your account.</li>
            <li>To schedule, confirm, and remind you of dental appointments.</li>
            <li>To contact you about changes to your bookings or this policy.</li>
            <li>To improve the application and user experience.</li>
            <li>To comply with applicable laws and regulations.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">4. Data Sharing</h2>
          <p className="leading-relaxed">
            We do <span className="font-semibold">not</span> sell your personal information. We may share your data only with:
          </p>
          <ul className="list-disc list-inside space-y-2 leading-relaxed mt-2">
            <li>The dental clinic and dentist you book an appointment with.</li>
            <li>Service providers who operate the application on our behalf (e.g., hosting), under strict confidentiality obligations.</li>
            <li>Law-enforcement or regulatory authorities when required by law.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">5. Data Retention</h2>
          <p className="leading-relaxed">
            Your account and booking records are retained for as long as your account is active
            and for up to 3 years after its deletion to satisfy legal and regulatory requirements.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">6. Security</h2>
          <p className="leading-relaxed">
            We protect your data with industry-standard security measures including encrypted
            passwords (bcrypt), HTTPS transport encryption, and access controls. No method of
            transmission over the internet is 100% secure; we continuously monitor for threats
            and improve our safeguards.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">7. Your Rights</h2>
          <p className="leading-relaxed mb-2">You have the right to:</p>
          <ul className="list-disc list-inside space-y-2 leading-relaxed">
            <li>Access the personal data we hold about you.</li>
            <li>Request correction of inaccurate information.</li>
            <li>Request deletion of your account and associated data.</li>
            <li>Withdraw consent at any time (note: this may prevent use of the service).</li>
          </ul>
          <p className="leading-relaxed mt-2">
            To exercise these rights, contact us at the address below.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">8. Cookies</h2>
          <p className="leading-relaxed">
            We use session cookies solely to keep you logged in. We do not use tracking or
            advertising cookies.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">9. Changes to This Policy</h2>
          <p className="leading-relaxed">
            We may update this policy from time to time. When we do, we will increment the
            version number and notify you via email or an in-app notice. Continued use of the
            service after changes constitutes acceptance of the revised policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">10. Contact Us</h2>
          <p className="leading-relaxed">
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <address className="not-italic mt-2 leading-relaxed text-gray-600">
            Dentist Booking App — Atomic Group<br />
            Email: <a href={`mailto:${emailAddress}`} className="text-blue-600 underline hover:text-blue-800">{emailAddress}</a>
          </address>
        </section>
      </div>
    </main>
  );
}
