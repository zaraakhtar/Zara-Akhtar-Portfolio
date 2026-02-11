'use client';

import React, { useEffect, useRef } from 'react';

export const StarryBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size to window size
        const setCanvasSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        setCanvasSize();

        // Mouse position tracking
        const mouse = {
            x: -1000,
            y: -1000,
        };

        // Detect if device supports touch (mobile)
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

        // Star class for twinkling effect
        class Star {
            x: number;
            y: number;
            radius: number;
            opacity: number;
            twinkleSpeed: number;
            twinkleDirection: number;
            maxOpacity: number;
            isCross: boolean;
            baseOpacity: number;

            constructor() {
                this.x = Math.random() * canvas!.width;
                this.y = Math.random() * canvas!.height;
                this.radius = Math.random() * 1.5 + 0.3;
                this.opacity = Math.random();
                this.baseOpacity = this.opacity;
                this.twinkleSpeed = Math.random() * 0.02 + 0.005;
                this.twinkleDirection = Math.random() > 0.5 ? 1 : -1;
                this.maxOpacity = Math.random() * 0.5 + 0.5;
                this.isCross = Math.random() > 0.85; // 15% chance for cross/sparkle stars
            }

            update() {
                // Normal twinkling
                this.opacity += this.twinkleSpeed * this.twinkleDirection;

                if (this.opacity >= this.maxOpacity) {
                    this.twinkleDirection = -1;
                } else if (this.opacity <= 0.1) {
                    this.twinkleDirection = 1;
                }

                // Desktop only: Cursor interaction
                if (!isTouchDevice) {
                    const dx = this.x - mouse.x;
                    const dy = this.y - mouse.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const interactionRadius = 150;

                    if (distance < interactionRadius) {
                        // Boost twinkle speed and intensity for stars near cursor
                        const influence = 1 - distance / interactionRadius;
                        this.twinkleSpeed = (Math.random() * 0.04 + 0.01) * (1 + influence * 2);
                        this.maxOpacity = Math.min(1, this.maxOpacity + influence * 0.3);
                    } else {
                        // Reset to normal twinkle speed when far from cursor
                        this.twinkleSpeed = Math.random() * 0.02 + 0.005;
                    }
                }
            }

            draw(ctx: CanvasRenderingContext2D) {
                ctx.save();
                ctx.globalAlpha = this.opacity;

                if (this.isCross) {
                    // Draw cross/sparkle star
                    ctx.strokeStyle = '#ffffff';
                    ctx.lineWidth = this.radius * 0.5;

                    // Vertical line
                    ctx.beginPath();
                    ctx.moveTo(this.x, this.y - this.radius * 4);
                    ctx.lineTo(this.x, this.y + this.radius * 4);
                    ctx.stroke();

                    // Horizontal line
                    ctx.beginPath();
                    ctx.moveTo(this.x - this.radius * 4, this.y);
                    ctx.lineTo(this.x + this.radius * 4, this.y);
                    ctx.stroke();
                } else {
                    // Draw regular circular star
                    ctx.fillStyle = '#ffffff';
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                    ctx.fill();
                }

                ctx.restore();
            }
        }

        // Nebula/Galaxy cloud class
        class Nebula {
            x: number;
            y: number;
            radius: number;
            color: string;
            opacity: number;

            constructor() {
                this.x = Math.random() * canvas!.width;
                this.y = Math.random() * canvas!.height;
                this.radius = Math.random() * 150 + 100;
                const colors = [
                    'rgba(30, 64, 175, 0.3)',   // Blue
                    'rgba(56, 189, 248, 0.2)',  // Light blue
                    'rgba(59, 130, 246, 0.25)', // Sky blue
                ];
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.opacity = Math.random() * 0.3 + 0.1;
            }

            draw(ctx: CanvasRenderingContext2D) {
                const gradient = ctx.createRadialGradient(
                    this.x, this.y, 0,
                    this.x, this.y, this.radius
                );

                gradient.addColorStop(0, this.color);
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

                ctx.save();
                ctx.globalAlpha = this.opacity;
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        // Create stars and nebulae
        const stars: Star[] = [];
        const nebulae: Nebula[] = [];

        // Increase star count significantly (reduced divisor from 3000 to 1500)
        const starCount = Math.floor((canvas.width * canvas.height) / 1500);
        for (let i = 0; i < starCount; i++) {
            stars.push(new Star());
        }

        // Create 3-5 nebula clouds
        const nebulaCount = Math.floor(Math.random() * 3) + 3;
        for (let i = 0; i < nebulaCount; i++) {
            nebulae.push(new Nebula());
        }

        // Mouse move handler (desktop only)
        const handleMouseMove = (e: MouseEvent) => {
            if (!isTouchDevice) {
                mouse.x = e.clientX;
                mouse.y = e.clientY;
            }
        };

        // Add mouse move listener only for desktop
        if (!isTouchDevice) {
            window.addEventListener('mousemove', handleMouseMove);
        }

        // Animation loop
        const animate = () => {
            // Create gradient background (dark blue to darker navy)
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, '#0f172a'); // Darker blue-gray
            gradient.addColorStop(0.5, '#1e1b4b'); // Dark indigo
            gradient.addColorStop(1, '#0c0a1f'); // Very dark navy

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw nebulae first (background layer)
            nebulae.forEach(nebula => nebula.draw(ctx));

            // Update and draw stars
            stars.forEach(star => {
                star.update();
                star.draw(ctx);
            });

            requestAnimationFrame(animate);
        };

        animate();

        // Handle window resize
        const handleResize = () => {
            setCanvasSize();

            // Recreate stars and nebulae for new size
            stars.length = 0;
            nebulae.length = 0;

            const newStarCount = Math.floor((canvas.width * canvas.height) / 1500);
            for (let i = 0; i < newStarCount; i++) {
                stars.push(new Star());
            }

            const newNebulaCount = Math.floor(Math.random() * 3) + 3;
            for (let i = 0; i < newNebulaCount; i++) {
                nebulae.push(new Nebula());
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (!isTouchDevice) {
                window.removeEventListener('mousemove', handleMouseMove);
            }
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 w-full h-full -z-10"
            aria-hidden="true"
        />
    );
};

export default StarryBackground;
