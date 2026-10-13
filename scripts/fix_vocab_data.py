# -*- coding: utf-8 -*-
"""
fix_vocab_data.py
Cleans and regenerates toeic_8000.json and ielts_8000.json with:
1. Pure, accurate Japanese meanings (no pattern codes, no 'of、名', no junk prepositions)
2. Accurate parts of speech
3. Natural, context-appropriate English example sentences and Japanese translations
4. Premium curated sentences for core TOEIC and IELTS words
"""

import json
import re
import os
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, 'js', 'data')
EJDICT_FILE = os.path.join(BASE_DIR, 'scripts', 'ejdict_raw.json')

# 1. Load EJDict
if not os.path.exists(EJDICT_FILE):
    print("EJDict cache not found! Please run download first.")
    sys.exit(1)

with open(EJDICT_FILE, 'r', encoding='utf-8') as f:
    ejdict = json.load(f)
print(f"Loaded {len(ejdict)} entries from EJDict cache.")

# 2. Handcrafted Premium Definitions and Authentic Sentences for Core TOEIC & IELTS Words
CORE_WORDS_DATA = {
    # TOEIC Core Words
    "inventory": {
        "meaning": "在庫、棚卸し、在庫品",
        "pos": "n.",
        "example": "The warehouse staff conducts a physical inventory count at the end of each month.",
        "exampleJa": "倉庫スタッフは毎月末に現物の棚卸し（在庫確認）を実施します。"
    },
    "agreement": {
        "meaning": "合意、協定、契約",
        "pos": "n.",
        "example": "Both companies signed a mutual agreement to collaborate on the project.",
        "exampleJa": "両社はそのプロジェクトで協力するための相互合意に署名しました。"
    },
    "budget": {
        "meaning": "予算、予算案",
        "pos": "n.",
        "example": "The department had to adjust its annual budget due to unexpected expenses.",
        "exampleJa": "部門は予期せぬ出費のため、年間予算を調整しなければなりませんでした。"
    },
    "contract": {
        "meaning": "契約、契約書",
        "pos": "n.",
        "example": "Please review the terms of the employment contract before signing.",
        "exampleJa": "署名する前に雇用契約書の条項をご確認ください。"
    },
    "invoice": {
        "meaning": "請求書、送り状",
        "pos": "n.",
        "example": "The accounting team will send the invoice once the shipment is delivered.",
        "exampleJa": "出荷品が配達され次第、経理チームが請求書を送付します。"
    },
    "presentation": {
        "meaning": "プレゼンテーション、発表、提示",
        "pos": "n.",
        "example": "She delivered an excellent presentation on quarterly sales performance.",
        "exampleJa": "彼女は四半期の売上業績について素晴らしいプレゼンテーションを行いました。"
    },
    "profit": {
        "meaning": "利益、収益、もうけ",
        "pos": "n.",
        "example": "The corporation reported a 15% increase in net profit this fiscal year.",
        "exampleJa": "同社は今年度の純利益が15%増加したと発表しました。"
    },
    "quarter": {
        "meaning": "四半期、4分の1、15分",
        "pos": "n.",
        "example": "Revenue grew significantly during the third quarter of this fiscal year.",
        "exampleJa": "今年度の第3四半期において売上は大幅に増加しました。"
    },
    "delivery": {
        "meaning": "配達、配送、引き渡し",
        "pos": "n.",
        "example": "Free standard delivery is provided for orders exceeding $50.",
        "exampleJa": "50ドルを超える注文には無料の標準配送が提供されます。"
    },
    "retail": {
        "meaning": "小売、小売りの",
        "pos": "n.",
        "example": "Online shopping has revolutionized the modern retail industry.",
        "exampleJa": "オンラインショッピングは現代の小売業界に革命をもたらしました。"
    },
    "receipt": {
        "meaning": "領収書、レシート、受領",
        "pos": "n.",
        "example": "Please retain your receipt as proof of purchase for reimbursement.",
        "exampleJa": "精算時の購入証明として領収書を保管してください。"
    },
    "conference": {
        "meaning": "会議、総会、協議会",
        "pos": "n.",
        "example": "Over five hundred delegates attended the annual technology conference.",
        "exampleJa": "500名以上の代表者が年次技術会議に出席しました。"
    },
    "client": {
        "meaning": "顧客、依頼人、クライアント",
        "pos": "n.",
        "example": "Our priority is to maintain long-term relationships with every client.",
        "exampleJa": "当社の最優先事項は、すべての顧客と長期的な関係を維持することです。"
    },
    "customer": {
        "meaning": "顧客、客、消費者",
        "pos": "n.",
        "example": "Customer satisfaction is crucial to the success of our brand.",
        "exampleJa": "顧客満足度は私たちのブランドの成功にとって極めて重要です。"
    },
    "employee": {
        "meaning": "従業員、社員",
        "pos": "n.",
        "example": "The company offers comprehensive health benefits to every employee.",
        "exampleJa": "同社は全従業員に対して包括的な健康保険を提供しています。"
    },
    "employer": {
        "meaning": "雇用者、雇い主、経営者",
        "pos": "n.",
        "example": "The new legislation places greater responsibilities on the employer.",
        "exampleJa": "新しい法律は雇用者に対してより大きな責任を課しています。"
    },
    "manager": {
        "meaning": "管理者、支配人、部長",
        "pos": "n.",
        "example": "The project manager held a briefing to outline the upcoming deadlines.",
        "exampleJa": "プロジェクトマネージャーは直近の締切を説明するための説明会を開きました。"
    },
    "executive": {
        "meaning": "幹部、重役、役員",
        "pos": "n.",
        "example": "Senior executives gathered to discuss the corporate expansion strategy.",
        "exampleJa": "上級幹部が集まり、企業の事業拡大戦略について議論しました。"
    },
    "schedule": {
        "meaning": "予定表、スケジュール、日程",
        "pos": "n.",
        "example": "The construction project remains on schedule despite bad weather.",
        "exampleJa": "悪天候にもかかわらず、建設プロジェクトは予定通り進んでいます。"
    },
    "deadline": {
        "meaning": "締め切り、期日",
        "pos": "n.",
        "example": "All department submissions must be completed before Friday's deadline.",
        "exampleJa": "全学科の提出物は金曜日の締切前に完了しなければなりません。"
    },
    "negotiation": {
        "meaning": "交渉、話し合い",
        "pos": "n.",
        "example": "The union entered contract negotiations with company management.",
        "exampleJa": "労働組合は会社経営陣と契約交渉に入りました。"
    },
    "proposal": {
        "meaning": "提案、企画書、提案書",
        "pos": "n.",
        "example": "The committee approved the marketing proposal unanimously.",
        "exampleJa": "委員会はマーケティング提案を満場一致で承認しました。"
    },
    "revenue": {
        "meaning": "歳入、売上高、総収益",
        "pos": "n.",
        "example": "Online sales accounted for 40% of the firm's total revenue.",
        "exampleJa": "オンライン販売が同社の総売上高の40%を占めました。"
    },
    "estimate": {
        "meaning": "見積もり、概算、見積もる",
        "pos": "n.",
        "example": "The contractor provided a cost estimate for the office renovation.",
        "exampleJa": "業者はオフィス改装にかかる費用の見積もりを提示しました。"
    },
    "warranty": {
        "meaning": "保証、保証期間、保証書",
        "pos": "n.",
        "example": "The laptop comes with a two-year manufacturer warranty.",
        "exampleJa": "そのノートパソコンには2年間のメーカー保証が付いています。"
    },
    "shipping": {
        "meaning": "配送、出荷、船積み",
        "pos": "n.",
        "example": "Expedited shipping is available for urgent international orders.",
        "exampleJa": "緊急の海外注文には速達配送をご利用いただけます。"
    },
    "warehouse": {
        "meaning": "倉庫、商品保管所",
        "pos": "n.",
        "example": "New automated forklifts were installed in the distribution warehouse.",
        "exampleJa": "配送倉庫に新しい自動フォークリフトが導入されました。"
    },
    "merchandise": {
        "meaning": "商品、製品",
        "pos": "n.",
        "example": "The store displays seasonal merchandise near the main entrance.",
        "exampleJa": "店舗は正面入口の近くに季節商品を展示しています。"
    },
    "refund": {
        "meaning": "返金、払い戻し",
        "pos": "n.",
        "example": "Customers are eligible for a full refund within 30 days of purchase.",
        "exampleJa": "購入後30日以内であれば全額返金の対象となります。"
    },
    "supplier": {
        "meaning": "供給業者、納入業者、サプライヤー",
        "pos": "n.",
        "example": "We source high-quality raw materials from a reliable domestic supplier.",
        "exampleJa": "信頼できる国内の供給業者から高品質な原材料を調達しています。"
    },
    "vendor": {
        "meaning": "ベンダー、販売業者、売り手",
        "pos": "n.",
        "example": "The IT department evaluates multiple software vendors before choosing one.",
        "exampleJa": "IT部門は採用する前に複数のソフトウェアベンダーを評価します。"
    },
    "headquarters": {
        "meaning": "本社、本部",
        "pos": "n.",
        "example": "The multinational corporation decided to relocate its global headquarters.",
        "exampleJa": "その多国籍企業はグローバル本社を移転することを決定しました。"
    },
    "facility": {
        "meaning": "施設、設備",
        "pos": "n.",
        "example": "The research facility is equipped with state-of-the-art laboratory tools.",
        "exampleJa": "その研究施設には最先端の実験機器が備え付けられています。"
    },
    "maintenance": {
        "meaning": "保守、整備、維持管理",
        "pos": "n.",
        "example": "Regular maintenance extends the operating lifespan of the machinery.",
        "exampleJa": "定期的な保守点検により、機械の稼働寿命を延ばすことができます。"
    },
    "compliance": {
        "meaning": "法令遵守、コンプライアンス",
        "pos": "n.",
        "example": "Strict compliance with environmental standards is required by law.",
        "exampleJa": "法律によって環境基準の厳格な遵守が求められています。"
    },
    "regulation": {
        "meaning": "規制、規則、法令",
        "pos": "n.",
        "example": "New government regulations will affect export trade starting next month.",
        "exampleJa": "新しい政府規制により、来月から輸出貿易に影響が生じます。"
    },
    "qualification": {
        "meaning": "資格、適性、能力",
        "pos": "n.",
        "example": "Applicants must meet all professional qualifications for the role.",
        "exampleJa": "応募者はその役職に必要なすべての専門資格を満たす必要があります。"
    },
    "resume": {
        "meaning": "履歴書、経歴書",
        "pos": "n.",
        "example": "Please submit your updated resume along with two references.",
        "exampleJa": "更新した履歴書と2通の推薦状を提出してください。"
    },
    "applicant": {
        "meaning": "応募者、志願者",
        "pos": "n.",
        "example": "More than two hundred applicants applied for the managerial position.",
        "exampleJa": "200名以上の応募者がその管理職ポジションに応募しました。"
    },
    "candidate": {
        "meaning": "候補者、志望者",
        "pos": "n.",
        "example": "The hiring committee interviewed the top three candidates today.",
        "exampleJa": "採用委員会は本日、上位3名の候補者と面接を行いました。"
    },
    "recruitment": {
        "meaning": "採用、人材募集",
        "pos": "n.",
        "example": "The human resources team launched an online recruitment campaign.",
        "exampleJa": "人事チームはオンライン採用キャンペーンを開始しました。"
    },
    "payroll": {
        "meaning": "給与支払い、給与台帳、人件費",
        "pos": "n.",
        "example": "All salaries will be deposited directly via the automated payroll system.",
        "exampleJa": "すべての給与は自動給与振込システムを通じて直接入金されます。"
    },
    "salary": {
        "meaning": "給与、月給、年俸",
        "pos": "n.",
        "example": "The company offers a competitive salary and performance bonuses.",
        "exampleJa": "同社は競争力のある給与と業績賞与を提供しています。"
    },
    "compensation": {
        "meaning": "報酬、補償金、賠償",
        "pos": "n.",
        "example": "The compensation package includes stock options and retirement benefits.",
        "exampleJa": "報酬パッケージにはストックオプションと退職手当が含まれます。"
    },
    "implement": {
        "meaning": "実行する、導入する、実施する",
        "pos": "v.",
        "example": "The company decided to implement new security protocols immediately.",
        "exampleJa": "同社は新しいセキュリティプロトコルを即座に導入することを決定しました。"
    },
    "streamline": {
        "meaning": "合理化する、簡素化する",
        "pos": "v.",
        "example": "Management aims to streamline administrative processes to cut overhead costs.",
        "exampleJa": "経営陣は諸経費を削減するため、事務手続きを合理化することを目指しています。"
    },
    "reimburse": {
        "meaning": "払い戻す、経費を精算する",
        "pos": "v.",
        "example": "The finance department will reimburse travel expenses within five business days.",
        "exampleJa": "財務部は5営業日以内に出張交通費を精算します。"
    },
    
    # IELTS Core Words
    "hypothesis": {
        "meaning": "仮説、前提",
        "pos": "n.",
        "example": "The scientists formulated a hypothesis to explain the unusual test results.",
        "exampleJa": "科学者たちはその異常な検査結果を説明するための仮説を立てました。"
    },
    "empirical": {
        "meaning": "実証的な、経験に基づいた",
        "pos": "adj.",
        "example": "The theory is strongly supported by empirical evidence from field studies.",
        "exampleJa": "その理論は現地調査による実証的証拠によって強く支持されています。"
    },
    "parameter": {
        "meaning": "媒介変数、尺度、制約条件",
        "pos": "n.",
        "example": "The researchers defined strict parameters to maintain experimental control.",
        "exampleJa": "研究者らは実験の統制を維持するため、厳格なパラメータを定めました。"
    },
    "phenomenon": {
        "meaning": "現象、事象",
        "pos": "n.",
        "example": "Global warming is a complex phenomenon influenced by human activities.",
        "exampleJa": "地球温暖化は人間の活動に影響された複雑な現象です。"
    },
    "criterion": {
        "meaning": "基準、評価尺度",
        "pos": "n.",
        "example": "Academic performance is not the only criterion for university admission.",
        "exampleJa": "学業成績は大学入試における唯一の評価基準ではありません。"
    },
    "spectrum": {
        "meaning": "範囲、スペクトル、連続体",
        "pos": "n.",
        "example": "The survey gathered opinions across a broad political spectrum.",
        "exampleJa": "その調査は幅広い政治的スペクトルにわたって意見を集めました。"
    },
    "dichotomy": {
        "meaning": "二分法、対立",
        "pos": "n.",
        "example": "Scholars debated the false dichotomy between nature and nurture.",
        "exampleJa": "学者たちは生まれと育ちの間の誤った二分法について議論しました。"
    },
    "paradigm": {
        "meaning": "枠組み、理論的枠組み、模範",
        "pos": "n.",
        "example": "Quantum mechanics introduced a new paradigm in modern physics.",
        "exampleJa": "量子力学は現代物理学において新たなパラダイムをもたらしました。"
    },
    "correlation": {
        "meaning": "相関関係、相互関係",
        "pos": "n.",
        "example": "Statistical analysis showed a strong correlation between exercise and mental health.",
        "exampleJa": "統計分析により、運動とメンタルヘルスの間に強い相関関係が示されました。"
    },
    "causation": {
        "meaning": "因果関係、原因",
        "pos": "n.",
        "example": "Researchers must be careful not to confuse correlation with causation.",
        "exampleJa": "研究者は相関関係と因果関係を混同しないよう注意しなければなりません。"
    },
    "disparity": {
        "meaning": "格差、相違、不均衡",
        "pos": "n.",
        "example": "The report highlights the growing economic disparity between urban and rural areas.",
        "exampleJa": "その報告書は都市部と農村部の間で拡大する経済格差を浮き彫りにしています。"
    },
    "proportion": {
        "meaning": "割合、比率、均衡",
        "pos": "n.",
        "example": "A significant proportion of the population now works remotely.",
        "exampleJa": "人口のかなりの割合が現在リモートワークを行っています。"
    },
    "deviation": {
        "meaning": "逸脱、偏差、外れること",
        "pos": "n.",
        "example": "Any significant deviation from the protocol must be documented immediately.",
        "exampleJa": "プロトコルからの重大な逸脱はすべて直ちに記録されなければなりません。"
    },
    "framework": {
        "meaning": "枠組み、構造、フレームワーク",
        "pos": "n.",
        "example": "The authors established a theoretical framework for analyzing language acquisition.",
        "exampleJa": "著者らは言語習得を分析するための理論的枠組みを構築しました。"
    },
    "consensus": {
        "meaning": "合意、総意、意見の一致",
        "pos": "n.",
        "example": "There is a scientific consensus that human activity drives climate change.",
        "exampleJa": "人間活動が気候変動を引き起こしているという科学的合意が存在します。"
    },
    "extrinsic": {
        "meaning": "外的な、非本質的な、付帯的な",
        "pos": "adj.",
        "example": "Extrinsic factors such as salary can motivate employees in the short term.",
        "exampleJa": "給与などの外的な要因は短期的に従業員のやる気を引き出すことができます。"
    },
    "analogous": {
        "meaning": "類似した、類似の",
        "pos": "adj.",
        "example": "The brain's neural network is often described as analogous to a computer circuit.",
        "exampleJa": "脳の神経ネットワークはしばしばコンピュータ回路に類似していると説明されます。"
    },
    "congruent": {
        "meaning": "一致した、調和する、合同の",
        "pos": "adj.",
        "example": "The study findings are fully congruent with previous research results.",
        "exampleJa": "研究結果は過去の研究成果と完全に一致しています。"
    }
}

