export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="grow max-w-4xl mx-auto px-4 py-12 w-full">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            PawSafe ("we", "us", "our", or "Company") operates the platform. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our service and the choices you have associated with that data.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">2. Information Collection and Use</h2>
          <p className="text-gray-700 leading-relaxed mb-4 font-semibold">We collect several different types of information:</p>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li><strong>Personal Data:</strong> Name, email address, phone number, address, avatar, and pet information</li>
            <li><strong>Usage Data:</strong> Browser type, pages visited, time and date of visits, and referral source</li>
            <li><strong>Communication Data:</strong> Chat messages and communications between users</li>
            <li><strong>Location Data:</strong> Information about lost or adopted pets' locations</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">3. Use of Data</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            PawSafe uses the collected data for various purposes:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li>To provide and maintain our service</li>
            <li>To notify you about changes to our service</li>
            <li>To allow you to participate in interactive features of our service</li>
            <li>To provide customer support</li>
            <li>To gather analysis or valuable information to improve our service</li>
            <li>To monitor the usage of our service</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">4. Security of Data</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            The security of your data is important to us but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal data, we cannot guarantee its absolute security.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">5. Changes to This Privacy Policy</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "effective date" at the top of this Privacy Policy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">6. Contact Us</h2>
          <p className="text-gray-700 leading-relaxed">
            If you have any questions about this Privacy Policy, please contact us at privacy@pawsafe.com
          </p>
        </section>
      </main>
    </div>
  );
}
