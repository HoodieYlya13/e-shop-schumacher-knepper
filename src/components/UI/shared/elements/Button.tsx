import clsx from "clsx";
import Link from "next/link";
import React from "react";

type ButtonProps = {
  variant?: "default" | "starborder" | "link";
  className?: string;
  child?: React.ReactNode;
  child2?: React.ReactNode;
  onClick2?: React.MouseEventHandler<HTMLButtonElement>;
  link?: string;
  linkTarget?: string;
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
  thickness = 2,
  child,
  child2,
  onClick2,
  link,
  linkTarget = "_blank",
  style,
  primary = true,
  condition = false,
  oneLiner = false,
  disabled = false,
  ...rest
}: ButtonProps) => {
  if (link || variant === "link") {
    const linkClassName = clsx(
      "underline outline-none transition duration-300 px-0 py-0 min-w-fit",
      { "cursor-not-allowed opacity-50": disabled },
      className
    );

    if (!link)
      return (
        <button
          className={linkClassName}
          disabled={disabled}
          {...rest}
          style={style}
        >
          {child}
        </button>
      );

    return (
      <Link
        href={link}
        target={linkTarget}
        rel={linkTarget === "_blank" ? "noopener noreferrer" : undefined}
        className={linkClassName}
        style={style}
      >
        {child}
      </Link>
    );
  }

  const baseButtonClassName = `${disabled ? "cursor-not-allowed" : "cursor-pointer"} rounded-2xl font-black transition duration-300 px-6 py-3 text-base outline min-w-fit ${primary || child2 || variant === "starborder" ? "shadow-2xl" : "shadow-lg"} ${!disabled && "hover:scale-105"} ${oneLiner && "whitespace-nowrap"}`;

  const importanceClassName = disabled
    ? "bg-light text-dark outline-secondary/50 opacity-50 inset-shadow-sm inset-shadow-dark"
    : primary
      ? "bg-gradient-to-b from-ultra-light to-primary text-ultra-dark outline-secondary/50"
      : `bg-gradient-to-b from-ultra-dark to-secondary text-ultra-light outline-accent ${!child2 && "shadow-accent/30"}`;

  if (variant === "starborder")
    return (
      <button
        className={`${baseButtonClassName} shadow-ultra-dark relative overflow-hidden outline-hidden`}
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
          className={`${baseButtonClassName} ${importanceClassName} border-secondary outline-hidden relative z-1 border !scale-100 hover:!scale-100 ${className}`}
        >
          {child}
        </div>
      </button>
    );

  if (child2) {
    const childClassName = (isLeft: boolean) =>
      clsx(
        "flex w-full px-2 py-3 transition-all duration-300 ease-in-out items-center justify-center",
        {
          "rounded-l-2xl border-r border-dark": isLeft,
          "rounded-r-2xl": !isLeft,
          "inset-shadow-sm inset-shadow-dark": (isLeft && !condition) || (!isLeft && condition),
          "bg-accent text-ultra-light":
            primary && ((isLeft && condition) || (!isLeft && !condition)),
          "bg-primary text-ultra-dark":
            !primary && ((isLeft && !condition) || (!isLeft && condition)),
        }
      );
  
    return (
      <div
        className={`${baseButtonClassName} ${importanceClassName} ${className} outline-secondary/50 inline-flex justify-around !p-0`}
        style={style}
      >
        <button {...rest} className={childClassName(true)}>
          {child}
        </button>
        <button {...rest} onClick={onClick2} className={childClassName(false)}>
          {child2}
        </button>
      </div>
    );
  }

  return (
    <button
      className={`${baseButtonClassName} ${importanceClassName} ${className}`}
      {...rest}
      style={style}
    >
      {child}
    </button>
  );
};

export default Button;