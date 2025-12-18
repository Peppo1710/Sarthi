import React, { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, Loader } from "@react-three/drei";
import { Mic, Send, Square } from "lucide-react";
import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";
import { Model } from "./Avatar"; // Importing the rewritten Avatar component

export default function ChatPage() {
    const [start, setStart] = useState(false);
    const [userInput, setUserInput] = useState("");
    const [isListening, setIsListening] = useState(false);

    // Avatar State
    const [avatarText, setAvatarText] = useState("");
    const [avatarEmotion, setAvatarEmotion] = useState("neutral");

    // --- 1. SPEECH TO TEXT (MICROPHONE) ---
    const startListening = () => {
        setIsListening(true);
        const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(
            import.meta.env.VITE_AZURE_KEY,
            import.meta.env.VITE_AZURE_REGION
        );
        speechConfig.speechRecognitionLanguage = "en-US";

        const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
        const recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);

        recognizer.recognizing = (s, e) => {
            setUserInput(e.result.text);
        };

        recognizer.recognized = (s, e) => {
            if (e.result.text) {
                setUserInput(prev => (prev ? prev + " " : "") + e.result.text);
            }
        };

        recognizer.startContinuousRecognitionAsync();
        window.currentRecognizer = recognizer;
    };

    const stopListening = () => {
        setIsListening(false);
        if (window.currentRecognizer) {
            window.currentRecognizer.stopContinuousRecognitionAsync();
            window.currentRecognizer = null;
        }
    };

    // --- 2. SEND TO BACKEND ---
    const handleSend = async () => {
        if (!userInput) return;
        if (isListening) stopListening();

        console.log("User Input:", userInput);

        try {
            // Send user text to your Python backend
            // Ensure your backend returns JSON: { "text": "...", "emotion": "..." }
            const response = await fetch("http://localhost:8000/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userInput })
            });

            if (!response.ok) throw new Error("Backend connection failed");

            const data = await response.json();

            // Update Avatar State
            console.log("Avatar Response:", data);
            setAvatarEmotion(data.emotion); // e.g., "happy", "sad"
            setAvatarText(data.text);       // The text the avatar will speak

        } catch (error) {
            console.error("Fetch error:", error);
            alert("Could not connect to backend. Is Python running?");
        }

        setUserInput("");
    };

    return (
        <div style={{ width: "100vw", height: "100vh", position: "relative", fontFamily: 'sans-serif', backgroundColor: '#FDFBF7' }}>

            {/* --- START OVERLAY --- */}
            {!start && (
                <div style={styles.overlay} onClick={() => setStart(true)}>
                    <button style={styles.startBtn}>CLICK TO START SARTHI</button>
                </div>
            )}

            {/* --- 3D SCENE --- */}
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <Environment preset="sunset" />
                <ambientLight intensity={0.8} />
                <directionalLight position={[5, 5, 5]} intensity={0.5} />

                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    target={[0, 0, 0]}
                    minPolarAngle={Math.PI / 2.5}
                    maxPolarAngle={Math.PI / 2}
                />

                <Suspense fallback={null}>
                    {start && (
                        <Model
                            textToSpeak={avatarText}
                            emotion={avatarEmotion}
                            position={[0, -3, 0]}
                            scale={2}
                        />
                    )}
                </Suspense>
            </Canvas>
            <Loader />

            {/* --- UI CONTROLS --- */}
            {start && (
                <div style={styles.uiContainer}>
                    <textarea
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Type or speak to Sarthi..."
                        style={styles.input}
                    />
                    <div style={styles.btnGroup}>
                        {/* MIC BUTTON */}
                        <button
                            onClick={isListening ? stopListening : startListening}
                            style={{ ...styles.iconBtn, backgroundColor: isListening ? '#ef4444' : '#6B8E23' }}
                        >
                            {isListening ? <Square size={24} color="white" /> : <Mic size={24} color="white" />}
                        </button>

                        {/* SEND BUTTON */}
                        <button onClick={handleSend} style={{ ...styles.iconBtn, backgroundColor: '#D27D59' }}>
                            <Send size={24} color="white" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// Styles
const styles = {
    overlay: {
        position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
        backgroundColor: "rgba(0,0,0,0.85)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, cursor: "pointer"
    },
    startBtn: {
        padding: "20px 40px", fontSize: "24px", cursor: "pointer", background: "#6B8E23", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold"
    },
    uiContainer: {
        position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)',
        width: '90%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '10px',
        backgroundColor: 'white', padding: '20px', borderRadius: '15px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
    },
    input: {
        width: '100%', padding: '15px', borderRadius: '8px', border: '2px solid #e5e7eb',
        fontSize: '16px', resize: 'none', height: '60px', outline: 'none'
    },
    btnGroup: { display: 'flex', gap: '10px' },
    iconBtn: {
        flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center',
        padding: '12px', borderRadius: '8px', border: 'none', cursor: 'pointer', transition: '0.2s'
    }
};