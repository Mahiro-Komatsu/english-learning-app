# -*- coding: utf-8 -*-
import re

file_path = 'js/data/flashcards.js'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Core images for daily cards
replacements = {
    "'d1'": {
        "term": "Hesitant",
        "coreImage": "「足がすくんで一歩前へ踏み出すのをためらう」イメージから『ためらいがちな・躊躇している』",
        "etymology": "haerere (ラテン語：くっつく、立ち往生する) + -ant"
    },
    "'d2'": {
        "term": "Appreciate",
        "coreImage": "「相手の行為や価値（price）を正当に評価して敬意を払う」イメージから『感謝する・真価を認める』",
        "etymology": "ad- (〜へ) + pretium (価値・価格 = price) + -ate"
    },
    "'d3'": {
        "term": "Convenient",
        "coreImage": "「必要なものが同じ場所へ一緒にぴったり集まって好都合」というイメージから『都合の良い・便利な』",
        "etymology": "con- (共に) + ven (来る = venire) + -ient"
    },
    "'d4'": {
        "term": "Definite",
        "coreImage": "「境界線（fin）をきっちり引いて、曖昧さを排除した」イメージから『明確な・確実な』",
        "etymology": "de- (完全に) + fin (境界・終わり) + -ite"
    },
    "'d5'": {
        "term": "Exhausted",
        "coreImage": "「井戸から水を汲み尽くすように、エネルギーを外へ出し切った」イメージから『疲れ果てた・クタクタな』",
        "etymology": "ex- (外へ) + haurire (汲み出す) + -ed"
    },
    "'d6'": {
        "term": "Keep in touch",
        "coreImage": "「触れ合えるほど近い距離感を保ち続ける」というイメージから『連絡を取り合う』",
        "etymology": "keep (保つ) + in touch (接触の範囲内に)"
    },
    "'d7'": {
        "term": "Spontaneous",
        "coreImage": "「外からの強制ではなく、自分の内側から自然と湧き出る」イメージから『自発的な・思いつきの』",
        "etymology": "sponte (自発的に、自分の意志で) + -ous"
    },
    "'d8'": {
        "term": "Relieved",
        "coreImage": "「重い荷物を下から持ち上げて軽くしてもらい、肩の荷が下りる」イメージから『安心した・ホッとした』",
        "etymology": "re- (再び) + levis (軽い = lever/lift) + -ed"
    },
    "'d9'": {
        "term": "Figure out",
        "coreImage": "「頭の中で形（figure）を描いて、外に答えを導き出す」イメージから『理解する・解決策を見つける』",
        "etymology": "figure (形、計算) + out (外へ導き出す)"
    },
    "'d10'": {
        "term": "Coincidence",
        "coreImage": "「別々の出来事がたまたま同じタイミングで同時に落ち合う」イメージから『偶然の一致』",
        "etymology": "co- (共に) + in- (上に) + cadere (落ちる) + -ence"
    },
    "'d11'": {
        "term": "Catch up",
        "coreImage": "「先行した相手のところまで走って追いつき、肩を並べる」イメージから『近況を報告し合う・追いつく』",
        "etymology": "catch (つかまえる) + up (完全に・上まで)"
    },
    "'d12'": {
        "term": "Embarrassed",
        "coreImage": "「前方を柵（バー）で塞がれて身動きが取れず、狼狽する」イメージから『恥ずかしい・きまりが悪い』",
        "etymology": "em- (中に) + barra (横木、柵 = bar) + -ed"
    },
    "'t1'": {
        "term": "Boarding pass",
        "coreImage": "「飛行機や船の板（ボード）の上へ乗り込むことを許可する通行証」イメージから『搭乗券』",
        "etymology": "board (板・甲板に乗る) + pass (通行証)"
    },
    "'t2'": {
        "term": "Baggage claim",
        "coreImage": "「預けていた手荷物に対して『これは私のものです』と権利を主張して受け取る場所」イメージから『手荷物受取所』",
        "etymology": "baggage (手荷物) + claim (権利を主張する)"
    },
    "'t3'": {
        "term": "Reservation",
        "coreImage": "「他人に取られないよう、前もって自分のために確保して取っておく」イメージから『予約』",
        "etymology": "re- (後ろに、取っておく) + serv (保つ) + -ation"
    },
    "'t4'": {
        "term": "Complimentary",
        "coreImage": "「相手を満たす敬意（賛辞）として、料金を取らずに好意で贈る」イメージから『無料の・サービスの』",
        "etymology": "com- (完全に) + ple (満たす) + -ment + -ary"
    },
    "'t5'": {
        "term": "Destination",
        "coreImage": "「向かうべき場所として固く定められた到達地点」イメージから『目的地・行先』",
        "etymology": "de- (完全に) + stare (立つ・定める) + -tion"
    },
    "'t6'": {
        "term": "Layover",
        "coreImage": "「旅の途中で荷物をいったん置いて、次の便まで横たわって待機する」イメージから『乗り継ぎ時間・滞在』",
        "etymology": "lay (置く、横たえる) + over (越えて)"
    },
    "'t7'": {
        "term": "Could I get the check, please?",
        "coreImage": "「金額に間違いがないか点検（check）するための計算書を求める」イメージから『お会計をお願いできますか？』",
        "etymology": "check (照合、計算書)"
    },
    "'t8'": {
        "term": "Recommendations",
        "coreImage": "「相手に信頼して委ねるに値する素晴らしいものとして紹介する」イメージから『おすすめ・推薦』",
        "etymology": "re- (再び) + com- (完全に) + mandare (委ねる・託す) + -tion"
    }
}

for card_id, data in replacements.items():
    pattern = rf"(id:\s*{card_id},[\s\S]*?exampleJa:\s*['\"].*?['\"])"
    def repl(m):
        block = m.group(1)
        if 'coreImage' not in block:
            return block + f",\n        coreImage: '{data['coreImage']}',\n        etymology: '{data['etymology']}'"
        return block
    content = re.sub(pattern, repl, content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Enriched default decks with core images and etymology!")
