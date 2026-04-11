import type { ReactElement } from "react"

export function Sidebaritem({ text, icon }: {
    text: string,
    icon: ReactElement
}) {
    return <div className="flex items-center m-2 transition-all cursor-pointer
                bg-yellow-300 border-[3px] border-black rounded-none
                shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]">
        <div className="p-4 border-r-[3px] border-black flex items-center justify-center">
            {icon}
        </div>
        <div className="p-4 font-black uppercase tracking-tight text-black">
            {text}
        </div>
    </div>
} 