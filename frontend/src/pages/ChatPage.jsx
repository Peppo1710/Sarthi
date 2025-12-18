import React from 'react';

export default function ChatPage() {
    return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-cream text-sage">
            <h1 className="text-4xl font-serif font-bold mb-4">Chat with Sarthi</h1>
            <p className="text-xl text-charcoal/70">Start talking to your companion...</p>
            {/* Visual placeholder for mic */}
            <div className="mt-12 w-32 h-32 rounded-full bg-sage flex items-center justify-center shadow-lg shadow-sage/30 animate-pulse">
                <span className="text-6xl text-white">🎙️</span>
            </div>
        </div>
    );
}
