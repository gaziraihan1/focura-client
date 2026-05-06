import Link from "next/link";

export default function FooterMain() {
  return (
    <footer className="w-full border-t border-white/10 bg-black py-14">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          <div>
            <h2 className="text-2xl font-bold text-white">Focura</h2>
            <p className="text-sm text-gray-400 mt-3 leading-relaxed">
              The simplest way to manage workflows, teams, and operations — all in one platform.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/about" className="hover:text-white">About</Link></li>
              <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
              <li><Link href="/roadmap" className="hover:text-white">Roadmap</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
              <li><Link href="/guides" className="hover:text-white">Guides</Link></li>
              <li><Link href="/dev-guides" className="hover:text-white">Developer Guides</Link></li>
              <li><Link href="/api-docs" className="hover:text-white">API Docs</Link></li>
              <li><Link href="/templates" className="hover:text-white">Templates</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Legal</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/terms" className="hover:text-white">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/refund" className="hover:text-white">Refund Policy</Link></li>
              <li><Link href="/cookies" className="hover:text-white">Cookies</Link></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/10 mt-14 pt-6"></div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Focura — All Rights Reserved.
          </p>

          <div className="flex items-center gap-4 text-gray-400">
            <a href="#" className="hover:text-white transition">
              <i className="ri-facebook-fill text-xl"></i>
            </a>
            <a href="#" className="hover:text-white transition">
              <i className="ri-instagram-line text-xl"></i>
            </a>
            <a href="#" className="hover:text-white transition">
              <i className="ri-twitter-x-line text-xl"></i>
            </a>
            <a href="#" className="hover:text-white transition">
              <i className="ri-linkedin-fill text-xl"></i>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
