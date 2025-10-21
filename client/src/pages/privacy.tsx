import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ChefHat, ArrowLeft } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/">
              <a className="flex items-center cursor-pointer">
                <ChefHat className="w-8 h-8 mr-3 text-green-600" />
                <h1 className="text-xl font-bold text-gray-900">Chef Roulette</h1>
              </a>
            </Link>
            <Link href="/">
              <Button variant="ghost" data-testid="button-back-home">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4" data-testid="text-page-title">
          Privacy Policy
        </h1>
        <p className="text-gray-600 mb-8">Last updated: October 2025</p>

        <div className="prose prose-lg max-w-none space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="mb-6">
              <p className="text-gray-700"><strong>Data Controller:</strong> A4 Company S.A.S.</p>
              <p className="text-gray-700"><strong>Legal Representative:</strong> Juan Aguirre</p>
              <p className="text-gray-700"><strong>Address:</strong> Calle 155 No. 9-50 Bogotá D.C., Colombia – 110131</p>
              <p className="text-gray-700"><strong>Contact:</strong> <a href="mailto:privacy@a4-company.com" className="text-green-600 hover:text-green-700">privacy@a4-company.com</a></p>
              <p className="text-gray-700"><strong>Website:</strong> <a href="https://www.a4-company.com" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700">www.a4-company.com</a></p>
            </div>

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
                <p className="text-gray-700 mb-2">Chef Roulette may collect:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Contact details (name, email, WhatsApp number)</li>
                  <li>Cooking preferences, saved recipes, and interaction data</li>
                  <li>Analytics information such as pages visited, clicks, and session time</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Purpose of Data Processing</h2>
                <p className="text-gray-700 mb-2">Your data is used to:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Improve your user experience inside the application</li>
                  <li>Send news, promotions, or content related to our own or third-party marketing campaigns</li>
                  <li>Enable direct WhatsApp contact, when you have expressly agreed</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Data Sharing</h2>
                <p className="text-gray-700">
                  Chef Roulette does not sell individual user data.
                  We may share aggregated and anonymized information for statistical analysis or 
                  advertising-audience management, but never in a way that personally identifies you.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Consent and User Rights</h2>
                <p className="text-gray-700 mb-2">
                  By registering or continuing to use the app, you consent to this Privacy Policy.
                  You may at any time:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Access, correct, or delete your data</li>
                  <li>Withdraw consent to receive WhatsApp or email communications</li>
                </ul>
                <p className="text-gray-700 mt-2">
                  Requests may be sent to{" "}
                  <a href="mailto:privacy@a4-company.com" className="text-green-600 hover:text-green-700">
                    privacy@a4-company.com
                  </a>
                  .
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Security and Retention</h2>
                <p className="text-gray-700">
                  We implement reasonable technical and organizational safeguards to protect your data.
                  Information is retained only as long as necessary to fulfill the stated purposes or 
                  as required by law.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
