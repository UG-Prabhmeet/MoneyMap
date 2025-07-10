"use client";

import { motion } from "framer-motion";

export default function AnimatedText({ text }) {
    const words = text.split(" ");

    return (
        <>
            {words.map((word, index) => (
                <motion.span
                    key={index}
                    initial={{ filter: "blur(10px)", opacity: 0, y: 12 }}
                    whileInView={{ filter: "blur(0)", opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.05 * index }}
                    className="inline-block"
                >
                    {word}&nbsp;
                </motion.span>
            ))}
        </>
    );
}
