# -*- coding: utf-8 -*-
"""
add_core_images.py
Adds core images (コアイメージ) and etymological breakdowns (語源・接頭辞・接尾辞・語根分解)
to all flashcard datasets: toeic_8000.json, ielts_8000.json, and default decks.
"""

import json
import re
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, 'js', 'data')

# Extensive Prefix Database
PREFIXES = {
    'trans': ('超えて、向こうへ', '境界や距離を越える'),
    'inter': ('〜の間で、相互に', '二者以上のあいだ'),
    'super': ('超えて、上に', '基準を上回る'),
    'anti': ('反対、対抗', '正面から立ち向かう'),
    'under': ('下、不十分', '基準に達しない'),
    'over': ('過度に、超えて', '限度を超える'),
    'auto': ('自ら、自己', '自動・自発的'),
    'tele': ('遠く', '空間的な隔たり'),
    'micro': ('微小な', '極めて小さい'),
    'multi': ('多数の', '複数が集まる'),
    'fore': ('前もって、前方の', '未来や前方'),
    'post': ('後に、以後の', '時間的な遅れ'),
    'sub': ('下に、副次的に', '土台・下位の位置'),
    'suc': ('下に、次いで', '下から続く'),
    'sug': ('下に', '下から支える'),
    'sup': ('下に、支えて', '下から上へ'),
    'sus': ('下から上に', '下支えする'),
    'sur': ('上に、超えて', '上に覆いかぶさる'),
    'pre': ('前もって、先に', '事前に準備する'),
    'pro': ('前へ、先へ、公に', '前に向かって進む'),
    'con': ('共に、完全に', '一つにまとまる・集まる'),
    'com': ('共に、完全に', '力を合わせる・強調'),
    'col': ('共に', '一緒に連なる'),
    'cor': ('共に、強調', '互いに強く結びつく'),
    'co': ('共に、共同', '一緒に並ぶ'),
    'dis': ('離れて、分離、否定', 'パッと分かれる・打ち消す'),
    'dif': ('離れて', '散り散りになる'),
    'di': ('二つに、離れて', '分断される'),
    'de': ('下へ、離れて、完全に', '下に落とす・徹底的に'),
    'ex': ('外へ、外に', '内側から外へと飛び出す'),
    're': ('再び、後ろへ、元の位置に', '繰り返す・後退する'),
    'in': ('中に、向かって、あるいは否定', '内側に入り込む / 〜でない'),
    'im': ('中に、あるいは否定', '内側へ / 打ち消し'),
    'il': ('否定、中に', '〜でない'),
    'ir': ('否定', '〜でない'),
    'ad': ('〜の方へ、付加', '目標に向かって近づく'),
    'ac': ('〜の方へ', '方向と接近'),
    'ap': ('〜の方へ', '対象に向かう'),
    'at': ('〜の方へ', '目標を指す'),
    'al': ('〜の方へ', '方向'),
    'as': ('〜の方へ', '接近'),
    'un': ('否定、反対、元に戻す', '打ち消し・逆動作'),
    'mis': ('誤って、悪く', '的を外す・間違い'),
    'non': ('非〜、不〜', '単なる事実としての否定'),
    'en': ('中に入れる、〜の状態にする', '包み込む・働きかける'),
    'em': ('中に入れる', '包み込む')
}

