import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import Footer from "@/components/footer";
import { ChefHat, ArrowLeft } from "lucide-react";

export default function About() {
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
        <h1 className="text-4xl font-bold text-gray-900 mb-8" data-testid="text-page-title">
          About Us
        </h1>

        <div className="prose prose-lg max-w-none">
          <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
            <h2 className="text-2xl font-semibold text-green-600 mb-4">
              Chef Roulette — bringing fun back to cooking inspiration
            </h2>
            
            <p className="text-gray-700 mb-4">
              Hi! I'm Juan Aguirre. Like many people, I spend hours scrolling through TikTok, 
              Instagram, or YouTube discovering incredible recipes — but later I can never find 
              them again.
            </p>

            <p className="text-gray-700 mb-4">
              One day, my daughter and I realized there wasn't an easy way to save the recipes 
              we love from social media and actually use them when we cook. That's how Chef 
              Roulette was born — a digital recipe roulette that gathers your favorite dishes 
              from any social platform and helps you decide what to cook today, in a playful, 
              stress-free way.
            </p>

            <p className="text-gray-700 mb-4">
              The challenge was filling it with recipes we truly liked, not random database 
              content. So we built our own smart recipe book, capable of analyzing social 
              videos and turning them into structured recipes — with ingredients, steps, and 
              tags by cuisine, country, or protein.
            </p>

            <p className="text-gray-700">
              Today, Chef Roulette is growing with the support of{" "}
              <strong>A4 Company S.A.S.</strong>, a technology and consulting firm focused on 
              creating purposeful digital products that simplify everyday life and spark 
              creativity (and appetite).
            </p>
          </div>

          <div className="bg-green-50 rounded-lg p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div className="space-y-2 text-gray-700">
              <p><strong>Company:</strong> A4 Company S.A.S.</p>
              <p><strong>Legal Representative:</strong> Juan Aguirre</p>
              <p><strong>Address:</strong> Calle 155 No. 9-50 Bogotá D.C., Colombia – 110131</p>
              <p><strong>Website:</strong> <a href="https://www.a4-company.com" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700">www.a4-company.com</a></p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
