import React from 'react'
import Container from './components/ContainerComponent'
import { EditorElement } from '@/providers/editor-provider'
import TextComponent from './components/TextComponent'

type Props = {
    element: EditorElement
}

const Recursive = ({ element }: Props) => {
    switch (element.type) {
        case 'text':
            return <TextComponent element={element} />
        case 'container':
            return <Container element={element} />

        default:
            return null
    }
}

export default Recursive