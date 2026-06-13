import React, { useState, useEffect } from 'react';
import { createClient } from '../utils/supabase/client';
import { 
  BookOpen, Plus, X, Search, Copy, Check, Trash2, Edit, Eye, 
  EyeOff, Image, Sparkles, ChevronRight, FileText, ArrowUp, ArrowDown, Type, ExternalLink
} from 'lucide-react';

interface Playbook {
  id: string;
  title: string;
  summary: string;
  category: string;
  content: string;
  image_urls: string[];
  is_published: boolean;
  created_at: string;
}

interface ContentBlock {
  id: string;
  type: 'text' | 'image' | 'link';
  value: string;
  linkUrl?: string;
  linkLabel?: string;
}

interface MarketingPlaybookTabProps {
  isSuperAdmin: boolean;
  showHelpGuide?: boolean;
  onToggleHelpGuide?: () => void;
}

const CATEGORIES = ['전체', '네이버 광고', '인스타그램 광고', '카카오 광고', '실전 영업', '일반'];

const DEFAULT_PLAYBOOKS = [
  {
    title: "네이버 롱테일(세부) 키워드 융단폭격 (CPC 50~100원 공략)",
    summary: "대형 GA들이 돈을 쏟아붓는 메인 키워드 대신 클릭 단가가 50원 수준인 가입 의향 확실한 세부 키워드 수만 개를 공략하여 초저비용 고효율 DB를 확보합니다.",
    category: "네이버 광고",
    content: `### 🎯 핵심 요약
대기업 플랫폼이 독점하는 메인 키워드("어린이보험", "태아보험" - 클릭당 1~3만 원)는 과감히 버립니다. 대신, 가입 의지가 확실하지만 클릭 단가는 50원 수준인 '세부 키워드' 수만 개를 세팅하여 광고 단가를 극단적으로 낮춥니다.

---

### 💡 키워드 세팅 예시
* **"30세 여자 실비보험 다이어트"**
* **"현대해상 굿앤굿 22주차 인큐베이터 견적"**
* **"동양생명 수호천사 어른이보험 장점"**
* **"어린이보험 30세 만기 100세 만기 비교 계산기"**

---

### 🚀 실전 실행 프로세스
1. **네이버 광고 관리자**에 로그인한 뒤 [도움말] -> [키워드 도구]로 이동합니다.
2. 특정 메인 키워드를 입력한 뒤 연관 검색어로 나오는 키워드 리스트를 엑셀로 전체 다운로드합니다.
3. 클릭당 노출 가격(CPC)이 최소 입찰가(70원 ~ 100원)에 수렴하면서 검색량이 존재하는 롱테일 키워드들만 필터링합니다.
4. 해당 키워드의 랜딩 URL을 **대표님 개인의 보험리밸런스 홈페이지 링크**로 설정하여 광고 캠페인을 활성화합니다.

---

### 📈 기대 효과
클릭률 자체는 낮을 수 있으나, 한 번 검색해서 유입된 고객은 본인이 찾던 정확한 상품 정보와 우리 앱의 화려하고 정교한 **"개인화된 분석 결과 및 0.1초 시뮬레이션 계산기"**를 마주하기 때문에, **100% 이탈 없이 안심하고 진짜 DB를 남기게 됩니다.**`,
    image_urls: [],
    is_published: true
  },
  {
    title: "인스타그램 / 메타 스폰서드 광고 (시각적 후킹 전략)",
    summary: "우리 앱의 독보적인 강점인 '움직이는 가성비 슬라이더'와 '실시간 레이더 분석 차트' 화면 자체를 숏폼(Reels) 영상 또는 GIF로 제작하여 광고 매력도를 극대화합니다.",
    category: "인스타그램 광고",
    content: `### 🎯 핵심 요약
우리 앱의 가장 큰 시각적 장점인 '움직이는 슬라이더'와 '실시간 분석 그래프' 레이아웃 자체를 화면 녹화하여 숏폼(Reels) 광고로 집행합니다. 글자만 가득한 재미없는 광고들 사이에서 눈을 뗄 수 없는 화려함으로 트래픽을 쓸어 담습니다.

---

### ✍️ 고효율 광고 카피 가이드
아래 문구를 복사하여 광고 문안에 그대로 활용해 보세요.

---

#### [카피 템플릿 1: 거품 제거]
> **"내 어린이보험, 혹시 호갱 당했을까? 10초 만에 AI가 찾아낸 숨은 내 돈 3만 원!"**
> 아직도 엑셀 표와 지루한 설명글만 보고 가입하세요? 내 폰에서 직접 가성비 슬라이더를 당겨보고 최저가 매칭율 세팅을 0.1초 만에 확인하세요!

#### [카피 템플릿 2: 가성비 시뮬레이션]
> **"보험료 15만 원 중 중복 보장만 4만 원? 길바닥에 버려지는 돈을 확정 보장 지출로 돌리는 방법!"**
> 대기업도 흉내 낼 수 없는 극강의 실시간 비교 진단 계산기를 지금 무료로 체험해 보세요.

---

### 📈 기대 효과
인스타그램 피드를 넘기던 유저가 '내 보험료에 거품이 껴있다'는 위기감과 함께, 시각적으로 화려하게 움직이는 계산기에 호기심을 느껴 즉각 클릭하게 됩니다. **(클릭 단가 200원~500원 선에서 대량의 고객 트래픽 유입 가능)**`,
    image_urls: [],
    is_published: true
  },
  {
    title: "카카오 비즈보드 + 카카오 싱크 연동 (이탈률 0% 극강 전략)",
    summary: "카카오톡 상단 얇은 배너 광고와 1초 간편 로그인인 카카오 싱크를 결합해, 귀찮은 개인정보 타이핑 입력을 없애고 가입 저항감을 완벽히 제로로 만듭니다.",
    category: "카카오 광고",
    content: `### 🎯 핵심 요약
고객이 직접 이름과 전화번호를 타이핑하는 귀찮음과 정보 유출 우려를 완벽하게 해소하여 전환율을 0%에 수렴하게 만드는 궁극의 테크니컬 마케팅 방법입니다.

---

### 🔄 고객 경험 시나리오 흐름
1. **광고 노출**: 카카오톡 채팅 목록 맨 위 비즈보드 배너에 **"우리 아이 보험료 10초 무료 진단"**을 매력적으로 노출합니다.
2. **유입 및 체험**: 고객이 배너를 누르면 카카오톡 내부 브라우저(In-App Browser)로 우리 앱이 부드럽게 즉시 실행되며, 고객은 슬라이더를 움직이며 진단을 진행합니다.
3. **카카오 싱크 팝업**: 결과 확인 후 하단의 **[분석 결과 내 카톡으로 소장하기 (1초 완료)]** 버튼을 누릅니다.
4. **1초 DB 수집**: 고객이 동의를 누르는 즉시, 카카오톡에 연동된 **고객의 진짜 실명과 확실한 전화번호**가 우리 데이터베이스로 즉시 전송되며 분석 리포트가 고객 알림톡으로 자동 전송됩니다.

---

### 📈 기대 효과
고객이 가짜 전화번호를 적거나 중간에 귀찮아서 도망치는 **이탈 과정을 완벽히 제거**하여, 사이트 접속자 수 대비 유효 DB 수집 전환율을 일반 광고 폼 대비 300% 이상 끌어올릴 수 있는 핵심 광고 기법입니다.`,
    image_urls: [],
    is_published: true
  }
];

