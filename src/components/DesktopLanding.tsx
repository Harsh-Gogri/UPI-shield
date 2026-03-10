import React from 'react';
import { Smartphone, Shield, QrCode, BookOpen, AlertTriangle } from 'lucide-react';

export const DesktopLanding = () => {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-2xl w-full">
        <div className="w-24 h-24 bg-primary rounded-[40px] flex items-center justify-center text-onPrimary mx-auto mb-10 shadow-medium">
          <Shield size={48} />
        </div>
        
        <h1 className="text-6xl font-black mb-6 tracking-tight">UPI Shield</h1>
        <p className="text-xl text-onSurfaceVariant mb-16 leading-relaxed max-w-lg mx-auto">
          Your personal guardian against UPI fraud. Scan QRs, test your awareness, and stay safe in the digital economy.
        </p>

        <div className="bento-card bg-primaryContainer/30 p-12 border border-primary/10 mb-16">
          <div className="flex items-center justify-center gap-4 mb-8">
            <Smartphone className="text-primary" size={40} />
            <h2 className="text-3xl font-black">Mobile Experience</h2>
          </div>
          <p className="text-onSurfaceVariant mb-10 text-lg">
            UPI Shield is optimized for mobile devices. Scan the code below to open the app on your phone.
          </p>
          <div className="flex justify-center">
            <div className="bg-white p-8 rounded-[48px] shadow-medium border border-white">
              <QrCode size={200} className="text-onSurface" />
              <p className="mt-6 text-xs font-black text-onSurfaceVariant uppercase tracking-[0.2em]">Scan to Open</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-[24px] bg-card-blue flex items-center justify-center mb-4 shadow-soft">
              <QrCode size={28} className="text-blue-600" />
            </div>
            <span className="text-sm font-black uppercase tracking-wider">Scan QR</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-[24px] bg-card-mint flex items-center justify-center mb-4 shadow-soft">
              <BookOpen size={28} className="text-green-600" />
            </div>
            <span className="text-sm font-black uppercase tracking-wider">Learn</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-[24px] bg-card-orange flex items-center justify-center mb-4 shadow-soft">
              <AlertTriangle size={28} className="text-orange-600" />
            </div>
            <span className="text-sm font-black uppercase tracking-wider">Report</span>
          </div>
        </div>
      </div>
    </div>
  );
};
