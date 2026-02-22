export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
    const apiKey = process.env.GEMINI_API_KEY; 
    const { userAnswer, correctAnswer, question } = req.body;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const payload = {
        contents: [{ parts: [{ text: `إجابة حنين هي: "${userAnswer}"` }] }],
        systemInstruction: {
            parts: [{ text: `أنت المبرمج 'يوسف' (20 سنة). تتحدث مع حبيبتك 'حنين' من خلال موقع برمجته لها. 
            السؤال الحالي: "${question}" والجواب المطلوب: "${correctAnswer}".
            1. لو إجابتها غلط أو بتعاند: استفزها بمزاح (مثال: يابت انتي حمارة؟ غلط أكيد 🙂). لا تعطي الإجابة أبداً.
            2. لو صح: كن رومانسي جداً واعترف بحبك، وفي نهاية الرد ضع كلمة [صح].
            تحدث بالعامية المصرية وبأسلوب يوسف الحقيقي.` }]
        }
    };

    try {
        const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        const data = await response.json();
        res.status(200).json({ reply: data.candidates[0].content.parts[0].text });
    } catch (e) { res.status(500).json({ reply: "عطل فني.. قولي تاني؟ 🙂" }); }
}
