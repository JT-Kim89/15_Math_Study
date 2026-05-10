import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT_DIR = "대학교_수학_커리큘럼";

const yearDirs = {
  "1학년": "1학년_기초_수학과_증명_입문",
  "2학년": "2학년_수학전공의_핵심_기초",
  "3학년": "3학년_순수수학과_응용수학의_분화",
  "4학년": "4학년_심화_과목과_연구_주제",
};

const profileIdeas = {
  calculus_limit: ["극한", "연속성", "국소적 거동", "수치적 근사"],
  calculus_derivative: ["도함수", "접선", "민감도", "최적화"],
  calculus_integral: ["정적분", "누적량", "Riemann 합", "면적 해석"],
  calculus_series: ["급수", "Taylor 근사", "수렴", "근사 오차"],
  multivariable: ["편미분", "그래디언트", "등고선", "최대 증가 방향"],
  linear_algebra_transform: ["벡터", "행렬", "선형변환", "기저"],
  eigen_markov: ["고유값", "고유벡터", "장기 거동", "Markov chain"],
  least_squares: ["정사영", "최소제곱", "잔차", "모델 적합"],
  logic_truth: ["명제", "진리표", "함의", "논리적 동치"],
  set_relation: ["집합 연산", "관계", "함수", "분할"],
  graph_paths: ["그래프", "최단경로", "네트워크", "가중치"],
  combinatorics: ["조합", "이항계수", "점화식", "세기"],
  programming_error: ["수치 오차", "반복 실험", "배열 계산", "재현성"],
  probability_distribution: ["확률변수", "분포", "기댓값", "시뮬레이션"],
  clt: ["표본평균", "중심극한정리", "분산", "근사분포"],
  bayes_coin: ["조건부확률", "Bayes 공식", "사전분포", "사후분포"],
  distribution_inference: ["추정", "신뢰구간", "검정", "표본 변동성"],
  real_sequence: ["수열", "급수", "균등수렴", "Cauchy 조건"],
  epsilon_delta: ["epsilon-delta", "연속", "극한의 엄밀화", "근방"],
  metric_space: ["거리공간", "열린공", "수축사상", "완비성"],
  ode_logistic: ["상미분방정식", "방향장", "수치해", "모형화"],
  ode_phase: ["위상평면", "안정성", "선형시스템", "동역학"],
  group_table: ["군", "연산표", "대칭", "부분군"],
  ring_polynomial: ["환", "다항식", "몫구조", "근"],
  finite_field: ["유한체", "mod 연산", "역원", "암호 응용"],
  geometry_curve: ["곡선", "매개화", "곡률", "호의 길이"],
  complex_map: ["복소평면", "해석함수", "등각사상", "격자 변환"],
  contour_integral: ["선적분", "복소적분", "순환", "잔여정리"],
  topology_space: ["위상공간", "연속사상", "연결성", "몫공간"],
  measure_integral: ["측도", "가측함수", "Lebesgue 적분", "수렴정리"],
  pde_heat: ["열방정식", "확산", "경계조건", "유한차분"],
  pde_wave: ["파동방정식", "진동", "에너지", "유한차분"],
  numerical_root: ["Newton 방법", "이분법", "수렴률", "잔차"],
  numerical_interpolation: ["보간", "Runge 현상", "근사", "오차"],
  numerical_linear: ["조건수", "반복법", "선형시스템", "안정성"],
  optimization_gradient: ["볼록성", "경사하강", "학습률", "목적함수"],
  linear_programming: ["선형계획", "가능영역", "쌍대성", "최적해"],
  fourier_series: ["Fourier 급수", "주파수", "필터링", "직교기저"],
  functional_projection: ["Hilbert 공간", "정사영", "선형작용소", "노름"],
  commutative_algebra: ["아이디얼", "대수다양체", "국소화", "Groebner 관점"],
  galois_roots: ["체확대", "분해체", "켤레근", "Galois 군"],
  riemann_geometry: ["다양체", "계량", "측지선", "곡률"],
  algebraic_topology: ["단체복합체", "호몰로지", "Euler 지표", "구멍"],
  stochastic_process: ["확률과정", "랜덤워크", "Poisson 과정", "마팅게일"],
  regression: ["회귀", "잔차", "진단", "예측"],
  bayesian_statistics: ["사전분포", "사후분포", "예측분포", "의사결정"],
  math_physics: ["변분원리", "진동자", "보존량", "물리 모형"],
  computational_math: ["Monte Carlo", "계산실험", "수렴성", "복잡도"],
  financial_math: ["무차익", "확률모형", "옵션", "위험측도"],
  machine_learning_math: ["손실함수", "SVD/PCA", "분류", "정규화"],
  data_analysis: ["탐색적 분석", "시계열", "시각화", "해석"],
  capstone_project: ["연구질문", "재현성", "논문읽기", "발표"],
};

function chapter(title, profile, basic, applied, concepts = []) {
  return { title, profile, basic, applied, concepts };
}

function course(year, number, area, name, chapters) {
  return { year, number, area, name, chapters };
}

