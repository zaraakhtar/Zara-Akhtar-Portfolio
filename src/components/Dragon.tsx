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
    const [textScale, setTextScale] = useState(1);
    const [isTyping, setIsTyping] = useState(false); // Track if typing is in progress

    const dialogues = [
        "Greetings, discerning visitor! Welcome to Zara's digital keep of innovation.",
        "I am toothless, guardian of these realms, here to illuminate the extraordinary talents you seek.",
        "Zara is a React Native Developer, a true weaver of digital magic, specializing in the amazing art of AI integration.",
        "Let’s explore her journey. Yet, should your time be as fleeting as a passing cloud, worry not here is the scroll of her deeds, and a way to reach her.",
        "We begin with her impactful contributions at TechNexus Innovations.",
        "A testament to cutting-edge development and AI integration. Click to see the details!"
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
                // Start off-screen to the left relative to the tower
                await controls.start({
                    x: 0, // Reset any transforms
                    y: 0,
                    left: "-25%", // Start off the side of the tower
                    top: "10%",
                    scale: 0.5,
                    transition: { duration: 0 }
                });

                // Fly to the middle of first and 2nd window, towards the center
                await controls.start({
                    left: "22%", // More towards the center (Tower center is ~50%, Dragon width is 25%)
                    top: "8%", // Vertically between 1st safe (7.4%) and 2nd safe (18.5%)
                    scale: 1,
                    transition: {
                        duration: 3,
                        ease: "easeInOut"
                    }
                });

                // Show bubble immediately after arriving
                setShowBubble(true);

                // Start hovering (Bobbing Motion)
                controls.start({
                    top: ["8%", "9%", "8%"], // Bob vertically around the new position
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

    // Handle skip on click/tap
    useEffect(() => {
        const handleSkip = () => {
            if (showBubble && !isTyping) {
                handleNextDialogue();
            } else if (showBubble && isTyping) {
                // Optional: Could make it complete typing instantly here if desired
                // For now, simpler to just ignore or let it skip to next
                // Let's make it skip to next immediately for impatience
                handleNextDialogue();
            }
        };

        window.addEventListener('click', handleSkip);
        window.addEventListener('keydown', handleSkip); // For accessibility

        return () => {
            window.removeEventListener('click', handleSkip);
            window.removeEventListener('keydown', handleSkip);
        };
    }, [showBubble, isTyping, currentDialogueIndex]); // Dependencies for the closure

    // Handle Tooltip Timing for 3rd Dialogue
    useEffect(() => {
        let timeout: NodeJS.Timeout;
        let hideTimeout: NodeJS.Timeout;

        if (currentDialogueIndex === 3) {
            // Show tooltips 4 seconds after dialogue starts
            timeout = setTimeout(() => {
                window.dispatchEvent(new Event('show-cv-tooltip'));

                // Auto-hide tooltips 5 seconds after they appear
                hideTimeout = setTimeout(() => {
                    window.dispatchEvent(new Event('hide-cv-tooltip'));
                }, 5000); // 5s duration
            }, 4000);
        }

        if (currentDialogueIndex === 5) {
            // Show safe tooltip 500ms after dialogue starts
            timeout = setTimeout(() => {
                window.dispatchEvent(new Event('show-safe-tooltip'));

                // Auto-hide safe tooltip 5 seconds after they appear
                hideTimeout = setTimeout(() => {
                    window.dispatchEvent(new Event('hide-safe-tooltip'));
                }, 5000); // 5s duration
            }, 500);
        }

        return () => {
            clearTimeout(timeout);
            clearTimeout(hideTimeout);
        };
    }, [currentDialogueIndex]);

    // Move Dragon to First Safe position when dialogue index reaches 4 and delay dialogue
    useEffect(() => {
        if (currentDialogueIndex === 4) {
            // Hide bubble while moving
            setShowBubble(false);

            controls.start({
                left: "22%",
                top: "3%",
                scale: 0.65,
                transition: { duration: 2, ease: "easeInOut" }
            }).then(() => {
                setTextScale(1 / 0.65);
                setShowBubble(true);
            });
        }
    }, [currentDialogueIndex, controls]);

    function handleNextDialogue() {
        if (currentDialogueIndex < dialogues.length - 1) {
            setCurrentDialogueIndex(prev => prev + 1);
        } else if (showBubble) {
            // Only trigger end sequence if bubble is still showing
            // End sequence - Fly to First Safe
            setShowBubble(false);
            window.dispatchEvent(new Event('hide-cv-tooltip'));
            window.dispatchEvent(new Event('hide-safe-tooltip'));

            // Dragon stays there or flies away? 
            // For now, let's just make it hover there or maybe fly up/away?
            // The user didn't specify what happens *after* these new dialogues, 
            // implying the "end state" is just hanging out there or maybe moving to the next one later.
            // I'll keep it there for now.
        }
    }

    return (
        <motion.div
            animate={controls}
            style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: '25%', // Use percentage for scaling relative to Tower
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
                    scale={textScale}
                    onTypingStart={() => setIsTyping(true)}
                    onTypingComplete={() => setIsTyping(false)}
                    onComplete={() => {
                        // This is now purely for the "wait after finishing" logic
                        // If user doesn't click, this will eventually trigger the next one
                        const timeoutId = setTimeout(() => {
                            handleNextDialogue();
                        }, currentDialogueIndex === dialogues.length - 1 ? 3000 : 2000); // Wait time
                        return () => clearTimeout(timeoutId);
                    }}
                />
            </div>
        </motion.div>
    );
};

export default Dragon;
