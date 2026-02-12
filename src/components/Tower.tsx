'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './Tower.module.css';
import Dragon from './Dragon';

interface CloudData {
    id: string;
    top: number;
    scale: number;
    duration: number;
    delay: number;
    direction: 'left' | 'right';
    zIndex: number;
    opacity: number;
    imageSrc: string;
    widthPercent: string;
    maxWidthPx: string;
}

export const Tower: React.FC = () => {
    // State to track if each safe is open
    const [isFirstSafeOpen, setIsFirstSafeOpen] = useState(false);
    const [isSecondSafeOpen, setIsSecondSafeOpen] = useState(false);
    const [isThirdSafeOpen, setIsThirdSafeOpen] = useState(false);
    const [isFourthSafeOpen, setIsFourthSafeOpen] = useState(false);

    const [isFifthSafeOpen, setIsFifthSafeOpen] = useState(false);
    const [isSixthSafeOpen, setIsSixthSafeOpen] = useState(false);
    const [isSeventhSafeOpen, setIsSeventhSafeOpen] = useState(false);

    const [clouds, setClouds] = useState<CloudData[]>([]);
    const [showSafeTooltip, setShowSafeTooltip] = useState(false);

    useEffect(() => {
        const handleShow = () => setShowSafeTooltip(true);
        const handleHide = () => setShowSafeTooltip(false);

        window.addEventListener('show-safe-tooltip', handleShow);
        window.addEventListener('hide-safe-tooltip', handleHide);

        return () => {
            window.removeEventListener('show-safe-tooltip', handleShow);
            window.removeEventListener('hide-safe-tooltip', handleHide);
        };
    }, []);

    useEffect(() => {
        const newClouds: CloudData[] = [];
        const smallCloudCount = 12; // Number of smaller clouds
        const longCloudCount = 3; // Number of long clouds of each type (right and left)

        // --- Generate Small Clouds (Top Section) ---
        for (let i = 0; i < smallCloudCount; i++) {
            const isFront = Math.random() > 0.4;
            const direction = Math.random() > 0.5 ? 'left' : 'right';
            const duration = 25 + Math.random() * 35;

            newClouds.push({
                id: `small-${i}`,
                top: -9 + Math.random() * 25, // Start higher and cover more of the top section
                scale: .8 + Math.random() * 0.4, // Update scale
                duration,
                delay: -Math.random() * duration,
                direction,
                zIndex: isFront ? 2 : 0,
                opacity: 0.7 + Math.random() * 0.3,
                imageSrc: "/longcloud.svg", // Fix path
                widthPercent: '30%', // Increase width
                maxWidthPx: '300px', // Increase max width
            });
        }

        // --- Generate Long Clouds (Middle and Bottom - Moving Right) ---
        for (let i = 0; i < longCloudCount; i++) {
            const isFront = Math.random() > 0.5;
            const duration = 40 + Math.random() * 40;

            let topPosition;
            if (i === 0) { // First long cloud, upper-middle
                topPosition = 30 + Math.random() * 5; // e.g., 35-40%
            } else if (i === 1) { // Second long cloud, lower-middle
                topPosition = 50 + Math.random() * 5; // e.g., 50-55%
            } else { // Third long cloud, bottom
                topPosition = 65 + Math.random() * 5; // e.g., 65-70%
            }

            newClouds.push({
                id: `long-right-${i}`,
                top: topPosition,
                scale: 1.0 + Math.random() * 0.4, // Slightly larger scale
                duration,
                delay: -Math.random() * duration,
                direction: 'right', // Explicitly moving right
                zIndex: isFront ? 2 : 0,
                opacity: 0.6 + Math.random() * 0.4,
                imageSrc: "/longcloud.svg", // Use the non-flipped long cloud
                widthPercent: '40%', // Example width for long clouds
                maxWidthPx: '400px', // Example max width
            });
        }

        // --- Generate Long Clouds (Middle and Bottom - Moving Left) ---
        for (let i = 0; i < longCloudCount; i++) {
            const isFront = Math.random() > 0.5;
            const duration = 40 + Math.random() * 40;

            let topPosition;
            if (i === 0) { // First long cloud, upper-middle
                topPosition = 40 + Math.random() * 5; // e.g., 40-45% (slightly offset from right-movers)
            } else if (i === 1) { // Second long cloud, lower-middle
                topPosition = 55 + Math.random() * 5; // e.g., 55-60%
            } else { // Third long cloud, bottom
                topPosition = 70 + Math.random() * 5; // e.g., 70-75%
            }


            newClouds.push({
                id: `long-left-${i}`,
                top: topPosition,
                scale: 1.0 + Math.random() * 0.4,
                duration,
                delay: -Math.random() * duration,
                direction: 'left', // Explicitly moving left
                zIndex: isFront ? 2 : 0,
                opacity: 0.6 + Math.random() * 0.4,
                imageSrc: "/longcloudleft.svg", // Use the flipped long cloud
                widthPercent: '40%',
                maxWidthPx: '400px',
            });
        }

        setClouds(newClouds);
    }, []);

    return (
        <div className={styles.towerContainer}>
            <div className={styles.towerWrapper}>
                <div className={styles.towerImageContainer}>
                    {/* Clouds */}
                    {clouds.map((cloud) => (
                        <img
                            key={cloud.id}
                            src={cloud.imageSrc}
                            alt=""
                            className={`${styles.cloud} ${cloud.zIndex === 2 ? styles.cloudFront : styles.cloudBehind} ${cloud.direction === 'right' ? styles.moveRight : styles.moveLeft}`}
                            style={{
                                top: `${cloud.top}%`,
                                animationDuration: `${cloud.duration}s`,
                                animationDelay: `${cloud.delay}s`,
                                transform: `scale(${cloud.scale})`,
                                opacity: cloud.opacity,
                                width: cloud.widthPercent,
                                maxWidth: cloud.maxWidthPx,
                            }}
                        />
                    ))}

                    <Image
                        src="/fulltower.svg"
                        alt="Dragon Tower"
                        width={1440}
                        height={3855}
                        className={styles.towerImage}
                        priority
                    />

                    {/* Dragon - Animated Character */}
                    <Dragon />

                    {/* First Window Safe (left side) */}
                    <div
                        className={styles.firstSafe}
                        onClick={() => setIsFirstSafeOpen(!isFirstSafeOpen)}
                    >
                        <div className={`${styles.safeTooltip} ${showSafeTooltip ? styles.visible : ''}`}>
                            Click Me!
                        </div>
                        <Image
                            src={isFirstSafeOpen ? "/safeoneopen.svg" : "/safeoneclosed.svg"}
                            alt="First Safe"
                            width={200}
                            height={200}
                            className={styles.safeImage}
                        />
                    </div>

                    {/* Second Window Safe (left side, lower) */}
                    <div
                        className={styles.secondSafe}
                        onClick={() => setIsSecondSafeOpen(!isSecondSafeOpen)}
                    >
                        <Image
                            src={isSecondSafeOpen ? "/safeoneopen.svg" : "/safeoneclosed.svg"}
                            alt="Second Safe"
                            width={200}
                            height={200}
                            className={styles.safeImage}
                        />
                    </div>

                    {/* Third Window Safe (right side) */}
                    <div
                        className={styles.thirdSafe}
                        onClick={() => setIsThirdSafeOpen(!isThirdSafeOpen)}
                    >
                        <Image
                            src={isThirdSafeOpen ? "/safetwoopen.svg" : "/safetwoclosed.svg"}
                            alt="Third Safe"
                            width={200}
                            height={200}
                            className={styles.safeImage}
                        />
                    </div>

                    {/* Fourth Window Safe (left side, lower) */}
                    <div
                        className={styles.fourthSafe}
                        onClick={() => setIsFourthSafeOpen(!isFourthSafeOpen)}
                    >
                        <Image
                            src={isFourthSafeOpen ? "/safetwoopen.svg" : "/safetwoclosed.svg"}
                            alt="Fourth Safe"
                            width={200}
                            height={200}
                            className={styles.safeImage}
                        />
                    </div>

                    {/* Fifth Window Safe (right side) */}
                    <div
                        className={styles.fifthSafe}
                        onClick={() => setIsFifthSafeOpen(!isFifthSafeOpen)}
                    >
                        <Image
                            src={isFifthSafeOpen ? "/safethreeopen.svg" : "/safethreeclosed.svg"}
                            alt="Fifth Safe"
                            width={200}
                            height={200}
                            className={styles.safeImage}
                        />
                    </div>

                    {/* Sixth Window Safe (left side) */}
                    <div
                        className={styles.sixthSafe}
                        onClick={() => setIsSixthSafeOpen(!isSixthSafeOpen)}
                    >
                        <Image
                            src={isSixthSafeOpen ? "/safethreeopen.svg" : "/safethreeclosed.svg"}
                            alt="Sixth Safe"
                            width={200}
                            height={200}
                            className={styles.safeImage}
                        />
                    </div>

                    {/* Seventh Window Safe (right side) */}
                    <div
                        className={styles.seventhSafe}
                        onClick={() => setIsSeventhSafeOpen(!isSeventhSafeOpen)}
                    >
                        <Image
                            src={isSeventhSafeOpen ? "/safethreeopen.svg" : "/safethreeclosed.svg"}
                            alt="Seventh Safe"
                            width={200}
                            height={200}
                            className={styles.safeImage}
                        />
                    </div>
                </div>
            </div>

            {/* Left Bushes */}
            <div className={styles.leftBushes}>
                <Image
                    src="/leftbushes.svg"
                    alt="Left Bushes"
                    width={500}
                    height={300}
                    className={styles.bushImage}
                />
            </div>

            {/* Right Bushes */}
            <div className={styles.rightBushes}>
                <Image
                    src="/rightbushes.svg"
                    alt="Right Bushes"
                    width={500}
                    height={300}
                    className={styles.bushImage}
                />
            </div>
        </div>
    );
};

export default Tower;
