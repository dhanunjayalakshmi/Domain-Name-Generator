import { Check, Globe, Search } from "lucide-react";

const Hero = () => {
  return (
    <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-purple-500 text-white py-16">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Generate the Perfect Domain Name
        </h1>
        <p className="text-xl mb-8 text-white/90">
          Find unique and available domain names for your next project in
          seconds
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {[
            {
              icon: Search,
              text: "Smart name suggestions based on your keywords",
            },
            { icon: Globe, text: "Instant domain availability check" },
            { icon: Check, text: "Industry-specific recommendations" },
          ].map((feature, index) => (
            <div key={index} className="flex flex-col items-center">
              <feature.icon className="w-8 h-8 mb-3 text-white" />
              <p className="text-sm font-medium text-white/90">
                {feature.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
