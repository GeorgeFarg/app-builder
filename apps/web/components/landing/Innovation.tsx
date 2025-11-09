import PricingCard from "./Pricing"

const InnovationSection: React.FC = () => {

    const pricingPlans = [

        { title: 'E-Commerce', credits: '50', accuracy: '99.9%', price: '$50', imageSrc: '/images/Rectangle 7.png' },
        { title: 'Dashboard', credits: '80', accuracy: '99.9%', price: '$70', imageSrc: '/images/Rectangle 9.png' },
        { title: 'LMS', credits: '120', accuracy: '99.9%', price: '$160', imageSrc: '/images/Rectangle 11.png' },
        { title: 'HIS', credits: '100', accuracy: '99.9%', price: '$150', imageSrc: '/images/Rectangle 13.png' },
    ];

    return (
        <section className="relative max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 text-center">
                Discover a new world of Innovation
            </h2>
            <p className="text-lg text-gray-400 mb-16 text-center">
                Explore all of our features to improve your experience to the top
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {pricingPlans.map((plan, index) => (
                    <PricingCard key={index} {...plan} />
                ))}
            </div>

        </section>
    );
};

export default InnovationSection