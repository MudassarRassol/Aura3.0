import { features } from "./Homedata";

const Features = () => {
  return (
    <section className="relative px-4 overflow-hidden">
      <div className="flex flex-col gap-5 items-center justify-center py-20">
        <h2 className="text-2xl md:text-5xl font-semibold text-primary">
          How Aura Helps You
        </h2>
        <p className="text-xl font-semibold text-center ">
          Experience a new kind of emotional support, powered by empathetic AI
        </p>
      </div>

      <div className="w-full mb-10 md:max-w-6xl gap-4 mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
        {features.map((feature, i) => (
          <div
            key={i}
            className="p-6 rounded-2xl shadow-sm border border-primary/10  hover:shadow-md transition"
          >
            <div className="flex items-center gap-3">
              <feature.icon className="w-6 h-6 text-primary " />
              <h3 className="font-semibold text-lg">{feature.title}</h3>
            </div>
            <p className="text-sm text-gray-600 mt-4">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