# Extensive Root Database
ROOTS = {
    'vent': ('来る、見出す (venire)', '到来したもの、新しく見つかったもの'),
    'spect': ('見る、注視する (spectare)', '目を凝らしてよく見つめる'),
    'spic': ('見る', '視界に捉える'),
    'dict': ('言う、宣言する (dicere)', '言葉でピシッと指し示す'),
    'duct': ('導く、率いる (ducere)', 'ある方向へ手を引いて導く'),
    'duc': ('導く', '引き出す'),
    'tract': ('引く、引き寄せる (trahere)', 'グッと手元に引っ張る'),
    'port': ('運ぶ、港 (portare)', '場所から場所へ持ち運ぶ'),
    'script': ('書く、文字 (scribere)', '記録として書き残す'),
    'scrib': ('書く', '文字を記す'),
    'struct': ('積み上げる、建てる (struere)', '材料を重ねて形にする'),
    'form': ('形作る、秩序 (formare)', '一定の形に整える'),
    'ject': ('投げる (jacere)', '勢いよく前や外へ放り投げる'),
    'mitt': ('送る、届ける (mittere)', '手元から相手へ送り出す'),
    'miss': ('送る', '使者を遣わす'),
    'pos': ('置く、配置する (ponere)', '確固とした場所に据える'),
    'posit': ('置く、配置する', '特定の場所にしっかりと据える'),
    'cept': ('つかむ、受け取る (capere)', '差し出されたものを手中に収める'),
    'ceiv': ('つかむ、受ける', '自分のものとして受け止める'),
    'cap': ('頭、つかむ (caput/capere)', '重要ポイントをギュッと握る'),
    'tend': ('伸ばす、向かう (tendere)', 'ピンと張ってある方向へ伸ばす'),
    'tens': ('伸ばす、緊張', '張り詰めて伸びた状態'),
    'tent': ('伸ばす', 'ピンと張る'),
    'press': ('押す、圧力をかける (premere)', '上や横からグッと押し付ける'),
    'fer': ('運ぶ、生み出す (ferre)', '向こうへ運び届ける・結果をもたらす'),
    'grad': ('歩む、段階 (gradi)', '一段ずつ階段を踏みしめる'),
    'gress': ('進む、歩く (gradi)', '前に向かって歩みを進める'),
    'fac': ('作る、行う (facere)', '形あるものを実際に成し遂げる'),
    'fic': ('作る、成す', '成果を作り出す'),
    'fect': ('作る、作用する', '手を加えて影響を及ぼす'),
    'vers': ('回る、向く (vertere)', '方向をクルリと変える'),
    'vert': ('向く、転じる', '向きを変える'),
    'gen': ('生む、種族 (genus)', '新しい生命や物資を生み出す'),
    'vis': ('見る (videre)', 'はっきりと目で捉える'),
    'vid': ('見る', '目で確認する'),
    'cred': ('信じる (credere)', '心を委ねて信用する'),
    'sequ': ('続く、追う (sequi)', '後ろから順番に連なる'),
    'secut': ('続く', '整然と後に続く'),
    'cur': ('走る、流れる (currere)', '水や時間がサラサラと流れる'),
    'cours': ('走る、進路', '決まった道筋を流れる'),
    'part': ('分ける、部分 (pars)', '全体からひとかたまりを切り分ける'),
    'port': ('部分 (portio)', '分け与えられた取り分'),
    'val': ('力がある、価値 (valere)', '役に立つ強いエネルギーを持つ'),
    'vail': ('力がある', '効力を持つ'),
    'sta': ('立つ、留まる (stare)', 'どっしりと自立して動かない'),
    'stat': ('立つ、状態', 'その場にしっかりと立つ'),
    'sist': ('立つ、踏みとどまる', 'その位置に踏みとどまる'),
    'fin': ('終わる、境界 (finis)', '区切りや枠組みを設ける'),
    'corp': ('体、組織 (corpus)', '手足が集まってできた一つの肉体'),
    'aud': ('聞く (audire)', '耳を澄ませて聞き取る'),
    'voc': ('呼ぶ、声 (vocare)', '大きな声で外に呼びかける'),
    'vok': ('呼ぶ', '合図して呼び出す'),
    'sens': ('感じる、意志 (sentire)', '心や五感でしっかりと受け止める'),
    'sent': ('感じる、思う', '心に強く思う'),
    'solv': ('解く、緩める (solvere)', 'もつれた糸をサラサラと解く'),
    'solu': ('解く', '問題を解きほぐす'),
    'rupt': ('壊れる、破れる (rumpere)', '強い力で急に破裂する'),
    'flu': ('流れる (fluere)', '滞りなくサラサラと流れる'),
    'flux': ('流れる', '水のように動く'),
    'term': ('限界、境目 (terminus)', '終わりの境界線を引く'),
    'ordin': ('順番、秩序 (ordo)', '並び順を整える'),
    'pel': ('追いやる、押す (pellere)', '力を加えて前へ押し出す'),
    'puls': ('押す、叩く', '心臓のようにトントンと押し出す'),
    'pend': ('吊るす、測る (pendere)', '天秤に吊るして重さを量る'),
    'pens': ('吊るす、支払う', '重さを測ってお金を支払う'),
    'plic': ('重ねる、折る (plicare)', '紙を何重にも折りたたむ'),
    'ply': ('重ねる、応じる', '折り重ねる'),
    'ple': ('満たす (plere)', '隙間なく中をいっぱいに満たす'),
    'plet': ('満たす', '満杯にする'),
    'mem': ('記憶、心 (memor)', '過去の出来事を心に留める'),
    'memor': ('記憶', '心に留め置く'),
    'leg': ('集める、読む、法律 (legere/lex)', '秩序立てて集める・選ぶ'),
    'lect': ('選ぶ、集める', '丁寧に選別して拾い上げる'),
    'ped': ('足 (pes)', '大地を歩く足'),
    'pod': ('足', '体を支える足'),
    'path': ('感じる、病気 (pathos)', '胸を打つ感情・共鳴'),
    'log': ('言葉、論理 (logos)', '理路整然とした筋道'),
    'sci': ('知る (scire)', '真理をはっきりと見極める')
}

