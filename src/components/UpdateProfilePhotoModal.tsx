import React, { useState, useRef, useEffect } from 'react';
import { X, Camera, Upload, Check, RefreshCw, User } from 'lucide-react';

interface UpdateProfilePhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentImage?: string;
  onSave: (imageUrl: string) => void;
}

export const UpdateProfilePhotoModal: React.FC<UpdateProfilePhotoModalProps> = ({
  isOpen,
  onClose,
  currentImage,
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'camera'>('upload');
  const [previewUrl, setPreviewUrl] = useState<string>(currentImage || '');
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string>('');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (isOpen) {
      setPreviewUrl(currentImage || '');
      setActiveTab('upload');
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, currentImage]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const startCamera = async () => {
    setCameraError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: { ideal: 640 }, height: { ideal: 640 }, facingMode: 'user' } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError('Unable to access camera. Please verify camera permissions or upload an image file instead.');
      setIsCameraActive(false);
    }
  };

  const handleTabSwitch = (tab: 'upload' | 'camera') => {
    setActiveTab(tab);
    if (tab === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setPreviewUrl(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 400;
      canvas.height = video.videoHeight || 400;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        setPreviewUrl(dataUrl);
        stopCamera();
      }
    }
  };

  const handleSave = () => {
    if (previewUrl) {
      onSave(previewUrl);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <h3 className="font-bold flex items-center gap-2">
            <Camera className="w-5 h-5 text-indigo-400" />
            Update Profile Photo
          </h3>
          <button 
            onClick={() => { stopCamera(); onClose(); }}
            className="w-8 h-8 rounded-full bg-white dark:bg-slate-900/10 hover:bg-white dark:bg-slate-900/20 flex items-center justify-center transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Tabs */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
            <button
              onClick={() => handleTabSwitch('upload')}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
                activeTab === 'upload' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-slate-100'
              }`}
            >
              <Upload className="w-4 h-4" />
              Upload File
            </button>
            <button
              onClick={() => handleTabSwitch('camera')}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
                activeTab === 'camera' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-slate-100'
              }`}
            >
              <Camera className="w-4 h-4" />
              Take Photo
            </button>
          </div>

          {/* Preview Container */}
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-indigo-100 shadow-inner bg-slate-100 dark:bg-slate-800 flex items-center justify-center relative">
              {activeTab === 'camera' && isCameraActive ? (
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-full object-cover transform -scale-x-100"
                />
              ) : previewUrl ? (
                <img src={previewUrl} alt="Profile Preview" className="w-full h-full object-cover" />
              ) : (
                <User className="w-16 h-16 text-slate-400" />
              )}
            </div>

            <canvas ref={canvasRef} className="hidden" />

            {activeTab === 'upload' && (
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded-xl transition-colors text-xs">
                <Upload className="w-4 h-4" />
                Browse Image from Device
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileUpload} 
                  className="hidden" 
                />
              </label>
            )}

            {activeTab === 'camera' && (
              <div className="space-y-3 w-full text-center">
                {cameraError ? (
                  <p className="text-xs text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-100">{cameraError}</p>
                ) : isCameraActive ? (
                  <button
                    onClick={capturePhoto}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs transition-colors shadow-sm flex items-center gap-2 mx-auto"
                  >
                    <Camera className="w-4 h-4" />
                    Capture Snapshot
                  </button>
                ) : (
                  <button
                    onClick={startCamera}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs transition-colors shadow-sm flex items-center gap-2 mx-auto"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Retry Camera
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
          <button
            onClick={() => { stopCamera(); onClose(); }}
            className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:bg-slate-800 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!previewUrl}
            className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            Save Photo
          </button>
        </div>
      </div>
    </div>
  );
};
