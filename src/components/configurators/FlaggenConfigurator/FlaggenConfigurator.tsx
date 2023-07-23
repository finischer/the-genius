import React from 'react'
import useConfigurator from '~/hooks/useConfigurator/useConfigurator'

const FlaggenConfigurator = () => {
    const [flaggen, setFlaggen] = useConfigurator("flaggen")

    return (
        <div>FlaggenConfigurator</div>
    )
}

export default FlaggenConfigurator