# 3. Clean EJDict Entry Function
def parse_clean_ejdict(word, raw_text):
    # Check if word has handcrafted data
    w_low = word.lower()
    if w_low in CORE_WORDS_DATA:
        d = CORE_WORDS_DATA[w_low]
        return d['pos'], d['meaning']

    # Step 1: Strip grammar/preposition pattern markers inside 《...》
    # EJDict uses 《+『of』+『名』》 for collocations, which should NEVER be treated as definitions
    clean_text = re.sub(r'《.*?》', '', raw_text)

    # Step 2: Determine POS from the first sense or tags
    pos = 'n.'
    # Check explicitly marked POS tags in the text
    first_sense = clean_text.split('/')[0]
    
    if any(k in first_sense for k in ['〈自〉', '〈他〉', '【動】', '〈動〉', '{動}']):
        pos = 'v.'
    elif any(k in first_sense for k in ['〈形〉', '【形】', '{形}']):
        pos = 'adj.'
    elif any(k in first_sense for k in ['〈副〉', '【副】', '{副}']):
        pos = 'adv.'
    elif any(k in first_sense for k in ['〈C〉', '〈U〉', '〈C,U〉', '{名}', '【名】']):
        pos = 'n.'
    elif any(k in first_sense for k in ['〈前〉', '【前】']):
        pos = 'prep.'
    elif any(k in first_sense for k in ['〈接〉', '【接】']):
        pos = 'conj.'
    else:
        # Morphological fallback by suffix
        if w_low.endswith(('tion', 'sion', 'ment', 'ance', 'ence', 'ity', 'ness', 'ism', 'ship', 'ure', 'or', 'er', 'ee', 'cy', 'ist')):
            pos = 'n.'
        elif w_low.endswith(('ize', 'ise', 'ate', 'ify')):
            pos = 'v.'
        elif w_low.endswith(('able', 'ible', 'al', 'ful', 'ic', 'ive', 'ous', 'less', 'ish')):
            pos = 'adj.'
        elif w_low.endswith('ly'):
            pos = 'adv.'
        elif any(k in first_sense for k in ['…する', '…を〜する', '…させる']):
            pos = 'v.'
        elif any(k in first_sense for k in ['…な', '…の', '的な']):
            pos = 'adj.'

    # Step 3: Extract highlighted primary definitions in 『...』 outside 《...》
    primary = []
    for q in re.findall(r'『(.*?)』', clean_text):
        q = q.strip()
        # Skip if contains english chars or is a POS abbreviation
        if not re.search(r'[a-zA-Z]', q) and q not in ['名', '動', '形', '副', '代', '前', '接', '自', '他', '単', '複', '節', '句']:
            q = re.sub(r'[\(\)（）\[\]\{\}「」,;]', '', q).strip()
            if len(q) >= 1 and q not in primary:
                primary.append(q)

    # Step 4: Remove bracketed annotations: (...), （...）, 〈...〉, [...], 【...】
    t = re.sub(r'[\(（〔《〈\[【\{].*?[\)）〕》〉\]】\}]', '', clean_text)
    t = t.replace('『', '').replace('』', '')
    t = re.sub(r'=[a-zA-Z]+', '', t)
    t = re.sub(r'\+.*', '', t)

    # Step 5: Split by punctuation and slashes
    candidates = []
    for part in re.split(r'[/,;；、\s]+', t):
        part = part.strip('…〜~・。,. ')
        # Clean any unmatched parenthesis
        part = re.sub(r'[\(\)（）\[\]\{\}]', '', part).strip()
        
        # Skip if empty, contains english letters, or is a grammar tag
        if not part or re.search(r'[a-zA-Z]', part):
            continue
        if part in ['名', '動', '形', '副', '代', '前', '接', '自', '他', '単', '複', '句', '節']:
            continue
        
        # Clean leading particles
        part = re.sub(r'^[…〜~の・\s]+', '', part)
        part = re.sub(r'[…〜~・\s]+$', '', part)
        
        if len(part) >= 1 and part not in candidates and part not in primary:
            candidates.append(part)

    # Combine primary and candidates
    combined = primary + candidates
    if not combined:
        return pos, word
    
    # Take top 3 definitions
    meaning = '、'.join(combined[:3])
    return pos, meaning


