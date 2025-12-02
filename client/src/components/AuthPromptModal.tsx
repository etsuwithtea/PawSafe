import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AuthPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

export default function AuthPromptModal({ isOpen, onClose, message = 'กรุณาเข้าสู่ระบบเพื่อทำการติดต่อ' }: AuthPromptModalProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-sm" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-2xl">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-lg font-bold" style={{ fontFamily: 'Anuphan', color: '#FFA600' }}>
            กรุณาเข้าสู่ระบบ
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        <p className="text-gray-600 mb-6" style={{ fontFamily: 'Poppins, Anuphan' }}>
          {message}
        </p>

        <div className="flex gap-3">
          <button
            onClick={() => navigate('/login')}
            className="flex-1 px-4 py-2 bg-black text-white rounded-lg font-bold hover:bg-gray-800 transition-colors"
            style={{ fontFamily: 'Poppins, Anuphan' }}
          >
            เข้าสู่ระบบ
          </button>

          <button
            onClick={() => navigate('/signup')}
            className="flex-1 px-4 py-2 rounded-lg font-bold hover:brightness-110 transition-all"
            style={{ fontFamily: 'Poppins, Anuphan', backgroundColor: '#FFA600', color: '#1f2937' }}
          >
            สมัครสมาชิก
          </button>
        </div>
      </div>
    </div>
  );
}
