import React from 'react';
import { CloseIcon } from './Icons';

interface ImageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAvatar: (avatarUrl: string) => void;
}

const AVATAR_OPTIONS = [
  'https://i.pravatar.cc/150?u=avatar1', 'https://i.pravatar.cc/150?u=avatar2',
  'https://i.pravatar.cc/150?u=avatar3', 'https://i.pravatar.cc/150?u=avatar4',
  'https://i.pravatar.cc/150?u=avatar5', 'https://i.pravatar.cc/150?u=avatar6',
  'https://i.pravatar.cc/150?u=avatar7', 'https://i.pravatar.cc/150?u=avatar8',
  'https://i.pravatar.cc/150?u=avatar9', 'https://i.pravatar.cc/150?u=avatar10',
  'https://i.pravatar.cc/150?u=avatar11', 'https://i.pravatar.cc/150?u=avatar12',
];

const ImageSelectorModal: React.FC<ImageSelectorModalProps> = ({ isOpen, onClose, onSelectAvatar }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in" 
      style={{animationDuration: '200ms'}}
      onClick={onClose}
    >
      <div 
        className="bg-brand-surface-glass border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl p-6 backdrop-blur-xl animate-slide-in-up"
        style={{animationDuration: '300ms'}}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-brand-secondary">Select Your Avatar</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-brand-border transition-colors">
            <CloseIcon className="w-5 h-5 text-brand-muted" />
          </button>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 gap-4 max-h-[60vh] overflow-y-auto pr-2">
          {AVATAR_OPTIONS.map((url) => (
            <button 
              key={url}
              onClick={() => onSelectAvatar(url)}
              className="aspect-square rounded-full overflow-hidden border-2 border-transparent hover:border-brand-primary focus:border-brand-primary focus:outline-none transition-all duration-200 transform hover:scale-110"
            >
              <img src={url} alt="Avatar option" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
        
        <div className="mt-6 text-right">
            <button
                onClick={onClose}
                className="px-5 py-2 bg-brand-border text-brand-secondary font-semibold rounded-lg hover:bg-brand-muted/30 transition-colors"
            >
                Cancel
            </button>
        </div>
      </div>
    </div>
  );
};

export default ImageSelectorModal;