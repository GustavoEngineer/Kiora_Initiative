import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const CHARS = '-./_[]{}*+?@AZ0123456789'

export default function ScrambleText({ text, className }) {
    const [scrambled, setScrambled] = useState(text || '')
    const intervalRef = useRef(null)
    const timeoutRef = useRef(null)

    useEffect(() => {
        if (!text) return

        let iteration = 0
        const maxIterations = 15 // How many scramble frames before locking

        clearInterval(intervalRef.current)

        intervalRef.current = setInterval(() => {
            setScrambled(prev => {
                const target = text
                const length = target.length

                // Construct scrambled string
                return target
                    .split('')
                    .map((char, index) => {
                        if (index < iteration) {
                            return target[index]
                        }
                        return CHARS[Math.floor(Math.random() * CHARS.length)]
                    })
                    .join('')
            })

            // Unveil characters gradually
            if (iteration >= text.length) {
                clearInterval(intervalRef.current)
                setScrambled(text) // Ensure final consistency
            }

            // Speed of unveiling
            iteration += 1 / 3
        }, 30) // Speed of scramble updates

        return () => clearInterval(intervalRef.current)
    }, [text])

    return (
        <motion.h1
            className={className}
            layout
        >
            {scrambled}
        </motion.h1>
    )
}
