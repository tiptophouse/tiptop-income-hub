
import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, CheckSquare, DollarSign, ArrowRight } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: <MapPin size={24} className="text-[#AA94E2]" />,
      number: "1",
      title: "List Your Property",
      description: "Enter your address so we can analyze its earning potential."
    },
    {
      icon: <CheckSquare size={24} className="text-[#AA94E2]" />,
      number: "2",
      title: "Get Recommendations",
      description: "Our AI analyzes your property for the most profitable opportunities."
    },
    {
      icon: <DollarSign size={24} className="text-[#AA94E2]" />,
      number: "3",
      title: "Start Earning",
      description: "Connect with partners and start generating passive income."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section id="how-it-works" className="py-16 md:py-24 px-4 md:px-8 lg:px-12 max-w-7xl mx-auto bg-[#F8F3EA]">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div 
          className="flex items-center justify-center gap-2 mb-8"
          variants={itemVariants}
        >
          <div className="h-1.5 w-12 rounded-full bg-[#AA94E2]/30"></div>
          <h2 className="text-2xl md:text-3xl font-bold">How It Works</h2>
          <div className="h-1.5 w-12 rounded-full bg-[#AA94E2]/30"></div>
        </motion.div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 lg:gap-6">
          {steps.map((step, index) => (
            <motion.div 
              key={index}
              className="step-item flex flex-col items-center text-center w-full md:w-1/3"
              variants={itemVariants}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div className="step-number flex items-center justify-center rounded-full w-14 h-14 bg-white shadow-sm border border-[#E6DFD1] mb-4">
                <span className="font-bold text-xl text-[#3D3935]">{step.number}</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-[#3D3935]/70 max-w-xs">{step.description}</p>
              
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute right-[-20px] top-7">
                  <ArrowRight className="text-[#AA94E2]/50" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="mt-12 md:mt-16 flex justify-center"
          variants={itemVariants}
        >
          <div className="bg-[#AA94E2]/10 rounded-xl p-6 max-w-2xl text-center">
            <p className="text-[#3D3935] font-medium">
              "Unlock up to <span className="text-[#AA94E2] font-bold">$2,400 per year</span> in passive income from your property with our Smart Asset technology."
            </p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HowItWorks;
