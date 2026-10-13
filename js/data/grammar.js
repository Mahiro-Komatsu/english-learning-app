// Fully comprehensive English Grammar Database covering all 14 major grammar categories
// Organised into Stages (Stage 1 to 4) with 20 questions each (80 questions per category, 1,120 total)

export const grammarCategories = [
  {
    id: "all",
    name: "全カテゴリ総合実戦テスト",
    icon: "🌐",
    desc: "全14分野からランダムに厳選して実戦形式で演習",
    stages: []
  },
  {
    id: "sentence",
    name: "文型・品詞の語順",
    icon: "📐",
    desc: "第1〜第5文型、自動詞・他動詞の識別、品詞の機能と語順",
    stages: [
      { stage: 1, name: "Stage 1: 5文型の基礎構造", target: "TOEIC 500-600 / IELTS 5.0", desc: "SV, SVC, SVO, SVOO, SVOCの基本識別と品詞", questionCount: 20 },
      { stage: 2, name: "Stage 2: 自動詞・他動詞の完全識別", target: "TOEIC 650-750 / IELTS 6.0", desc: "discuss, enter, resemble, lie vs layなど頻出誤答パターン", questionCount: 20 },
      { stage: 3, name: "Stage 3: 第4・第5文型の応用", target: "TOEIC 800-860 / IELTS 7.0", desc: "make, find, keep, leave のSVOC語順と形容詞補語", questionCount: 20 },
      { stage: 4, name: "Stage 4: 複雑な文型と難関修飾語", target: "TOEIC 900+ / IELTS 8.0+", desc: "文頭副詞句の挿入、目的語の長大化、難関動詞語法", questionCount: 20 }
    ]
  },
  {
    id: "tenses",
    name: "時制・進行形・完了形",
    icon: "⏳",
    desc: "現在・過去・完了形・未来表現・時制の一致と例外",
    stages: [
      { stage: 1, name: "Stage 1: 現在・過去・未来・進行形", target: "TOEIC 500-600 / IELTS 5.0", desc: "基本3時制、進行形にできない状態動詞のルール", questionCount: 20 },
      { stage: 2, name: "Stage 2: 現在完了の4用法", target: "TOEIC 650-750 / IELTS 6.0", desc: "継続・経験・完了・結果と since, for, already の使い分け", questionCount: 20 },
      { stage: 3, name: "Stage 3: 過去完了・未来完了・時制の一致", target: "TOEIC 800-860 / IELTS 7.0", desc: "大過去の識別、by the time節との呼応、時制の一致の例外", questionCount: 20 },
      { stage: 4, name: "Stage 4: 時・条件の副詞節と完了進行形", target: "TOEIC 900+ / IELTS 8.0+", desc: "will不要の副詞節 vs 名詞節の判別、最難関時制問題", questionCount: 20 }
    ]
  },
  {
    id: "modals",
    name: "助動詞・推量・後悔",
    icon: "💡",
    desc: "can, may, must, should, would, 助動詞+have+過去分詞",
    stages: [
      { stage: 1, name: "Stage 1: 基本助動詞のコアニュアンス", target: "TOEIC 500-600 / IELTS 5.0", desc: "can, may, must, should の義務・許可・可能性", questionCount: 20 },
      { stage: 2, name: "Stage 2: 助動詞 have + 過去分詞 (過去の推量・後悔)", target: "TOEIC 650-750 / IELTS 6.0", desc: "should have done, must have done, cannot have done", questionCount: 20 },
      { stage: 3, name: "Stage 3: 要求・提案動詞と仮定法現在", target: "TOEIC 800-860 / IELTS 7.0", desc: "demand / insist / suggest that S (should) do 原形", questionCount: 20 },
      { stage: 4, name: "Stage 4: 助動詞の高度な慣用表現", target: "TOEIC 900+ / IELTS 8.0+", desc: "may well, may as well, cannot help -ing, would rather", questionCount: 20 }
    ]
  },
  {
    id: "passive",
    name: "受動態・群動詞",
    icon: "🔄",
    desc: "進行形受動態、完了受動態、第5文型受動態、by以外の前置詞",
    stages: [
      { stage: 1, name: "Stage 1: 受動態の基本・時制の組み合わせ", target: "TOEIC 500-600 / IELTS 5.0", desc: "is being done, has been done, will be done の語順", questionCount: 20 },
      { stage: 2, name: "Stage 2: 第4・第5文型の受動態", target: "TOEIC 650-750 / IELTS 6.0", desc: "be given, be considered, be elected の補語構造", questionCount: 20 },
      { stage: 3, name: "Stage 3: by以外の前置詞と感情受動態", target: "TOEIC 800-860 / IELTS 7.0", desc: "be surprised at, be pleased with, be covered with", questionCount: 20 },
      { stage: 4, name: "Stage 4: 群動詞の受動態と難関構文", target: "TOEIC 900+ / IELTS 8.0+", desc: "be spoken to, be looked down on, It is said that の書換え", questionCount: 20 }
    ]
  },
  {
    id: "infinitive",
    name: "不定詞 (to do / 原形)",
    icon: "🎯",
    desc: "3用法、使役動詞・知覚動詞、意味上の主語、完了不定詞",
    stages: [
      { stage: 1, name: "Stage 1: to不定詞の3用法と基本構文", target: "TOEIC 500-600 / IELTS 5.0", desc: "名詞的・形容詞的・副詞的用法の識別と目的語を取る動詞", questionCount: 20 },
      { stage: 2, name: "Stage 2: S+V+O+to do と意味上の主語", target: "TOEIC 650-750 / IELTS 6.0", desc: "allow O to do, It is ... for O to do, of O to do", questionCount: 20 },
      { stage: 3, name: "Stage 3: 使役・知覚動詞と完了不定詞", target: "TOEIC 800-860 / IELTS 7.0", desc: "make/have/let + 原形、be seen to do, to have done", questionCount: 20 },
      { stage: 4, name: "Stage 4: 独立不定詞と高度な慣用構文", target: "TOEIC 900+ / IELTS 8.0+", desc: "be to構文、代不定詞、so as to, to make matters worse", questionCount: 20 }
    ]
  },
  {
    id: "gerund",
    name: "動名詞・慣用表現",
    icon: "⚡",
    desc: "不定詞との使い分け、意味上の主語、頻出動名詞構文",
    stages: [
      { stage: 1, name: "Stage 1: 動名詞を目的語に取る動詞", target: "TOEIC 500-600 / IELTS 5.0", desc: "MEGAFEPS (mind, enjoy, give up, avoid, finish...) のマスター", questionCount: 20 },
      { stage: 2, name: "Stage 2: 動名詞と不定詞の意味の使い分け", target: "TOEIC 650-750 / IELTS 6.0", desc: "remember, forget, regret, try, stop の未来志向 vs 過去志向", questionCount: 20 },
      { stage: 3, name: "Stage 3: 動名詞の受動態・完了形と前置詞", target: "TOEIC 800-860 / IELTS 7.0", desc: "being done, having done, look forward to -ing, prevent O from -ing", questionCount: 20 },
      { stage: 4, name: "Stage 4: 動名詞の慣用構文と最難関表現", target: "TOEIC 900+ / IELTS 8.0+", desc: "There is no -ing, It is no use -ing, worth -ing, on -ing", questionCount: 20 }
    ]
  },
  {
    id: "participle",
    name: "分詞・分詞構文",
    icon: "🌿",
    desc: "感情を表す分詞、分詞構文、with+O+C(付帯状況)",
    stages: [
      { stage: 1, name: "Stage 1: 現在分詞と過去分詞の限定修飾", target: "TOEIC 500-600 / IELTS 5.0", desc: "修飾される名詞との能動 vs 受動、感情動詞の分詞形容詞", questionCount: 20 },
      { stage: 2, name: "Stage 2: 分詞構文の基本（時・理由・付帯）", target: "TOEIC 650-750 / IELTS 6.0", desc: "接続詞の省略、受動の分詞構文、否定の Not + 分詞", questionCount: 20 },
      { stage: 3, name: "Stage 3: 独立分詞構文と付帯状況 with+O+C", target: "TOEIC 800-860 / IELTS 7.0", desc: "Weather permitting, with his arms folded, There being no...", questionCount: 20 },
      { stage: 4, name: "Stage 4: 完了分詞構文と学術分詞表現", target: "TOEIC 900+ / IELTS 8.0+", desc: "Having done, Having been done, Given, Judging from", questionCount: 20 }
    ]
  },
  {
    id: "relative",
    name: "関係詞 (代名詞・副詞)",
    icon: "🔗",
    desc: "who/which/that/whose, where/when, 非制限用法, what",
    stages: [
      { stage: 1, name: "Stage 1: 関係代名詞 who, which, that, whose", target: "TOEIC 500-600 / IELTS 5.0", desc: "先行詞と主格・目的格・所有格の決定ルール", questionCount: 20 },
      { stage: 2, name: "Stage 2: 関係副詞 where, when と非制限用法", target: "TOEIC 650-750 / IELTS 6.0", desc: "コンマ非制限用法（that不可）、完全文を導く関係副詞", questionCount: 20 },
      { stage: 3, name: "Stage 3: 前置詞+関係代名詞と複合関係詞", target: "TOEIC 800-860 / IELTS 7.0", desc: "in which, under which, whatever, whoever, whichever", questionCount: 20 },
      { stage: 4, name: "Stage 4: 擬似関係代名詞と高度な関係詞節", target: "TOEIC 900+ / IELTS 8.0+", desc: "as, but, than, 連鎖関係詞節、二重限定、what little", questionCount: 20 }
    ]
  },
  {
    id: "conditionals",
    name: "仮定法・条件文",
    icon: "💭",
    desc: "仮定法過去・過去完了、if省略の倒置、要求・提案動詞",
    stages: [
      { stage: 1, name: "Stage 1: 仮定法過去と仮定法過去完了の基本", target: "TOEIC 500-600 / IELTS 5.0", desc: "If S were/did, would do / If S had done, would have done", questionCount: 20 },
      { stage: 2, name: "Stage 2: 混合仮定法と if 省略・倒置", target: "TOEIC 650-750 / IELTS 6.0", desc: "Had I known, Should you require, Were it not for", questionCount: 20 },
      { stage: 3, name: "Stage 3: if 代用表現と条件節の応用", target: "TOEIC 800-860 / IELTS 7.0", desc: "provided that, supposing, as long as, unless, on condition that", questionCount: 20 },
      { stage: 4, name: "Stage 4: 含意仮定法と仮定法現在", target: "TOEIC 900+ / IELTS 8.0+", desc: "otherwise, but for, without, 名詞主語の仮定、It is high time", questionCount: 20 }
    ]
  },
  {
    id: "comparison",
    name: "比較表現・最上級",
    icon: "⚖️",
    desc: "as...as、the+比較級 the+比較級、ラテン比較級、特殊比較構文",
    stages: [
      { stage: 1, name: "Stage 1: 原級 as...as と比較級・最上級", target: "TOEIC 500-600 / IELTS 5.0", desc: "同等比較、thanの構文、倍数表現 twice as...as", questionCount: 20 },
      { stage: 2, name: "Stage 2: the+比較級 とラテン比較級 to", target: "TOEIC 650-750 / IELTS 6.0", desc: "The more..., the more..., superior/inferior/senior to", questionCount: 20 },
      { stage: 3, name: "Stage 3: no more...than と相関比較構文", target: "TOEIC 800-860 / IELTS 7.0", desc: "no more than (わずか), no less than (〜も), not so much A as B", questionCount: 20 },
      { stage: 4, name: "Stage 4: 否定主語比較と最難関比較表現", target: "TOEIC 900+ / IELTS 8.0+", desc: "Nothing is more... than, second to none, as shrewd an investor as ever lived", questionCount: 20 }
    ]
  },
  {
    id: "prepositions",
    name: "前置詞・句前置詞",
    icon: "📍",
    desc: "時・場所・原因・手段を表す前置詞の厳密な使い分け",
    stages: [
      { stage: 1, name: "Stage 1: 時・場所・手段の基本前置詞", target: "TOEIC 500-600 / IELTS 5.0", desc: "at/on/in, by vs until, for vs during, between vs among", questionCount: 20 },
      { stage: 2, name: "Stage 2: 理由・譲歩・目的の前置詞句", target: "TOEIC 650-750 / IELTS 6.0", desc: "despite, due to, in accordance with, prior to, on behalf of", questionCount: 20 },
      { stage: 3, name: "Stage 3: 動詞・形容詞と前置詞のコロケーション", target: "TOEIC 800-860 / IELTS 7.0", desc: "comply with, attribute to, refrain from, subscribe to", questionCount: 20 },
      { stage: 4, name: "Stage 4: ビジネス・学術最難関の前置詞成句", target: "TOEIC 900+ / IELTS 8.0+", desc: "at the expense of, in the wake of, by dint of, without prejudice to", questionCount: 20 }
    ]
  },
  {
    id: "conjunctions",
    name: "接続詞 (等位・従属)",
    icon: "🌉",
    desc: "although/despite, unless, in case, not only...but also",
    stages: [
      { stage: 1, name: "Stage 1: 基本等位接続詞と従属接続詞", target: "TOEIC 500-600 / IELTS 5.0", desc: "and, but, so, because, although, since, as long as", questionCount: 20 },
      { stage: 2, name: "Stage 2: 相関接続詞 both, either, neither", target: "TOEIC 650-750 / IELTS 6.0", desc: "both A and B, either A or B, neither A nor B, not only A but also B", questionCount: 20 },
      { stage: 3, name: "Stage 3: 接続副詞と前置詞の識別", target: "TOEIC 800-860 / IELTS 7.0", desc: "however, therefore, nevertheless vs although, despite, because of", questionCount: 20 },
      { stage: 4, name: "Stage 4: 複文構造と最難関従属接続詞", target: "TOEIC 900+ / IELTS 8.0+", desc: "lest...should, inasmuch as, insofar as, notwithstanding that", questionCount: 20 }
    ]
  },
  {
    id: "agreement",
    name: "主述一致・話法",
    icon: "🤝",
    desc: "either A or B, each/every, a number of vs the number of",
    stages: [
      { stage: 1, name: "Stage 1: 主語と動詞の基本単複一致", target: "TOEIC 500-600 / IELTS 5.0", desc: "every, each, 不可算名詞 (information, equipment) の単数一致", questionCount: 20 },
      { stage: 2, name: "Stage 2: 相関構文の一致と割合・分数", target: "TOEIC 650-750 / IELTS 6.0", desc: "a number of (複数) vs the number of (単数), percentage of", questionCount: 20 },
      { stage: 3, name: "Stage 3: 関係代名詞節内の一致と集合名詞", target: "TOEIC 800-860 / IELTS 7.0", desc: "one of those who + 複数, the only one who + 単数", questionCount: 20 },
      { stage: 4, name: "Stage 4: 倒置構文における一致と特殊複数", target: "TOEIC 900+ / IELTS 8.0+", desc: "場所句倒置の真主語一致、criteria, curricula, phenomena", questionCount: 20 }
    ]
  },
  {
    id: "inversion",
    name: "否定・倒置・強調構文",
    icon: "🔍",
    desc: "否定語倒置、強調構文 (It is... that)、部分否定、省略",
    stages: [
      { stage: 1, name: "Stage 1: So/Neither do I と基本強調構文", target: "TOEIC 500-600 / IELTS 5.0", desc: "So do I, Neither have I, It is ... that 分裂文の基本", questionCount: 20 },
      { stage: 2, name: "Stage 2: 否定語の文頭倒置 Never, Rarely", target: "TOEIC 650-750 / IELTS 6.0", desc: "Never have I, Hardly had S done when, No sooner had S done than", questionCount: 20 },
      { stage: 3, name: "Stage 3: 場所・方向の副詞句倒置と省略", target: "TOEIC 800-860 / IELTS 7.0", desc: "On the hill stood..., So extensive was..., When implemented", questionCount: 20 },
      { stage: 4, name: "Stage 4: 最難関の倒置・譲歩構文と強調", target: "TOEIC 900+ / IELTS 8.0+", desc: "Not until did S do, Exhausted though they were, Try as he might", questionCount: 20 }
    ]
  }
];

