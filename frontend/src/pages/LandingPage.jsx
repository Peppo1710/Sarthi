import React from 'react';
import { Link } from 'react-router-dom';
// Navbar is now handled in App.jsx layout, so we remove it from here to avoid duplication
// or we can keep it if we want a specifically different landing navbar.
// For now, let's assume App.jsx handles the global Navbar, or we import it here.
// But the plan says "Refactor Navbar", suggesting a global component.
// Let's remove the inline nav and let App.jsx handle it, OR import the new Navbar.
// Given strict reqs, let's make LandingPage cleaner.

export default function LandingPage() {
    return (
        <div className="min-h-[calc(100vh-80px)] flex flex-col bg-cream text-charcoal font-sans">
            {/* Hero Section */}
            <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
                <h1 className="text-5xl md:text-7xl font-serif font-bold text-sage mb-6 leading-tight">
                    Your Intelligent <br /> Voice Companion
                </h1>
                <p className="text-xl md:text-2xl text-charcoal/70 max-w-2xl mb-12 font-light">
                    A warm, safe space for meaningful connection. Always listening, always there.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    {localStorage.getItem('sarthi_phone') ? (
                        <Link
                            to="/chat"
                            className="px-12 py-5 bg-sage text-white text-xl font-medium rounded-2xl hover:bg-[#5b7a1e] transition-colors shadow-xl shadow-sage/30 text-center w-full sm:w-auto"
                        >
                            Go to Chat
                        </Link>
                    ) : (
                        <>
                            <Link
                                to="/signup"
                                className="px-8 py-4 bg-sage text-white text-lg font-medium rounded-2xl hover:bg-[#5b7a1e] transition-colors shadow-lg shadow-sage/20 text-center"
                            >
                                Get Started
                            </Link>
                            <Link
                                to="/login"
                                className="px-8 py-4 bg-white border-2 border-sage/20 text-sage text-lg font-medium rounded-2xl hover:bg-sage/5 transition-colors text-center"
                            >
                                Log In
                            </Link>
                        </>
                    )}
                </div>
            </main>

            <footer className="p-6 text-center text-charcoal/40 text-sm">
                &copy; {new Date().getFullYear()} Sarthi. All rights reserved.
            </footer>
        </div>
    );
}
