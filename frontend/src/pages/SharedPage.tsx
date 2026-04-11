import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { BackendKey } from "../config";
import { Cardsharing } from "../components/ui/Cardsharing";

interface Content {
    title: string;
    link: string;
    type: "x" | "youtube" | "image" | "video" | "article" | "twitter" | "instagram" | "insta";
}

export function SharedPage() {
    const { hash } = useParams();
    const [data, setData] = useState<Content[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await axios.get(
                    BackendKey + `/api/v1/sharelink/${hash}`
                );

                setData(res.data.data);
            } catch (e) {
                setError("Failed to load shared content");
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [hash]);

    if (loading) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-[#7a4398]">
                <div className="bg-[#BCF124] border-4 border-black p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] text-2xl font-black uppercase italic">
                    Loading shared brain...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-screen flex items-center justify-center bg-red-500">
                <div className="bg-white border-4 border-black p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] text-xl font-black">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#7a4398] p-8">

            {/* Header Section */}
            <div className="max-w-7xl mx-auto mb-12 bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                <h1 className="text-5xl font-black uppercase tracking-tighter mb-2">
                    Shared Brain
                </h1>
                <p className="text-xl font-bold bg-[#BCF124] inline-block px-2 border-2 border-black">
                    Explore curated content shared by a user
                </p>
            </div>

            {/* Content Grid */}
            <div className="max-w-7xl mx-auto flex flex-wrap gap-5 justify-center md:justify-start">
                {data.length === 0 ? (
                    <div className="bg-white border-4 border-black p-6 font-bold shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                        No content shared yet.
                    </div>
                ) : (
                    data.map((item) => (
                        <Cardsharing
                            title={item.title}
                            link={item.link}
                            type={item.type}
                        />
                    ))
                )}
            </div>
        </div>

    );
}