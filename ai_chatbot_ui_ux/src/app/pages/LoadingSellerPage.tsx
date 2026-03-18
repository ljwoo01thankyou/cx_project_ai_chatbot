import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { ModernBackground } from '../components/ModernBackground';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

export default function LoadingSellerPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const familyType = location.state?.familyType || '';
  const purchasePurpose = location.state?.purchasePurpose || '';

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/seller', {
        state: {
          familyType,
          purchasePurpose,
        },
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <ModernBackground>
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-8 max-w-2xl"
        >
          {/* Animated Icon */}
          <div className="relative mx-auto w-32 h-32">
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            <div className="absolute inset-2 bg-white rounded-3xl flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-12 h-12 text-purple-600" />
              </motion.div>
            </div>
          </div>

          {/* Text */}
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl px-12 py-10 border border-white/50 shadow-2xl">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              전담 상담사 연결 중...
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              고객님께 최적의 상담사를 매칭하고 있습니다
            </p>
          </div>

          {/* Loading dots */}
          <div className="flex gap-2 justify-center">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </ModernBackground>
  );
}