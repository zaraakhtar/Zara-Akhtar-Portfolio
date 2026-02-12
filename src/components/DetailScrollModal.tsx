'use client';

import React from 'react';
import Image from 'next/image';
import styles from './DetailScrollModal.module.css';

interface DetailScrollModalProps {
    isOpen: boolean;
    onClose: () => void;
    imageSrc?: string;
    children?: React.ReactNode;
}

const DetailScrollModal: React.FC<DetailScrollModalProps> = ({
    isOpen,
    onClose,
    imageSrc = "/middetailscroll.svg",
    children
}) => {
    return (
        <div
            className={`${styles.overlay} ${isOpen ? styles.active : ''}`}
            onClick={onClose}
        >
            <div
                className={styles.modalContent}
                onClick={(e) => e.stopPropagation()}
            >
                <Image
                    src={imageSrc}
                    alt="Detail Scroll"
                    width={600}
                    height={800}
                    className={styles.scrollImage}
                    priority // Load quickly
                />

                <div className={styles.contentContainer}>
                    {children}
                </div>

                <button
                    className={styles.closeButton}
                    onClick={onClose}
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
    );
};

export default DetailScrollModal;
