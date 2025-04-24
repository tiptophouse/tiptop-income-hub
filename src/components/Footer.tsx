import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="py-12 px-6 md:px-12 bg-[#FFFDED] text-[#552B1B]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center md:text-left"
          >
            <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
              <span className="font-bold text-lg">Tiptop</span>
            </div>
            <p className="text-[#552B1B]/70 max-w-xs text-sm">
              Unlock your property's earning potential with Tiptop. The easiest way to monetize your underutilized assets.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-3 gap-8"
          >
            <div>
              <h3 className="font-semibold mb-4 text-tiptop-accent">Learn</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-[#552B1B]/70 hover:text-[#552B1B] transition-colors">How It Works</a></li>
                <li><a href="#" className="text-[#552B1B]/70 hover:text-[#552B1B] transition-colors">Case Studies</a></li>
                <li><a href="#" className="text-[#552B1B]/70 hover:text-[#552B1B] transition-colors">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-tiptop-accent">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-[#552B1B]/70 hover:text-[#552B1B] transition-colors">About</a></li>
                <li><a href="#" className="text-[#552B1B]/70 hover:text-[#552B1B] transition-colors">Careers</a></li>
                <li><a href="#" className="text-[#552B1B]/70 hover:text-[#552B1B] transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div className="col-span-2 md:col-span-1">
              <h3 className="font-semibold mb-4 text-tiptop-accent">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-[#552B1B]/70 hover:text-[#552B1B] transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-[#552B1B]/70 hover:text-[#552B1B] transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-[#552B1B]/70 hover:text-[#552B1B] transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="border-t border-[#552B1B]/10 mt-10 pt-6 text-center text-[#552B1B]/60 text-sm"
          >
            &copy; 2025 Tiptop by Kolonia. All rights reserved.
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
