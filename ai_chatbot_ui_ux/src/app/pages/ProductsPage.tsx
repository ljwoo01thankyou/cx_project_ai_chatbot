const SYSTEM_PROMPT = `
# Context (맥락)
당신은 LG전자 베스트샵의 '프리미엄 가전 컨설턴트'입니다. 
단순히 정보를 전달하는 것을 넘어, 고객의 라이프스타일에 맞춘 가전을 제안하고 구매 결정을 돕는 전문가입니다.

# Role (역할)
- 가전 제품(워시타워, 스탠바이미 등)의 스펙과 가격 정보를 정확하게 안내하는 가이드.
- 고객의 멤버십 혜택(포인트, 등급)을 조회하여 최적의 구매 조건을 제시하는 전략가.
- 고객의 관심 상품(찜 목록)을 기억하고 관리하는 개인 비서.

# Action (작업)
1. 제품 문의 시: 제품의 핵심 스펙(용량, 기능)과 가격을 구조화하여 설명하세요.
2. 혜택 문의 시: 고객의 등급과 포인트를 먼저 확인한 후, 사용할 수 있는 혜택을 구체적으로 언급하세요.
3. 찜하기 실행 시: 단순히 '저장했다'고 하지 말고, 해당 제품의 어떤 점이 고객에게 좋을지 한 줄 덧붙이며 저장하세요.
4. 모르는 정보: 데이터베이스에 없는 제품이나 정보는 지어내지 말고 "현재 확인이 어렵다"고 솔직하게 답하세요.

# Format (형식)
- 가독성을 위해 불렛 포인트(•)와 볼트체(**)를 적절히 사용하세요.
- 말투는 과한 칭찬보다는 '담백하고 전문적인' 어조를 유지하세요.
- 답변의 마지막에는 항상 고객이 다음 단계(예: 다른 제품 비교, 찜 목록 확인)를 결정할 수 있도록 가벼운 제안을 덧붙이세요.
`;

import { ReactNode, useMemo, useState } from 'react';
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
  PlayCircle,
  X,
  ExternalLink,
} from 'lucide-react';
import sellerImage from '../../assets/seller.png';

// 제품 이미지 import
import fridgeImg from '../../assets/categories/냉장고.jpg';
import tvImg from '../../assets/categories/TV.avif';
import airconImg from '../../assets/categories/에어컨.avif';
import OvenImg from '../../assets/categories/오븐.avif';
import humidifierImg from '../../assets/categories/가습기.jpg';
import microwaveImg from '../../assets/categories/광파오븐.png';
import StyleImg from '../../assets/categories/스타일러.jpg';

type ReviewDetail = {
  reviews: ReactNode[];
  youtubeUrls?: string[];
  moreLink?: string;
};

type ProductKeywordMap = Record<string, ReviewDetail>;

type ProductItem = {
  id: string;
  name: string;
  subtitle: string;
  image: string;
  keywords: ProductKeywordMap;
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

type SelectedKeywordModal = {
  productId: string;
  productName: string;
  keyword: string;
  detail: ReviewDetail;
} | null;

const getYoutubeVideoId = (url: string) => {
  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes('youtu.be')) {
      return parsed.pathname.replace('/', '');
    }

    if (parsed.hostname.includes('youtube.com')) {
      return parsed.searchParams.get('v');
    }

    return null;
  } catch {
    return null;
  }
};

