import { TwitterIcon } from "../../icons/TwitterIcon";
import { YoutubeIcon } from "../../icons/YoutubeIcon";
import { Sidebaritem } from "./Sidebaritem";
export function Siderbar() {
    return (
        <div className="h-screen w-92 bg-white fixed left-0 top-0 p-6 
                  border-r-[3px] border-black 
                  shadow-[10px_0px_0px_0px_rgba(0,0,0,1)] z-50 hover:border-r-[0px] transition-all">

            {/* Logo / Branding */}
            <div className="flex text-4xl font-black uppercase tracking-tighter mb-10">
                Brainly
            </div>

            <div className="space-y-4">
                <Sidebaritem text="X" icon={<TwitterIcon />} />
                <Sidebaritem text="Youtube" icon={<YoutubeIcon />} />
            </div>
        </div>
    );
}