"use client"
import { Send } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {useState} from "react"

const HeroSection: React.FC = () => {
    const [prompt, setPrompt] = useState<string>('');
    const handleSend = () => { if (prompt.trim()) { console.log('Prompt Sent:', prompt); } };

    const cursiveTextStyle: React.CSSProperties = {
        fontFamily: 'Cursive',
        fontSize: '8rem',
        lineHeight: '1',
    };

    return (
        //navbar
        <div className="relative w-full h-screen flex flex-col items-center justify-start pt-32 text-white overflow-hidden"
            style={{ background: 'linear-gradient(180deg, #1A0A33 0%, #0D051A 100%)' }}>
            <div className="absolute top-0 right-0 w-1/4 h-1/4 opacity-50">
            </div>
            <div className="absolute inset-0">
                <Image
                    src="/images/image 1.png"
                    alt="Base Background"
                    layout="fill"
                    objectFit="cover"
                    className="opacity-50"
                />
            </div>


            <nav className="absolute top-0 left-0 right-0 max-w-7xl mx-auto flex justify-between items-center py-4 px-8 z-20">
                <div className="flex items-center space-x-2">
                    <div className="w-auto h-8 relative">
                        <Image src="/images/Logo.png" alt="Mosmamem.AI Logo" width={150} height={32} objectFit="contain" />
                    </div>
                </div>
                <div className="hidden md:flex space-x-8 font-medium">
                    <Link href="#" className="hover:text-pink-500 transition">Home</Link>
                    <Link href="#prices_section" className="hover:text-pink-500 transition">Prices</Link>
                    <Link href="#footer-section" className="hover:text-pink-500 transition">About Us</Link>
                    <Link href="#footer-section" className="hover:text-pink-500 transition">Contact Us</Link>
                    <Link href="#" className="hover:text-pink-500 transition">Sign In</Link>
                </div>
                <button className="px-5 py-2 bg-pink-600 text-white font-semibold rounded-full hover:bg-pink-500 transition">Signup</button>
            </nav>



            <div className="relative z-10 text-center mt-24 max-w-7xl w-full">

                <div className="flex items-center justify-center space-x-6 mb-16">

                </div>
                <div className="flex justify-center mt-[-130px] mb-4">
                    <div className="w-auto h-8 relative">
                        <Image
                            src="/images/mosmam.png"
                            alt="Mosmam Logo"
                            width={700}
                            height={150}
                            objectFit="contain"
                        />
                    </div>
                </div>

            </div>
            <div className="max-w-4xl w-full mx-auto p-4 md:p-6 bg-gray-900/90 rounded-2xl shadow-2xl backdrop-blur-md border border-white/10 mt-32">


                <div className="w-full flex items-end space-x-4">

                    <button className="text-gray-400 hover:text-white transition p-2 flex-shrink-0">

                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    </button>

                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Ask Mosamem to create website for ......."
                        rows={2}


                        className="text-white text-left flex-grow bg-transparent resize-none focus:outline-none placeholder-gray-500 text-lg py-1 leading-relaxed"
                        style={{ minHeight: '60px' }}
                    />


                    <button
                        onClick={handleSend}

                        className={`p-3 rounded-full transition duration-300 flex-shrink-0 ${prompt.trim()
                            ? 'bg-pink-600 text-white hover:bg-pink-500'
                            : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                            }`}
                        disabled={!prompt.trim()}
                    >
                        <Send className="w-6 h-6 -rotate-45" />
                    </button>
                </div>
            </div>
        </div>
    );
};


export default HeroSection