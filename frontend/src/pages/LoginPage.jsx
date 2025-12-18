import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function LoginPage() {
    const [step, setStep] = useState('phone'); // phone | otp
    const navigate = useNavigate();

    const handleSendCode = () => {
        // Simulate API call
        setStep('otp');
    };

    const handleVerify = () => {
        // Simulate verification
        navigate('/'); // Redirect to home/dashboard after login
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-cream p-4 font-sans text-charcoal">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <Link to="/" className="text-2xl font-serif font-bold text-sage block mb-8">Sarthi</Link>
                </div>

                {step === 'phone' && (
                    <div className="flex flex-col space-y-6">
                        <div className="text-center">
                            <h2 className="text-3xl font-serif font-bold text-sage mb-2">Welcome Back</h2>
                            <p className="text-charcoal/70">Enter your phone number to continue.</p>
                        </div>

                        <input
                            type="tel"
                            className="w-full text-2xl bg-white border border-sage/20 rounded-xl p-4 focus:border-sage focus:outline-none focus:ring-1 focus:ring-sage transition-colors placeholder-sage/30"
                            placeholder="+1 (555) 000-0000"
                            autoFocus
                        />

                        <button
                            onClick={handleSendCode}
                            className="w-full bg-sage text-white text-lg font-medium py-4 rounded-xl hover:bg-[#5b7a1e] transition-colors shadow-lg shadow-sage/20"
                        >
                            Send Code
                        </button>
                    </div>
                )}

                {step === 'otp' && (
                    <div className="flex flex-col space-y-6">
                        <div className="text-center">
                            <h2 className="text-3xl font-serif font-bold text-sage mb-2">Enter OTP</h2>
                            <p className="text-charcoal/70">We sent a code to your phone.</p>
                        </div>

                        <div className="flex gap-2 justify-center">
                            {[0, 1, 2, 3].map((i) => (
                                <input
                                    key={i}
                                    type="text"
                                    maxLength={1}
                                    className="w-14 h-16 text-center text-2xl bg-white border border-sage/20 rounded-lg focus:border-sage focus:outline-none focus:ring-1 focus:ring-sage"
                                />
                            ))}
                        </div>

                        <button
                            onClick={handleVerify}
                            className="w-full bg-sage text-white text-lg font-medium py-4 rounded-xl hover:bg-[#5b7a1e] transition-colors shadow-lg shadow-sage/20"
                        >
                            Verify & Login
                        </button>

                        <button onClick={() => setStep('phone')} className="text-sm text-sage hover:underline text-center">
                            Wrong number? Go back
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
