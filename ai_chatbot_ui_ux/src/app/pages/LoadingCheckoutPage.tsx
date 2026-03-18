import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { ModernBackground } from '../components/ModernBackground';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';

export default function LoadingCheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const loadingMessages = [
    '가장 합리적으로 구매할 수 있는 방법을 찾고 있어요...',
    '혼수 발품 파는데 드는 시간 평균 3시간을 아껴 드렸어요!',
    '반경 3Km 내 베스트샵 3개를 찾아봤어요!',
  ];

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const messageTimer = setInterval(() => {
      setCurrentMessageIndex((prev) =>
        prev < loadingMessages.length - 1 ? prev + 1 : prev
      );
    }, 2000);

    const navigateTimer = setTimeout(() => {
      navigate('/checkout', {
        state: location.state,
      });
    }, 6000);

    return () => {
      clearInterval(messageTimer);
      clearTimeout(navigateTimer);
    };
  }, [navigate, location.state]);

  return (
    <ModernBackground>
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-8 max-w-2xl w-full"
        >
          {/* Animated Icon */}
          <div className="relative mx-auto w-32 h-32">
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />
            <div className="absolute inset-2 bg-white rounded-3xl flex items-center justify-center shadow-lg">
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-12 h-12 text-purple-600" />
              </motion.div>
            </div>
          </div>

          {/* Text Card */}
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl px-8 md:px-12 py-10 border border-white/50 shadow-2xl min-h-[220px] flex flex-col items-center justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full border border-purple-200/60 shadow-sm mb-6">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-900">
                AI 맞춤 결제 준비 중
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              고객님께 딱 맞는 구매 경로를 확인하고 있어요
            </h2>

            <div className="min-h-[56px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentMessageIndex}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.4 }}
                  className="text-lg text-gray-600 leading-relaxed text-center"
                >
                  {loadingMessages[currentMessageIndex]}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          {/* Loading dots */}
          <div className="flex gap-2 justify-center">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </ModernBackground>
  );
}