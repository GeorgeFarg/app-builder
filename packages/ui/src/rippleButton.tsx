"use client";
import React, { useRef, MouseEvent, ButtonHTMLAttributes } from "react";

interface RippleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

const RippleButton: React.FC<RippleButtonProps> = ({
  children,
  className = "",
  onClick,
  ...props
}) => {
  const btnRef = useRef<HTMLButtonElement>(null);

  const createRipple = (event: MouseEvent<HTMLButtonElement>) => {
    const button = btnRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const ripple = document.createElement("span");
    ripple.style.position = "absolute";
    ripple.className = "ripple-effect";
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    button.appendChild(ripple);

    requestAnimationFrame(() => ripple.classList.add("ripple-animate"));

    ripple.addEventListener("transitionend", () => ripple.remove());
  };

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    createRipple(e);
    if (onClick) onClick(e);
  };

  return (
    <button
      ref={btnRef}
      onClick={handleClick}
      style={{ overflow: "hidden", position: "relative" }}
      className={`inline-flex items-center justify-center ${className}`}
      {...props}>
      {children}
      <style>{`
        .ripple-effect {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.35);
          transform: scale(0);
          pointer-events: none;
          opacity: 0.75;
        }
        .ripple-animate {
          transform: scale(1);
          opacity: 0;
          transition: transform 600ms ease-out, opacity 600ms ease-out;
        }
      `}</style>
    </button>
  );
};

export default RippleButton;
