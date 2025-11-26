import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="text-white py-8 md:py-12 w-full" style={{ backgroundColor: '#3A2300' }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col items-start justify-center gap-6 md:gap-12">
          <span 
            className="text-2xl md:text-3xl font-bold text-white ml-2 md:ml-4 hover:scale-110 transition-transform duration-300 cursor-pointer"
            style={{ fontFamily: 'Pacifico, cursive' }}
          >PawSafe</span>
          <div className="flex flex-wrap gap-4 md:gap-8 ml-2 md:ml-4" style={{ fontFamily: 'Poppins' }}>
            <span className="text-gray-200 text-sm md:text-base cursor-pointer">@PawSafe 2025</span>
            <Link to="/terms" className="text-gray-200 hover:text-white hover:underline hover:scale-110 transition-all duration-200 text-sm md:text-base cursor-pointer">Terms</Link>
            <Link to="/privacy-policy" className="text-gray-200 hover:text-white hover:underline hover:scale-110 transition-all duration-200 text-sm md:text-base cursor-pointer">Privacy Policy</Link>
            <Link to="/help" className="text-gray-200 hover:text-white hover:underline hover:scale-110 transition-all duration-200 text-sm md:text-base cursor-pointer">Help</Link>
            <Link to="/about" className="text-gray-200 hover:text-white hover:underline hover:scale-110 transition-all duration-200 text-sm md:text-base cursor-pointer">About</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
