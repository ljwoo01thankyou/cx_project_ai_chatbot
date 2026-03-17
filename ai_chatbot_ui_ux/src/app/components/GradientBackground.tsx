import { ReactNode } from 'react';

interface GradientBackgroundProps {
  children: ReactNode;
}

export function GradientBackground({ children }: GradientBackgroundProps) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 핑크-오렌지 그라데이션 배경 */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-400 via-pink-300 to-orange-400" />
      
      {/* 장식용 원형 요소들 */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] opacity-30">
        <div className="absolute top-20 right-40 w-96 h-96 rounded-full bg-pink-300 blur-3xl" />
        <div className="absolute top-60 right-20 w-80 h-80 rounded-full bg-orange-300 blur-2xl" />
      </div>
      
      {/* 하단 곡선 */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white/30 to-transparent" />
      
      {/* 콘텐츠 */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
