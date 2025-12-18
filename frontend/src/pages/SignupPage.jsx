import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const questions = [
    { id: 'name', label: "What should I call you?", placeholder: "Your Name", type: "text" },
    { id: 'age', label: "How old are you?", placeholder: "Age", type: "number" },
    { id: 'tone', label: "How should I speak to you?", options: ["Soft & Gentle", "Energetic", "Formal", "Casual"] }
];

export default function SignupPage() {
    const [currentQ, setCurrentQ] = useState(0);
    const navigate = useNavigate();
    const question = questions[currentQ];

    const handleNext = () => {
        if (currentQ < questions.length - 1) {
            setCurrentQ(currentQ + 1);
        } else {
            navigate('/login'); // Redirect to login or dashboard after signup
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-cream p-4 font-sans text-charcoal">
            <div className="w-full max-w-md">
                <div className="mb-12 text-center">
                    <Link to="/" className="text-2xl font-serif font-bold text-sage">Sarthi</Link>
                </div>

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
                                    onClick={handleNext}
                                    className="p-4 text-lg border bg-white border-sage/20 rounded-xl hover:border-sage hover:bg-sage/5 transition-colors text-left font-medium"
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
                                className="w-full text-2xl bg-transparent border-b-2 border-sage/30 py-2 focus:outline-none focus:border-sage placeholder-sage/30 transition-colors"
                                autoFocus
                                onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                            />
                            <button
                                onClick={handleNext}
                                className="w-full bg-clay text-white text-lg font-medium py-4 rounded-xl shadow-lg shadow-clay/20 hover:shadow-xl hover:bg-[#b06a4b] transition-all"
                            >
                                Continue
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