# Extensive Suffix Database
SUFFIXES = {
    'tion': ('〜すること、状態', '動作や状態を名詞化'),
    'sion': ('〜すること、結果', '動作の結果を名詞化'),
    'ment': ('〜すること、結果、手段', '行為の結果を名詞化'),
    'ance': ('〜の性質、状態', '状態を名詞化'),
    'ence': ('〜の性質、状態', '性質を名詞化'),
    'ity': ('〜の度合い、性質', '抽象的な状態を名詞化'),
    'ness': ('〜であること', '性質や度合いを名詞化'),
    'ship': ('身分、関係、技術', '状態や関係性を名詞化'),
    'hood': ('状態、境遇', 'まとまりを名詞化'),
    'able': ('〜できる、〜しやすい', '可能性を表す形容詞化'),
    'ible': ('〜できる', '受け身の可能性を表す形容詞化'),
    'ive': ('〜の傾向がある、〜の性質の', '積極的な性質の形容詞化'),
    'ous': ('〜に満ちた、〜の特徴を持つ', '豊かな性質の形容詞化'),
    'ious': ('〜に満ちた', '性質の形容詞化'),
    'ful': ('〜に満ちた', '満杯の状態を表す形容詞化'),
    'less': ('〜のない、〜を欠いた', '欠如を表す形容詞化'),
    'ic': ('〜の、〜的な', '学問や性質を表す形容詞化'),
    'ical': ('〜の、〜に関する', '学術的・体系的な形容詞化'),
    'al': ('〜に関する、〜の性質の', '属性を表す形容詞化'),
    'ial': ('〜に関する', '関係を表す形容詞化'),
    'ary': ('〜に関するもの、場所', '関連する対象や場所'),
    'ory': ('〜に関するもの、場所', '行為の場所や道具'),
    'ize': ('〜化する、〜にする', '動作・変化を表す動詞化'),
    'ise': ('〜化する', '動詞化'),
    'ate': ('〜にする、〜の状態にする', '結果をもたらす動詞化/形容詞化'),
    'ify': ('〜にする、〜化する', '性質を変える動詞化'),
    'ly': ('〜に、〜らしく', '様態を表す副詞化'),
    'er': ('〜する人、もの', '主体となる人や道具'),
    'or': ('〜する人、もの', '専門的な行為者や装置'),
    'ist': ('〜の専門家、主義者', '専門的に携わる人'),
    'ee': ('〜される人', '行為を受ける対象者')
}

