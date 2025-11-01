import Image from "next/image"

interface PricingCardProps {
    title: string;
    credits: string;
    price: string;
    accuracy: string;
    imageSrc: string;
}

const PricingCard: React.FC<PricingCardProps> = ({ title, credits, price, accuracy, imageSrc }) => {
    return (
        <div className={`relative flex flex-col items-center p-4 rounded-3xl bg-gray-900/60 border border-white/10 shadow-2xl transition duration-500 hover:scale-[1.03]`} id='prices_section'>
            <div className="w-full h-32 mb-4 relative rounded-xl overflow-hidden border border-white/20">
                <Image src={imageSrc} alt={title} layout="fill" objectFit="contain" className="opacity-80" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3 mt-1 text-center">{title}</h3>
            <p className="text-xs text-gray-300 font-medium mb-4">
                Credits <span className="text-pink-400">{credits}</span> | Accuracy <span className="text-pink-400">{accuracy}</span>
            </p>
            <div className="flex flex-col items-center w-full mt-auto pt-4" >
                <div className="text-lg font-extrabold text-white mb-3">
                    <span className="text-white text-3xl font-extrabold">{price}</span>
                </div>
                <button className="w-full px-4 py-2 bg-pink-600 text-white font-semibold rounded-full hover:bg-pink-500 transition duration-300 text-sm">
                    Start Crating
                </button>
            </div>
        </div>

    );
};

export default PricingCard