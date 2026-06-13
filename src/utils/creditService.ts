import { createClient } from './supabase/client';

export interface CreditDeductionResult {
  success: boolean;
  message: string;
  current_credits?: number;
}

/**
 * Checks and deducts prepaid credits from an agency atomicly.
 * @param agencyId The UUID of the agency
 * @param amount The number of credits to deduct (e.g. 400 for Remodeling, 300 for Car)
 */
export async function checkAndDeductCredits(
  agencyId: string,
  amount: number,
  plannerId?: string,
  type?: string,
  description?: string
): Promise<CreditDeductionResult> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.rpc('deduct_agency_credits', {
      p_agency_id: agencyId,
      p_amount: amount,
      p_planner_id: plannerId || null,
      p_type: type || 'api_call',
      p_description: description || '',
    });

    if (error) {
      console.error('[CreditService] RPC Error:', error);
      return {
        success: false,
        message: error.message || '크레딧 조회 중 서버 오류가 발생했습니다.',
      };
    }

    if (data && typeof data === 'object') {
      const res = data as any;
      return {
        success: res.success === true,
        message: res.message || '',
        current_credits: res.current_credits,
      };
    }

    return {
      success: false,
      message: '서버로부터 올바르지 않은 응답을 받았습니다.',
    };
  } catch (err: any) {
    console.error('[CreditService] Exception:', err);
    return {
      success: false,
      message: err.message || '네트워크 연결 오류가 발생했습니다.',
    };
  }
}
