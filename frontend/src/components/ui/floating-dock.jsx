import React, { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import './floating-dock.css'

export const FloatingDock = ({ items, className }) => {
    let mouseX = useMotionValue(Infinity)

    return (
        <motion.div
            onMouseMove={(e) => mouseX.set(e.pageX)}
            onMouseLeave={() => mouseX.set(Infinity)}
            className={`floating-dock-container ${className}`}
        >
            {items.map((item) => (
                <IconContainer mouseX={mouseX} key={item.title} {...item} />
            ))}
        </motion.div>
    )
}

function IconContainer({ mouseX, title, icon, href, onClick, isActive }) {
    let ref = useRef(null)

    let distance = useTransform(mouseX, (val) => {
        let bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 }
        return val - bounds.x - bounds.width / 2
    })

    let widthSync = useTransform(distance, [-150, 0, 150], [50, 100, 50])
    let width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 })

    return (
        <motion.div
            ref={ref}
            style={{ width }}
            className={`dock-icon-wrapper ${isActive ? 'active' : ''}`}
            onClick={onClick}
            title={title}
        >
            <div className="dock-icon-inner">
                {icon}
            </div>
            {isActive && <div className="active-dot" />}
        </motion.div>
    )
}
