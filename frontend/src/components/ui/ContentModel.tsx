import { CrossIcon } from "../../icons/CrossIcon";
import { Button } from '../../components/ui/Button'
import { Input } from "./Input";
import axios from "axios";
import { BackendKey } from "../../config";
import { useRef } from 'react'

interface ContentModelProps {
    open: boolean;
    onClose: () => void;
}


export function ContentModel({ open, onClose }: ContentModelProps) {
    const titleRef = useRef<HTMLInputElement>(null);
    const typeRef = useRef<HTMLInputElement>(null);
    const linkRef = useRef<HTMLInputElement>(null);

    async function addContent() {
        try {
            const title = titleRef.current?.value
            const type = typeRef.current?.value
            const link = linkRef.current?.value

            await axios.post(BackendKey + "/api/v1/content", {
                title, type, link
            },
                { withCredentials: true }
            );
            onClose()
        } catch (e) {
            console.error("Failed to add content", e);
        }
    }
    return <div>
        {open &&
            <div className="w-screen h-screen fixed top-0 left-0 flex justify-center items-center">
                <div className="absolute w-full h-full bg-black opacity-50"></div>
                <div className="relative bg-yellow-300 p-7 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex flex-col justify-center">
                        <span className="bg-[#7a4398] p-4 opacity-100">
                            <div className="flex justify-end cursor-pointer">
                                <div onClick={onClose} className="pb-5">
                                    <CrossIcon />
                                </div>
                            </div>
                            <div>
                                <Input ref={titleRef} placeholder={"Title"} />
                                <Input ref={typeRef} placeholder={"Type:'link, youtube, x, twitter'"} />
                                <Input ref={linkRef} placeholder={"Link"} />
                            </div>
                            <div className="flex justify-center pt-8">
                                <Button onClick={addContent} variant='primary' text='Submit' size="sm" />
                            </div>
                        </span>
                    </div>
                </div>
            </div >
        }
    </div >
}