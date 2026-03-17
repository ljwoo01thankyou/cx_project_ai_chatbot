import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { ModernBackground } from '../components/ModernBackground';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Send,
  MessageCircle,
  User,
  Bot,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import sellerImage from '../../assets/seller.png';

// 제품 이미지 import
import fridgeImg from '../../assets/categories/냉장고.jpg';
import tvImg from '../../assets/categories/AI 가전.jpg';
import airconImg from '../../assets/categories/에어컨.jpg';
import OvenImg from '../../assets/categories/오븐.avif';
import humidifierImg from '../../assets/categories/가습기.jpg';
import microwaveImg from '../../assets/categories/광파오븐.png';
import StyleImg from '../../assets/categories/스타일러.jpg';

type ProductRating = Record<string, number>;

type ProductItem = {
  id: string;
  name: string;
  subtitle: string;
  image: string;
  ratings: ProductRating;
  badge?: string;
};

type PackageRow = {
  id: string;
  title: string;
  summary: string;
  items: ProductItem[];
};

type ChatMessage = {
  id: number;
  role: 'user' | 'assistant';
  text: string;
};

const packages: PackageRow[] = [
  {
    id: 'package-01',
    title: 'AI 추천 패키지 01',
    summary: '설정하신 예산과 라이프스타일에 맞춘 최적의 조합',
    items: [
      {
        id: 'p1',
        name: 'LG 디오스 오브제컬렉션 냉장고 Fit & Max',
        subtitle: '1도어 / 2도어',
        image: fridgeImg,
        ratings: {
          인테리어: 5.0,
          빌트인핏: 4.7,
          수납활용: 3.9,
        },
      },
      {
        id: 'p2',
        name: 'LG 올레드 HD TV AI',
        subtitle: '125cm',
        image: tvImg,
        ratings: {
          화면선명도: 5.0,
          음질: 4.7,
          AI추천: 3.9,
        },
      },
      {
        id: 'p3',
        name: 'LG 휘센 오브제컬렉션 타워 에어컨',
        subtitle: '스탠드형 / 56.4㎡',
        image: airconImg,
        ratings: {
          전력효율: 5.0,
          냉방: 4.7,
          자동모드: 3.9,
        },
      },
      {
        id: 'p4',
        name: 'LG 디오스 오브제컬렉션 전자레인지',
        subtitle: '25L',
        image: microwaveImg,
        ratings: {
          디자인: 5.0,
          조리속도: 4.7,
          사용편의: 3.9,
        },
        badge: '베스트',
      },
      {
        id: 'p5',
        name: 'LG 스타일러 오브제컬렉션',
        subtitle: '색상에센스화이트',
        image: StyleImg,
        ratings: {
          디자인: 4.2,
          소음: 3.8,
          사용편의: 5.0,
        },
      },
    ],
  },
  {
    id: 'package-02',
    title: 'AI 추천 패키지 02',
    summary: '조금 더 프리미엄한 대안 구성',
    items: [
      {
        id: 'p5',
        name: 'LG 퓨리케어 오브제컬렉션 하이드로타워',
        subtitle: '가습기',
        image: humidifierImg,
        ratings: {
          전력효율: 5.0,
          모드다양성: 4.7,
          디자인: 3.9,
        },
        badge: '베스트',
      },
      {
        id: 'p6',
        name: 'LG 휘센 오브제컬렉션 타워 에어컨',
        subtitle: '스탠드형 / 56.4㎡',
        image: airconImg,
        ratings: {
          빌트인핏: 5.0,
          자동모드: 4.7,
          전력효율: 3.9,
        },
      },
      {
        id: 'p7',
        name: 'LG 디오스 오브제컬렉션 냉장고 Fit & Max',
        subtitle: '1도어 / 2도어',
        image: fridgeImg,
        ratings: {
          인테리어: 5.0,
          빌트인핏: 4.7,
          수납활용: 3.9,
        },
      },
      {
        id: 'p8',
        name: 'LG 올레드 HD TV AI',
        subtitle: '125cm',
        image: tvImg,
        ratings: {
          화면선명도: 5.0,
          음질: 4.7,
          AI추천: 3.9,
        },
      },
      {
        id: 'p5',
        name: 'LG 디오스 오브제컬렉션 광파오븐',
        subtitle: '32L',
        image: OvenImg,
        ratings: {
          디자인: 5.0,
          조리속도: 3.8,
          사용편의: 4.1,
        },
      },
    ],
  },
];

