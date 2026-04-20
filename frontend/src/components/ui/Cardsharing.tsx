import { NoteBookIcon } from "../../icons/NoteBookIcon";
import { ShareIcon } from "../../icons/ShareIcon";


interface CardProps {
    title: string,
    link: string,
    type: "x" | "youtube" | "image" | "video" | "article" | "twitter" | "instagram" | "insta" | "wiki";
}
export function Cardsharing({ title, link, type }: CardProps) {

    return (
        <>
            <div className="m-4">
                <div className="bg-[#BCF124] border-[4px] border-black p-4 w-90 h-[380px] flex flex-col 
                    shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] 
                    hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none 
                    transition-all duration-150">

                    {/* Header: Title and Share */}
                    <div className="flex justify-between items-center border-b-[3px] border-black pb-3">
                        <div className="flex gap-2 items-center font-black uppercase tracking-tight text-black">
                            <div className="bg-white border-2 border-black p-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                <NoteBookIcon />
                            </div>
                            <span className="truncate max-w-[140px]">{title}</span>
                        </div>

                        <div className="flex gap-4">
                            <a href={link} target="_blank" className="hover:scale-125 transition-transform">
                                <ShareIcon />
                            </a>
                        </div>
                    </div>

                    {/* Content: Embedded Media */}
                    <div className="pt-4 flex-1 overflow-hidden">
                        {type === "x" && (
                            <div className="h-full overflow-auto border-[3px] border-black bg-white p-2">
                                <blockquote className="twitter-tweet">
                                    <a href={link.replace("x.com", "twitter.com")}></a>
                                </blockquote>
                            </div>
                        )}
                        {type === "youtube" && (
                            <div className="h-full border-[3px] border-black bg-black overflow-hidden">
                                <iframe
                                    className="w-full h-full"
                                    src={link.replace("watch?v=", "embed/")}
                                    allowFullScreen
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </>
    )
}