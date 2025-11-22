import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import BackToTop from '../components/BackToTop';
import heroImage from '../assets/images/home/herosection_pic1.png';
import adoptionImage from '../assets/images/home/herosection_pic2.png';
import mapSectionImage from '../assets/images/home/mapsection_pic1.png';
import adoptSectionImage from '../assets/images/home/adopsection_pic1.png';
import adoptSectionBgImage from '../assets/images/home/adopsection_pic2.png';
import lostSectionImage1 from '../assets/images/home/lostsection_pic1.png';
import lostSectionImage2 from '../assets/images/home/lostsection_pic2.png';
import foundSectionImage1 from '../assets/images/home/foundsection_pic1.png';
import foundSectionImage2 from '../assets/images/home/foundsection_pic2.png';
import foundSectionImage3 from '../assets/images/home/foundsection_pic3.png';

interface Stats {
  adoptedDogs: number;
  adoptedCats: number;
  adoptedOthers: number;
  returnedPets: number;
}

export default function HomePage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({
    adoptedDogs: 0,
    adoptedCats: 0,
    adoptedOthers: 0,
    returnedPets: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch adopted pets
        const adoptedResponse = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/pets?status=adopted&limit=1000`
        );
        const adoptedData = await adoptedResponse.json();
        
        // Fetch returned lost pets
        const returnedResponse = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/lost-pets?status=returned&limit=1000`
        );
        const returnedData = await returnedResponse.json();

        const adoptedPets = adoptedData.data || [];
        const returnedPets = returnedData.data || [];

        const adoptedDogs = adoptedPets.filter((pet: any) => pet.species === 'dog').length;
        const adoptedCats = adoptedPets.filter((pet: any) => pet.species === 'cat').length;
        const adoptedOthers = adoptedPets.filter((pet: any) => pet.species === 'other').length;
        const returnedCount = returnedPets.length;

        setStats({
          adoptedDogs,
          adoptedCats,
          adoptedOthers,
          returnedPets: returnedCount,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  const handleAdoptionClick = () => {
    navigate('/adoption');
  };

  return (
    <div style={{ backgroundColor: '#FFFDFA' }}>
      <section style={{ backgroundColor: '#FFFDFA' }} className="relative overflow-visible pt-16 pb-20">
        <div className="flex flex-col items-center justify-center mb-0 mt-15 z-5 gap-4">
          <h1 
            className="text-3xl md:text-5xl font-bold text-center mb-2" 
            style={{ fontFamily: 'Anuphan', color: '#FFA600' }}
          >ตามหาบ้านให้เหล่าน้องๆกันเถอะ</h1>
          <p 
            className="text-gray-600 text-center mb-4 max-w-2xl px-4 text-sm md:text-md"
            style={{ fontFamily: 'Poppins, Anuphan' }}
          >เชื่อมโยงบ้านอบอุ่นกับสัตว์ที่ต้องการ และตามหาสัตว์เลี้ยงที่หายไปให้กลับคืนสู่อ้อมกอดอย่างปลอดภัย <br />ทุกชีวิตมีค่า ทุกการตามหามีความหมายสำหรับเรา</p>
          <button 
            onClick={handleAdoptionClick}
            className="px-8 py-3 text-white bg-black rounded-md hover:bg-gray-800 hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 text-sm cursor-pointer"
            style={{ fontFamily: 'Poppins, Anuphan' }}
          >เริ่มหากันเลย</button>
        </div>

        <div className="relative h-full sm:h-full overflow-visible">
          <img 
            src={heroImage} 
            alt="Hero Section" 
            className="w-full h-full object-contain hover:scale-105 transition-transform duration-500 cursor-pointer"/>
          
          <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 top-1/2 w-7/12 sm:w-1/2 md:w-3/5 max-w-6xl z-10 overflow-hidden rounded-lg drop-shadow-2xl">
            <img 
              src={adoptionImage} 
              alt="Adoption Section" 
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>

        <div className="py-14 sm:py-10 md:py-17 absolute transform -bottom-1 sm:-bottom-2 md:bottom-15 z-15 w-full" style={{ backgroundColor: '#FFFDFA' }}></div>
      </section>

      <section style={{ backgroundColor: '#FFFDFA' }} className="py-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="flex justify-center overflow-hidden rounded-lg">
              <img 
                src={mapSectionImage} 
                alt="Thailand Map" 
                className="w-full max-w-sm rounded-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
              />
            </div>
            
            <div className="flex flex-col justify-center">
              <h2 
                className="text-2xl md:text-5xl font-bold mb-4"
                style={{ fontFamily: 'Anuphan', color: '#FFA600' }}
              >ในปี 2568<br />
                <span className="text-lg md:text-3xl">ประเทศไทยมีสัตว์หายเป็นจำนวนกว่า<br />6.65 ล้านตัว!</span>
              </h2>
              <p 
                className="text-gray-600 text-base md:text-lg mb-6"
                style={{ fontFamily: 'Poppins, Anuphan' }}
              >และสัตว์จรจัดที่ยังไร้บ้านอีกมหาศาล<br />เราจึงเป็นสะพานเชื่อมแห่งความปลอดภัย <br />และความรับผิดชอบต่อเพื่อนสี่ขาเเละอีกมากมาย
              </p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ backgroundColor: '#FFFDFA' }} className="py-20 px-4 md:px-8 relative">
        <div className="max-w-6xl mx-auto relative">
          <div className="absolute right-0 translate-x-48 top-1/2 transform -translate-y-1/2 z-0 hidden md:flex justify-center w-1/2">
            <img 
              src={adoptSectionBgImage} 
              alt="Adoption Background" 
              className="w-2/4 "
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
            <div className="flex justify-center order-2 md:order-1 overflow-hidden rounded-lg">
              <img 
                src={adoptSectionImage} 
                alt="Pet Adoption Card" 
                className="w-full max-w-sm md:max-w-xl rounded-lg hover:shadow-2xl hover:scale-110 transition-all duration-300 cursor-pointer"
              />
            </div>
            
            <div className="flex flex-col justify-center order-1 md:order-2">
              <h2 
                className="text-2xl md:text-3xl font-bold mb-6"
                style={{ fontFamily: 'Anuphan', color: '#FFA600' }}
              >เชื่อมโยงสัตว์ไร้บ้านสู่บ้านใหม่ที่ปลอดภัย</h2>
              <p 
                className="text-gray-600 text-base md:text-lg mb-8"
                style={{ fontFamily: 'Poppins, Anuphan' }}
              >แพลตฟอร์มที่ใช้งานง่าย เพื่อตามหาบ้านใหม่ที่ปลอดภัย <br />ให้กับสัตว์จรจัดและช่วยคุณตามหาสัตว์เลี้ยงที่หายไป <br />ให้กลับสู่ครอบครัวได้อย่างรวดเร็ว</p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ backgroundColor: '#FFFDFA' }} className="py-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 
              className="text-2xl md:text-5xl font-bold"
              style={{ fontFamily: 'Anuphan', color: '#333333' }}
            >มอบบ้านถาวร ติดตามเพื่อนรักที่หลัดหลง</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="flex flex-col items-center text-center hover:bg-gray-50 hover:rounded-lg hover:p-6 transition-all duration-300 cursor-pointer">
              <h3 
                className="text-xl md:text-3xl font-bold mb-8"
                style={{ fontFamily: 'Anuphan', color: '#FFA600' }}
              >ตามหาบ้าน<br />(Adoption)
              </h3>
              <img 
                src={lostSectionImage1} 
                alt="Adoption Icon" 
                className="w-32 md:w-48 h-32 md:h-48 object-contain mb-8 hover:scale-110 transition-transform duration-300"
              />
              <p 
                className="text-gray-600 text-base leading-relaxed"
                style={{ fontFamily: 'Poppins, Anuphan' }}
              >ประกาศรับเลี้ยง ระบุ พิกัดที่ตั้งของน้องๆ และข้อมูลการติดต่อผู้ดูแลเพื่อให้ผู้สนใจสามารถเข้าเยี่ยมชม <br />และเริ่มต้นขั้นตอนการรับเลี้ยงได้อย่างง่ายดาย</p>
            </div>

            <div className="flex flex-col items-center text-center hover:bg-gray-50 hover:rounded-lg hover:p-6 transition-all duration-300 cursor-pointer">
              <h3 
                className="text-xl md:text-3xl font-bold mb-8"
                style={{ fontFamily: 'Anuphan', color: '#FFA600' }}
              >ตามหาสัตว์หาย<br />(Lost & Found)</h3>
              <img 
                src={lostSectionImage2} 
                alt="Lost & Found Icon" 
                className="w-40 md:w-64 h-40 md:h-64 object-contain mb-8 hover:scale-110 transition-transform duration-300"
              />
              <p 
                className="text-gray-600 text-base leading-relaxed"
                style={{ fontFamily: 'Poppins, Anuphan' }}
              >แสดงประกาศหายพร้อมรายละเอียดการพลัดหลง<br />และช่องทางการติดต่อเจ้าของ<br />เพื่อให้การประสานงานรวดเร็วและตรงจุด</p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ backgroundColor: '#FFB835' }} className="py-30 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 
              className="text-2xl md:text-5xl font-bold text-white"
              style={{ fontFamily: 'Anuphan' }}
            >เพื่อนสี่ขาที่พ้นจากภาวะจรจัด และมีบ้านที่ปลอดภัย</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center hover:scale-110 transition-transform duration-300 cursor-pointer">
              <img 
                src={foundSectionImage1} 
                alt="Dogs" 
                className="w-44 md:w-56 h-44 md:h-56 object-contain mb-6 hover:drop-shadow-lg transition-all duration-300"
              />
              <p className="text-white text-2xl md:text-4xl font-bold" style={{ fontFamily: 'Anuphan' }}>
                {stats.adoptedDogs} ตัว
              </p>
            </div>

            <div className="flex flex-col items-center hover:scale-110 transition-transform duration-300 cursor-pointer">
              <img 
                src={foundSectionImage2} 
                alt="Cats" 
                className="w-44 md:w-56 h-44 md:h-56 object-contain mb-6 hover:drop-shadow-lg transition-all duration-300"
              />
              <p className="text-white text-2xl md:text-4xl font-bold" style={{ fontFamily: 'Anuphan' }}>
                {stats.adoptedCats} ตัว
              </p>
            </div>

            <div className="flex flex-col items-center hover:scale-110 transition-transform duration-300 cursor-pointer">
              <img 
                src={foundSectionImage3} 
                alt="Other Animals" 
                className="w-44 md:w-56 h-44 md:h-56 object-contain mb-6 hover:drop-shadow-lg transition-all duration-300"
              />
              <p className="text-white text-2xl md:text-4xl font-bold" style={{ fontFamily: 'Anuphan' }}>
                {stats.adoptedOthers} ตัว
              </p>
            </div>
          </div>
        </div>
      </section>
      <BackToTop />
    </div>
  );
}