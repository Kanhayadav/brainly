import type { ReactElement } from "react";

type Variants = "primary" | "secondary";
type Sizes = "sm" | "md" | "lg";

interface ButtonProps {
    variant?: Variants;
    size?: Sizes;
    text: string;
    startIcon?: ReactElement;
    onClick?: () => void;
    loading?: boolean;
}

const variantStyles = {
    primary: "bg-yellow-300 text-black",
    secondary: "bg-white text-black"
};

const sizeStyles = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
};

export function Button({
    text,
    onClick,
    variant = "primary",
    size = "md",
    startIcon,
    loading
}: ButtonProps) {

    return (
        <button
            onClick={onClick}
            disabled={loading}
            className={`
                border-2 border-black
                transition-all
                font-bold
                flex items-center gap-2
                cursor-pointer
                shadow-[4px_4px_0px_black]
                active:shadow-none
                active:translate-x-[4px]
                active:translate-y-[4px]
                hover:shadow-none
                hover:translate-x-[2px]
                hover:translate-y-[2px]
                ${variantStyles[variant]}
                ${sizeStyles[size]}
            `}
        >
            {startIcon}

            {loading ? "Loading..." : text}
        </button>
    );
}