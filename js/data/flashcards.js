// Preloaded Flashcard Decks
// TOEIC 8,000 words & IELTS 8,000 words ordered by importance

let cachedToeicCards = null;
let cachedIeltsCards = null;

export const defaultDecks = [
  {
    id: 'daily',
    name: '日常英会話 (Daily Conversation)',
    icon: '💬',
    description: '毎日の会話やチャットで最もよく使われる必須単語・表現',
    totalWords: 12,
    cards: [
      {
        id: 'd1',
        term: 'Hesitant',
        phonetic: '/ˈhezɪtənt/',
        partOfSpeech: 'adj.',
        meaning: 'ためらいがちな、躊躇している',
        example: 'She was hesitant to ask for help at first.',
        exampleJa: '彼女は最初、助けを求めるのをためらっていた。',
        coreImage: '「足がすくんで一歩前へ踏み出すのをためらう」イメージから『ためらいがちな・躊躇している』',
        etymology: 'haerere (ラテン語：くっつく、立ち往生する) + -ant'
      },
      {
        id: 'd2',
        term: 'Appreciate',
        phonetic: '/əˈpriːʃieɪt/',
        partOfSpeech: 'v.',
        meaning: '感謝する、真価を認める',
        example: 'I really appreciate your kind support.',
        exampleJa: 'あなたの親切なサポートに本当に感謝しています。',
        coreImage: '「相手の行為や価値（price）を正当に評価して敬意を払う」イメージから『感謝する・真価を認める』',
        etymology: 'ad- (〜へ) + pretium (価値・価格 = price) + -ate'
      },
      {
        id: 'd3',
        term: 'Convenient',
        phonetic: '/kənˈviːniənt/',
        partOfSpeech: 'adj.',
        meaning: '都合の良い、便利な',
        example: 'Is 3 PM convenient for you tomorrow?',
        exampleJa: '明日の午後3時はご都合よろしいですか？',
        coreImage: '「必要なものが同じ場所へ一緒にぴったり集まって好都合」というイメージから『都合の良い・便利な』',
        etymology: 'con- (共に) + ven (来る = venire) + -ient'
      },
      {
        id: 'd4',
        term: 'Definite',
        phonetic: '/ˈdefɪnət/',
        partOfSpeech: 'adj.',
        meaning: '明確な、確実な',
        example: 'Do you have a definite plan for the weekend?',
        exampleJa: '週末の明確な予定はありますか？',
        coreImage: '「境界線（fin）をきっちり引いて、曖昧さを排除した」イメージから『明確な・確実な』',
        etymology: 'de- (完全に) + fin (境界・終わり) + -ite'
      },
      {
        id: 'd5',
        term: 'Exhausted',
        phonetic: '/ɪɡˈzɔːstɪd/',
        partOfSpeech: 'adj.',
        meaning: '疲れ果てた、クタクタな',
        example: 'I was completely exhausted after working overtime.',
        exampleJa: '残業の後で完全に疲れ果てていました。',
        coreImage: '「井戸から水を汲み尽くすように、エネルギーを外へ出し切った」イメージから『疲れ果てた・クタクタな』',
        etymology: 'ex- (外へ) + haurire (汲み出す) + -ed'
      },
      {
        id: 'd6',
        term: 'Keep in touch',
        phonetic: '/kiːp ɪn tʌtʃ/',
        partOfSpeech: 'phrase',
        meaning: '連絡を取り合う',
        example: "Let's keep in touch through email.",
        exampleJa: 'メールで連絡を取り合いましょう。',
        coreImage: '「触れ合えるほど近い距離感を保ち続ける」というイメージから『連絡を取り合う』',
        etymology: 'keep (保つ) + in touch (接触の範囲内に)'
      },
      {
        id: 'd7',
        term: 'Spontaneous',
        phonetic: '/spɑːnˈteɪniəs/',
        partOfSpeech: 'adj.',
        meaning: '自発的な、思いつきの、自然発生的な',
        example: 'We made a spontaneous decision to go on a trip.',
        exampleJa: '私たちは思いつきで旅行に行くことを決めました。',
        coreImage: '「外からの強制ではなく、自分の内側から自然と湧き出る」イメージから『自発的な・思いつきの』',
        etymology: 'sponte (自発的に、自分の意志で) + -ous'
      },
      {
        id: 'd8',
        term: 'Relieved',
        phonetic: '/rɪˈliːvd/',
        partOfSpeech: 'adj.',
        meaning: 'ホッとした、安心した',
        example: 'I was so relieved to hear the good news.',
        exampleJa: 'その朗報を聞いて本当に安心しました。',
        coreImage: '「重い荷物を下から持ち上げて軽くしてもらい、肩の荷が下りる」イメージから『安心した・ホッとした』',
        etymology: 're- (再び) + levis (軽い = lever/lift) + -ed'
      },
      {
        id: 'd9',
        term: 'Figure out',
        phonetic: '/ˈfɪɡjər aʊt/',
        partOfSpeech: 'phrase',
        meaning: '理解する、解決策を見つける',
        example: 'We need to figure out how this works.',
        exampleJa: 'これがどう機能するのか解明する必要があります。',
        coreImage: '「頭の中で形（figure）を描いて、外に答えを導き出す」イメージから『理解する・解決策を見つける』',
        etymology: 'figure (形、計算) + out (外へ導き出す)'
      },
      {
        id: 'd10',
        term: 'Coincidence',
        phonetic: '/koʊˈɪnsɪdəns/',
        partOfSpeech: 'n.',
        meaning: '偶然の一致',
        example: 'What a coincidence to meet you here!',
        exampleJa: 'ここであなたにお会いするなんて偶然ですね！',
        coreImage: '「別々の出来事がたまたま同じタイミングで同時に落ち合う」イメージから『偶然の一致』',
        etymology: 'co- (共に) + in- (上に) + cadere (落ちる) + -ence'
      },
      {
        id: 'd11',
        term: 'Catch up',
        phonetic: '/kætʃ ʌp/',
        partOfSpeech: 'phrase',
        meaning: '近況を報告し合う、追いつく',
        example: "Let's grab coffee and catch up soon.",
        exampleJa: '近いうちにお茶でもしながら近況を話そう。',
        coreImage: '「先行した相手のところまで走って追いつき、肩を並べる」イメージから『近況を報告し合う・追いつく』',
        etymology: 'catch (つかまえる) + up (完全に・上まで)'
      },
      {
        id: 'd12',
        term: 'Embarrassed',
        phonetic: '/ɪmˈbærəst/',
        partOfSpeech: 'adj.',
        meaning: '恥ずかしい、きまりが悪い',
        example: 'I was embarrassed when I forgot his name.',
        exampleJa: '彼の名前を忘れて恥ずかしかった。',
        coreImage: '「前方を柵（バー）で塞がれて身動きが取れず、狼狽する」イメージから『恥ずかしい・きまりが悪い』',
        etymology: 'em- (中に) + barra (横木、柵 = bar) + -ed'
      }
    ]
  },
  {
    id: 'toeic',
    name: 'TOEIC (TOEIC L&R Test)',
    icon: '💼',
    description: 'ビジネス・オフィス・実務・契約等、出題頻度・重要度順に完全網羅した8,000語',
    isLargeDeck: true,
    dataFile: './js/data/toeic_8000.json',
    totalWords: 8000,
    stages: [
      { stage: 1, range: '1-1,000', label: 'Stage 1 (目標 500-600点)', desc: '基礎ビジネス最頻出語' },
      { stage: 2, range: '1,001-2,000', label: 'Stage 2 (目標 600-700点)', desc: '実務・業務頻出語' },
      { stage: 3, range: '2,001-3,000', label: 'Stage 3 (目標 700-750点)', desc: '実務応用・交渉語' },
      { stage: 4, range: '3,001-4,000', label: 'Stage 4 (目標 750-800点)', desc: '経営・金融・経済語' },
      { stage: 5, range: '4,001-5,000', label: 'Stage 5 (目標 800-850点)', desc: '高度ビジネス語' },
      { stage: 6, range: '5,001-6,000', label: 'Stage 6 (目標 850-900点)', desc: '上級契約・法律・財務語' },
      { stage: 7, range: '6,001-7,000', label: 'Stage 7 (目標 900-950点)', desc: 'ハイスコア必須難関語' },
      { stage: 8, range: '7,001-8,000', label: 'Stage 8 (目標 950-990点満点)', desc: '最難関マスター語' }
    ],
    cards: []
  },
  {
    id: 'travel',
    name: 'トラベル・海外旅行 (Travel & Hospitality)',
    icon: '✈️',
    description: '空港、ホテル、レストラン、観光でそのまま使える表現',
    totalWords: 8,
    cards: [
      {
        id: 't1',
        term: 'Boarding pass',
        phonetic: '/ˈbɔːrdɪŋ pæs/',
        partOfSpeech: 'n.',
        meaning: '搭乗券',
        example: 'Please have your passport and boarding pass ready.',
        exampleJa: 'パスポートと搭乗券をご用意ください。',
        coreImage: '「飛行機や船の板（ボード）の上へ乗り込むことを許可する通行証」イメージから『搭乗券』',
        etymology: 'board (板・甲板に乗る) + pass (通行証)'
      },
      {
        id: 't2',
        term: 'Baggage claim',
        phonetic: '/ˈbæɡɪdʒ kleɪm/',
        partOfSpeech: 'n.',
        meaning: '手荷物受取所',
        example: 'Follow the signs to reach the baggage claim area.',
        exampleJa: '手荷物受取所へは案内板に従ってお進みください。',
        coreImage: '「預けていた手荷物に対して『これは私のものです』と権利を主張して受け取る場所」イメージから『手荷物受取所』',
        etymology: 'baggage (手荷物) + claim (権利を主張する)'
      },
      {
        id: 't3',
        term: 'Reservation',
        phonetic: '/ˌrezərˈveɪʃn/',
        partOfSpeech: 'n.',
        meaning: '予約',
        example: 'I have a reservation under the name of Sato.',
        exampleJa: 'サトウという名前で予約しております。',
        coreImage: '「他人に取られないよう、前もって自分のために確保して取っておく」イメージから『予約』',
        etymology: 're- (後ろに、取っておく) + serv (保つ) + -ation'
      },
      {
        id: 't4',
        term: 'Complimentary',
        phonetic: '/ˌkɑːmplɪˈmentri/',
        partOfSpeech: 'adj.',
        meaning: '無料の（サービスの）',
        example: 'The hotel provides complimentary breakfast.',
        exampleJa: 'ホテルでは無料の朝食を提供しています。',
        coreImage: '「相手を満たす敬意（賛辞）として、料金を取らずに好意で贈る」イメージから『無料の・サービスの』',
        etymology: 'com- (完全に) + ple (満たす) + -ment + -ary'
      },
      {
        id: 't5',
        term: 'Destination',
        phonetic: '/ˌdestɪˈneɪʃn/',
        partOfSpeech: 'n.',
        meaning: '目的地、行先',
        example: 'What is your final destination?',
        exampleJa: '最終目的地はどちらですか？',
        coreImage: '「向かうべき場所として固く定められた到達地点」イメージから『目的地・行先』',
        etymology: 'de- (完全に) + stare (立つ・定める) + -tion'
      },
      {
        id: 't6',
        term: 'Layover',
        phonetic: '/ˈleɪoʊvər/',
        partOfSpeech: 'n.',
        meaning: '乗り継ぎ時間、経由地での滞在',
        example: 'We have a two-hour layover in Singapore.',
        exampleJa: 'シンガポールで2時間の乗り継ぎがあります。',
        coreImage: '「旅の途中で荷物をいったん置いて、次の便まで横たわって待機する」イメージから『乗り継ぎ時間・滞在』',
        etymology: 'lay (置く、横たえる) + over (越えて)'
      },
      {
        id: 't7',
        term: 'Could I get the check, please?',
        phonetic: '/kʊd aɪ ɡet ðə tʃek pliːz/',
        partOfSpeech: 'phrase',
        meaning: 'お会計をお願いできますか？',
        example: 'Excuse me, could I get the check, please?',
        exampleJa: 'すみません、お会計をお願いできますか？',
        coreImage: '「金額に間違いがないか点検（check）するための計算書を求める」イメージから『お会計をお願いできますか？』',
        etymology: 'check (照合、計算書)'
      },
      {
        id: 't8',
        term: 'Recommendations',
        phonetic: '/ˌrekəmenˈdeɪʃnz/',
        partOfSpeech: 'n.',
        meaning: 'おすすめ、推薦',
        example: 'Do you have any local restaurant recommendations?',
        exampleJa: '地元のおすすめレストランはありますか？',
        coreImage: '「相手に信頼して委ねるに値する素晴らしいものとして紹介する」イメージから『おすすめ・推薦』',
        etymology: 're- (再び) + com- (完全に) + mandare (委ねる・託す) + -tion'
      }
    ]
  },
  {
    id: 'ielts',
    name: 'IELTS (IELTS Academic & General)',
    icon: '🎓',
    description: '学術論文・講義・社会科学・自然科学等、重要度順に完全網羅した8,000語',
    isLargeDeck: true,
    dataFile: './js/data/ielts_8000.json',
    totalWords: 8000,
    stages: [
      { stage: 1, range: '1-1,000', label: 'Stage 1 (目標 Band 5.0-5.5)', desc: 'アカデミック入門最重要語' },
      { stage: 2, range: '1,001-2,000', label: 'Stage 2 (目標 Band 5.5-6.0)', desc: '学術論文・講義基本語' },
      { stage: 3, range: '2,001-3,000', label: 'Stage 3 (目標 Band 6.0-6.5)', desc: '学術論述・分析語' },
      { stage: 4, range: '3,001-4,000', label: 'Stage 4 (目標 Band 6.5-7.0)', desc: '社会・科学高度語' },
      { stage: 5, range: '4,001-5,000', label: 'Stage 5 (目標 Band 7.0-7.5)', desc: '高度論理展開語' },
      { stage: 6, range: '5,001-6,000', label: 'Stage 6 (目標 Band 7.5-8.0)', desc: '学術・批評難関語' },
      { stage: 7, range: '6,001-7,000', label: 'Stage 7 (目標 Band 8.0-8.5)', desc: 'ネイティブ上級学術語' },
      { stage: 8, range: '7,001-8,000', label: 'Stage 8 (目標 Band 8.5-9.0)', desc: '最高峰アカデミック語' }
    ],
    cards: []
  }
];

