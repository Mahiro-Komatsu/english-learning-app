import os
import json

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUTPUT_FILE = os.path.join(BASE_DIR, 'js', 'data', 'grammar.js')

categories = [
  { 'id': 'all', 'name': '全カテゴリ総合実戦テスト', 'icon': '🌐', 'desc': '全14分野からランダムに10問をセレクトして実戦演習' },
  { 'id': 'sentence', 'name': '文型・品詞の語順', 'icon': '📐', 'desc': '第1〜第5文型、自動詞・他動詞の識別、品詞の機能' },
  { 'id': 'tenses', 'name': '時制・進行形・完了形', 'icon': '⏳', 'desc': '現在・過去・完了形・未来表現・時制の一致と例外' },
  { 'id': 'modals', 'name': '助動詞・推量・後悔', 'icon': '💡', 'desc': 'must, should have, cannot, may as well, 助動詞表現' },
  { 'id': 'passive', 'name': '受動態・群動詞', 'icon': '🔄', 'desc': '進行形受動態、完了受動態、第5文型受動態、by以外の前置詞' },
  { 'id': 'infinitive', 'name': '不定詞 (to do / 原形)', 'icon': '🎯', 'desc': '3用法、使役動詞・知覚動詞、意味上の主語、完了不定詞' },
  { 'id': 'gerund', 'name': '動名詞・慣用表現', 'icon': '⚡', 'desc': '不定詞との使い分け、意味上の主語、頻出動名詞構文' },
  { 'id': 'participle', 'name': '分詞・分詞構文', 'icon': '🌿', 'desc': '感情を表す分詞、分詞構文、with+O+C(付帯状況)' },
  { 'id': 'relative', 'name': '関係詞 (代名詞・副詞)', 'icon': '🔗', 'desc': 'who/which/that/whose, where/when, 非制限用法, what' },
  { 'id': 'conditionals', 'name': '仮定法・条件文', 'icon': '💭', 'desc': '仮定法過去・過去完了、if省略の倒置、要求・提案動詞' },
  { 'id': 'comparison', 'name': '比較表現・最上級', 'icon': '⚖️', 'desc': 'as...as、the+比較級 the+比較級、ラテン比較級、特殊比較構文' },
  { 'id': 'prepositions', 'name': '前置詞・句前置詞', 'icon': '📍', 'desc': '時・場所・原因・手段を表す前置詞の厳密な使い分け' },
  { 'id': 'conjunctions', 'name': '接続詞 (等位・従属)', 'icon': '🌉', 'desc': 'although/despite, unless, in case, not only...but also' },
  { 'id': 'agreement', 'name': '主述一致・話法', 'icon': '🤝', 'desc': 'either A or B, each/every, a number of vs the number of' },
  { 'id': 'inversion', 'name': '否定・倒置・強調構文', 'icon': '🔍', 'desc': '否定語倒置、強調構文 (It is... that)、部分否定、省略' }
]

