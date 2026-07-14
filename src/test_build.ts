import { buildCategoryOptions } from './lib/remodeling/categoryMatcher';
import { RawInsurancePolicy } from './types/remodeling';

const policy: RawInsurancePolicy = {
  insurance_company: '롯데손보',
  product_name: '(무) let:care 생활상해종합보험(주택플러스)(2604) (월납)',
  monthly_premium: 16100,
  riders: [
    { rider_name: '상해사망', coverage_amount: 50000000 },
    { rider_name: '상해후유장해', coverage_amount: 30000000 },
    { rider_name: '골절진단비', coverage_amount: 300000 },
    { rider_name: '깁스치료비', coverage_amount: 100000 },
    { rider_name: '상해수술비', coverage_amount: 500000 },
  ]
};

const baseAnalysis = {
  age: 40,
  gender: 'M',
  accident: {
    accidentDeathLimit: 50000000,
    accidentDisabilityLimit: 30000000,
    fractureLimit: 300000,
    castLimit: 100000,
    surgeryLimit: 500000,
    hospitalDailyLimit: 0,
    jobClass: 1,
    drivingType: 'private',
    hasLeisureRider: false
  }
} as any;

async function run() {
  try {
    const res = await buildCategoryOptions([policy], baseAnalysis);
    console.log('RESULT:', JSON.stringify(res, null, 2));
  } catch (err) {
    console.error('ERROR:', err);
  }
}

run();
