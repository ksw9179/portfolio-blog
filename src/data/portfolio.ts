export type Education = {
  school: string;
  program?: string; // 일단 비공개 — 학과 표시할지 나중에 결정
  status: string;
  period?: string;
};

export type Certification = {
  name: string;
  issuer?: string;
};

export type Activity = {
  title: string;
  org: string;
  period: string;
  description: string;
};

export type Project = {
  slug: string;
  title: string;
  summary: string;
  problem: string;
  approach: string;
  result: string;
  stack: string[];
  githubUrl?: string;
  status: "Completed" | "In Progress";
};

export const education: Education[] = [
  {
    school: "경희대학교",
    status: "Enrolled",
    period: "2023년부터",
  },
  { school: "범서고등학교", status: "Graduated" },
  { school: "구영중학교", status: "Graduated" },
  { school: "구영초등학교", status: "Graduated" },
];

export const certifications: Certification[] = [
  { name: "AICE Associate" },
  { name: "ADsP (데이터분석 준전문가)" },
  { name: "프로그래밍기능사" },
];

export const activities: Activity[] = [
  {
    title: "정부출연(연) 슈퍼컴퓨터와 함께하는 AI·빅데이터 바이오 캠프",
    org: "한국과학기술정보연구원(KISTI)",
    period: "2026.07.20 – 2026.07.23",
    description: "Completed",
  },
  {
    title: "Khlug(쿠러그)",
    org: "경희대학교 중앙 IT 동아리",
    period: "2026년부터",
    description: "In Progress",
  },
];

export const projects: Project[] = [
  {
    slug: "numpy-backprop",
    title: "순수 NumPy로 역전파 직접 구현",
    summary:
      "딥러닝 프레임워크 없이 NumPy만으로 선형회귀부터 신경망까지 역전파를 직접 구현한 프로젝트.",
    problem:
      "PyTorch 등 프레임워크 사용 시 역전파가 자동 계산되어 블랙박스화\n" +
      "경사하강법·역전파의 수학적 원리를 직접 손으로 이해하고 싶었음",
    approach:
      "선형회귀 → 로지스틱회귀 → 2층 MLP 순서로 단계적 구현\n" +
      "forward/backward 수식을 직접 유도해 NumPy 코드로 구현\n" +
      "핵심 수식은 뼈대+TODO 방식으로 직접 채움",
    result:
      "자체 테스트 24/24 통과\n" +
      "XOR 100%\n" +
      "유방암 진단(breast cancer) 95.6%\n" +
      "sklearn digits 97.5%\n" +
      "실제 MNIST 95.75% 달성",
    stack: ["Python", "NumPy"],
    githubUrl: "https://github.com/ksw9179/numpy-backprop",
    status: "Completed",
  },
  {
    slug: "autograd-engine",
    title: "미니 자동미분 엔진 구현",
    summary:
      "스칼라용/텐서용 두 가지 자동미분(autograd) 엔진을 직접 만들어 MNIST를 분류한 프로젝트.",
    problem:
      "인공지능의 수학적 원리(미분·연쇄법칙)를 프로그래밍과 직접 연결해 이해하고 싶었음\n" +
      "PyTorch autograd처럼 계산 그래프 생성 및 미분 전파 방식을 직접 구현해보기로 함",
    approach:
      "스칼라 단위로 동작하는 Value 엔진 구현\n" +
      "NumPy 배열 기반 Tensor 엔진 구현",
    result:
      "27개 테스트 전부 통과\n" +
      "moons 데이터셋 99%\n" +
      "MNIST 95.75% (numpy-backprop과 동일 수치로 검증)",
    stack: ["Python", "NumPy"],
    githubUrl: "https://github.com/ksw9179/autograd-engine",
    status: "Completed",
  },
  {
    slug: "blueberry-ripeness-classification",
    title: "블루베리 익음도 이진 분류",
    summary:
      "블루베리 사진으로 수확 시기(익음 여부)를 자동 판별하는 이진 분류 프로젝트. CNN과 EfficientNet을 비교하며 진행 중.",
    problem:
      "블루베리 사진만으로 수확 가능 상태(ready) 여부를 자동 판별하고자 함",
    approach:
      "CNN(PyTorch), EfficientNetB0(Keras) 두 모델 각각 학습 후 비교\n" +
      "Laplacian blur score로 선명도 상위 이미지만 샘플링해 클래스 균형 확보",
    result:
      "EfficientNet, CNN 대비 외부(실제) 사진 정확도 저하 현상 발견\n" +
      "원인: 원본 저해상도(평균 51px) 대비 EfficientNet 224px 업스케일(약 4.4배)의 보간 흐림 패턴 학습 반영으로 추정\n" +
      "검증: 사전학습 없는 경량 CNN(96px 입력) 신규 구현 및 비교\n" +
      "부가 발견: EfficientNet의 preprocess_input()은 실질적 무연산(no-op) 확인 → CNN에는 [0,1] 정규화 별도 적용\n" +
      "디버깅: 전처리 오류는 명백한 이미지에서 sigmoid 포화로 가려지고, 애매한(경계선) 이미지에서 가장 크게 드러남 확인",
    stack: ["Python", "PyTorch", "Keras/TensorFlow", "Google Colab"],
    githubUrl:
      "https://github.com/ksw9179/AI_and_Data-/blob/main/%EA%B0%9C%EC%84%A0%EC%95%88_Blueberry_CNN.ipynb",
    status: "Completed",
  },
];
