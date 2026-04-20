import axios from "axios";
import { DeleteIcon } from "../../icons/DeleteIcon";
import { NoteBookIcon } from "../../icons/NoteBookIcon";
import { ShareIcon } from "../../icons/ShareIcon";
import { BackendKey } from "../../config";

interface CardProps {
    _id: string,
    title: string,
    link: string,
    type: "x" | "youtube" | 'image' | 'video' | 'article' | 'youtube' | 'twitter' | 'x' | 'X' | 'Youtube' | 'link'
}
export function Card({ _id, title, link, type }: CardProps) {
    async function deleteItem() {
        try {
            await axios.delete(BackendKey + '/api/v1/content', {
                data: { contentId: _id },
                withCredentials: true
            });
            console.log("Deleted:", _id);
        } catch (e) {
            console.error("Delete failed", e);
        }
    }

    return (
        <>
            <div>
                <div className="bg-[#BCF124] border-[3px] border-black p-4 w-90 h-[380px] flex flex-col 
                    shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] 
                    hover:translate-y-[2px] hover:shadow-none transition-all">

                    {/* Header Section */}
                    <div className="flex justify-between items-center border-b-[3px] border-black pb-3">
                        <div className="flex gap-2 items-center font-black uppercase tracking-tight">
                            <div className="p-1 bg-white border-2 border-black">
                                <NoteBookIcon />
                            </div>
                            <span className="truncate max-w-[150px]">{title}</span>
                        </div>

                        <div className="flex gap-3">
                            <a href={link} target="_blank" className="hover:scale-110 transition-transform">
                                <ShareIcon />
                            </a>
                            <div onClick={deleteItem} className="cursor-pointer font-bold hover:text-red-600 transition-colors">
                                <DeleteIcon />
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="pt-4 flex-1 overflow-hidden">
                        {(link.includes("twitter.com") || link.includes("x.com")) && (
                            <div className="h-full overflow-auto border-2 border-black bg-white p-2">
                                <blockquote className="twitter-tweet">
                                    <a href={link.replace("x.com", "twitter.com")}></a>
                                </blockquote>
                            </div>
                        )}

                        {(link.includes("youtube.com") || link.includes("youtube")) && (
                            <div className="h-full border-2 border-black overflow-hidden bg-black">
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


