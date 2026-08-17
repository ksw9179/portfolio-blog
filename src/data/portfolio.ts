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
      "PyTorch 같은 프레임워크를 쓰면 역전파가 자동으로 계산돼 블랙박스가 된다. 경사하강법과 역전파의 수학적 원리를 직접 손으로 이해하고 싶었다.",
    approach:
      "선형회귀 → 로지스틱회귀 → 2층 MLP 순서로, forward/backward 수식을 직접 유도해 NumPy 코드로 구현했다. 핵심 수식은 뼈대+TODO 방식으로 직접 채워나갔다.",
    result:
      "자체 테스트 24/24 통과. XOR 100%, 유방암 진단(breast cancer) 95.6%, sklearn digits 97.5%, 실제 MNIST 95.75% 달성.",
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
      "인공지능이 돌아가는 수학적 원리(미분과 연쇄법칙)를 프로그래밍과 직접 연결해 이해하고 싶었다. PyTorch의 autograd 같은 자동미분이 내부적으로 계산 그래프를 만들고 미분을 전파하는 방식을 직접 구현해보기로 했다.",
    approach:
      "스칼라 단위로 동작하는 Value 엔진과 NumPy 배열 기반의 Tensor 엔진, 두 가지를 각각 구현했다.",
    result:
      "27개 테스트 전부 통과. moons 데이터셋 99%, MNIST 95.75% (numpy-backprop과 동일 수치로 검증).",
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
      "블루베리 사진만 보고 수확해도 되는 상태(ready)인지 아닌지를 자동으로 판별하고 싶었다.",
    approach:
      "CNN(PyTorch)과 EfficientNetB0(Keras) 두 모델을 각각 학습해 비교했다. Laplacian blur score로 선명도 상위 이미지만 샘플링해 클래스 균형을 맞췄다.",
    result:
      "의외로 EfficientNet이 CNN보다 외부(실제) 사진 정확도가 낮게 나오는 현상을 발견. 원인을 추적한 결과, 원본 이미지 해상도가 매우 작아(평균 51px) EfficientNet의 큰 업스케일(224px, 약 4.4배)이 보간 흐림 패턴을 학습에 반영시킨 것이 유력한 원인으로 확인됨. 업스케일 배율을 줄인 재실험 진행 예정.",
    stack: ["Python", "PyTorch", "Keras/TensorFlow", "Google Colab"],
    status: "In Progress",
  },
];
