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
    const [isTyping, setIsTyping] = useState(false); // Track if typing is in progress

    const dialogues = [
        "Greetings, discerning visitor! Welcome to Zara's digital keep of innovation.",
        "I am toothless, guardian of these realms, here to illuminate the extraordinary talents you seek.",
        "Zara is a React Native Developer, a true weaver of digital magic, specializing in the amazing art of AI integration.",
        "Let’s explore her journey. Yet, should your time be as fleeting as a passing cloud, worry not here is the scroll of her deeds, and a way to reach her."
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

                // Fly to the middle (Main Position)
                await controls.start({
                    // x: Horizontal position. 
                    // "30vw" means 30% from the left edge of the screen. 
                    // "- 130px" shifts it further left. 
                    // Increase "30vw" to move RIGHT. Decrease to move LEFT.
                    x: "calc(30vw - 130px)",

                    // y: Vertical position.
                    // "10vh" means 10% down from the top.
                    // Increase (e.g., "20vh") to move DOWN. Decrease (e.g., "0vh") to move UP.
                    y: "10vh",

                    // scale: Size of the dragon. 1 is full size, 0.5 is half size.
                    scale: 1,

                    transition: {
                        duration: 3, // How long it takes to fly in (in seconds)
                        ease: "easeInOut"
                    }
                });

                // Show bubble immediately after arriving
                setShowBubble(true);

                // Start hovering in the middle (Bobbing Motion)
                controls.start({
                    // y: The vertical bobbing range.
                    // Starts at "10vh" (top), moves down to "12vh", then back to "10vh".
                    // Change these values to adjust how high/low it bobs.
                    y: ["10vh", "12vh", "10vh"],

                    transition: {
                        duration: 2, // One full up/down cycle takes 2 seconds
                        repeat: Infinity, // Loops forever
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
        if (currentDialogueIndex === 3) {
            timeout = setTimeout(() => {
                window.dispatchEvent(new Event('show-cv-tooltip'));
            }, 4000); // 1s delay after dialogue starts
        }
        return () => clearTimeout(timeout);
    }, [currentDialogueIndex]);

    function handleNextDialogue() {
        if (currentDialogueIndex < dialogues.length - 1) {
            setCurrentDialogueIndex(prev => prev + 1);
        } else if (showBubble) {
            // Only trigger end sequence if bubble is still showing
            // End sequence - Fly to First Safe
            setShowBubble(false);
            window.dispatchEvent(new Event('hide-cv-tooltip')); // Hide tooltips immediately
            controls.start({
                // x: 38vw to 46vw roughly targets the "First Safe" (left of center)
                x: "15vw",

                // y: 30vh roughly targets the first window vertical position
                y: "7vh",

                // scale: Reduced slightly as requested (0.85)
                scale: 0.65,

                transition: { duration: 3, ease: "easeInOut" }
            });
        }
    }

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
