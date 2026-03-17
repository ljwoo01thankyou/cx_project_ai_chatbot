import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ModernBackground } from '../components/ModernBackground';
import { motion, AnimatePresence } from 'motion/react';
import { Search } from 'lucide-react';
import assistantImage from '../../assets/guide.png';

const questions = [
  {
    id: 1,
    text: (
      <>
        <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          가전 구매
        </span>
        를 원하시는군요!
        <br />
        가전 구매 시의 고민을 알려주세요.
      </>
    ),
    subtext: (
      <>
        가전을 구매할 때 힘들거나 어려운 점을 선택해 주세요.
        <br />
        복수 선택이 가능합니다.
      </>
    ),
    options: [
      '가전 종류가 많아 모델별 성능 차이 파악이 어려워요.',
      '온/오프라인 구매 조건 비교가 힘들어요.',
      '배송, A/S 등 사후 서비스 품질이 걱정돼요.',
      '기타 고민이 있어요.',
    ],
    inputPlaceholder: '가전을 구매할 때 힘든 점을 입력해 주세요.',
  },
  {
    id: 2,
    text: '가족 구성은 어떻게 되시나요?',
    subtext: '가구 유형을 알려주세요',
    options: ['1인 가구', '2인 가구', '3인 가구', '4인 이상 가구'],
    inputPlaceholder: '선택지에 없다면, 현재 집에 몇 명이 함께 살고 있는지 입력해 주세요.',
  },
  {
    id: 3,
    text: '구매 목적이 무엇인가요?',
    subtext: '해당하는 항목을 선택해주세요',
    options: ['결혼·혼수', '자취·독립', '이사', '교체'],
    inputPlaceholder: '선택지에 없다면, 가전을 구매하는 이유를 입력해 주세요.',
  },
];

export default function QuestionsPage() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [value, setValue] = useState('');
  const [messages, setMessages] = useState<string[]>([]);

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 300);
    } else {
      setTimeout(() => {
        navigate('/loading-seller');
      }, 500);
    }
  };

  const handleSubmitMessage = () => {
    if (!value.trim()) return;
    setMessages((prev) => [...prev, value.trim()]);
    setValue('');
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <ModernBackground>
      <div className="min-h-screen flex flex-col px-4 py-8">
        {/* Header with progress */}
        <div className="max-w-4xl mx-auto w-full mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-medium text-gray-500">
              질문 {currentQuestion + 1} / {questions.length}
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
          <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-12 items-center">
            {/* Assistant */}
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

            {/* Questions */}
            <div className="space-y-6 w-full">
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
                    <h2 className="text-3xl font-bold text-gray-900 mb-3 leading-snug">
                      {questions[currentQuestion].text}
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                      {questions[currentQuestion].subtext}
                    </p>
                  </div>

                  {/* Answer Options */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    {questions[currentQuestion].options.map((option, index) => (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAnswer(option)}
                        className="group relative bg-white/40 backdrop-blur-sm hover:bg-white/80 px-5 py-5 min-h-[96px] rounded-2xl border border-gray-200/50 hover:border-purple-300 transition-all shadow-lg hover:shadow-xl text-left"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 group-hover:from-purple-200 group-hover:to-pink-200 flex items-center justify-center transition-colors">
                            <span className="text-2xl font-bold text-purple-600">
                              {index + 1}
                            </span>
                          </div>

                          <span className="text-[15px] md:text-base font-medium text-gray-800 leading-relaxed break-words whitespace-normal">
                            {option}
                          </span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Previous Answers */}
              {answers.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {answers.slice(0, currentQuestion).map((answer, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="px-4 py-2 bg-purple-100/50 backdrop-blur-sm text-purple-700 rounded-full text-sm border border-purple-200/50"
                    >
                      {answer}
                    </motion.div>
                  ))}
                </div>
              )}

              <div className="w-full max-w-xl pt-2">
                <div className="p-[1.5px] rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
                  <div className="flex items-center bg-white rounded-full px-4 py-3">
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      placeholder={questions[currentQuestion].inputPlaceholder}
                      className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
                    />
                    <button
                      onClick={handleSubmitMessage}
                      className="ml-2"
                      type="button"
                    >
                      <Search className="w-4 h-4 text-pink-500" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModernBackground>
  );
}