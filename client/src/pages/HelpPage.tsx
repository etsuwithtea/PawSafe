export default function HelpPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="grow max-w-4xl mx-auto px-4 py-12 w-full">
        <h1 className="text-4xl font-bold mb-8">Help & Support</h1>
        
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Getting Started</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">How do I create an account?</h3>
              <p className="text-gray-700">
                Click on the "Sign Up" button on the home page, fill in your information, and follow the verification steps. You'll need a valid email address to complete registration.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">How do I upload my pet's information?</h3>
              <p className="text-gray-700">
                Go to "Add Pet" from the navigation menu. Fill in your pet's details including name, breed, age, and upload clear photos. Make sure the information is accurate for better adoption matches.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">How do I report a lost pet?</h3>
              <p className="text-gray-700">
                Click on "Report Lost Pet" and provide details about your missing pet including breed, color, location last seen, and contact information. Add clear photos to help others identify your pet.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Adoption & Matching</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">How does the adoption process work?</h3>
              <p className="text-gray-700">
                Browse available pets, click on one you're interested in, and contact the owner through our messaging system. The owner will verify your suitability, and you can arrange a meeting.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">What information should I provide as a pet owner?</h3>
              <p className="text-gray-700">
                Provide accurate information about your pet's temperament, health status, vaccinations, dietary needs, and any behavioral notes. This helps find the perfect match for your pet.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Can I mark my pet as adopted?</h3>
              <p className="text-gray-700">
                Yes! Go to "My Posts", find the adopted pet, and click "Mark as Completed". This removes it from the active listing and shows on your profile as a successful adoption.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Account & Profile</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">How do I edit my profile?</h3>
              <p className="text-gray-700">
                Click on your profile icon, select "Edit Profile", and update your information. Remember to save your changes.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">How do I reset my password?</h3>
              <p className="text-gray-700">
                On the login page, click "Forgot Password" and enter your email. You'll receive instructions to reset your password.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">How do I add favorites?</h3>
              <p className="text-gray-700">
                Click the heart icon on any pet card to add it to your favorites. View all favorites in the "Favorites" section from the menu.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Messaging & Communication</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">How do I contact another user?</h3>
              <p className="text-gray-700">
                Click on a pet listing or profile, and use the message button. Your conversation will appear in the "Chat" section.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Will my personal information be shared?</h3>
              <p className="text-gray-700">
                Your contact information is only shared with users you initiate conversations with. We take privacy seriously and follow all data protection regulations.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Troubleshooting</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">I can't upload images. What should I do?</h3>
              <p className="text-gray-700">
                Check that your image file is less than 5MB and in a supported format (JPG, PNG). Try refreshing the page and try again.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">I'm not receiving notifications. How do I fix this?</h3>
              <p className="text-gray-700">
                Check your browser notification settings and ensure notifications are enabled for PawSafe. Also verify your notification preferences in your account settings.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">My pet listing isn't showing up. Why?</h3>
              <p className="text-gray-700">
                Make sure all required fields are completed and at least one image is uploaded. Check if your post was marked as completed. If issues persist, contact support.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Still Need Help?</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            If you can't find the answer to your question here, please don't hesitate to contact our support team.
          </p>
          <p className="text-gray-700">
            Email: <a href="mailto:support@pawsafe.com" className="text-blue-600 hover:underline">support@pawsafe.com</a>
          </p>
        </section>
      </main>
    </div>
  );
}
