// HYPHEN 내보험다보여 API 연동 서비스
import { RawInsurancePolicy } from '../../../types/remodeling';

const USER_ID = (import.meta as any).env.VITE_HYPHEN_USER_ID || 'zkfnth01';
const HKEY = (import.meta as any).env.VITE_HYPHEN_HKEY || 'bebc2c0dfab3266b';

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
    age: 42,
    gender: 'M',
    policies: [
      {
        insurance_company: 'A생명',
        product_name: '무배당 VIP 평생종합 건강보험',
        monthly_premium: 180000,
        riders: [
          { rider_name: '일반암진단비특별약관', coverage_amount: 20000000 },
          { rider_name: '뇌출혈진단비특약', coverage_amount: 10000000 },
          { rider_name: '급성심근경색증진단비특약', coverage_amount: 10000000 }
        ]
      },
      {
        insurance_company: 'B손해',
        product_name: '무배당 든든가족 실손의료보험',
        monthly_premium: 100000,
        riders: [
          { rider_name: '질병입원의료비', coverage_amount: 50000000 },
          { rider_name: '상해통원의료비', coverage_amount: 300000 }
        ]
      }
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
}): Promise<HyphenResponse<any>> {
  return callHyphenAPI<any>('/in0017000047', req);
}

/**
 * 3. 실손형보장계약 조회 API
 */
export async function fetchSilsonContract(req: {
  userId: string;
  userPw: string;
}): Promise<HyphenResponse<any>> {
  return callHyphenAPI<any>('/in0017000050', req);
}

/**
 * 4. 정액형보장계약 조회 API
 */
export async function fetchFixedContract(req: {
  userId: string;
  userPw: string;
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
