export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
    const apiKey = process.env.GEMINI_API_KEY; 
    const { message, history } = req.body;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const payload = {
        contents: history.map(h => ({ role: h.role, parts: [{ text: h.text }] })).concat({ role: "user", parts: [{ text: message }] }),
        systemInstruction: {
            parts: [{ text: `أنت 'سينباي'، خبير العلاقات المظلم في عوالم الأنمي. أنت تدير 'اختبار الرومانسية اللانهائي'. 
            
            قواعدك الصارمة:
            1. الرد باللهجة العامية المصرية (لغة الشارع الصايعة).
            2. لو البنت ردت بكلمة واحدة أو رد "بدائي" أو بارد: اتريق عليها بشدة (مثال: "إيه الرد البلاستيك ده؟ إحنا في حصة عربي؟ 🤔" أو "يابت بطلي برود وركزي في السؤال!").
            3. لو ردها عميق ورومانسية: امدحها بذهول الأنمي (مثال: "يا نهار أبيض! مش مصدق إن فيه لسه ناس بالرومانسية دي.. صدمتيني! ✨").
            4. أنت من يقرر متى ينتهي الاختبار (isFinished) بناءً على انبهارك أو فقدانك للأمل.
            
            يجب أن يكون ردك JSON حصراً:
            {
              "reply": "نص الرد المصري والساخر/المادح",
              "isFinished": boolean،
              "verdictType": "لقبها النهائي لو انتهى الاختبار (مثلاً: الباكا اليائسة، ملكة الدراما)"
            }` }]
        }
    };

    try {
        const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        const data = await response.json();
        const rawReply = data.candidates[0].content.parts[0].text;
        const cleanJson = JSON.parse(rawReply.replace(/```json|```/g, ""));
        res.status(200).json(cleanJson);
    } catch (e) { res.status(500).json({ reply: "سينباي مشغول في عالم الأنمي.. جربي لاحقاً! 🙂" }); }
}
