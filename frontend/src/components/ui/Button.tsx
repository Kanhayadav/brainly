import type { ReactElement } from "react";


type Variants = "primary" | "secondary";


interface ButtonProps {
    variant: Variants;
    size: 'sm' | 'md' | 'lg';
    text: string;
    startIcon?: ReactElement;
    onClick?: () => void;
    loading?: boolean;
}

const variantStyles = {
    primary: "bg-primary text-white text-base",
    secondary: "bg-secondary text-primary"
}

const defaultStyles = "rounded cursor-pointer flex p-1 items-center "

const sizeStyles = {
    "sm": "p-2",
    "md": "p-4",
    "lg": "p-6"
}

export function Button({ text, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className="
        border-2 border-black 
        transition-all
        bg-yellow-300 
        px-4 py-2 
        font-bold 
        shadow-[4px_4px_0px_black]
        active:shadow-none 
        active:translate-x-[4px] 
        active:translate-y-[4px]
        hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]
        cursor-pointer
      "
        >
            {text}
        </button>
    );
}
