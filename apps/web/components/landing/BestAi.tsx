import Image from "next/image"

const BestAIModelSection: React.FC = () => (
    <section className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between space-y-12 lg:space-y-0 lg:space-x-12">
            <div className="lg:w-1/2 text-left">
                <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
                    Discover the best AI Model
                </h2>
                <p className="text-lg text-gray-300 mb-8 max-w-lg">
                    In a world driven by innovation, creativity is no longer limited to human imagination. Mosamem stands at the intersection of art and technology — an advanced AI-powered creation platform designed to empower everyone to think, design, and build smarter.
                </p>
                <button className="px-8 py-3 bg-pink-600 text-white font-semibold rounded-full hover:bg-pink-500 transition duration-300 shadow-lg shadow-pink-600/40">
                    Learn More
                </button>
            </div>
            <div className="lg:w-1/2 flex justify-center">
                <div className="relative w-full max-w-lg h-64 md:h-80 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,100,255,0.8)] border border-blue-500/30">

                    <div className="w-auto h-8 relative">
                        <Image src="/images/Mask group.png" alt="2" width={550} height={550} objectFit="contain" />
                    </div>
                </div>
            </div>
            <div className="w-auto h-8 relative">
                <Image src="/images/heighligh.png" alt="2" width={200} height={50} objectFit="contain" />
            </div>
        </div>

    </section>
);

export default BestAIModelSection