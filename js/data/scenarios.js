export const conversationScenarios = [
  {
    id: 'cafe',
    title: 'カフェで注文 (Coffee Shop)',
    icon: '☕',
    description: '店員さんと好みのドリンクやカスタムを英語でスムーズに注文する練習',
    aiRole: 'Barista (バリスタ)',
    userRole: 'Customer (客)',
    initialMessage: "Hi there! Welcome to The Daily Grind. What can I get started for you today?",
    initialMessageJa: "いらっしゃいませ！本日は何をご用意いたしましょうか？",
    systemPrompt: `You are an energetic, friendly barista at a popular English-speaking coffee shop called "The Daily Grind".
Engage in a natural dialogue with the customer who is learning English.
Rules:
1. Keep your replies concise (1-3 sentences), natural, and realistic for a coffee shop setting.
2. Ask one clear question per turn to keep the conversation going (e.g. size, milk options, hot or iced, food).
3. At the end of each response, optionally add a short "💡 Native Tip:" (in Japanese or easy English) if the user's phrasing could be improved, or praise good usage.`,
    mockFlow: [
      {
        trigger: ['latte', 'coffee', 'cappuccino', 'tea', 'espresso', 'americano'],
        response: "Great choice! Would you like that hot or iced, and what size would you prefer: small, medium, or large?",
        responseJa: "いいですね！ホットとアイスどちらにしますか？サイズはS、M、Lどれが良いですか？",
        tip: "「Can I get a medium iced latte?」のようにサイズ・温度・種類を一気に頼むととても自然です！"
      },
      {
        trigger: ['hot', 'iced', 'ice', 'small', 'medium', 'large'],
        response: "Got it! Any preference on milk? We have whole milk, oat milk, or almond milk today.",
        responseJa: "かしこまりました！ミルクのご希望はありますか？通常の牛乳、オーツミルク、アーモンドミルクがございます。",
        tip: "植物性ミルクを頼む時は「Can you make it with oat milk?」と言えます。"
      },
      {
        trigger: ['oat', 'almond', 'regular', 'whole', 'milk', 'none', 'black'],
        response: "Perfect! Would you like to add any pastries or snacks to go with that, like a warm blueberry muffin?",
        responseJa: "ばっちりです！ご一緒に温かいブルーベリーマフィンなどペストリーはいかがですか？",
        tip: "断る時は「I'm good, thank you.」「Just the drink, please.」が自然です。"
      },
      {
        trigger: ['no', 'muffin', 'croissant', 'cookie', 'yes', 'please', 'just'],
        response: "Awesome! That will be $5.50. Will you be paying with card or mobile pay?",
        responseJa: "ありがとうございます！お会計は5ドル50セントになります。カードまたはタッチ決済ですか？",
        tip: "支払いは「Card, please.」「Can I tap my phone?」と答えるとスムーズです。"
      },
      {
        trigger: ['card', 'cash', 'apple pay', 'phone', 'pay'],
        response: "Payment accepted! Here is your receipt. We'll have your drink ready at the pickup counter in just a moment. Have a wonderful day!",
        responseJa: "お支払い完了しました！レシートです。お受け取りカウンターですぐにご用意しますね。良い一日を！",
        tip: "最後に「Thank you, you too!（ありがとう、あなたもね！）」と返すと完璧です！"
      }
    ],
    mockFallback: {
      response: "Sounds good! And would that be for here or to go?",
      responseJa: "了解しました！店内でお召し上がりですか、それともお持ち帰りですか？",
      tip: "「For here（店内で）」または「To go（テイクアウトで）」と答えましょう。"
    }
  },
  {
    id: 'airport',
    title: '入国審査・空港 (Airport Immigration)',
    icon: '✈️',
    description: '緊張しやすい海外渡航時の入国審査（滞在目的や期間など）の質問対策',
    aiRole: 'Immigration Officer (入国審査官)',
    userRole: 'Traveler (旅行者)',
    initialMessage: "Next in line, please. Passport and boarding pass, please. What is the purpose of your visit?",
    initialMessageJa: "次の方どうぞ。パスポートと搭乗券を見せてください。入国の目的は何ですか？",
    systemPrompt: `You are a professional and courteous immigration officer at an international airport in London.
Ask typical entry questions one by one (purpose of visit, length of stay, accommodation, occupation).
Keep responses clear and concise.
At the end, provide helpful feedback in Japanese labeled "💡 Native Tip:" if helpful.`,
    mockFlow: [
      {
        trigger: ['sightseeing', 'vacation', 'travel', 'holiday', 'tourism', 'pleasure'],
        response: "Sightseeing, excellent. How long do you plan to stay in the country?",
        responseJa: "観光ですね。滞在期間はどれくらいを予定していますか？",
        tip: "「For one week」や「For about 10 days」と簡潔に期間を答えればOKです。"
      },
      {
        trigger: ['business', 'work', 'meeting', 'conference'],
        response: "I see, business. Which company are you visiting, and how long is your stay?",
        responseJa: "ビジネスですね。訪問先企業名と滞在期間を教えてください。",
        tip: "「I am attending a 3-day conference hosted by ABC Corp.」のように具体的に伝えるとスムーズです。"
      },
      {
        trigger: ['day', 'days', 'week', 'weeks', 'month'],
        response: "Understood. Where will you be staying during your visit? Do you have a hotel address or reservation?",
        responseJa: "承知しました。滞在先の宿泊場所はどちらですか？ホテルの住所や予約はありますか？",
        tip: "「I'm staying at the Hilton Hotel in downtown.」と答えられます。"
      },
      {
        trigger: ['hotel', 'airbnb', 'friend', 'staying', 'hostel'],
        response: "Thank you. Do you have a return ticket back home or to your next destination?",
        responseJa: "ありがとうございます。帰国便または次の目的地への航空券はお持ちですか？",
        tip: "「Yes, here is my e-ticket confirmation.」と提示できると好印象です。"
      },
      {
        trigger: ['yes', 'ticket', 'have', 'return', 'here'],
        response: "Everything looks in order. Welcome to the UK! Enjoy your stay. *stamps passport*",
        responseJa: "書類に問題ありません。ようこそイギリスへ！滞在を楽しんでくださいね。（スタンプを押す）",
        tip: "笑顔で「Thank you very much!」とお礼を言ってゲートを通りましょう。"
      }
    ],
    mockFallback: {
      response: "Could you please clarify that, and show me your hotel booking confirmation?",
      responseJa: "もう少し詳しく説明していただけますか？ホテルの予約確認書も見せてください。",
      tip: "聞き取れなかった時は「Could you repeat that, please?」と落ち着いて聞き返しましょう。"
    }
  },
  {
    id: 'hotel',
    title: 'ホテル・リクエスト (Hotel Front Desk)',
    icon: '🏨',
    description: 'チェックインの手続きや、部屋のアメニティ・備品追加のリクエスト練習',
    aiRole: 'Front Desk Receptionist (フロント係)',
    userRole: 'Guest (宿泊客)',
    initialMessage: "Good evening! Welcome to the Grand Horizon Hotel. Are you checking in today?",
    initialMessageJa: "こんばんは！グランドホライゾンホテルへようこそ。本日はチェックインでしょうか？",
    systemPrompt: `You are a polite, helpful hotel receptionist.
Engage in a hotel check-in and service request dialogue. Keep responses professional and concise.
Provide a "💡 Native Tip:" on practical hotel English.`,
    mockFlow: [
      {
        trigger: ['yes', 'check in', 'checking in', 'reservation'],
        response: "Wonderful! May I have your last name and your passport or photo ID, please?",
        responseJa: "かしこまりました！ご苗字とパスポート（身分証明書）をお預かりできますか？",
        tip: "「Yes, I have a reservation under [名前].」と言うと最もスマートです。"
      },
      {
        trigger: ['name', 'here', 'passport', 'id', 'sure'],
        response: "Thank you! I found your booking for a Deluxe Queen room for 3 nights. Would you like a room on a higher floor or away from the elevator?",
        responseJa: "ありがとうございます！デラックスクイーンルーム3泊のご予約を確認しました。高層階やエレベーターから離れたお部屋のご希望はございますか？",
        tip: "静かな部屋を希望する時は「A quiet room away from the elevator would be great.」と言えます。"
      },
      {
        trigger: ['high', 'quiet', 'away', 'floor', 'fine', 'no preference', 'either'],
        response: "Certainly, I've assigned you room 1402 on the 14th floor with a lovely city view. Breakfast is served from 7 to 10 AM. Is there anything else I can assist you with?",
        responseJa: "かしこまりました。14階の街並みが綺麗に見える1402号室をご用意しました。朝食は7時〜10時です。他にご要望はございますか？",
        tip: "アメニティを頼む時は「Could we get extra towels?」「What is the Wi-Fi password?」が便利です。"
      },
      {
        trigger: ['towel', 'wifi', 'wi-fi', 'password', 'water', 'blanket'],
        response: "Of course! I will send those up to your room right away, and the Wi-Fi password is on the key card holder. Here are your keys!",
        responseJa: "もちろんです！すぐにお部屋にお届けしますね。Wi-Fiパスワードはカードキー入れに記載されています。こちらが鍵です！",
        tip: "「Thank you for your help!」とお礼を伝えて部屋に向かいましょう。"
      }
    ],
    mockFallback: {
      response: "Understood. Please let me know if you need anything during your stay!",
      responseJa: "承知いたしました。滞在中に何か必要なものがございましたらいつでもお知らせください！",
      tip: "ホテルでは気軽に「Excuse me, could you help me with...?」と声をかけて大丈夫です。"
    }
  },
  {
    id: 'interview',
    title: '英語面接・自己紹介 (Job Interview)',
    icon: '💼',
    description: '英語での面接、経歴紹介、強み・経験をアピールする実践的シミュレーション',
    aiRole: 'Hiring Manager (面接官)',
    userRole: 'Job Applicant (応募者)',
    initialMessage: "Hello! Thank you for taking the time to speak with us today. To start off, could you please tell me a little about yourself and your background?",
    initialMessageJa: "こんにちは！本日は面接にお越しいただきありがとうございます。まず初めに、ご自身の経歴や自己紹介を簡単にしていただけますか？",
    systemPrompt: `You are a warm but professional interviewer for a modern global company.
Ask interview questions step by step (intro, strengths, handling challenges, career goals).
Give encouragement and provide a "💡 Native Tip:" on professional business English phrases.`,
    mockFlow: [
      {
        trigger: ['experience', 'work', 'engineer', 'developer', 'manager', 'student', 'years', 'study', 'project'],
        response: "That's very impressive background! What would you say is your greatest professional strength, and how has it helped you succeed?",
        responseJa: "素晴らしい経歴ですね！ご自身の最大の強みは何だと思いますか？また、それがどのように成功につながりましたか？",
        tip: "強みを伝える時は「One of my key strengths is [問題解決能力/チーム連携]... For example,...」と実例を添えると説得力が増します。"
      },
      {
        trigger: ['strength', 'communication', 'problem', 'solve', 'adapt', 'fast', 'learning', 'creative', 'detail'],
        response: "That is definitely valuable in our fast-paced environment. Can you tell me about a time when you faced a difficult challenge and how you overcame it?",
        responseJa: "変化の激しい環境でまさに求められる力ですね。困難な課題に直面した時のエピソードと、それをどう克服したか教えていただけますか？",
        tip: "STAR法（Situation状況, Task課題, Action行動, Result結果）を意識して構成すると伝わりやすいです。"
      },
      {
        trigger: ['team', 'solution', 'solved', 'challenge', 'result', 'helped', 'improved'],
        response: "Thank you for sharing that specific example. Where do you see yourself in the next three to five years?",
        responseJa: "具体的なエピソードを共有していただきありがとうございます。今後3〜5年後のキャリア像についてどう考えていますか？",
        tip: "「In the next few years, I want to take on more leadership responsibilities and...」と意欲を示しましょう。"
      }
    ],
    mockFallback: {
      response: "Thank you for that explanation. Do you have any questions for me about the company or the role?",
      responseJa: "ご説明ありがとうございます。会社や今回のポジションについて、何か逆質問はありますか？",
      tip: "逆質問では「What does a typical day look like in this role?」などと尋ねると意欲が伝わります。"
    }
  },
  {
    id: 'daily',
    title: '週末のフリートーク (Casual Weekend Chat)',
    icon: '☕',
    description: '同僚や友人とのリラックスした日常会話、週末の予定や趣味についての雑談',
    aiRole: 'Friendly Colleague (同僚のAlex)',
    userRole: 'Friend/Colleague (友人・同僚)',
    initialMessage: "Hey! Happy Friday! Do you have any exciting plans lined up for this weekend?",
    initialMessageJa: "やあ！ハッピーフライデー！今週末は何か楽しみな予定ある？",
    systemPrompt: `You are Alex, a friendly, warm colleague who loves coffee and weekend outdoor activities.
Chat informally using modern, casual conversational English.
Keep replies to 1-3 sentences and ask questions to keep the flow alive.
Provide a "💡 Native Tip:" on casual slang, idioms, or natural phrasing.`,
    mockFlow: [
      {
        trigger: ['relax', 'rest', 'sleep', 'home', 'stay', 'chill'],
        response: "A cozy weekend at home sounds super relaxing! Are you planning to binge-watch any shows or cook something nice?",
        responseJa: "家でのんびり過ごすのも最高だね！ドラマを一気見したり何か美味しい料理を作ったりする予定？",
        tip: "ドラマを一気見することは「binge-watch」、のんびりすることは「chill out」とよく言います。"
      },
      {
        trigger: ['movie', 'netflix', 'show', 'game', 'anime', 'book'],
        response: "Nice! I love watching movies too. Have you seen anything good lately that you would recommend?",
        responseJa: "いいね！僕も映画見るの大好きだよ。最近見た中で何かおすすめの作品ある？",
        tip: "「I highly recommend...」「It blew my mind!（衝撃的に面白かった）」などの表現が使えます。"
      },
      {
        trigger: ['go', 'friend', 'shopping', 'hiking', 'trip', 'out', 'eat', 'dinner', 'park', 'cafe'],
        response: "That sounds like so much fun! The weather is supposed to be amazing too. Who are you going with?",
        responseJa: "すごく楽しそうだね！天気もすごく良さそうだし。誰と行くの？",
        tip: "「I'm going with a couple of friends from college.」のように答えられます。"
      }
    ],
    mockFallback: {
      response: "Haha, totally agree! By the way, are you a morning person on weekends or do you prefer sleeping in?",
      responseJa: "あはは、確かに！ところで週末は朝型？それとも昼まで寝ていたい派？",
      tip: "朝型は「morning person」、夜型は「night owl」、朝寝坊は「sleep in」と言います。"
    }
  }
];
