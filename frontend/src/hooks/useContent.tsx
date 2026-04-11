import axios from "axios";
import { useEffect, useState } from "react";
import { BackendKey } from "../config";

export function useContent() {
    const [contents, setContents] = useState([])
    function rerunning() {
        try {
            axios.get(BackendKey + '/api/v1/content', { withCredentials: true }).then((res) => {
                setContents(res.data.content)
            })
        } catch (e) {
            return console.log("some erorr")
        }
    }
    useEffect(() => {
        rerunning()
        let interval = setInterval(() => {
            rerunning()
        }, (10 * 100))
        return () => {
            clearInterval(interval)
        }
    }, [])
    return contents
}