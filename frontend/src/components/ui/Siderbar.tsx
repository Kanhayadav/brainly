import { TwitterIcon } from "../../icons/TwitterIcon";
import { YoutubeIcon } from "../../icons/YoutubeIcon";
import { Wiki } from "../../icons/Wiki";
import { Links } from '../../icons/Links'
import { Sidebaritem } from "./Sidebaritem";
import { Input } from './Input'
import { useEffect, useState } from "react";
import axios from "axios";
import { useDebounce } from "../../hooks/useDebouce";
import { BackendKey } from "../../config";

type SidebarProps = {
    setSearchResults: React.Dispatch<React.SetStateAction<any[]>>
    setQuery: React.Dispatch<React.SetStateAction<string>>
}

export function Siderbar({ setSearchResults, setQuery }: SidebarProps) {
    const [text, setText] = useState('')
    const debouce = useDebounce(text, 950)
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!debouce) {
            setSearchResults([])
            setQuery("")
            return
        }
        const fetchData = async () => {
            setLoading(true)
            setError(false)
            try {
                const res = await axios.post(
                    BackendKey + '/api/v1/search',
                    { query: debouce },
                    { withCredentials: true }
                )
                setSearchResults(res.data)
                setQuery(debouce)
            } catch (e) {
                console.error(e)
                setError(true)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [debouce])

    return (
        <div className="h-screen w-92 bg-white fixed left-0 top-0 p-6 
                  border-r-[3px] border-black 
                  shadow-[10px_0px_0px_0px_rgba(0,0,0,1)] z-0 transition-all">

            {/* Logo / Branding */}
            <div className="flex text-4xl font-black uppercase tracking-tighter mb-10">
                Brainly
            </div>

            <div className="space-y-4">
                <Input placeholder="Search"
                    type='text'
                    onChange={(e) => setText(e.target.value)}
                />
                <Sidebaritem text="X" icon={<TwitterIcon />} />
                <Sidebaritem text="Youtube" icon={<YoutubeIcon />} />
                <Sidebaritem text="Links" icon={< Links />} />
                <Sidebaritem text="Wiki" icon={<Wiki />} />
            </div>


            {debouce && loading && !error && (
                <div className="mt-10 p-3 bg-red-500 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-white font-bold" >
                    Searching
                </div>
            )}


        </div >
    );
}