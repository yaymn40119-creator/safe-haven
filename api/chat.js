export default async function handler(req, res) {
    console.log("🚀 الطلب وصل المطبخ السري!");

    if (req.method !== 'POST') {
        return res.status(405).json({ reply: "طريقة الطلب غير مسموحة" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const { message, userName } = req.body;

    console.log("الرسالة:", message, "| الاسم:", userName);

    // كلمة السر للاختبار (عشان نتأكد إن Vercel شغال 100%)
    if (message === "اختبار") {
        console.log("✅ اختبار الاتصال نجح!");
        return res.status(200).json({ reply: "المطبخ السري شغال 100% يا يوسف! العيب مش من Vercel." });
    }

    if (!apiKey) {
        console.log("❌ المفتاح مش موجود");
        return res.status(200).json({ reply: "يوسف! المفتاح السري مش مقري في Vercel." });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const payload = {
        contents: [{ parts: [{ text: message }] }],
        systemInstruction: {
            parts: [{ text: `أنتِ صديقة داعمة، حنونة. اسم المستخدمة هو '${userName}'. مبرمجك هو 'يوسف'.` }]
        }
    };

    try {
        console.log("⏳ جاري الاتصال بجوجل...");
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        console.log("📥 رد جوجل وصل!");

        if (!response.ok) {
            console.log("❌ جوجل رفضت الطلب:", data.error);
            return res.status(200).json({ reply: `جوجل رافضة الطلب: ${data.error?.message}` });
        }

        if (data.candidates && data.candidates.length > 0) {
            const reply = data.candidates[0].content.parts[0].text;
            return res.status(200).json({ reply });
        }

        return res.status(200).json({ reply: "جوجل ردت بس مفيش كلام في الرد!" });

    } catch (error) {
        console.error("💥 المطبخ السري ضرب:", error);
        return res.status(200).json({ reply: `المطبخ السري ضرب وبيقول: ${error.message}` });
    }
}
