// HYPHEN 내보험다보여 API 연동 서비스
import { RawInsurancePolicy } from '../../../types/remodeling';

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

export interface HyphenRegisterInitData {
  step_data: string;
  captcha_img: string; // base64 encoded image
  proxy: string;
}

// Mock Data for Demo Mode
export const MOCK_REMODELING_DATA: Record<'overpaying' | 'underinsured' | 'optimal', {
  age: number;
  gender: 'M' | 'F';
  policies: RawInsurancePolicy[];
}> = {
  overpaying: {
    age: 40,
    gender: 'M',
    policies: [
      {
        insurance_company: '메트라이프생명보험',
        product_name: '무배당 백만인을 위한 달러종신보험Plus(저해약환급금형)',
        monthly_premium: 122290,
        riders: [
          { rider_name: '사망보험금', coverage_amount: 100000000 },
          { rider_name: '재해사망특약', coverage_amount: 100000000 },
        ]
      },
      {
        insurance_company: '흥국생명보험',
        product_name: '(무)흥국생명다(多)사랑통합보험V2(해약환급금미지급형V2)(3대질환)',
        monthly_premium: 41413,
        riders: [
          { rider_name: '일반암진단비', coverage_amount: 30000000 },
          { rider_name: '뇌혈관질환진단비', coverage_amount: 20000000 },
          { rider_name: '허혈성심장질환진단비', coverage_amount: 20000000 },
          { rider_name: '수술비특약', coverage_amount: 1000000 },
        ]
      },
      {
        insurance_company: '신한라이프생명보험',
        product_name: '신한통합건강보험 슈퍼원(ONE)(무배당, 해약환급금 미지급형)',
        monthly_premium: 39271,
        riders: [
          { rider_name: '일반암진단비', coverage_amount: 30000000 },
          { rider_name: '뇌혈관질환진단비', coverage_amount: 20000000 },
          { rider_name: '허혈성심장질환진단비', coverage_amount: 20000000 },
          { rider_name: '입원일당', coverage_amount: 30000 },
          { rider_name: '수술비', coverage_amount: 1000000 },
        ]
      },
      {
        insurance_company: '메리츠화재보험',
        product_name: '(무) 메리츠 운전자 상해 종합보험2509',
        monthly_premium: 21870,
        riders: [
          { rider_name: '교통상해사망', coverage_amount: 100000000 },
          { rider_name: '형사합의지원금', coverage_amount: 30000000 },
          { rider_name: '벌금특약', coverage_amount: 3000000 },
          { rider_name: '변호사선임비용', coverage_amount: 5000000 },
        ]
      },
      {
        insurance_company: 'KB손해보험',
        product_name: 'KB 5.10.10 금쪽같은 건강보험(무배당)(25.08)_세만기 해약환급금 미지급형 (보장종료 2102)',
        monthly_premium: 87689,
        riders: [
          { rider_name: '일반암진단비', coverage_amount: 50000000 },
          { rider_name: '뇌혈관질환진단비', coverage_amount: 30000000 },
          { rider_name: '허혈성심장질환진단비', coverage_amount: 30000000 },
          { rider_name: '간병인사용일당', coverage_amount: 100000 },
          { rider_name: '입원일당', coverage_amount: 30000 },
          { rider_name: '수술비(1~5종)', coverage_amount: 3000000 },
        ]
      },
      {
        insurance_company: 'KB손해보험',
        product_name: 'KB 5.10.10 금쪽같은 건강보험(무배당)(25.08)_세만기 해약환급금 미지급형 (보장종료 2108)',
        monthly_premium: 92106,
        riders: [
          { rider_name: '일반암진단비', coverage_amount: 50000000 },
          { rider_name: '뇌혈관질환진단비', coverage_amount: 30000000 },
          { rider_name: '허혈성심장질환진단비', coverage_amount: 30000000 },
          { rider_name: '간병인사용일당', coverage_amount: 100000 },
          { rider_name: '입원일당', coverage_amount: 30000 },
          { rider_name: '수술비(1~5종)', coverage_amount: 3000000 },
        ]
      },
      {
        insurance_company: '한화손해보험',
        product_name: '무배당 마이라이프 굿밸런스종합보험(연만기 갱신형)2208',
        monthly_premium: 102135,
        riders: [
          { rider_name: '일반암진단비', coverage_amount: 30000000 },
          { rider_name: '뇌혈관질환진단비', coverage_amount: 20000000 },
          { rider_name: '허혈성심장질환진단비', coverage_amount: 20000000 },
          { rider_name: '실손의료비', coverage_amount: 1 },
          { rider_name: '입원일당', coverage_amount: 50000 },
          { rider_name: '수술비', coverage_amount: 1000000 },
        ]
      },
    ]
  },
  underinsured: {
    age: 35,
    gender: 'F',
    policies: [
      {
        insurance_company: 'C생명',
        product_name: '무배당 간편 암보험',
        monthly_premium: 60000,
        riders: [
          { rider_name: '일반암진단비특별약관', coverage_amount: 10000000 }
        ]
      }
    ]
  },
  optimal: {
    age: 38,
    gender: 'M',
    policies: [
      {
        insurance_company: 'D손해',
        product_name: '무배당 세이프 종합파트너보험',
        monthly_premium: 120000,
        riders: [
          { rider_name: '일반암진단비특별약관', coverage_amount: 50000000 },
          { rider_name: '뇌혈관질환진단비특약', coverage_amount: 30000000 },
          { rider_name: '허혈성심장질환진단비특약', coverage_amount: 30000000 },
          { rider_name: '간병인사용일당특약', coverage_amount: 150000 }
        ]
      }
    ]
  }
};

