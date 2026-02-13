'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import styles from './BackgroundMusic.module.css';

export const BackgroundMusic: React.FC = () => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(0.1);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        // Attempt to play on mount
        const playAudio = async () => {
            if (audioRef.current) {
                try {
                    audioRef.current.volume = volume;
                    await audioRef.current.play();
                    setIsPlaying(true);
                } catch (err) {
                    console.log("Autoplay blocked. User interaction needed.", err);
                    setIsPlaying(false);
                }
            }
        };

        playAudio();

        // Add a click listener to the document to start audio if autoplay failed
        const handleUserInteraction = () => {
            if (audioRef.current && audioRef.current.paused) {
                audioRef.current.play()
                    .then(() => {
                        setIsPlaying(true);
                        // Once playing, remove the listener
                        document.removeEventListener('click', handleUserInteraction);
                        document.removeEventListener('keydown', handleUserInteraction);
                    })
                    .catch(e => console.error("Play failed after interaction:", e));
            }
        };

        document.addEventListener('click', handleUserInteraction);
        document.addEventListener('keydown', handleUserInteraction);

        return () => {
            document.removeEventListener('click', handleUserInteraction);
            document.removeEventListener('keydown', handleUserInteraction);
        };
    }, []);

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play().then(() => setIsPlaying(true)).catch(e => console.error(e));
        }
    };

    const toggleMute = () => {
        if (!audioRef.current) return;

        const newMutedState = !isMuted;
        setIsMuted(newMutedState);
        audioRef.current.muted = newMutedState;
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
            if (newVolume > 0 && isMuted) {
                setIsMuted(false);
                audioRef.current.muted = false;
            }
        }
    };

    return (
        <div
            className={styles.container}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <audio
                ref={audioRef}
                src="/music/main_theme.mp3"
                loop
                preload="auto"
            />

            {/* Volume Control Slider (Visible on Hover/Click) */}
            <div
                className={styles.controls}
                style={{
                    opacity: isHovered ? 1 : 0,
                    visibility: isHovered ? 'visible' : 'hidden'
                }}
            >
                <div className={styles.sliderContainer}>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={handleVolumeChange}
                        className={styles.volumeSlider}
                        aria-label="Volume Control"
                    />
                </div>
            </div>

            {/* Mute/Unmute Icon Button */}
            <button
                onClick={toggleMute}
                className={styles.button}
                aria-label={isMuted ? "Unmute" : "Mute"}
                title={isMuted ? "Unmute" : "Mute"}
            >
                {isMuted || volume === 0 ? (
                    <VolumeX size={24} />
                ) : (
                    <Volume2 size={24} />
                )}
            </button>
        </div>
    );
};
