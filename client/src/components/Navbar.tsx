import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="shadow-sm relative z-10" style={{ backgroundColor: '#FFFDFA' }}>
      <div className="max-w-7xl mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center pr-2 md:pr-4 hover:scale-110 transition-transform duration-300">
          <span 
            className="text-xl md:text-3xl font-bold text-black"
            style={{ fontFamily: 'Pacifico' }}
          >PawSafe</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-24 items-center flex-1 justify-center" style={{ fontFamily: 'Poppins, Anuphan' }}>
          <a href="#home" className="text-gray-700 hover:text-black hover:font-bold hover:scale-110 transition-all duration-200 cursor-pointer">ตามหาบ้าน</a>
          <a href="#adoption" className="text-gray-700 hover:text-black hover:font-bold hover:scale-110 transition-all duration-200 cursor-pointer">ตามหาสัตว์หาย</a>
          <a href="#info" className="text-gray-700 hover:text-black hover:font-bold hover:scale-110 transition-all duration-200 cursor-pointer">เกี่ยวกับเรา</a>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden flex flex-col gap-1 mr-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className={`w-6 h-0.5 bg-white transition-transform ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-white transition-opacity ${isOpen ? 'opacity-0' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-white transition-transform ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>

        {/* Auth Buttons */}
        <div className="hidden sm:flex gap-2 md:gap-6 items-center pr-2 md:pr-4">
          <Link 
            to="/login" 
            className="px-3 md:px-6 py-2 border border-gray-700 rounded-md text-black bg-white hover:bg-black hover:text-white hover:border-black hover:scale-105 active:scale-95 transition-all duration-200 text-sm md:text-base"
          >Login</Link>
          <Link 
            to="/signup" 
            className="px-3 md:px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 hover:scale-105 active:scale-95 transition-all duration-200 text-sm md:text-base"
          >Sign up</Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-200 animate-in fade-in slide-in-from-top-2 duration-300" style={{ fontFamily: 'Poppins, Anuphan' }}>
          <a href="#home" className="block px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-black hover:translate-x-2 transition-all duration-200">ตามหาบ้าน</a>
          <a href="#adoption" className="block px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-black hover:translate-x-2 transition-all duration-200">ตามหาสัตว์หาย</a>
          <a href="#info" className="block px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-black hover:translate-x-2 transition-all duration-200">เกี่ยวกับเรา</a>
          <div className="flex gap-2 px-4 py-3 border-t border-gray-200">
            <Link 
              to="/login" 
              className="flex-1 px-3 py-2 border border-gray-700 rounded-md text-black bg-white hover:bg-black hover:text-white hover:scale-105 active:scale-95 text-sm transition-all duration-200 text-center"
            >Login</Link>
            <Link 
              to="/signup" 
              className="flex-1 px-3 py-2 bg-black text-white rounded-md hover:bg-gray-800 hover:scale-105 active:scale-95 text-sm transition-all duration-200 text-center"
            >Sign up</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