# Premium Curated Core Images for Core Words
CURATED_CORE_IMAGES = {
    "inventory": {
        "etymology": "接頭辞 in- (中に) + 語根 vent (来る・見出す) + 接尾辞 -ory (〜のもの)",
        "coreImage": "「倉庫や店舗の中に新しく入ってきた物品を一箇所に集めて見出す（点検する）」というイメージから、保管されている『在庫品・棚卸し・目録』を表します。"
    },
    "agreement": {
        "etymology": "接頭辞 a- (〜の方へ) + gree (好意・喜び) + 接尾辞 -ment (名詞化)",
        "coreImage": "「相手の提案に対して好意的な方向へ心を寄せて一致する」というイメージから、双方が納得して結ぶ『合意・協定・契約』を表します。"
    },
    "budget": {
        "etymology": "bougette (古フランス語：革の小袋・財布)",
        "coreImage": "「あらかじめ用途ごとに小袋に分けて確保しておいたお金」というイメージから、計画的に使う『予算・予算案』を意味します。"
    },
    "contract": {
        "etymology": "接頭辞 con- (共に) + 語根 tract (引く・引き寄せる)",
        "coreImage": "「双方の合意を同じ場所へギュッと引き寄せて一つにまとめる」というイメージから、法的拘束力のある『契約・契約書』を表します。"
    },
    "invoice": {
        "etymology": "envoi (古フランス語：送り状、送られたもの) + -s",
        "coreImage": "「商品を出荷する際に、相手へ送り届けて代金支払いを求める書類」というイメージから、『請求書・送り状・納品書』を表します。"
    },
    "presentation": {
        "etymology": "接頭辞 pre- (前に) + esse/sent (存在・差し出す) + 接尾辞 -tion (名詞化)",
        "coreImage": "「大切な提案や成果を、人々の目の前にスッと差し出して提示する」というイメージから、『プレゼンテーション・発表・提示』を表します。"
    },
    "profit": {
        "etymology": "接頭辞 pro- (前へ) + 語根 fic/fect (作る・進める)",
        "coreImage": "「前に進む（事業活動を行う）ことで手元にプラスとして作られるもの」というイメージから、『利益・収益・もうけ』を表します。"
    },
    "quarter": {
        "etymology": "quartus (ラテン語：4番目、4分の1)",
        "coreImage": "「全体を4等分にスパッと切り分けたひとつの区画」というイメージから、1年の『四半期（3ヶ月）』や『15分（1時間の1/4）』を表します。"
    },
    "delivery": {
        "etymology": "接頭辞 de- (完全に) + liber (解放する・放す) + 接尾辞 -y (名詞化)",
        "coreImage": "「手元にあった荷物の拘束を解いて、目的地（受取人）へと解き放つ」というイメージから、『配達・配送・引き渡し』を意味します。"
    },
    "retail": {
        "etymology": "接頭辞 re- (再び) + tail (切る = tailor/detail)",
        "coreImage": "「大きな塊で仕入れた商品を、消費者が買いやすいように細かく小分けに切り分けて売る」というイメージから、『小売り』を表します。"
    },
    "receipt": {
        "etymology": "接頭辞 re- (手元に) + 語根 ceipt/cept (つかむ・受け取る)",
        "coreImage": "「金銭や商品を手元にしっかり受け取ったという受領の証明」というイメージから、『領収書・レシート・受取証』を表します。"
    },
    "conference": {
        "etymology": "接頭辞 con- (共に) + 語根 fer (運ぶ・持ち寄る) + 接尾辞 -ence (名詞化)",
        "coreImage": "「大勢の人が意見や知見を同じ場所に持ち寄って話し合う」というイメージから、『会議・協議会・総会』を表します。"
    },
    "client": {
        "etymology": "clinare (ラテン語：身を寄せる、傾く = lean)",
        "coreImage": "「専門家の保護や支援を求めて信頼を寄せ、依頼をする人」というイメージから、ビジネスの『顧客・クライアント・依頼人』を表します。"
    },
    "customer": {
        "etymology": "custom (習慣、慣習) + -er (人)",
        "coreImage": "「店舗に何度も通うことが習慣になっている馴染みの人」というイメージから、商品やサービスを買う『客・顧客・消費者』を表します。"
    },
    "employee": {
        "etymology": "employ (雇用する) + 接尾辞 -ee (〜される人)",
        "coreImage": "「雇用主から業務を託されて雇用関係の中に入った人」というイメージから、『従業員・社員』を表します。"
    },
    "employer": {
        "etymology": "employ (雇用する) + 接尾辞 -er (〜する人)",
        "coreImage": "「人権や給与を保障し、仕事を託して人を雇い入れる主体」というイメージから、『雇用主・雇い主・経営者』を表します。"
    },
    "manager": {
        "etymology": "manus (ラテン語：手) + -age (扱う) + -er (人)",
        "coreImage": "「手綱を引いて馬をコントロールするように、業務やチームを手腕でコントロールする人」というイメージから、『管理者・マネージャー・部長』を表します。"
    },
    "executive": {
        "etymology": "接頭辞 ex- (完全に) + 語根 secut (従う・最後まで成し遂げる) + 接尾辞 -ive (人)",
        "coreImage": "「決定した方針を最後まで徹底して実行に移す重責を持つ人」というイメージから、『幹部・重役・役員』を表します。"
    },
    "schedule": {
        "etymology": "schedula (ラテン語：紙片、メモの小冊子)",
        "coreImage": "「やるべき予定を紙片に一つひとつ書き留めて並べた一覧」というイメージから、『予定表・日程・スケジュール』を表します。"
    },
    "deadline": {
        "etymology": "dead (死んだ・無効の) + line (線・境界)",
        "coreImage": "「これ以上越えると無効（命取り）になる限界の境界線」というイメージから、仕事や提出の『締め切り・期日』を表します。"
    },
    "negotiation": {
        "etymology": "neg- (否定) + otium (余暇・のんびり) + -tion (名詞化)",
        "coreImage": "「のんびり休んでいる暇はなく、双方が利益のために真剣に駆け引きする」というイメージから、『交渉・話し合い』を表します。"
    },
    "proposal": {
        "etymology": "接頭辞 pro- (前へ) + 語根 pos (置く) + 接尾辞 -al (名詞化)",
        "coreImage": "「相手の目の前にアイデアや解決策を置いて提示する」というイメージから、『提案・企画書・提案書』を表します。"
    },
    "revenue": {
        "etymology": "接頭辞 re- (戻って) + 語根 ven (来る = venire)",
        "coreImage": "「事業活動を外へ広げた結果、会社の手元に戻ってきたお金」というイメージから、『歳入・売上高・総収益』を表します。"
    },
    "estimate": {
        "etymology": "aestimare (ラテン語：金銭的価値を評価する)",
        "coreImage": "「あらかじめ価値や費用を頭の中で計算して見当をつける」というイメージから、『見積もり・概算・見積もる』を表します。"
    },
    "warranty": {
        "etymology": "warrant (保証する、正当な理由を与える) + -y",
        "coreImage": "「製品が故障した場合でも、修理や交換を約束して購入者を守る盾」というイメージから、『保証・保証書・保証期間』を表します。"
    },
    "warehouse": {
        "etymology": "ware (商品、物品) + house (家・建物)",
        "coreImage": "「販売や配送を待つ大量の品物（ウェア）が安全に眠っている家」というイメージから、『倉庫・商品保管所』を表します。"
    },
    "merchandise": {
        "etymology": "merc (商取引・商品 = market/merchant) + -ise",
        "coreImage": "「市場でお金と引き換えに取引される価値ある品々」というイメージから、『商品・製品・グッズ』を表します。"
    },
    "refund": {
        "etymology": "接頭辞 re- (後ろへ、戻して) + 語根 fund (注ぐ = pour)",
        "coreImage": "「支払われたお金を元の場所へジャブジャブと注ぎ戻す」というイメージから、『返金・払い戻し』を表します。"
    },
    "supplier": {
        "etymology": "接頭辞 sub- (下から) + 語根 ple (満たす) + 接尾辞 -er (人)",
        "coreImage": "「不足しているものを下から次々と補って満たしてくれる存在」というイメージから、『供給業者・サプライヤー・納入業者』を表します。"
    },
    "vendor": {
        "etymology": "vendere (ラテン語：売る) + 接尾辞 -or (人)",
        "coreImage": "「品物を並べて買い手に直接売り渡す人」というイメージから、『販売業者・ベンダー・売り手』を表します。"
    },
    "headquarters": {
        "etymology": "head (頭・司令塔) + quarters (宿舎・拠点)",
        "coreImage": "「組織の頭脳となる人物たちが集まり、全軍に指示を出す本拠地」というイメージから、『本社・本部・司令部』を表します。"
    },
    "compliance": {
        "etymology": "接頭辞 com- (完全に) + 語根 ple (満たす) + 接尾辞 -ance (名詞化)",
        "coreImage": "「法律や規則が要求する基準を漏れなく完全に満たし切る」というイメージから、『法令遵守・コンプライアンス』を表します。"
    },
    "implement": {
        "etymology": "接頭辞 in- (中に) + 語根 ple (満たす) + 接尾辞 -ment (手段/動詞)",
        "coreImage": "「計画の枠組みの中に中身を流し込んで満たし、具現化する」というイメージから、『実行する・導入する・実施する』を表します。"
    },
    "streamline": {
        "etymology": "stream (水の流れ) + line (筋道・線)",
        "coreImage": "「水や風の抵抗を受けない流線型のように、無駄な手続きを削ぎ落としてスルスルと流す」というイメージから、『合理化する・簡素化する』を表します。"
    },
    "hypothesis": {
        "etymology": "接頭辞 hypo- (下に) + thesis (置く・定立)",
        "coreImage": "「論理や実験の基礎（土台の下）にひとまず仮置きしておく前提」というイメージから、学術研究における『仮説』を表します。"
    },
    "empirical": {
        "etymology": "en- (中に) + peira (試み・経験) + -ical (形容詞化)",
        "coreImage": "「頭の中の空論ではなく、実際の経験や試行錯誤の中に飛び込んで得られた」というイメージから、『実証的な・経験に基づいた』を表します。"
    },
    "parameter": {
        "etymology": "接頭辞 para- (横に並べて) + 語根 meter (測る・尺度)",
        "coreImage": "「分析の対象と並べて置いて、変動や制約を測定するための基準」というイメージから、『媒介変数・尺度・制約条件』を表します。"
    },
    "phenomenon": {
        "etymology": "phainein (ギリシャ語：現れる、光る) + -on",
        "coreImage": "「隠れていたものが目の前に現れ出て、知覚できるようになった出来事」というイメージから、『現象・事象』を表します。"
    },
    "spectrum": {
        "etymology": "語根 spect (見る) + 接尾辞 -rum (見えるもの・器具)",
        "coreImage": "「光がプリズムを通って広がり、目に見える形になった色の帯」というイメージから、両端のあいだに広がる『範囲・スペクトル・連続体』を表します。"
    },
    "dichotomy": {
        "etymology": "dicha (二つに) + tome (切る・分断)",
        "coreImage": "「ひとつの対象をナイフで真っ二つに分断して対立させる」というイメージから、『二分法・対立』を表します。"
    },
    "paradigm": {
        "etymology": "接頭辞 para- (並べて) + deiknynai (示す・見せる)",
        "coreImage": "「物事を考える際の基準として、横に並べて手本として示す枠組み」というイメージから、『パラダイム・理論的枠組み・模範』を表します。"
    },
    "correlation": {
        "etymology": "接頭辞 cor- (共に) + relation (関係・結びつき)",
        "coreImage": "「二つの要素が手を取り合うように、互いに連動して変化する」というイメージから、データ間の『相関関係・相互関係』を表します。"
    },
    "consensus": {
        "etymology": "接頭辞 con- (共に) + 語根 sens (感じる・思う) + 接尾辞 -us",
        "coreImage": "「集団の全員が同じ方向を感じ取り、心が一つに合致する」というイメージから、組織や学問界の『総意・合意・意見の一致』を表します。"
    },
    "disparity": {
        "etymology": "接頭辞 dis- (否定・離れて) + par (同等・等しい = peer/pair) + 接尾辞 -ity",
        "coreImage": "「本来は対等であるべきバランスが崩れ、離れて等しくない状態」というイメージから、『格差・相違・不均衡』を表します。"
    },
    "proportion": {
        "etymology": "接頭辞 pro- (〜に応じて) + 語根 port (分け前・部分) + 接尾辞 -ion",
        "coreImage": "「全体の大きさに応じて、それぞれに配分される分け前の釣り合い」というイメージから、『割合・比率・調和』を表します。"
    },
    "framework": {
        "etymology": "frame (骨組み、枠) + work (構造、作品)",
        "coreImage": "「建物や思考を支える強固な外枠の骨組み」というイメージから、研究や事業の『枠組み・基本構造・フレームワーク』を表します。"
    },
    "deviation": {
        "etymology": "接頭辞 de- (離れて、外れて) + via (道・ルート) + 接尾辞 -tion",
        "coreImage": "「本来進むべき本線（道）からスーッと外れて脇道にそれる」というイメージから、『逸脱・偏差・外れること』を表します。"
    },
    "extrinsic": {
        "etymology": "exterus (外の) + secus (沿って)",
        "coreImage": "「物事の内面的な本質ではなく、外側の環境から付随してくる」というイメージから、『外的な・非本質的な・付帯的な』を表します。"
    },
    "analogous": {
        "etymology": "接頭辞 ana- (〜に従って) + 語根 log (比率・論理) + 接尾辞 -ous",
        "coreImage": "「二つのものの論理的な構造や比率がよく似ていて一致している」というイメージから、『類似した・相似の』を表します。"
    },
    "congruent": {
        "etymology": "接頭辞 con- (共に) + gruere (一致する・集まる)",
        "coreImage": "「二つの図形や主張を重ね合わせた時、ピッタリと隙間なく重なり合う」というイメージから、『合同の・一致した・調和する』を表します。"
    }
}

