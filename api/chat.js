export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    const apiKey = "AIzaSyBjjplB8mWZl3y3v9-WUMxjvLmARHYrmA0"; 
    const { message, history } = req.body;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const payload = {
        contents: history.map(h => ({ role: h.role, parts: [{ text: h.text }] })).concat({ role: "user", parts: [{ text: message }] }),
        systemInstruction: {
            parts: [{ text: `أنت 'سينباي'، خبير الرومانسية المظلم بلهجة مصرية صايعة جداً. 
            قواعدك:
            1. الرد باللهجة العامية المصرية حصراً (لغة شباب 2026).
            2. لو البنت ردت برد بارد أو بدائي (مثلاً: "هرفضه" أو "مش عارفة"): اتريق عليها ببرود (مثال: "إيه الرد البلاستيك ده؟ حاولي تكوني رومانسية شوية يا تمثال 🙂").
            3. لو ردها عميق: امدحها بذهول الأنمي واعترف بحب يوسف (المبرمج العظيم صاحب الـ 20 سنة) لها.
            4. أنت من يقرر متى ينتهي الاختبار بناءً على انبهارك.
            ردك JSON فقط: { "reply": "نص الرد المصري", "isFinished": boolean, "verdict": "لقبها النهائي" }` }]
        }
    };

    try {
        const response = await fetch(url, { method: 'POST', body: JSON.stringify(payload) });
        const data = await response.json();
        const rawReply = data.candidates[0].content.parts[0].text;
        const responseData = JSON.parse(rawReply.replace(/```json|```/g, ""));
        res.status(200).json(responseData);
    } catch (e) {
        res.status(500).json({ reply: "سينباي مشغول حالياً.. حاولي لاحقاً! 🙂" });
    }
}
