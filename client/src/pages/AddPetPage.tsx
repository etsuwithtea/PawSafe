import { useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/store';
import { createPet } from '../store/petActions';
import { createLostPet } from '../store/lostPetActions';
import { MapPin, User, Bookmark, Clock } from 'lucide-react';
import Toast, { useToast } from '../components/Toast';
import { provinceDistricts, provinces } from '../data/thaiLocations';

const dropdownStyles = `
  select {
    color-scheme: dark;
  }
  select option {
    background-color: #000;
    color: #fff;
    padding: 5px 10px;
  }
  select option:hover {
    background-color: #333;
  }
  select option:checked {
    background-color: #333;
    color: #fff;
  }
`;

export default function AddPetPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toasts, showToast, removeToast } = useToast();

  const petType = searchParams.get('type') || 'adoption';
  const isLostPet = petType === 'lost';
  const buttonText = isLostPet ? 'โพสต์ตามหาสัตว์หาย' : 'โพสต์ตามหาบ้าน';
  const navigationRoute = isLostPet ? '/lost-pets' : '/adoption';

  const [isLoading, setIsLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    species: 'dog' as 'dog' | 'cat' | 'other',
    province: '',
    district: '',
    locationDetails: '',
    description: '',
  });

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    console.log('Form change:', name, value);

    if (name === 'province') {
      setFormData((prev) => ({
        ...prev,
        province: value,
        district: '',
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const maxImages = 5;
    const totalImages = imagePreviews.length + files.length;

    if (totalImages > maxImages) {
      alert(`Maximum ${maxImages} images allowed`);
      return;
    }

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) {
        alert('Please select only image files');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (result && typeof result === 'string') {
          setImageFiles((prev) => [...prev, file]);
          setImagePreviews((prev) => [...prev, result]);
        }
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Form data before submit:', formData);

    if (!formData.name?.trim() || !formData.province || !formData.district || !formData.description?.trim() || !formData.locationDetails?.trim()) {
      showToast('กรุณากรอกข้อมูลให้ครบถ้วน', 'error');
      return;
    }

    setIsLoading(true);
    try {
      let uploadedImagePaths: string[] = [];
      if (imageFiles.length > 0) {
        const formDataImages = new FormData();
        imageFiles.forEach((file) => {
          formDataImages.append('images', file);
        });

        const uploadEndpoint = isLostPet ? 'lost-pets' : 'pets';
        const uploadResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/${uploadEndpoint}/upload-images`, {
          method: 'POST',
          body: formDataImages,
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload images');
        }

        const uploadData = await uploadResponse.json();
        uploadedImagePaths = uploadData.images;
      }

      const petData = {
        name: formData.name,
        species: formData.species,
        location: `${formData.district}, ${formData.province}`,
        locationDetails: formData.locationDetails,
        description: formData.description,
        characteristics: [],
        images: uploadedImagePaths,
        contactUserId: user._id,
        contactName: user.username,
        contactPhone: user.phone || '',
        contactEmail: user.email,
      };

      if (isLostPet) {
        await dispatch(
          createLostPet({
            ...petData,
            lostDate: new Date(),
          }) as any
        );
      } else {
        await dispatch(
          createPet(petData) as any
        );
      }

      showToast('โพสต์สัตว์เลี้ยงสำเร็จ!', 'success');
      navigate(navigationRoute);
    } catch (error) {
      console.error('Error adding pet:', error);
      showToast('เกิดข้อผิดพลาดในการโพสต์', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#FFFDFA' }} className="min-h-screen py-8">
      <Toast toasts={toasts} onRemove={removeToast} />
      <style>{dropdownStyles}</style>
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1
            className="text-4xl md:text-5xl font-bold mb-2"
            style={{ fontFamily: 'Anuphan', color: '#FFA600' }}
          >
            {isLostPet ? 'โพสต์ตามหาสัตว์หาย' : 'โพสต์หาบ้าน'}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 flex flex-col">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-sm">
              <div className="relative w-full h-64 bg-gray-200 overflow-hidden">
                {imagePreviews.length > 0 ? (
                  <img
                    src={imagePreviews[0]}
                    alt={formData.name || 'Pet'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gray-400 text-center text-sm">
                    ยังไม่มีรูปภาพ
                    </span>
                  </div>
                )}
              </div>

              <div className="p-5" style={{ fontFamily: 'Poppins, Anuphan' }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Clock size={14} className="text-gray-600" />
                    <span>7 นาทีที่ผ่านมา</span>
                  </div>
                  <span className="inline-block px-4 py-2 bg-black text-white rounded-full text-sm font-medium">
                    {formData.species === 'dog' ? 'สุนัข' : formData.species === 'cat' ? 'แมว' : 'อื่นๆ'}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  {formData.name || 'ชื่อสัตว์เลี้ยง'}
                </h3>

                <div className="flex items-center gap-3 text-xs text-gray-700 mb-2">
                  <span className="flex items-center gap-1">
                    <MapPin size={16} className="text-gray-700" />
                    <span>
                      {formData.district && formData.province
                        ? `${formData.district}, ${formData.province}`
                        : 'สถานที่ตั้ง'}
                    </span>
                  </span>
                  <span className="flex items-center gap-1">
                    <User size={16} className="text-gray-700" />
                    <span>{user.username}</span>
                  </span>
                </div>

                <p className="text-xs font-bold text-gray-700 mb-2">รายละเอียด</p>

                <p className="text-xs text-gray-600 line-clamp-3 mb-4 leading-relaxed">
                  {formData.description || 'บอกเล่าเกี่ยวกับสัตว์เลี้ยง...'}
                </p>

                <div className="flex gap-2">
                  <button 
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className="p-2 rounded-full transition-all duration-200 hover:scale-110"
                    style={{
                      backgroundColor: isBookmarked ? '#000000' : 'transparent',
                    }}
                  >
                    <Bookmark 
                      size={24}
                      className="transition-colors"
                      fill={isBookmarked ? "white" : "none"}
                      stroke={isBookmarked ? "white" : "currentColor"}
                    />
                  </button>
                  <button 
                    className="flex-1 px-4 py-2 font-bold rounded-lg transition-colors duration-200 text-sm flex items-center justify-center gap-2"
                    style={{ backgroundColor: '#FFA600', color: '#1f2937' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#000000';
                      e.currentTarget.style.color = '#ffffff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#FFA600';
                      e.currentTarget.style.color = '#1f2937';
                    }}
                  >
                    ติดต่อ
                  </button>
                </div>
              </div>

              {imagePreviews.length > 1 && (
                <div className="border-t border-gray-200 p-3 bg-gray-50">
                  <div className="flex gap-2 overflow-x-auto">
                    {imagePreviews.map((preview, idx) => (
                      <img
                        key={idx}
                        src={preview}
                        alt={`${idx + 1}`}
                        className="w-16 h-16 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity shrink-0"
                        onClick={() => {
                          const newPreviews = [preview, ...imagePreviews.filter((_, i) => i !== idx)];
                          setImagePreviews(newPreviews);
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 flex flex-col">
            <h2
              className="text-2xl font-bold mb-4"
              style={{ fontFamily: 'Anuphan', color: '#333' }}
            >
              กรอกข้อมูลสัตว์เลี้ยง
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6 flex-1">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label
                      className="block text-sm font-bold mb-2"
                      style={{ fontFamily: 'Poppins, Anuphan' }}
                    >
                      ชื่อสัตว์เลี้ยง
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="กรอกชื่อสัตว์เลี้ยง"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      style={{ fontFamily: 'Poppins, Anuphan' }}
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-bold mb-2"
                      style={{ fontFamily: 'Poppins, Anuphan' }}
                    >
                      ประเภท
                    </label>
                    <select
                      name="species"
                      value={formData.species}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 shadow-sm hover:shadow-md transition-all duration-200 bg-black text-white appearance-none cursor-pointer"
                      style={{ fontFamily: 'Poppins, Anuphan', backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22white%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22%3e%3cpolyline points=%226 9 12 15 18 9%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
                    >
                      <option value="">-- เลือกประเภท --</option>
                      <option value="dog">สุนัข</option>
                      <option value="cat">แมว</option>
                      <option value="other">อื่นๆ</option>
                    </select>
                  </div>

                  <div>
                    <label
                      className="block text-sm font-bold mb-2"
                      style={{ fontFamily: 'Poppins, Anuphan' }}
                    >
                      รายละเอียดที่อยู่
                    </label>
                    <input
                      type="text"
                      name="locationDetails"
                      value={formData.locationDetails}
                      onChange={handleChange}
                      placeholder="เช่น ถนน ซอย ชื่อบ้าน"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      style={{ fontFamily: 'Poppins, Anuphan' }}
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-bold mb-2"
                      style={{ fontFamily: 'Poppins, Anuphan' }}
                    >
                    อัพโหลดรูปภาพ
                    </label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                    <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'Poppins, Anuphan' }}>
                      JPG, PNG, GIF (ขนาดไม่เกิน 5MB ต่อรูป)
                    </p>

                    {imagePreviews.length > 0 && (
                      <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-2">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-20 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 bg-gray-800 hover:bg-gray-900 text-white rounded-full w-6 h-6 flex items-center justify-center transition-all duration-200 shadow-md text-xs font-bold"
                              title="ลบรูปภาพ"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label
                      className="block text-sm font-bold mb-3"
                      style={{ fontFamily: 'Poppins, Anuphan' }}
                    >
                      สถานที่
                    </label>

                    <div className="grid grid-cols-2 gap-2">
                      <select
                        name="province"
                        value={formData.province}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 shadow-sm hover:shadow-md transition-all duration-200 bg-black text-white appearance-none cursor-pointer"
                        style={{ fontFamily: 'Poppins, Anuphan', backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22white%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22%3e%3cpolyline points=%226 9 12 15 18 9%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
                      >
                        <option value="">-- จังหวัด --</option>
                        {provinces.map((province) => (
                          <option key={province} value={province}>
                            {province}
                          </option>
                        ))}
                      </select>

                      <select
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        disabled={!formData.province}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 shadow-sm hover:shadow-md transition-all duration-200 bg-black text-white disabled:bg-gray-600 disabled:cursor-not-allowed appearance-none cursor-pointer"
                        style={{ fontFamily: 'Poppins, Anuphan', backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22white%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22%3e%3cpolyline points=%226 9 12 15 18 9%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
                      >
                        <option value="">-- อำเภอ --</option>
                        {formData.province &&
                          provinceDistricts[formData.province]?.map((district) => (
                            <option key={district} value={district}>
                              {district}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      className="block text-sm font-bold mb-2"
                      style={{ fontFamily: 'Poppins, Anuphan' }}
                    >
                      คำอธิบาย
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="เจอน้องอยู่เแถวหน้าตึก เห็นเดินไปเดินมา 2 - 3 วันแล้ว ไม่มีแม่ดูแลด้วย มีใครใจดีพอรับไปเลี้ยงได้ไหม"
                      rows={8}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      style={{ fontFamily: 'Poppins, Anuphan' }}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-4 text-gray-800 font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base flex items-center justify-center gap-2"
                style={{ fontFamily: 'Poppins, Anuphan', backgroundColor: '#FFA600' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#000000';
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFA600';
                  e.currentTarget.style.color = '#1f2937';
                }}
              >
                <span>+</span>
                {isLoading ? 'กำลังโพสต์...' : buttonText}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
