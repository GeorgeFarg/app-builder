import Image from "next/image"

const AmazingExperienceCTA: React.FC = () => (
    <section className="relative w-full py-32 mt-24 overflow-hidden">
        <div className="absolute inset-0">
            <Image
                src="/images/Group 36.png"
                alt="Amazing Experience Background"
                layout="fill"
                objectFit="cover"
                className="opacity-70"
                quality={100}
            />
        </div>
        <div className="absolute bottom-0 right-0 transform translate-y-1/4 translate-x-4 w-72 h-72 opacity-30 z-10 hidden lg:block">
            <Image
                src="/images/AI-splash.png"
                alt="Decorative dots shape right"
                layout="fill"
                objectFit="contain"
                objectPosition="right"
            />
        </div>
        <div className="absolute **bottom-0** right-0 transform **translate-y-4** -translate-x-8 w-72 h-72 opacity-30 z-10 hidden lg:block">
            <Image
                src="/images/AI-dots.png"
                alt="Decorative dots shape right"
                layout="fill"
                objectFit="contain"
                objectPosition="right"
            />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left z-10">
            <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-4">
                Get a chance to have an <br />
                <span className="text-white">Amazing experience</span>
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-lg">
                We are giving you one time opportunity to experience a better life with Mosmamem.
            </p>
            <button className="px-8 py-3 bg-pink-600 text-white font-semibold rounded-full hover:bg-pink-500 transition duration-300 shadow-lg shadow-pink-600/40">
                Order Now
            </button>
        </div>
    </section>
);

export default AmazingExperienceCTA