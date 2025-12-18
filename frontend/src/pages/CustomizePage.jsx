import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, User, Mic, Heart } from 'lucide-react';

const steps = [
    { id: 1, title: 'Choose your companion', icon: User },
    { id: 2, title: 'Voice & Tone', icon: Mic },
    { id: 3, title: 'Interests', icon: Heart },
];

const avatars = [
    { id: 'grandson', label: 'Rohan', color: 'bg-blue-100' },
    { id: 'granddaughter', label: 'Priya', color: 'bg-pink-100' },
    { id: 'friend', label: 'Amit', color: 'bg-green-100' },
];

const interestsList = [
    'Old Bollywood Songs', 'Gardening', 'History (India)',
    'Cricket', 'Cooking Recipes', 'Spirituality/Bhajans',
    'Health Tips', 'News', 'Travel Stories'
];

export default function CustomizePage() {
    const [currentStep, setCurrentStep] = useState(1);
    const [preferences, setPreferences] = useState({
        avatar: 'granddaughter',
        tone: 'gentle',
        speed: 50,
        interests: []
    });
    const navigate = useNavigate();

    const handleNext = () => {
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        } else {
            // Save and go to chat
            console.log('Saving preferences:', preferences);
            navigate('/chat');
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const toggleInterest = (interest) => {
        setPreferences(prev => {
            const newInterests = prev.interests.includes(interest)
                ? prev.interests.filter(i => i !== interest)
                : [...prev.interests, interest];
            return { ...prev, interests: newInterests };
        });
    };

    return (
        <div className="flex-1 bg-cream flex flex-col items-center py-8 px-4 w-full max-w-5xl mx-auto">
            {/* Progress Bar */}
            <div className="w-full mb-12 flex justify-center items-center gap-4">
                {steps.map((step, idx) => {
                    const Icon = step.icon;
                    const isActive = step.id === currentStep;
                    const isDone = step.id < currentStep;

                    return (
                        <div key={step.id} className="flex items-center">
                            <div className={`
                 w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all
                 ${isActive ? 'border-sage bg-sage text-white' : ''}
                 ${isDone ? 'border-sage bg-sage/20 text-sage' : 'border-gray-300 text-gray-300'}
                 ${!isActive && !isDone ? 'bg-white' : ''}
               `}>
                                <Icon size={24} />
                            </div>
                            {idx < steps.length - 1 && (
                                <div className={`w-16 h-1 mx-2 ${isDone ? 'bg-sage' : 'bg-gray-200'}`} />
                            )}
                        </div>
                    );
                })}
            </div>

            <h1 className="text-4xl md:text-5xl font-serif font-bold text-sage mb-12 text-center leading-tight">
                {steps[currentStep - 1].title}
            </h1>

            <div className="w-full max-w-3xl flex-1 flex flex-col">
                {/* Step 1: Avatar */}
                {currentStep === 1 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {avatars.map(av => (
                            <button
                                key={av.id}
                                onClick={() => setPreferences({ ...preferences, avatar: av.id })}
                                className={`
                            relative h-64 rounded-3xl border-4 flex flex-col items-center justify-center gap-4 transition-all
                            ${preferences.avatar === av.id
                                        ? 'border-sage bg-white shadow-xl shadow-sage/20 scale-105'
                                        : 'border-transparent bg-white hover:bg-sage/5 hover:border-sage/30'}
                        `}
                            >
                                <div className={`w-32 h-32 rounded-full ${av.color} flex items-center justify-center text-4xl`}>
                                    {av.label[0]}
                                </div>
                                <span className="text-2xl font-bold text-charcoal">{av.label}</span>

                                {preferences.avatar === av.id && (
                                    <div className="absolute top-4 right-4 w-8 h-8 bg-sage rounded-full flex items-center justify-center text-white">
                                        <Check size={18} />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                )}

                {/* Step 2: Voice & Tone */}
                {currentStep === 2 && (
                    <div className="space-y-12">
                        <div className="bg-white p-8 rounded-3xl border border-sage/10 space-y-6">
                            <label className="text-2xl font-medium text-charcoal block">Speech Speed</label>
                            <input
                                type="range"
                                min="0" max="100"
                                value={preferences.speed}
                                onChange={(e) => setPreferences({ ...preferences, speed: parseInt(e.target.value) })}
                                className="w-full h-4 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-sage"
                            />
                            <div className="flex justify-between text-lg text-charcoal/60">
                                <span>Slow & Clear</span>
                                <span>Normal</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            {['Gentle', 'Cheerful'].map(t => (
                                <button
                                    key={t}
                                    onClick={() => setPreferences({ ...preferences, tone: t.toLowerCase() })}
                                    className={`
                                py-8 text-2xl font-medium rounded-2xl border-2 transition-all
                                ${preferences.tone === t.toLowerCase()
                                            ? 'bg-sage text-white border-sage shadow-lg shadow-sage/20'
                                            : 'bg-white text-charcoal border-gray-200 hover:border-sage/50'}
                            `}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 3: Interests */}
                {currentStep === 3 && (
                    <div className="flex flex-wrap gap-4 justify-center">
                        {interestsList.map(item => {
                            const isSelected = preferences.interests.includes(item);
                            return (
                                <button
                                    key={item}
                                    onClick={() => toggleInterest(item)}
                                    className={`
                                px-6 py-4 rounded-full text-xl font-medium border-2 transition-all
                                ${isSelected
                                            ? 'bg-clay text-white border-clay shadow-lg shadow-clay/20'
                                            : 'bg-white text-charcoal border-sage/20 hover:border-sage'}
                            `}
                                >
                                    {item}
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="mt-auto pt-12 flex justify-between items-center">
                    <button
                        onClick={handleBack}
                        disabled={currentStep === 1}
                        className={`
                    flex items-center gap-2 px-8 py-4 text-xl font-medium rounded-2xl transition-colors
                    ${currentStep === 1 ? 'opacity-0 pointer-events-none' : 'text-charcoal hover:bg-black/5'}
                `}
                    >
                        <ArrowLeft size={24} /> Back
                    </button>

                    <button
                        onClick={handleNext}
                        className="flex items-center gap-2 px-10 py-5 bg-sage text-white text-xl font-bold rounded-2xl hover:bg-[#5b7a1e] transition-all shadow-xl shadow-sage/20"
                    >
                        {currentStep === 3 ? 'Finish' : 'Next'} <ArrowRight size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
}
