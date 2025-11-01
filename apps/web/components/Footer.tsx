import Image from "next/image"
import Link from "next/link"
import { Search, MapPin, Phone, Mail, Quote, Target, Award, Coffee, DollarSign, Send, Paperclip, Plus, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer: React.FC = () => (
    <footer className="relative w-full py-16 bg-[#000000] border-t border-white/10 mt-0" id="footer-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="absolute inset-0">
                <Image
                    src="/images/f_i.png"
                    alt="Base Background"
                    layout="fill"
                    objectFit="cover"
                    className="opacity-50"
                />

            </div>

            <div className="col-span-2 md:col-span-2 space-y-4">
                <div className="flex items-center space-x-2">
                    <div className="w-auto h-8 relative">
                        <Image src="/images/Logo.png" alt="Mosmamem.AI Logo" width={150} height={32} objectFit="contain" />
                    </div>
                </div>
                <p className="text-sm text-gray-400 max-w-xs">
                    Mosmamem helps you build a website that fits your goals and reflects your brand — clearly, efficiently, and with a professional touch. Every section is designed with precision to give your business a trusted and confident online presence.
                </p>
                <div className="flex space-x-4 text-gray-500">
                    <Link href="#"><div className="w-5 h-5 bg-gray-600 rounded-full"></div></Link>
                </div>
                <div className="flex space-x-4 text-gray-500 pt-2">
                    <Link href="#" className="hover:text-pink-500 transition">
                        <Facebook className="w-6 h-6" />
                    </Link>
                    <Link href="#" className="hover:text-pink-500 transition">
                        <Twitter className="w-6 h-6" />
                    </Link>
                    <Link href="#" className="hover:text-pink-500 transition">
                        <Instagram className="w-6 h-6" />
                    </Link>
                    <Link href="#" className="hover:text-pink-500 transition">
                        <Linkedin className="w-6 h-6" />
                    </Link>
                </div>
            </div>

            <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white">About</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                    <li><Link href="#" className="hover:text-pink-500 transition">API & Docs</Link></li>
                    <li><Link href="#" className="hover:text-pink-500 transition">Features</Link></li>
                    <li><Link href="#" className="hover:text-pink-500 transition">News & Blogs</Link></li>
                    <li><Link href="#" className="hover:text-pink-500 transition">Help & Supports</Link></li>
                </ul>
            </div>

            <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white">Company</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                    <li><Link href="#" className="hover:text-pink-500 transition">How we work</Link></li>
                    <li><Link href="#" className="hover:text-pink-500 transition">Terms of service</Link></li>
                    <li><Link href="#" className="hover:text-pink-500 transition">Pricing</Link></li>
                    <li><Link href="#" className="hover:text-pink-500 transition">FAQ</Link></li>
                </ul>
            </div>

            <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white">Contact Us</h4>
                <ul className="space-y-3 text-sm text-gray-400">
                    <li className="flex items-start space-x-2">
                        <MapPin className="w-4 h-4 mt-1 text-pink-500 flex-shrink-0" />
                        <span>Akshaya Nagar 1st Block 1st Cross, Rammurthy nagar, Bangalore-560016</span>
                    </li>
                    <li className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-pink-500 flex-shrink-0" />
                        <span>+20 100-111-1111</span>
                    </li>
                    <li className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-pink-500 flex-shrink-0" />
                        <span>Mosmamem@support.ai</span>
                    </li>
                    <li className="flex items-center space-x-2">
                        <span className="text-pink-500 font-semibold">www.Mosamem.ai</span>
                    </li>
                </ul>
            </div>

        </div>

    </footer>
);

export default Footer