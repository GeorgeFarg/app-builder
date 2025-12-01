'use client'
import { EditorElement, useEditor } from '@/providers/editor-provider'
import React, { useState } from 'react'

interface Props {
    element: EditorElement
}

//management
const ContactFormComponent: React.FC<Props> = ({ element }) => {
    const { state } = useEditor()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    })

    // Get form data from element content
    React.useEffect(() => {
        const content = element.content
        if (content && typeof content === 'object') {
            setFormData({
                name: (content as any).name || '',
                email: (content as any).email || '',
                message: (content as any).message || ''
            })
        }
    }, [element.content])
///Input processing
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Handle form submission
        console.log('Form submitted:', formData)
    }

    return (
        <div style={element.styles}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                </div>
                <div>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Your email"
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                </div>
                <div>
                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Your message"
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                </div>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Send Message
                </button>
            </form>
        </div>
    )
}

export default ContactFormComponent