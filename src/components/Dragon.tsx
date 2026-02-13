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
    const [pendingAction, setPendingAction] = useState<string | null>(null);
    const [dialogueQueue, setDialogueQueue] = useState<{ text: string, action?: string }[]>([]);

    const [overrideText, setOverrideText] = useState<string | null>(null);

    const dialogues = [
        "Greetings, discerning visitor! Welcome to Zara's digital keep of innovation.",
        "I am toothless, guardian of these realms, here to illuminate the extraordinary talents you seek.",
        "Zara is a React Native Developer, a true weaver of digital magic, specializing in the amazing art of AI integration.",
        "Let’s explore her journey. Yet, should your time be as fleeting as a passing cloud, worry not here is the scroll of her deeds, and a way to reach her.",
        "We begin with her impactful contributions at TechNexus Innovations.",
        "A testament to cutting-edge development and AI integration. Click to see the details!"
    ];

    const currentText = overrideText || dialogues[currentDialogueIndex];
    const controls = useAnimation();

    // Listen for custom Dragon events
    useEffect(() => {
        const handleDragonSay = (e: CustomEvent) => {
            if (typeof e.detail === 'string') {
                setOverrideText(e.detail);
                setPendingAction(null);
            } else {
                setOverrideText(e.detail.text);
                setPendingAction(e.detail.nextAction);
            }
            setShowBubble(true);
            setIsTyping(true);
        };

        window.addEventListener('dragon-say', handleDragonSay as EventListener);

        return () => {
            window.removeEventListener('dragon-say', handleDragonSay as EventListener);
        };
    }, []);

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
    }, [showBubble, isTyping, currentDialogueIndex, overrideText]); // Dependencies for the closure

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
            // Show safe tooltip 3000ms after dialogue starts
            timeout = setTimeout(() => {
                window.dispatchEvent(new Event('show-safe-tooltip'));

                // Auto-hide safe tooltip 5 seconds after they appear
                hideTimeout = setTimeout(() => {
                    window.dispatchEvent(new Event('hide-safe-tooltip'));
                }, 5000); // 5s duration
            }, 3000);
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

    const scrollToPosition = (topPercent: number, duration: number = 2000) => {
        const docHeight = document.documentElement.scrollHeight;
        const targetY = (topPercent / 100) * docHeight;
        const viewportHeight = window.innerHeight;
        // Position target roughly at 1/3 down the screen for better visibility
        const destinationY = Math.max(0, targetY - (viewportHeight * 0.3));
        const startY = window.scrollY;
        const distance = destinationY - startY;
        let startTime: number | null = null;

        function animation(currentTime: number) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = easeInOutQuad(timeElapsed, startY, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        // Quadratic easing in/out
        function easeInOutQuad(t: number, b: number, c: number, d: number) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        requestAnimationFrame(animation);
    };

    function handleNextDialogue() {
        if (overrideText) {
            // Check if there are more dialogues in the queue
            if (dialogueQueue.length > 0) {
                const nextDialogue = dialogueQueue[0];
                setDialogueQueue(prev => prev.slice(1));
                setOverrideText(nextDialogue.text);

                // Handle actions attached to queued dialogues
                if (nextDialogue.action === 'show-safe-3-tooltip') {
                    window.dispatchEvent(new Event('show-safe-3-tooltip'));
                    setTimeout(() => {
                        window.dispatchEvent(new Event('hide-safe-3-tooltip'));
                    }, 5000);
                } else if (nextDialogue.action === 'show-safe-4-tooltip') {
                    window.dispatchEvent(new Event('show-safe-4-tooltip'));
                    setTimeout(() => {
                        window.dispatchEvent(new Event('hide-safe-4-tooltip'));
                    }, 5000);
                } else if (nextDialogue.action === 'show-safe-5-tooltip') {
                    window.dispatchEvent(new Event('show-safe-5-tooltip'));
                    setTimeout(() => {
                        window.dispatchEvent(new Event('hide-safe-5-tooltip'));
                    }, 5000);
                } else if (nextDialogue.action === 'show-safe-6-tooltip') {
                    window.dispatchEvent(new Event('show-safe-6-tooltip'));
                    setTimeout(() => {
                        window.dispatchEvent(new Event('hide-safe-6-tooltip'));
                    }, 5000);
                } else if (nextDialogue.action === 'show-safe-7-tooltip') {
                    window.dispatchEvent(new Event('show-safe-7-tooltip'));
                    setTimeout(() => {
                        window.dispatchEvent(new Event('hide-safe-7-tooltip'));
                    }, 5000);
                }

                setShowBubble(true);
                setIsTyping(true);
                return;
            }

            // If showing override text and queue is empty, just close it and reset
            setShowBubble(false);
            setOverrideText(null);

            if (pendingAction === 'move-to-safe-2') {
                setPendingAction(null);
                scrollToPosition(10);
                controls.start({
                    left: "22%",
                    top: "10%",
                    transition: { duration: 1.5, ease: "easeInOut" }
                }).then(() => {
                    setOverrideText("Even in early days, Zara demonstrated a strong foundation. Click for the details.");
                    setTimeout(() => {
                        window.dispatchEvent(new Event('show-safe-2-tooltip'));
                        setTimeout(() => {
                            window.dispatchEvent(new Event('hide-safe-2-tooltip'));
                        }, 5000);
                    }, 2500);
                    setShowBubble(true);
                    setIsTyping(true);

                    // Resume hovering (Bobbing Motion) at new position
                    controls.start({
                        top: ["10%", "11%", "10%"],
                        transition: {
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }
                    });
                });
            } else if (pendingAction === 'move-to-safe-3') {
                setPendingAction(null);
                scrollToPosition(20);
                controls.start({
                    left: "35%", // Calculated to be to the left of the 3rd safe (which is at right 36.5%)
                    top: "20%",  // Calculated offset from safe top (29.5%) similar to safe 2
                    transition: { duration: 1.5, ease: "easeInOut" }
                }).then(() => {
                    setDialogueQueue([
                        { text: "This antient treasure box safeguards Zara's most formidable skills." },
                        { text: "The foundation of modern mobile development, infused with intelligent systems. Click to uncover the list!", action: 'show-safe-3-tooltip' }
                    ]);
                    setOverrideText("Having witnessed her professional journey, now we delve into the very essence of Zara's capabilities.");
                    setShowBubble(true);
                    setIsTyping(true);

                    // Resume hovering (Bobbing Motion) at new position
                    controls.start({
                        top: ["20%", "21%", "20%"],
                        transition: {
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }
                    });
                });
            } else if (pendingAction === 'move-to-safe-4') {
                setPendingAction(null);
                scrollToPosition(34);
                controls.start({
                    left: "22%",
                    top: "32%",
                    transition: { duration: 1.5, ease: "easeInOut" }
                }).then(() => {
                    setOverrideText("What truly distinguishes a developer? Her collaborative spirit and approach to challenges. Explore Zara's professional ethos.");
                    setTimeout(() => {
                        window.dispatchEvent(new Event('show-safe-4-tooltip'));
                        setTimeout(() => {
                            window.dispatchEvent(new Event('hide-safe-4-tooltip'));
                        }, 5000);
                    }, 1500); // Small delay for effect
                    setShowBubble(true);
                    setIsTyping(true);

                    // Resume hovering (Bobbing Motion) at new position
                    controls.start({
                        top: ["32%", "33%", "32%"],
                        transition: {
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }
                    });
                });
            } else if (pendingAction === 'move-to-safe-5') {
                setPendingAction(null);
                scrollToPosition(46);
                controls.start({
                    left: "35%",
                    top: "45%",
                    transition: { duration: 1.5, ease: "easeInOut" }
                }).then(() => {
                    setDialogueQueue([
                        { text: "Here, we see Zara's continuous commitment to learning and personal growth." },
                        { text: "The academic roots of her expertise. Click to view her qualifications.", action: 'show-safe-5-tooltip' }
                    ]);
                    setOverrideText("Every tower stands upon a solid foundation, built with dedication and foresight.");
                    setShowBubble(true);
                    setIsTyping(true);

                    // Resume hovering (Bobbing Motion) at new position
                    controls.start({
                        top: ["45%", "46%", "45%"],
                        transition: {
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }
                    });
                });
            } else if (pendingAction === 'move-to-safe-6') {
                setPendingAction(null);
                scrollToPosition(58);
                controls.start({
                    left: "22%",
                    top: "55%",
                    transition: { duration: 1.5, ease: "easeInOut" }
                }).then(() => {
                    setOverrideText("Zara's dedication to staying current and expanding her knowledge. See her commitment!");
                    setTimeout(() => {
                        window.dispatchEvent(new Event('show-safe-6-tooltip'));
                        setTimeout(() => {
                            window.dispatchEvent(new Event('hide-safe-6-tooltip'));
                        }, 5000);
                    }, 1500); // Small delay
                    setShowBubble(true);
                    setIsTyping(true);

                    // Resume hovering (Bobbing Motion) at new position
                    controls.start({
                        top: ["55%", "56%", "55%"],
                        transition: {
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }
                    });
                });
            } else if (pendingAction === 'move-to-safe-7') {
                setPendingAction(null);
                scrollToPosition(70);
                controls.start({
                    left: "35%",
                    top: "69%",
                    transition: { duration: 1.5, ease: "easeInOut" }
                }).then(() => {
                    setOverrideText("Beyond professional mandates, Zara explores her passion for creation. These projects showcase her initiative.");
                    setTimeout(() => {
                        window.dispatchEvent(new Event('show-safe-7-tooltip'));
                        setTimeout(() => {
                            window.dispatchEvent(new Event('hide-safe-7-tooltip'));
                        }, 5000);
                    }, 1500); // Small delay
                    setShowBubble(true);
                    setIsTyping(true);

                    // Resume hovering (Bobbing Motion) at new position
                    controls.start({
                        top: ["69%", "70%", "69%"],
                        transition: {
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }
                    });
                });
            }
            return;
        }

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