const courses = [
  course("1학년", 1, "미적분", "미적분학 I", [
    chapter("함수와 극한", "calculus_limit", "sin(x)/x가 x=0에서 1로 가까워지는 모습을 표와 그래프로 확인한다.", "카메라 노이즈가 있는 센서값을 작은 구간에서 안정적으로 근사한다."),
    chapter("도함수와 접선", "calculus_derivative", "f(x)=x^3-x의 한 점에서 접선을 그리고 순간 변화율을 계산한다.", "가격 변화에 따른 수요 변화의 민감도, 즉 한계효과를 추정한다."),
    chapter("정적분과 누적량", "calculus_integral", "구간을 잘게 나누어 Riemann 합이 면적으로 수렴함을 본다.", "전력 사용량 곡선을 적분해 하루 총 에너지 사용량을 추정한다."),
    chapter("Taylor 근사와 급수", "calculus_series", "sin(x)의 Taylor 다항식 차수가 커질수록 근사가 개선되는 것을 비교한다.", "작은 각도 근사를 사용해 진자의 빠른 계산 모델을 만든다."),
  ]),
  course("1학년", 2, "미적분", "미적분학 II", [
    chapter("여러 변수 함수와 그래디언트", "multivariable", "z=f(x,y)의 등고선과 그래디언트가 서로 수직임을 관찰한다.", "지형의 고도 자료에서 가장 가파른 상승 방향을 찾는다."),
    chapter("중적분과 좌표변환", "calculus_integral", "격자 합으로 2차원 영역의 누적량을 근사한다.", "도시 전체 강수량을 지역별 강수 밀도 함수로부터 추정한다."),
    chapter("벡터장과 선적분", "contour_integral", "원형 경로를 따라 벡터장의 순환을 계산한다.", "유체 흐름에서 소용돌이 강도를 근사해 위험 구역을 찾는다."),
    chapter("무한급수와 수렴반경", "calculus_series", "기하급수와 Taylor 급수의 부분합이 어디서 안정적인지 비교한다.", "신호를 저차 근사로 압축할 때 허용 가능한 오차 범위를 정한다."),
  ]),
  course("1학년", 3, "선형대수 기초", "선형대수학 I", [
    chapter("벡터와 선형결합", "linear_algebra_transform", "두 벡터의 선형결합이 평면의 격자를 어떻게 채우는지 본다.", "두 재료 배합 비율로 가능한 색상/성분 조합을 시각화한다."),
    chapter("행렬곱과 선형변환", "linear_algebra_transform", "행렬이 단위정사각형을 평행사변형으로 보내는 과정을 그린다.", "2D 그래픽에서 회전, 확대, 전단 변환을 적용한다."),
    chapter("행렬식과 역행렬", "linear_algebra_transform", "행렬식의 부호와 크기가 면적 배율을 뜻함을 확인한다.", "지도 좌표 변환에서 면적 왜곡률을 계산한다."),
    chapter("고유값과 고유벡터의 첫 만남", "eigen_markov", "반복 적용해도 방향이 유지되는 벡터를 찾는다.", "고객 이동 확률 행렬의 장기 시장점유율을 추정한다."),
  ]),
  course("1학년", 4, "집합과 논리", "집합론 기초", [
    chapter("집합 연산과 포함관계", "set_relation", "합집합, 교집합, 차집합의 원소 수를 비교한다.", "사용자 세그먼트가 겹치는 정도를 계산해 추천 대상을 좁힌다."),
    chapter("관계와 함수", "set_relation", "정의역과 공역 사이의 관계를 행렬로 나타낸다.", "학생-수강과목 관계를 분석해 선수과목 추천 그래프를 만든다."),
    chapter("가산성과 무한집합", "real_sequence", "자연수와 짝수의 일대일 대응을 수열로 표현한다.", "무한히 생성되는 ID 체계를 충돌 없이 세는 방법을 설계한다."),
    chapter("동치관계와 분할", "set_relation", "나머지가 같은 정수들을 동치류로 묶는다.", "우편번호, 나이대, 관심사 같은 분류 체계가 데이터를 어떻게 나누는지 본다."),
  ]),
  course("1학년", 5, "집합과 논리", "논리와 증명", [
    chapter("명제논리와 진리표", "logic_truth", "P이면 Q라는 명제와 그 역, 대우의 진리값을 비교한다.", "접근권한 규칙을 논리식으로 표현해 예외를 찾는다."),
    chapter("술어논리와 양화사", "logic_truth", "모든 x와 어떤 x의 차이를 작은 유한 우주에서 검산한다.", "데이터 품질 조건이 전체 레코드에 적용되는지 자동 점검한다."),
    chapter("직접증명과 대우증명", "logic_truth", "짝수의 제곱은 짝수라는 명제를 대우로 확인한다.", "알고리즘의 실패 조건을 반대로 분석해 안전 조건을 설계한다."),
    chapter("수학적 귀납법과 재귀정의", "combinatorics", "1+...+n 공식이 n에서 n+1로 이어짐을 계산한다.", "재귀적으로 증가하는 비용 모델의 총 비용을 추정한다."),
  ]),
  course("1학년", 6, "이산수학", "이산수학", [
    chapter("조합론과 세기", "combinatorics", "n개 중 k개를 고르는 경우의 수를 Pascal 삼각형으로 확인한다.", "A/B 테스트 조합 수를 세어 실험 설계를 단순화한다."),
    chapter("그래프와 최단경로", "graph_paths", "가중 그래프에서 Dijkstra 방식으로 최단거리를 계산한다.", "배송 네트워크에서 비용이 가장 낮은 경로를 찾는다."),
    chapter("점화식과 생성함수", "combinatorics", "Fibonacci 수열을 점화식과 조합적 경로 수로 연결한다.", "사용자 성장 모델의 누적 규모를 재귀식으로 예측한다."),
    chapter("Boolean 대수와 회로", "logic_truth", "AND, OR, NOT 조합을 진리표로 나타낸다.", "간단한 알람 시스템 조건식을 테스트한다."),
  ]),
  course("1학년", 7, "컴퓨터 활용", "수학을 위한 프로그래밍", [
    chapter("Python 수치 배열과 시각화", "programming_error", "격자 간격을 줄일 때 수치 미분 오차가 어떻게 변하는지 본다.", "센서 샘플링 간격을 정할 때 정확도와 계산량의 균형을 잡는다."),
    chapter("함수형 사고와 재사용 가능한 코드", "programming_error", "같은 수학 함수를 여러 해상도에서 평가하도록 코드를 구조화한다.", "분석 파이프라인의 반복 실험을 함수로 묶어 재현성을 높인다."),
    chapter("난수 시뮬레이션", "probability_distribution", "동전과 주사위 실험을 반복해 경험적 분포를 만든다.", "품질검사에서 불량률 추정의 변동성을 시뮬레이션한다."),
    chapter("수학 실험 재현성", "capstone_project", "난수 seed, 입력, 출력 파일을 고정해 같은 결과가 나오게 한다.", "연구 노트와 그림 산출물을 함께 보존하는 실험 폴더를 설계한다."),
  ]),
  course("1학년", 8, "기초 통계", "기초통계학", [
    chapter("자료 요약과 시각화", "data_analysis", "평균, 중앙값, 산포도를 그래프로 비교한다.", "매출 데이터의 이상치와 계절성을 빠르게 탐색한다."),
    chapter("확률분포의 기초", "probability_distribution", "이항분포와 정규근사를 같은 축에 그린다.", "콜센터의 시간당 문의 건수 변동을 확률분포로 모델링한다."),
    chapter("추정과 신뢰구간", "distribution_inference", "표본평균의 신뢰구간이 표본크기에 따라 좁아짐을 확인한다.", "고객 만족도 평균을 작은 표본으로 추정한다."),
    chapter("상관과 단순회귀", "regression", "산점도와 최소제곱 직선을 함께 그린다.", "광고비와 매출 사이의 관계를 단순 모델로 설명한다."),
  ]),
  course("1학년", 9, "기초 통계", "확률과 통계 입문", [
    chapter("조건부확률과 Bayes 공식", "bayes_coin", "동전의 앞면 확률에 대한 사후분포를 갱신한다.", "검사 양성 결과 이후 실제 질병 확률을 갱신해 해석한다."),
    chapter("이산/연속 확률변수", "probability_distribution", "이산 분포 막대그래프와 연속 밀도곡선을 비교한다.", "재고 수요량과 대기시간을 서로 다른 확률변수로 모델링한다."),
    chapter("중심극한정리", "clt", "원래 분포가 비대칭이어도 표본평균은 정규형에 가까워짐을 본다.", "배송시간 평균을 여러 주문 묶음에서 안정적으로 예측한다."),
    chapter("간단한 가설검정", "distribution_inference", "두 표본 평균 차이가 우연인지 시뮬레이션으로 판단한다.", "새 UI가 기존 UI보다 전환율을 높였는지 평가한다."),
  ]),

  course("2학년", 1, "해석학", "해석학 I", [
    chapter("실수계와 상한공리", "real_sequence", "단조증가하고 위로 유계인 수열의 수렴을 관찰한다.", "반복 개선 알고리즘이 한계값으로 안정되는 이유를 설명한다."),
    chapter("수열과 급수의 수렴", "real_sequence", "부분합과 꼬리합을 그려 수렴/발산을 구분한다.", "캐시된 반복 보정량의 총 오차가 유한한지 판단한다."),
    chapter("극한과 연속의 엄밀화", "epsilon_delta", "epsilon에 맞는 delta 범위를 그래프로 찾는다.", "제어 시스템에서 입력 변화가 출력 변화 한계 안에 머무는지 보장한다."),
    chapter("Compactness 입문", "metric_space", "유한 덮개와 열린공의 직관을 격자로 시각화한다.", "센서 배치가 전체 공간을 빠짐없이 커버하는지 근사 점검한다."),
  ]),
  course("2학년", 2, "해석학", "해석학 II", [
    chapter("미분가능성과 평균값정리", "calculus_derivative", "할선 기울기와 접선 기울기가 같아지는 점을 찾는다.", "구간 평균 속도와 순간 속도를 비교해 과속 구간을 추정한다."),
    chapter("Riemann 적분", "calculus_integral", "상합과 하합이 분할이 촘촘해질수록 가까워짐을 본다.", "불규칙한 생산량 곡선에서 총 생산량을 근사한다."),
    chapter("함수열과 균등수렴", "real_sequence", "함수열의 최대 오차가 전체 구간에서 줄어드는지 확인한다.", "모바일 앱의 근사 모델이 모든 입력 범위에서 안정적인지 점검한다."),
    chapter("멱급수", "calculus_series", "멱급수 부분합과 실제 함수의 오차를 비교한다.", "초소형 장치에서 빠른 함수값 계산을 위해 저차 다항식을 사용한다."),
  ]),
  course("2학년", 3, "선형대수", "선형대수학 II", [
    chapter("벡터공간과 기저", "linear_algebra_transform", "기저가 바뀌면 좌표 표현이 어떻게 달라지는지 본다.", "색 공간 RGB와 다른 색 좌표계 사이의 변환을 이해한다."),
    chapter("내적공간과 직교분해", "functional_projection", "벡터를 부분공간 위 정사영과 잔차로 분해한다.", "노이즈가 섞인 신호를 저차 기저 위로 투영해 압축한다."),
    chapter("고유분해와 대각화", "eigen_markov", "행렬 반복의 장기 방향이 지배 고유벡터로 정렬됨을 본다.", "페이지랭크와 유사한 순위 안정 상태를 추정한다."),
    chapter("특이값분해와 저차원 근사", "machine_learning_math", "2차원 데이터의 주성분 방향을 찾는다.", "고차원 측정값을 정보 손실이 작은 2차원 표현으로 줄인다."),
  ]),
  course("2학년", 4, "미분방정식", "상미분방정식", [
    chapter("1계 방정식과 방향장", "ode_logistic", "로지스틱 성장 방정식의 방향장과 해를 그린다.", "제한된 자원을 갖는 생태계 개체수 변화를 예측한다."),
    chapter("선형시스템과 안정성", "ode_phase", "고정점 주변 궤적이 안정/불안정하게 움직이는지 본다.", "간단한 경제 균형 모형이 충격 후 회복되는지 분석한다."),
    chapter("진동과 강제응답", "math_physics", "질량-스프링 시스템의 위치와 에너지를 시각화한다.", "건물 진동의 공진 위험을 간단한 모형으로 이해한다."),
    chapter("수치해법 Euler/RK", "ode_logistic", "시간 간격에 따른 수치해 오차를 비교한다.", "실험 데이터와 맞추기 위해 빠른 ODE 시뮬레이터를 만든다."),
  ]),
  course("2학년", 5, "대수학 기초", "현대대수학 입문", [
    chapter("군과 부분군", "group_table", "mod n 덧셈군의 Cayley 표를 그린다.", "회전 대칭을 군으로 표현해 패턴 반복을 분석한다."),
    chapter("순환군과 동형", "finite_field", "생성원의 반복으로 모든 원소가 나오는지 확인한다.", "주기적 스케줄이 서로 같은 구조인지 비교한다."),
    chapter("환과 다항식", "ring_polynomial", "다항식의 근과 나눗셈을 시각화한다.", "신호 필터의 영점이 주파수 응답에 미치는 영향을 살핀다."),
    chapter("유한체의 첫 예", "finite_field", "소수 p에 대한 곱셈 역원표를 만든다.", "오류정정 코드와 암호에서 mod 연산이 쓰이는 이유를 본다."),
  ]),
  course("2학년", 6, "확률론", "확률론", [
    chapter("확률공간과 사건", "probability_distribution", "표본공간에서 사건의 상대도수를 시뮬레이션한다.", "보험 사고 발생의 장기 평균을 확률 모형으로 해석한다."),
    chapter("조건부기댓값", "bayes_coin", "관측 정보가 늘어날 때 기대값이 갱신되는 과정을 본다.", "부분 고객 정보만 있을 때 예상 구매액을 갱신한다."),
    chapter("큰수의 법칙", "clt", "반복 시행 평균이 참값에 가까워지는 모습을 그린다.", "품질 공정의 장기 불량률을 안정적으로 추정한다."),
    chapter("Markov chain 기초", "eigen_markov", "상태전이행렬을 반복해 정상분포를 찾는다.", "사용자 이탈/복귀 상태의 장기 비율을 예측한다."),
  ]),
  course("2학년", 7, "수치계산", "수치해석 입문", [
    chapter("오차와 안정성", "programming_error", "격자 간격이 작아질 때 반올림 오차와 절단 오차를 비교한다.", "과학계산에서 신뢰할 수 있는 소수점 자릿수를 추정한다."),
    chapter("방정식의 근", "numerical_root", "이분법과 Newton 방법의 수렴 속도를 비교한다.", "수요와 공급이 만나는 균형가격을 수치적으로 찾는다."),
    chapter("보간과 근사", "numerical_interpolation", "Runge 함수 보간에서 점 배치가 오차에 미치는 영향을 본다.", "센서가 듬성듬성 측정한 값을 연속 곡선으로 복원한다."),
    chapter("수치적분과 미분", "calculus_integral", "사다리꼴 합과 직사각형 합을 비교한다.", "속도 데이터로 이동거리를 계산한다."),
  ]),
  course("2학년", 8, "기하학", "기하학 개론", [
    chapter("Euclidean 구성", "geometry_curve", "점, 직선, 원으로 기본 도형을 구성한다.", "CAD에서 기본 도형 제약 조건을 수학적으로 표현한다."),
    chapter("Affine 변환", "linear_algebra_transform", "평행성과 비율을 보존하는 변환을 그린다.", "사진 보정에서 원근 이전의 평면 변환을 이해한다."),
    chapter("곡선과 곡률", "geometry_curve", "매개곡선의 곡률이 큰 곳과 작은 곳을 색으로 나타낸다.", "도로 설계에서 급커브 구간을 정량화한다."),
    chapter("구면기하 첫걸음", "riemann_geometry", "구면 위 대권 경로를 평면 지도와 비교한다.", "항공 노선이 직선처럼 보이지 않는 이유를 설명한다."),
  ]),

  course("3학년", 1, "복소해석", "복소함수론", [
    chapter("복소수와 복소평면", "complex_map", "복소수 곱셈이 회전과 확대를 동시에 수행함을 본다.", "2D 변환을 복소수 하나로 간결하게 표현한다."),
    chapter("해석함수와 Cauchy-Riemann", "complex_map", "격자가 해석함수 아래에서 각을 보존하는 모습을 관찰한다.", "전기장/유체 흐름의 포텐셜 함수를 시각화한다."),
    chapter("복소 선적분", "contour_integral", "폐곡선 주변의 복소 벡터장을 따라 적분 방향을 본다.", "위상 결함 주변의 순환량을 계산하는 직관을 얻는다."),
    chapter("잔여정리와 응용", "contour_integral", "극점 주변에서 적분값이 국소 정보로 결정됨을 시각화한다.", "진동 적분을 빠르게 평가하는 복소해석 도구를 이해한다."),
  ]),
  course("3학년", 2, "추상대수", "현대대수학 I", [
    chapter("군 작용", "group_table", "작은 군이 집합 위에서 원소를 어떻게 이동시키는지 본다.", "퍼즐 상태공간에서 가능한 움직임을 대칭으로 묶는다."),
    chapter("Sylow 정리의 직관", "group_table", "유한군의 크기와 부분군 크기 관계를 작은 표로 실험한다.", "복잡한 대칭군을 소수 거듭제곱 성분으로 나누어 본다."),
    chapter("환, 아이디얼, 몫환", "ring_polynomial", "mod 다항식에서 같은 나머지를 갖는 원소를 묶는다.", "오류정정 코드에서 다항식 나머지가 신드롬으로 쓰이는 이유를 본다."),
    chapter("다항식의 분해", "ring_polynomial", "실수와 mod p에서 근의 개수가 달라지는 예를 비교한다.", "암호 알고리즘에서 분해가 어려운 구조를 이해한다."),
  ]),
  course("3학년", 3, "추상대수", "현대대수학 II", [
    chapter("가군 입문", "commutative_algebra", "벡터공간을 일반화한 가군의 생성 관계를 그림으로 표현한다.", "선형 제약을 가진 자료 구조를 대수적으로 모델링한다."),
    chapter("체확대", "galois_roots", "유리수에 sqrt(2)를 붙일 때 생기는 켤레 구조를 본다.", "대수방정식 해를 표현하기 위해 필요한 수 체계를 확장한다."),
    chapter("Galois 군", "galois_roots", "다항식 근들의 대칭을 복소평면에서 관찰한다.", "방정식의 풀이 가능성이 근들의 대칭과 연결됨을 이해한다."),
    chapter("표현과 대칭", "group_table", "대칭을 행렬로 표현해 조합하는 과정을 본다.", "분자 진동 모드의 대칭 분류를 간단히 모델링한다."),
  ]),
  course("3학년", 4, "위상수학", "위상수학", [
    chapter("위상공간", "topology_space", "열린집합의 선택이 가까움의 의미를 바꾸는 예를 본다.", "데이터 클러스터의 연결 구조를 거리 기준 없이 비교한다."),
    chapter("연속사상과 위상동형", "topology_space", "찢거나 붙이지 않는 변형이 연결성을 보존함을 시각화한다.", "형태가 다른 센서 배치가 같은 네트워크 구조를 갖는지 판단한다."),
    chapter("콤팩트성과 연결성", "metric_space", "점구름에서 연결 성분과 덮개 크기를 근사한다.", "무선망 커버리지의 빈틈과 연결성을 점검한다."),
    chapter("몫공간", "topology_space", "경계점을 붙이면 원이나 토러스가 되는 과정을 격자로 표현한다.", "게임 맵의 화면 끝이 이어지는 wrap-around 공간을 모델링한다."),
  ]),
  course("3학년", 5, "실해석 심화", "측도론 입문", [
    chapter("시그마 대수와 측도", "measure_integral", "구간을 합치고 빼며 길이가 어떻게 보존되는지 본다.", "불규칙한 지역의 면적을 격자 근사로 추정한다."),
    chapter("가측함수", "measure_integral", "함수값 수준집합을 이용해 가측성을 직관화한다.", "임계값을 넘는 위험 지역의 비율을 계산한다."),
    chapter("Lebesgue 적분", "measure_integral", "x축 분할과 y축 분할 방식의 적분 근사를 비교한다.", "희귀하지만 큰 손실을 갖는 위험 분포의 기대손실을 계산한다."),
    chapter("수렴정리", "real_sequence", "점별수렴과 적분값 수렴이 언제 함께 움직이는지 실험한다.", "점점 정교한 예측모델의 평균 손실이 안정되는지 확인한다."),
  ]),
  course("3학년", 6, "실해석 심화", "실해석학", [
    chapter("거리공간과 완비성", "metric_space", "반복열이 공간 안에서 수렴점을 갖는지 관찰한다.", "반복 최적화가 허용 가능한 해 공간 안에 머무르는지 확인한다."),
    chapter("Banach 수축사상", "metric_space", "수축 반복이 고정점으로 빠르게 모이는 모습을 그린다.", "웹 페이지 순위와 같은 반복 갱신 알고리즘의 수렴을 설명한다."),
    chapter("Lp 공간 입문", "functional_projection", "함수 차이를 L2 노름으로 재고 정사영한다.", "신호 압축에서 에너지 기준 오차를 최소화한다."),
    chapter("미분과 적분의 연결", "measure_integral", "누적분포와 밀도의 관계를 수치적으로 확인한다.", "대기오염 농도 변화율과 누적 노출량을 연결한다."),
  ]),
  course("3학년", 7, "편미분방정식", "편미분방정식", [
    chapter("열방정식", "pde_heat", "1차원 막대의 온도 확산을 유한차분으로 계산한다.", "칩 표면의 열이 시간에 따라 퍼지는 양상을 모델링한다."),
    chapter("파동방정식", "pde_wave", "줄의 초기 변위가 양쪽으로 전파되는 모습을 본다.", "현악기 줄의 진동을 간단한 수치모형으로 이해한다."),
    chapter("Laplace 방정식", "pde_heat", "경계값이 내부 평형 상태를 결정하는 모습을 반복법으로 본다.", "정전기 포텐셜이나 정상상태 온도장을 근사한다."),
    chapter("경계조건과 안정성", "pde_heat", "시간 간격이 너무 크면 수치해가 불안정해지는 예를 비교한다.", "시뮬레이션 시간 간격을 안전하게 선택한다."),
  ]),
  course("3학년", 8, "수치해석", "수치해석", [
    chapter("비선형 방정식", "numerical_root", "Newton 방법의 초기값 민감도를 시각화한다.", "금융 상품의 내부수익률을 수치적으로 구한다."),
    chapter("최소제곱과 QR", "least_squares", "노이즈 자료에 직선을 맞추고 잔차를 분석한다.", "실험 측정값에서 물리 상수를 추정한다."),
    chapter("수치선형대수", "numerical_linear", "조건수가 큰 행렬에서 해가 얼마나 흔들리는지 본다.", "센서 보정 행렬이 불안정한지 진단한다."),
    chapter("ODE/PDE 수치해법", "pde_heat", "격자 해상도와 안정조건이 결과에 미치는 영향을 본다.", "실시간 물리 시뮬레이션의 정확도와 속도 균형을 잡는다."),
  ]),
  course("3학년", 9, "통계수학", "수리통계학", [
    chapter("가능도와 추정량", "distribution_inference", "가능도 곡선의 최대점을 통해 추정량을 찾는다.", "클릭률 같은 비율 파라미터를 데이터로 추정한다."),
    chapter("표본분포", "clt", "같은 모집단에서 많은 표본평균을 뽑아 분포를 만든다.", "조사 표본 수가 오차에 미치는 영향을 설명한다."),
    chapter("가설검정", "distribution_inference", "귀무가설 아래 검정통계량 분포를 시뮬레이션한다.", "실험군과 대조군 차이가 실제인지 판단한다."),
    chapter("지수족", "bayesian_statistics", "공액 사전분포가 계산을 단순화하는 모습을 본다.", "온라인 실험에서 베이지안 업데이트를 빠르게 수행한다."),
  ]),
  course("3학년", 10, "최적화", "최적화 이론", [
    chapter("볼록집합과 볼록함수", "optimization_gradient", "볼록 함수의 등고선과 최솟값을 그린다.", "손실함수가 볼록하면 전역 최적해를 안정적으로 찾는 이유를 본다."),
    chapter("경사하강법", "optimization_gradient", "학습률에 따른 수렴 궤적을 비교한다.", "머신러닝 모델 파라미터를 반복적으로 개선한다."),
    chapter("제약최적화와 KKT", "linear_programming", "가능영역 경계에서 최적해가 생기는 예를 본다.", "예산과 자원 제약 아래 생산량을 결정한다."),
    chapter("쌍대성", "linear_programming", "원문제와 쌍대문제의 목적값 관계를 시각화한다.", "자원의 그림자가격을 해석해 의사결정에 활용한다."),
  ]),
  course("3학년", 11, "최적화", "선형계획법", [
    chapter("가능영역", "linear_programming", "2변수 선형부등식이 만드는 다각형을 그린다.", "노동시간과 원료 제한 아래 최대 이익 조합을 찾는다."),
    chapter("Simplex 아이디어", "linear_programming", "꼭짓점을 따라 목적값이 개선되는 과정을 본다.", "생산계획 문제에서 후보 해를 체계적으로 탐색한다."),
    chapter("쌍대 선형계획", "linear_programming", "제약의 가치가 목적값에 미치는 영향을 해석한다.", "물류 자원의 한 단위 추가 가치인 그림자가격을 계산한다."),
    chapter("수송과 네트워크 흐름", "graph_paths", "공급지와 수요지 사이 비용 그래프를 분석한다.", "배송센터 간 물량 배분 비용을 줄인다."),
  ]),
  course("3학년", 12, "기하", "미분기하학 입문", [
    chapter("매개곡선", "geometry_curve", "곡선의 속도, 접선, 곡률을 함께 그린다.", "로봇 경로가 너무 급격히 꺾이는 지점을 찾는다."),
    chapter("곡면과 제1기본형", "riemann_geometry", "곡면 위 거리 측정이 평면과 달라지는 모습을 본다.", "지구 표면 위 실제 이동거리 계산을 이해한다."),
    chapter("곡률", "geometry_curve", "곡률이 큰 구간을 색상으로 표시한다.", "도로와 철도 설계에서 안전 곡률 반경을 판단한다."),
    chapter("측지선 직관", "riemann_geometry", "구면 위 대권이 가장 짧은 경로 후보가 됨을 그린다.", "항공기 장거리 항로가 곡선처럼 보이는 이유를 설명한다."),
  ]),

  course("4학년", 1, "해석학 심화", "함수해석학", [
    chapter("노름공간과 선형작용소", "functional_projection", "함수 공간에서 노름과 정사영을 계산한다.", "신호 처리에서 필터를 선형작용소로 해석한다."),
    chapter("Hilbert 공간", "functional_projection", "직교기저에 대한 계수와 재구성을 시각화한다.", "오디오 신호를 직교 성분으로 분해해 압축한다."),
    chapter("콤팩트 작용소", "eigen_markov", "고유값이 작아지는 작용소의 저차 근사를 본다.", "영상/신호에서 주요 모드만 남겨 잡음을 줄인다."),
    chapter("스펙트럼 직관", "functional_projection", "작용소의 고유성분이 동역학을 어떻게 나누는지 본다.", "진동 시스템의 모드 분석을 수학적으로 이해한다."),
  ]),
  course("4학년", 2, "해석학 심화", "푸리에 해석", [
    chapter("Fourier 급수", "fourier_series", "사각파를 사인파들의 합으로 근사한다.", "주기 신호를 주파수 성분으로 분해한다."),
    chapter("Fourier 변환", "fourier_series", "시간 영역과 주파수 영역의 표현을 비교한다.", "소리 신호에서 특정 주파수 대역을 분석한다."),
    chapter("합성곱과 필터링", "data_analysis", "이동평균 필터가 고주파 변동을 줄이는 모습을 본다.", "시계열 노이즈를 제거해 추세를 더 명확히 만든다."),
    chapter("PDE의 Fourier 방법", "pde_heat", "초기 조건을 주파수 모드별로 확산시키는 과정을 본다.", "열 확산 문제를 빠르게 근사하는 해법을 이해한다."),
  ]),
  course("4학년", 3, "대수학 심화", "가환대수", [
    chapter("아이디얼과 대수다양체", "commutative_algebra", "다항식이 0이 되는 점들의 집합을 그린다.", "기하 제약을 다항식 방정식으로 모델링한다."),
    chapter("국소화", "commutative_algebra", "한 점 근처에서만 보이는 대수적 정보를 분리해 본다.", "복잡한 곡선을 국소 조각으로 나누어 분석한다."),
    chapter("Noetherian 환", "commutative_algebra", "생성 관계가 유한하게 멈추는 구조를 예로 본다.", "알고리즘이 유한 단계의 기저 계산으로 끝나는 이유를 이해한다."),
    chapter("Groebner 기저 직관", "commutative_algebra", "다항식 연립방정식의 소거 순서를 시각화한다.", "로봇팔 역기구학의 다항 제약을 풀기 위한 관점을 얻는다."),
  ]),
  course("4학년", 4, "대수학 심화", "갈루아 이론", [
    chapter("체확대", "galois_roots", "새 근을 추가할 때 수 체계가 확장되는 모습을 본다.", "방정식 풀이에 필요한 수의 범위를 체계적으로 추적한다."),
    chapter("분해체", "galois_roots", "다항식의 모든 근이 들어가는 최소 공간을 복소평면에서 본다.", "필터의 모든 극점/영점을 포함하는 해석 공간을 이해한다."),
    chapter("Galois 대응", "galois_roots", "부분군과 중간체의 대응을 작은 예로 표현한다.", "대칭을 이용해 방정식의 숨은 구조를 분류한다."),
    chapter("근호로 풀 수 있음", "galois_roots", "근들의 대칭이 너무 복잡하면 일반 공식이 막히는 직관을 본다.", "5차 방정식 일반해가 없는 이유의 구조적 배경을 이해한다."),
  ]),
  course("4학년", 5, "기하학 심화", "미분기하학", [
    chapter("다양체와 좌표계", "riemann_geometry", "구면을 여러 좌표 패치로 덮는 그림을 본다.", "지구 좌표계의 특이점과 지도 투영 문제를 이해한다."),
    chapter("접공간과 미분형식", "geometry_curve", "곡선 위 접벡터가 공간에 붙어 움직이는 모습을 그린다.", "로봇이나 드론의 순간 속도 공간을 모델링한다."),
    chapter("연결과 곡률", "riemann_geometry", "구면 위 벡터를 평행이동하면 방향이 달라지는 효과를 본다.", "지구 표면 장거리 이동에서 방향 변화가 누적되는 이유를 설명한다."),
    chapter("측지 흐름", "riemann_geometry", "초기 방향이 다른 측지선들이 어떻게 퍼지는지 본다.", "곡면 위 최단 경로 탐색 알고리즘의 직관을 얻는다."),
  ]),
  course("4학년", 6, "기하학 심화", "리만기하학", [
    chapter("Riemannian 계량", "riemann_geometry", "위치에 따라 길이 측정 방식이 달라지는 예를 그린다.", "불균일한 비용 지형에서 최단 비용 경로를 해석한다."),
    chapter("측지선 방정식", "riemann_geometry", "구면 위 측지선 후보를 수치적으로 비교한다.", "항공/항해 경로가 대권을 따르는 이유를 계산한다."),
    chapter("곡률 텐서 직관", "riemann_geometry", "작은 삼각형 각의 합이 곡률에 따라 달라지는 예를 본다.", "곡률이 있는 공간에서 평면 기하 공식이 왜 달라지는지 이해한다."),
    chapter("비교기하 예제", "riemann_geometry", "평면, 구면, 쌍곡적 형태의 거리 성장을 비교한다.", "네트워크 임베딩에서 공간 곡률 선택이 미치는 영향을 본다."),
  ]),
  course("4학년", 7, "위상수학 심화", "대수적 위상수학", [
    chapter("단체복합체", "algebraic_topology", "점, 변, 삼각형으로 공간을 근사한다.", "센서 네트워크의 커버리지 구멍을 단체복합체로 탐지한다."),
    chapter("기본군", "topology_space", "고리 모양 공간에서 수축되지 않는 루프를 그린다.", "장애물이 있는 로봇 경로 공간의 서로 다른 루프 유형을 구분한다."),
    chapter("호몰로지", "algebraic_topology", "구멍 수를 Euler 지표와 함께 계산한다.", "이미지나 점군 데이터에서 빈 영역을 정량화한다."),
    chapter("Euler 지표", "algebraic_topology", "V-E+F가 형태 정보를 담는 예를 계산한다.", "메시 모델의 위상 오류를 빠르게 점검한다."),
  ]),
  course("4학년", 8, "확률·통계 심화", "확률과정", [
    chapter("랜덤워크와 Brownian 운동", "stochastic_process", "무작위 보행 경로와 분산 증가를 시각화한다.", "주가나 입자 이동의 불확실한 궤적을 모델링한다."),
    chapter("Poisson 과정", "stochastic_process", "시간에 따라 사건 발생 횟수가 증가하는 계단함수를 그린다.", "콜센터 문의나 서버 장애 발생을 시간 과정으로 분석한다."),
    chapter("Markov chain", "eigen_markov", "전이행렬 반복으로 정상분포를 찾는다.", "구독자 상태 전환의 장기 비율을 예측한다."),
    chapter("마팅게일 입문", "stochastic_process", "공정한 게임의 조건부 기대값이 일정한지 시뮬레이션한다.", "금융 가격 모형에서 무차익 조건의 기본 직관을 얻는다."),
  ]),
  course("4학년", 9, "확률·통계 심화", "회귀분석", [
    chapter("선형회귀", "regression", "최소제곱 직선과 잔차를 함께 그린다.", "광고비, 가격, 노출수가 매출에 미치는 영향을 추정한다."),
    chapter("다중회귀와 진단", "regression", "잔차 패턴으로 모델 가정을 점검한다.", "주택가격 모델에서 변수별 설명력을 비교한다."),
    chapter("정규화", "machine_learning_math", "가중치 크기에 벌점을 주면 모델이 어떻게 단순해지는지 본다.", "고차원 특성에서 과적합을 줄인다."),
    chapter("예측과 해석의 균형", "regression", "예측오차와 계수 해석 가능성을 비교한다.", "정책 효과 분석과 순수 예측 문제를 구분한다."),
  ]),
  course("4학년", 10, "확률·통계 심화", "베이지안 통계", [
    chapter("공액 사전분포", "bayesian_statistics", "Beta-Binomial 갱신을 그림으로 확인한다.", "작은 표본의 전환율을 안정적으로 추정한다."),
    chapter("사후예측분포", "bayesian_statistics", "미래 관측값의 불확실성을 사후분포로부터 시뮬레이션한다.", "다음 캠페인 성과 범위를 확률적으로 예측한다."),
    chapter("MCMC 직관", "stochastic_process", "목표분포를 따라 움직이는 무작위 경로를 본다.", "직접 계산하기 어려운 사후분포를 샘플로 근사한다."),
    chapter("Bayesian 의사결정", "bayesian_statistics", "손실함수에 따라 최적 행동이 달라짐을 비교한다.", "검사 비용과 오판 비용을 함께 고려해 의사결정을 한다."),
  ]),
  course("4학년", 11, "응용수학", "수리물리", [
    chapter("변분원리", "math_physics", "작용을 최소화하는 경로의 직관을 본다.", "빛의 경로와 최단시간 원리를 수학적으로 해석한다."),
    chapter("조화진동자", "math_physics", "위치, 속도, 에너지의 주기적 교환을 시각화한다.", "스프링, 회로, 분자 진동을 같은 수학 구조로 본다."),
    chapter("열과 파동 모형", "pde_wave", "열 확산과 파동 전파의 차이를 비교한다.", "재료 내부 온도와 진동 전달을 모델링한다."),
    chapter("양자 선형대수", "eigen_markov", "상태 벡터와 관측 가능한 고유모드를 연결한다.", "간단한 2상태 시스템의 에너지 수준을 이해한다."),
  ]),
  course("4학년", 12, "응용수학", "계산수학", [
    chapter("Monte Carlo 방법", "computational_math", "무작위 표본으로 면적과 기대값을 추정한다.", "고차원 적분을 확률적 샘플링으로 근사한다."),
    chapter("유한차분", "pde_heat", "미분연산자를 격자 차분으로 바꾼다.", "연속 물리 현상을 컴퓨터 격자 위에서 계산한다."),
    chapter("희소 선형시스템", "numerical_linear", "희소 구조가 계산량을 줄이는 이유를 시각화한다.", "대규모 네트워크 방정식을 효율적으로 푼다."),
    chapter("계산실험 설계", "capstone_project", "입력, 알고리즘, 출력, 평가 기준을 실험 카드로 정리한다.", "논문 결과를 재현 가능한 코드 실험으로 옮긴다."),
  ]),
  course("4학년", 13, "응용수학", "금융수학", [
    chapter("복리와 무차익", "financial_math", "할인계수와 현재가치를 계산한다.", "서로 다른 현금흐름을 같은 시점 가치로 비교한다."),
    chapter("옵션 payoff", "financial_math", "콜/풋 옵션의 만기 payoff를 그린다.", "헤지 전략의 손익구조를 시각적으로 이해한다."),
    chapter("Black-Scholes 시뮬레이션", "financial_math", "기하 Brownian 운동으로 주가 경로를 생성한다.", "옵션 가격과 위험을 Monte Carlo로 추정한다."),
    chapter("위험측도", "financial_math", "VaR와 Expected Shortfall을 표본분포에서 계산한다.", "포트폴리오 손실의 꼬리위험을 관리한다."),
  ]),
  course("4학년", 14, "데이터·AI 관련", "머신러닝 수학", [
    chapter("손실함수와 벡터화", "machine_learning_math", "벡터화된 계산으로 손실과 그래디언트를 계산한다.", "대량 데이터 학습에서 반복 계산을 빠르게 처리한다."),
    chapter("PCA와 SVD", "machine_learning_math", "공분산의 주성분 방향으로 데이터를 투영한다.", "고차원 데이터를 2차원으로 줄여 구조를 파악한다."),
    chapter("로지스틱 회귀 그래디언트", "machine_learning_math", "분류 경계가 학습되며 움직이는 모습을 본다.", "스팸 여부나 이탈 가능성을 확률로 예측한다."),
    chapter("커널과 특징공간", "functional_projection", "비선형 데이터를 높은 차원 특징으로 보면 분리 가능해짐을 본다.", "복잡한 패턴 분류에서 선형 방법을 확장한다."),
  ]),
  course("4학년", 15, "데이터·AI 관련", "데이터분석", [
    chapter("데이터 정리와 EDA", "data_analysis", "결측, 이상치, 분포를 한 번에 살펴본다.", "서비스 지표 대시보드에서 이상 징후를 찾는다."),
    chapter("시계열 기초", "data_analysis", "추세, 계절성, 잡음을 분리해 그린다.", "월별 매출 예측을 위한 기본 구조를 만든다."),
    chapter("차원축소", "machine_learning_math", "PCA로 주요 변동 방향을 찾는다.", "고객 특성 데이터를 2차원 맵으로 탐색한다."),
    chapter("분석 결과 전달", "data_analysis", "핵심 지표와 불확실성을 함께 시각화한다.", "의사결정자가 바로 볼 수 있는 분석 요약 그래프를 만든다."),
  ]),
  course("4학년", 16, "데이터·AI 관련", "고급 최적화", [
    chapter("Proximal gradient", "optimization_gradient", "L1 벌점이 희소한 해를 만드는 과정을 본다.", "특성 선택이 필요한 회귀 모델을 학습한다."),
    chapter("확률적 최적화", "machine_learning_math", "미니배치 그래디언트의 흔들림과 수렴을 비교한다.", "대규모 데이터에서 빠른 학습 업데이트를 수행한다."),
    chapter("Interior point 직관", "linear_programming", "가능영역 내부에서 장벽함수가 경계를 피하게 함을 본다.", "대규모 제약 문제를 안정적으로 푸는 관점을 얻는다."),
    chapter("Optimal transport 직관", "linear_programming", "질량을 한 분포에서 다른 분포로 옮기는 비용을 생각한다.", "이미지 색상 분포나 공급망 물류를 비교한다."),
  ]),
  course("4학년", 17, "졸업연구", "세미나·캡스톤·졸업논문", [
    chapter("논문 읽기", "capstone_project", "정리, 가정, 증명 전략, 실험을 카드로 분해한다.", "관심 연구 분야의 핵심 논문을 재현 가능한 노트로 정리한다."),
    chapter("연구질문 만들기", "capstone_project", "정의, 예제, 반례, 실험 가능성을 기준으로 질문을 좁힌다.", "작은 데이터나 모형으로 검증 가능한 졸업논문 주제를 만든다."),
    chapter("실험과 재현성", "capstone_project", "seed, 데이터, 환경, 산출물을 함께 기록한다.", "동료가 같은 그림과 수치를 다시 만들 수 있게 한다."),
    chapter("글쓰기와 발표", "capstone_project", "문제, 방법, 결과, 한계를 한 장 흐름으로 구성한다.", "캡스톤 발표에서 수학적 핵심과 실제 의미를 함께 전달한다."),
  ]),
];