export default function ProductsPage() {
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState<string | null>('package-01');
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      role: 'assistant',
      text: '안녕하세요, 지셀 상담사입니다. 패키지 구성이나 혜택에 대해 편하게 문의해주세요.',
    },
  ]);

  const selectedPackageInfo = useMemo(
    () => packages.find((pkg) => pkg.id === selectedPackage) ?? null,
    [selectedPackage]
  );

  const handleSelectPackage = (packageId: string) => {
    setSelectedPackage(packageId);
  };

  const handleProceedCheckout = () => {
    if (!selectedPackageInfo) return;
    navigate('/loading-checkout', {
      state: {
        packageId: selectedPackageInfo.id,
        packageTitle: selectedPackageInfo.title,
        productCount: selectedPackageInfo.items.length,
      },
    });
  };

  const handleResetRecommend = () => {
    setSelectedPackage('package-01');
  };

  const handleSendMessage = () => {
    const trimmed = chatInput.trim();
    if (!trimmed || isTyping) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      role: 'user',
      text: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setChatInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          text: '지셀 상담사가 열심히 답변하는 중입니다...',
        },
      ]);
    }, 900);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <ModernBackground>
      <div className="min-h-screen py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full border border-purple-200/60 shadow-sm mb-6">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-900">
                AI 맞춤 추천 완료
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
              고객님을 위한 맞춤 패키지
            </h1>
            <p className="text-lg md:text-xl text-gray-600">
              답변 내용을 바탕으로 선별한 최적의 제품 조합입니다
            </p>
          </motion.div>

          {/* Recommendation Intro */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <p className="text-2xl md:text-3xl font-bold text-gray-700 leading-snug">
                  설정하신 예산 내에서 라이프스타일에 맞춘
                  <br />
                  최적의 가전 패키지를 추천해 드릴게요.
                </p>
              </div>

              <button
                type="button"
                onClick={handleResetRecommend}
                className="self-start inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-300 bg-white/70 backdrop-blur-sm rounded-full border border-purple-200/60 shadow-sm hover:bg-gray-50 transition"
              >
                <RotateCcw className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-900">
                다시 추천
                </span>
              </button>
            </div>
          </motion.div>

          {/* Horizontal Package Rows */}
          <div className="space-y-8 mb-12">
            {packages.map((pkg, rowIndex) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: rowIndex * 0.08 }}
                className="flex gap-4"
              >

                <div className="w-[110px] md:w-[120px] shrink-0 rounded-[24px] bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 flex items-center justify-center text-center px-3 py-6 shadow-sm">
                  <div>
                    <p className="text-lg font-bold leading-tight">
                      <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        AI 추천
                      </span>
                    </p>
                    <p className="text-lg font-bold leading-tight">
                      <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        패키지 {String(rowIndex + 1).padStart(2, '0')}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Scroll Cards */}
                <div className="flex-1 overflow-x-auto pb-2">
                  <div className="flex gap-4 min-w-max">
                    {pkg.items.map((item) => (
                      <motion.button
                        key={item.id}
                        type="button"
                        whileHover={{ y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSelectPackage(pkg.id)}
                        className={`relative w-[220px] md:w-[250px] bg-white rounded-[22px] border shadow-sm hover:shadow-lg transition-all overflow-hidden text-left ${
                          selectedPackage === pkg.id
                            ? 'border-pink-400 ring-2 ring-pink-200'
                            : 'border-gray-200'
                        }`}
                      >
                        {item.badge && (
                          <div className="absolute top-3 left-3 z-10">
                            <span className="px-2 py-1 text-[10px] font-bold rounded-md bg-red-500 text-white">
                              {item.badge}
                            </span>
                          </div>
                        )}

                        <div className="h-[170px] bg-gray-50 flex items-center justify-center p-4 border-b border-gray-100">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>

                        <div className="p-4">
                          <h4 className="text-sm font-bold text-gray-900 leading-snug min-h-[40px] line-clamp-2">
                            {item.name}
                          </h4>

                          <p className="text-[11px] text-gray-500 mt-1 mb-3">
                            {item.subtitle}
                          </p>

                          <p className="text-[11px] font-semibold text-gray-700 mb-3">
                            사용자들은 <span className="text-red-500">이런 점</span>에
                            만족했어요
                          </p>

                          <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-[11px]">
                            {Object.entries(item.ratings).map(([label, value]) => (
                              <div
                                key={label}
                                className="flex items-center justify-between gap-2 text-gray-600"
                              >
                                <span>{label}</span>
                                <span className="flex items-center gap-1 text-blue-500 font-bold">
                                  <span className="text-[12px]">★</span>
                                  <span>{value}</span>
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Selected Package Summary */}
          <AnimatePresence>
            {selectedPackageInfo && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                className="mt-2 mb-8 bg-white/60 backdrop-blur-xl rounded-3xl border border-white/60 shadow-xl p-6 md:p-8"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                  <div>
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-semibold mb-3">
                      현재 선택한 패키지
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {selectedPackageInfo.title}
                    </h3>
                    <p className="text-gray-600">
                      {selectedPackageInfo.items.length}개 제품 구성 · 추천 기반 맞춤 패키지
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleProceedCheckout}
                    className="px-6 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all inline-flex items-center justify-center gap-2"
                  >
                    이 구성으로 진행하기
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chat Section */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="bg-white/60 backdrop-blur-xl rounded-[32px] border border-white/60 shadow-2xl overflow-hidden"
          >
            <div className="grid lg:grid-cols-[320px_1fr]">
              {/* Left Profile */}
              <div className="p-8 border-b lg:border-b-0 lg:border-r border-gray-200/70 bg-gradient-to-br from-purple-50/80 to-pink-50/70">
                <div className="flex flex-col items-center text-center">
                  <div className="w-36 h-36 rounded-[28px] overflow-hidden bg-white shadow-lg border border-white/70 mb-5">
                    <img
                      src={sellerImage}
                      alt="지셀 상담사"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-purple-200 text-purple-700 text-xs font-semibold mb-3">
                    <MessageCircle className="w-3.5 h-3.5" />
                    실시간 상담 연결
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    지셀 상담사
                  </h3>
                  <p className="text-sm text-gray-600 mb-5">
                    프리미엄 가전 전문 상담
                  </p>

                  <div className="w-full rounded-2xl bg-white/70 border border-white/80 p-4 text-left shadow-sm">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      패키지 구성, 예산, 설치 일정, 혜택 관련 내용을 자유롭게
                      물어보세요. 상담사가 확인 후 안내해드립니다.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Chat */}
              <div className="flex flex-col min-h-[520px]">
                <div className="px-6 py-5 border-b border-gray-200/70 bg-white/40">
                  <h4 className="text-xl font-bold text-gray-900">
                    지셀 상담사와 채팅 상담
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    문의를 남기면 상담 진행 상태를 안내해드립니다.
                  </p>
                </div>

                <div className="flex-1 px-6 py-6 space-y-4 overflow-y-auto bg-white/20">
                  <AnimatePresence>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`flex ${
                          message.role === 'user'
                            ? 'justify-end'
                            : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
                            message.role === 'user'
                              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                              : 'bg-white text-gray-800 border border-gray-200'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <div className="mt-0.5">
                              {message.role === 'user' ? (
                                <User className="w-4 h-4" />
                              ) : (
                                <Bot className="w-4 h-4 text-purple-600" />
                              )}
                            </div>
                            <p className="text-sm leading-relaxed">
                              {message.text}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-white text-gray-700 border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                        <div className="flex items-center gap-2">
                          <Bot className="w-4 h-4 text-purple-600" />
                          <span className="text-sm">
                            지셀 상담사가 입력 중입니다...
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                <div className="p-5 border-t border-gray-200/70 bg-white/45">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="패키지 구성이나 혜택에 대해 문의해보세요"
                      className="flex-1 h-14 rounded-2xl border border-gray-200 bg-white/90 px-4 text-gray-800 outline-none focus:ring-2 focus:ring-purple-300"
                    />
                    <button
                      type="button"
                      onClick={handleSendMessage}
                      disabled={!chatInput.trim() || isTyping}
                      className="h-14 px-5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      전송
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 mb-8 bg-white/55 backdrop-blur-xl rounded-3xl border border-white/60 shadow-xl p-6 md:p-8"
          >
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  무료 배송
                </div>
                <div className="text-sm text-gray-600">전국 어디서나</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  24시간
                </div>
                <div className="text-sm text-gray-600">긴급 A/S 대응</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  0원
                </div>
                <div className="text-sm text-gray-600">설치비용</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </ModernBackground>
  );
}