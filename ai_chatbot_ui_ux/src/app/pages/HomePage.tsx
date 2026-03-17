import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ModernBackground } from '../components/ModernBackground';
import { motion } from 'motion/react';
import {
  Sparkles,
  ShoppingCart,
  Wrench,
  MoreHorizontal,
  Search,
} from 'lucide-react';
import assistantImage from '../../assets/guide.png';

export default function HomePage() {
  const navigate = useNavigate();
  const [value, setValue] = useState('');

  return (
    <ModernBackground>
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-8 left-8"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">LG</span>
            </div>
            <span className="text-xl font-semibold text-gray-800">전자 AI Chat</span>
          </div>
        </motion.div>

        <div className="max-w-5xl w-full flex flex-col lg:flex-row items-center gap-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="flex-shrink-0"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-pink-500/30 blur-3xl rounded-full" />
              <img
                src={assistantImage}
                alt="AI 쇼핑 도우미"
                className="relative w-96 h-96 object-contain drop-shadow-2xl"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex-1 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-purple-200/50 shadow-sm">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-900">AI 기반 맞춤 추천</span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              고객님,안녕하세요!
              <br />
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                LG AI 챗봇
              </span>
              입니다.
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed">
              어떤 도움이 필요하신가요?
              <br />
              다음 중 도움이 필요하신 영역을 선택해 주세요.
            </p>

            <div className="grid grid-cols-3 gap-4 mt-6">
              <motion.button
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/questions')}
                className="flex flex-col items-center justify-center gap-3 w-32 h-32 bg-white rounded-3xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 shadow-md">
                  <ShoppingCart className="w-6 h-6 text-white" strokeWidth={2.2} />
                </div>
                <span className="font-semibold text-base bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                  가전구매
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 1 }}
                disabled
                className="flex flex-col items-center justify-center gap-3 w-32 h-32 bg-white rounded-3xl border border-gray-100 shadow-md cursor-not-allowed transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 shadow-md">
                  <Wrench className="w-6 h-6 text-white" strokeWidth={2.2} />
                </div>
                <span className="font-semibold text-base bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                  A/S 문의
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 1 }}
                disabled
                className="flex flex-col items-center justify-center gap-3 w-32 h-32 bg-white rounded-3xl border border-gray-100 shadow-md cursor-not-allowed transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 shadow-md">
                  <MoreHorizontal className="w-6 h-6 text-white" strokeWidth={2.2} />
                </div>
                <span className="font-semibold text-base bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                  기타 문의
                </span>
              </motion.button>
            </div>

            <div className="w-full max-w-xl pt-2">
              <div className="p-[1.5px] rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
                <div className="flex items-center bg-white rounded-full px-4 py-3">
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="도움이 필요한 서비스를 입력해 주세요."
                    className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
                  />
                  <div className="ml-2">
                    <Search className="w-4 h-4 text-pink-500" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </ModernBackground>
  );
}