import React from 'react'
import Container from './components/ContainerComponent'
import { EditorElement } from '@/providers/editor-provider'
import TextComponent from './components/TextComponent'
import ImageComponent from './components/ImageComponent'
import AudioComponent from './components/AudioComponent'
import VideoComponent from './components/VideoComponent'
import LinkComponent from './components/LinkComponent'
import ButtonComponent from './components/ButtonComponent'
import OLComponent from './components/ol_listcomponent' 
import ULComponent from './components/ul_listcomponent' 
import ContactFormComponent from './components/ContactFormComponent'
import TwoColcomponent from './components/twoColcomponent'
import Three_col from './components/ThreeColComponent'

//import PaymentForm from './components/PaymentFormComponent'


type Props = {
    element: EditorElement
}

const Recursive = ({ element }: Props) => {
    switch (element.type) {
        case 'text':
            return <TextComponent element={element} />
        case 'image':
            return <ImageComponent element={element} />
        case 'video':
            return <VideoComponent element={element} />
        case 'link':
            return <LinkComponent element={element} />
        case 'container':
        case '__body':
            return <Container element={element} />
       case 'audio':
        return <AudioComponent element={element} />
        case 'ol':
        return <OLComponent element={element} />
    case 'ul':  
        return <ULComponent element={element} />
    case 'button':  
        return <ButtonComponent element={element} />
       case 'contactForm':      
    return <ContactFormComponent element={element} />
       case 'TwoColcomponent':      
    return <TwoColcomponent element={element} />
       case 'ThreeColComponent':      
    return <Three_col element={element} />
        default:
            return <TextComponent element={element} />
    }
}

export default Recursive