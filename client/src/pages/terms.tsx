import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import Footer from "@/components/footer";
import { ChefHat, ArrowLeft } from "lucide-react";

export default function Terms() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col">
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
          Terms and Conditions
        </h1>
        <p className="text-gray-600 mb-8">Last updated: October 2025</p>

        <div className="prose prose-lg max-w-none space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="mb-6">
              <p className="text-gray-700"><strong>Service Owner:</strong> A4 Company S.A.S.</p>
              <p className="text-gray-700"><strong>Legal Representative:</strong> Juan Aguirre</p>
              <p className="text-gray-700"><strong>Address:</strong> Calle 155 No. 9-50 Bogotá D.C., Colombia – 110131</p>
              <p className="text-gray-700"><strong>Website:</strong> <a href="https://www.a4-company.com" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700">www.a4-company.com</a></p>
              <p className="text-gray-700"><strong>Contact:</strong> <a href="mailto:legal@a4-company.com" className="text-green-600 hover:text-green-700">legal@a4-company.com</a></p>
            </div>

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-700">
                  By accessing or using Chef Roulette, you agree to these Terms and Conditions. 
                  If you disagree, please discontinue use of the service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Service Description</h2>
                <p className="text-gray-700 mb-2">Chef Roulette allows users to:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Save and organize recipes from social media</li>
                  <li>Use an interactive roulette to discover random meal ideas</li>
                  <li>Receive communications about new features or promotions</li>
                </ul>
                <p className="text-gray-700 mt-4">
                  The service is provided "as is" and may be updated, modified, or suspended at 
                  any time without notice.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Intellectual Property</h2>
                <p className="text-gray-700 mb-2">
                  All visual elements, branding, interface, and software belong to A4 Company S.A.S. 
                  or are used under license.
                </p>
                <p className="text-gray-700">
                  Copyright of original recipe videos remains with their creators. Chef Roulette only 
                  indexes and organizes publicly available content from external platforms without 
                  altering or reselling it.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Permitted Use</h2>
                <p className="text-gray-700 mb-2">Users agree to:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Use the app solely for lawful, personal purposes</li>
                  <li>Not download, redistribute, or commercially exploit third-party content obtained 
                      through the service</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Third-Party Content and Links</h2>
                <p className="text-gray-700">
                  Chef Roulette may include links to platforms such as TikTok, Instagram, or YouTube.
                  A4 Company S.A.S. is not responsible for the content, availability, or privacy 
                  practices of these external sites.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Limitation of Liability</h2>
                <p className="text-gray-700 mb-2">
                  Use of Chef Roulette is at the user's own risk.
                </p>
                <p className="text-gray-700">
                  A4 Company S.A.S. does not guarantee that any recipe is accurate, safe, or suitable 
                  for specific dietary or medical conditions.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Governing Law and Contact</h2>
                <p className="text-gray-700 mb-2">
                  These terms are governed by the laws of Colombia.
                </p>
                <p className="text-gray-700">
                  For legal questions or complaints, contact{" "}
                  <a href="mailto:legal@a4-company.com" className="text-green-600 hover:text-green-700">
                    legal@a4-company.com
                  </a>
                  .
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