const getYoutubeThumbnail = (url?: string) => {
  if (!url) return null;
  const videoId = getYoutubeVideoId(url);
  if (!videoId) return null;
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
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
        subtitle: '690L / 1등급',
        image: fridgeImg,
        keywords: {
          인테리어: {
            reviews: [
              <>
                들어가는 <strong>Fit 설계</strong> 덕분에 빌트인처럼 깔끔하게 자리 잡아
                주방이 훨씬 넓고 정돈된 느낌이에요. 특히 <strong>에센스 화이트 컬러</strong>는
                과하지 않으면서도 고급스럽고, 어떤 주방 인테리어에도 자연스럽게 어울려요.
                군더더기 없는 <strong>미니멀한 디자인</strong>이라 가전이 튀지 않고,
                마치 원래부터 주방의 일부였던 것처럼 조화롭게 녹아듭니다.
                디자인만 놓고 봐도 정말 <strong>만족도가 높아요</strong>.
              </>,
              <>
                디자인도 이쁘고 <strong>1등급</strong>으로 환급도 받아 만족스럽습니다.
                다만 <strong>매직스페이스</strong>가 없어서 조금 아쉽습니다.
              </>,
              <>
                일단 <strong>예뻐요</strong>. 인테리어하고 이사하면서 산건데 너무 맘에들어요.
                냉장고 스펙이 여러가지 있어서 혹시라도 가격이 제일 싸서 품질이 안 좋을까
                조금 걱정했지만 <strong>기본이 중요하고</strong> 한달 이상 썼는데 전혀 문제없어요.
                김치냉장고와 세트로 냉장고장도 정확한 치수로 들여놓으니
                <strong>너무 만족스럽습니다</strong>.
              </>,
            ],
            youtubeUrls: [
              'https://youtu.be/miOp8KMeCwk?si=1A6uey4kUevrrMsV',
              'https://youtu.be/Voyn82-GTHc?si=ZM6Y6Wp2VBZLNQI8',
            ],
            moreLink:
              'https://www.lge.co.kr/refrigerators/m616gbb0m1?sKwd=LG%20%EB%94%94%EC%98%A4%EC%8A%A4%20%EC%98%A4%EB%B8%8C%EC%A0%9C%EC%BB%AC%EB%A0%89%EC%85%98%20%EB%83%89%EC%9E%A5%EA%B3%A0&sTab=unit_product_list&sRank=1',
          },
          키친핏: {
            reviews: [
              <>
                <strong>키친핏</strong>으로 구매해서 너무 이쁘고 주방 인테리어 대장은 역시
                냉장고! 베이지 컬러라 <strong>심플하면서도 고급스럽고</strong>
                아주 만족하고 있어요!!
              </>,
              <>
                냉장고랑 김치냉장고랑 <strong>키친핏으로 맞췄어요</strong>^^
                디자인도 예쁘고 만족스럽습니당~~
              </>,
              <>
                이전에 623모델 김냉이랑 같이 인테리어해서 키친핏으로 쓰다가
                세미 빌트인으로 해서 이사할때 옵션으로 주고 와버렸어요.
                그래서 새로운 모델로 샀는데, 색상이 약간 아이보리 같아요.
                이전 모델에 비해서요. 뭔가 개선되었다고 하는데 잘 모르겠어요.
                <strong>문 열리는 각도</strong> 같은 거가 좋아진 거 같은데,
                인테리어장 없는 집에서는 그 개선이 딱히 체감되진 않아요.
                그래도 <strong>믿고 쓰는 엘지</strong>죠.
              </>,
            ],
            youtubeUrls: ['https://youtu.be/ZSPCkQz-liU?si=AL3RQ61BkpmyMRVm'],
            moreLink:
              'https://www.lge.co.kr/refrigerators/m616gbb0m1?sKwd=LG%20%EB%94%94%EC%98%A4%EC%8A%A4%20%EC%98%A4%EB%B8%8C%EC%A0%9C%EC%BB%AC%EB%A0%89%EC%85%98%20%EB%83%89%EC%9E%A5%EA%B3%A0&sTab=unit_product_list&sRank=1',
          },
          수납활용: {
            reviews: [
              <>
                겉보기엔 슬림해 보이는데, 문을 열어보면 생각보다 훨씬 넉넉한
                <strong>수납력</strong>에 한 번 더 놀랐어요.
                <strong>Fit & Max</strong>라는 이름답게 외형은 컴팩트한데
                내부 공간 활용이 정말 잘 되어 있어서 장을 보고 와도 수납 걱정이 없어요.
                냉장·냉동 공간 모두 여유가 있고, 식재료를 한눈에 보기 좋게 정리할 수 있어요.
              </>,
              <>
                냉장고 넣는 곳이 좁고 가벽 때문에 문이 안 열려서 빌트인 선택한 건데
                <strong>너무 좋습니다</strong>. 문 여는 데에 불편함도 없고
                사이즈도 <strong>600리터라 2인 가구에 적합</strong>해요.
              </>,
              <>
                대용량은 아니어도 <strong>1~2인 가구 기준으로 충분히 알차다</strong>는 평이 있어요.
              </>,
            ],
            youtubeUrls: ['https://youtu.be/viieYwex218?si=Q0578mw7FHR07uXD'],
            moreLink:
              'https://www.lge.co.kr/refrigerators/m616gbb0m1?sKwd=LG%20%EB%94%94%EC%98%A4%EC%8A%A4%20%EC%98%A4%EB%B8%8C%EC%A0%9C%EC%BB%AC%EB%A0%89%EC%85%98%20%EB%83%89%EC%9E%A5%EA%B3%A0&sTab=unit_product_list&sRank=1',
          },
        },
      },
      {
        id: 'p2',
        name: 'LG 올레드 evo (스탠드형)',
        subtitle: 'C4 / 138cm',
        image: tvImg,
        keywords: {
          화질: {
            reviews: [
              <>
                모니터 대용으로 너무 커서 가독성 떨어질까 걱정했는데
                <strong>화질이 쨍하고 가독성도 좋고</strong> 화면이 커서
                단점보다 장점이 더 많네요. 게임이나 유튜브, 영화 감상에는
                일반 모니터보다 <strong>화질도 쨍하고 좋습니다</strong>.
              </>,
              <>
                <strong>LED TV 10년</strong> 사용하다가 올레드로 바꾸니
                화질 너무 좋네요.
              </>,
              <>
                처음에 화면이 생각보다 안 선명해서 좀 실망했는데 설정에 들어가서
                <strong>올레디케어 화면</strong>으로 설정하니 화면이 확 달라져서
                비로소 올레드 TV의 진가를 보여주네요.
              </>,
              <>
                화질을 중요시합니다. 확실히 <strong>선명하고 암흑 표현감</strong>이 좋습니다.
                사운드는 따로 시스템을 구성하시길 바랍니다.
              </>,
              <>
                벽걸이여서 저녁에 불끄고 보면 <strong>극장 같음</strong>.
                화질도 엄청 선명하게 잘 나오고 리모콘 조작이 넘 재미있음.
              </>,
              <>
                눈이 편하고 <strong>화질이 선명해서</strong> 너무 좋네요.
              </>,
            ],
            youtubeUrls: [
              'https://youtu.be/0D_OmEGIOOQ?si=imiGnBPNurXz1_pv',
              'https://youtu.be/J1lxDRWY_lo?si=z-eny2dcD6U5CQne',
            ],
            moreLink: 'https://www.lge.co.kr/tvs/oled55c4ena-stand',
          },
          음질: {
            reviews: [
              <>
                12년 사용한 티비 소리가 거슬려서 구입했어요.
                화질도 당연히 좋고 <strong>소리도 좋아요</strong>.
              </>,
              <>
                기존 TV에 연결하여 사용하던 사운드바는 연결은 하였는데,
                사운드바 없이도 <strong>TV 자체 음향으로도 만족</strong>할 만하네요.
              </>,
            ],
            youtubeUrls: ['https://youtu.be/Qvyw62zfrAY?si=X0b7A79nm0wRfvNn'],
            moreLink: 'https://www.lge.co.kr/tvs/oled55c4ena-stand',
          },
          크기: {
            reviews: [
              <>
                안방에 65인치를 설치했는데 <strong>너무 크지도 작지도 않고</strong>
                시원시원한 크기 사이즈네요. 올레드라 두께도 얇아요.
              </>,
              <>
                침실에서 사용하기에 <strong>사이즈가 아주 좋습니다</strong>.
                휴대폰 화면처럼 매우 선명하고 디자인도 너무 예쁩니다.
              </>,
              <>
                55인치랑 65인치랑 고민하다가 65인치로 샀는데
                작은 거 샀으면 후회할뻔했어요. <strong>너무 맘에 들어요</strong>.
              </>,
            ],
            youtubeUrls: ['https://youtu.be/2Gk5Zaot9aM?si=--rHhWDqGuDFCILJ'],
            moreLink: 'https://www.lge.co.kr/tvs/oled55c4ena-stand',
          },
          성능: {
            reviews: [
              <>
                약 한 달 가량 사용 중입니다. 관심 많으신 분들에게는 이미 워낙 유명한 제품이더라고요.
                그 소문들과 LG의 명성만큼 하는 제품이라는 생각이 듭니다.
                특히 <strong>WebOS</strong>는 처음 사용해보는데,
                <strong>ThinQ 앱과 연동</strong>하여 스마트폰으로 유튜브나 넷플릭스 같은 앱까지
                모두 제어하는 게 너무 편합니다.
              </>,
              <>
                화질이 아주 좋습니다. 특히 영상감상에 아주 좋고
                <strong>HDR 켰을 때의 빛 표현</strong> 부분이 매우 만족스러움.
                게임시에는 <strong>120Hz 효과</strong>가 드라마틱함.
              </>,
              <>
                TV용, 모니터용, PC용, PS5 등 사용으로 구매했어요.
                EVO의 <strong>게임 화질이 진짜 최고</strong>예요.
              </>,
            ],
            youtubeUrls: ['https://youtu.be/w36xU_Qvgl8?si=f4_95Zw_feLreXLD'],
            moreLink: 'https://www.lge.co.kr/tvs/oled55c4ena-stand',
          },
        },
      },
      {
        id: 'p3',
        name: 'LG 휘센 오브제컬렉션 사계절에어컨 2in1 (타워 히트)',
        subtitle: '스탠드형 / 65.9㎡',
        image: airconImg,
        keywords: {
          전력효율: {
            reviews: [
              <>
                여름에 너무 시원하고 <strong>전기료도 싸게</strong> 나오고 좋아요.
              </>,
              <>
                난방비 효율성을 위해 온풍이 되는 사계절 에어컨이 좋을거라 생각했어요.
                이사하는 날 추워서 온풍으로 사용해봤는데
                <strong>5분쯤 지나니 따뜻한 바람</strong>이 집안에 퍼지더라구요.
                확실히 <strong>난방비 절감</strong>에 도움이 될 것 같아요.
              </>,
              <>
                지난 봄 쌀쌀한 날씨에 온기를 금방 올려주어 만족했는데,
                이번 여름 정말 빵빵한 성능에 놀랐습니다.
                <strong>전기료도 기존 여름용 에어컨과 차이가 없네요</strong>.
              </>,
            ],
            youtubeUrls: [
              'https://youtu.be/IPmOJhRoYSA?si=kMozs_YVbpZhLgWK',
              'https://youtu.be/RjM3ZMbzrNg?si=K5jbaGRE5bhjLuuH',
              'https://youtu.be/RTdbjWqvfus?si=WbeTFcBlFlnyQx_9',
            ],
            moreLink:
              'https://www.lge.co.kr/air-conditioners/fw20hdnbm2?sKwd=%ED%83%80%EC%9B%8C%20%EC%97%90%EC%96%B4%EC%BB%A8&sTab=unit_product_list&sRank=1',
          },
          냉방_난방: {
            reviews: [
              <>
                설치도 빨리해주시고 에어컨 <strong>성능도 훌륭합니다</strong>.
                시원하고 기능면에서도 훌륭합니다.
              </>,
              <>
                중앙 난방 아파트라서 냉난방 2 in 1으로 구매하였습니다.
                사용해보니 아주 만족스럽네요.
                <strong>듀얼인버터</strong>라 예전 정속형 대비 전기세 걱정도 덜하고,
                <strong>온도도 빨리 맞춰주고 안정적으로 유지</strong>해줍니다.
              </>,
              <>
                <strong>따뜻한 바람</strong>이 나오기까지 시간이 좀 걸리지만 좋아요.
              </>,
              <>
                겨울엔 <strong>따뜻한 바람</strong>, 여름엔 <strong>시원한 바람</strong>으로
                활용도가 아주 좋을 것 같습니다.
              </>,
            ],
            youtubeUrls: ['https://youtu.be/WRtMrnKkcEE?si=xfXsmCkc9aJpv6PU'],
            moreLink:
              'https://www.lge.co.kr/air-conditioners/fw20hdnbm2?sKwd=%ED%83%80%EC%9B%8C%20%EC%97%90%EC%96%B4%EC%BB%A8&sTab=unit_product_list&sRank=1',
          },
          기능: {
            reviews: [
              <>
                고급스럽고 색깔이 저희집하고 딱맞아요.
                특히 <strong>기능별 LED 변화</strong>가 있어서 한눈에 보기 딱 좋습니다.
              </>,
              <>
                올여름에 구입해서 최근에 난방도 틀어봤는데,
                <strong>금새 따뜻해져서</strong> 보일러를 덜 틀게 됩니다.
              </>,
              <>
                에어컨, 난방 둘 다 되는 제품이라길래 구입했어요.
                <strong>따뜻하고 좋아요</strong>.
              </>,
              <>
                여름철 냉방부터 지금 겨울 난방까지 만족하며 사용중입니다.
                기능적으로도 디자인적으로도 좋아요.
                <strong>핸드폰 연동</strong>하여 외출 후 집에 오기 전에
                미리 원하는 기능으로 설정이 가능해 편해요.
              </>,
            ],
            youtubeUrls: [
              'https://youtu.be/9Rxj3uHR4Ig?si=fU5Far0zB_czcxlG',
              'https://youtu.be/hNrHga4YgcU?si=HPROIIz90wJftWxw',
              'https://youtu.be/rkPhNHKKsko?si=P4YbzIoq9vdN07lC',
            ],
            moreLink:
              'https://www.lge.co.kr/air-conditioners/fw20hdnbm2?sKwd=%ED%83%80%EC%9B%8C%20%EC%97%90%EC%96%B4%EC%BB%A8&sTab=unit_product_list&sRank=1',
          },
          소음: {
            reviews: [
              <>
                난방모드 작동내내 <strong>턱~ 턱~ 거리는 소음</strong>으로 AS 접수 예정입니다.
              </>,
              <>
                심플하고 디자인도 좋네요. <strong>소음도 크지 않고</strong>
                냉난방 겸용이라 좋을 것 같습니다.
              </>,
              <>
                제품은 냉방 속도 빠르고 <strong>소음 적어요</strong>.
              </>,
            ],
            youtubeUrls: ['https://youtu.be/pH3D6-DEaaA?si=LLYl2VutewWsmEVu'],
            moreLink:
              'https://www.lge.co.kr/air-conditioners/fw20hdnbm2?sKwd=%ED%83%80%EC%9B%8C%20%EC%97%90%EC%96%B4%EC%BB%A8&sTab=unit_product_list&sRank=1',
          },
        },
      },
      {
        id: 'p4',
        name: 'LG 디오스 오브제컬렉션 전자레인지',
        subtitle: '25L',
        image: microwaveImg,
        keywords: {
          디자인: {
            reviews: [
              <>
                <strong>디자인도 예쁘고</strong> 기본에 충실한 데우기로만 사용한 전자레인지로 선택했어요.
              </>,
              <>
                깔끔한 디자인과 <strong>간편한 버튼</strong>이 가장 마음에 듭니다.
                조리 시간 조정이 <strong>다이얼 방식</strong>이라 더 편리하네요.
              </>,
              <>
                <strong>오브제컬렉션 디자인</strong> 고급스러워요. 기능도 성능도 좋아요.
              </>,
              <>
                디자인 깔끔하고 예쁩니다. 슬림해지고 단순해졌는데
                <strong>성능은 그대로</strong>인듯 해요.
              </>,
              <>
                <strong>색감에 반해</strong> 보자마자 바로 구입했네요.
                기능도 너무 사용하기 편리합니다.
              </>,
              <>
                문 열 때 튀어나온 부분인 <strong>손잡이가 없어서 깔끔</strong>해요.
              </>,
              <>
                예쁜 컬러감으로 <strong>인테리어 효과</strong>가 있습니다.
              </>,
              <>
                <strong>주방의 품격을 높이는 미니멀 디자인</strong>
              </>,
            ],
            youtubeUrls: [
              'https://youtu.be/Xt8ddJMYxp0?si=lJjOawTFsvjd6D37',
              'https://youtu.be/fX-ffEzRMUw?si=yT82lcemaGV2omK5',
            ],
            moreLink:
              'https://www.lge.co.kr/microwaves-and-ovens/mwj25e?sKwd=%EC%A0%84%EC%9E%90%EB%A0%88%EC%9D%B8%EC%A7%80&sTab=unit_product_list&sRank=4',
          },
          조리속도: {
            reviews: [
              <>
                <strong>1000W의 고출력</strong>으로 빠르고 균일하게 음식을 데울 수 있으며,
                5단계 출력 조절이 가능해 섬세한 조리가 가능합니다.
              </>,
              <>
                전기용량이 보급형보다 커서 <strong>빠른 조리</strong>가 가능합니다.
              </>,
              <>
                기본 설정값이 700W였네요. 불량은 아닌 것 같아 다행이고
                잘 사용해보겠습니다.
              </>,
            ],
            youtubeUrls: ['https://youtu.be/C89UH2id218?si=q-a6y_XvGmOc2f50'],
            moreLink:
              'https://www.lge.co.kr/microwaves-and-ovens/mwj25e?sKwd=%EC%A0%84%EC%9E%90%EB%A0%88%EC%9D%B8%EC%A7%80&sTab=unit_product_list&sRank=4',
          },
          사용편의: {
            reviews: [
              <>
                <strong>200W, 400W, 600W, 800W, 1000W</strong> 등 출력을 조절할 수 있어
                좋은 것 같습니다. 디자인도 좋아요.
              </>,
              <>
                손잡이가 튀어나와 있지 않아서 <strong>공간도 덜 차지</strong>해 보이고,
                문 여닫을 때도 큰 힘 없이 쉽게 이용할 수 있고
                <strong>작동 소리도 크지 않아서</strong> 좋았습니다.
              </>,
              <>
                <strong>W 수치를 필요에 따라 조절</strong>할 수 있는 것도 좋았습니다.
              </>,
              <>
                사용편의성인 <strong>조그다이얼</strong>이 좋고,
                문을 열면 안쪽에 자주 쓰는 자동요리 안내가 잘 되어 있어
                세팅하기가 쉬워요.
              </>,
            ],
            youtubeUrls: [
              'https://youtu.be/9no5aHOzBlI?si=VVndCwRgSQX5LG54',
              'https://youtu.be/IhpUZQ-Wviw?si=_3drIbI8Pmkowgz2',
            ],
            moreLink:
              'https://www.lge.co.kr/microwaves-and-ovens/mwj25e?sKwd=%EC%A0%84%EC%9E%90%EB%A0%88%EC%9D%B8%EC%A7%80&sTab=unit_product_list&sRank=4',
          },
        },
        badge: '베스트',
      },
      {
        id: 'p5',
        name: 'LG 스타일러 오브제컬렉션',
        subtitle: '5벌+바지 1벌',
        image: StyleImg,
        keywords: {
          디자인: {
            reviews: [
              <>
                양복, 모피 등 세탁비 많이 절약했어요.
                <strong>디자인 이쁘고 성능 좋아요</strong>.
              </>,
              <>
                집 인테리어 효과로도 너무 좋고, 무엇보다 패딩 돌리면
                <strong>솜이 살아나는 느낌</strong>이에요.
              </>,
              <>
                디자인이 세련되고 고급스러워 <strong>인테리어와 잘 어울리는 점</strong>도
                마음에 들었습니다.
              </>,
              <>
                붙박이장이랑 딱 알맞는 스타일러에요.
                앞면은 <strong>미러</strong>여서 따로 거울이 필요없을 정도고,
                <strong>청바지 스타일링, 인형살균, 침구살균, 실내제습</strong> 기능이 특히 좋아요.
              </>,
            ],
            youtubeUrls: [
              'https://youtu.be/1nGyn3I6ohI?si=Qsfd9TSEMwwWec0q',
              'https://youtu.be/8vmt6qkHJv4?si=GckgNhZVa41tVGkK',
              'https://youtu.be/yjwx3FhEzPA?si=P7baL9-9bsafLucc',
            ],
            moreLink:
              'https://www.lge.co.kr/lg-styler/sc5gmr80h?sKwd=%EC%8A%A4%ED%83%80%EC%9D%BC%EB%9F%AC&sTab=unit_product_list&sRank=1',
          },
          소음: {
            reviews: [
              <>
                기능도 일단은 문제 없습니다. 소음은 그리 크진 않지만,
                <strong>전혀 없는 건 아니기에</strong> 야간에는 침실보다 다른 공간 배치를 권합니다.
              </>,
              <>
                모드도 많고 좋습니다. <strong>소음도 생각보다 조용하고</strong>
                시끄럽지 않네요.
              </>,
              <>
                소음이 있어서 안방보다는 <strong>드레스룸에 놓는 게 나아보여요</strong>.
              </>,
            ],
            youtubeUrls: [
              'https://youtu.be/R7ENbrsc5OA?si=mHLn975ie7SD1y54',
              'https://youtu.be/s9uXtMMduHQ?si=KKOKRhAHZOxZLK6T',
            ],
            moreLink:
              'https://www.lge.co.kr/lg-styler/sc5gmr80h?sKwd=%EC%8A%A4%ED%83%80%EC%9D%BC%EB%9F%AC&sTab=unit_product_list&sRank=1',
          },
          사용편의: {
            reviews: [
              <>
                고기집 가서도 부담없고 <strong>삶의 질이 엄청 올라갔어요</strong>.
              </>,
              <>
                겨울철 옷 세탁소 맡기는 부담과 번거로움을
                <strong>스타일러가 다 해결</strong>해주네요.
              </>,
              <>
                음식점에서 배인 냄새도 온 날 바로 털어내니까
                <strong>냄새 제거</strong>되고 <strong>뽀송뽀송</strong>해져서 정말 좋아요.
              </>,
              <>
                분무기로 하던 주름관리, 냄새제거, 탈취관리를
                <strong>스타일러로 한번에 해결</strong>되네요.
              </>,
              <>
                전신거울도 되고, <strong>스팀다리미·제습기 기능</strong>까지 있어서
                하나의 가전으로 굉장히 효율이 좋습니다.
              </>,
              <>
                <strong>강력한 스팀 분사력</strong>으로 주름을 아주 쫙쫙 펴줍니다.
              </>,
            ],
            youtubeUrls: [
              'https://youtu.be/L27C48Z-cJo?si=YReuEj2eBEmHW-Bs',
              'https://youtu.be/l9be-XWJGuM?si=6h94sI4z8rTV50we',
            ],
            moreLink:
              'https://www.lge.co.kr/lg-styler/sc5gmr80h?sKwd=%EC%8A%A4%ED%83%80%EC%9D%BC%EB%9F%AC&sTab=unit_product_list&sRank=1',
          },
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
        id: 'p6',
        name: 'LG 퓨리케어 오브제컬렉션 하이드로타워',
        subtitle: '급수비커 + 무빙휠 세트',
        image: humidifierImg,
        keywords: {
          기능: {
            reviews: [
              <>
                하이드로타워 들이고 사용한 다음날부터
                <strong>코가 덜 건조하고</strong> 백분현상도 없었어요.
                최근 구매한 가전 중 <strong>가장 맘에드는 가전</strong>이에요.
              </>,
              <>
                <strong>예쁜 디자인 + 강력한 가습 + 위생적 관리</strong>까지,
                가격만큼 만족스러운 가습기입니다.
              </>,
              <>
                가습입자가 고와서 좋고, 안방에 따로
                <strong>가습기 + 공기청정</strong>까지 되니 좋아요.
                <strong>가습기 끝판왕</strong>이네요.
              </>,
              <>
                취침모드로 밤에 켜 놓으면 <strong>소음 거의 없이</strong>
                은은하게 가습, 청정이 되기 때문에 수면의 질도 좋아진 느낌입니다.
              </>,
            ],
            youtubeUrls: [
              'https://youtu.be/2sL0Yu5GnX8?si=2pTpcGxctxUQB4YL',
              'https://youtu.be/LqUXrP6o1uU?si=Tfiww4xaF853rMyW',
            ],
            moreLink:
              'https://www.lge.co.kr/humidifiers/hy705rsuabm?sKwd=%ED%95%98%EC%9D%B4%EB%93%9C%EB%A1%9C%ED%83%80%EC%9B%8C&sTab=unit_product_list&sRank=1',
          },
          모드다양성: {
            reviews: [
              <>
                하이드로타워를 쓰고 우리집이 정말 건조했다는 걸 알게됐어요.
                <strong>공기청정까지 듀얼로 가능</strong>하고 최고예요.
              </>,
              <>
                <strong>가습과 공기청정이 동시에</strong> 되어서 좋습니다.
                원하는 습도에 맞게 분무량도 많아서 빠른 시간에 습도를 올려 줍니다.
              </>,
              <>
                정수와 공기청정 가습 기능을 하나로 묶어 사용 가능한
                <strong>편리성</strong>과 <strong>자동건조기능</strong>,
                은은한 조명까지 만족합니다.
              </>,
            ],
            youtubeUrls: ['https://youtu.be/mwvBF6luUSY?si=Sip-I7mMsW9JjPk3'],
            moreLink:
              'https://www.lge.co.kr/humidifiers/hy705rsuabm?sKwd=%ED%95%98%EC%9D%B4%EB%93%9C%EB%A1%9C%ED%83%80%EC%9B%8C&sTab=unit_product_list&sRank=1',
          },
          디자인: {
            reviews: [
              <>
                가격이 비싸긴 하지만 <strong>공기청정 + 가습기능</strong>이 같이 있어
                사계절 내내 실용적으로 사용할 수 있을 거 같아요.
                일단 <strong>디자인이 너무 예뻐서</strong> 거실에 두기 너무 좋아요.
              </>,
              <>
                기본적으로 <strong>디자인이 예뻐서</strong> 실내 어떤 곳에 두어도 잘 어울립니다.
              </>,
              <>
                가습 공기청정이 일체형으로 된 하이드로타워가 있지 뭐에요.
                <strong>디자인도 좋고</strong> 비싸지만 돈값하는 거 같습니다.
              </>,
            ],
            youtubeUrls: ['https://youtu.be/-VfHj0JUqrY?si=R4LTS0cfWwm_vlh_'],
            moreLink:
              'https://www.lge.co.kr/humidifiers/hy705rsuabm?sKwd=%ED%95%98%EC%9D%B4%EB%93%9C%EB%A1%9C%ED%83%80%EC%9B%8C&sTab=unit_product_list&sRank=1',
          },
        },
        badge: '베스트',
      },
      {
        id: 'p7',
        name: 'LG 휘센 오브제컬렉션 사계절에어컨 2in1 (타워 히트)',
        subtitle: '스탠드형 / 65.9㎡',
        image: airconImg,
        keywords: {
          전력효율: {
            reviews: [
              <>
                여름에 너무 시원하고 <strong>전기료도 싸게</strong> 나오고 좋아요.
              </>,
              <>
                난방비 효율성을 위해 온풍이 되는 사계절 에어컨이 좋을거라 생각했어요.
                이사하는 날 추워서 온풍으로 사용해봤는데
                <strong>5분쯤 지나니 따뜻한 바람</strong>이 집안에 퍼지더라구요.
                확실히 <strong>난방비 절감</strong>에 도움이 될 것 같아요.
              </>,
              <>
                지난 봄 쌀쌀한 날씨에 온기를 금방 올려주어 만족했는데,
                이번 여름 정말 빵빵한 성능에 놀랐습니다.
                <strong>전기료도 기존 여름용 에어컨과 차이가 없네요</strong>.
              </>,
            ],
            youtubeUrls: [
              'https://youtu.be/IPmOJhRoYSA?si=kMozs_YVbpZhLgWK',
              'https://youtu.be/RjM3ZMbzrNg?si=K5jbaGRE5bhjLuuH',
              'https://youtu.be/RTdbjWqvfus?si=WbeTFcBlFlnyQx_9',
            ],
            moreLink:
              'https://www.lge.co.kr/air-conditioners/fw20hdnbm2?sKwd=%ED%83%80%EC%9B%8C%20%EC%97%90%EC%96%B4%EC%BB%A8&sTab=unit_product_list&sRank=1',
          },
          냉방_난방: {
            reviews: [
              <>
                설치도 빨리해주시고 에어컨 <strong>성능도 훌륭합니다</strong>.
                시원하고 기능면에서도 훌륭합니다.
              </>,
              <>
                중앙 난방 아파트라서 냉난방 2 in 1으로 구매하였습니다.
                사용해보니 아주 만족스럽네요.
                <strong>듀얼인버터</strong>라 예전 정속형 대비 전기세 걱정도 덜하고,
                <strong>온도도 빨리 맞춰주고 안정적으로 유지</strong>해줍니다.
              </>,
              <>
                <strong>따뜻한 바람</strong>이 나오기까지 시간이 좀 걸리지만 좋아요.
              </>,
              <>
                겨울엔 <strong>따뜻한 바람</strong>, 여름엔 <strong>시원한 바람</strong>으로
                활용도가 아주 좋을 것 같습니다.
              </>,
            ],
            youtubeUrls: ['https://youtu.be/WRtMrnKkcEE?si=xfXsmCkc9aJpv6PU'],
            moreLink:
              'https://www.lge.co.kr/air-conditioners/fw20hdnbm2?sKwd=%ED%83%80%EC%9B%8C%20%EC%97%90%EC%96%B4%EC%BB%A8&sTab=unit_product_list&sRank=1',
          },
          기능: {
            reviews: [
              <>
                고급스럽고 색깔이 저희집하고 딱맞아요.
                특히 <strong>기능별 LED 변화</strong>가 있어서 한눈에 보기 딱 좋습니다.
              </>,
              <>
                올여름에 구입해서 최근에 난방도 틀어봤는데,
                <strong>금새 따뜻해져서</strong> 보일러를 덜 틀게 됩니다.
              </>,
              <>
                에어컨, 난방 둘 다 되는 제품이라길래 구입했어요.
                <strong>따뜻하고 좋아요</strong>.
              </>,
              <>
                여름철 냉방부터 지금 겨울 난방까지 만족하며 사용중입니다.
                기능적으로도 디자인적으로도 좋아요.
                <strong>핸드폰 연동</strong>하여 외출 후 집에 오기 전에
                미리 원하는 기능으로 설정이 가능해 편해요.
              </>,
            ],
            youtubeUrls: [
              'https://youtu.be/9Rxj3uHR4Ig?si=fU5Far0zB_czcxlG',
              'https://youtu.be/hNrHga4YgcU?si=HPROIIz90wJftWxw',
              'https://youtu.be/rkPhNHKKsko?si=P4YbzIoq9vdN07lC',
            ],
            moreLink:
              'https://www.lge.co.kr/air-conditioners/fw20hdnbm2?sKwd=%ED%83%80%EC%9B%8C%20%EC%97%90%EC%96%B4%EC%BB%A8&sTab=unit_product_list&sRank=1',
          },
          소음: {
            reviews: [
              <>
                난방모드 작동내내 <strong>턱~ 턱~ 거리는 소음</strong>으로 AS 접수 예정입니다.
              </>,
              <>
                심플하고 디자인도 좋네요. <strong>소음도 크지 않고</strong>
                냉난방 겸용이라 좋을 것 같습니다.
              </>,
              <>
                제품은 냉방 속도 빠르고 <strong>소음 적어요</strong>.
              </>,
            ],
            youtubeUrls: ['https://youtu.be/pH3D6-DEaaA?si=LLYl2VutewWsmEVu'],
            moreLink:
              'https://www.lge.co.kr/air-conditioners/fw20hdnbm2?sKwd=%ED%83%80%EC%9B%8C%20%EC%97%90%EC%96%B4%EC%BB%A8&sTab=unit_product_list&sRank=1',
          },
        },
      },
      {
        id: 'p8',
        name: 'LG 디오스 오브제컬렉션 냉장고 Fit & Max',
        subtitle: '690L / 1등급',
        image: fridgeImg,
        keywords: {
          인테리어: {
            reviews: [
              <>
                들어가는 <strong>Fit 설계</strong> 덕분에 빌트인처럼 깔끔하게 자리 잡아
                주방이 훨씬 넓고 정돈된 느낌이에요. 특히 <strong>에센스 화이트 컬러</strong>는
                과하지 않으면서도 고급스럽고, 어떤 주방 인테리어에도 자연스럽게 어울려요.
                군더더기 없는 <strong>미니멀한 디자인</strong>이라 가전이 튀지 않고,
                마치 원래부터 주방의 일부였던 것처럼 조화롭게 녹아듭니다.
                디자인만 놓고 봐도 정말 <strong>만족도가 높아요</strong>.
              </>,
              <>
                디자인도 이쁘고 <strong>1등급</strong>으로 환급도 받아 만족스럽습니다.
                다만 <strong>매직스페이스</strong>가 없어서 조금 아쉽습니다.
              </>,
              <>
                일단 <strong>예뻐요</strong>. 인테리어하고 이사하면서 산건데 너무 맘에들어요.
                냉장고 스펙이 여러가지 있어서 혹시라도 가격이 제일 싸서 품질이 안 좋을까
                조금 걱정했지만 <strong>기본이 중요하고</strong> 한달 이상 썼는데 전혀 문제없어요.
                김치냉장고와 세트로 냉장고장도 정확한 치수로 들여놓으니
                <strong>너무 만족스럽습니다</strong>.
              </>,
            ],
            youtubeUrls: [
              'https://youtu.be/miOp8KMeCwk?si=1A6uey4kUevrrMsV',
              'https://youtu.be/Voyn82-GTHc?si=ZM6Y6Wp2VBZLNQI8',
            ],
            moreLink:
              'https://www.lge.co.kr/refrigerators/m616gbb0m1?sKwd=LG%20%EB%94%94%EC%98%A4%EC%8A%A4%20%EC%98%A4%EB%B8%8C%EC%A0%9C%EC%BB%AC%EB%A0%89%EC%85%98%20%EB%83%89%EC%9E%A5%EA%B3%A0&sTab=unit_product_list&sRank=1',
          },
          키친핏: {
            reviews: [
              <>
                <strong>키친핏</strong>으로 구매해서 너무 이쁘고 주방 인테리어 대장은 역시
                냉장고! 베이지 컬러라 <strong>심플하면서도 고급스럽고</strong>
                아주 만족하고 있어요!!
              </>,
              <>
                냉장고랑 김치냉장고랑 <strong>키친핏으로 맞췄어요</strong>^^
                디자인도 예쁘고 만족스럽습니당~~
              </>,
              <>
                이전에 623모델 김냉이랑 같이 인테리어해서 키친핏으로 쓰다가
                세미 빌트인으로 해서 이사할때 옵션으로 주고 와버렸어요.
                그래서 새로운 모델로 샀는데, 색상이 약간 아이보리 같아요.
                이전 모델에 비해서요. 뭔가 개선되었다고 하는데 잘 모르겠어요.
                <strong>문 열리는 각도</strong> 같은 거가 좋아진 거 같은데,
                인테리어장 없는 집에서는 그 개선이 딱히 체감되진 않아요.
                그래도 <strong>믿고 쓰는 엘지</strong>죠.
              </>,
            ],
            youtubeUrls: ['https://youtu.be/ZSPCkQz-liU?si=AL3RQ61BkpmyMRVm'],
            moreLink:
              'https://www.lge.co.kr/refrigerators/m616gbb0m1?sKwd=LG%20%EB%94%94%EC%98%A4%EC%8A%A4%20%EC%98%A4%EB%B8%8C%EC%A0%9C%EC%BB%AC%EB%A0%89%EC%85%98%20%EB%83%89%EC%9E%A5%EA%B3%A0&sTab=unit_product_list&sRank=1',
          },
          수납활용: {
            reviews: [
              <>
                겉보기엔 슬림해 보이는데, 문을 열어보면 생각보다 훨씬 넉넉한
                <strong>수납력</strong>에 한 번 더 놀랐어요.
                <strong>Fit & Max</strong>라는 이름답게 외형은 컴팩트한데
                내부 공간 활용이 정말 잘 되어 있어서 장을 보고 와도 수납 걱정이 없어요.
                냉장·냉동 공간 모두 여유가 있고, 식재료를 한눈에 보기 좋게 정리할 수 있어요.
              </>,
              <>
                냉장고 넣는 곳이 좁고 가벽 때문에 문이 안 열려서 빌트인 선택한 건데
                <strong>너무 좋습니다</strong>. 문 여는 데에 불편함도 없고
                사이즈도 <strong>600리터라 2인 가구에 적합</strong>해요.
              </>,
              <>
                대용량은 아니어도 <strong>1~2인 가구 기준으로 충분히 알차다</strong>는 평이 있어요.
              </>,
            ],
            youtubeUrls: ['https://youtu.be/viieYwex218?si=Q0578mw7FHR07uXD'],
            moreLink:
              'https://www.lge.co.kr/refrigerators/m616gbb0m1?sKwd=LG%20%EB%94%94%EC%98%A4%EC%8A%A4%20%EC%98%A4%EB%B8%8C%EC%A0%9C%EC%BB%AC%EB%A0%89%EC%85%98%20%EB%83%89%EC%9E%A5%EA%B3%A0&sTab=unit_product_list&sRank=1',
          },
        },
      },
      {
        id: 'p9',
        name: 'LG 올레드 evo (스탠드형)',
        subtitle: 'C4 / 138cm',
        image: tvImg,
        keywords: {
          화질: {
            reviews: [
              <>
                모니터 대용으로 너무 커서 가독성 떨어질까 걱정했는데
                <strong>화질이 쨍하고 가독성도 좋고</strong> 화면이 커서
                단점보다 장점이 더 많네요. 게임이나 유튜브, 영화 감상에는
                일반 모니터보다 <strong>화질도 쨍하고 좋습니다</strong>.
              </>,
              <>
                <strong>LED TV 10년</strong> 사용하다가 올레드로 바꾸니
                화질 너무 좋네요.
              </>,
              <>
                처음에 화면이 생각보다 안 선명해서 좀 실망했는데 설정에 들어가서
                <strong>올레디케어 화면</strong>으로 설정하니 화면이 확 달라져서
                비로소 올레드 TV의 진가를 보여주네요.
              </>,
              <>
                화질을 중요시합니다. 확실히 <strong>선명하고 암흑 표현감</strong>이 좋습니다.
                사운드는 따로 시스템을 구성하시길 바랍니다.
              </>,
              <>
                벽걸이여서 저녁에 불끄고 보면 <strong>극장 같음</strong>.
                화질도 엄청 선명하게 잘 나오고 리모콘 조작이 넘 재미있음.
              </>,
              <>
                눈이 편하고 <strong>화질이 선명해서</strong> 너무 좋네요.
              </>,
            ],
            youtubeUrls: [
              'https://youtu.be/0D_OmEGIOOQ?si=imiGnBPNurXz1_pv',
              'https://youtu.be/J1lxDRWY_lo?si=z-eny2dcD6U5CQne',
            ],
            moreLink: 'https://www.lge.co.kr/tvs/oled55c4ena-stand',
          },
          음질: {
            reviews: [
              <>
                12년 사용한 티비 소리가 거슬려서 구입했어요.
                화질도 당연히 좋고 <strong>소리도 좋아요</strong>.
              </>,
              <>
                기존 TV에 연결하여 사용하던 사운드바는 연결은 하였는데,
                사운드바 없이도 <strong>TV 자체 음향으로도 만족</strong>할 만하네요.
              </>,
            ],
            youtubeUrls: ['https://youtu.be/Qvyw62zfrAY?si=X0b7A79nm0wRfvNn'],
            moreLink: 'https://www.lge.co.kr/tvs/oled55c4ena-stand',
          },
          크기: {
            reviews: [
              <>
                안방에 65인치를 설치했는데 <strong>너무 크지도 작지도 않고</strong>
                시원시원한 크기 사이즈네요. 올레드라 두께도 얇아요.
              </>,
              <>
                침실에서 사용하기에 <strong>사이즈가 아주 좋습니다</strong>.
                휴대폰 화면처럼 매우 선명하고 디자인도 너무 예쁩니다.
              </>,
              <>
                55인치랑 65인치랑 고민하다가 65인치로 샀는데
                작은 거 샀으면 후회할뻔했어요. <strong>너무 맘에 들어요</strong>.
              </>,
            ],
            youtubeUrls: ['https://youtu.be/2Gk5Zaot9aM?si=--rHhWDqGuDFCILJ'],
            moreLink: 'https://www.lge.co.kr/tvs/oled55c4ena-stand',
          },
          성능: {
            reviews: [
              <>
                약 한 달 가량 사용 중입니다. 관심 많으신 분들에게는 이미 워낙 유명한 제품이더라고요.
                그 소문들과 LG의 명성만큼 하는 제품이라는 생각이 듭니다.
                특히 <strong>WebOS</strong>는 처음 사용해보는데,
                <strong>ThinQ 앱과 연동</strong>하여 스마트폰으로 유튜브나 넷플릭스 같은 앱까지
                모두 제어하는 게 너무 편합니다.
              </>,
              <>
                화질이 아주 좋습니다. 특히 영상감상에 아주 좋고
                <strong>HDR 켰을 때의 빛 표현</strong> 부분이 매우 만족스러움.
                게임시에는 <strong>120Hz 효과</strong>가 드라마틱함.
              </>,
              <>
                TV용, 모니터용, PC용, PS5 등 사용으로 구매했어요.
                EVO의 <strong>게임 화질이 진짜 최고</strong>예요.
              </>,
            ],
            youtubeUrls: ['https://youtu.be/w36xU_Qvgl8?si=f4_95Zw_feLreXLD'],
            moreLink: 'https://www.lge.co.kr/tvs/oled55c4ena-stand',
          },
        },
      },
      {
        id: 'p10',
        name: 'LG 디오스 오브제컬렉션 광파오븐',
        subtitle: '32L',
        image: OvenImg,
        keywords: {
          디자인: {
            reviews: [
              <>
                베이지 색감이 정말 <strong>고급스럽고</strong> 주방 분위기를 화사하게 만들어주네요.
                성능과 비주얼 모두 만족스러운 최고의 제품입니다.
              </>,
              <>
                이 제품으로 <strong>전자레인지, 오븐, 에어프라이</strong>까지 가능해서
                공간 차지가 많이 줄은 게 장점이에요.
              </>,
              <>
                <strong>인테리어 완성도</strong>가 매우 높음.
                가전이 가구처럼 보이도록 디자인됨.
              </>,
              <>
                여러가지 기능을 한 번에 쓸 수 있다는 장점이 있고
                <strong>디자인이 예뻐요</strong>.
              </>,
              <>
                자동요리기능 넘 편하게 잘 쓰고 있네요.
                <strong>혼수품 중 가장 잘 산 제품</strong> 중 하나에요.
              </>,
              <>
                광파오븐 디자인, 기능 다 너무 만족스럽고
                <strong>다양한 기능 + 자동요리기능</strong>까지 있어서 재미있어요.
              </>,
            ],
            youtubeUrls: [
              'https://youtu.be/pFlNoyCPkms?si=iMCMdyuR0MitdxBv',
              'https://youtu.be/sEYkUGWqrg4?si=RLeY8DhO1brRUSga',
              'https://youtu.be/X93fcQvjUVo?si=IibwvRJ1Bk4o857g',
            ],
            moreLink:
              'https://www.lge.co.kr/microwaves-and-ovens/mlj32ers?sKwd=LG%20%EB%94%94%EC%98%A4%EC%8A%A4%20%EC%98%A4%EB%B8%8C%EC%A0%9C%EC%BB%AC%EB%A0%89%EC%85%98%20%EA%B4%91%ED%8C%8C%EC%98%A4%EB%B8%90&sTab=unit_product_list&sRank=1',
          },
          소음: {
            reviews: [
              <>
                문 열고 닫을 때 힘을 크게 들이지 않아도 되고 부드럽게 열리고 닫힙니다.
                <strong>소리가 크지 않아</strong> 아기 키우는 집에 좋고,
                성능이 좋아서 조금만 돌려도 조리가 빠릅니다.
              </>,
              <>
                자동 세척이 되고, <strong>소음도 시끄럽지 않고</strong>
                앱으로 컨트롤 돼서 좋아요.
              </>,
            ],
            youtubeUrls: [
              'https://youtu.be/2CQzQt9I7fI?si=DWGLOYkX7ha9IrII',
              'https://youtu.be/XRzBsMGD8qY?si=Rkf6Juc7hZX9g5oh',
            ],
            moreLink:
              'https://www.lge.co.kr/microwaves-and-ovens/mlj32ers?sKwd=LG%20%EB%94%94%EC%98%A4%EC%8A%A4%20%EC%98%A4%EB%B8%8C%EC%A0%9C%EC%BB%AC%EB%A0%89%EC%85%98%20%EA%B4%91%ED%8C%8C%EC%98%A4%EB%B8%90&sTab=unit_product_list&sRank=1',
          },
          사용편의: {
            reviews: [
              <>
                전자레인지, 오븐, 에어프라이가 모두 가능하고 공간도 적게 차지하면서도
                요리가 기가막히게 되다보니 <strong>주방에서 요리가 즐거워집니다</strong>.
              </>,
              <>
                전자레인지 기능만 사용하고 있어요.
                <strong>기능이 많아서 공부 좀 해야겠어요</strong>.
              </>,
              <>
                기능이 다양하고 <strong>사용하기 편리</strong>해요.
              </>,
              <>
                생선구이, 스테이크, 에어프라이 등
                <strong>다양한 요리</strong>를 해볼 수 있을 것 같아서 기대되네요.
              </>,
              <>
                자동요리 기능 찾는 게 더 편해졌어요.
                이전에는 번호로 찾아야 돼서 귀찮았는데
                <strong>한글로 써 있어서 더 직관적</strong>이라 좋습니다.
              </>,
              <>
                에어프라이기, 오븐, 전자레인지, 찜 기능 등
                <strong>하나로 모든 기능을 사용</strong>할 수 있어서 편하고 좋아요.
              </>,
            ],
            youtubeUrls: [
              'https://youtu.be/mHBl2xwH8_I?si=VdT7XxYu2p4jr6Uo',
              'https://youtu.be/3kTgkxr463Y?si=Qqv1XwBfRc30R2YP',
            ],
            moreLink:
              'https://www.lge.co.kr/microwaves-and-ovens/mlj32ers?sKwd=LG%20%EB%94%94%EC%98%A4%EC%8A%A4%20%EC%98%A4%EB%B8%8C%EC%A0%9C%EC%BB%AC%EB%A0%89%EC%85%98%20%EA%B4%91%ED%8C%8C%EC%98%A4%EB%B8%90&sTab=unit_product_list&sRank=1',
          },
        },
      },
    ],
  },
];

