import React from "react";

type ButtonProps = {
  variant?: "default" | "starborder";
  className?: string;
  children?: React.ReactNode;
  color?: string;
  speed?: React.CSSProperties["animationDuration"];
  thickness?: number;
  style?: React.CSSProperties;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({
  variant = "default",
  className = "",
  color = "var(--accent-color)",
  speed = "3.5s",
  thickness = 1,
  children,
  style,
  ...rest
}: ButtonProps) => {
  const baseButtonClass =
    "cursor-pointer rounded-2xl font-black transition hover:scale-105 duration-300 px-6 py-3 text-base";
  const primaryButton =
    "bg-gradient-to-b from-black to-secondary text-ultra-light border-secondary";

  if (variant === "starborder") {
    return (
      <button
        className={`${baseButtonClass} relative overflow-hidden`}
        {...rest}
        style={{
          padding: `${thickness}px 0`,
          ...style,
        }}
      >
        <div
          className="absolute w-[300%] h-1/2 opacity-70 bottom-[-2.5] right-[-250%] rounded-full animate-star-movement-bottom z-0"
          style={{
            background: `radial-gradient(circle, ${color}, transparent 10%)`,
            animationDuration: speed,
          }}
        ></div>
        <div
          className="absolute w-[300%] h-1/2 opacity-70 top-[-2.5] left-[-250%] rounded-full animate-star-movement-top z-0"
          style={{
            background: `radial-gradient(circle, ${color}, transparent 10%)`,
            animationDuration: speed,
          }}
        ></div>
        <div
          className={`${baseButtonClass} ${primaryButton} relative z-1 border !scale-100 hover:!scale-100 ${className}`}
        >
          {children}
        </div>
      </button>
    );
  }

  return (
    <button
      className={`${baseButtonClass} ${primaryButton} ${className}`}
      {...rest}
      style={style}
    >
      {children}
    </button>
  );
};

export default Button;