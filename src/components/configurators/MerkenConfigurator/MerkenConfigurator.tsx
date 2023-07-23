import React, { useEffect } from 'react'
import { useConfigurator } from '~/hooks/useConfigurator/useConfigurator'

const MerkenConfigurator = () => {
    const [merken, setMerken] = useConfigurator("merken")

    return (
        <div>MerkenConfigurator</div>
    )
}

export default MerkenConfigurator