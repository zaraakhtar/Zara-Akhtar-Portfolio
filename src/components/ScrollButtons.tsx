'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import styles from './ScrollButtons.module.css';

type ScrollType = 'cv' | 'contact' | null;

export const ScrollButtons: React.FC = () => {
    const [openScroll, setOpenScroll] = useState<ScrollType>(null);

    const handleOpen = (type: ScrollType) => {
        setOpenScroll(type);
    };

    const handleClose = () => {
        setOpenScroll(null);
    };

    return (
        <>
            <div className={styles.container}>
                {/* Top Button: Get CV */}
                <button
                    className={styles.scrollButton}
                    aria-label="Get CV"
                    onClick={() => handleOpen('cv')}
                >
                    <span className={styles.tooltip}>Get CV</span>
                    <Image
                        src="/scrollclosedbutton.svg"
                        alt="Closed Scroll Menu"
                        width={100}
                        height={100}
                        className={styles.scrollImage}
                        priority
                    />
                </button>

                {/* Bottom Button: Contact Now */}
                <button
                    className={styles.scrollButton}
                    aria-label="Contact Now"
                    onClick={() => handleOpen('contact')}
                >
                    <span className={styles.tooltip}>Contact Now</span>
                    <Image
                        src="/scrollclosedbutton.svg"
                        alt="Closed Scroll Menu"
                        width={100}
                        height={100}
                        className={styles.scrollImage}
                        priority
                    />
                </button>
            </div>

            {/* Modal Overlay */}
            <div
                className={`${styles.overlay} ${openScroll ? styles.active : ''}`}
                onClick={handleClose}
            >
                <div
                    className={styles.modalContent}
                    onClick={(e) => e.stopPropagation()} // Prevent closing when clicking content
                >
                    <Image
                        src="/scrollopenbutton.svg"
                        alt="Open Scroll"
                        width={600}
                        height={800}
                        className={styles.openScrollImage}
                    />

                    {/* Placeholder content area */}
                    <div className={styles.scrollContent}>
                        {openScroll === 'cv' && (
                            <div>
                                <h2>Curriculum Vitae</h2>
                                <p>CV content goes here...</p>
                            </div>
                        )}

                        {openScroll === 'contact' && (
                            <div>
                                <h2>Contact Me</h2>
                                <p>Contact form goes here...</p>
                            </div>
                        )}
                    </div>

                    {/* Close Button */}
                    <button
                        className={styles.closeButton}
                        onClick={handleClose}
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>
            </div>
        </>
    );
};
