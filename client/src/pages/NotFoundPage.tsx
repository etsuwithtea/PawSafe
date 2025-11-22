import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="text-center space-y-6">
        <div className="text-8xl md:text-9xl font-bold text-gray-800">
          404 Not Found
        </div>

        <p className="text-xl md:text-2xl text-gray-700" style={{ fontFamily: 'Poppins, Anuphan' }}>
          เหมือนว่าคุณอยู่ที่ผิดที่นะ
        </p>

        <div className="pt-6">
          <Link
            to="/"
            className="inline-block text-gray-800 font-bold py-3 px-8 rounded transition duration-300 hover:shadow-lg" style={{ backgroundColor: '#FFA600', fontFamily: 'Poppins, Anuphan' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#000000';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FFA600';
              e.currentTarget.style.color = '#1f2937';
            }}
          >
            กลับหน้าหลัก
          </Link>
        </div>
      </div>
    </div>
  );
}
