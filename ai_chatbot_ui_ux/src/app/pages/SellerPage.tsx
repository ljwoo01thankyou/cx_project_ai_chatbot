import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { ModernBackground } from '../components/ModernBackground';
import { motion, AnimatePresence } from 'motion/react';
import sellerImage from '../../assets/seller.png';


// 카테고리 이미지 import
import p1Img from '../../assets/categories/TV.avif';
import p2Img from '../../assets/categories/가습기.jpg';
import p3Img from '../../assets/categories/냉장고.jpg';
import p4Img from '../../assets/categories/스타일러.jpg';
import p5Img from '../../assets/categories/에어컨.avif';
import p6Img from '../../assets/categories/오디오.jpg';
import p7Img from '../../assets/categories/오븐.avif';
import p8Img from '../../assets/categories/정수기.avif';

type OptionItem = {
  label: string;
  image?: string;
};

type QuestionItem = {
  id: number;
  text: string;
  subtext: string;
  options?: OptionItem[];
  multiSelect?: boolean;
  type?: 'select' | 'input';
  inputPlaceholder?: string;
};

const sellerQuestions: QuestionItem[] = [
  {
    id: 1,
    text: '어떤 가전 제품이 필요하신가요?',
    subtext: '관심 있는 카테고리를 모두 선택해주세요',
    type: 'select',
    options: [
      { label: 'TV', image: p1Img },
      { label: '가습기', image: p2Img },
      { label: '냉장고', image: p3Img },
      { label: '스타일러', image: p4Img },
      { label: '에어컨', image: p5Img },
      { label: '오디오', image: p6Img },
      { label: '오븐', image: p7Img },
      { label: '정수기', image: p8Img }
    ],
    multiSelect: true,
  },
  {
    id: 2,
    text: '예산은 어느 정도 생각하고 계신가요?',
    subtext: '숫자만 입력해주세요',
    type: 'input',
    inputPlaceholder: '예: 500',
  },
];