export const MarketingPlaybookTab: React.FC<MarketingPlaybookTabProps> = ({ isSuperAdmin, showHelpGuide = false, onToggleHelpGuide }) => {
  const supabase = createClient();
  const [playbooks, setPlaybooks] = useState<Playbook[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlaybook, setSelectedPlaybook] = useState<Playbook | null>(null);
  
  // Copy feedback tracking
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form Editing states (Super Admin)
  const [isWriting, setIsWriting] = useState(false);
  const [formId, setFormId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formSummary, setFormSummary] = useState('');
  const [formCategory, setFormCategory] = useState('네이버 광고');
  const [formBlocks, setFormBlocks] = useState<ContentBlock[]>([]);
  const [formIsPublished, setFormIsPublished] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPlaybooks();
  }, []);

  const fetchPlaybooks = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('marketing_playbooks')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setPlaybooks(data);
      }
    } catch (err) {
      console.error('Failed to fetch playbooks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSeedDefaults = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('marketing_playbooks')
        .insert(DEFAULT_PLAYBOOKS);

      if (error) {
        alert('기본 비법서 등록에 실패했습니다: ' + error.message);
      } else {
        alert('대표 마케팅 비법서 3종이 성공적으로 등록되었습니다!');
        fetchPlaybooks();
      }
    } catch (e: any) {
      alert('오류 발생: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  // Image compressor helper
  const compressImage = (file: File, maxWidth: number = 800, maxHeight: number = 600, quality: number = 0.75): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedBase64);
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  // Block handlers
  const addTextBlock = () => {
    const newBlock: ContentBlock = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'text',
      value: ''
    };
    setFormBlocks([...formBlocks, newBlock]);
  };

  const addLinkBlock = () => {
    const newBlock: ContentBlock = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'link',
      value: '',
      linkLabel: '',
      linkUrl: ''
    };
    setFormBlocks([...formBlocks, newBlock]);
  };

  const handleAddImageBlock = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newBlocks = [...formBlocks];
    for (let i = 0; i < files.length; i++) {
      try {
        const base64 = await compressImage(files[i]);
        newBlocks.push({
          id: Math.random().toString(36).substr(2, 9),
          type: 'image',
          value: base64
        });
      } catch (err) {
        alert('이미지 압축 중 오류가 발생했습니다.');
      }
    }
    setFormBlocks(newBlocks);
    e.target.value = ''; // Reset input
  };

  const deleteBlock = (id: string) => {
    if (formBlocks.length === 1) {
      setFormBlocks([{ id: Math.random().toString(36).substr(2, 9), type: 'text', value: '' }]);
      return;
    }
    setFormBlocks(formBlocks.filter(b => b.id !== id));
  };

  const moveBlockUp = (index: number) => {
    if (index === 0) return;
    const updated = [...formBlocks];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    setFormBlocks(updated);
  };

  const moveBlockDown = (index: number) => {
    if (index === formBlocks.length - 1) return;
    const updated = [...formBlocks];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    setFormBlocks(updated);
  };

  const updateBlockValue = (id: string, val: string) => {
    setFormBlocks(formBlocks.map(b => b.id === id ? { ...b, value: val } : b));
  };

  const updateLinkBlockDetails = (id: string, label: string, url: string) => {
    setFormBlocks(formBlocks.map(b => b.id === id ? { ...b, linkLabel: label, linkUrl: url } : b));
  };

  const handleSavePlaybook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formSummary.trim()) {
      alert('필수 입력 항목을 채워주세요.');
      return;
    }

    // Check if at least one block is not empty
    const hasContent = formBlocks.some(b => {
      if (b.type === 'text') return b.value.trim() !== '';
      if (b.type === 'image') return b.value !== '';
      if (b.type === 'link') return (b.linkLabel || '').trim() !== '' && (b.linkUrl || '').trim() !== '';
      return false;
    });

    if (!hasContent) {
      alert('최소 하나 이상의 블록에 유효한 내용을 입력해 주세요.');
      return;
    }

    setSaving(true);
    try {
      const contentJson = JSON.stringify(formBlocks);
      const imagesArray = formBlocks.filter(b => b.type === 'image').map(b => b.value);

      const payload = {
        title: formTitle,
        summary: formSummary,
        category: formCategory,
        content: contentJson,
        image_urls: imagesArray,
        is_published: formIsPublished,
        updated_at: new Date().toISOString()
      };

      let error;
      if (formId) {
        // Update existing
        const { error: err } = await supabase
          .from('marketing_playbooks')
          .update(payload)
          .eq('id', formId);
        error = err;
      } else {
        // Insert new
        const { error: err } = await supabase
          .from('marketing_playbooks')
          .insert([payload]);
        error = err;
      }

      if (error) throw error;

      alert('성공적으로 저장되었습니다.');
      setIsWriting(false);
      clearForm();
      fetchPlaybooks();
    } catch (err: any) {
      alert('비법서 저장 실패: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (playbook: Playbook) => {
    setFormId(playbook.id);
    setFormTitle(playbook.title);
    setFormSummary(playbook.summary);
    setFormCategory(playbook.category);
    setFormIsPublished(playbook.is_published);

    let parsed: ContentBlock[] = [];
    try {
      if (playbook.content.trim().startsWith('[')) {
        parsed = JSON.parse(playbook.content);
      }
    } catch (e) {}

    if (parsed.length > 0) {
      setFormBlocks(parsed);
    } else {
      setFormBlocks([
        {
          id: Math.random().toString(36).substr(2, 9),
          type: 'text',
          value: playbook.content
        }
      ]);
    }

    setIsWriting(true);
    setSelectedPlaybook(null);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('정말로 이 비법서 기사를 삭제하시겠습니까?')) return;
    try {
      const { error } = await supabase
        .from('marketing_playbooks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      alert('기사가 성공적으로 삭제되었습니다.');
      fetchPlaybooks();
      if (selectedPlaybook?.id === id) {
        setSelectedPlaybook(null);
      }
    } catch (err: any) {
      alert('삭제 실패: ' + err.message);
    }
  };

  const clearForm = () => {
    setFormId(null);
    setFormTitle('');
    setFormSummary('');
    setFormCategory('네이버 광고');
    setFormBlocks([{ id: Math.random().toString(36).substr(2, 9), type: 'text', value: '' }]);
    setFormIsPublished(true);
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 1500);
  };

  // Filter playbooks
  const filteredPlaybooks = playbooks.filter(playbook => {
    const matchesCategory = categoryFilter === '전체' || playbook.category === categoryFilter;
    const matchesSearch = playbook.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          playbook.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          playbook.content.toLowerCase().includes(searchQuery.toLowerCase());
    const isVisible = isSuperAdmin ? true : playbook.is_published;
    return matchesCategory && matchesSearch && isVisible;
  });

  // Render markdown helper for textual blocks
  const renderMarkdownText = (text: string) => {
    return text.split('\n\n').map((paragraph, pIdx) => {
      // Heading 3 render
      if (paragraph.startsWith('### ')) {
        return (
          <h4 key={pIdx} className="text-sm font-black text-white pt-4 border-b border-slate-850 pb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            {paragraph.replace('### ', '')}
          </h4>
        );
      }
      
      // Quote / Copy box render
      if (paragraph.startsWith('> ')) {
        const blockText = paragraph.replace(/>\s*/g, '');
        const cleanText = blockText.split('\n').join('\n');
        const copyId = `quote-${pIdx}`;
        
        return (
          <div key={pIdx} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 my-4 relative group/quote flex justify-between items-start gap-4">
            <div className="flex-1 whitespace-pre-wrap font-mono text-[11px] text-orange-200/90 leading-relaxed">
              {cleanText}
            </div>
            <button
              type="button"
              onClick={() => handleCopyText(cleanText, copyId)}
              className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white rounded-xl transition-all shrink-0 relative flex items-center justify-center"
              title="광고 문구 복사"
            >
              {copiedId === copyId ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        );
      }

      // Unordered lists render
      if (paragraph.startsWith('* ') || paragraph.startsWith('- ')) {
        return (
          <ul key={pIdx} className="list-disc list-inside pl-4 space-y-2 font-bold text-slate-400">
            {paragraph.split('\n').map((li, liIdx) => (
              <li key={liIdx} className="marker:text-orange-500">
                {li.replace(/^[\*\-]\s*/, '')}
              </li>
            ))}
          </ul>
        );
      }

      // General paragraph text
      return (
        <p key={pIdx} className="whitespace-pre-line text-slate-400 font-bold leading-relaxed">
          {paragraph}
        </p>
      );
    });
  };

  // Parse blocks from selected playbook
  let parsedSelectedBlocks: ContentBlock[] = [];
  let isJsonContent = false;
  if (selectedPlaybook) {
    try {
      if (selectedPlaybook.content.trim().startsWith('[')) {
        parsedSelectedBlocks = JSON.parse(selectedPlaybook.content);
        isJsonContent = true;
      }
    } catch (e) {}
  }

  return (
    <div className="space-y-8 relative">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/60 p-8 rounded-[2.5rem] border border-slate-800 shadow-xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2.5 h-2.5 bg-orange-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] text-orange-400 font-extrabold uppercase tracking-widest">Premium Playbook</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tighter">B2B 실전 마케팅 비법서</h2>
          <p className="text-xs text-slate-400 font-bold mt-1">
            타사가 절대 모방할 수 없는 극강의 시뮬레이션 계산기를 무기 삼아 고품질 DB를 쓸어 담는 핵심 마케팅 플레이북입니다.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2.5 items-center">
          {onToggleHelpGuide && (
            <button
              type="button"
              onClick={onToggleHelpGuide}
              className={`flex items-center gap-2 px-4 py-3 rounded-2xl border text-[11px] font-black transition-all relative overflow-hidden shadow-md cursor-pointer ${
                showHelpGuide 
                  ? 'bg-orange-500/10 border-orange-500/40 text-orange-400 hover:bg-orange-500/20 shadow-lg shadow-orange-500/5' 
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75 ${showHelpGuide ? '' : 'hidden'}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${showHelpGuide ? 'bg-orange-500' : 'bg-slate-600'}`}></span>
              </span>
              <span>💡 도움말 가이드 {showHelpGuide ? 'ON' : 'OFF'}</span>
            </button>
          )}
          {isSuperAdmin && !isWriting && (
            <>
              {playbooks.length === 0 && (
                <button 
                  onClick={handleSeedDefaults}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs py-3 px-5 rounded-2xl border border-slate-700 transition-all shadow-md flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-orange-500" /> 기본 비법서 3종 생성
                </button>
              )}
              <button 
                onClick={() => {
                  clearForm();
                  setIsWriting(true);
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white font-black text-xs py-3 px-5 rounded-2xl transition-all shadow-md shadow-orange-500/10 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> 신규 가이드 작성
              </button>
            </>
          )}
          {isWriting && (
            <button 
              onClick={() => {
                setIsWriting(false);
                clearForm();
              }}
              className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs py-3 px-5 rounded-2xl border border-slate-700 transition-all"
            >
              목록으로 돌아가기
            </button>
          )}
        </div>
      </div>

      {!isWriting ? (
        <>
          {/* Filters & Search */}
          <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
            {/* Category tabs */}
            <div className="flex flex-wrap gap-1.5 bg-slate-950/60 p-1.5 rounded-2xl border border-slate-850 max-w-fit">
              {CATEGORIES.map(category => (
                <button
                  key={category}
                  onClick={() => setCategoryFilter(category)}
                  className={`text-xs font-black px-4 py-2 rounded-xl transition-all ${
                    categoryFilter === category 
                      ? 'bg-orange-500 text-white' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative max-w-sm w-full">
              <input
                type="text"
                placeholder="비법서 내용 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-800 focus:border-orange-500/50 rounded-2xl py-2.5 pl-10 pr-4 outline-none text-xs text-white font-bold placeholder-slate-500"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* Playbook Cards Grid */}
          {loading ? (
            <div className="text-center py-20 bg-slate-950/30 rounded-[2.5rem] border border-slate-900">
              <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-xs text-slate-500 font-bold">비법서 데이터를 불러오는 중입니다...</p>
            </div>
          ) : filteredPlaybooks.length === 0 ? (
            <div className="text-center py-20 bg-slate-950/30 rounded-[2.5rem] border border-slate-900 space-y-3">
              <BookOpen className="w-12 h-12 text-slate-700 mx-auto" />
              <h3 className="text-base font-black text-slate-400">등록된 마케팅 비법서가 없습니다</h3>
              <p className="text-xs text-slate-600 font-bold max-w-xs mx-auto leading-relaxed">
                현재 조회 가능한 마케팅 전략이 없거나 검색 필터와 일치하는 항목이 없습니다.
              </p>
            </div>
          ) : (
            <div className={`grid sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-300 ${
              showHelpGuide ? 'help-guide-glow p-4 rounded-[2rem] bg-slate-900/10' : ''
            }`}>
              {filteredPlaybooks.map(playbook => (
                <div 
                  key={playbook.id}
                  onClick={() => setSelectedPlaybook(playbook)}
                  className="group bg-slate-900/40 hover:bg-slate-900/70 border border-slate-850 hover:border-slate-700 rounded-[2rem] p-6 cursor-pointer transition-all hover:-translate-y-1 shadow-lg hover:shadow-2xl flex flex-col justify-between h-[280px]"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <span className="bg-orange-500/10 text-orange-400 border border-orange-500/20 font-black text-[9px] px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {playbook.category}
                      </span>
                      {isSuperAdmin && (
                        <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                          <button 
                            onClick={() => handleEdit(playbook)}
                            className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
                            title="수정"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => handleDelete(playbook.id)}
                            className="p-1.5 hover:bg-red-950 text-slate-400 hover:text-red-400 rounded-lg transition-colors"
                            title="삭제"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-base font-black text-white group-hover:text-orange-400 transition-colors line-clamp-2 leading-tight tracking-tight">
                        {playbook.title}
                      </h3>
                      <p className="text-xs text-slate-400 font-bold line-clamp-3 leading-relaxed">
                        {playbook.summary}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-850/50 mt-4 text-[10px] text-slate-500 font-bold">
                    <span className="flex items-center gap-1.5">
                      {playbook.is_published ? (
                        <>
                          <Eye className="w-3 h-3 text-green-500" />
                          발행됨
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3 text-yellow-500" />
                          임시저장
                        </>
                      )}
                    </span>
                    <span className="flex items-center gap-1 group-hover:text-white transition-colors">
                      자세히 보기 <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        /* Block-Based Form Editor (Super Admin) */
        <form onSubmit={handleSavePlaybook} className="bg-slate-900/40 border border-slate-850 rounded-[2.5rem] p-8 space-y-6">
          <h3 className="text-lg font-black text-white mb-2">
            {formId ? '비법서 문서 수정' : '새 마케팅 비법서 작성'}
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">
                비법서 제목 (필수)
              </label>
              <input
                type="text"
                value={formTitle}
                onChange={e => setFormTitle(e.target.value)}
                placeholder="예: 인스타그램 릴스를 활용한 실시간 시뮬레이션 후킹 카피"
                className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-xl py-2.5 px-4 outline-none text-xs text-white font-bold"
                required
              />
            </div>

            {/* Summary */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">
                요약 설명 (필수)
              </label>
              <input
                type="text"
                value={formSummary}
                onChange={e => setFormSummary(e.target.value)}
                placeholder="목록 카드에 노출될 2~3줄 분량의 간결한 요약 설명글을 입력해 주세요."
                className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-xl py-2.5 px-4 outline-none text-xs text-white font-bold"
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">
                카테고리
              </label>
              <select
                value={formCategory}
                onChange={e => setFormCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-xl py-2.5 px-4 outline-none text-xs text-white font-bold"
              >
                {CATEGORIES.filter(c => c !== '전체').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">
                발행 상태
              </label>
              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 text-xs text-slate-300 font-bold cursor-pointer select-none">
                  <input
                    type="radio"
                    name="is_published"
                    checked={formIsPublished}
                    onChange={() => setFormIsPublished(true)}
                    className="accent-orange-500 w-4 h-4"
                  />
                  즉시 발행 (구독 회원 조회 가능)
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-300 font-bold cursor-pointer select-none">
                  <input
                    type="radio"
                    name="is_published"
                    checked={!formIsPublished}
                    onChange={() => setFormIsPublished(false)}
                    className="accent-orange-500 w-4 h-4"
                  />
                  임시 저장 (관리자만 조회 가능)
                </label>
              </div>
            </div>

            {/* Content Blocks List (The Professional Editor) */}
            <div className="space-y-4 md:col-span-2">
              <div className="flex justify-between items-center pb-2 border-b border-slate-850">
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">
                  비법서 본문 조립 에디터 (글, 사진, 링크 버튼 교차 구성)
                </label>
                <span className="text-[10px] text-slate-500 font-bold">블록 개수: {formBlocks.length}개</span>
              </div>

              {/* Dynamic Blocks Container */}
              <div className="space-y-4">
                {formBlocks.map((block, idx) => (
                  <div 
                    key={block.id} 
                    className="bg-slate-950/80 border border-slate-850 hover:border-slate-800 rounded-2xl p-5 relative space-y-3 transition-all"
                  >
                    {/* Block Header & Control actions */}
                    <div className="flex justify-between items-center text-[10px] font-black tracking-wider uppercase">
                      <span className="flex items-center gap-1.5">
                        {block.type === 'text' && (
                          <>
                            <Type className="w-3.5 h-3.5 text-orange-500" />
                            <span className="text-orange-500">텍스트(마크다운) 블록 #{idx + 1}</span>
                          </>
                        )}
                        {block.type === 'image' && (
                          <>
                            <Image className="w-3.5 h-3.5 text-green-500" />
                            <span className="text-green-500">이미지(가이드 스크린샷) 블록 #{idx + 1}</span>
                          </>
                        )}
                        {block.type === 'link' && (
                          <>
                            <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                            <span className="text-blue-400">바로가기 버튼 링크 블록 #{idx + 1}</span>
                          </>
                        )}
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => moveBlockUp(idx)}
                          disabled={idx === 0}
                          className="p-1.5 bg-slate-900 hover:bg-slate-805 text-slate-400 hover:text-white rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          title="위로 이동"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveBlockDown(idx)}
                          disabled={idx === formBlocks.length - 1}
                          className="p-1.5 bg-slate-900 hover:bg-slate-805 text-slate-400 hover:text-white rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          title="아래로 이동"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteBlock(block.id)}
                          className="p-1.5 bg-red-950/30 hover:bg-red-900/60 text-slate-400 hover:text-red-400 rounded-lg transition-colors ml-2"
                          title="블록 삭제"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Block content body depending on type */}
                    {block.type === 'text' && (
                      <textarea
                        value={block.value}
                        onChange={e => updateBlockValue(block.id, e.target.value)}
                        placeholder="이곳에 해당 단락의 마케팅 팁 또는 광고 카피 내용을 작성해 주세요 (마크다운 포맷 지원)."
                        rows={6}
                        className="w-full bg-slate-900 border border-slate-850 focus:border-orange-500/50 rounded-xl py-2.5 px-4 outline-none text-xs text-white font-medium leading-relaxed font-mono resize-y"
                      />
                    )}

                    {block.type === 'image' && (
                      <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-900/40 p-4 rounded-xl border border-slate-850/60">
                        {block.value ? (
                          <>
                            <div className="w-40 h-28 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shrink-0 shadow-inner">
                              <img src={block.value} alt="가이드 미리보기" className="w-full h-full object-contain" />
                            </div>
                            <div className="flex-1 space-y-1">
                              <span className="text-[10px] text-green-400 font-extrabold uppercase">정상 등록됨</span>
                              <p className="text-[11px] text-slate-400 font-bold">이미지가 성공적으로 최적화 압축 업로드되었습니다. 아래 [위/아래] 이동 버튼으로 글 중간의 원하는 배치에 꽂아 넣으세요.</p>
                            </div>
                          </>
                        ) : (
                          <span className="text-xs text-slate-500 font-bold">이미지 로드 대기 중...</span>
                        )}
                      </div>
                    )}

                    {block.type === 'link' && (
                      <div className="grid sm:grid-cols-2 gap-4 bg-slate-900/40 p-4 rounded-xl border border-slate-850/60">
                        <div className="space-y-1.5">
                          <span className="text-[10px] text-slate-400 font-extrabold">버튼 라벨 문구</span>
                          <input
                            type="text"
                            value={block.linkLabel || ''}
                            onChange={e => updateLinkBlockDetails(block.id, e.target.value, block.linkUrl || '')}
                            placeholder="예: 네이버 키워드 도구 바로가기"
                            className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-xl py-2 px-3 outline-none text-xs text-white font-bold"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <span className="text-[10px] text-slate-400 font-extrabold">연결할 링크 웹 주소 (URL)</span>
                          <input
                            type="url"
                            value={block.linkUrl || ''}
                            onChange={e => updateLinkBlockDetails(block.id, block.linkLabel || '', e.target.value)}
                            placeholder="예: https://searchad.naver.com"
                            className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-xl py-2 px-3 outline-none text-xs text-white font-bold"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Block builder controller triggers */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 bg-slate-950/40 p-5 rounded-2xl border border-slate-850/60 mt-4">
                <button
                  type="button"
                  onClick={addTextBlock}
                  className="w-full sm:w-auto bg-slate-900 hover:bg-slate-850 border border-slate-800 text-white font-black text-xs py-3 px-6 rounded-2xl transition-all flex items-center justify-center gap-2"
                >
                  <Type className="w-4 h-4 text-orange-500" /> + 텍스트 단락 추가
                </button>

                <button
                  type="button"
                  onClick={addLinkBlock}
                  className="w-full sm:w-auto bg-slate-900 hover:bg-slate-850 border border-slate-800 text-white font-black text-xs py-3 px-6 rounded-2xl transition-all flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4 text-blue-400" /> + 버튼 링크 추가
                </button>
                
                <div className="relative w-full sm:w-auto">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleAddImageBlock}
                    className="hidden"
                    id="block-image-upload-input"
                  />
                  <label
                    htmlFor="block-image-upload-input"
                    className="w-full sm:w-auto bg-slate-900 hover:bg-slate-850 border border-slate-800 text-white font-black text-xs py-3 px-6 rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Image className="w-4 h-4 text-green-500" /> + 가이드 이미지 추가
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-850/60 mt-6">
            <button
              type="button"
              onClick={() => {
                setIsWriting(false);
                clearForm();
              }}
              className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs py-3 px-6 rounded-2xl transition-all"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-orange-500 hover:bg-orange-600 text-white font-black text-xs py-3 px-6 rounded-2xl transition-all shadow-md shadow-orange-500/10"
            >
              {saving ? '저장 중...' : '저장 완료'}
            </button>
          </div>
        </form>
      )}

      {/* Slide-over Reader Modal (Planner/Subscribers) */}
      {selectedPlaybook && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          {/* Backdrop Closer */}
          <div className="absolute inset-0" onClick={() => setSelectedPlaybook(null)} />

          {/* Slide panel */}
          <div className="relative w-full max-w-3xl bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl justify-between animate-slide-in">
            {/* Header */}
            <div className="p-6 border-b border-slate-800 flex justify-between items-start bg-slate-900/80 backdrop-blur-md sticky top-0 z-10">
              <div className="space-y-2">
                <span className="bg-orange-500/10 text-orange-400 border border-orange-500/20 font-black text-[9px] px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {selectedPlaybook.category}
                </span>
                <h3 className="text-xl font-black text-white leading-tight tracking-tight pr-8">
                  {selectedPlaybook.title}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedPlaybook(null)}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {/* Summary highlight */}
              <div className="bg-slate-950/60 border-l-4 border-orange-500 p-5 rounded-r-2xl text-xs text-slate-300 font-bold leading-relaxed shadow-inner">
                {selectedPlaybook.summary}
              </div>

              {/* Render dynamic blocks or fallback to old markdown parser */}
              <div className="space-y-6">
                {isJsonContent ? (
                  parsedSelectedBlocks.map((block) => {
                    if (block.type === 'text') {
                      return (
                        <div key={block.id} className="text-xs text-slate-300 space-y-6 leading-relaxed font-medium">
                          {renderMarkdownText(block.value)}
                        </div>
                      );
                    } else if (block.type === 'image') {
                      return (
                        <div key={block.id} className="border border-slate-850 rounded-2xl overflow-hidden bg-slate-950 p-2 shadow-inner my-6">
                          <img 
                            src={block.value} 
                            alt="가이드 이미지" 
                            className="w-full h-auto rounded-xl object-contain max-h-[450px]"
                            loading="lazy"
                          />
                        </div>
                      );
                    } else if (block.type === 'link') {
                      return (
                        <div key={block.id} className="my-6 text-center">
                          <a 
                            href={block.linkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black text-xs py-3.5 px-6 rounded-2xl transition-all shadow-md hover:shadow-lg hover:shadow-orange-500/15 cursor-pointer max-w-sm w-full border border-orange-400/20"
                          >
                            <span>{block.linkLabel || '링크 바로가기'}</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      );
                    }
                    return null;
                  })
                ) : (
                  /* Fallback Old Layout: Markdown Text first, then images list at bottom */
                  <>
                    <div className="text-xs text-slate-300 space-y-6 leading-relaxed font-medium">
                      {renderMarkdownText(selectedPlaybook.content)}
                    </div>

                    {selectedPlaybook.image_urls && selectedPlaybook.image_urls.length > 0 && (
                      <div className="space-y-4 pt-6 border-t border-slate-800">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Image className="w-4 h-4 text-slate-400" />
                          실전 캡처 및 화면 가이드
                        </h4>
                        <div className="grid gap-4">
                          {selectedPlaybook.image_urls.map((imgUrl, imgIdx) => (
                            <div key={imgIdx} className="border border-slate-850 rounded-2xl overflow-hidden bg-slate-950 p-2 shadow-inner">
                              <img 
                                src={imgUrl} 
                                alt={`가이드 이미지 ${imgIdx + 1}`} 
                                className="w-full h-auto rounded-xl object-contain max-h-[450px]"
                                loading="lazy"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-800 bg-slate-950/50 flex justify-between items-center text-[10px] text-slate-500 font-bold">
              <span>작성일: {new Date(selectedPlaybook.created_at || Date.now()).toLocaleDateString('ko-KR')}</span>
              <span>보험리밸런스 독점 마케팅 가이드</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
