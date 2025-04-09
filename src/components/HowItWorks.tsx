
import React from 'react';
import { motion } from 'framer-motion';
import { Home, Award, DollarSign } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: <Home size={36} className="text-tiptop-accent" />,
      title: "Enter Your Address",
      description: "Tell us where your property is located so we can analyze its potential."
    },
    {
      icon: <Award size={36} className="text-tiptop-accent" />,
      title: "Get Smart Recommendations",
      description: "Our AI analyzes your property for the most profitable asset opportunities."
    },
    {
      icon: <DollarSign size={36} className="text-tiptop-accent" />,
      title: "Start Earning Instantly",
      description: "Connect with pre-vetted partners and start generating passive income."
    }
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 px-6 md:px-12 max-w-7xl mx-auto">
      <motion.h2 
        className="text-3xl md:text-4xl font-bold text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        How It Works
      </motion.h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        {steps.map((step, index) => (
          <motion.div 
            key={index}
            className="bg-white rounded-xl p-8 shadow-md flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            <div className="mb-6 bg-tiptop-light rounded-full p-4">
              {step.icon}
            </div>
            <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
            <p className="text-tiptop-dark/70">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
