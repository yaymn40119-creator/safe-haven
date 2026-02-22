export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    const apiKey = process.env.GEMINI_API_KEY;
    const { message, userName } = req.body;

    // بنشيك لو المفتاح موجود أصلاً
    if (!apiKey) {
        return res.status(200).json({ reply: "يوسف! المفتاح السري مش مقري في Vercel، اتأكد إنك حطيته صح." });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const payload = {
        contents: [{ parts: [{ text: message }] }],
        systemInstruction: {
            parts: [{ text: `أنتِ صديقة داعمة، حنونة. اسم المستخدمة هو '${userName}'. مبرمجك هو 'يوسف'.` }]
        }
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        // هنا بنمسك أي خطأ صريح من جوجل ونطبعهولك
        if (data.error) {
            return res.status(200).json({ reply: `جوجل بتقولك في مشكلة: ${data.error.message}` });
        }

        // لو الرد سليم 100%
        if (data.candidates && data.candidates.length > 0) {
            const reply = data.candidates[0].content.parts[0].text;
            return res.status(200).json({ reply });
        }

        return res.status(200).json({ reply: "جوجل ردت بس مفيش كلام في الرد!" });

    } catch (error) {
        // لو الكود نفسه ضرب
        return res.status(200).json({ reply: `المطبخ السري ضرب وبيقول: ${error.message}` });
    }
}
