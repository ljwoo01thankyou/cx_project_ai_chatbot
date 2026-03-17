import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { ModernBackground } from '../components/ModernBackground';
import { motion } from 'motion/react';
import { Search, Sparkles, X, Home } from 'lucide-react';
import assistantImage from '../../assets/guide.png';

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const packageTitle = location.state?.packageTitle || 'AI 추천 패키지';
  const productCount = location.state?.productCount || 0;

  const [value, setValue] = useState('');

  const recommendationCards = useMemo(
    () => [
      {
        id: 1,
        title: '가장 저렴한 온라인 구매 시점',
        description:
          '3월 15일 lge.com에서 신한카드로 결제하시면 가장 저렴해요!\n3월 15일에 카카오톡 알림 보내드릴까요?',
      },
      {
        id: 2,
        title: '가장 유리한 오프라인 구매 방식',
        description:
          '4월 8일 LG 베스트샵 홍대입구 지점에서 사시면 가장 저렴해요!\n4월 8일 방문 예약 도와드릴까요?',
      },
    ],
    []
  );

  return (
    <ModernBackground>
      <div className="min-h-screen flex flex-col px-4 py-8 relative">
        {/* Top Right Close Button */}
        <div className="absolute top-6 right-6 z-20">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-md border border-purple-100 shadow-sm text-gray-700 hover:bg-white transition"
          >
            <X className="w-4 h-4 text-pink-500" />
            <span className="text-sm font-medium">종료</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-12 items-center">
            {/* Assistant Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden lg:flex justify-center"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-3xl rounded-full" />
                <img
                  src={assistantImage}
                  alt="guide"
                  className="relative w-80 h-80 object-contain drop-shadow-2xl"
                />
              </div>
            </motion.div>

            {/* Right Content */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 w-full"
            >
              {/* Main Title */}
              <div className="space-y-3">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                  가장{' '}
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    합리적
                  </span>{' '}
                  으로
                  <br />
                  구매할 수 있는 방법이에요!
                </h1>

                <p className="text-gray-600 text-lg leading-relaxed">
                  {packageTitle}
                  {productCount ? ` · ${productCount}개 제품 구성` : ''} 기준으로
                  온라인/오프라인 구매 조건을 비교해 추천드렸어요.
                </p>
              </div>

              {/* Recommendation Cards */}
              <div className="space-y-4 pt-2">
                {recommendationCards.map((card, index) => (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.12 }}
                    className="bg-purple-50/80 backdrop-blur-xl rounded-3xl px-6 py-6 border border-purple-100 shadow-sm"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 shrink-0 rounded-2xl bg-white flex items-center justify-center shadow-sm border border-purple-100">
                        <Sparkles className="w-5 h-5 text-purple-500" />
                      </div>

                      <div className="flex-1">
                        <p className="text-sm font-semibold text-purple-500 mb-2">
                          {card.title}
                        </p>
                        <p className="text-gray-800 text-lg leading-relaxed whitespace-pre-line">
                          {card.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Search/Input */}
              <div className="w-full max-w-2xl pt-4">
                <div className="p-[1.5px] rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
                  <div className="flex items-center bg-white rounded-full px-4 py-3">
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      placeholder="가전을 구매할 때 힘든 점을 입력해 주세요."
                      className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
                    />
                    <button type="button" className="ml-2">
                      <Search className="w-4 h-4 text-pink-500" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Small guide text */}
              <div className="text-sm text-gray-500 pt-1">
                추가로 원하는 구매 방식이나 방문 희망 매장을 입력해주시면 더 맞춰드릴 수 있어요.
              </div>

              {/* Bottom Action Button */}
              <div className="pt-4">
                <button
                  onClick={() => navigate('/')}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-md hover:opacity-90 transition"
                >
                  <Home className="w-4 h-4" />
                  홈으로 돌아가기
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </ModernBackground>
  );
}