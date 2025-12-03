import { X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = 'ยืนยัน',
  cancelText = 'ยกเลิก',
  isDangerous = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 40000 }}>
      <div className="fixed inset-0 bg-black/50" style={{ zIndex: 39999 }} onClick={onCancel} />
      <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-xl relative" style={{ zIndex: 40000 }}>
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-xl font-bold" style={{ fontFamily: 'Anuphan', color: '#FFA600' }}>
            {title}
          </h2>
          <button
            onClick={onCancel}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <p className="text-gray-600 mb-6" style={{ fontFamily: 'Poppins, Anuphan' }}>
          {message}
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-bold hover:bg-gray-300 transition-colors"
            style={{ fontFamily: 'Poppins, Anuphan' }}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2 text-white rounded-lg font-bold transition-colors ${
              isDangerous
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-black hover:bg-gray-800'
            }`}
            style={{ fontFamily: 'Poppins, Anuphan' }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
