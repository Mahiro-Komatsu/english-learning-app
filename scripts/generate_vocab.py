import urllib.request
import json
import re
import string
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUTPUT_DIR = os.path.join(BASE_DIR, 'js', 'data')

def download_url(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as resp:
        return resp.read().decode('utf-8', errors='ignore')

def get_ejdict():
    print("Downloading EJDict...")
    ejdict = {}
    letters = list(string.ascii_lowercase)
    for letter in letters:
        url = f'https://raw.githubusercontent.com/kujirahand/EJDict/master/src/{letter}.txt'
        try:
            content = download_url(url)
            for line in content.splitlines():
                if '\t' in line:
                    parts = line.split('\t', 1)
                    w = parts[0].strip().lower()
                    m = parts[1].strip()
                    for sub_w in w.split(','):
                        sub_w = sub_w.strip()
                        if sub_w and sub_w not in ejdict:
                            ejdict[sub_w] = m
        except Exception as e:
            print(f"Error on letter {letter}: {e}")
    print(f"Loaded {len(ejdict)} EJDict entries.")
    return ejdict

def clean_meaning(raw_meaning):
    pos = 'n.'
    if any(k in raw_meaning for k in ['【動】', '[動]', '…する', '（動）', '〈動〉', 'する']):
        pos = 'v.'
    elif any(k in raw_meaning for k in ['【形】', '[形]', '…な', '（形）', '〈形〉', '的な']):
        pos = 'adj.'
    elif any(k in raw_meaning for k in ['【副】', '[副]', '（副）', '〈副〉', '的に']):
        pos = 'adv.'
    elif any(k in raw_meaning for k in ['【前】', '[前]', '（前）']):
        pos = 'prep.'
    elif any(k in raw_meaning for k in ['【接】', '[接]', '（接）']):
        pos = 'conj.'

    # Check for primary highlighted terms in double brackets 『...』
    bracketed = re.findall(r'『(.*?)』', raw_meaning)
    bracketed = [b.strip() for b in bracketed if b.strip() and not b.startswith('cf') and not b.startswith('⇒')]

    # Strip bracket contents like (something), <something>, etc.
    m = re.sub(r'[\(（〔《〈\[【].*?[\)）〕》〉\]】]', '', raw_meaning)
    m = m.replace('『', '').replace('』', '')
    m = re.sub(r'=[a-zA-Z]+', '', m)
    m = re.sub(r'\+.*', '', m)
    m = re.sub(r'《.+?》', '', m)

    # Split into definitions
    parts = [p.strip() for p in re.split(r'[/,;；、\s/]+', m) if p.strip()]
    valid = []
    for p in parts:
        p = re.sub(r'^[…\s]+', '', p)
        p = re.sub(r'[…\s]+$', '', p)
        if len(p) >= 2 and not p.startswith('⇒') and not p.startswith('cf') and not p.startswith('sec.'):
            if p not in valid:
                valid.append(p)
    
    if bracketed:
        combined = []
        for b in bracketed:
            if b not in combined:
                combined.append(b)
        for v in valid:
            if v not in combined:
                combined.append(v)
        return pos, '、'.join(combined[:3])

    if valid:
        return pos, '、'.join(valid[:3])
    
    # Fallback to trimmed raw meaning
    cleaned_fallback = re.sub(r'[\[【〔《〈\(（『].*?[\]】〕》〉\)）』]', '', raw_meaning).strip()
    return pos, cleaned_fallback[:25] or raw_meaning[:25]

def generate_sentence(term, pos, meaning, test_type):
    first_m = meaning.split('、')[0] if meaning else term
    if test_type == 'toeic':
        if pos == 'v.':
            return (f"The company decided to {term.lower()} the new operational procedure.",
                    f"会社は新しい業務手順を{first_m}することを決定しました。")
        elif pos == 'adj.':
            return (f"The team delivered a very {term.lower()} proposal to the client.",
                    f"チームはクライアントに対して非常に{first_m}提案を提出しました。")
        elif pos == 'adv.':
            return (f"The management {term.lower()} reviewed the quarterly financial forecast.",
                    f"経営陣は四半期財務予測を{first_m}精査しました。")
        else:
            return (f"Please review the detailed {term.lower()} outlined in the document.",
                    f"書類に記載された詳細な{first_m}をご確認ください。")
    else: # ielts
        if pos == 'v.':
            return (f"Researchers attempted to {term.lower()} the underlying causes of the phenomenon.",
                    f"研究者たちはその現象の根本的な原因を{first_m}しようと試みました。")
        elif pos == 'adj.':
            return (f"The study demonstrated a {term.lower()} impact on global climate patterns.",
                    f"その研究は地球規模の気候パターンに対する{first_m}影響を実証しました。")
        elif pos == 'adv.':
            return (f"The academic community has {term.lower()} debated this philosophical question.",
                    f"学術界はこの哲学的問いについて{first_m}議論を重ねてきました。")
        else:
            return (f"The analysis presents a comprehensive study of the {term.lower()}.",
                    f"その分析は、この{first_m}に関する包括的な研究を提示しています。")

def main():
    ejdict = get_ejdict()

    # Download 50k frequency list with occurrence ranks
    print("Downloading FrequencyWords list...")
    freq_url = 'https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2018/en/en_50k.txt'
    freq_data = download_url(freq_url)
    freq_words = []
    freq_rank_map = {}
    for line in freq_data.splitlines():
        parts = line.strip().split(' ')
        w = parts[0].strip().lower()
        if re.match(r'^[a-z]{3,}$', w):
            if w not in freq_rank_map:
                freq_rank_map[w] = len(freq_words) + 1
                freq_words.append(w)
    print(f"Loaded {len(freq_words)} frequency words.")

    # Download AWL
    print("Downloading AWL...")
    awl_words = []
    try:
        awl_json = json.loads(download_url('https://raw.githubusercontent.com/lpmi-13/machine_readable_wordlists/master/Academic/AWL/AWL.json'))
        for sublist, headwords in awl_json.items():
            for hw, family in headwords.items():
                awl_words.append(hw.lower())
                for member in family:
                    w = member.lower()
                    if w not in awl_words:
                        awl_words.append(w)
    except Exception as e:
        print("AWL load error:", e)
    print(f"Loaded {len(awl_words)} AWL words.")

    # Download Business lists BWL1 & BWL2
    print("Downloading Business Word Lists...")
    biz_words = []
    try:
        bwl1 = json.loads(download_url('https://raw.githubusercontent.com/lpmi-13/machine_readable_wordlists/master/Discipline-Specific/BWL1/BWL1.json'))
        if 'words' in bwl1:
            sorted_items = sorted(bwl1['words'].items(), key=lambda x: x[1] if isinstance(x[1], (int, float)) else 99999)
            biz_words.extend([k.lower() for k, v in sorted_items])
        bwl2 = json.loads(download_url('https://raw.githubusercontent.com/lpmi-13/machine_readable_wordlists/master/Discipline-Specific/BWL2/BWL2.json'))
        for k in bwl2.keys():
            k_low = k.lower()
            if k_low not in biz_words:
                biz_words.append(k_low)
    except Exception as e:
        print("BWL load error:", e)
    print(f"Loaded {len(biz_words)} Business words.")

    # High-priority TOEIC core keywords (Essential for scores 500-900)
    top_toeic_essentials = [
        "contract", "agreement", "budget", "invoice", "client", "customer", "employee", "employer",
        "manager", "executive", "director", "department", "schedule", "deadline", "conference",
        "meeting", "presentation", "negotiation", "proposal", "revenue", "profit", "quarter", "annual",
        "estimate", "warranty", "purchase", "order", "delivery", "shipping", "warehouse", "inventory",
        "merchandise", "retail", "wholesale", "discount", "refund", "receipt", "supplier", "vendor",
        "distributor", "headquarters", "branch", "facility", "equipment", "maintenance", "renovation",
        "inspection", "regulation", "compliance", "policy", "procedure", "guideline", "requirement",
        "applicant", "candidate", "interview", "resume", "qualification", "experience", "recruitment",
        "hiring", "personnel", "staff", "payroll", "salary", "wage", "compensation", "benefit",
        "pension", "bonus", "promotion", "transfer", "retirement", "resignation", "training", "seminar",
        "workshop", "survey", "questionnaire", "feedback", "rating", "satisfaction", "subscription",
        "membership", "registration", "confirmation", "cancellation", "reservation", "flight", "itinerary",
        "hotel", "accommodation", "reception", "banquet", "venue", "caterer", "beverage", "hospitality",
        "colleague", "coworker", "supervisor", "subordinate", "representative", "spokesperson",
        "shareholder", "investor", "dividend", "portfolio", "transaction", "acquisition", "merger",
        "subsidiary", "competitor", "market", "demand", "supply", "inflation", "recession", "stagnant",
        "fluctuation", "benchmark", "indicator", "statistic", "audit", "accountant", "ledger", "asset",
        "liability", "deficit", "surplus", "expenditure", "reimbursement", "allowance", "commission",
        "implement", "streamline", "allocate", "delegate", "restructure", "consolidate", "supervise",
        "coordinate", "negotiate", "collaborate", "facilitate", "authorize", "postpone", "reschedule",
        "terminate", "expire", "renew", "expedite", "dispatch", "inspect", "appraise", "evaluate",
        "assess", "exceed", "fluctuate", "stabilize", "deteriorate", "prosper", "thrive", "subsidize",
        "reimburse", "compensate", "waive", "withhold", "deduct", "accumulate", "generate", "maximize",
        "minimize", "prioritize", "feasible", "mandatory", "compulsory", "confidential", "lucrative",
        "prospective", "provisional", "tentative", "preliminary", "delinquent", "outstanding",
        "overdue", "punctual", "efficient", "proficient", "reliable", "competent", "innovative",
        "comprehensive", "extensive", "substantial", "considerable", "negligible", "marginal",
        "drastic", "gradual", "consistent", "simultaneous", "subsequent", "unanimous", "unprecedented"
    ]

    # High-priority IELTS core keywords (Essential for Bands 5.5-9.0)
    top_ielts_essentials = [
        "hypothesis", "empirical", "methodology", "parameter", "phenomenon", "criterion", "spectrum",
        "dichotomy", "paradigm", "correlation", "causation", "disparity", "proportion", "trajectory",
        "variable", "coefficient", "anomaly", "deviation", "equilibrium", "manifestation", "implication",
        "synthesis", "integration", "extrapolation", "inference", "framework", "perspective", "dimension",
        "controversy", "consensus", "plausibility", "validity", "feasibility", "cohesion", "coherence",
        "ubiquitous", "pervasive", "intrinsic", "extrinsic", "transient", "ephemeral", "permanent",
        "tangible", "abstract", "subtle", "profound", "comprehensive", "exhaustive", "rudimentary",
        "sophisticated", "arbitrary", "spontaneous", "pragmatic", "dogmatic", "empiric", "analogous",
        "homogeneous", "heterogeneous", "symmetric", "congruent", "compatible", "contradictory",
        "paradoxical", "anomalous", "unprecedented", "detrimental", "beneficial", "salient", "viable",
        "volatile", "vulnerable", "resilient", "imperative", "mandatory", "inevitable", "ineluctable",
        "analyze", "synthesize", "evaluate", "critique", "elucidate", "delineate", "substantiate",
        "corroborate", "refute", "disprove", "demonstrate", "illustrate", "exemplify", "manifest",
        "extrapolate", "deduce", "infer", "postulate", "conjecture", "articulate", "disseminate",
        "accelerate", "decelerate", "exacerbate", "mitigate", "alleviate", "ameliorate", "deteriorate",
        "proliferate", "dwindle", "fluctuate", "oscillate", "converge", "diverge", "juxtapose",
        "integrate", "segregate", "assimilate", "perpetuate", "obviate", "transcend", "facilitate",
        "hinder", "impede", "inhibit", "foster", "cultivate", "nurture", "undermine", "compromise",
        "biodiversity", "ecosystem", "deforestation", "emission", "pollutant", "conservation",
        "sustainability", "renewable", "depletion", "urbanization", "infrastructure", "demographic",
        "longevity", "epidemic", "pandemic", "pathogen", "cognitive", "neurological", "psychological",
        "sociological", "anthropological", "linguistic", "etymology", "chronological", "archaeological"
    ]

    def build_ranked_list(target_type, top_essentials, domain_words):
        ranked = []
        seen = set()

        def add_word(w):
            w = w.lower()
            if w in seen or len(w) < 3:
                return
            if w in ejdict:
                pos, meaning = clean_meaning(ejdict[w])
                if not meaning or len(meaning) < 2:
                    return
                seen.add(w)
                ex, exJa = generate_sentence(w, pos, meaning, target_type)
                
                # Determine stage and level
                rank_num = len(ranked) + 1
                stage_num = ((rank_num - 1) // 1000) + 1
                if target_type == 'toeic':
                    score_map = {1: '500-600点', 2: '600-700点', 3: '700-750点', 4: '750-800点',
                                 5: '800-850点', 6: '850-900点', 7: '900-950点', 8: '950-990点満点'}
                    level_label = f"Stage {stage_num} (目標 {score_map.get(stage_num, 'ハイスコア')})"
                else:
                    band_map = {1: 'Band 5.0-5.5', 2: 'Band 5.5-6.0', 3: 'Band 6.0-6.5', 4: 'Band 6.5-7.0',
                                5: 'Band 7.0-7.5', 6: 'Band 7.5-8.0', 7: 'Band 8.0-8.5', 8: 'Band 8.5-9.0'}
                    level_label = f"Stage {stage_num} (目標 {band_map.get(stage_num, 'Band 8.5+')})"

                ranked.append({
                    'id': f'{target_type}_{rank_num}',
                    'term': w.capitalize(),
                    'phonetic': '',
                    'partOfSpeech': pos,
                    'meaning': meaning,
                    'example': ex,
                    'exampleJa': exJa,
                    'rank': rank_num,
                    'stage': stage_num,
                    'levelLabel': level_label
                })

        # 1. Add top domain essentials first (Rank 1 .. 200)
        for w in top_essentials:
            add_word(w)

        # 2. Add domain specific words sorted by frequency
        sorted_domain = sorted(domain_words, key=lambda w: freq_rank_map.get(w, 999999))
        for w in sorted_domain:
            if len(ranked) >= 8000:
                break
            add_word(w)

        # 3. Fill up to 8000 using general frequency words
        for w in freq_words:
            if len(ranked) >= 8000:
                break
            add_word(w)

        print(f"Generated {len(ranked)} ranked words for {target_type.upper()}.")
        return ranked

    toeic_list = build_ranked_list('toeic', top_toeic_essentials, biz_words)
    ielts_list = build_ranked_list('ielts', top_ielts_essentials, awl_words)

    # Save to JSON files
    toeic_path = os.path.join(OUTPUT_DIR, 'toeic_8000.json')
    ielts_path = os.path.join(OUTPUT_DIR, 'ielts_8000.json')

    with open(toeic_path, 'w', encoding='utf-8') as f:
        json.dump(toeic_list, f, ensure_ascii=False)
    print(f"Saved TOEIC to {toeic_path} ({os.path.getsize(toeic_path)/1024/1024:.2f} MB)")

    with open(ielts_path, 'w', encoding='utf-8') as f:
        json.dump(ielts_list, f, ensure_ascii=False)
    print(f"Saved IELTS to {ielts_path} ({os.path.getsize(ielts_path)/1024/1024:.2f} MB)")

if __name__ == '__main__':
    main()