let _cachedQuestions = null;

// Async loader with memory cache
export async function fetchAllGrammarQuestions() {
  if (_cachedQuestions && _cachedQuestions.length > 0) {
    return _cachedQuestions;
  }
  try {
    const res = await fetch('js/data/grammar_questions.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    _cachedQuestions = await res.json();
    return _cachedQuestions;
  } catch (err) {
    console.error('Failed to load grammar_questions.json:', err);
    return grammarQuestions; // fallback
  }
}

export async function loadGrammarQuestions(categoryId, stageNum = null) {
  const all = await fetchAllGrammarQuestions();
  if (categoryId === 'all') {
    return all;
  }
  let filtered = all.filter(q => q.category === categoryId);
  if (stageNum !== null && stageNum !== undefined) {
    filtered = filtered.filter(q => q.stage === Number(stageNum));
  }
  return filtered;
}

// Fallback questions for synchronous imports if needed
export const grammarQuestions = [
  {
    "id": "sentence_s1_01",
    "category": "sentence",
    "stage": 1,
    "level": "easy",
    "title": "第5文型 (SVOC) と形容詞補語",
    "question": "The manager found the newly updated guidelines very _______ for improving workflow.",
    "options": ["helpful", "helpfully", "help", "helping"],
    "correctIndex": 0,
    "answer": 0,
    "translation": "マネージャーは、新しく更新されたガイドラインがワークフローの改善に非常に役立つと気づいた。",
    "explanation": "「find + O + C（OがCだとわかる・気づく）」の第5文型です。目的語 the newly updated guidelines を説明する補語（C）には形容詞が入るため、「helpful（役に立つ）」が正解です。"
  },
  {
    "id": "tenses_s1_01",
    "category": "tenses",
    "stage": 1,
    "level": "easy",
    "title": "状態動詞と現在形",
    "question": "This multinational conglomerate currently _______ regional offices in twenty countries.",
    "options": ["owns", "is owning", "owned", "has owned"],
    "correctIndex": 0,
    "answer": 0,
    "translation": "この多国籍複合企業は現在、20カ国に地域オフィスを所有している。",
    "explanation": "own（所有している）は継続的な状態を表す「状態動詞」であり、原則として進行形にはできません。"
  }
];
