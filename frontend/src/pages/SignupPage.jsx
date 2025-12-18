import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const questions = [
    { id: 'name', label: "What should I call you?", placeholder: "Your Name", type: "text" },
    { id: 'age', label: "How old are you?", placeholder: "Age", type: "number" },
    { id: 'tone', label: "How should I speak to you?", options: ["Soft & Gentle", "Energetic", "Formal", "Casual"] },
    { id: 'phone', label: "What is your phone number?", placeholder: "+1 5550000000", type: "tel" }
];

export default function SignupPage() {
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState({});
    const [inputVal, setInputVal] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const question = questions[currentQ];

    const handleNext = async (val) => {
        const value = val || inputVal;

        if (!value) return;

        // Handle Phone validation specifically if it's the current question
        if (question.id === 'phone') {
            // Basic validation or formatting could happen here, 
            // but we'll do the main formatting before saving.
        }

        const newAnswers = { ...answers, [question.id]: value };
        setAnswers(newAnswers);
        setInputVal('');

        if (currentQ < questions.length - 1) {
            setCurrentQ(currentQ + 1);
        } else {
            // Complete - Save Profile
            await saveProfile(newAnswers);
        }
    };

    const saveProfile = async (finalAnswers) => {
        setLoading(true);
        setError(null);

        let phone = finalAnswers.phone || localStorage.getItem('sarthi_phone');
        if (!phone) {
            setError("Phone number is required. Please check step 4.");
            setLoading(false);
            return;
        }

        // Format phone number to E.164
        phone = phone.trim();
        phone = phone.replace(/[^\d+]/g, '');
        if (phone.length === 10 && !phone.startsWith('+')) {
            phone = '+91' + phone;
        }
        if (!phone.startsWith('+')) {
            phone = '+' + phone;
        }

        const payload = {
            ...finalAnswers,
            phone
        };

        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/profile`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to save profile');

            // Save phone for login convenience
            localStorage.setItem('sarthi_phone', phone);
            navigate('/login');
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-cream p-4 font-sans text-charcoal">
            <div className="w-full max-w-md">
                <div className="mb-12 text-center">
                    <Link to="/" className="text-2xl font-serif font-bold text-sage">Sarthi</Link>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center">
                        {error}
                    </div>
                )}

                <div className="flex flex-col space-y-8">
                    <div className="space-y-2">
                        <span className="text-sm font-medium text-sage uppercase tracking-wider">Step {currentQ + 1} of {questions.length}</span>
                        <h2 className="text-3xl font-serif font-bold text-sage">{question.label}</h2>
                    </div>

                    {question.options ? (
                        <div className="grid grid-cols-1 gap-3">
                            {question.options.map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => handleNext(opt)}
                                    className="p-4 text-lg border bg-white border-sage/20 rounded-xl hover:border-sage hover:bg-sage/5 transition-colors text-left font-medium"
                                    disabled={loading}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <input
                                type={question.type}
                                placeholder={question.placeholder}
                                value={inputVal}
                                onChange={(e) => setInputVal(e.target.value)}
                                className="w-full text-2xl bg-transparent border-b-2 border-sage/30 py-2 focus:outline-none focus:border-sage placeholder-sage/30 transition-colors"
                                autoFocus
                                onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                                disabled={loading}
                            />
                            <button
                                onClick={() => handleNext()}
                                disabled={loading}
                                className="w-full bg-clay text-white text-lg font-medium py-4 rounded-xl shadow-lg shadow-clay/20 hover:shadow-xl hover:bg-[#b06a4b] transition-all disabled:opacity-50"
                            >
                                {loading ? 'Continue' : 'Continue'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