async function callHyphenAPI<T>(endpoint: string, body: any): Promise<HyphenResponse<T>> {
  try {
    const response = await fetch(endpoint, {
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
 * 1. 회원가입 API (init, captcha, sms 단계 지원)
 */
export async function requestHyphenRegister(req: {
  step: 'init' | 'captcha' | 'sms' | 'email';
  userName: string;
  birth: string;
  ssnBack: string;
  mobileCo: string;
  authType: 'mobile' | 'app';
  mobileNo?: string;
  userId?: string;
  userPw?: string;
  email?: string;
  step_data?: string;
  step_input?: string;
  proxy?: string;
}): Promise<HyphenResponse<any>> {
  return callHyphenAPI<any>('/in0017000781', req);
}

/**
 * 2. 계약현황 조회 API
 */
export async function fetchContractStatus(req: {
  userId: string;
  userPw: string;
  step?: string;
  step_input?: string;
  step_data?: string;
  proxy?: string;
}): Promise<HyphenResponse<any>> {
  return callHyphenAPI<any>('/in0017000047', req);
}

/**
 * 3. 실손형보장계약 조회 API
 */
export async function fetchSilsonContract(req: {
  userId: string;
  userPw: string;
  step?: string;
  step_input?: string;
  step_data?: string;
  proxy?: string;
}): Promise<HyphenResponse<any>> {
  return callHyphenAPI<any>('/in0017000050', req);
}

/**
 * 4. 정액형보장계약 조회 API
 */
export async function fetchFixedContract(req: {
  userId: string;
  userPw: string;
  step?: string;
  step_input?: string;
  step_data?: string;
  proxy?: string;
}): Promise<HyphenResponse<any>> {
  return callHyphenAPI<any>('/in0017000048', req);
}

/**
 * 5. 아이디 중복체크 API (엔드포인트: /in0017000779)
 */
export async function checkHyphenIdDuplicate(req: {
  userId: string;
}): Promise<HyphenResponse<any>> {
  return callHyphenAPI<any>('/in0017000779', req);
}

/**
 * 6. 아이디 찾기 API (엔드포인트: /in0017000778)
 */
export async function findHyphenId(req: {
  step: 'init' | 'captcha' | 'sms';
  userName: string;
  birth: string;
  gender: string; // M, F or 1, 2, 3, 4
  mobileCo: string;
  authType: string;
  mobileNo?: string;
  sendMethod?: string;
  step_data?: string;
  step_input?: string;
  proxy?: string;
}): Promise<HyphenResponse<any>> {
  return callHyphenAPI<any>('/in0017000778', req);
}

/**
 * 7. 비밀번호 찾기 API (엔드포인트: /in0017000780)
 */
export async function findHyphenPw(req: {
  step: 'init' | 'captcha' | 'sms' | 'change';
  userName: string;
  birth: string;
  gender: string; // M, F or 1, 2, 3, 4
  mobileCo: string;
  authType: string;
  mobileNo?: string;
  userId?: string;
  sendMethod?: string;
  tmpPw?: string;
  userPw?: string;
  step_data?: string;
  step_input?: string;
  proxy?: string;
}): Promise<HyphenResponse<any>> {
  return callHyphenAPI<any>('/in0017000780', req);
}
