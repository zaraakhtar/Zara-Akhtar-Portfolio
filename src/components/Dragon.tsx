"use client";

import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import DialogueBubble from './DialogueBubble';

interface DragonProps {
    // We can expand this prop to control different paths later
    // For now, it defaults to the initial "enter scene" behavior
    flightPath?: 'enter' | 'hover';
}

const Dragon: React.FC<DragonProps> = ({ flightPath = 'enter' }) => {
    const [wingsUp, setWingsUp] = useState(true);
    const [showBubble, setShowBubble] = useState(false);
    const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);

    const dialogues = [
        "Greetings, discerning visitor! Welcome to Zara's digital keep of innovation.",
        "I am toothless, guardian of these realms, here to illuminate the extraordinary talents you seek.",
        "Zara is a React Native Developer, a true weaver of digital magic, specializing in the whispers of AI integration."
    ];

    const currentText = dialogues[currentDialogueIndex];
    const controls = useAnimation();

    // Wing flapping animation
    useEffect(() => {
        const flapInterval = setInterval(() => {
            setWingsUp((prev) => !prev);
        }, 200); // Adjust speed of flapping here

        return () => clearInterval(flapInterval);
    }, []);

    // Flight path animation
    useEffect(() => {
        const sequence = async () => {
            if (flightPath === 'enter') {
                // Start off-screen to the left (top-left relative to tower)
                await controls.start({
                    x: -200,
                    y: 100,
                    scale: 0.5,
                    transition: { duration: 0 }
                });

                // Fly to the middle
                await controls.start({
                    x: "calc(30vw - 130px)", // Roughly center (adjusting for width)
                    y: "20vh",
                    scale: 1,
                    transition: {
                        duration: 3,
                        ease: "easeInOut"
                    }
                });

                // Show bubble immediately after arriving
                setShowBubble(true);

                // Start hovering in the middle
                controls.start({
                    y: ["20vh", "22vh", "20vh"],
                    transition: {
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }
                });
            }
        };

        sequence();
    }, [flightPath, controls]);

    return (
        <motion.div
            animate={controls}
            style={{
                position: 'fixed',
                left: 0,
                top: 0,
                width: '300px', // Adjust size as needed
                height: 'auto',
                zIndex: 50, // Ensure it's above other elements but below crucial UI if needed
                pointerEvents: 'none' // Let clicks pass through unless dragon is interactive
            }}
        >
            <img
                src={wingsUp ? "/dragonwingsup.svg" : "/dragonwingsdown.svg"}
                alt="Dragon"
                style={{
                    width: '100%',
                    height: '100%',
                    filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.5))' // Add some shadow for depth
                }}
            />
            <div className="absolute top-[30%] left-[30%] transform -translate-x-1/2 -translate-y-full">
                <DialogueBubble
                    text={currentText}
                    isVisible={showBubble}
                    onComplete={() => {
                        if (currentDialogueIndex < dialogues.length - 1) {
                            setTimeout(() => {
                                setCurrentDialogueIndex(prev => prev + 1);
                            }, currentDialogueIndex === 0 ? 3000 : 2000); // 3s wait after first, 2s after second
                        }
                    }}
                />
            </div>
        </motion.div>
    );
};

export default Dragon;