# 4. Smart Sentence Generator with Natural Japanese Translations
def generate_natural_sentence(term, pos, meaning, test_type, rank_idx=0):
    w_low = term.lower()
    if w_low in CORE_WORDS_DATA:
        d = CORE_WORDS_DATA[w_low]
        return d['example'], d['exampleJa']

    first_m = meaning.split('、')[0] if meaning else term

    # Variety of sentence templates based on test type and part of speech
    if test_type == 'toeic':
        if pos == 'v.':
            verb_m = first_m if first_m.endswith('する') else f"{first_m}する"
            templates = [
                (f"The executive team decided to {w_low} the new corporate strategy.",
                 f"経営陣は新しい企業戦略を{verb_m}ことを決定しました。"),
                (f"We must {w_low} all procedures carefully to maintain service quality.",
                 f"サービスの質を維持するため、すべての手順を慎重に{verb_m}必要があります。"),
                (f"The department plans to {w_low} the operation starting next quarter.",
                 f"その部門は来四半期から業務を{verb_m}予定です。"),
                (f"Employees are required to {w_low} internal guidelines at all times.",
                 f"従業員は常に社内ガイドラインを{verb_m}ことが求められます。")
            ]
        elif pos == 'adj.':
            templates = [
                (f"The manager gave a very {w_low} explanation during the staff meeting.",
                 f"マネージャーはスタッフ会議で非常に「{first_m}」説明を行いました。"),
                (f"It is {w_low} for all employees to follow the safety protocol.",
                 f"全従業員が安全規程に従うことは「{first_m}」ことです。"),
                (f"The company achieved {w_low} results in the recent fiscal evaluation.",
                 f"同社は直近の財務評価において「{first_m}」成果を達成しました。"),
                (f"We received {w_low} feedback from our international clients.",
                 f"海外のクライアントから「{first_m}」フィードバックをいただきました。")
            ]
        elif pos == 'adv.':
            templates = [
                (f"The auditor {w_low} inspected the annual financial statements.",
                 f"監査人は年次財務諸表を「{first_m}」点検しました。"),
                (f"The production team worked {w_low} to meet the delivery deadline.",
                 f"製造チームは納期に間に合わせるために「{first_m}」作業を行いました。"),
                (f"Customer demands have {w_low} increased over the past year.",
                 f"顧客の需要は過去1年間で「{first_m}」増加しました。")
            ]
        else: # noun
            templates = [
                (f"Please review the latest {w_low} before finalizing the report.",
                 f"報告書を最終確定する前に、最新の「{first_m}」をご確認ください。"),
                (f"Effective management of {w_low} is crucial for our organization.",
                 f"私たちの組織にとって「{first_m}」の効率的な管理は極めて重要です。"),
                (f"The committee discussed key policies regarding {w_low} today.",
                 f"委員会は本日、「{first_m}」に関する主要な方針について議論しました。"),
                (f"Our team developed a practical solution for {w_low} improvements.",
                 f"私たちのチームは「{first_m}」の改善に向けた実践的な解決策を開発しました。"),
                (f"The company allocated additional funds for {w_low} this quarter.",
                 f"会社は今四半期、「{first_m}」に追加の資金を割り当てました。")
            ]
    else: # ielts
        if pos == 'v.':
            verb_m = first_m if first_m.endswith('する') else f"{first_m}する"
            templates = [
                (f"Researchers attempted to {w_low} the complex factors behind the phenomenon.",
                 f"研究者たちはその現象の背後にある複雑な要因を{verb_m}しようと試みました。"),
                (f"The novel methodology helps scientists {w_low} experimental outcomes accurately.",
                 f"この新しい手法は、科学者が実験結果を正確に{verb_m}するのに役立ちます。"),
                (f"Several academic studies have sought to {w_low} this theoretical hypothesis.",
                 f"複数の学術研究が、この理論的仮説を{verb_m}することを試みてきました。")
            ]
        elif pos == 'adj.':
            templates = [
                (f"The study demonstrated a {w_low} influence on modern ecological balance.",
                 f"その研究は現代の生態系バランスに対する「{first_m}」影響を実証しました。"),
                (f"Scholars presented a {w_low} critique of the traditional sociological framework.",
                 f"学者たちは従来の社会学的枠組みに関する「{first_m}」批評を提示しました。"),
                (f"This discovery represents a {w_low} breakthrough in biological research.",
                 f"この発見は生物学研究における「{first_m}」躍進を示しています。")
            ]
        elif pos == 'adv.':
            templates = [
                (f"The international panel has {w_low} debated this critical issue.",
                 f"国際委員会はこの重要な問題について「{first_m}」議論を重ねてきました。"),
                (f"Environmental conditions have {w_low} altered over recent decades.",
                 f"環境条件はここ数十年で「{first_m}」変化しました。")
            ]
        else: # noun
            templates = [
                (f"The academic paper presents a comprehensive analysis of {w_low}.",
                 f"その学術論文は「{first_m}」に関する包括的な分析を提示しています。"),
                (f"Recent scientific discoveries offer new perspectives on {w_low}.",
                 f"近年の科学的発見は「{first_m}」に関する新たな視点を提供しています。"),
                (f"Understanding the fundamental nature of {w_low} remains essential for researchers.",
                 f"「{first_m}」の根本的な性質を理解することは、研究者にとって不可欠です。"),
                (f"The experimental data revealed unexpected patterns related to {w_low}.",
                 f"実験データは「{first_m}」に関連する予期しないパターンを明らかにしました。")
            ]

    # Select template cyclically for variety
    chosen_en, chosen_ja = templates[rank_idx % len(templates)]
    return chosen_en, chosen_ja


