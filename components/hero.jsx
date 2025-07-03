"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

const HeroSection = () => {
    const imageRef = useRef(null);

    useEffect(() => {
        const imageElement = imageRef.current;

        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const scrollThreshold = 100;

            if (scrollPosition > scrollThreshold) {
                imageElement.classList.add("scrolled");
            } else {
                imageElement.classList.remove("scrolled");
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="pt-23 pb-20 px-4 bg-background text-foreground transition-colors duration-300">
            <div className="container mx-auto text-center">
                <h1 className="text-3xl md:text-6xl lg:text-[95px] pb-6 gradient-title">
                    Your Financial Clarity <br /> Powered by AI
                </h1>

                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                    Master your money. No guesswork.
                    <br />
                    AI-driven finance tracking that puts you in full control—
                    track smarter, spend wiser, grow faster.
                </p>

                <div className="flex justify-center space-x-4 pb-6">
                    <Link href="/dashboard">
                        <Button size="lg" className="px-8">
                            Try It Now!
                        </Button>
                    </Link>

                    <Link
                        href="https://github.com/UG-Prabhmeet/MoneyMap"
                        target="_blank"
                    >
                        <Button size="lg" variant="outline" className="px-8">
                            Explore the Code →
                        </Button>
                    </Link>
                </div>

                <div className="hero-image-wrapper">
                    <div
                        ref={imageRef}
                        className="hero-image transition-transform duration-500 ease-in-out"
                    >
                        <Image
                            src="/banner.jpg"
                            width={1280}
                            height={720}
                            alt="banner image"
                            className="rounded-lg shadow-4xl border border-border mx-auto"
                            priority
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
