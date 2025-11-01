import Image from "next/image"

const NewsletterSection: React.FC = () => (
    <section className="relative w-full py-24 mt-16 overflow-hidden bg-black/50">
        <div className="absolute inset-0">
            <Image
                src="/images/f_top.png"
                alt="Newsletter Section Background"
                layout="fill"
                objectFit="cover"
                className="opacity-50"
            />

        </div>
        <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1/4 w-72 h-72 opacity-30 z-10 hidden lg:block">
            <Image
                src="/images/pngwing 2.png"
                alt="Decorative dots shape left"
                layout="fill"
                objectFit="contain"
                objectPosition="left"
                className="rotate-180"
            />

        </div>
        <div className="absolute top-1/4 right-0 transform -translate-y-1/4 translate-x-1/4 w-72 h-72 opacity-30 z-10 hidden lg:block">
            <Image
                src="/images/pngwing 2.png"
                alt="Decorative dots shape right"
                layout="fill"
                objectFit="contain"
                objectPosition="right"
            />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
                Subscribe to get the Latest News
            </h2>
            <p className="text-lg text-gray-400 mb-8">
                Don't miss out on our latest news, updates, tips and special offers
            </p>
            <form className="flex justify-center max-w-lg mx-auto rounded-lg overflow-hidden shadow-xl">
                <input
                    type="email"
                    placeholder="Enter your mail"
                    className="w-full px-6 py-4 bg-white text-gray-800 placeholder-gray-500 focus:outline-none"
                />
                <button
                    type="submit"
                    className="px-8 py-4 bg-blue-600 text-white font-semibold hover:bg-blue-500 transition duration-300 flex-shrink-0"
                >
                    Suscribe
                </button>
            </form>
        </div>
    </section>
);

export default NewsletterSection