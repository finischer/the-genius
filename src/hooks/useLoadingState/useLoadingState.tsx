import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

const useLoadingState = () => {
    const [pageIsLoading, setPageIsLoading] = useState(false)
    const router = useRouter()

    const handleRouteChangeStart = () => {
        setPageIsLoading(true)
    }

    const handleRouteChangeComplete = () => {
        setPageIsLoading(false)
    }

    useEffect(() => {
        router.events.on("routeChangeStart", handleRouteChangeStart)
        router.events.on("routeChangeComplete", handleRouteChangeComplete)

        return () => {
            router.events.off("routeChangeStart", handleRouteChangeStart)
            router.events.off("routeChangeComplete", handleRouteChangeComplete)
        }
    }, [])

    return { pageIsLoading }
}

export default useLoadingState