export default function ProductsPage() {
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState<string | null>('package-01');
  const [selectedKeywordModal, setSelectedKeywordModal] =
    useState<SelectedKeywordModal>(null);

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
    setSelectedKeywordModal(null);
  };

  const handleSendMessage = () => {
    const trimmed = chatInput.trim();
    if (!trimmed || isTyping) return;

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    // 1. 사용자 메시지 화면에 추가
    const userMessage = { id: Date.now(), role: 'user', text: chatInput };
    setMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsTyping(true);
  
    try {
      // 2. OpenAI API 호출
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer YOUR_OPENAI_API_KEY` // 여기에 지우의 API 키를 넣어줘
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages.map(m => ({ role: m.role, content: m.text })),
            { role: "user", content: chatInput }
          ],
          temperature: 0,
        })
      });
  
      const data = await response.json();
      const botText = data.choices[0].message.content;

    // 3. 챗봇 답변 화면에 추가
    setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', text: botText }]);
  } catch (error) {
    console.error("Error:", error);
    setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', text: "죄송합니다. 통신 중 오류가 발생했습니다." }]);
  } finally {
    setIsTyping(false);
  }
};
    
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
                className="self-start inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-200 bg-white/70 backdrop-blur-sm shadow-sm hover:bg-gray-50 transition"
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

                <div className="flex-1 overflow-x-auto pb-2">
                  <div className="flex gap-4 min-w-max">
                    {pkg.items.map((item) => (
                      <motion.button
                        key={item.id}
                        type="button"
                        whileHover={{ y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSelectPackage(pkg.id)}
                        className={`relative w-[260px] md:w-[300px] bg-white rounded-[22px] border shadow-sm hover:shadow-lg transition-all overflow-hidden text-left ${
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
                            AI <span className="text-red-500">실사용자 리뷰</span> 키워드
                          </p>

                          <div className="flex flex-wrap gap-2">
                            {Object.keys(item.keywords).map((keyword) => (
                              <button
                                key={keyword}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedKeywordModal({
                                    productId: item.id,
                                    productName: item.name,
                                    keyword,
                                    detail: item.keywords[keyword],
                                  });
                                }}
                                className="px-3 py-1.5 rounded-full text-[11px] font-semibold transition bg-purple-50 text-purple-700 border border-purple-200 hover:bg-pink-50 hover:text-pink-700"
                              >
                                {keyword}
                              </button>
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

      {/* Review Modal */}
      <AnimatePresence>
        {selectedKeywordModal && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              aria-label="모달 닫기"
              className="absolute inset-0 bg-black/45 backdrop-blur-sm"
              onClick={() => setSelectedKeywordModal(null)}
            />

            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 w-full max-w-3xl max-h-[85vh] overflow-hidden rounded-[32px] bg-white shadow-2xl border border-white/70"
            >
              <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-gray-200">
                <div>
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold mb-3">
                    리뷰 키워드 상세
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                    {selectedKeywordModal.keyword}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedKeywordModal.productName}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedKeywordModal(null)}
                  className="shrink-0 w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="overflow-y-auto max-h-[calc(85vh-88px)] px-6 py-6">
                <div className="mb-6">
                  <h4 className="text-base font-bold text-gray-900 mb-3">
                    실사용자 리뷰
                  </h4>

                  <div className="space-y-3">
                    {selectedKeywordModal.detail.reviews.map((review, index) => (
                      <div
                        key={`${selectedKeywordModal.keyword}-review-${index}`}
                        className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3"
                      >
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {review}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedKeywordModal.detail.youtubeUrls &&
                  selectedKeywordModal.detail.youtubeUrls.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-base font-bold text-gray-900 mb-3">
                        관련 유튜브 리뷰
                      </h4>

                      <div className="grid md:grid-cols-2 gap-4">
                        {selectedKeywordModal.detail.youtubeUrls.map((url, index) => {
                          const thumbnail = getYoutubeThumbnail(url);

                          return (
                            <a
                              key={`${selectedKeywordModal.keyword}-youtube-${index}`}
                              href={url}
                              target="_blank"
                              rel="noreferrer"
                              className="block rounded-2xl overflow-hidden border border-gray-200 bg-white hover:shadow-md transition"
                            >
                              {thumbnail ? (
                                <img
                                  src={thumbnail}
                                  alt="유튜브 썸네일"
                                  className="w-full h-[180px] object-cover"
                                />
                              ) : (
                                <div className="w-full h-[180px] bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                                  썸네일을 불러올 수 없습니다
                                </div>
                              )}

                              <div className="px-4 py-3 flex items-center gap-2 text-sm font-semibold text-purple-700">
                                <PlayCircle className="w-4 h-4" />
                                유튜브 리뷰 보러가기 {index + 1}
                              </div>
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}

                {selectedKeywordModal.detail.moreLink && (
                  <div className="pt-2">
                    <a
                      href={selectedKeywordModal.detail.moreLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl transition"
                    >
                      더보기
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ModernBackground>
  );
}
