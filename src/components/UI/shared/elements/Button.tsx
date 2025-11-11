import clsx from "clsx";
import React from "react";

type ButtonProps = {
  variant?: "default" | "starborder";
  className?: string;
  child?: React.ReactNode;
  child2?: React.ReactNode;
  color?: string;
  speed?: React.CSSProperties["animationDuration"];
  thickness?: number;
  style?: React.CSSProperties;
  primary?: boolean;
  condition?: boolean;
  oneLiner?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({
  variant = "default",
  className = "",
  color = "var(--accent-color)",
  speed = "3.5s",
  thickness = 1,
  child: children,
  child2: children2,
  style,
  primary = true,
  condition = false,
  oneLiner = false,
  ...rest
}: ButtonProps) => {
  const baseButtonClassName =
    `cursor-pointer rounded-2xl font-black transition hover:scale-105 duration-300 px-6 py-3 text-base shadow-md min-w-fit ${oneLiner && "whitespace-nowrap"}`;
  
  const importanceClassName = primary
    ? "bg-gradient-to-b from-ultra-light to-primary text-ultra-dark border-primary"
    : "bg-gradient-to-b from-ultra-dark to-secondary text-ultra-light border-secondary";

  if (variant === "starborder")
    return (
      <button
        className={`${baseButtonClassName} relative overflow-hidden`}
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
          className={`${baseButtonClassName} ${importanceClassName} relative z-1 border !scale-100 hover:!scale-100 ${className}`}
        >
          {children}
        </div>
      </button>
    );

  if (children2) {
    const childrenClassName = (isLeft: boolean) =>
      clsx("flex w-full px-2 py-3 transition-all duration-300 ease-in-out items-center justify-center", {
        "rounded-l-2xl": isLeft,
        "rounded-r-2xl": !isLeft,
        "bg-accent text-ultra-light":
          primary && ((isLeft && condition) || (!isLeft && !condition)),
        "bg-primary text-ultra-dark":
          !primary && ((isLeft && !condition) || (!isLeft && condition)),
      });
  
    return (
      <button
        className={`${baseButtonClassName} ${importanceClassName} ${className} inline-flex justify-around !p-0`}
        {...rest}
        style={style}
      >
        <div className={childrenClassName(true)}>{children}</div>
        <div className={childrenClassName(false)}>{children2}</div>
      </button>
    );
  }

  return (
    <button
      className={`${baseButtonClassName} ${importanceClassName} ${className}`}
      {...rest}
      style={style}
    >
      {children}
    </button>
  );
};

export default Button;