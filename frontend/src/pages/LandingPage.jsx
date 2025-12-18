import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
    return (
        <div className="min-h-screen flex flex-col bg-cream text-charcoal font-sans">
            {/* Navbar */}
            <nav className="w-full p-6 flex justify-between items-center max-w-7xl mx-auto">
                <div className="text-2xl font-serif font-bold text-sage">Sarthi</div>
                <div className="flex gap-6 text-sm font-medium">
                    <Link to="/login" className="hover:text-sage transition-colors">Login</Link>
                    <Link to="/signup" className="hover:text-sage transition-colors">Sign Up</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
                <h1 className="text-5xl md:text-7xl font-serif font-bold text-sage mb-6 leading-tight">
                    Your Intelligent <br /> Voice Companion
                </h1>
                <p className="text-xl md:text-2xl text-charcoal/70 max-w-2xl mb-12 font-light">
                    A warm, safe space for meaningful connection. Always listening, always there.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
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
                </div>
            </main>

            <footer className="p-6 text-center text-charcoal/40 text-sm">
                &copy; {new Date().getFullYear()} Sarthi. All rights reserved.
            </footer>
        </div>
    );
}