export default function SellerPage() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[][]>([]);
  const [showGreeting, setShowGreeting] = useState(true);
  const [budgetInput, setBudgetInput] = useState('');

  const currentQuestionData = sellerQuestions[currentQuestion];
  const selectedOptions = answers[currentQuestion] || [];
  const selectedCategories = answers[0] || [];
  const savedBudget = answers[1]?.[0] || budgetInput;
  const location = useLocation();

  const familyType = location.state?.familyType || '';
  const purchasePurpose = location.state?.purchasePurpose || '';

  const guideSubtitle =
  familyType && purchasePurpose
    ? `현명한 신혼 부부를 위한 맞춤 가전 가이드`
    : '현명한 신혼 부부를 위한 맞춤 가전 가이드';

  const handleOptionClick = (option: string) => {
    if (currentQuestionData.type !== 'select') return;

    const currentAnswers = answers[currentQuestion] || [];
    let updated: string[] = [];

    if (currentQuestionData.multiSelect) {
      if (currentAnswers.includes(option)) {
        updated = currentAnswers.filter((a) => a !== option);
      } else {
        updated = [...currentAnswers, option];
      }
    } else {
      updated = [option];
    }

    const newAnswers = [...answers];
    newAnswers[currentQuestion] = updated;
    setAnswers(newAnswers);
  };

  const handleBudgetChange = (value: string) => {
    // 숫자만 입력 가능
    const onlyNumbers = value.replace(/[^0-9]/g, '');
    setBudgetInput(onlyNumbers);
  };

  const handleNext = () => {
    if (currentQuestionData.type === 'input') {
      if (!budgetInput.trim()) return;

      const newAnswers = [...answers];
      newAnswers[currentQuestion] = [budgetInput];
      setAnswers(newAnswers);

      setShowGreeting(false);

      setTimeout(() => {
        navigate('/loading-products');
      }, 500);

      return;
    }

    if (selectedOptions.length === 0) return;

    setShowGreeting(false);

    if (currentQuestion < sellerQuestions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
        setShowGreeting(true);
      }, 300);
    } else {
      setTimeout(() => {
        navigate('/loading-products');
      }, 500);
    }
  };

  const isNextDisabled =
    currentQuestionData.type === 'input'
      ? budgetInput.trim().length === 0
      : selectedOptions.length === 0;

  const progress = ((currentQuestion + 1) / sellerQuestions.length) * 100;

  return (
    <ModernBackground>
      <div className="min-h-screen flex flex-col px-4 py-8">
        {/* Header */}
        <div className="max-w-5xl mx-auto w-full mb-10">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-medium text-gray-500">
              추가 질문 {currentQuestion + 1} / {sellerQuestions.length}
            </div>
            <div className="text-sm font-medium text-purple-600">
              {Math.round(progress)}%
            </div>
          </div>

          <div className="h-2 bg-white/60 backdrop-blur-sm rounded-full overflow-hidden border border-gray-200/50">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-10 items-center">
            {/* Seller Guide */}
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
                    <p className="text-lg text-gray-600 mt-2">
                      {guideSubtitle}
                    </p>
                  </div>

                  <div className="relative flex-1 flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-300/20 to-purple-300/20 blur-2xl rounded-full" />
                    <img
                      src={sellerImage}
                      alt="지셀 상담사"
                      className="relative h-[420px] w-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.18)]"
                    />
                  </div>

                  <AnimatePresence mode="wait">
                    {showGreeting && (
                      <motion.div
                        key={currentQuestion}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-7 border border-blue-100 shadow-sm"
                      >
                        <p className="text-gray-800 leading-relaxed text-xl">
                          {currentQuestion === 0 ? (
                            <>
                              안녕하세요! 맞춤 가전 상담사 지셀입니다. <br />
                              고객님에게 맞는 최적의 제품을 찾아드리겠습니다. <br />
                              관심 있는 제품군을 편하게 골라주세요 😊
                            </>
                          ) : (
                            <>
                              좋아요!{' '}
                              {selectedCategories.length > 0
                                ? `${selectedCategories.join(', ')}`
                                : '선택하신 제품'}
                              에 관심 있으시군요. <br />
                              예산은 <span className="font-bold text-purple-700">
                                ({budgetInput || ' '})
                              </span> 만원으로 고려해서 <br />
                              고객님께 맞는 제품 조합을 추천해드릴게요.
                            </>
                          )}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

            {/* Questions */}
            <div className="space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestion}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  {/* Question Card */}
                  <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-xl">
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">
                      {currentQuestionData.text}
                    </h2>
                    <p className="text-gray-600">
                      {currentQuestionData.subtext}
                    </p>

                    <div className="mt-4">
                      <span className="inline-flex items-center rounded-full bg-purple-100 text-purple-700 text-sm font-medium px-3 py-1">
                        {currentQuestionData.type === 'input'
                          ? '숫자 입력'
                          : currentQuestionData.multiSelect
                          ? '중복 선택 가능'
                          : '하나만 선택'}
                      </span>
                    </div>
                  </div>

                  {/* Answer Area */}
                  {currentQuestionData.type === 'select' ? (
                    <div
                      className={`
                        pr-2 overflow-y-auto
                        ${currentQuestion === 0 ? 'max-h-[520px]' : 'max-h-[360px]'}
                      `}
                    >
                      <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
                        {currentQuestionData.options?.map((option, index) => {
                          const isSelected = selectedOptions.includes(option.label);

                          return (
                            <motion.button
                              key={option.label}
                              type="button"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              whileHover={{ scale: 1.02, y: -2 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleOptionClick(option.label)}
                              className={`group relative overflow-hidden rounded-2xl border transition-all shadow-lg hover:shadow-xl text-left backdrop-blur-sm ${
                                isSelected
                                  ? 'bg-blue-100/90 border-blue-400 ring-2 ring-blue-200'
                                  : 'bg-white/40 border-gray-200/50 hover:bg-white/80 hover:border-blue-300'
                              }`}
                            >
                              {option.image ? (
                                <div className="relative h-32 sm:h-36">
                                  <img
                                    src={option.image}
                                    alt={option.label}
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute inset-0 bg-black/25" />
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-white text-xl font-bold drop-shadow-md">
                                      {option.label}
                                    </span>
                                  </div>

                                  {isSelected && (
                                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center font-bold shadow">
                                      ✓
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="p-6 flex items-center gap-4">
                                  <div
                                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                                      isSelected
                                        ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white'
                                        : 'bg-gradient-to-br from-blue-100 to-purple-100 group-hover:from-blue-200 group-hover:to-purple-200'
                                    }`}
                                  >
                                    <span className="text-2xl font-bold">
                                      {currentQuestionData.multiSelect
                                        ? isSelected
                                          ? '✓'
                                          : index + 1
                                        : index + 1}
                                    </span>
                                  </div>

                                  <span
                                    className={`text-lg font-medium ${
                                      isSelected ? 'text-blue-900' : 'text-gray-800'
                                    }`}
                                  >
                                    {option.label}
                                  </span>
                                </div>
                              )}
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 border border-white/50 shadow-xl">
                      <div className="flex items-end gap-3">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            예산 입력
                          </label>
                          <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={budgetInput}
                            onChange={(e) => handleBudgetChange(e.target.value)}
                            placeholder={currentQuestionData.inputPlaceholder}
                            className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-4 text-lg outline-none focus:ring-2 focus:ring-pink-300"
                          />
                        </div>

                        <div className="shrink-0 rounded-2xl bg-purple-50 text-purple-700 px-5 py-4 font-semibold border border-purple-100">
                          만원
                        </div>
                      </div>

                      <p className="mt-3 text-sm text-gray-500">
                        숫자만 입력 가능합니다. 예: 500
                      </p>

                      {budgetInput && (
                        <div className="mt-4 rounded-2xl bg-purple-50 border border-purple-100 px-4 py-3 text-purple-800">
                          입력받은 값: <span className="font-bold">{budgetInput}</span> 만원
                        </div>
                      )}
                    </div>
                  )}

                  {/* Next Button */}
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={isNextDisabled}
                    className="w-full mt-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {currentQuestion < sellerQuestions.length - 1 ? '다음 질문' : '추천 받기'}
                  </button>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </ModernBackground>
  );
}