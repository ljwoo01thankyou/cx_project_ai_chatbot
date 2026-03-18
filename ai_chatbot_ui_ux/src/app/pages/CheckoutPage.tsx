import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { ModernBackground } from '../components/ModernBackground';
import { motion } from 'motion/react';
import {
  Search,
  Sparkles,
  X,
  Home,
  ChevronRight,
  CreditCard,
  Wallet,
  BadgePercent,
  CalendarDays,
  Gift,
  Store,
} from 'lucide-react';
import sellerImage from '../../assets/seller.png';

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const packageTitle = location.state?.packageTitle || 'AI 추천 패키지';
  const productCount = location.state?.productCount || 0;
  const familyType = location.state?.familyType || '';
  const purchasePurpose = location.state?.purchasePurpose || '';

  const [value, setValue] = useState('');

  const guideSubtitle =
    familyType && purchasePurpose
      ? '현명한 신혼 부부를 위한 맞춤 가전 가이드'
      : '현명한 신혼 부부를 위한 맞춤 가전 가이드';

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

  const benefitItems = useMemo(
    () => [
      {
        id: 1,
        label: '제휴카드 혜택',
        icon: CreditCard,
        title: 'LGE.COM 플러스 서비스',
        desc: '최대 100만원 조건부 할인 + 10% 캐시백',
      },
      {
        id: 2,
        label: '결제일 할인',
        icon: BadgePercent,
        title: '신용카드 7% 결제일 할인',
        desc: '신한/현대/롯데/국민/하나 카드 기준 적용 가능',
      },
      {
        id: 3,
        label: '무이자',
        icon: CalendarDays,
        title: '카드사별 무이자 할부 혜택',
        desc: '최대 12개월 무이자 가능 조건을 함께 비교해드려요',
      },
      {
        id: 4,
        label: '간편결제',
        icon: Wallet,
        title: '네이버페이 · 카카오페이 · 토스페이',
        desc: '포인트 적립 및 즉시 할인 혜택까지 한 번에 확인 가능',
      },
    ],
    []
  );

  const promoCards = useMemo(
    () => [
      {
        id: 1,
        badge: '추천 카드 혜택',
        title: '최대 100만원 할인 + 추가 캐시백',
        desc: '제휴카드와 플러스 서비스를 함께 적용하면 초기 구매 부담을 크게 줄일 수 있어요.',
        cta: 'LGE.COM 신한카드 혜택 보기',
        icon: Gift,
        bg: 'from-[#eef6ff] via-[#f7f2ff] to-[#fff0f7]',
      },
      {
        id: 2,
        badge: '다품목 구매 혜택',
        title: '2품목 이상 구매 시 패키지 혜택 강화',
        desc: '냉장고, 세탁기, 에어컨 등 함께 구매하면 묶음 할인과 사은 혜택 적용 가능성이 높아요.',
        cta: '다품목 구매 혜택 확인하기',
        icon: Store,
        bg: 'from-[#fff8ef] via-[#fff5f8] to-[#f6f2ff]',
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
              className="hidden lg:block"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-400/20 to-purple-400/20 blur-3xl rounded-full" />

                <div className="relative bg-white/72 backdrop-blur-xl rounded-[32px] p-10 border border-white/50 shadow-2xl min-h-[640px] flex flex-col">
                  <div className="mb-6">
                    <h3 className="text-4xl font-bold text-gray-900">
                      <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        지셀 상담사
                      </span>
                    </h3>
                    <p className="text-lg text-gray-600 mt-2">{guideSubtitle}</p>
                  </div>

                  <div className="relative flex-1 flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-300/20 to-purple-300/20 blur-2xl rounded-full" />
                    <img
                      src={sellerImage}
                      alt="지셀 상담사"
                      className="relative h-[420px] w-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.18)]"
                    />
                  </div>

                  {/* Fixed Speech Bubble */}
                  <div className="relative mt-6">
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-7 border border-blue-100 shadow-sm">
                      <p className="text-gray-800 leading-relaxed text-xl">
                        고객님의 선택과 조건을 기반으로
                        가장 비용 효율적인 구매 시점과 방법을 분석했어요.
                        <br />
                        지금부터 최적의 선택을 함께 확인해보실까요?
                      </p>
                    </div>
                  </div>
                </div>
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

        {/* Benefit Section */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-6xl w-full mx-auto mt-16"
        >
          <div className="bg-white/70 backdrop-blur-xl rounded-[32px] border border-white/60 shadow-2xl p-6 md:p-8">
            <div className="mb-7">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-sm font-semibold">
                <Sparkles className="w-4 h-4" />
                구매 혜택 안내
              </div>

              <h2 className="mt-4 text-2xl md:text-3xl font-bold text-gray-900">
                지금 적용 가능한 혜택을
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {' '}한눈에 정리했어요
                </span>
              </h2>

              <p className="mt-2 text-gray-600 leading-relaxed">
                결제 수단, 무이자, 간편결제, 다품목 구매 혜택까지 한 번에 비교해
                가장 유리한 구매 조합을 찾을 수 있어요.
              </p>
            </div>

            {/* Benefit List */}
            <div className="rounded-3xl border border-purple-100 overflow-hidden bg-white/70">
              {benefitItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    className={`flex items-start gap-4 px-5 md:px-6 py-5 ${
                      index !== benefitItems.length - 1
                        ? 'border-b border-purple-100'
                        : ''
                    }`}
                  >
                    <div className="hidden sm:flex w-20 shrink-0 text-sm font-semibold text-gray-500 pt-1">
                      {item.label}
                    </div>

                    <div className="w-11 h-11 shrink-0 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-purple-600" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="sm:hidden text-xs font-semibold text-gray-500 mb-1">
                        {item.label}
                      </div>
                      <p className="text-gray-900 font-semibold text-base md:text-lg">
                        {item.title}
                      </p>
                      <p className="text-gray-600 mt-1 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>

                    <button className="shrink-0 w-10 h-10 rounded-full bg-purple-50 hover:bg-purple-100 transition flex items-center justify-center">
                      <ChevronRight className="w-5 h-5 text-purple-500" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Promo Cards */}
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              {promoCards.map((card, index) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.28 + index * 0.1 }}
                    className={`relative overflow-hidden rounded-[28px] border border-white/70 bg-gradient-to-br ${card.bg} p-6 md:p-7 shadow-lg`}
                  >
                    <div className="absolute right-[-18px] bottom-[-18px] w-28 h-28 rounded-full bg-white/40 blur-2xl" />

                    <div className="relative flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/80 text-xs font-semibold text-purple-700 mb-4">
                          {card.badge}
                        </div>

                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 leading-snug">
                          {card.title}
                        </h3>

                        <p className="mt-3 text-gray-700 leading-relaxed">
                          {card.desc}
                        </p>

                        <button className="mt-5 inline-flex items-center gap-2 text-base font-semibold text-gray-900 hover:text-purple-600 transition">
                          {card.cta}
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="w-14 h-14 shrink-0 rounded-2xl bg-white/80 flex items-center justify-center shadow-sm">
                        <Icon className="w-7 h-7 text-purple-600" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.section>
      </div>
    </ModernBackground>
  );
}