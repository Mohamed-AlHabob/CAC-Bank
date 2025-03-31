"use client";
import React, { ReactNode, useEffect, useRef } from 'react'
import gsap from 'gsap';

export default function Magnetic({ children }: { children: ReactNode }) {
    const magnetic = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!magnetic.current) return;

        console.log(children);
        const xTo = gsap.quickTo(magnetic.current, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
        const yTo = gsap.quickTo(magnetic.current, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

        const handleMouseMove = (e: MouseEvent) => {
            if (!magnetic.current) return;
            const { clientX, clientY } = e;
            const { height, width, left, top } = magnetic.current.getBoundingClientRect();
            const x = clientX - (left + width / 2);
            const y = clientY - (top + height / 2);
            xTo(x * 0.35);
            yTo(y * 0.35);
        };

        const handleMouseLeave = () => {
            xTo(0);
            yTo(0);
        };

        magnetic.current.addEventListener("mousemove", handleMouseMove);
        magnetic.current.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            magnetic.current?.removeEventListener("mousemove", handleMouseMove);
            // eslint-disable-next-line react-hooks/exhaustive-deps
            magnetic.current?.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [children]);

    return React.cloneElement(children as React.ReactElement, { ref: magnetic });
}
