import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay: number) {
    const [debouce, setDebouce] = useState(value)
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouce(value)
        }, delay)
        return () => {
            clearTimeout(handler)
        }
    }, [value, delay])
    return debouce
}