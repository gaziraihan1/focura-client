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
              <li><a href="#" className="hover:text-white">About</a></li>
              <li><a href="#" className="hover:text-white">Careers</a></li>
              <li><a href="#" className="hover:text-white">Blog</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white">Help Center</a></li>
              <li><a href="#" className="hover:text-white">Guides</a></li>
              <li><a href="#" className="hover:text-white">API Docs</a></li>
              <li><a href="#" className="hover:text-white">Templates</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Legal</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white">Cookies</a></li>
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
