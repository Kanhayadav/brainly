import { useState } from 'react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { PlusIcon } from '../icons/PlusIcon'
import { ShareIcon } from '../icons/ShareIcon'
import { ContentModel } from '../components/ui/ContentModel'
import { Siderbar } from '../components/ui/Siderbar'
import { useNavigate } from "react-router-dom";
import { useContent } from '../hooks/useContent'
import axios from 'axios'
import { BackendKey } from '../config'


export function Dashboard() {
    const [searchResults, setSearchResults] = useState<any[]>([])
    const [query, setQuery] = useState("")

    async function shareBrain() {
        try {
            const res = await axios.post(BackendKey + '/api/v1/sharelink', {}, { withCredentials: true });
            const hash = res.data.link
            const shareUrl = `${window.location.origin}/share/${hash}`
            await navigator.clipboard.writeText(shareUrl)
        } catch (e) {
            console.error("share failed ", e);
        }
    }

    const navigate = useNavigate();
    const contents = useContent();

    async function handleLogout() {
        try {
            await axios.post(BackendKey + "/api/v1/logout", {}, { withCredentials: true })
        }
        catch (e) {
            console.error("Logout failed", e);
        }
        finally {
            navigate("/signup");
        }
    }

    const [modelOpen, setModelOpen] = useState(false)
    const isSearching = query.trim().length > 0
    return (<>
        <Siderbar
            setSearchResults={setSearchResults}
            setQuery={setQuery}
        />
        <div className='p-4 ml-90 min-h-screen bg-[#7a4398]'>
            <ContentModel open={modelOpen} onClose={() => { setModelOpen(false) }} />
            <div className='flex gap-4 justify-end items-center'>
                <Button startIcon={<ShareIcon />} variant='secondary' size='md' text='Share Brain' onClick={shareBrain} />
                <Button onClick={() => { setModelOpen(true) }} startIcon={<PlusIcon />} variant='primary' size='md' text='Add Content' />
                <div className='group relative inline-block'>
                    <Button text="WELCOME"></Button>
                    <div className='absolute hidden group-hover:block bg-white shadow-lg font-bold translate-x-[4px] translate-y-[2px]'>
                        <span onClick={handleLogout} className='cursor-pointer block px-4 py-2 hover:bg-gray-100'>Logout</span>
                    </div>
                </div>
            </div>

            <div className='pl-2 m-10 flex flex-row flex-wrap gap-8'>

                {(isSearching ? searchResults : contents).map(({ type, link, title, _id }) =>
                    <Card key={_id} _id={_id} type={type} link={link} title={title} />
                )}
            </div>

        </div>
    </>
    )

}

export default Dashboard
