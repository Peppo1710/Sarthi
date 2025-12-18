import React, { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, Loader } from "@react-three/drei";
import { Mic, Square } from "lucide-react";
import { useConversation } from '@11labs/react';
import { Model } from "./Avatar";

export default function ChatPage() {
    const [start, setStart] = useState(false);

    // 1. ELEVENLABS HOOK
    const conversation = useConversation({
        onConnect: () => console.log("Connected"),
        onDisconnect: () => console.log("Disconnected"),
        onMessage: (message) => console.log("Message:", message),
        onError: (error) => console.error("Error:", error),
    });

    const isConnected = conversation.status === 'connected';
    const isSpeaking = conversation.isSpeaking;

    // 2. HANDLE CONNECTION
    const toggleConnection = async () => {
        if (isConnected) {
            await conversation.endSession();
        } else {
            // Request mic permission first
            await navigator.mediaDevices.getUserMedia({ audio: true });

            // Start the session (Use your Agent ID)
            await conversation.startSession({
                agentId: import.meta.env.VITE_ELEVENLABS_AGENT_ID,
            });
        }
    };

    return (
        <div style={{ width: "100vw", height: "100vh", position: "relative", fontFamily: 'sans-serif', backgroundColor: '#FDFBF7' }}>

            {!start && (
                <div style={styles.overlay} onClick={() => setStart(true)}>
                    <button style={styles.startBtn}>ENTER EXPERIENCE</button>
                </div>
            )}

            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <Environment preset="sunset" />
                <OrbitControls target={[0, 0, 0]} enableZoom={false} />

                <Suspense fallback={null}>
                    {start && (
                        <Model
                            // Pass the raw volume level (0 to 1) provided by the SDK if available,
                            // OR we let the Avatar handle its own logic.
                            // For now, let's pass the 'isSpeaking' boolean to start simple animation
                            isSpeaking={isSpeaking}
                            position={[0, -3, 0]}
                            scale={2}
                        />
                    )}
                </Suspense>
            </Canvas>
            <Loader />

            {/* CONTROLS */}
            {start && (
                <div style={styles.uiContainer}>
                    <div style={{ textAlign: 'center', marginBottom: 10, color: '#666' }}>
                        {isConnected ? (isSpeaking ? "Agent is speaking..." : "Listening...") : "Click Mic to Connect"}
                    </div>

                    <button
                        onClick={toggleConnection}
                        style={{
                            ...styles.micBtn,
                            backgroundColor: isConnected ? '#ef4444' : '#6B8E23'
                        }}
                    >
                        {isConnected ? <Square size={32} color="white" /> : <Mic size={32} color="white" />}
                    </button>
                </div>
            )}
        </div>
    );
}

const styles = {
    overlay: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.85)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
    startBtn: { padding: "20px 40px", fontSize: "24px", cursor: "pointer", background: "#6B8E23", color: "white", border: "none", borderRadius: "8px" },
    uiContainer: { position: 'absolute', bottom: '50px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' },
    micBtn: { width: '80px', height: '80px', borderRadius: '50%', border: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }
};