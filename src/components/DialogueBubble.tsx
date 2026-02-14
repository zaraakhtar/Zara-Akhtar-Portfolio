"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './DialogueBubble.module.css';

interface DialogueBubbleProps {
    text: string;
    isVisible: boolean;
    scale?: number; // Added scale prop
    onComplete?: () => void;
    onTypingStart?: () => void;
    onTypingComplete?: () => void;
    position?: 'top' | 'bottom' | 'left' | 'right'; // Could be useful for placement context
}

const DialogueBubble: React.FC<DialogueBubbleProps> = ({
    text = "",
    isVisible,
    scale = 1, // Default scale to 1
    onComplete,
    onTypingStart,
    onTypingComplete
}) => {
    const [displayedText, setDisplayedText] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        if (isVisible) {
            setIsTyping(true);
            setDisplayedText('');
            if (onTypingStart) onTypingStart();
        } else {
            setIsTyping(false);
            setDisplayedText('');
        }
    }, [isVisible, text]); // Removed onTypingStart from dependency to avoid loop if unstable

    useEffect(() => {
        if (isTyping && displayedText.length < text.length) {
            const timeout = setTimeout(() => {
                setDisplayedText(text.slice(0, displayedText.length + 1));
            }, 50); // Typing speed
            return () => clearTimeout(timeout);
        } else if (isTyping && displayedText.length === text.length) {
            setIsTyping(false);
            if (onTypingComplete) onTypingComplete();
            if (onComplete) onComplete();
        }
    }, [isTyping, displayedText, text, onComplete]); // Removed onTypingComplete to avoid loop

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 * scale, y: 10 }}
                    animate={{ opacity: 1, scale: 1 * scale, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8 * scale, y: 10 }}
                    className={styles.bubbleContainer}
                >
                    {/* Text Content */}
                    <div className={styles.textContent}>
                        {displayedText}
                        {isTyping && (
                            <span className={styles.cursor}></span>
                        )}
                    </div>

                    {/* Speech Bubble Arrow (CSS Triangle) */}
                    <div className={styles.tailBorder}></div>
                    <div className={styles.tailMask}></div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default DialogueBubble;
