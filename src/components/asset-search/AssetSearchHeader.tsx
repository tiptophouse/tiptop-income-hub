
import React from 'react';
import { motion } from 'framer-motion';

const AssetSearchHeader: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="mb-8 text-center"
  >
    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 text-tiptop-accent font-poppins tracking-tight leading-tight">
      Monetize Your Home Assets
    </h1>
    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
      Turn your property's untapped resources into monthly income
    </p>
  </motion.div>
);

export default AssetSearchHeader;
