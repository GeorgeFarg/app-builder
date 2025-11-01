import {Target, Award, Coffee, DollarSign} from "lucide-react"
import FeatureCard from "./FeatureCard"

const FeatureIcons = {
    SupremeAccuracy: Target,
    HighQuality: Award,
    Entertainment: Coffee,
    AffordablePrice: DollarSign,
};

const DifferenceSection: React.FC = () => {
    const features = [
        { title: 'Supreme Accuracy', description: 'Accuracy that provides great branding', Icon: FeatureIcons.SupremeAccuracy },
        { title: 'High Quality', description: 'We provide the highest quality', Icon: FeatureIcons.HighQuality },
        { title: 'Entertainment', description: 'Experience like you have never tasted', Icon: FeatureIcons.Entertainment },
        { title: 'Affordable Price', description: 'Our prices are easy to afford', Icon: FeatureIcons.AffordablePrice },
    ];

    return (
        <section className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 text-center">
                Why are we different?
            </h2>
            <p className="text-lg text-gray-400 mb-16 text-center">
                We don't just make your Website, we make your Business!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                    <FeatureCard key={index} {...feature} />
                ))}
            </div>

            <div className="text-center mt-16">
                <p className="text-lg text-gray-400 mb-6">
                    Great ideas start with great coffee, Lets help you achieve that
                </p>
                <h3 className="text-3xl font-extrabold text-white mb-8">
                    Get started today.
                </h3>
                <button className="px-12 py-3 bg-pink-600 text-white font-semibold rounded-full hover:bg-pink-500 transition duration-300 shadow-lg shadow-pink-600/40">
                    Join Us
                </button>
            </div>
        </section>
    );
};

export default DifferenceSection