questions = [
  # 1. sentence: 文型・品詞
  {
    'id': 'sen_1',
    'category': 'sentence',
    'title': '第5文型 (SVOC) と形容詞補語',
    'question': 'The manager found the newly updated guidelines very ______ for improving workflow.',
    'options': ['help', 'helpfully', 'helpful', 'helping'],
    'correctIndex': 2,
    'translation': 'マネージャーは、新しく更新されたガイドラインがワークフローの改善に非常に役立つと気づいた。',
    'explanation': '「find + O + C（OがCだとわかる・気づく）」の第5文型です。目的語 the newly updated guidelines を説明する補語（C）には形容詞が入るため、「helpful（役に立つ）」が正解です。副詞 helpfully は補語になれません。'
  },
  {
    'id': 'sen_2',
    'category': 'sentence',
    'title': '自動詞と他動詞の区別 (discuss)',
    'question': 'The committee members gathered to ______ the proposed annual budget.',
    'options': ['discuss about', 'discuss', 'talk about of', 'mention about'],
    'correctIndex': 1,
    'translation': '委員会メンバーは、提案された年間予算について議論するために集まった。',
    'explanation': 'discuss は他動詞であり、後ろに前置詞 about を取らず直接目的語を置きます。日本語の「〜について議論する」に引きずられて discuss about としないよう注意が必要です。'
  },
  {
    'id': 'sen_3',
    'category': 'sentence',
    'title': '自動詞と他動詞の区別 (lie / lay)',
    'question': 'The important contract documents are ______ on the executive conference table.',
    'options': ['lying', 'laying', 'laid', 'lien'],
    'correctIndex': 0,
    'translation': '重要な契約書類が、役員会議のテーブルの上に置いてある（横たわっている）。',
    'explanation': '「横たわっている、置かれている」という自動詞 lie（現在分詞: lying, 過去: lay, 過去分詞: lain）を用います。lay は他動詞「〜を置く」（現在分詞: laying, 過去: laid）であり目的語が必要です。'
  },
  {
    'id': 'sen_4',
    'category': 'sentence',
    'title': '第4文型 (SVOO) を取れない動詞 (explain)',
    'question': 'The consultant ______ the complicated market trends to all department heads.',
    'options': ['explained', 'introduced to', 'told to', 'said'],
    'correctIndex': 0,
    'translation': 'コンサルタントは、すべての部門長に対して複雑な市場動向を説明した。',
    'explanation': 'explain は「explain + 物 + to 人」の第3文型を取る他動詞です（SVOOは不可）。複雑な動向を説明する文脈には explained が最適です。'
  },
  {
    'id': 'sen_5',
    'category': 'sentence',
    'title': '副詞による形容詞の修飾',
    'question': 'The newly appointed director presented an ______ well-structured expansion strategy.',
    'options': ['exception', 'exceptional', 'exceptionally', 'excepting'],
    'correctIndex': 2,
    'translation': '新しく任命された取締役は、極めてよく構築された事業拡大戦略を提示した。',
    'explanation': '後ろの形容詞（well-structured：よく構築された）を修飾するため、副詞である「exceptionally（例外的なほど、極めて）」が正解です。'
  },
  {
    'id': 'sen_6',
    'category': 'sentence',
    'title': '知覚動詞の第5文型 (see O do / doing)',
    'question': 'The security guard saw an unidentified suspect ______ the perimeter fence late last night.',
    'options': ['climbed', 'climb', 'to climb', 'was climbing'],
    'correctIndex': 1,
    'translation': '警備員は昨夜遅く、身元不明の不審者が境界のフェンスをよじ登るのを目撃した。',
    'explanation': '知覚動詞 see + O + 原形不定詞（または現在分詞）で「Oが〜するのを見る」を表します。to不定詞は使えません。'
  },

  # 2. tenses: 時制
  {
    'id': 'ten_1',
    'category': 'tenses',
    'title': '現在完了進行形',
    'question': 'She ______ for the project since early this morning.',
    'options': ['is working', 'has been working', 'works', 'was worked'],
    'correctIndex': 1,
    'translation': '彼女は今朝早くからずっとそのプロジェクトに取り組んでいる。',
    'explanation': '「since early this morning（今朝早くから）」とあり、過去から現在まで動作が継続していることを強調するため、「have/has been + -ing（現在完了進行形）」が正解です。'
  },
  {
    'id': 'ten_2',
    'category': 'tenses',
    'title': '過去完了 (大過去)',
    'question': 'When I arrived at the international terminal, the flight ______ already departed.',
    'options': ['has', 'had', 'is', 'will have'],
    'correctIndex': 1,
    'translation': '私が国際線ターミナルに着いたとき、その便はすでに出発してしまっていた。',
    'explanation': '到着した時点（過去：arrived）よりも前に飛行機が出発していた「過去の前の過去（大過去）」を表すため、過去完了形「had departed」を用います。'
  },
  {
    'id': 'ten_3',
    'category': 'tenses',
    'title': '未来完了形 (By the time)',
    'question': 'By the time you return next Friday, the renovation team ______ the entire lobby.',
    'options': ['finishes', 'has finished', 'will have finished', 'is finishing'],
    'correctIndex': 2,
    'translation': 'あなたが来週金曜日に戻るまでに、改装チームはロビー全体の工事を完了しているでしょう。',
    'explanation': '「By the time + 現在形（未来の基準点）」があるため、未来のある時点までに動作が完了していることを表す未来完了「will have + 過去分詞」が正解です。'
  },
  {
    'id': 'ten_4',
    'category': 'tenses',
    'title': '時・条件を表す副詞節内の時制',
    'question': 'As soon as the shipment ______ at the warehouse, we will notify the client.',
    'options': ['arrives', 'will arrive', 'arrived', 'is arriving'],
    'correctIndex': 0,
    'translation': '貨物が倉庫に到着し次第、クライアントに通知いたします。',
    'explanation': 'as soon as や when, if など「時や条件を表す副詞節」の中では、未来の事柄であっても未来形 will を使わず、現在形（arrives）で表します。'
  },
  {
    'id': 'ten_5',
    'category': 'tenses',
    'title': '状態動詞と進行形の不可',
    'question': 'This prestigious laboratory currently ______ to one of the world\'s top research institutes.',
    'options': ['is belonging', 'belongs', 'has been belonging', 'belonged'],
    'correctIndex': 1,
    'translation': 'この名門研究所は現在、世界トップクラスの研究機関の1つに属している。',
    'explanation': 'belong（所属する）や resemble（似ている）などの状態動詞は、原則として進行形（is belonging）にできません。現在形 belongs が適切です。'
  },
  {
    'id': 'ten_6',
    'category': 'tenses',
    'title': '現在完了と明確な過去を表す副詞の不併用',
    'question': 'The marketing division ______ the advertising campaign two weeks ago.',
    'options': ['has launched', 'launched', 'is launching', 'had been launched'],
    'correctIndex': 1,
    'translation': 'マーケティング部門は2週間前に広告キャンペーンを開始した。',
    'explanation': 'ago, yesterday, last year など「明確な過去を表す副詞句」は現在完了（has launched）と一緒に使えません。単純過去形 launched を用います。'
  },

  # 3. modals: 助動詞
  {
    'id': 'mod_1',
    'category': 'modals',
    'title': '過去の後悔 (should have + p.p.)',
    'question': 'You ______ the presentation materials before the meeting. Now we are missing key slides.',
    'options': ['should check', 'must check', 'should have checked', 'might check'],
    'correctIndex': 2,
    'translation': '会議の前にプレゼン資料を確認しておくべきだったのに。重要なスライドが抜けています。',
    'explanation': '過去に「〜すべきだったのに（実際はしなかった）」という後悔や非難を表す場合は「should have + 過去分詞」を用います。'
  },
  {
    'id': 'mod_2',
    'category': 'modals',
    'title': '強い確信の否定推量 (cannot be)',
    'question': 'He ______ be at the office right now; I just saw him boarding a flight at the airport.',
    'options': ['can\'t', 'must', 'shouldn\'t', 'might'],
    'correctIndex': 0,
    'translation': '彼が今オフィスにいるはずがない。さっき空港で飛行機に搭乗するのを見たばかりだ。',
    'explanation': '「〜のはずがない」という強い否定の推量を表す助動詞は「can\'t（cannot）」です。「must be（〜に違いない）」の反対の意味として頻出します。'
  },
  {
    'id': 'mod_3',
    'category': 'modals',
    'title': '過去の推量 (must have + p.p.)',
    'question': 'The streets are completely flooded this morning. It ______ heavily during the night.',
    'options': ['must rain', 'must have rained', 'should rain', 'can have rained'],
    'correctIndex': 1,
    'translation': '今朝は道路が完全に冠水している。昨晩大雨が降ったに違いない。',
    'explanation': '「過去に〜したに違いない」という過去の確信的な推量を表すには「must have + 過去分詞」を用います。'
  },
  {
    'id': 'mod_4',
    'category': 'modals',
    'title': 'would rather 原形 than 原形',
    'question': 'I would rather ______ at home tonight than attend the noisy networking dinner.',
    'options': ['stay', 'to stay', 'staying', 'stayed'],
    'correctIndex': 0,
    'translation': '私は騒がしい懇親会に出席するくらいなら、今夜はむしろ家にいたい。',
    'explanation': '「would rather + 動詞の原形（than ...）」で「（〜するくらいなら）むしろ…したい」という選択・願望を表します。原形 stay が正解です。'
  },
  {
    'id': 'mod_5',
    'category': 'modals',
    'title': 'used to と be used to -ing の区別',
    'question': 'Having lived in Tokyo for five years, Maria is now used to ______ crowded morning trains.',
    'options': ['ride', 'riding', 'rode', 'have ridden'],
    'correctIndex': 1,
    'translation': '東京に5年間住んでいるので、マリアは今では朝の満員電車に乗ることに慣れている。',
    'explanation': '「be used to + 動名詞（-ing）/名詞」で「〜に慣れている」という意味になります。「かつて〜していた」の used to + 原形 と混同しないようにしましょう。'
  },
  {
    'id': 'mod_6',
    'category': 'modals',
    'title': 'may well と may as well の区別',
    'question': 'Considering his exceptional diligence, he may ______ pass the certification exam with honors.',
    'options': ['well', 'as well', 'good', 'better'],
    'correctIndex': 0,
    'translation': '彼の抜きんでた勤勉さを考えれば、彼が優等で資格試験に合格するのも十分もっともだ（大いにあり得る）。',
    'explanation': '「may well + 原形」は「大いに〜する可能性がある、〜するのももっともだ」を表します。「may as well + 原形」は「〜したほうがましだ」です。'
  },

  # 4. passive: 受動態
  {
    'id': 'pas_1',
    'category': 'passive',
    'title': '進行形の受動態 (is being repaired)',
    'question': 'The regional highway is currently ______ to improve traffic flow during peak hours.',
    'options': ['repaired', 'being repaired', 'repairing', 'been repaired'],
    'correctIndex': 1,
    'translation': '幹線道路は、ピーク時の交通の流れを改善するため現在補修工事中である。',
    'explanation': '「現在〜されているところだ」という動作の進行を表す受動態は「be動詞 + being + 過去分詞」です。is currently being repaired が正解です。'
  },
  {
    'id': 'pas_2',
    'category': 'passive',
    'title': 'by以外の前置詞をとる受動態 (satisfied with)',
    'question': 'The hiring committee was thoroughly satisfied ______ her impressive credentials.',
    'options': ['at', 'with', 'by', 'to'],
    'correctIndex': 1,
    'translation': '採用委員会は、彼女の見事な資格と実績に完全に満足した。',
    'explanation': 'be satisfied with ... で「〜に満足している」という熟語です。感情や状態を表す受動態では by 以外の前置詞（with, at, about等）が定着しています。'
  },
  {
    'id': 'pas_3',
    'category': 'passive',
    'title': '第5文型の受動態 (be made to do)',
    'question': 'All new recruits were made ______ the compliance handbook before their first day.',
    'options': ['read', 'to read', 'reading', 'have read'],
    'correctIndex': 1,
    'translation': 'すべての新入社員は、初出勤日より前にコンプライアンス規程集を読むよう義務づけられた。',
    'explanation': '使役動詞 make は能動態では「make + O + 原形不定詞」ですが、受動態にすると隠れていた to が復活して「be made to do（〜させられる）」となります。'
  },
  {
    'id': 'pas_4',
    'category': 'passive',
    'title': '群動詞の受動態 (turned down)',
    'question': 'The proposal was ______ by the board due to unexpected budget constraints.',
    'options': ['turned down', 'turning down', 'turn down', 'turned down of'],
    'correctIndex': 0,
    'translation': 'その提案は、予期せぬ予算の制約により取締役会によって却下された。',
    'explanation': 'turn down（却下する）のような群動詞を受動態にする際、前置詞/副詞を分離させずにそのまま「be turned down by ...」の形を保ちます。'
  },
  {
    'id': 'pas_5',
    'category': 'passive',
    'title': '完了形の受動態 (has been installed)',
    'question': 'The latest version of the security software has already ______ on all office laptops.',
    'options': ['installed', 'been installing', 'been installed', 'being installed'],
    'correctIndex': 2,
    'translation': 'セキュリティソフトの最新版は、すでにすべてのオフィスのノートPCにインストールされています。',
    'explanation': 'ソフトウェアは「インストールされる側」であり、完了の動作を表すため現在完了受動態「has been + 過去分詞（has already been installed）」が適切です。'
  },

  # 5. infinitive: 不定詞
  {
    'id': 'inf_1',
    'category': 'infinitive',
    'title': '使役動詞と原形不定詞 (let O do)',
    'question': 'The manager let the team members ______ the seminar venue themselves.',
    'options': ['choose', 'to choose', 'choosing', 'chosen'],
    'correctIndex': 0,
    'translation': 'マネージャーは、チームメンバー自身にセミナー会場を選ばせた（自由に選ぶことを許可した）。',
    'explanation': '使役動詞 let, make, have は「使役動詞 + O + 原形不定詞」の形をとります。to choose ではなく原形 choose が正解です。'
  },
  {
    'id': 'inf_2',
    'category': 'infinitive',
    'title': 'too ... to 構文 (否定の意味)',
    'question': 'The deadline is ______ tight for us to complete all thorough quality checks.',
    'options': ['so', 'too', 'very', 'much'],
    'correctIndex': 1,
    'translation': '締め切りがあまりに厳しすぎて、すべての徹底的な品質検査を完了することができない。',
    'explanation': '「too + 形容詞 + for (意味上の主語) + to do」で「あまりに〜すぎて…できない」という否定的な意味を表します。'
  },
  {
    'id': 'inf_3',
    'category': 'infinitive',
    'title': '完了不定詞 (to have been)',
    'question': 'The ancient fortress seems ______ built in the early fourteenth century.',
    'options': ['to be', 'to have been', 'having been', 'being'],
    'correctIndex': 1,
    'translation': 'その古代の要塞は、14世紀初頭に建設されたように思われる。',
    'explanation': '思われる（seems：現在）時点よりも前に「建設された（過去）」という時制のズレを表すため、完了不定詞受動態「to have been built」を用います。'
  },
  {
    'id': 'inf_4',
    'category': 'infinitive',
    'title': '形容詞的用法の前置詞落ち (a cafe to work in)',
    'question': 'He was looking for a quiet, comfortable cafe to work ______ on his laptop.',
    'options': ['at', 'in', 'with', 'for'],
    'correctIndex': 1,
    'translation': '彼はノートPCで仕事をするための、静かで居心地の良いカフェを探していた。',
    'explanation': '先行する名詞が不定詞の動詞句において前置詞の目的語（work in a cafe）になる場合、末尾の前置詞 in が必須です。'
  },
  {
    'id': 'inf_5',
    'category': 'infinitive',
    'title': 'be to 不定詞の義務・予定',
    'question': 'All conference participants are ______ at the main reception desk by 9:00 AM.',
    'options': ['register', 'to register', 'registering', 'registered'],
    'correctIndex': 1,
    'translation': 'すべての会議参加者は、午前9時までにメイン受付で登録しなければならない（予定である）。',
    'explanation': '「be動詞 + to do」で「予定・義務（〜することになっている / 〜すべき）」を表す構文です。are to register が正解です。'
  },

  # 6. gerund: 動名詞
  {
    'id': 'ger_1',
    'category': 'gerund',
    'title': 'remember to do と remember doing の区別',
    'question': 'Please remember ______ off all conference room lights before leaving the floor.',
    'options': ['turning', 'to turn', 'turn', 'turned'],
    'correctIndex': 1,
    'translation': 'フロアを出る前に、忘れずに会議室の明かりをすべて消してください。',
    'explanation': 'remember to do は「（これから）忘れずに〜する」、remember -ing は「（過去に）〜したことを覚えている」です。これからの動作なので to turn が正解です。'
  },
  {
    'id': 'ger_2',
    'category': 'gerund',
    'title': 'look forward to の to は前置詞',
    'question': 'We are looking forward to ______ you at the upcoming international symposium.',
    'options': ['meet', 'meeting', 'met', 'have met'],
    'correctIndex': 1,
    'translation': '今度の国際シンポジウムであなたにお会いできるのを楽しみにしております。',
    'explanation': 'look forward to の to は不定詞の to ではなく前置詞であるため、後ろには動詞の原形ではなく動名詞（-ing）または名詞が続きます。meeting が正解です。'
  },
  {
    'id': 'ger_3',
    'category': 'gerund',
    'title': '動名詞のみを目的語にとる動詞 (postpone)',
    'question': 'Due to harsh weather conditions, they decided to postpone ______ the new bridge.',
    'options': ['build', 'building', 'to build', 'built'],
    'correctIndex': 1,
    'translation': '悪天候のため、彼らは新しい橋の建設を延期することを決定した。',
    'explanation': 'postpone（延期する）は mind, enjoy, give up, avoid, finish, escape, practice, suggest などと同様に、動名詞（-ing）のみを目的語に取る動詞です。'
  },
  {
    'id': 'ger_4',
    'category': 'gerund',
    'title': 'It is no use -ing 構文',
    'question': 'It is no use ______ over spilled milk; we need to focus on resolving the issue now.',
    'options': ['to cry', 'crying', 'cry', 'cried'],
    'correctIndex': 1,
    'translation': '覆水盆に返らず（済んでしまったことを嘆いても無駄だ）。今は問題の解決に集中すべきだ。',
    'explanation': '「It is no use -ing」で「〜しても無駄である」を表す頻出の動名詞慣用表現です。'
  },
  {
    'id': 'ger_5',
    'category': 'gerund',
    'title': '動名詞の意味上の主語',
    'question': 'The executive committee objected to ______ appointed as the primary negotiator.',
    'options': ['he', 'his', 'him being', 'he is'],
    'correctIndex': 2,
    'translation': '執行委員会は、彼が主任交渉担当者に任命されることに反対した。',
    'explanation': 'object to の前置詞 to に続く動名詞（being appointed）に対し、意味上の主語（彼が）を置く場合は目的格（him）または所有格（his）を用います。'
  },

  # 7. participle: 分詞・分詞構文
  {
    'id': 'par_1',
    'category': 'participle',
    'title': '感情を表す分詞形容詞 (moved / moving)',
    'question': 'All the symposium attendees were visibly ______ by the keynote speaker\'s story.',
    'options': ['moving', 'moved', 'move', 'movement'],
    'correctIndex': 1,
    'translation': 'シンポジウムの出席者全員が、基調講演者の話に明らかに感動していた。',
    'explanation': '人の感情を表す場合、「感動させられる＝感動する」と受動の意味になるため過去分詞 moved を用います。人を感動させる物事は moving です。'
  },
  {
    'id': 'par_2',
    'category': 'participle',
    'title': '付帯状況の with 構文 (with + O + C)',
    'question': 'She gave the final presentation with her arms ______ confidently.',
    'options': ['crossing', 'crossed', 'cross', 'crosses'],
    'correctIndex': 1,
    'translation': '彼女は腕を自信たっぷりに組んだ状態で、最終プレゼンテーションを行った。',
    'explanation': '「with + 目的語 + 補語（分詞）」で「Oを〜したままで（付帯状況）」を表します。腕（her arms）は組まれる受動関係にあるため、過去分詞 crossed が正解です。'
  },
  {
    'id': 'par_3',
    'category': 'participle',
    'title': '分詞構文 (時・原因)',
    'question': '______ that the flight was delayed by three hours, we spent some time at the airport lounge.',
    'options': ['Notice', 'Noticed', 'Noticing', 'Having noticing'],
    'correctIndex': 2,
    'translation': '飛行機が3時間遅延していることに気づいたので、私たちは空港ラウンジで時間を過ごした。',
    'explanation': '主節の主語 we が「気づいた（能動関係）」側であるため、現在分詞を用いた分詞構文「Noticing that ...（As we noticed that ...）」となります。'
  },
  {
    'id': 'par_4',
    'category': 'participle',
    'title': '完了分詞構文 (Having + p.p.)',
    'question': '______ all the financial audits, the accounting firm submitted the comprehensive annual report.',
    'options': ['Completed', 'Having completed', 'Completing', 'Have completed'],
    'correctIndex': 1,
    'translation': 'すべての財務監査を完了したあとで、その会計事務所は包括的な年次報告書を提出した。',
    'explanation': '報告書を提出した時点（過去：submitted）よりも前に「監査を完了した」という時間の前後関係を明確にするため、完了分詞構文「Having + 過去分詞（Having completed）」を用います。'
  },
  {
    'id': 'par_5',
    'category': 'participle',
    'title': '独立分詞構文の慣用表現 (Judging from)',
    'question': '______ from his exceptional performance records, he is the most qualified candidate.',
    'options': ['Judged', 'Judging', 'Judge', 'To judge'],
    'correctIndex': 1,
    'translation': '彼の抜きんでた業績記録から判断すると、彼が最も適任の候補者である。',
    'explanation': '「Judging from ...」で「〜から判断すると」を表す独立分詞構文の慣用表現です。'
  },

  # 8. relative: 関係詞
  {
    'id': 'rel_1',
    'category': 'relative',
    'title': '関係代名詞の所有格 (whose)',
    'question': 'We interviewed an engineer ______ innovative design won the international award.',
    'options': ['who', 'whom', 'whose', 'which'],
    'correctIndex': 2,
    'translation': '私たちは、その革新的なデザインが国際賞を受賞したエンジニアにインタビューした。',
    'explanation': '先行詞 an engineer と後ろの名詞 innovative design の間で所有関係（エンジニアの革新的なデザイン）が成り立つため、所有格の関係代名詞 whose が正解です。'
  },
  {
    'id': 'rel_2',
    'category': 'relative',
    'title': '前置詞 + 関係代名詞 (in which)',
    'question': 'This is the main conference hall ______ the global leaders will convene tomorrow.',
    'options': ['which', 'in which', 'that', 'whose'],
    'correctIndex': 1,
    'translation': 'ここが明日、世界各国の首脳が集まるメイン会議ホールです。',
    'explanation': '後ろの節「the global leaders will convene (in the main conference hall)」は完全な文構造で場所の前置詞 in を必要とするため、「in which」または「where」が入ります。'
  },
  {
    'id': 'rel_3',
    'category': 'relative',
    'title': '関係代名詞 what (先行詞を含む)',
    'question': 'The analyst stated ______ many investors were hesitant to express openly.',
    'options': ['that', 'which', 'what', 'who'],
    'correctIndex': 2,
    'translation': 'そのアナリストは、多くの投資家が公に表明するのをためらっていたことを述べた。',
    'explanation': '先行詞が存在せず、かつ後ろの節で express の目的語が欠けているため、「〜のこと（the thing which）」を意味する関係代名詞 what が正解です。'
  },
  {
    'id': 'rel_4',
    'category': 'relative',
    'title': '関係副詞 where の働き',
    'question': 'The historic laboratory ______ they conducted the groundbreaking experiment has been preserved.',
    'options': ['which', 'where', 'when', 'whose'],
    'correctIndex': 1,
    'translation': '彼らがその画期的な実験を行った歴史的な研究室が保存されている。',
    'explanation': '後ろの節が完全な文構造（第3文型）であり、「その研究室で（in the laboratory）」という副詞の働きをするため、関係副詞 where が正解です。'
  },
  {
    'id': 'rel_5',
    'category': 'relative',
    'title': '複合関係代名詞 (whichever)',
    'question': 'You may choose ______ of the two training sessions fits your current schedule better.',
    'options': ['whatever', 'whichever', 'whoever', 'whenever'],
    'correctIndex': 1,
    'translation': '2つの研修セッションのうち、現在のスケジュールにより合う方のどちらを選んでも構いません。',
    'explanation': '「2つのうちのどちらでも（限定された選択肢）」を指す複合関係代名詞は whichever です。'
  },
  {
    'id': 'rel_6',
    'category': 'relative',
    'title': '非制限用法 (カンマ + which)',
    'question': 'The company announced a full merger with its rival, ______ surprised industry experts.',
    'options': ['that', 'which', 'what', 'where'],
    'correctIndex': 1,
    'translation': 'その会社はライバル企業との完全合併を発表したが、そのことは業界の専門家たちを驚かせた。',
    'explanation': '前の文全体の内容を先行詞として受ける非制限用法（カンマ + which）です。関係代名詞 that はカンマの直後には使えません。'
  },

  # 9. conditionals: 仮定法
  {
    'id': 'cnd_1',
    'category': 'conditionals',
    'title': '仮定法過去完了 (had + p.p. / would have + p.p.)',
    'question': 'If we ______ about the train delay earlier, we would have taken an alternate route.',
    'options': ['knew', 'had known', 'have known', 'would know'],
    'correctIndex': 1,
    'translation': 'もしもっと早く電車の遅延を知っていたら、別のルートを通っただろうに。',
    'explanation': '過去の事実に反する仮定を表す仮定法過去完了です。帰結節が would have taken であるため、if節は「had + 過去分詞（had known）」となります。'
  },
  {
    'id': 'cnd_2',
    'category': 'conditionals',
    'title': '提案・要求動詞に続く that 節 (仮定法現在)',
    'question': 'The safety inspector insisted that the machinery ______ thoroughly inspected before use.',
    'options': ['is', 'was', 'be', 'has been'],
    'correctIndex': 2,
    'translation': '安全検査官は、機械を使用前に徹底的に点検することを要求した。',
    'explanation': 'insist, suggest, recommend, demand などの要求・提案動詞に続く that 節内では、主語にかかわらず動詞の原形（または should + 原形）が使われます。'
  },
  {
    'id': 'cnd_3',
    'category': 'conditionals',
    'title': 'if の省略による倒置 (Had we...)',
    'question': '______ he followed the doctor\'s advice, he would have recovered much faster.',
    'options': ['If', 'Had', 'Should', 'Were'],
    'correctIndex': 1,
    'translation': 'もし彼が医師の助言に従っていたら、もっと早く回復していただろうに。',
    'explanation': '仮定法過去完了の if節において if が省略されると、主語と助動詞 had が倒置して「Had he followed...」となります。'
  },
  {
    'id': 'cnd_4',
    'category': 'conditionals',
    'title': 'without / but for (〜がなければ)',
    'question': '______ your generous financial support, our research project could not have succeeded.',
    'options': ['Without', 'Except', 'Unless', 'Besides'],
    'correctIndex': 0,
    'translation': 'あなたの寛大な資金援助がなかったら、私たちの研究プロジェクトは成功し得なかっただろう。',
    'explanation': '「Without + 名詞」または「But for + 名詞」で「〜がなかったならば」という仮定の意味を表します。'
  },
  {
    'id': 'cnd_5',
    'category': 'conditionals',
    'title': 'It is high time + 仮定法過去',
    'question': 'It is high time you ______ taking your language proficiency exam seriously.',
    'options': ['start', 'started', 'starting', 'have started'],
    'correctIndex': 1,
    'translation': 'あなたはもうとっくに語学資格試験に真剣に取り組み始めていてよい頃だ。',
    'explanation': '「It is (high/about) time + S + 過去形」で「Sは〜してもよい（すべき）時間だ」という現在の事実に対する仮定法過去を表します。'
  },
  {
    'id': 'cnd_6',
    'category': 'conditionals',
    'title': 'as if + 仮定法過去',
    'question': 'He spoke about the negotiations as if he ______ every confidential detail of the contract.',
    'options': ['knows', 'knew', 'has known', 'is knowing'],
    'correctIndex': 1,
    'translation': '彼は契約の極秘の詳細をすべて知っているかのように、交渉について語った。',
    'explanation': '「as if + 仮定法過去（knew）」で「まるで〜であるかのように」という現在の事実に反する仮定を表します。'
  },

  # 10. comparison: 比較
  {
    'id': 'cmp_1',
    'category': 'comparison',
    'title': 'the + 比較級, the + 比較級',
    'question': 'The more rigorously you practice speaking, ______ your pronunciation becomes.',
    'options': ['the natural', 'the more naturally', 'the more natural', 'more natural'],
    'correctIndex': 2,
    'translation': '話す練習を厳密に重ねれば重ねるほど、あなたの発音はより自然になります。',
    'explanation': '「the + 比較級 ..., the + 比較級 ...」で「…すればするほど、ますます〜になる」を表します。becomes の補語として形容詞の比較級「the more natural」が入ります。'
  },
  {
    'id': 'cmp_2',
    'category': 'comparison',
    'title': '倍数表現 (three times as large as)',
    'question': 'The newly constructed warehouse is three times ______ the previous facility.',
    'options': ['as large as', 'larger as', 'as larger than', 'larger that'],
    'correctIndex': 0,
    'translation': '新しく建設された倉庫は、以前の施設の3倍の広さがある。',
    'explanation': '「倍数詞 + as + 原級 + as」で「〜の○倍…だ」を表します。three times as large as が正解です。'
  },
  {
    'id': 'cmp_3',
    'category': 'comparison',
    'title': 'ラテン比較級 (prefer A to B)',
    'question': 'Many remote software developers prefer working from home ______ commuting to the office.',
    'options': ['than', 'to', 'from', 'over than'],
    'correctIndex': 1,
    'translation': '多くのリモートソフトウェア開発者は、オフィスに通勤するよりも在宅勤務を好む。',
    'explanation': 'prefer A to B で「BよりもAを好む」という熟語です。比較級の than ではなく前置詞 to を用いる点に注意が必要です。'
  },
  {
    'id': 'cmp_4',
    'category': 'comparison',
    'title': 'no more than (= only)',
    'question': 'The museum admission fee is ______ five dollars, which is remarkably affordable.',
    'options': ['no more than', 'no less than', 'not less than', 'not more than'],
    'correctIndex': 0,
    'translation': '博物館の入場料はたったの5ドルであり、極めて手頃です。',
    'explanation': '「no more than + 数詞」は「わずか〜だけ（= only）」という少なさを強調する表現です。「no less than」は「〜もたくさん（= as many/much as）」です。'
  },
  {
    'id': 'cmp_5',
    'category': 'comparison',
    'title': '最上級相当の原級表現 (No other ... as ... as)',
    'question': 'No other mountain in Japan is ______ Mount Fuji.',
    'options': ['as higher as', 'higher to', 'as high as', 'the highest than'],
    'correctIndex': 2,
    'translation': '日本で富士山ほど高い山は他にない。',
    'explanation': '「No other + 単数名詞 + is as + 原級 + as ...」で「…ほど〜なものはない（最上級の意味）」を表します。'
  },

  # 11. prepositions: 前置詞
  {
    'id': 'prp_1',
    'category': 'prepositions',
    'title': '期限の by と継続の until',
    'question': 'Please make sure to submit the completed enrollment form ______ Friday at 5:00 PM.',
    'options': ['until', 'by', 'during', 'since'],
    'correctIndex': 1,
    'translation': '金曜日の午後5時までに、記入済みの登録用紙を必ず提出してください。',
    'explanation': '「〜までに（動作の完了期限）」を表す場合は by を用います。「until」は「〜までずっと（動作の継続）」を表すため、提出（submit）のような一回限りの完了動作には使いません。'
  },
  {
    'id': 'prp_2',
    'category': 'prepositions',
    'title': '期間の for と during の区別',
    'question': 'Several valuable historical artifacts were damaged ______ the severe typhoon last weekend.',
    'options': ['for', 'during', 'while', 'at'],
    'correctIndex': 1,
    'translation': '先週末の激しい台風の間に、いくつかの貴重な歴史的遺物が損傷を受けた。',
    'explanation': '「特定の期間・出来事（名詞）」の間を表す場合は during を用います。for は具体的な数値（for three days 等）を伴う期間に用い、while は接続詞なので後ろにS+Vが来ます。'
  },
  {
    'id': 'prp_3',
    'category': 'prepositions',
    'title': '群前置詞 (in spite of)',
    'question': '______ the unfavorable economic conditions, the startup company achieved record sales.',
    'options': ['Although', 'Despite of', 'In spite of', 'Even though'],
    'correctIndex': 2,
    'translation': '不利な経済状況にもかかわらず、そのスタートアップ企業は記録的な売上を達成した。',
    'explanation': '名詞句を導く前置詞句として「In spite of」が正解です。despite は of をつけません。although / even though は接続詞なのでS+Vが必要です。'
  },
  {
    'id': 'prp_4',
    'category': 'prepositions',
    'title': '原因を表す due to',
    'question': 'The outdoor music festival was abruptly canceled ______ torrential rain.',
    'options': ['because', 'due to', 'instead of', 'in terms of'],
    'correctIndex': 1,
    'translation': '屋外音楽フェスティバルは、猛烈な大雨が原因で突然中止された。',
    'explanation': '後ろに名詞句「torrential rain（猛烈な雨）」が続いているため、原因を表す群前置詞「due to（〜のために）」が正解です。because は接続詞です。'
  },
  {
    'id': 'prp_5',
    'category': 'prepositions',
    'title': 'prevent A from -ing',
    'question': 'The security measures are designed to prevent unauthorized personnel ______ entering the vault.',
    'options': ['to', 'for', 'from', 'with'],
    'correctIndex': 2,
    'translation': 'そのセキュリティ対策は、権限のない人員が金庫室に入るのを防ぐよう設計されている。',
    'explanation': '「prevent A from -ing」で「Aが〜するのを妨げる・防ぐ」という頻出表現です。'
  },

  # 12. conjunctions: 接続詞
  {
    'id': 'cnj_1',
    'category': 'conjunctions',
    'title': '相関接続詞 (not only A but also B)',
    'question': 'The new renewable energy policy is beneficial not only to the environment ______ to the local economy.',
    'options': ['and also', 'but also', 'as well', 'or else'],
    'correctIndex': 1,
    'translation': '新しい再生可能エネルギー政策は、環境だけでなく地域経済にも有益である。',
    'explanation': '「not only A but also B」で「AだけでなくBもまた」という対等な相関接続詞構文です。but also が正解です。'
  },
  {
    'id': 'cnj_2',
    'category': 'conjunctions',
    'title': '条件の接続詞 (unless = if ... not)',
    'question': 'We will not be able to deliver the shipment on time ______ we receive your payment today.',
    'options': ['if', 'unless', 'without', 'except'],
    'correctIndex': 1,
    'translation': '本日中にお支払いをいただけない限り、期日通りに貨物をお届けすることはできません。',
    'explanation': 'unless は「〜でない限り（= if ... not）」という否定条件の接続詞です。'
  },
  {
    'id': 'cnj_3',
    'category': 'conjunctions',
    'title': '名詞節を導く whether',
    'question': 'The board members debated ______ the company should acquire the overseas competitor.',
    'options': ['weather', 'whether', 'that', 'what'],
    'correctIndex': 1,
    'translation': '取締役会のメンバーは、会社が海外の競合他社を買収すべきかどうかを議論した。',
    'explanation': '「〜かどうか」という選択の名詞節を導く接続詞は whether です。'
  },
  {
    'id': 'cnj_4',
    'category': 'conjunctions',
    'title': '目的を表す so that S can',
    'question': 'Please leave your contact number ______ we can reach you in case of an emergency.',
    'options': ['so that', 'in order to', 'such that', 'as long as'],
    'correctIndex': 0,
    'translation': '緊急時に連絡が取れるよう、ご連絡先番号をお知らせください。',
    'explanation': '「so that + S + can ...」で「Sが…できるように（目的）」を表す副詞節を導く接続詞です。'
  },
  {
    'id': 'cnj_5',
    'category': 'conjunctions',
    'title': 'as long as と as far as の区別',
    'question': '______ I am concerned, the proposed contract terms are fully acceptable.',
    'options': ['As long as', 'As far as', 'As soon as', 'As much as'],
    'correctIndex': 1,
    'translation': '私に関する限り（私の考えでは）、提案された契約条件は完全に受け入れ可能です。',
    'explanation': '「As far as S is concerned」で「Sに関する限り（範囲）」を表します。「as long as」は「〜する限りは（時間・条件）」です。'
  },

  # 13. agreement: 主述一致・話法
  {
    'id': 'agr_1',
    'category': 'agreement',
    'title': 'a number of と the number of の一致',
    'question': 'The number of tourists visiting the historic castle ______ increased significantly this year.',
    'options': ['have', 'has', 'are', 'were'],
    'correctIndex': 1,
    'translation': 'その歴史的な城を訪れる観光客の数は、今年大幅に増加した。',
    'explanation': '「the number of + 複数名詞」は「〜の数」という意味で単数扱いとなるため、動詞は単数形の has increased が正解です。'
  },
  {
    'id': 'agr_2',
    'category': 'agreement',
    'title': 'either A or B の主述一致',
    'question': 'Either the project manager or the software engineers ______ responsible for the server bug.',
    'options': ['is', 'are', 'was', 'has'],
    'correctIndex': 1,
    'translation': 'プロジェクトマネージャーかソフトウェアエンジニアのどちらかが、サーバーのバグに責任がある。',
    'explanation': '「either A or B」や「neither A nor B」が主語の場合、動詞は「動詞に近い方の主語（B）」に一致させます。the software engineers（複数）に合わせるため are が正解です。'
  },
  {
    'id': 'agr_3',
    'category': 'agreement',
    'title': 'each / every の単数扱い',
    'question': 'Each of the participants ______ required to present a summary of their research.',
    'options': ['is', 'are', 'were', 'have been'],
    'correctIndex': 0,
    'translation': '参加者の各人が、各自の研究の要約を発表することが求められている。',
    'explanation': '「Each of + 複数名詞」は「それぞれ、各人」という単数扱いとなるため、動詞は単数形 is が適切です。'
  },
  {
    'id': 'agr_4',
    'category': 'agreement',
    'title': '時制の一致の例外 (不変の真理)',
    'question': 'Our science teacher taught us that water ______ at 100 degrees Celsius under normal pressure.',
    'options': ['boiled', 'boils', 'is boiling', 'had boiled'],
    'correctIndex': 1,
    'translation': '私たちの理科の先生は、水は標準気圧下で摂氏100度で沸騰すると教えてくれた。',
    'explanation': '主節の動詞が過去形（taught）であっても、従属節の内容が「科学的真理・不変の法則」である場合は時制の一致を受けず、常に現在形（boils）で表します。'
  },
  {
    'id': 'agr_5',
    'category': 'agreement',
    'title': '間接話法の伝達動詞 (tell 人 that)',
    'question': 'The doctor ______ me that I needed to reduce my daily stress levels.',
    'options': ['said', 'told', 'spoke', 'talked'],
    'correctIndex': 1,
    'translation': '医師は私に、日々のストレスレベルを下げる必要があると語った。',
    'explanation': '「人 + that節」を直接目的語に取れる動詞は tell（told 人 that...）です。'
  },

  # 14. inversion: 否定・倒置・強調構文
  {
    'id': 'inv_1',
    'category': 'inversion',
    'title': '否定語の前置による倒置 (Never have I...)',
    'question': 'Never in my entire career ______ such an extraordinary display of teamwork.',
    'options': ['I have seen', 'have I seen', 'I saw', 'did I saw'],
    'correctIndex': 1,
    'translation': '私のこれまでのキャリアの中で、これほど見事なチームワークを目にしたことは一度もない。',
    'explanation': 'Never, Seldom, Hardly などの否定語句が文頭に来ると、後ろは疑問文と同じ語順の倒置（助動詞 + S + V）が起こります。have I seen が正解です。'
  },
  {
    'id': 'inv_2',
    'category': 'inversion',
    'title': '強調構文 (It is ... that ...)',
    'question': 'It was yesterday ______ the executive committee finalized the annual acquisition plan.',
    'options': ['which', 'that', 'what', 'who'],
    'correctIndex': 1,
    'translation': '執行委員会が年次買収計画を最終決定したのは、まさに昨日のことだった。',
    'explanation': '「It was [強調したい語句: yesterday] that [文の残り]」の強調構文です。副詞 yesterday を強調して that で繋ぐ形が正解です。'
  },
  {
    'id': 'inv_3',
    'category': 'inversion',
    'title': '部分否定 (not necessarily)',
    'question': 'A high price does not ______ guarantee the superior quality of a product.',
    'options': ['necessarily', 'completely', 'absolutely', 'total'],
    'correctIndex': 0,
    'translation': '価格が高いからといって、必ずしも製品の優れた品質が保証されるわけではない。',
    'explanation': '「not necessarily」で「必ずしも〜とは限らない（部分否定）」を表す超頻出の文法表現です。'
  },
  {
    'id': 'inv_4',
    'category': 'inversion',
    'title': 'Only then による倒置',
    'question': 'Only after reviewing the entire report ______ the significance of the findings.',
    'options': ['he understood', 'did he understand', 'he did understand', 'understood he'],
    'correctIndex': 1,
    'translation': '報告書全体を精読して初めて、彼はその調査結果の重要性を理解した。',
    'explanation': '「Only + 副詞句/節」が文頭に置かれると、主節で倒置（助動詞 did + 主語 he + 動詞原形 understand）が発生します。'
  },
  {
    'id': 'inv_5',
    'category': 'inversion',
    'title': '同調表現 (Neither / Nor + 倒置)',
    'question': 'Mark didn\'t agree with the proposed changes, and ______ did Sarah.',
    'options': ['so', 'neither', 'either', 'too'],
    'correctIndex': 1,
    'translation': 'マークはその変更案に賛成しなかったし、サラもまた賛成しなかった。',
    'explanation': '否定文に対する同調（〜もまた…ない）は「neither [nor] + 助動詞 + 主語」で表します。'
  }
]

def generate_js():
    output = '// Fully comprehensive English Grammar Database covering all 14 major grammar categories\n'
    output += 'export const grammarCategories = ' + json.dumps(categories, ensure_ascii=False, indent=2) + ';\n\n'
    output += 'export const grammarQuestions = ' + json.dumps(questions, ensure_ascii=False, indent=2) + ';\n'

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write(output)
    print(f"Successfully generated comprehensive grammar.js ({len(categories)} categories, {len(questions)} in-depth questions)")

if __name__ == '__main__':
    generate_js()
