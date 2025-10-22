import { Link } from "wouter";
import { ChefHat } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <ChefHat className="w-6 h-6 mr-2" />
              <h3 className="text-lg font-bold">Chef Roulette</h3>
            </div>
            <p className="text-gray-400">
              Transform your social media food discoveries into organized, cookable recipes.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about">
                  <a className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                    About Us
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/privacy">
                  <a className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                    Privacy Policy
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/terms">
                  <a className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                    Terms of Service
                  </a>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <Separator className="my-8 bg-gray-800" />
        <div className="text-center text-gray-400">
          <p>&copy; 2025 Chef Roulette. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
