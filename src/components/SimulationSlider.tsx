import React from 'react';
import { AnalysisResult } from '../types/insurance';
import { CancerSlider } from './insurance/cancer/CancerSlider';
import { BrainSlider } from './insurance/brain/BrainSlider';
import { HeartSlider } from './insurance/heart/HeartSlider';
import { SilsonSlider } from './insurance/silson/SilsonSlider';
import { DentalSlider } from './insurance/dental/DentalSlider';
import { PreExistingSlider } from './insurance/preExisting/PreExistingSlider';
import { CaregivingSlider } from './insurance/caregiving/CaregivingSlider';
import { CaregivingOldSlider } from './insurance/caregiving/CaregivingOldSlider';
import { NursingSlider } from './insurance/nursing/NursingSlider';
import { SurgerySlider } from './insurance/surgery/SurgerySlider';
import { HealthSlider } from './insurance/health/HealthSlider';
import { ChildSlider } from './insurance/child/ChildSlider';
import { DriverSlider } from './insurance/driver/DriverSlider';

interface SimulationSliderProps {
  result: AnalysisResult;
}

export const SimulationSlider: React.FC<SimulationSliderProps> = ({ result }) => {
  const category = result.analysis.selectedCategory || '';

  if (category.includes('암') || category === 'cancer') return <CancerSlider result={result} />;
  if (category.includes('뇌혈관') || category === 'cerebrovascular') return <BrainSlider result={result} />;
  if (category.includes('심장')) return <HeartSlider result={result} />;
  if (category.includes('실손') || category.includes('실비')) return <SilsonSlider result={result} />;
  if (category.includes('치아')) return <DentalSlider result={result} />;
  if (category.includes('치매')) return <CaregivingOldSlider result={result} />;
  if (category === 'nursing' || category.includes('재가') || category.includes('시설')) return <NursingSlider result={result} />;
  if (category.includes('간병')) return <CaregivingSlider result={result} />;
  if (category.includes('수술') || category.includes('입원')) return <SurgerySlider result={result} />;
  
  // 운전자보험 지원
  if (category.includes('운전자') || category === 'driver' || !!result.analysis.driver) return <DriverSlider result={result} />;

  // 어린이/태아 유병력자 (pre_family) — 반드시 어른 유병자보다 먼저 체크
  if (result.analysis.child?.isPreFamily || category.includes('유병력자')) return <ChildSlider result={result} />;
  if (category.includes('어린이') || category.includes('태아') || category === 'child') return <ChildSlider result={result} />;
  if (category.includes('유병') || category.includes('간편')) return <PreExistingSlider result={result} />;

  // 기타 보장 자산 및 Fallback
  return <HealthSlider result={result} />;
};

export default SimulationSlider;
