import React from 'react'
import useConfigurator from '~/hooks/useConfigurator/useConfigurator'

const MemoryConfigurator = () => {
    const [memory, setMemory] = useConfigurator("memory")

    return (
        <div>MemoryConfigurator</div>
    )
}

export default MemoryConfigurator