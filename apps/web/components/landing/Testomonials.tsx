
import Image from "next/image"

const TestimonialsSection: React.FC = () => (
    <section className="relative max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8 text-center bg-gray-900/10">
        <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1/4 w-72 h-72 opacity-30 z-10 hidden lg:block">
            <Image
                src="/images/AI-plast.png"
                alt="Decorative dots shape left"
                layout="fill"
                objectFit="contain"
                objectPosition="left"
                className="rotate-180"
            />

        </div>
        <div className="absolute top-1/4 right-0 transform -translate-y-1/4 translate-x-1/4 w-72 h-72 opacity-30 z-10 hidden lg:block">
            <Image
                src="/images/AI-plastri.png"
                alt="Decorative dots shape right"
                layout="fill"
                objectFit="contain"
                objectPosition="right"
            />
        </div>

        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-2">
            Our coffee perfection feedback
        </h2>
        <p className="text-lg text-gray-400 mb-16">
            Our customers has amazing things he say about us
        </p>
        <div className="relative max-w-4xl mx-auto p-8 md:p-12 bg-white rounded-3xl shadow-2xl overflow-visible z-10">



            <p className="text-lg italic text-gray-700 mb-8 leading-relaxed text-left pt-6">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset....
            </p>

            <p className="text-xl font-bold text-blue-500 mb-1">Jonny Thomas</p>
            <p className="text-sm text-gray-500 mb-4">Project Manager</p>

            <div className="absolute left-1/2 -bottom-8 transform -translate-x-1/2 w-16 h-16 **rounded-full** bg-gray-300 overflow-hidden border-4 border-white shadow-lg">
                <Image src="/images/man.png" alt="Jonny Thomas Profile" layout="fill" objectFit="cover" />
            </div>

            <button className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 p-3 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition shadow-lg">&larr;</button>
            <button className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 p-3 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition shadow-lg">&rarr;</button>
        </div>
    </section>
);

export default TestimonialsSection