function slug(text) {
  return text
    .normalize("NFC")
    .replace(/[\\/:*?"<>|]/g, "")
    .replace(/[·,()]/g, "")
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_");
}

function writeFile(filePath, content) {
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, content.trimEnd() + "\n", "utf8");
}

function courseDirName(c) {
  return `${String(c.number).padStart(2, "0")}_${slug(c.name)}`;
}

function chapterDirName(index, ch) {
  return `ch${String(index + 1).padStart(2, "0")}_${slug(ch.title)}`;
}

function pythonString(value) {
  return JSON.stringify(value);
}

function chapterPython(courseName, ch) {
  return `# -*- coding: utf-8 -*-
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT / "common"))

from math_viz import run_profile


if __name__ == "__main__":
    run_profile(
        profile=${pythonString(ch.profile)},
        title=${pythonString(`${courseName} - ${ch.title}`)},
        concept=${pythonString(ch.basic)},
        application=${pythonString(ch.applied)},
        output_dir=Path(__file__).with_name("outputs"),
    )
`;
}

function chapterReadme(c, ch, index) {
  const ideas = ch.concepts.length > 0 ? ch.concepts : profileIdeas[ch.profile] ?? [];
  const conceptLines = ideas.map((item) => `- ${item}`).join("\n");
  return `# ${c.name} ${String(index + 1).padStart(2, "0")}. ${ch.title}

## 학습 목표
- ${ch.title}의 핵심 정의와 정리를 말로 설명한다.
- 손계산 가능한 작은 예제로 계산 과정을 검산한다.
- Python 시각화로 연속적인 개념을 필요한 만큼 이산화해 확인한다.

## 핵심 개념
${conceptLines}

## 기본 개념 예제
${ch.basic}

## 실제 응용 예제
${ch.applied}

## 코딩 실습
- 파일: \`visualize.py\`
- 실행: \`python visualize.py\`
- 결과: \`outputs/visualization.png\`가 생성된다.

## 확장 과제
- 코드의 함수, 파라미터, 표본 수, 격자 크기를 바꾸어 결론이 얼마나 안정적인지 확인한다.
- 직접 손으로 계산한 작은 사례와 Python 결과가 일치하는지 비교한다.
`;
}

function courseReadme(c) {
  const chapterList = c.chapters
    .map((ch, i) => `- ${String(i + 1).padStart(2, "0")}. [${ch.title}](./${chapterDirName(i, ch)}/README.md)`)
    .join("\n");
  return `# ${c.name}

- 학년: ${c.year}
- 영역: ${c.area}

## 구성
${chapterList}

## 공부 방법
1. 각 챕터의 \`README.md\`에서 정의, 예제, 응용 예제를 먼저 읽는다.
2. 같은 폴더의 \`visualize.py\`를 실행해 그림을 만든다.
3. 코드의 파라미터를 바꾸며 정의가 실제 계산에서 어떻게 나타나는지 확인한다.
`;
}

function markdownCell(source) {
  return { cell_type: "markdown", metadata: {}, source };
}

function codeCell(source) {
  return { cell_type: "code", execution_count: null, metadata: {}, outputs: [], source };
}

function chapterRelativePath(c, index, ch) {
  return `${yearDirs[c.year]}/${courseDirName(c)}/${chapterDirName(index, ch)}`;
}

function chapterNotebook(c, ch, index) {
  const ideas = ch.concepts.length > 0 ? ch.concepts : profileIdeas[ch.profile] ?? [];
  const conceptLines = ideas.map((item) => `- ${item}`).join("\n");
  const relPath = chapterRelativePath(c, index, ch);
  const notebook = {
    cells: [
      markdownCell(`# ${c.name} ${String(index + 1).padStart(2, "0")}. ${ch.title}

## 학습 목표
- 핵심 정의와 정리를 자신의 말로 설명한다.
- 기본 개념 예제를 손계산으로 확인한다.
- Python 코드와 시각화를 통해 직관을 검산한다.

## 핵심 개념
${conceptLines}

## 기본 개념 예제
${ch.basic}

## 실제 응용 예제
${ch.applied}`),
      markdownCell(`## 0. 실행 준비

아래 셀은 프로젝트 루트의 \`common/math_viz.py\`를 찾아서 현재 챕터의 출력 폴더를 자동으로 설정합니다. Jupyter Lab을 프로젝트 루트에서 열면 가장 안정적으로 동작합니다.`),
      codeCell(`from pathlib import Path
import sys
from IPython.display import Image, display


CHAPTER_RELATIVE_DIR = Path(${pythonString(relPath)})


def find_project_root(start: Path) -> Path:
    for candidate in [start, *start.parents]:
        if (candidate / "common" / "math_viz.py").exists():
            return candidate
    raise RuntimeError("common/math_viz.py를 찾지 못했습니다. Jupyter Lab을 프로젝트 루트에서 열어 주세요.")


ROOT = find_project_root(Path.cwd().resolve())
NOTEBOOK_DIR = ROOT / CHAPTER_RELATIVE_DIR
OUTPUT_DIR = NOTEBOOK_DIR / "outputs"
sys.path.insert(0, str(ROOT / "common"))

from math_viz import PROFILES, run_profile

PROFILE = ${pythonString(ch.profile)}
TITLE = ${pythonString(`${c.name} - ${ch.title}`)}
CONCEPT_EXAMPLE = ${pythonString(ch.basic)}
APPLICATION_EXAMPLE = ${pythonString(ch.applied)}

print("project root:", ROOT)
print("chapter dir:", NOTEBOOK_DIR)
print("profile:", PROFILE)`),
      markdownCell(`## 1. 이번 챕터의 시각화 코드 읽기

먼저 실제로 실행될 함수를 확인합니다. 코드를 읽으면서 입력값, 이산화 방식, 그래프가 의미하는 수학적 대상을 표시해 보세요.`),
      codeCell(`import inspect

print(inspect.getsource(PROFILES[PROFILE]))`),
      markdownCell(`## 2. 실행하고 결과 확인하기

아래 셀을 실행하면 \`outputs/visualization.png\`가 생성되고, 노트북 안에도 바로 표시됩니다.`),
      codeCell(`run_profile(
    profile=PROFILE,
    title=TITLE,
    concept=CONCEPT_EXAMPLE,
    application=APPLICATION_EXAMPLE,
    output_dir=OUTPUT_DIR,
)

display(Image(filename=str(OUTPUT_DIR / "visualization.png")))`),
      markdownCell(`## 3. 변형 실험

- 표본 수, 격자 크기, 초기값, 학습률, 경계조건 중 하나를 바꿔 보세요.
- 그림이 안정적으로 유지되는 범위와 결론이 바뀌는 범위를 나누어 적어 보세요.
- 손계산 가능한 작은 예제를 만들어 코드 결과와 비교해 보세요.`),
      codeCell(`# 여기에 자신만의 변형 실험을 작성하세요.
# 예: common/math_viz.py에서 위에 출력된 함수의 파라미터를 복사해 와서
#     표본 수, 구간, 초기값 등을 바꾼 뒤 다시 그려 볼 수 있습니다.
`),
    ],
    metadata: {
      kernelspec: {
        display_name: "Python 3",
        language: "python",
        name: "python3",
      },
      language_info: {
        name: "python",
        pygments_lexer: "ipython3",
      },
    },
    nbformat: 4,
    nbformat_minor: 5,
  };
  return JSON.stringify(notebook, null, 2);
}

function chapterReadmeNotebook(c, ch, index) {
  return `# ${c.name} ${String(index + 1).padStart(2, "0")}. ${ch.title}

이 챕터는 Jupyter notebook으로 공부하도록 구성되어 있습니다.

## 파일
- \`notebook.ipynb\`: 개념 설명, 코드 읽기, 실행, 변형 실험
- \`outputs/\`: 노트북 실행 후 생성되는 그림 저장 위치

## 예제 구성
- 기본 개념 예제: ${ch.basic}
- 실제 응용 예제: ${ch.applied}

## 실행
\`\`\`powershell
jupyter lab
\`\`\`

Jupyter Lab에서 이 폴더의 \`notebook.ipynb\`를 열고 위에서 아래로 실행하세요.
`;
}

function courseReadmeNotebook(c) {
  const chapterList = c.chapters
    .map((ch, i) => `- ${String(i + 1).padStart(2, "0")}. [${ch.title}](./${chapterDirName(i, ch)}/notebook.ipynb)`)
    .join("\n");
  return `# ${c.name}

- 학년: ${c.year}
- 영역: ${c.area}

## 챕터 노트북
${chapterList}

## 공부 방법
1. 각 챕터의 \`notebook.ipynb\`를 연다.
2. Markdown 설명을 읽고 기본 예제를 손으로 먼저 계산한다.
3. 코드 셀을 순서대로 실행하며 그림을 해석한다.
4. 마지막 변형 실험 셀에서 파라미터를 바꾸어 결론의 안정성을 확인한다.
`;
}

function rootReadmeNotebook() {
  const byYear = Object.keys(yearDirs)
    .map((year) => {
      const items = courses
        .filter((c) => c.year === year)
        .map((c) => `- [${c.name}](./${yearDirs[year]}/${courseDirName(c)}/README.md)`)
        .join("\n");
      return `## ${yearDirs[year]}\n${items}`;
    })
    .join("\n\n");

  return `# 대학교 수학 1-4학년 Jupyter Lab 커리큘럼

이 폴더는 1학년 기초 수학부터 4학년 심화/연구 주제까지 과목별, 챕터별로 공부할 수 있도록 구성한 Jupyter notebook 학습 프로젝트입니다. 각 챕터의 \`notebook.ipynb\`에는 한국어 학습 노트, 기본 개념 예제, 실제 응용 예제, Python 시각화 코드가 들어 있습니다.

## 빠른 시작
\`\`\`powershell
cd "대학교_수학_커리큘럼"
pip install -r requirements.txt
jupyter lab
\`\`\`

Jupyter Lab이 열리면 예를 들어 아래 파일부터 시작하세요.

\`\`\`text
1학년_기초_수학과_증명_입문/01_미적분학_I/ch01_함수와_극한/notebook.ipynb
\`\`\`

전체 노트북을 일괄 실행해 검산하려면:

\`\`\`powershell
python scripts/run_all_notebooks.py
\`\`\`

## 권장 학습 루틴
1. 노트북의 개념 설명을 읽고 정의를 직접 적어 본다.
2. 기본 개념 예제를 손으로 계산한다.
3. 코드 셀을 실행하고 생성된 그림을 해석한다.
4. 마지막 셀에서 파라미터를 바꿔 작은 실험을 만든다.
5. 모르는 정리나 증명은 별도 노트에 “정의-정리-예제-반례” 형식으로 정리한다.

${byYear}
`;
}

function rootReadme() {
  const byYear = Object.keys(yearDirs)
    .map((year) => {
      const items = courses
        .filter((c) => c.year === year)
        .map((c) => `- [${c.name}](./${yearDirs[year]}/${courseDirName(c)}/README.md)`)
        .join("\n");
      return `## ${yearDirs[year]}\n${items}`;
    })
    .join("\n\n");

  return `# 대학교 수학 1-4학년 학습 커리큘럼

이 폴더는 1학년 기초 수학부터 4학년 심화/연구 주제까지 과목별, 챕터별로 공부할 수 있도록 구성한 학습 프로젝트입니다. 각 챕터에는 한국어 학습 노트와 Python 시각화 코드가 함께 들어 있습니다.

## 빠른 시작
\`\`\`powershell
cd "대학교_수학_커리큘럼"
pip install -r requirements.txt
python "1학년_기초_수학과_증명_입문/01_미적분학_I/ch01_함수와_극한/visualize.py"
\`\`\`

전체 예제를 한 번에 실행하려면:

\`\`\`powershell
python scripts/run_all_examples.py
\`\`\`

## 권장 학습 루틴
1. 챕터 \`README.md\`를 읽고 정의를 직접 적어 본다.
2. 기본 개념 예제를 손으로 계산한다.
3. \`visualize.py\`를 실행하고 생성된 그림을 해석한다.
4. 응용 예제의 파라미터를 바꾸어 작은 실험을 만든다.
5. 모르는 정리나 증명은 별도 노트에 “정의-정리-예제-반례” 형식으로 정리한다.

${byYear}
`;
}

const mathVizPy = String.raw`# -*- coding: utf-8 -*-
from __future__ import annotations

from pathlib import Path
import math
import numpy as np

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt


RNG = np.random.default_rng(42)


def _save(fig, output_dir: Path, name: str = "visualization.png") -> Path:
    output_dir.mkdir(parents=True, exist_ok=True)
    path = output_dir / name
    fig.tight_layout()
    fig.savefig(path, dpi=160)
    plt.close(fig)
    print(f"saved: {path}")
    return path


def _style(ax, title: str | None = None) -> None:
    if title:
        ax.set_title(title)
    ax.grid(True, alpha=0.25)


def _normal_pdf(x, mu=0.0, sigma=1.0):
    return np.exp(-0.5 * ((x - mu) / sigma) ** 2) / (sigma * np.sqrt(2 * np.pi))


def _comb(n, k):
    if k < 0 or k > n:
        return 0
    return math.comb(int(n), int(k))


def calculus_limit(output_dir: Path):
    x = np.r_[np.linspace(-1.0, -0.04, 240), np.linspace(0.04, 1.0, 240)]
    y = np.sin(x) / x
    eps = [0.3, 0.15, 0.07]
    fig, ax = plt.subplots(figsize=(7, 4.5))
    ax.plot(x, y, label="sin(x)/x")
    ax.axhline(1, color="black", linestyle="--", linewidth=1, label="limit = 1")
    for e in eps:
        ax.fill_between(x, 1 - e, 1 + e, where=np.abs(x) < 0.35, alpha=0.08, label=f"epsilon={e}")
    ax.set_xlabel("x")
    ax.set_ylabel("value")
    _style(ax, "Limit by local zoom")
    ax.legend(fontsize=8)
    _save(fig, output_dir)


def calculus_derivative(output_dir: Path):
    f = lambda x: x**3 - x
    df = lambda x: 3 * x**2 - 1
    x0 = 0.8
    xs = np.linspace(-1.4, 1.4, 400)
    tangent = f(x0) + df(x0) * (xs - x0)
    h = np.logspace(-4, -0.2, 80)
    err = np.abs((f(x0 + h) - f(x0)) / h - df(x0))
    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    axes[0].plot(xs, f(xs), label="f(x)=x^3-x")
    axes[0].plot(xs, tangent, "--", label="tangent")
    axes[0].scatter([x0], [f(x0)], color="crimson")
    _style(axes[0], "Derivative as tangent")
    axes[0].legend(fontsize=8)
    axes[1].loglog(h, err)
    axes[1].set_xlabel("h")
    axes[1].set_ylabel("finite difference error")
    _style(axes[1], "Numerical derivative error")
    _save(fig, output_dir)


def calculus_integral(output_dir: Path):
    f = lambda x: 0.4 + np.sin(x) ** 2 + 0.15 * x
    xs = np.linspace(0, 6, 500)
    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    axes[0].plot(xs, f(xs), color="black")
    n = 18
    left = np.linspace(0, 6, n, endpoint=False)
    dx = 6 / n
    axes[0].bar(left, f(left), width=dx, align="edge", alpha=0.35, edgecolor="tab:blue", label="Riemann rectangles")
    axes[0].fill_between(xs, 0, f(xs), alpha=0.12)
    _style(axes[0], "Integral as accumulated area")
    axes[0].legend(fontsize=8)
    ns = np.arange(5, 151, 5)
    estimates = []
    for m in ns:
        left_m = np.linspace(0, 6, m, endpoint=False)
        estimates.append(np.sum(f(left_m)) * 6 / m)
    true_est = np.trapz(f(xs), xs)
    axes[1].plot(ns, estimates, label="left sum")
    axes[1].axhline(true_est, color="black", linestyle="--", label="fine-grid trapz")
    axes[1].set_xlabel("number of intervals")
    axes[1].set_ylabel("area")
    _style(axes[1], "Convergence of sums")
    axes[1].legend(fontsize=8)
    _save(fig, output_dir)


def calculus_series(output_dir: Path):
    xs = np.linspace(-2.5, 2.5, 500)
    fig, ax = plt.subplots(figsize=(7, 4.5))
    ax.plot(xs, np.sin(xs), color="black", label="sin(x)")
    for order in [1, 3, 5, 7]:
        approx = np.zeros_like(xs)
        for k in range((order + 1) // 2):
            approx += (-1) ** k * xs ** (2 * k + 1) / math.factorial(2 * k + 1)
        ax.plot(xs, approx, label=f"Taylor degree {order}")
    ax.set_ylim(-1.6, 1.6)
    _style(ax, "Taylor approximation")
    ax.legend(fontsize=8)
    _save(fig, output_dir)


def multivariable(output_dir: Path):
    x = np.linspace(-2.5, 2.5, 80)
    y = np.linspace(-2.5, 2.5, 80)
    X, Y = np.meshgrid(x, y)
    Z = X * np.exp(-X**2 - Y**2)
    dZdy, dZdx = np.gradient(Z, y, x)
    fig, ax = plt.subplots(figsize=(6, 5))
    cs = ax.contourf(X, Y, Z, levels=20, cmap="viridis")
    ax.quiver(X[::6, ::6], Y[::6, ::6], dZdx[::6, ::6], dZdy[::6, ::6], color="white", alpha=0.8)
    fig.colorbar(cs, ax=ax, shrink=0.8)
    ax.set_aspect("equal")
    _style(ax, "Contours and gradient field")
    _save(fig, output_dir)


def linear_algebra_transform(output_dir: Path):
    A = np.array([[1.2, 0.7], [-0.25, 0.9]])
    grid = np.linspace(-1, 1, 9)
    fig, axes = plt.subplots(1, 2, figsize=(9, 4))
    for g in grid:
        pts = np.vstack([np.full_like(grid, g), grid])
        img = A @ pts
        axes[0].plot(pts[0], pts[1], color="gray", alpha=0.5)
        axes[0].plot(pts[1], pts[0], color="gray", alpha=0.5)
        axes[1].plot(img[0], img[1], color="tab:blue", alpha=0.55)
        pts2 = np.vstack([grid, np.full_like(grid, g)])
        img2 = A @ pts2
        axes[1].plot(img2[0], img2[1], color="tab:orange", alpha=0.55)
    for ax, title in zip(axes, ["Original grid", "Transformed by matrix A"]):
        ax.set_aspect("equal")
        ax.set_xlim(-2.2, 2.2)
        ax.set_ylim(-2.2, 2.2)
        _style(ax, title)
    det = np.linalg.det(A)
    axes[1].text(-2.1, 1.85, f"det(A)={det:.2f}")
    _save(fig, output_dir)


def eigen_markov(output_dir: Path):
    P = np.array([[0.86, 0.10, 0.25], [0.10, 0.80, 0.20], [0.04, 0.10, 0.55]])
    state = np.array([1.0, 0.0, 0.0])
    history = [state]
    for _ in range(35):
        state = P @ state
        history.append(state)
    H = np.vstack(history)
    vals, vecs = np.linalg.eig(P)
    idx = np.argmin(np.abs(vals - 1))
    stationary = np.real(vecs[:, idx])
    stationary = stationary / stationary.sum()
    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    axes[0].plot(H)
    axes[0].set_xlabel("step")
    axes[0].set_ylabel("state probability")
    axes[0].legend(["A", "B", "C"], fontsize=8)
    _style(axes[0], "Markov chain convergence")
    axes[1].bar(["A", "B", "C"], stationary, color=["tab:blue", "tab:orange", "tab:green"])
    axes[1].set_ylim(0, 1)
    _style(axes[1], "Stationary distribution")
    _save(fig, output_dir)


def least_squares(output_dir: Path):
    x = np.linspace(0, 10, 35)
    y = 2.3 + 0.75 * x + RNG.normal(0, 1.0, size=x.size)
    A = np.c_[np.ones_like(x), x]
    beta, *_ = np.linalg.lstsq(A, y, rcond=None)
    pred = A @ beta
    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    axes[0].scatter(x, y, label="data")
    axes[0].plot(x, pred, color="crimson", label="least squares fit")
    _style(axes[0], "Least squares line")
    axes[0].legend(fontsize=8)
    axes[1].scatter(pred, y - pred)
    axes[1].axhline(0, color="black", linewidth=1)
    axes[1].set_xlabel("fitted value")
    axes[1].set_ylabel("residual")
    _style(axes[1], "Residual plot")
    _save(fig, output_dir)


def logic_truth(output_dir: Path):
    rows = []
    labels = ["P", "Q", "P=>Q", "Q=>P", "contrapositive"]
    for P in [False, True]:
        for Q in [False, True]:
            implies = (not P) or Q
            converse = (not Q) or P
            contra = (not Q) or (not P)
            rows.append([P, Q, implies, converse, contra])
    data = np.array(rows, dtype=int)
    fig, ax = plt.subplots(figsize=(7, 3.5))
    ax.imshow(data, cmap="Greens", vmin=0, vmax=1)
    ax.set_xticks(range(len(labels)), labels=labels, rotation=25, ha="right")
    ax.set_yticks(range(4), labels=["F,F", "F,T", "T,F", "T,T"])
    for i in range(data.shape[0]):
        for j in range(data.shape[1]):
            ax.text(j, i, str(data[i, j]), ha="center", va="center")
    _style(ax, "Truth table as a matrix")
    _save(fig, output_dir)


def set_relation(output_dir: Path):
    U = np.arange(1, 25)
    A = set(U[U % 2 == 0])
    B = {2, 3, 5, 7, 11, 13, 17, 19, 23}
    C = set(U[U % 3 == 0])
    sizes = [len(A), len(B), len(C), len(A & B), len(A | C), len((A | B) - C)]
    labels = ["A even", "B prime", "C mult3", "A∩B", "A∪C", "(A∪B)-C"]
    rel = np.zeros((len(U), len(U)))
    for i, a in enumerate(U):
        for j, b in enumerate(U):
            rel[i, j] = 1 if b % a == 0 else 0
    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    axes[0].bar(range(len(sizes)), sizes, color="tab:blue")
    axes[0].set_xticks(range(len(labels)), labels=labels, rotation=30, ha="right")
    axes[0].set_ylabel("count")
    _style(axes[0], "Set operation sizes")
    axes[1].imshow(rel, cmap="Blues")
    axes[1].set_title("Relation matrix: a divides b")
    axes[1].set_xlabel("b")
    axes[1].set_ylabel("a")
    _save(fig, output_dir)


def graph_paths(output_dir: Path):
    nodes = ["A", "B", "C", "D", "E", "F"]
    pos = {
        "A": (0, 0), "B": (1, 1.3), "C": (1, -1.0),
        "D": (2.4, 1.0), "E": (2.4, -0.9), "F": (3.6, 0),
    }
    edges = {
        "A": [("B", 2), ("C", 4)],
        "B": [("D", 3), ("E", 2)],
        "C": [("E", 1)],
        "D": [("F", 2)],
        "E": [("D", 1), ("F", 5)],
        "F": [],
    }
    dist = {n: float("inf") for n in nodes}
    dist["A"] = 0
    used = set()
    while len(used) < len(nodes):
        u = min((n for n in nodes if n not in used), key=lambda n: dist[n])
        used.add(u)
        for v, w in edges[u]:
            dist[v] = min(dist[v], dist[u] + w)
    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    ax = axes[0]
    for u, adj in edges.items():
        x1, y1 = pos[u]
        for v, w in adj:
            x2, y2 = pos[v]
            ax.plot([x1, x2], [y1, y2], color="gray")
            ax.text((x1 + x2) / 2, (y1 + y2) / 2, str(w), color="crimson")
    for n in nodes:
        x, y = pos[n]
        ax.scatter([x], [y], s=500, color="white", edgecolor="black", zorder=3)
        ax.text(x, y, n, ha="center", va="center", zorder=4)
    ax.axis("off")
    ax.set_title("Weighted network")
    axes[1].bar(dist.keys(), dist.values(), color="tab:green")
    axes[1].set_ylabel("distance from A")
    _style(axes[1], "Shortest path distances")
    _save(fig, output_dir)


def combinatorics(output_dir: Path):
    nmax = 12
    tri = np.zeros((nmax + 1, nmax + 1))
    for n in range(nmax + 1):
        for k in range(n + 1):
            tri[n, k] = _comb(n, k)
    n = 20
    p = 0.35
    ks = np.arange(n + 1)
    pmf = np.array([_comb(n, k) * p**k * (1 - p) ** (n - k) for k in ks])
    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    axes[0].imshow(np.ma.masked_where(tri == 0, tri), cmap="magma")
    axes[0].set_title("Pascal triangle")
    axes[1].bar(ks, pmf, color="tab:purple")
    axes[1].set_xlabel("k successes")
    axes[1].set_ylabel("probability")
    _style(axes[1], "Binomial counting model")
    _save(fig, output_dir)


def programming_error(output_dir: Path):
    f = np.sin
    df = np.cos
    x0 = 1.0
    h = np.logspace(-16, -1, 160)
    forward = np.abs((f(x0 + h) - f(x0)) / h - df(x0))
    central = np.abs((f(x0 + h) - f(x0 - h)) / (2 * h) - df(x0))
    fig, ax = plt.subplots(figsize=(7, 4.5))
    ax.loglog(h, forward, label="forward difference")
    ax.loglog(h, central, label="central difference")
    ax.set_xlabel("step size h")
    ax.set_ylabel("absolute error")
    _style(ax, "Truncation error vs roundoff error")
    ax.legend(fontsize=8)
    _save(fig, output_dir)


def probability_distribution(output_dir: Path):
    n, p = 30, 0.35
    samples = RNG.binomial(n, p, size=6000)
    ks = np.arange(n + 1)
    pmf = np.array([_comb(n, k) * p**k * (1 - p) ** (n - k) for k in ks])
    mu, sigma = n * p, math.sqrt(n * p * (1 - p))
    x = np.linspace(0, n, 400)
    fig, ax = plt.subplots(figsize=(7, 4.5))
    ax.hist(samples, bins=np.arange(n + 2) - 0.5, density=True, alpha=0.35, label="simulation")
    ax.plot(ks, pmf, "o-", label="binomial pmf")
    ax.plot(x, _normal_pdf(x, mu, sigma), label="normal approximation")
    ax.set_xlabel("success count")
    ax.set_ylabel("probability")
    _style(ax, "Distribution: simulation and formula")
    ax.legend(fontsize=8)
    _save(fig, output_dir)


def clt(output_dir: Path):
    n_values = [1, 3, 10, 40]
    fig, axes = plt.subplots(2, 2, figsize=(9, 6))
    axes = axes.ravel()
    for ax, n in zip(axes, n_values):
        means = RNG.exponential(scale=1.0, size=(6000, n)).mean(axis=1)
        ax.hist(means, bins=40, density=True, alpha=0.55, color="tab:blue")
        mu, sigma = 1.0, 1 / math.sqrt(n)
        x = np.linspace(means.min(), means.max(), 300)
        ax.plot(x, _normal_pdf(x, mu, sigma), color="crimson")
        _style(ax, f"sample size n={n}")
    _save(fig, output_dir)


def bayes_coin(output_dir: Path):
    successes = np.array([0, 1, 1, 0, 1, 1, 1, 0, 1, 1])
    alpha, beta = 2, 2
    x = np.linspace(0.001, 0.999, 400)
    fig, ax = plt.subplots(figsize=(7, 4.5))
    for i in [0, 2, 5, 10]:
        a = alpha + successes[:i].sum()
        b = beta + i - successes[:i].sum()
        log_pdf = (a - 1) * np.log(x) + (b - 1) * np.log(1 - x)
        pdf = np.exp(log_pdf - log_pdf.max())
        pdf = pdf / np.trapz(pdf, x)
        ax.plot(x, pdf, label=f"after {i} tosses")
    ax.set_xlabel("coin bias theta")
    ax.set_ylabel("posterior density")
    _style(ax, "Bayesian updating")
    ax.legend(fontsize=8)
    _save(fig, output_dir)


def distribution_inference(output_dir: Path):
    true_mu = 3.0
    sigma = 1.2
    ns = np.array([5, 10, 20, 40, 80, 160])
    means = []
    ci = []
    for n in ns:
        data = RNG.normal(true_mu, sigma, size=(500, n))
        m = data.mean(axis=1)
        means.append(m.mean())
        ci.append(1.96 * sigma / math.sqrt(n))
    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    axes[0].errorbar(ns, means, yerr=ci, fmt="o-", capsize=4)
    axes[0].axhline(true_mu, color="black", linestyle="--")
    axes[0].set_xscale("log")
    axes[0].set_xlabel("sample size")
    axes[0].set_ylabel("estimated mean")
    _style(axes[0], "Confidence interval shrinks")
    a = RNG.normal(0.0, 1.0, 50)
    b = RNG.normal(0.35, 1.0, 50)
    observed = b.mean() - a.mean()
    pooled = np.r_[a, b]
    diffs = []
    for _ in range(1000):
        perm = RNG.permutation(pooled)
        diffs.append(perm[50:].mean() - perm[:50].mean())
    axes[1].hist(diffs, bins=35, alpha=0.65)
    axes[1].axvline(observed, color="crimson", linewidth=2, label="observed")
    _style(axes[1], "Permutation test")
    axes[1].legend(fontsize=8)
    _save(fig, output_dir)


def real_sequence(output_dir: Path):
    n = np.arange(1, 101)
    seq = 1 - 1 / n
    partial = np.cumsum(1 / n**2)
    x = np.linspace(-1, 1, 300)
    functions = [(x**2 + 1 / k) for k in [1, 2, 5, 20]]
    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    axes[0].plot(n, seq, label="1-1/n")
    axes[0].plot(n, partial, label="sum 1/n^2")
    axes[0].set_xlabel("n")
    _style(axes[0], "Sequence and partial sums")
    axes[0].legend(fontsize=8)
    for y, k in zip(functions, [1, 2, 5, 20]):
        axes[1].plot(x, y, label=f"k={k}")
    axes[1].plot(x, x**2, color="black", linestyle="--", label="limit")
    _style(axes[1], "Uniform-looking convergence")
    axes[1].legend(fontsize=8)
    _save(fig, output_dir)


def epsilon_delta(output_dir: Path):
    f = lambda x: x**2
    x0 = 1.0
    L = f(x0)
    eps = 0.25
    delta = min(0.5, eps / (2 * abs(x0) + 1))
    xs = np.linspace(0.2, 1.8, 400)
    fig, ax = plt.subplots(figsize=(7, 4.5))
    ax.plot(xs, f(xs), label="f(x)=x^2")
    ax.axhspan(L - eps, L + eps, color="tab:green", alpha=0.18, label="epsilon band")
    ax.axvspan(x0 - delta, x0 + delta, color="tab:blue", alpha=0.12, label="delta neighborhood")
    ax.scatter([x0], [L], color="crimson")
    ax.set_xlabel("x")
    ax.set_ylabel("f(x)")
    _style(ax, "epsilon-delta neighborhood")
    ax.legend(fontsize=8)
    _save(fig, output_dir)


def metric_space(output_dir: Path):
    pts = RNG.normal(size=(80, 2))
    center = np.array([0.25, -0.15])
    d = np.linalg.norm(pts - center, axis=1)
    r = 1.0
    z = np.array([2.5, 1.2])
    fixed = []
    for _ in range(30):
        z = 0.55 * z + np.array([0.2, -0.1])
        fixed.append(z.copy())
    fixed = np.vstack(fixed)
    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    axes[0].scatter(pts[:, 0], pts[:, 1], c=d < r, cmap="coolwarm", edgecolor="black", linewidth=0.2)
    circle = plt.Circle(center, r, fill=False, color="black", linestyle="--")
    axes[0].add_patch(circle)
    axes[0].set_aspect("equal")
    _style(axes[0], "Open ball in a metric space")
    axes[1].plot(fixed[:, 0], fixed[:, 1], "o-")
    axes[1].scatter([0.2 / 0.45], [-0.1 / 0.45], color="crimson", label="fixed point")
    axes[1].set_aspect("equal")
    _style(axes[1], "Contraction to fixed point")
    axes[1].legend(fontsize=8)
    _save(fig, output_dir)


def ode_logistic(output_dir: Path):
    r, K = 1.1, 10.0
    t = np.linspace(0, 8, 400)
    y0 = 0.8
    exact = K / (1 + (K / y0 - 1) * np.exp(-r * t))
    dt = 0.2
    ts = np.arange(0, 8 + dt, dt)
    y = np.zeros_like(ts)
    y[0] = y0
    for i in range(len(ts) - 1):
        y[i + 1] = y[i] + dt * r * y[i] * (1 - y[i] / K)
    T, Y = np.meshgrid(np.linspace(0, 8, 20), np.linspace(0, 12, 20))
    S = r * Y * (1 - Y / K)
    fig, ax = plt.subplots(figsize=(7, 4.5))
    ax.quiver(T, Y, np.ones_like(S), S, alpha=0.35)
    ax.plot(t, exact, label="exact")
    ax.plot(ts, y, "o--", label="Euler")
    ax.set_xlabel("time")
    ax.set_ylabel("population")
    _style(ax, "Logistic ODE")
    ax.legend(fontsize=8)
    _save(fig, output_dir)


def ode_phase(output_dir: Path):
    x = np.linspace(-3, 3, 22)
    y = np.linspace(-3, 3, 22)
    X, Y = np.meshgrid(x, y)
    U = Y
    V = -0.8 * X - 0.25 * Y
    fig, ax = plt.subplots(figsize=(6, 5))
    ax.streamplot(X, Y, U, V, density=1.0, color=np.sqrt(U**2 + V**2), cmap="viridis")
    ax.scatter([0], [0], color="crimson")
    ax.set_aspect("equal")
    _style(ax, "Phase portrait")
    _save(fig, output_dir)


def group_table(output_dir: Path):
    n = 8
    table = np.fromfunction(lambda i, j: (i + j) % n, (n, n), dtype=int)
    fig, ax = plt.subplots(figsize=(5, 4.5))
    ax.imshow(table, cmap="tab20")
    ax.set_xticks(range(n))
    ax.set_yticks(range(n))
    for i in range(n):
        for j in range(n):
            ax.text(j, i, int(table[i, j]), ha="center", va="center", fontsize=8)
    ax.set_xlabel("b")
    ax.set_ylabel("a")
    _style(ax, "Cayley table for addition mod 8")
    _save(fig, output_dir)


def ring_polynomial(output_dir: Path):
    x = np.linspace(-2.5, 2.5, 500)
    y = x**3 - x - 1
    mods = [2, 3, 5, 7]
    roots = {p: [a for a in range(p) if (a**3 - a - 1) % p == 0] for p in mods}
    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    axes[0].plot(x, y)
    axes[0].axhline(0, color="black", linewidth=1)
    _style(axes[0], "Polynomial over real numbers")
    counts = [len(roots[p]) for p in mods]
    axes[1].bar([str(p) for p in mods], counts, color="tab:orange")
    for idx, p in enumerate(mods):
        axes[1].text(idx, counts[idx] + 0.05, str(roots[p]), ha="center")
    axes[1].set_xlabel("mod p")
    axes[1].set_ylabel("number of roots")
    _style(axes[1], "Roots over finite fields")
    _save(fig, output_dir)


def finite_field(output_dir: Path):
    p = 11
    mult = np.fromfunction(lambda i, j: (i * j) % p, (p, p), dtype=int)
    inverses = [next((b for b in range(1, p) if (a * b) % p == 1), 0) for a in range(1, p)]
    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    axes[0].imshow(mult, cmap="viridis")
    axes[0].set_title("Multiplication mod 11")
    axes[0].set_xlabel("b")
    axes[0].set_ylabel("a")
    axes[1].bar(range(1, p), inverses, color="tab:green")
    axes[1].set_xlabel("a")
    axes[1].set_ylabel("inverse of a")
    _style(axes[1], "Multiplicative inverses")
    _save(fig, output_dir)


def geometry_curve(output_dir: Path):
    t = np.linspace(0, 2 * np.pi, 600)
    x = np.cos(t) + 0.35 * np.cos(3 * t)
    y = np.sin(t) - 0.35 * np.sin(3 * t)
    dx = np.gradient(x, t)
    dy = np.gradient(y, t)
    ddx = np.gradient(dx, t)
    ddy = np.gradient(dy, t)
    curvature = np.abs(dx * ddy - dy * ddx) / (dx**2 + dy**2) ** 1.5
    fig, ax = plt.subplots(figsize=(6, 5))
    sc = ax.scatter(x, y, c=curvature, cmap="plasma", s=8)
    fig.colorbar(sc, ax=ax, label="curvature")
    ax.set_aspect("equal")
    _style(ax, "Parametric curve colored by curvature")
    _save(fig, output_dir)


def complex_map(output_dir: Path):
    lines = []
    vals = np.linspace(-1.2, 1.2, 13)
    t = np.linspace(-1.2, 1.2, 200)
    for a in vals:
        lines.append(t + 1j * a)
        lines.append(a + 1j * t)
    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    for z in lines:
        axes[0].plot(z.real, z.imag, color="gray", alpha=0.45)
        w = z**2
        axes[1].plot(w.real, w.imag, color="tab:blue", alpha=0.45)
    for ax, title in zip(axes, ["z-plane grid", "image under w=z^2"]):
        ax.set_aspect("equal")
        _style(ax, title)
    _save(fig, output_dir)


def contour_integral(output_dir: Path):
    theta = np.linspace(0, 2 * np.pi, 300)
    circle = np.exp(1j * theta)
    x = np.linspace(-2, 2, 25)
    y = np.linspace(-2, 2, 25)
    X, Y = np.meshgrid(x, y)
    R2 = X**2 + Y**2
    R2[R2 < 0.12] = np.nan
    U = -Y / R2
    V = X / R2
    fig, ax = plt.subplots(figsize=(6, 5))
    ax.streamplot(X, Y, U, V, density=1.2, color="tab:blue")
    ax.plot(circle.real, circle.imag, color="crimson", linewidth=2, label="contour")
    ax.scatter([0], [0], color="black", s=25, label="singularity")
    ax.set_aspect("equal")
    _style(ax, "Circulation around a singularity")
    ax.legend(fontsize=8)
    _save(fig, output_dir)


def topology_space(output_dir: Path):
    t = np.linspace(0, 2 * np.pi, 400)
    circle = np.c_[np.cos(t), np.sin(t)]
    deformed = np.c_[1.4 * np.cos(t), 0.65 * np.sin(t) + 0.12 * np.sin(3 * t)]
    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    axes[0].plot(circle[:, 0], circle[:, 1], label="circle")
    axes[0].plot(deformed[:, 0], deformed[:, 1], label="deformed")
    axes[0].set_aspect("equal")
    _style(axes[0], "Continuous deformation")
    axes[0].legend(fontsize=8)
    xs = np.linspace(0, 1, 15)
    ys = np.linspace(0, 1, 15)
    for x in xs:
        axes[1].plot([x, x], [0, 1], color="gray", alpha=0.25)
    for y in ys:
        axes[1].plot([0, 1], [y, y], color="gray", alpha=0.25)
    axes[1].annotate("", xy=(1, 0.5), xytext=(0, 0.5), arrowprops=dict(arrowstyle="<->", color="crimson"))
    axes[1].annotate("", xy=(0.5, 1), xytext=(0.5, 0), arrowprops=dict(arrowstyle="<->", color="crimson"))
    axes[1].set_aspect("equal")
    axes[1].set_title("Opposite edges identified")
    axes[1].axis("off")
    _save(fig, output_dir)


def measure_integral(output_dir: Path):
    x = np.linspace(0, 1, 800)
    f = np.where(x < 0.2, 0.5, np.where(x < 0.65, 1.6, 0.8))
    fine = np.sin(24 * x) * 0.15 + f
    thresholds = np.linspace(0, fine.max(), 80)
    layer_lengths = np.array([(fine > y).mean() for y in thresholds])
    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    axes[0].plot(x, fine)
    axes[0].fill_between(x, 0, fine, alpha=0.25)
    _style(axes[0], "Function and area")
    axes[1].plot(thresholds, layer_lengths)
    axes[1].fill_between(thresholds, 0, layer_lengths, alpha=0.25)
    axes[1].set_xlabel("level y")
    axes[1].set_ylabel("measure of {f>y}")
    _style(axes[1], "Layer-cake view of integral")
    _save(fig, output_dir)


def pde_heat(output_dir: Path):
    nx = 80
    nt = 260
    alpha = 0.45
    u = np.exp(-140 * (np.linspace(0, 1, nx) - 0.35) ** 2)
    history = [u.copy()]
    for _ in range(nt):
        u[1:-1] = u[1:-1] + alpha * (u[:-2] - 2 * u[1:-1] + u[2:])
        u[0] = u[-1] = 0
        if _ % 8 == 0:
            history.append(u.copy())
    H = np.vstack(history)
    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    axes[0].imshow(H, aspect="auto", cmap="inferno", origin="lower")
    axes[0].set_xlabel("space")
    axes[0].set_ylabel("time snapshot")
    axes[0].set_title("Heat diffusion")
    for idx in [0, len(H)//4, len(H)//2, -1]:
        axes[1].plot(np.linspace(0, 1, nx), H[idx], label=f"step {idx}")
    _style(axes[1], "Temperature profiles")
    axes[1].legend(fontsize=8)
    _save(fig, output_dir)


def pde_wave(output_dir: Path):
    nx = 120
    nt = 260
    cfl = 0.9
    x = np.linspace(0, 1, nx)
    u_prev = np.exp(-200 * (x - 0.35) ** 2)
    u = u_prev.copy()
    frames = [u.copy()]
    for step in range(nt):
        u_next = np.zeros_like(u)
        u_next[1:-1] = 2 * u[1:-1] - u_prev[1:-1] + cfl**2 * (u[:-2] - 2 * u[1:-1] + u[2:])
        u_prev, u = u, u_next
        if step % 8 == 0:
            frames.append(u.copy())
    H = np.vstack(frames)
    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    axes[0].imshow(H, aspect="auto", cmap="RdBu", origin="lower")
    axes[0].set_title("Wave propagation")
    axes[0].set_xlabel("space")
    axes[0].set_ylabel("time snapshot")
    for idx in [0, len(H)//3, 2*len(H)//3, -1]:
        axes[1].plot(x, H[idx], label=f"step {idx}")
    _style(axes[1], "String displacement")
    axes[1].legend(fontsize=8)
    _save(fig, output_dir)


def numerical_root(output_dir: Path):
    f = lambda x: np.cos(x) - x
    df = lambda x: -np.sin(x) - 1
    xs = np.linspace(0, 1.2, 400)
    xk = 1.1
    seq = [xk]
    for _ in range(6):
        xk = xk - f(xk) / df(xk)
        seq.append(xk)
    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    axes[0].plot(xs, f(xs))
    axes[0].axhline(0, color="black", linewidth=1)
    axes[0].scatter(seq, f(np.array(seq)), color="crimson")
    _style(axes[0], "Newton iterates")
    errors = np.abs(np.array(seq) - seq[-1])
    axes[1].semilogy(errors + 1e-16, "o-")
    axes[1].set_xlabel("iteration")
    axes[1].set_ylabel("error")
    _style(axes[1], "Convergence")
    _save(fig, output_dir)


def numerical_interpolation(output_dir: Path):
    f = lambda x: 1 / (1 + 25 * x**2)
    xx = np.linspace(-1, 1, 500)
    fig, ax = plt.subplots(figsize=(7, 4.5))
    ax.plot(xx, f(xx), color="black", label="Runge function")
    for n in [5, 9, 13]:
        xp = np.linspace(-1, 1, n)
        coef = np.polyfit(xp, f(xp), deg=n - 1)
        ax.plot(xx, np.polyval(coef, xx), label=f"degree {n-1}")
        ax.scatter(xp, f(xp), s=12)
    ax.set_ylim(-0.5, 1.4)
    _style(ax, "Polynomial interpolation")
    ax.legend(fontsize=8)
    _save(fig, output_dir)


def numerical_linear(output_dir: Path):
    sizes = np.arange(2, 15)
    conds = []
    for n in sizes:
        H = np.array([[1 / (i + j + 1) for j in range(n)] for i in range(n)])
        conds.append(np.linalg.cond(H))
    A = np.array([[4, -1, 0], [-1, 4, -1], [0, -1, 3]], dtype=float)
    b = np.array([15, 10, 10], dtype=float)
    x = np.zeros(3)
    hist = []
    for _ in range(25):
        x_new = x.copy()
        for i in range(3):
            x_new[i] = (b[i] - np.dot(A[i], x_new) + A[i, i] * x_new[i]) / A[i, i]
        x = x_new
        hist.append(np.linalg.norm(A @ x - b))
    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    axes[0].semilogy(sizes, conds, "o-")
    axes[0].set_xlabel("Hilbert matrix size")
    axes[0].set_ylabel("condition number")
    _style(axes[0], "Ill-conditioning")
    axes[1].semilogy(hist, "o-")
    axes[1].set_xlabel("iteration")
    axes[1].set_ylabel("residual norm")
    _style(axes[1], "Gauss-Seidel residual")
    _save(fig, output_dir)


def optimization_gradient(output_dir: Path):
    f = lambda x, y: (x - 1.2) ** 2 + 2 * (y + 0.5) ** 2 + 0.3 * x * y
    grad = lambda v: np.array([2 * (v[0] - 1.2) + 0.3 * v[1], 4 * (v[1] + 0.5) + 0.3 * v[0]])
    starts = [np.array([-2.2, 2.0]), np.array([2.2, 1.6])]
    X, Y = np.meshgrid(np.linspace(-3, 3, 120), np.linspace(-3, 3, 120))
    Z = f(X, Y)
    fig, ax = plt.subplots(figsize=(6, 5))
    ax.contour(X, Y, Z, levels=25, cmap="viridis")
    for s in starts:
        v = s.copy()
        path = [v.copy()]
        for _ in range(35):
            v = v - 0.12 * grad(v)
            path.append(v.copy())
        P = np.vstack(path)
        ax.plot(P[:, 0], P[:, 1], "o-", markersize=3)
    ax.set_aspect("equal")
    _style(ax, "Gradient descent paths")
    _save(fig, output_dir)


def linear_programming(output_dir: Path):
    x = np.linspace(0, 8, 300)
    y1 = (10 - x) / 2
    y2 = 6 - x
    y3 = np.full_like(x, 3.5)
    feasible_top = np.minimum(np.minimum(y1, y2), y3)
    feasible_top = np.maximum(feasible_top, 0)
    objective = lambda x, y: 3 * x + 4 * y
    vertices = np.array([[0, 0], [0, 3.5], [3, 3], [6, 0]])
    vals = objective(vertices[:, 0], vertices[:, 1])
    best = vertices[np.argmax(vals)]
    fig, ax = plt.subplots(figsize=(6, 5))
    ax.fill_between(x, 0, feasible_top, where=feasible_top >= 0, alpha=0.25, label="feasible region")
    ax.plot(x, y1, label="x+2y<=10")
    ax.plot(x, y2, label="x+y<=6")
    ax.axhline(3.5, label="y<=3.5")
    ax.scatter(vertices[:, 0], vertices[:, 1], color="black")
    ax.scatter([best[0]], [best[1]], color="crimson", s=80, label="best vertex")
    ax.set_xlim(0, 8)
    ax.set_ylim(0, 6)
    _style(ax, "Linear programming in 2D")
    ax.legend(fontsize=8)
    _save(fig, output_dir)


def fourier_series(output_dir: Path):
    x = np.linspace(-np.pi, np.pi, 900)
    target = np.sign(np.sin(x))
    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    axes[0].plot(x, target, color="black", label="square wave")
    for terms in [1, 3, 9, 25]:
        approx = np.zeros_like(x)
        for k in range(terms):
            n = 2 * k + 1
            approx += (4 / np.pi) * np.sin(n * x) / n
        axes[0].plot(x, approx, label=f"{terms} odd terms")
    _style(axes[0], "Fourier series approximation")
    axes[0].legend(fontsize=7)
    signal = np.sin(3 * x) + 0.45 * np.sin(9 * x) + 0.2 * RNG.normal(size=x.size)
    freq = np.fft.rfftfreq(x.size, d=(x[1] - x[0]))
    amp = np.abs(np.fft.rfft(signal))
    axes[1].plot(freq[:80], amp[:80])
    axes[1].set_xlabel("frequency")
    axes[1].set_ylabel("amplitude")
    _style(axes[1], "Frequency spectrum")
    _save(fig, output_dir)


def functional_projection(output_dir: Path):
    x = np.linspace(0, 1, 500)
    f = x * (1 - x) + 0.08 * np.sin(10 * np.pi * x)
    basis = [np.sqrt(2) * np.sin(k * np.pi * x) for k in range(1, 5)]
    coeffs = [np.trapz(f * b, x) for b in basis]
    proj = sum(c * b for c, b in zip(coeffs, basis))
    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    axes[0].plot(x, f, label="function")
    axes[0].plot(x, proj, label="projection")
    _style(axes[0], "Projection onto finite basis")
    axes[0].legend(fontsize=8)
    axes[1].bar(range(1, 5), coeffs, color="tab:orange")
    axes[1].set_xlabel("basis index")
    axes[1].set_ylabel("coefficient")
    _style(axes[1], "Hilbert coefficients")
    _save(fig, output_dir)


def commutative_algebra(output_dir: Path):
    x = np.linspace(-2, 2, 500)
    X, Y = np.meshgrid(np.linspace(-2, 2, 300), np.linspace(-2, 2, 300))
    F = Y**2 - X**3 + X
    G = X**2 + Y**2 - 1
    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    axes[0].contour(X, Y, F, levels=[0], colors="tab:blue")
    axes[0].contour(X, Y, G, levels=[0], colors="crimson")
    axes[0].set_aspect("equal")
    _style(axes[0], "Polynomial zero sets")
    axes[1].plot(x, x**3 - x, label="y=x^3-x")
    axes[1].plot(x, np.sqrt(np.maximum(0, 1 - x**2)), color="crimson", label="unit circle upper")
    axes[1].plot(x, -np.sqrt(np.maximum(0, 1 - x**2)), color="crimson")
    axes[1].set_ylim(-2, 2)
    _style(axes[1], "Varieties as constraints")
    axes[1].legend(fontsize=8)
    _save(fig, output_dir)


def galois_roots(output_dir: Path):
    roots = np.roots([1, 0, 0, 0, -2])
    unit = np.exp(2j * np.pi * np.arange(4) / 4)
    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    axes[0].scatter(roots.real, roots.imag, s=80, color="tab:blue")
    for r in roots:
        axes[0].plot([0, r.real], [0, r.imag], color="gray", alpha=0.5)
    axes[0].set_aspect("equal")
    _style(axes[0], "Roots of x^4-2")
    axes[1].scatter(unit.real, unit.imag, s=80, color="tab:orange")
    for z in unit:
        axes[1].annotate("", xy=(z.real, z.imag), xytext=(0, 0), arrowprops=dict(arrowstyle="->", alpha=0.5))
    axes[1].set_aspect("equal")
    _style(axes[1], "Symmetry by roots of unity")
    _save(fig, output_dir)


def riemann_geometry(output_dir: Path):
    u = np.linspace(0, 2 * np.pi, 60)
    v = np.linspace(0.05, np.pi - 0.05, 30)
    U, V = np.meshgrid(u, v)
    X = np.cos(U) * np.sin(V)
    Y = np.sin(U) * np.sin(V)
    Z = np.cos(V)
    theta = np.linspace(0, 2 * np.pi, 300)
    fig = plt.figure(figsize=(10, 4))
    ax1 = fig.add_subplot(1, 2, 1, projection="3d")
    ax1.plot_wireframe(X, Y, Z, color="gray", alpha=0.35, linewidth=0.5)
    ax1.plot(np.cos(theta), np.sin(theta), 0 * theta, color="crimson", linewidth=2, label="great circle")
    ax1.set_title("Sphere and a geodesic")
    ax1.set_box_aspect((1, 1, 1))
    ax2 = fig.add_subplot(1, 2, 2)
    lat = [0, np.pi / 6, np.pi / 3]
    for phi in lat:
        ax2.plot(theta, np.sin(phi) * theta, label=f"latitude {phi:.2f}")
    _style(ax2, "Metric changes with latitude")
    ax2.legend(fontsize=8)
    _save(fig, output_dir)


def algebraic_topology(output_dir: Path):
    vertices = np.array([[0, 0], [1, 0], [0.5, 0.9], [2, 0], [3, 0], [2.5, 0.9]])
    edges = [(0, 1), (1, 2), (2, 0), (3, 4), (4, 5), (5, 3), (1, 3), (2, 5)]
    faces = [(0, 1, 2)]
    V = len(vertices)
    E = len(edges)
    F = len(faces)
    euler = V - E + F
    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    ax = axes[0]
    for face in faces:
        tri = vertices[list(face)]
        ax.fill(tri[:, 0], tri[:, 1], alpha=0.25, color="tab:blue")
    for i, j in edges:
        ax.plot(vertices[[i, j], 0], vertices[[i, j], 1], color="black")
    ax.scatter(vertices[:, 0], vertices[:, 1], color="crimson", zorder=3)
    ax.set_aspect("equal")
    ax.axis("off")
    ax.set_title("Simplicial complex")
    axes[1].bar(["V", "E", "F", "chi"], [V, E, F, euler], color=["tab:blue", "tab:orange", "tab:green", "tab:red"])
    _style(axes[1], "Euler characteristic")
    _save(fig, output_dir)


def stochastic_process(output_dir: Path):
    steps = RNG.normal(size=(12, 400))
    walks = np.cumsum(steps, axis=1)
    rate = 2.0
    inter = RNG.exponential(1 / rate, size=80)
    arrivals = np.cumsum(inter)
    arrivals = arrivals[arrivals < 20]
    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    axes[0].plot(walks.T, alpha=0.6)
    axes[0].set_xlabel("time")
    axes[0].set_ylabel("position")
    _style(axes[0], "Random walks")
    axes[1].step(np.r_[0, arrivals], np.arange(len(arrivals) + 1), where="post")
    axes[1].set_xlabel("time")
    axes[1].set_ylabel("event count")
    _style(axes[1], "Poisson process sample path")
    _save(fig, output_dir)


def regression(output_dir: Path):
    x = np.linspace(0, 8, 70)
    y = 1.5 + 0.9 * x + 0.25 * (x - 4) ** 2 + RNG.normal(0, 1.0, size=x.size)
    A1 = np.c_[np.ones_like(x), x]
    A2 = np.c_[np.ones_like(x), x, x**2]
    b1, *_ = np.linalg.lstsq(A1, y, rcond=None)
    b2, *_ = np.linalg.lstsq(A2, y, rcond=None)
    pred1 = A1 @ b1
    pred2 = A2 @ b2
    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    axes[0].scatter(x, y, s=18, alpha=0.7)
    axes[0].plot(x, pred1, label="linear")
    axes[0].plot(x, pred2, label="quadratic")
    _style(axes[0], "Regression fit")
    axes[0].legend(fontsize=8)
    axes[1].scatter(pred1, y - pred1, label="linear residuals")
    axes[1].axhline(0, color="black", linewidth=1)
    _style(axes[1], "Residual diagnostics")
    axes[1].legend(fontsize=8)
    _save(fig, output_dir)


def bayesian_statistics(output_dir: Path):
    alpha, beta = 3, 7
    successes, trials = 18, 30
    post_a, post_b = alpha + successes, beta + trials - successes
    theta = np.linspace(0.001, 0.999, 500)
    def beta_shape(a, b):
        log_pdf = (a - 1) * np.log(theta) + (b - 1) * np.log(1 - theta)
        pdf = np.exp(log_pdf - log_pdf.max())
        return pdf / np.trapz(pdf, theta)
    predictive = RNG.beta(post_a, post_b, size=5000)
    future = RNG.binomial(20, predictive)
    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    axes[0].plot(theta, beta_shape(alpha, beta), label="prior")
    axes[0].plot(theta, beta_shape(post_a, post_b), label="posterior")
    _style(axes[0], "Bayesian posterior")
    axes[0].legend(fontsize=8)
    axes[1].hist(future, bins=np.arange(22) - 0.5, density=True, alpha=0.65)
    axes[1].set_xlabel("future successes out of 20")
    _style(axes[1], "Posterior predictive")
    _save(fig, output_dir)


def math_physics(output_dir: Path):
    t = np.linspace(0, 20, 800)
    gamma = 0.08
    omega = 1.2
    x = np.exp(-gamma * t) * np.cos(omega * t)
    v = np.gradient(x, t)
    energy = 0.5 * (v**2 + omega**2 * x**2)
    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    axes[0].plot(t, x, label="position")
    axes[0].plot(t, v, label="velocity", alpha=0.7)
    _style(axes[0], "Damped oscillator")
    axes[0].legend(fontsize=8)
    axes[1].plot(t, energy, color="crimson")
    axes[1].set_xlabel("time")
    axes[1].set_ylabel("energy")
    _style(axes[1], "Energy decay")
    _save(fig, output_dir)


def computational_math(output_dir: Path):
    n = 6000
    pts = RNG.uniform(-1, 1, size=(n, 2))
    inside = np.sum(pts**2, axis=1) <= 1
    estimates = 4 * np.cumsum(inside) / np.arange(1, n + 1)
    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    axes[0].scatter(pts[:1200, 0], pts[:1200, 1], c=inside[:1200], cmap="coolwarm", s=6)
    axes[0].set_aspect("equal")
    _style(axes[0], "Monte Carlo area samples")
    axes[1].plot(estimates)
    axes[1].axhline(np.pi, color="black", linestyle="--", label="pi")
    axes[1].set_xlabel("samples")
    axes[1].set_ylabel("estimate")
    _style(axes[1], "Convergence of estimate")
    axes[1].legend(fontsize=8)
    _save(fig, output_dir)


def financial_math(output_dir: Path):
    s0, mu, sigma, T = 100, 0.06, 0.22, 1
    n_steps = 252
    dt = T / n_steps
    paths = np.zeros((40, n_steps + 1))
    paths[:, 0] = s0
    for t in range(n_steps):
        z = RNG.normal(size=paths.shape[0])
        paths[:, t + 1] = paths[:, t] * np.exp((mu - 0.5 * sigma**2) * dt + sigma * np.sqrt(dt) * z)
    K = 105
    ST = paths[:, -1]
    call = np.maximum(ST - K, 0)
    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    axes[0].plot(paths.T, alpha=0.45)
    axes[0].axhline(K, color="crimson", linestyle="--", label="strike")
    _style(axes[0], "Simulated price paths")
    axes[0].legend(fontsize=8)
    axes[1].hist(call, bins=20, alpha=0.7, color="tab:green")
    axes[1].set_xlabel("call payoff")
    _style(axes[1], "Option payoff distribution")
    _save(fig, output_dir)


def machine_learning_math(output_dir: Path):
    cov = np.array([[2.2, 1.2], [1.2, 0.9]])
    data = RNG.multivariate_normal([0, 0], cov, size=240)
    C = np.cov(data.T)
    vals, vecs = np.linalg.eigh(C)
    pc = vecs[:, np.argmax(vals)]
    w = np.array([-2.0, 1.5])
    b = 0.0
    labels = (data[:, 0] + 0.7 * data[:, 1] > 0).astype(float)
    losses = []
    for _ in range(80):
        z = data @ w + b
        p = 1 / (1 + np.exp(-z))
        losses.append(-np.mean(labels * np.log(p + 1e-9) + (1 - labels) * np.log(1 - p + 1e-9)))
        grad_w = data.T @ (p - labels) / len(labels)
        grad_b = np.mean(p - labels)
        w -= 0.2 * grad_w
        b -= 0.2 * grad_b
    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    axes[0].scatter(data[:, 0], data[:, 1], c=labels, cmap="coolwarm", s=16, alpha=0.75)
    origin = data.mean(axis=0)
    axes[0].arrow(origin[0], origin[1], pc[0] * 2, pc[1] * 2, color="black", width=0.02, label="PC1")
    axes[0].set_aspect("equal")
    _style(axes[0], "PCA direction")
    axes[1].plot(losses)
    axes[1].set_xlabel("iteration")
    axes[1].set_ylabel("logistic loss")
    _style(axes[1], "Gradient training")
    _save(fig, output_dir)


def data_analysis(output_dir: Path):
    t = np.arange(48)
    trend = 0.08 * t
    season = 1.5 * np.sin(2 * np.pi * t / 12)
    noise = RNG.normal(0, 0.45, size=t.size)
    y = 10 + trend + season + noise
    window = 5
    smooth = np.convolve(y, np.ones(window) / window, mode="same")
    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    axes[0].plot(t, y, "o-", label="observed")
    axes[0].plot(t, smooth, linewidth=2, label="moving average")
    _style(axes[0], "Time series with smoothing")
    axes[0].legend(fontsize=8)
    axes[1].hist(y - smooth, bins=14, color="tab:orange", alpha=0.75)
    axes[1].set_xlabel("residual")
    _style(axes[1], "Residual distribution")
    _save(fig, output_dir)


def capstone_project(output_dir: Path):
    stages = ["question", "model", "code", "evidence", "writing"]
    effort = np.array([2, 3, 4, 3, 2])
    risk = np.array([4, 3, 2, 3, 5])
    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    axes[0].bar(stages, effort, label="effort")
    axes[0].plot(stages, risk, "o-", color="crimson", label="risk")
    axes[0].tick_params(axis="x", rotation=25)
    _style(axes[0], "Research project planning")
    axes[0].legend(fontsize=8)
    x = np.arange(1, 11)
    baseline = 1 / np.sqrt(x)
    improved = baseline * 0.78
    axes[1].plot(x, baseline, "o-", label="baseline error")
    axes[1].plot(x, improved, "o-", label="new method error")
    axes[1].set_xlabel("experiment batch")
    axes[1].set_ylabel("error")
    _style(axes[1], "Reproducible experiment trace")
    axes[1].legend(fontsize=8)
    _save(fig, output_dir)


PROFILES = {
    "calculus_limit": calculus_limit,
    "calculus_derivative": calculus_derivative,
    "calculus_integral": calculus_integral,
    "calculus_series": calculus_series,
    "multivariable": multivariable,
    "linear_algebra_transform": linear_algebra_transform,
    "eigen_markov": eigen_markov,
    "least_squares": least_squares,
    "logic_truth": logic_truth,
    "set_relation": set_relation,
    "graph_paths": graph_paths,
    "combinatorics": combinatorics,
    "programming_error": programming_error,
    "probability_distribution": probability_distribution,
    "clt": clt,
    "bayes_coin": bayes_coin,
    "distribution_inference": distribution_inference,
    "real_sequence": real_sequence,
    "epsilon_delta": epsilon_delta,
    "metric_space": metric_space,
    "ode_logistic": ode_logistic,
    "ode_phase": ode_phase,
    "group_table": group_table,
    "ring_polynomial": ring_polynomial,
    "finite_field": finite_field,
    "geometry_curve": geometry_curve,
    "complex_map": complex_map,
    "contour_integral": contour_integral,
    "topology_space": topology_space,
    "measure_integral": measure_integral,
    "pde_heat": pde_heat,
    "pde_wave": pde_wave,
    "numerical_root": numerical_root,
    "numerical_interpolation": numerical_interpolation,
    "numerical_linear": numerical_linear,
    "optimization_gradient": optimization_gradient,
    "linear_programming": linear_programming,
    "fourier_series": fourier_series,
    "functional_projection": functional_projection,
    "commutative_algebra": commutative_algebra,
    "galois_roots": galois_roots,
    "riemann_geometry": riemann_geometry,
    "algebraic_topology": algebraic_topology,
    "stochastic_process": stochastic_process,
    "regression": regression,
    "bayesian_statistics": bayesian_statistics,
    "math_physics": math_physics,
    "computational_math": computational_math,
    "financial_math": financial_math,
    "machine_learning_math": machine_learning_math,
    "data_analysis": data_analysis,
    "capstone_project": capstone_project,
}


def run_profile(profile: str, title: str, concept: str, application: str, output_dir: Path) -> None:
    print("=" * 72)
    print(title)
    print(f"concept example: {concept}")
    print(f"application example: {application}")
    if profile not in PROFILES:
        raise KeyError(f"Unknown visualization profile: {profile}")
    PROFILES[profile](output_dir)
`;

const runAllPy = String.raw`# -*- coding: utf-8 -*-
from pathlib import Path
import subprocess
import sys


ROOT = Path(__file__).resolve().parents[1]


def main():
    scripts = sorted(ROOT.glob("*학년_*/*/ch*/visualize.py"))
    print(f"found {len(scripts)} chapter scripts")
    failures = []
    for script in scripts:
        print(f"\n[run] {script.relative_to(ROOT)}")
        result = subprocess.run([sys.executable, str(script)], cwd=script.parent)
        if result.returncode != 0:
            failures.append(script)
    if failures:
        print("\nFailures:")
        for failure in failures:
            print(f"- {failure.relative_to(ROOT)}")
        raise SystemExit(1)
    print("\nAll chapter examples completed.")


if __name__ == "__main__":
    main()
`;

const runAllNotebooksPy = String.raw`# -*- coding: utf-8 -*-
from pathlib import Path
import subprocess
import sys


ROOT = Path(__file__).resolve().parents[1]


def main():
    notebooks = sorted(ROOT.glob("*학년_*/*/ch*/notebook.ipynb"))
    print(f"found {len(notebooks)} notebooks")
    failures = []
    for notebook in notebooks:
        print(f"\n[execute] {notebook.relative_to(ROOT)}")
        result = subprocess.run(
            [
                sys.executable,
                "-m",
                "jupyter",
                "nbconvert",
                "--to",
                "notebook",
                "--execute",
                "--inplace",
                str(notebook),
            ],
            cwd=ROOT,
        )
        if result.returncode != 0:
            failures.append(notebook)
    if failures:
        print("\nFailures:")
        for failure in failures:
            print(f"- {failure.relative_to(ROOT)}")
        raise SystemExit(1)
    print("\nAll notebooks completed.")


if __name__ == "__main__":
    main()
`;

const studyGuideNotebook = `# 학습 운영 가이드

## 한 과목을 공부하는 기본 흐름
1. 과목 \`README.md\`에서 전체 챕터 순서를 확인한다.
2. 챕터 \`notebook.ipynb\`를 열고 개념 설명을 읽는다.
3. 기본 개념 예제를 손으로 먼저 계산한다.
4. 코드 셀을 순서대로 실행하고 그림의 축, 단위, 파라미터를 해석한다.
5. 마지막 변형 실험 셀에서 표본 수, 격자 크기, 초기값, 경계조건 중 하나를 바꾼다.

## 증명 과목을 공부할 때
- 정의를 바꾸면 어떤 예제가 깨지는지 먼저 찾는다.
- 정리는 “가정, 결론, 증명 전략, 반례 가능성” 네 칸으로 요약한다.
- 코드 실습은 증명을 대체하지 않고, 직관과 반례 탐색을 돕는 도구로 쓴다.

## 응용 과목을 공부할 때
- 모형의 단위, 파라미터 의미, 보존량이나 제약조건을 먼저 확인한다.
- 시각화가 예쁜지보다 결론이 파라미터 변화에도 안정적인지 본다.
- 실제 데이터를 쓰기 전에는 작은 인공 데이터로 결과를 검산한다.
`;

const studyGuide = `# 학습 운영 가이드

## 한 과목을 공부하는 기본 흐름
1. 챕터 제목만 보고 먼저 “무엇을 정의해야 하는가?”를 적는다.
2. \`README.md\`의 핵심 개념을 읽고, 기본 예제를 손으로 다시 계산한다.
3. \`visualize.py\`를 실행해 그림을 만든다.
4. 코드에서 함수, 표본 수, 격자 크기, 초기값 중 하나를 바꾸고 결과를 비교한다.
5. 마지막으로 응용 예제를 자신의 관심 분야 데이터나 숫자로 바꿔 본다.

## 증명 과목을 공부할 때
- 정의를 바꾸면 어떤 예제가 깨지는지 먼저 찾는다.
- 정리는 “가정, 결론, 증명 전략, 반례 가능성” 네 칸으로 요약한다.
- 코드 실습은 증명을 대체하지 않고, 직관과 반례 탐색을 돕는 도구로 쓴다.

## 응용 과목을 공부할 때
- 모형의 단위, 파라미터 의미, 보존량이나 제약조건을 먼저 확인한다.
- 시각화가 예쁜지보다 결론이 파라미터 변화에도 안정적인지 본다.
`;

function generate() {
  const root = path.join(process.cwd(), ROOT_DIR);

  writeFile(path.join(root, "README.md"), rootReadmeNotebook());
  writeFile(path.join(root, "requirements.txt"), "numpy>=1.24\nmatplotlib>=3.7\njupyterlab>=4.0\nipython>=8.0\n");
  writeFile(path.join(root, "common", "__init__.py"), "");
  writeFile(path.join(root, "common", "math_viz.py"), mathVizPy);
  writeFile(path.join(root, "scripts", "run_all_notebooks.py"), runAllNotebooksPy);
  writeFile(path.join(root, "docs", "학습_운영_가이드.md"), studyGuideNotebook);

  const indexRows = ["# 전체 과목 색인", "", "| 학년 | 영역 | 과목 | 챕터 수 |", "|---|---|---|---|"];

  for (const c of courses) {
    const cDir = path.join(root, yearDirs[c.year], courseDirName(c));
    writeFile(path.join(cDir, "README.md"), courseReadmeNotebook(c));
    indexRows.push(`| ${c.year} | ${c.area} | [${c.name}](./${yearDirs[c.year]}/${courseDirName(c)}/README.md) | ${c.chapters.length} |`);

    c.chapters.forEach((ch, i) => {
      const chDir = path.join(cDir, chapterDirName(i, ch));
      writeFile(path.join(chDir, "README.md"), chapterReadmeNotebook(c, ch, i));
      writeFile(path.join(chDir, "notebook.ipynb"), chapterNotebook(c, ch, i));
    });
  }

  writeFile(path.join(root, "INDEX.md"), indexRows.join("\n"));
  console.log(`Generated ${courses.length} courses and ${courses.reduce((sum, c) => sum + c.chapters.length, 0)} chapters in ${root}`);
}

generate();
