interface FeatureCardProps {
    title: string;
    description: string;
    Icon: React.ElementType;

}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, Icon }) => {
    return (

        <div className="flex flex-col items-center p-6 rounded-xl bg-white border border-gray-100 shadow-lg transition duration-300 hover:shadow-xl w-full max-w-sm">


            <div className="mb-4">
                <Icon size={40} color="black" strokeWidth={1.5} />
            </div>


            <h3 className="text-xl font-bold text-blue-700 mb-2 mt-1 text-center">
                {title}
            </h3>


            <p className="text-sm text-gray-700 text-center">
                {description}
            </p>
        </div>
    );
};

export default FeatureCard