def decompose_word(term, pos, meaning):
    w_low = term.lower()
    
    # 1. Curated database
    if w_low in CURATED_CORE_IMAGES:
        d = CURATED_CORE_IMAGES[w_low]
        return d['coreImage'], d['etymology']
        
    first_m = meaning.split('、')[0] if meaning else term

    # 2. Decompose Prefix
    found_pre = None
    for pre in sorted(PREFIXES.keys(), key=lambda x: -len(x)):
        if w_low.startswith(pre) and len(w_low) >= len(pre) + 3:
            found_pre = pre
            break
            
    rem_after_pre = w_low[len(found_pre):] if found_pre else w_low
    
    # 3. Decompose Suffix
    found_suf = None
    for suf in sorted(SUFFIXES.keys(), key=lambda x: -len(x)):
        if rem_after_pre.endswith(suf) and len(rem_after_pre) >= len(suf) + 2:
            found_suf = suf
            break
            
    root_candidate = rem_after_pre[:-len(found_suf)] if found_suf else rem_after_pre
    
    # 4. Decompose Root
    found_root = None
    for root in sorted(ROOTS.keys(), key=lambda x: -len(x)):
        if root in root_candidate:
            found_root = root
            break
            
    parts = []
    if found_pre:
        parts.append(f"接頭辞 {found_pre}- ({PREFIXES[found_pre][0]})")
    if found_root:
        parts.append(f"語根 {found_root} ({ROOTS[found_root][0]})")
    if found_suf:
        parts.append(f"接尾辞 -{found_suf} ({SUFFIXES[found_suf][0]})")
        
    etymology_str = " + ".join(parts) if parts else ""
    
    # 5. Build Core Image Narrative
    if found_pre and found_root:
        p_desc = PREFIXES[found_pre][0].split('、')[0]
        r_desc = ROOTS[found_root][0].split('、')[0]
        core_img = f"「{p_desc}」＋「{r_desc}」が合わさり、『{first_m}』という本質的なニュアンスにつながっています。"
    elif found_pre and found_suf:
        p_desc = PREFIXES[found_pre][0].split('、')[0]
        core_img = f"「{p_desc}」の方向性を持つ動きから、発展して『{first_m}』を表すイメージです。"
    elif found_root and found_suf:
        r_desc = ROOTS[found_root][0].split('、')[0]
        core_img = f"「{r_desc}」という基本概念が核となり、状態や性質として『{first_m}』を意味します。"
    elif found_pre:
        p_desc = PREFIXES[found_pre][0].split('、')[0]
        core_img = f"接頭辞「{p_desc}」のイメージが加わることで、『{first_m}』の意味合いが形成されています。"
    else:
        core_img = f"核となるイメージは「{first_m}」。根本のニュアンスをつかむと応用的な場面でも直感的に理解できます。"

    return core_img, etymology_str


def process_file(filename):
    filepath = os.path.join(DATA_DIR, filename)
    print(f"Adding core images to {filename}...")
    with open(filepath, 'r', encoding='utf-8') as f:
        cards = json.load(f)
        
    for c in cards:
        core_img, etym = decompose_word(c['term'], c.get('partOfSpeech', ''), c.get('meaning', ''))
        c['coreImage'] = core_img
        c['etymology'] = etym
        
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(cards, f, ensure_ascii=False, indent=2)
    print(f"Done {filename}! {len(cards)} entries updated.")


if __name__ == '__main__':
    process_file('toeic_8000.json')
    process_file('ielts_8000.json')
    print("All core images and etymology successfully added!")
