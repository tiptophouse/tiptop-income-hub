
import React from 'react';

const Footer = () => {
  return (
    <footer className="py-12 px-6 md:px-12 bg-[#2D2D2D] text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
              <span className="font-bold text-2xl text-[#7E69AB]">tiptop</span>
            </div>
            <p className="text-white/70 max-w-xs text-sm">
              Unlock your property's earning potential with Tiptop. The easiest way to monetize your underutilized assets.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-4 text-[#9b87f5]">Learn</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Case Studies</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-[#9b87f5]">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div className="col-span-2 md:col-span-1">
              <h3 className="font-semibold mb-4 text-[#9b87f5]">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-10 pt-6 text-center text-white/60 text-sm">
          &copy; 2025 Tiptop by Kolonia. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
