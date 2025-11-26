import { Heart, Users } from 'lucide-react';

/**
 * หน้า About
 * แสดงข้อมูลเกี่ยวกับโปรเจกต์ PawSafe เทคโนโลยีที่ใช้ ฟีเจอร์ และทีมงาน
 */
export default function AboutPage() {
  return (
    <div style={{ backgroundColor: '#FFFDFA' }} className="min-h-screen">
      <section style={{ backgroundColor: '#FFFDFA' }} className="py-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          {/* หัวข้อหลัก */}
          <div className="text-center mb-16">
            <h1 
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ fontFamily: 'Anuphan', color: '#FFA600' }}
            >เกี่ยวกับ PawSafe</h1>
            <p 
              className="text-gray-600 text-base md:text-lg max-w-3xl mx-auto leading-relaxed"
              style={{ fontFamily: 'Poppins, Anuphan' }}
            >
              PawSafe เป็นเว็บแอปพลิเคชันที่ช่วยในการค้นหาสัตว์เลี้ยงที่หายไป 
              นำเสนอขายสัตว์เลี้ยง และเชื่อมโยงประชาชนที่สนใจการรับเลี้ยงสัตว์เลี้ยง 
              โดยมุ่งเน้นการสร้างชุมชนที่ห่วงใจและดูแลสัตว์เลี้ยงทั้งหลาย
            </p>
          </div>
        </div>
      </section>

      {/* ส่วนทีมงาน */}
      <section style={{ backgroundColor: '#FFFDFA' }} className="py-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 
              className="text-3xl md:text-4xl font-bold flex items-center justify-center gap-3"
              style={{ fontFamily: 'Anuphan', color: '#333333' }}
            >
              <Users size={40} className="text-gray-800" />
              ทีมงาน
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {/* Team Member 1 */}
            <div className="flex flex-col items-center hover:scale-105 transition-transform duration-300">
              <p className="font-bold text-lg" style={{ color: '#333333', fontFamily: 'Anuphan' }}>
                พชรพล อาจสังข์
              </p>
              <p className="text-sm text-gray-600 mb-2" style={{ fontFamily: 'Poppins' }}>
                ID: 1650700436
              </p>
              <p className="text-sm font-semibold" style={{ color: '#FFA600', fontFamily: 'Poppins, Anuphan' }}>
                Database Designer<br />API Backend
              </p>
            </div>

            {/* Team Member 2 */}
            <div className="flex flex-col items-center hover:scale-105 transition-transform duration-300">
              <p className="font-bold text-lg" style={{ color: '#333333', fontFamily: 'Anuphan' }}>
                นวพรรรษ์ สุทนต์
              </p>
              <p className="text-sm text-gray-600 mb-2" style={{ fontFamily: 'Poppins' }}>
                ID: 1650706615
              </p>
              <p className="text-sm font-semibold" style={{ color: '#FFA600', fontFamily: 'Poppins, Anuphan' }}>
                Web Developer
              </p>
            </div>

            {/* Team Member 3 */}
            <div className="flex flex-col items-center hover:scale-105 transition-transform duration-300">
              <p className="font-bold text-lg" style={{ color: '#333333', fontFamily: 'Anuphan' }}>
                สุภชีพ พูลสวัสดิ์
              </p>
              <p className="text-sm text-gray-600 mb-2" style={{ fontFamily: 'Poppins' }}>
                ID: 1650706797
              </p>
              <p className="text-sm font-semibold" style={{ color: '#FFA600', fontFamily: 'Poppins, Anuphan' }}>
                UX & UI Designer
              </p>
            </div>

            {/* Team Member 4 */}
            <div className="flex flex-col items-center hover:scale-105 transition-transform duration-300">
              <p className="font-bold text-lg" style={{ color: '#333333', fontFamily: 'Anuphan' }}>
                ชิตวร พิสิฐพิทยากุล
              </p>
              <p className="text-sm text-gray-600 mb-2" style={{ fontFamily: 'Poppins' }}>
                ID: 1650707019
              </p>
              <p className="text-sm font-semibold" style={{ color: '#FFA600', fontFamily: 'Poppins, Anuphan' }}>
                Data Preprocessing<br />Tester
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ส่วนเทคโนโลยี */}
      <section style={{ backgroundColor: '#FFFDFA' }} className="py-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 
              className="text-3xl md:text-4xl font-bold"
              style={{ fontFamily: 'Anuphan', color: '#333333' }}
            >เทคโนโลยีที่ใช้</h2>
          </div>

          <div className="flex flex-col items-center gap-8 max-w-2xl mx-auto">
            <div className="w-full space-y-4">
              <div className="text-center">
                <span className="font-bold" style={{ color: '#FFA600', fontFamily: 'Poppins' }}>Build Tool:</span>
                <span className="text-gray-600 ml-2" style={{ fontFamily: 'Poppins, Anuphan' }}>Vite</span>
              </div>
              <div className="text-center">
                <span className="font-bold" style={{ color: '#FFA600', fontFamily: 'Poppins' }}>Frontend:</span>
                <span className="text-gray-600 ml-2" style={{ fontFamily: 'Poppins, Anuphan' }}>React + TypeScript, Tailwind CSS</span>
              </div>
              <div className="text-center">
                <span className="font-bold" style={{ color: '#FFA600', fontFamily: 'Poppins' }}>Backend:</span>
                <span className="text-gray-600 ml-2" style={{ fontFamily: 'Poppins, Anuphan' }}>Node.js + Express, TypeScript</span>
              </div>
              <div className="text-center">
                <span className="font-bold" style={{ color: '#FFA600', fontFamily: 'Poppins' }}>Database:</span>
                <span className="text-gray-600 ml-2" style={{ fontFamily: 'Poppins, Anuphan' }}>MongoDB</span>
              </div>
              <div className="text-center">
                <span className="font-bold" style={{ color: '#FFA600', fontFamily: 'Poppins' }}>State Management:</span>
                <span className="text-gray-600 ml-2" style={{ fontFamily: 'Poppins, Anuphan' }}>Redux Toolkit</span>
              </div>
              <div className="text-center">
                <span className="font-bold" style={{ color: '#FFA600', fontFamily: 'Poppins' }}>Real-time:</span>
                <span className="text-gray-600 ml-2" style={{ fontFamily: 'Poppins, Anuphan' }}>Socket.io</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ส่วนฟีเจอร์หลัก */}
      <section style={{ backgroundColor: '#FFFDFA' }} className="py-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 
              className="text-3xl md:text-4xl font-bold flex items-center justify-center gap-3"
              style={{ fontFamily: 'Anuphan', color: '#333333' }}
            >
              <Heart size={40} className="text-gray-800" />
              ฟีเจอร์หลัก
            </h2>
          </div>

          <div className="flex flex-col items-center gap-4 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 hover:translate-x-0 transition-transform duration-300">
                <span style={{ color: '#FFA600' }}>•</span>
                <span className="text-gray-600" style={{ fontFamily: 'Poppins, Anuphan' }}>ค้นหาและประกาศสัตว์เลี้ยงที่หายไป</span>
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 hover:translate-x-0 transition-transform duration-300">
                <span style={{ color: '#FFA600' }}>•</span>
                <span className="text-gray-600" style={{ fontFamily: 'Poppins, Anuphan' }}>ค้นหาและประกาศสัตว์เลี้ยงที่ต้องการบ้าน</span>
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 hover:translate-x-0 transition-transform duration-300">
                <span style={{ color: '#FFA600' }}>•</span>
                <span className="text-gray-600" style={{ fontFamily: 'Poppins, Anuphan' }}>แสดงสัตว์เลี้ยงที่พร้อมให้รับเลี้ยง</span>
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 hover:translate-x-0 transition-transform duration-300">
                <span style={{ color: '#FFA600' }}>•</span>
                <span className="text-gray-600" style={{ fontFamily: 'Poppins, Anuphan' }}>ระบบแชท real-time สำหรับการติดต่อสื่อสาร</span>
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 hover:translate-x-0 transition-transform duration-300">
                <span style={{ color: '#FFA600' }}>•</span>
                <span className="text-gray-600" style={{ fontFamily: 'Poppins, Anuphan' }}>ระบบบันทึกสัตว์เลี้ยงที่ชื่นชอบ</span>
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 hover:translate-x-0 transition-transform duration-300">
                <span style={{ color: '#FFA600' }}>•</span>
                <span className="text-gray-600" style={{ fontFamily: 'Poppins, Anuphan' }}>ระบบการแจ้งเตือน (Notifications)</span>
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 hover:translate-x-0 transition-transform duration-300">
                <span style={{ color: '#FFA600' }}>•</span>
                <span className="text-gray-600" style={{ fontFamily: 'Poppins, Anuphan' }}>โปรไฟล์ผู้ใช้และจัดการโพสต์ส่วนตัว</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
