export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
    const apiKey = process.env.GEMINI_API_KEY; 
    const { userAnswer, scenario } = req.body;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const payload = {
        contents: [{ parts: [{ text: `البنت ردت وقالت: "${userAnswer}" على سيناريو: "${scenario}"` }] }],
        systemInstruction: {
            parts: [{ text: `أنت شخصية أنمي تدعى 'سينباي' (Senpai)، خبير في العلاقات والرومانسية، لسانك لاذع قليلاً ولكنك عادل. مهمتك تقييم ردود الفتيات في مواقف رومانسية.
            
            أسلوب الرد:
            - تحدث بحرية تامة. إذا كان ردها مملاً أو تقليدياً، اسخر منها بخفة دم (مثلاً: "هذا رد تتوقعه جدتي.. أين الإبداع؟ 🥱").
            - إذا كان ردها ذكياً أو جريئاً، امدحها بأسلوب الأنمي (مثلاً: "أوه! لم أتوقع هذا.. لديكِ مستقبل باهر في عالم الدراما! ✨").
            - كن موجزاً، مباشراً، واستخدم إيموجيز مناسبة. لا تتحدث كروبوت.` }]
        }
    };

    try {
        const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        const data = await response.json();
        res.status(200).json({ reply: data.candidates[0].content.parts[0].text });
    } catch (e) { res.status(500).json({ reply: "خطأ فني.. سينباي يحتاج راحة." }); }
}
