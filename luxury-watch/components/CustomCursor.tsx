"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the device has a fine pointer (mouse vs touch)
    if (window.matchMedia("(pointer: fine)").matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsVisible(true);
    }

    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Triggers hovering expansion for interactable elements
      if (
        window.getComputedStyle(target).cursor === "pointer" ||
        target.tagName.toLowerCase() === "button" ||
        target.tagName.toLowerCase() === "a" ||
        target.closest("button") || 
        target.closest("a") || 
        target.closest(".group") // Specifically expanding on collection cards
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", updatePosition);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", updatePosition);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 w-4 h-4 rounded-full pointer-events-none mix-blend-difference z-[9999]"
      style={{ backgroundColor: isHovering ? "#D4AF37" : "#FFFFFF" }}
      animate={{
        x: position.x - 8,
        y: position.y - 8,
        scale: isHovering ? 3 : 1,
        opacity: isHovering ? 0.3 : 1,
      }}
      transition={{ type: "tween", ease: "backOut", duration: 0.15 }}
    />
  );
}