export async function loadDeckCards(deckId) {
  const cacheBust = 'v_20261013_core_v12';
  try {
    if (deckId === 'toeic') {
      if (!cachedToeicCards) {
        let resp;
        try {
          resp = await fetch(`./js/data/toeic_8000.json?v=${cacheBust}`);
          if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        } catch (fetchErr) {
          resp = await fetch('./js/data/toeic_8000.json');
        }
        cachedToeicCards = await resp.json();
      }
      return cachedToeicCards || [];
    } else if (deckId === 'ielts') {
      if (!cachedIeltsCards) {
        let resp;
        try {
          resp = await fetch(`./js/data/ielts_8000.json?v=${cacheBust}`);
          if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        } catch (fetchErr) {
          resp = await fetch('./js/data/ielts_8000.json');
        }
        cachedIeltsCards = await resp.json();
      }
      return cachedIeltsCards || [];
    }
    const deck = defaultDecks.find(d => d.id === deckId);
    return deck ? deck.cards || [] : [];
  } catch (err) {
    console.error(`Failed to load deck cards for ${deckId}:`, err);
    throw err;
  }
}

export async function getReviewCards(deckIdFilter = null) {
  try {
    const rawProgress = localStorage.getItem('lingua_card_progress');
    if (!rawProgress) return [];
    let progress = {};
    try {
      progress = JSON.parse(rawProgress);
    } catch (e) {
      return [];
    }

    const isReview = (val) => {
      if (!val) return false;
      if (typeof val === 'string') return val.toLowerCase() === 'review';
      return val.status && val.status.toLowerCase() === 'review';
    };

    const reviewKeys = Object.keys(progress).filter(k => isReview(progress[k]));
    if (reviewKeys.length === 0) return [];

    const needToeic = reviewKeys.some(k => k.startsWith('toeic_')) && (!deckIdFilter || deckIdFilter === 'toeic');
    const needIelts = reviewKeys.some(k => k.startsWith('ielts_')) && (!deckIdFilter || deckIdFilter === 'ielts');

    const [toeicCards, ieltsCards] = await Promise.all([
      needToeic ? loadDeckCards('toeic').catch(() => []) : Promise.resolve([]),
      needIelts ? loadDeckCards('ielts').catch(() => []) : Promise.resolve([])
    ]);

  const cardsMap = new Map();

  // 1. Default decks
  defaultDecks.forEach(d => {
    if (!d.isLargeDeck && d.cards) {
      if (!deckIdFilter || deckIdFilter === d.id) {
        d.cards.forEach(c => cardsMap.set(c.id, { ...c, deckName: d.name, deckId: d.id }));
      }
    }
  });

  // 2. Custom decks
  const rawCustom = localStorage.getItem('lingua_custom_decks');
  if (rawCustom) {
    try {
      const customDecks = JSON.parse(rawCustom);
      customDecks.forEach(d => {
        if (d.cards && (!deckIdFilter || deckIdFilter === d.id)) {
          d.cards.forEach(c => cardsMap.set(c.id, { ...c, deckName: d.name, deckId: d.id }));
        }
      });
    } catch {}
  }

  // 3. Large decks
  if (needToeic && toeicCards) {
    toeicCards.forEach(c => cardsMap.set(c.id, { ...c, deckName: 'TOEIC', deckId: 'toeic' }));
  }
  if (needIelts && ieltsCards) {
    ieltsCards.forEach(c => cardsMap.set(c.id, { ...c, deckName: 'IELTS', deckId: 'ielts' }));
  }

  const result = [];
  for (const key of reviewKeys) {
    if (cardsMap.has(key)) {
      const card = cardsMap.get(key);
      const meta = progress[key] || {};
      result.push({
        ...card,
        reviewsCount: meta.reviews || 1,
        lastReviewed: meta.lastReviewed || null
      });
    }
  }

  // Sort by lastReviewed descending (most recent review first)
  result.sort((a, b) => {
    const timeA = a.lastReviewed ? new Date(a.lastReviewed).getTime() : 0;
    const timeB = b.lastReviewed ? new Date(b.lastReviewed).getTime() : 0;
    return timeB - timeA;
  });

  return result;
  } catch (err) {
    console.error('getReviewCards failed:', err);
    return [];
  }
}


