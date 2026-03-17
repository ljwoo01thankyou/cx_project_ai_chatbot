import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ModernBackground } from '../components/ModernBackground';
import { motion } from 'motion/react';
import { Search, Sparkles, Package } from 'lucide-react';

export default function LoadingProductsPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/products');
    }, 3000);

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
          <div className="relative mx-auto w-40 h-40">
            <motion.div
              className="absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-purple-500 rounded-full" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-pink-500 rounded-full" />
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-orange-500 rounded-full" />
            </motion.div>
            
            <div className="absolute inset-4 bg-white rounded-3xl shadow-2xl flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Package className="w-16 h-16 text-purple-600" />
              </motion.div>
            </div>
          </div>

          {/* Text */}
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl px-12 py-10 border border-white/50 shadow-2xl">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              맞춤 패키지 분석 중
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              고객님의 답변을 바탕으로
              <br />
              최적의 제품 조합을 찾고 있습니다
            </p>
          </div>

          {/* Progress Steps */}
          <div className="space-y-3">
            {[
              { icon: Sparkles, text: '사용자 정보 분석 완료', delay: 0 },
              { icon: Search, text: '제품 카테고리 매칭 중', delay: 0.5 },
              { icon: Package, text: '최적 패키지 구성 중', delay: 1 },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: step.delay }}
                className="bg-white/60 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/50 shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center"
                  >
                    <step.icon className="w-5 h-5 text-purple-600" />
                  </motion.div>
                  <span className="text-gray-700 font-medium">{step.text}</span>
                  <motion.div
                    className="ml-auto"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </ModernBackground>
  );
}