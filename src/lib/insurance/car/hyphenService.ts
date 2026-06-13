// HYPHEN 본인차량조회 API 연동 서비스
// API Endpoint: POST https://api.hyphen.im/in0112001211 (로컬 프록시 /in0112001211 사용)

const USER_ID = 
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_HYPHEN_USER_ID) || 
  (typeof process !== 'undefined' && process.env && process.env.VITE_HYPHEN_USER_ID) || 
  'zkfnth01';

const HKEY = 
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_HYPHEN_HKEY) || 
  (typeof process !== 'undefined' && process.env && process.env.VITE_HYPHEN_HKEY) || 
  'bebc2c0dfab3266b';

export interface HyphenCommonResponse {
  errYn: 'Y' | 'N';
  errCd: string;
  errMsg: string;
}

export interface HyphenResponse<T> {
  common: HyphenCommonResponse;
  data?: T;
}

export interface HyphenInitData {
  step_data: string;
  captcha_img: string; // base64 encoded image
}

export interface HyphenCaptchaData {
  step_data: string;
}

export interface CarInfo {
  VHRNO: string;              // 차량번호 (예: 12가3456)
  VIN: string;                // 차대번호 (Vehicle Identification Number)
  CNM: string;                // 모델명 (예: 그랜저)
  VHCTY_ASORT_NM: string;     // 차종구분 (예: 대형, 중형)
  PRYE: string;               // 형식연도/연식 (예: 2024)
  TRVL_DSTNC: string;         // 누적 주행거리 (km)
  FRST_REGIST_DE?: string;    // 최초등록일 (예: 20240101)
  PRPOS_SE_NM?: string;       // 용도구분 (예: 비사업용)
  ATLOS_PROCESS_RESN_NM?: string; // 전손처리여부
  TRANSR_REGIST_CO?: string;  // 이전등록횟수
}

export interface InsuranceHistory {
  SBSCRB_CMPNY_NM: string;    // 가입회사
  INSRNC_ITEM_NM: string;     // 보험종목
  PRSNL_DTA_SE_NM: string;    // 가입상태 (예: 정상)
  PRSNL_BGNDE: string;        // 가입기간시작일 (YYYYMMDD)
  PRSNL_ENDDE: string;        // 가입기간종료일 (YYYYMMDD)
}

export interface HyphenSmsData {
  CARINFOLIST?: CarInfo[];
  INSRNCHISTLIST?: InsuranceHistory[];
}

async function callHyphenAPI<T>(body: any): Promise<HyphenResponse<T>> {
  try {
    const response = await fetch('/in0112001211', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Id': USER_ID,
        'Hkey': HKEY
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = await response.json();
    return json as HyphenResponse<T>;
  } catch (error: any) {
    return {
      common: {
        errYn: 'Y',
        errCd: 'CLIENT_ERROR',
        errMsg: error.message || 'API 호출 중 오류가 발생했습니다.'
      }
    };
  }
}

/**
 * 1단계: 본인인증 초기 요청 및 캡차 이미지 요청
 */
export async function requestHyphenInit(req: {
  userName: string;
  ssnFront: string;
  ssnBack: string;
  mobileCo: string;
}): Promise<HyphenResponse<HyphenInitData>> {
  return callHyphenAPI<HyphenInitData>({
    step: 'init',
    authType: 'mobile', // 휴대폰 문자(SMS) 인증 고정
    mobileCo: req.mobileCo,
    userName: req.userName,
    ssnFront: req.ssnFront,
    ssnBack: req.ssnBack,
  });
}

/**
 * 2단계: 캡차 입력 완료 및 본인인증 SMS 발송 요청
 */
export async function requestHyphenCaptcha(req: {
  userName: string;
  ssnFront: string;
  ssnBack: string;
  mobileCo: string;
  mobileNo: string;
  step_data: string;
  step_input: string; // 캡차 이미지 숫자
}): Promise<HyphenResponse<HyphenCaptchaData>> {
  return callHyphenAPI<HyphenCaptchaData>({
    step: 'captcha',
    userName: req.userName,
    ssnFront: req.ssnFront,
    ssnBack: req.ssnBack,
    mobileCo: req.mobileCo,
    mobileNo: req.mobileNo,
    step_data: req.step_data,
    step_input: req.step_input,
  });
}

/**
 * 3단계: SMS 인증번호 확인 및 차량 정보 조회 최종 단계
 */
export async function requestHyphenSms(req: {
  userName: string;
  ssnFront: string;
  ssnBack: string;
  step_data: string;
  step_input: string; // SMS 인증번호
  vhrno: string;      // 차량번호 (예: 12가3456)
}): Promise<HyphenResponse<HyphenSmsData>> {
  return callHyphenAPI<HyphenSmsData>({
    step: 'sms',
    userName: req.userName,
    ssnFront: req.ssnFront,
    ssnBack: req.ssnBack,
    step_data: req.step_data,
    step_input: req.step_input,
    vhrno: req.vhrno,
  });
}
