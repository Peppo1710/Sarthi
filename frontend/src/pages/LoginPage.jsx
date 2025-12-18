import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function LoginPage() {
    const [step, setStep] = useState('phone'); // phone | otp
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']); // 6 Digits for Fixed OTP
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSendCode = async () => {
        setLoading(true);
        setError(null);

        // Format phone number to E.164
        let formattedPhone = phone.trim();
        // Remove all non-numeric chars except +
        formattedPhone = formattedPhone.replace(/[^\d+]/g, '');

        // Default to India (+91) if 10 digits provided without code
        if (formattedPhone.length === 10 && !formattedPhone.startsWith('+')) {
            formattedPhone = '+91' + formattedPhone;
        }
        // Ensure it starts with +
        if (!formattedPhone.startsWith('+')) {
            formattedPhone = '+' + formattedPhone;
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/send-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: formattedPhone }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to send OTP');

            // Update state with formatted phone for verification step
            setPhone(formattedPhone);
            setStep('otp');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async () => {
        setLoading(true);
        setError(null);
        try {
            // Join all 6 digits
            const token = otp.join('');
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, token }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Invalid OTP');

            // Save phone to link profile later
            localStorage.setItem('sarthi_phone', phone);
            navigate('/'); // Redirect to home/dashboard
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Helper for OTP input change
    const handleOtpChange = (element, index) => {
        if (isNaN(element.value)) return;

        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        // Focus next input automatically
        if (element.value && element.nextSibling) {
            element.nextSibling.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        // Handle backspace to focus previous
        if (e.key === 'Backspace' && !otp[index] && e.target.previousSibling) {
            e.target.previousSibling.focus();
        }
        // Allow Enter to submit on last digit
        if (e.key === 'Enter' && index === 5) {
            handleVerify();
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-cream p-4 font-sans text-charcoal">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <Link to="/" className="text-2xl font-serif font-bold text-sage block mb-8">Sarthi</Link>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center">
                        {error}
                    </div>
                )}

                {step === 'phone' && (
                    <div className="flex flex-col space-y-6">
                        <div className="text-center">
                            <h2 className="text-3xl font-serif font-bold text-sage mb-2">Welcome Back</h2>
                            <p className="text-charcoal/70">Enter your phone number to continue.</p>
                        </div>

                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full text-2xl bg-white border border-sage/20 rounded-xl p-4 focus:border-sage focus:outline-none focus:ring-1 focus:ring-sage transition-colors placeholder-sage/30"
                            placeholder="+1 5550000000"
                            autoFocus
                            disabled={loading}
                        />

                        <button
                            onClick={handleSendCode}
                            disabled={loading}
                            className="w-full bg-sage text-white text-lg font-medium py-4 rounded-xl hover:bg-[#5b7a1e] transition-colors shadow-lg shadow-sage/20 disabled:opacity-50"
                        >
                            {loading ? 'Sending...' : 'Send Code'}
                        </button>
                    </div>
                )}

                {step === 'otp' && (
                    <div className="flex flex-col space-y-6">
                        <div className="text-center">
                            <h2 className="text-3xl font-serif font-bold text-sage mb-2">Enter OTP</h2>
                            <p className="text-charcoal/70">We sent a code to {phone}</p>
                            <p className="text-xs text-sage mt-2">Use code: 123456</p>
                        </div>

                        <div className="flex gap-2 justify-center">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(e.target, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    onFocus={(e) => e.target.select()}
                                    className="w-12 h-14 text-center text-xl bg-white border border-sage/20 rounded-lg focus:border-sage focus:outline-none focus:ring-1 focus:ring-sage transition-all"
                                />
                            ))}
                        </div>

                        <button
                            onClick={handleVerify}
                            disabled={loading}
                            className="w-full bg-sage text-white text-lg font-medium py-4 rounded-xl hover:bg-[#5b7a1e] transition-colors shadow-lg shadow-sage/20 disabled:opacity-50"
                        >
                            {loading ? 'Verifying...' : 'Verify & Login'}
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