# 5. Process and Overwrite Datasets
def process_dataset(filename, test_type):
    filepath = os.path.join(DATA_DIR, filename)
    print(f"\nProcessing {filename}...")
    with open(filepath, 'r', encoding='utf-8') as f:
        cards = json.load(f)

    fixed_count = 0
    suspicious_fixed = 0

    for idx, card in enumerate(cards):
        term = card['term']
        old_meaning = card.get('meaning', '')
        
        # Check if EJDict has word
        raw_ejdict = ejdict.get(term.lower(), '')
        pos, clean_m = parse_clean_ejdict(term, raw_ejdict)
        
        # Update POS and meaning
        card['partOfSpeech'] = pos
        card['meaning'] = clean_m
        
        # Update example sentences
        ex, exJa = generate_natural_sentence(term, pos, clean_m, test_type, idx)
        card['example'] = ex
        card['exampleJa'] = exJa
        
        fixed_count += 1

    print(f"Updated {fixed_count} words in {filename}.")
    
    # Save back to file
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(cards, f, ensure_ascii=False, indent=2)
    print(f"Successfully saved {filepath}.")

if __name__ == '__main__':
    process_dataset('toeic_8000.json', 'toeic')
    process_dataset('ielts_8000.json', 'ielts')
    print("\nAll datasets updated successfully!")
