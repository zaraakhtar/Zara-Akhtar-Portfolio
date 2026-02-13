'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './Tower.module.css';
import detailStyles from './DetailScrollModal.module.css';
import Dragon from './Dragon';
import { Smartphone, Zap, Mic, Database, Layout, Code, Server } from 'lucide-react';
import DetailScrollModal from './DetailScrollModal';

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
    const [showSafe2Tooltip, setShowSafe2Tooltip] = useState(false);
    const [showSafe3Tooltip, setShowSafe3Tooltip] = useState(false);
    const [showSafe4Tooltip, setShowSafe4Tooltip] = useState(false);
    const [showSafe5Tooltip, setShowSafe5Tooltip] = useState(false);
    const [showSafe6Tooltip, setShowSafe6Tooltip] = useState(false);
    const [showSafe7Tooltip, setShowSafe7Tooltip] = useState(false);
    const [activeScroll, setActiveScroll] = useState<string | null>(null);

    useEffect(() => {
        const handleShow = () => setShowSafeTooltip(true);
        const handleHide = () => setShowSafeTooltip(false);
        const handleShow2 = () => setShowSafe2Tooltip(true);
        const handleHide2 = () => setShowSafe2Tooltip(false);
        const handleShow3 = () => setShowSafe3Tooltip(true);
        const handleHide3 = () => setShowSafe3Tooltip(false);
        const handleShow4 = () => setShowSafe4Tooltip(true);
        const handleHide4 = () => setShowSafe4Tooltip(false);
        const handleShow5 = () => setShowSafe5Tooltip(true);
        const handleHide5 = () => setShowSafe5Tooltip(false);
        const handleShow6 = () => setShowSafe6Tooltip(true);
        const handleHide6 = () => setShowSafe6Tooltip(false);
        const handleShow7 = () => setShowSafe7Tooltip(true);
        const handleHide7 = () => setShowSafe7Tooltip(false);

        window.addEventListener('show-safe-tooltip', handleShow);
        window.addEventListener('hide-safe-tooltip', handleHide);
        window.addEventListener('show-safe-2-tooltip', handleShow2);
        window.addEventListener('hide-safe-2-tooltip', handleHide2);
        window.addEventListener('show-safe-3-tooltip', handleShow3);
        window.addEventListener('hide-safe-3-tooltip', handleHide3);
        window.addEventListener('show-safe-4-tooltip', handleShow4);
        window.addEventListener('hide-safe-4-tooltip', handleHide4);
        window.addEventListener('show-safe-5-tooltip', handleShow5);
        window.addEventListener('hide-safe-5-tooltip', handleHide5);
        window.addEventListener('show-safe-6-tooltip', handleShow6);
        window.addEventListener('hide-safe-6-tooltip', handleHide6);
        window.addEventListener('show-safe-7-tooltip', handleShow7);
        window.addEventListener('hide-safe-7-tooltip', handleHide7);

        return () => {
            window.removeEventListener('show-safe-tooltip', handleShow);
            window.removeEventListener('hide-safe-tooltip', handleHide);
            window.removeEventListener('show-safe-2-tooltip', handleShow2);
            window.removeEventListener('hide-safe-2-tooltip', handleHide2);
            window.removeEventListener('show-safe-3-tooltip', handleShow3);
            window.removeEventListener('hide-safe-3-tooltip', handleHide3);
            window.removeEventListener('show-safe-4-tooltip', handleShow4);
            window.removeEventListener('hide-safe-4-tooltip', handleHide4);
            window.removeEventListener('show-safe-5-tooltip', handleShow5);
            window.removeEventListener('hide-safe-5-tooltip', handleHide5);
            window.removeEventListener('show-safe-6-tooltip', handleShow6);
            window.removeEventListener('hide-safe-6-tooltip', handleHide6);
            window.removeEventListener('show-safe-7-tooltip', handleShow7);
            window.removeEventListener('hide-safe-7-tooltip', handleHide7);
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

    const handleCloseModal = () => {
        if (activeScroll === 'safe-1') {
            setIsFirstSafeOpen(false);
            window.dispatchEvent(new CustomEvent('dragon-say', {
                detail: {
                    text: "Notice the depth of her AI implementation and end-to-end ownership. This is the caliber of professional you seek.",
                    nextAction: "move-to-safe-2"
                }
            }));
        }
        if (activeScroll === 'safe-2') {
            setIsSecondSafeOpen(false);
            window.dispatchEvent(new CustomEvent('dragon-say', {
                detail: {
                    text: "From the outset, a commitment to quality and problem-solving has defined Zara's approach.",
                    nextAction: "move-to-safe-3"
                }
            }));
        }
        if (activeScroll === 'safe-3') {
            setIsThirdSafeOpen(false);
            window.dispatchEvent(new CustomEvent('dragon-say', {
                detail: {
                    text: "Zara's technical command spans the entire mobile ecosystem, with a keen focus on performance and AI integration.",
                    nextAction: "move-to-safe-4"
                }
            }));
        }
        if (activeScroll === 'safe-4') {
            setIsFourthSafeOpen(false);
            window.dispatchEvent(new CustomEvent('dragon-say', {
                detail: {
                    text: "A skilled developer is also a strategic thinker and a valuable team member. Zara embodies these qualities.",
                    nextAction: "move-to-safe-5" // Assuming next safe action
                }
            }));
        }
        if (activeScroll === 'safe-5') {
            setIsFifthSafeOpen(false);
            window.dispatchEvent(new CustomEvent('dragon-say', {
                detail: {
                    text: "A strong academic background underpins her practical skills.",
                    nextAction: "move-to-safe-6"
                }
            }));
        }
        if (activeScroll === 'safe-6') {
            setIsSixthSafeOpen(false);
            window.dispatchEvent(new CustomEvent('dragon-say', {
                detail: {
                    text: "An active learner is a growing asset. Zara consistently refines her craft.",
                    nextAction: "move-to-safe-7"
                }
            }));
        }
        if (activeScroll === 'safe-7') {
            setIsSeventhSafeOpen(false);
            window.dispatchEvent(new CustomEvent('dragon-say', {
                detail: {
                    text: "These endeavors, while personal, demonstrate Zara's innate drive to build and innovate.",
                    // nextAction: "end-sequence" ??
                }
            }));
        }
        setActiveScroll(null);
    };

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
                        onClick={() => {
                            const newState = !isFirstSafeOpen;
                            setIsFirstSafeOpen(newState);
                            if (newState) setActiveScroll('safe-1');
                        }}
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
                        onClick={() => {
                            const newState = !isSecondSafeOpen;
                            setIsSecondSafeOpen(newState);
                            if (newState) setActiveScroll('safe-2');
                        }}
                    >
                        <div className={`${styles.safeTooltip} ${showSafe2Tooltip ? styles.visible : ''}`}>
                            Click Me!
                        </div>
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
                        onClick={() => {
                            const newState = !isThirdSafeOpen;
                            setIsThirdSafeOpen(newState);
                            if (newState) setActiveScroll('safe-3');
                        }}
                    >
                        <div className={`${styles.safeTooltip} ${showSafe3Tooltip ? styles.visible : ''}`}>
                            Click Me!
                        </div>
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
                        onClick={() => {
                            const newState = !isFourthSafeOpen;
                            setIsFourthSafeOpen(newState);
                            if (newState) setActiveScroll('safe-4');
                        }}
                    >
                        <div className={`${styles.safeTooltip} ${showSafe4Tooltip ? styles.visible : ''}`}>
                            Click Me!
                        </div>
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
                        onClick={() => {
                            const newState = !isFifthSafeOpen;
                            setIsFifthSafeOpen(newState);
                            if (newState) setActiveScroll('safe-5');
                        }}
                    >
                        <div className={`${styles.safeTooltip} ${showSafe5Tooltip ? styles.visible : ''}`}>
                            Click Me!
                        </div>
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
                        onClick={() => {
                            const newState = !isSixthSafeOpen;
                            setIsSixthSafeOpen(newState);
                            if (newState) setActiveScroll('safe-6');
                        }}
                    >
                        <div className={`${styles.safeTooltip} ${showSafe6Tooltip ? styles.visible : ''}`}>
                            Click Me!
                        </div>
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
                        onClick={() => {
                            const newState = !isSeventhSafeOpen;
                            setIsSeventhSafeOpen(newState);
                            if (newState) setActiveScroll('safe-7');
                        }}
                    >
                        <div className={`${styles.safeTooltip} ${showSafe7Tooltip ? styles.visible : ''}`}>
                            Click Me!
                        </div>
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
            {/* Modal Overlay for Scrolls */}
            <DetailScrollModal
                isOpen={!!activeScroll}
                onClose={handleCloseModal}
            >
                {activeScroll === 'safe-1' && (
                    <>
                        <div className={detailStyles.jobTitle}>React Native Developer</div>
                        <div className={detailStyles.companyName}>at TechNexus Innovations</div>
                        <ul className={detailStyles.jobDetails}>
                            <li className={detailStyles.jobDetailItem}>
                                <strong>Converted a Web App to a Mobile App Interface</strong> and implemented the UI from scratch.
                            </li>
                            <li className={detailStyles.jobDetailItem}>
                                <strong>End-to-End Development:</strong> Architected and deployed a cross-platform mobile application (iOS/Android) featuring 30+ screens for AI-driven SWOT analysis and survey management.
                            </li>
                            <li className={detailStyles.jobDetailItem}>
                                <strong>Real-Time AI Integration:</strong> Developed a high-performance streaming AI chat interface using WebSockets, implementing custom reconnection logic and chunk-based message handling for instant responses.
                            </li>
                            <li className={detailStyles.jobDetailItem}>
                                <strong>Voice Communication (Current):</strong> Engineering a real-time voice-to-voice interaction layer for the AI chatbot, focusing on low-latency audio processing and seamless UI synchronization.
                            </li>
                            <li className={detailStyles.jobDetailItem}>
                                <strong>State & Data Management:</strong> Implemented a robust offline-first architecture using Redux Toolkit and Redux Persist, ensuring data consistency across complex multi-step workflows.
                            </li>
                            <li className={detailStyles.jobDetailItem}>
                                <strong>Scalable UI System:</strong> Designed a library of reusable TypeScript components and integrated React Native Reanimated for fluid, high-frame-rate animations.
                            </li>
                        </ul>
                    </>
                )}
                {activeScroll === 'safe-2' && (
                    <>
                        <div className={detailStyles.jobTitle}>Internship Mobile UI Developer</div>
                        <div className={detailStyles.companyName}>
                            at <a href="https://thewebsolutionsdevelopment.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>The Web Solutions</a>
                        </div>
                        <ul className={detailStyles.jobDetails}>
                            <li className={detailStyles.jobDetailItem}>
                                <strong>Worked on the UI of an E-commerce app.</strong>
                            </li>
                            <li className={detailStyles.jobDetailItem}>
                                <strong>Ensured timely delivery of project milestones with high-quality, well-structured code.</strong>
                            </li>
                            <li className={detailStyles.jobDetailItem}>
                                <strong>Independently resolved technical challenges, demonstrating strong problem-solving skills.</strong>
                            </li>
                        </ul>
                    </>
                )}
                {activeScroll === 'safe-3' && (
                    <>
                        <div className={detailStyles.jobTitle}>Core Mobile Development & AI-Related Technologies</div>
                        {/* No company name for skills list, or maybe just a spacer */}
                        <div style={{ marginBottom: '1rem' }}></div>
                        <ul className={detailStyles.jobDetails}>
                            <li className={detailStyles.jobDetailItem}>
                                <strong>Mobile Frameworks:</strong> React Native (CLI), TypeScript, JavaScript (ES6+), React Navigation.
                            </li>
                            <li className={detailStyles.jobDetailItem}>
                                <strong>AI/Real-Time Integration:</strong> WebSockets (Socket.io), RESTful APIs, Axios.
                            </li>
                            <li className={detailStyles.jobDetailItem}>
                                <strong>State Management:</strong> Redux Toolkit, Context API, AsyncStorage, Redux Persist.
                            </li>
                            <li className={detailStyles.jobDetailItem}>
                                <strong>UI/UX & Animation:</strong> React Native Reanimated, Gorhom Bottom Sheet, Vector Icons, React Hook Form.
                            </li>
                            <li className={detailStyles.jobDetailItem}>
                                <strong>Tools & Dev-Ops:</strong> Git, Unit Testing, Dev Tools, VS Code.
                            </li>
                        </ul>
                    </>
                )}
                {activeScroll === 'safe-4' && (
                    <>
                        <div className={detailStyles.jobTitle}>Professional & Soft Skills</div>
                        <div style={{ marginBottom: '1rem' }}></div>
                        <ul className={detailStyles.jobDetails}>
                            <li className={detailStyles.jobDetailItem}>
                                <strong>Problem-Solving:</strong> Able to independently troubleshoot and solve technical challenges.
                            </li>
                            <li className={detailStyles.jobDetailItem}>
                                <strong>Communication:</strong> Clear and professional in written and verbal communication, including documenting code and collaborating with teams.
                            </li>
                            <li className={detailStyles.jobDetailItem}>
                                <strong>Adaptability:</strong> Quick to learn new tools, frameworks, and processes.
                            </li>
                            <li className={detailStyles.jobDetailItem}>
                                <strong>Time Management:</strong> Organized and focused, consistently meeting deadlines and project goals.
                            </li>
                            <li className={detailStyles.jobDetailItem}>
                                <strong>Team Player:</strong> Collaborative mindset with a positive, proactive attitude toward team goals.
                            </li>
                        </ul>
                    </>
                )}
                {activeScroll === 'safe-5' && (
                    <>
                        <div className={detailStyles.jobTitle}>Education</div>
                        <div style={{ marginBottom: '1rem' }}></div>
                        <ul className={detailStyles.jobDetails}>
                            <li className={detailStyles.jobDetailItem}>
                                Bachelor of Science in Software Engineering (4 years) from <strong>Virtual University of Pakistan</strong>
                            </li>
                        </ul>
                    </>
                )}
                {activeScroll === 'safe-6' && (
                    <>
                        <div className={detailStyles.jobTitle}>Certifications & Continuous Learning</div>
                        <div style={{ marginBottom: '1rem' }}></div>
                        <ul className={detailStyles.jobDetails}>
                            <li className={detailStyles.jobDetailItem}>Programming with JavaScript</li>
                            <li className={detailStyles.jobDetailItem}>React Native by Meta</li>
                            <li className={detailStyles.jobDetailItem}>React Basics by Meta</li>
                            <li className={detailStyles.jobDetailItem}>Version Control</li>
                            <li className={detailStyles.jobDetailItem}>Introduction to Mobile Development</li>
                            <li className={detailStyles.jobDetailItem}>Principles of UX/UI Design</li>
                            <li className={detailStyles.jobDetailItem}>Google Prompting Essentials</li>
                        </ul>
                    </>
                )}
                {activeScroll === 'safe-7' && (
                    <>
                        <div className={detailStyles.jobTitle}>Personal Projects</div>
                        <div style={{ marginBottom: '1rem' }}></div>
                        <ul className={detailStyles.jobDetails}>
                            <li className={detailStyles.jobDetailItem}>
                                <strong>BudgetMe - Personal Finance Tracking App</strong> (Brief description, GitHub Link)
                            </li>
                            <li className={detailStyles.jobDetailItem}>
                                <strong>Wellness Wise - AI health Android App</strong> (Brief description, GitHub Link)
                            </li>
                        </ul>
                    </>
                )}
                {activeScroll !== 'safe-1' && activeScroll !== 'safe-2' && activeScroll !== 'safe-3' && activeScroll !== 'safe-4' && activeScroll !== 'safe-5' && activeScroll !== 'safe-6' && activeScroll !== 'safe-7' && activeScroll && (
                    <h2>Details for {activeScroll.replace('-', ' ')}</h2>
                )}
            </DetailScrollModal>
        </div>
    );
};

export default Tower;
