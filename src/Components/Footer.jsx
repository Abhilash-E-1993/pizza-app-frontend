function Footer() {
    return (
        <footer className="border-t border-gray-100 bg-white">
            <div className="max-w-6xl mx-auto px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">

                <p className="text-xs text-gray-400">
                    © 2026 PIZZAHUB. All rights reserved.
                </p>

                <div className="flex items-center gap-4">
                    <a href="#" aria-label="Facebook" className="text-gray-300 hover:text-gray-500 transition">
                        <svg fill="currentColor" className="w-4 h-4" viewBox="0 0 24 24">
                            <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                        </svg>
                    </a>
                    <a href="#" aria-label="Twitter" className="text-gray-300 hover:text-gray-500 transition">
                        <svg fill="currentColor" className="w-4 h-4" viewBox="0 0 24 24">
                            <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                        </svg>
                    </a>
                    <a href="#" aria-label="Instagram" className="text-gray-300 hover:text-gray-500 transition">
                        <svg fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" viewBox="0 0 24 24">
                            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                            <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01" />
                        </svg>
                    </a>
                    <a href="#" aria-label="LinkedIn" className="text-gray-300 hover:text-gray-500 transition">
                        <svg fill="currentColor" className="w-4 h-4" viewBox="0 0 24 24">
                            <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                            <circle cx="4" cy="4" r="2" />
                        </svg>
                    </a>
                </div>

            </div>
        </footer>
    );
}

export default Footer;