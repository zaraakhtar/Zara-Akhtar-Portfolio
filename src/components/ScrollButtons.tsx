'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './ScrollButtons.module.css';
import { Github, Linkedin, Mail, Phone } from 'lucide-react';

type ScrollType = 'cv' | 'contact' | null;

export const ScrollButtons: React.FC = () => {
    const [openScroll, setOpenScroll] = useState<ScrollType>(null);
    const [copyStatus, setCopyStatus] = useState(false);
    const [forceTooltip, setForceTooltip] = useState(false);

    useEffect(() => {
        const handleShow = () => setForceTooltip(true);
        const handleHide = () => setForceTooltip(false);

        window.addEventListener('show-cv-tooltip', handleShow);
        window.addEventListener('hide-cv-tooltip', handleHide);
        window.addEventListener('show-contact-tooltip', handleShow);
        window.addEventListener('hide-contact-tooltip', handleHide);

        return () => {
            window.removeEventListener('show-cv-tooltip', handleShow);
            window.removeEventListener('hide-cv-tooltip', handleHide);
            window.removeEventListener('show-contact-tooltip', handleShow);
            window.removeEventListener('hide-contact-tooltip', handleHide);
        };
    }, []);

    const handleOpen = (type: ScrollType) => {
        setOpenScroll(type);
    };

    const handleClose = () => {
        setOpenScroll(null);
    };

    return (
        <>
            {copyStatus && (
                <div className={styles.copyNotification}>
                    Email Copied to Clipboard!
                </div>
            )}
            <div className={styles.container}>
                {/* Top Button: Get CV (Direct Download) */}
                <a
                    href="/React Native Developer CV - Zara Akhtar.pdf"
                    download="React_Native_Developer_CV_Zara_Akhtar.pdf"
                    className={`${styles.scrollButton} ${forceTooltip ? styles.forceTooltip : ''}`}
                    aria-label="Get CV"
                >
                    <span className={styles.tooltip}>Get CV</span>
                    <Image
                        src="/scrollclosedbutton.svg"
                        alt="Get CV"
                        width={100}
                        height={100}
                        className={styles.scrollImage}
                        priority
                    />
                </a>

                {/* Bottom Button: Contact Now */}
                <button
                    className={`${styles.scrollButton} ${forceTooltip ? styles.forceTooltip : ''}`}
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
                            <>
                                <h2 className={styles.contactTitle}>CONTACT NOW</h2>
                                <div className={styles.contactList}>
                                    <a href="https://github.com/zaraakhtar" target="_blank" rel="noopener noreferrer" className={styles.contactItem} title="GitHub">
                                        <Github className={styles.contactIcon} size={32} />
                                    </a>

                                    <a href="https://www.linkedin.com/in/zara-akhtar-app-developer/" target="_blank" rel="noopener noreferrer" className={styles.contactItem} title="LinkedIn">
                                        <Linkedin className={styles.contactIcon} size={32} />
                                    </a>

                                    <div className={styles.contactItem} title="zarakhtr9@gmail.com" onClick={() => {
                                        navigator.clipboard.writeText('zarakhtr9@gmail.com');
                                        setCopyStatus(true);
                                        setTimeout(() => setCopyStatus(false), 2000);
                                    }}>
                                        <Mail className={styles.contactIcon} size={32} />
                                    </div>

                                    <div className={styles.contactItem} title="" onClick={() => {
                                        //navigator.clipboard.writeText('+923099461865');
                                        //setCopyStatus(true);
                                        //setTimeout(() => setCopyStatus(false), 2000);
                                    }}>
                                        <Phone className={styles.contactIcon} size={32} />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Close Button */}
                    <button
                        className={styles.closeButton}
                        onClick={handleClose}
                        aria-label="Close"
                    >
                        <Image
                            src="/cross.svg"
                            alt="Close"
                            width={50}
                            height={50}
                        />
                    </button>
                </div>
            </div>
        </>
    );
};
