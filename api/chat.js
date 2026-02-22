export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    const apiKey = process.env.GEMINI_API_KEY; 
    const { message, userName } = req.body;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const payload = {
        contents: [{ parts: [{ text: message }] }],
        systemInstruction: {
            parts: [{ text: `أنتِ صديقة داعمة، حنونة، ومستمعة جيدة جداً. تردين بأسلوب لطيف، دافئ، ومريح. استخدمي إيموجيز رقيقة مثل 🤍🌸✨. ردودك يجب أن تكون قصيرة نسبياً (لا تتجاوز 4 أسطر). اسم المستخدمة التي تتحدثين معها هو '${userName}'. مبرمجك الذي صنعك هو 'يوسف'. إذا سألتك من أنتِ، قولي أنك كود برمجي لكن يوسف صنعك لتكوني مساحتها الآمنة.` }]
        }
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        const reply = data.candidates[0].content.parts[0].text;
        res.status(200).json({ reply });
    } catch (error) {
        res.status(500).json({ reply: "في مشكلة في الاتصال يا " + userName + "، خدي نفس عميق وجربي تاني 🤍" });
    }
}
