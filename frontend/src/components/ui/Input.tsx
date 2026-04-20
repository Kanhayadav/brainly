import { forwardRef } from "react";

interface InputProps {
    placeholder: string,
    type: string,
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ placeholder, type, onChange }, ref) => {
        return (
            <div>
                <input
                    placeholder={placeholder}
                    type={type}
                    ref={ref}
                    onChange={onChange}
                    className="px-4 py-3 m-2 font-bold text-black placeholder-black/60
               bg-white border-[3px] border-black rounded-none
               shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]
               focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] 
               focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
               transition-all
               w-75"
                />
            </div >
        )
    })
