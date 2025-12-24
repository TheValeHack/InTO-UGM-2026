"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function Butterfly({ src, className, startPos = { x: 0, y: 0 } }) {
    const butterflyRef = useRef(null);
    const [pos, setPos] = useState(startPos);
    const [flip, setFlip] = useState(1); // 1 for right, -1 for left
    const velocity = useRef({ x: Math.random() * 2 - 1, y: Math.random() * 2 - 1 });

    useEffect(() => {
        let animationFrameId;
        let currentX = startPos.x;
        let currentY = startPos.y;

        const move = () => {
            const parent = butterflyRef.current?.parentElement;
            if (!parent) return;

            const rect = parent.getBoundingClientRect();
            const butterflyWidth = 112; // w-28 is 7rem = 112px
            const butterflyHeight = 112;

            // Update positions
            currentX += velocity.current.x;
            currentY += velocity.current.y;

            // Boundaries
            if (currentX <= 0) {
                currentX = 0;
                velocity.current.x *= -1;
            } else if (currentX >= rect.width - butterflyWidth) {
                currentX = rect.width - butterflyWidth;
                velocity.current.x *= -1;
            }

            if (currentY <= 0) {
                currentY = 0;
                velocity.current.y *= -1;
            } else if (currentY >= rect.height - butterflyHeight) {
                currentY = rect.height - butterflyHeight;
                velocity.current.y *= -1;
            }

            // Randomly change velocity slightly to make it look "erratic"
            if (Math.random() < 0.02) {
                velocity.current.x += (Math.random() - 0.5) * 0.5;
                velocity.current.y += (Math.random() - 0.5) * 0.5;

                // Cap speed
                const speedLimit = 2;
                const speed = Math.sqrt(velocity.current.x ** 2 + velocity.current.y ** 2);
                if (speed > speedLimit) {
                    velocity.current.x = (velocity.current.x / speed) * speedLimit;
                    velocity.current.y = (velocity.current.y / speed) * speedLimit;
                }
            }

            // Update flip based on horizontal velocity
            if (velocity.current.x > 0.1) setFlip(1);
            else if (velocity.current.x < -0.1) setFlip(-1);

            setPos({ x: currentX, y: currentY });
            animationFrameId = requestAnimationFrame(move);
        };

        animationFrameId = requestAnimationFrame(move);
        return () => cancelAnimationFrame(animationFrameId);
    }, [startPos.x, startPos.y]);

    return (
        <div
            ref={butterflyRef}
            className={`absolute pointer-events-none z-50 ${className}`}
            style={{
                transform: `translate(${pos.x}px, ${pos.y}px) scaleX(${flip})`,
                transition: "transform 0.1s linear",
            }}
        >
            <Image
                src={src}
                width={112}
                height={112}
                alt="butterfly"
                className="w-20 md:w-full h-auto animate-flutter"
            />
        </div>
    );
}
