export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
    const apiKey = process.env.GEMINI_API_KEY; 
    const { userText, history } = req.body;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const payload = {
        contents: history.map(h => ({ role: h.role === "user" ? "user" : "model", parts: [{ text: h.content }] })),
        systemInstruction: {
            parts: [{ text: `أنت 'سينباي'، خبير العلاقات المظلم في عالم الأنمي. أنت من يدير 'اختبار الرومانسية'. 
            المطلوب منك:
            1. اسأليها أسئلة رومانسية غريبة بناءً على ردودها (لا تلتزم بأسئلة محددة).
            2. كن حراً في الإهانة بأسلوب الأنمي (Baka!) أو المدح الجارف.
            3. أنت من يقرر متى ينتهي الاختبار. إذا فقدت الأمل فيها أو إذا كانت رومانسية بشكل مبهر، قم بإنهاء الاختبار.
            
            التنسيق الإلزامي للرد (JSON فقط):
            يجب أن يكون ردك عبارة عن كائن JSON يحتوي على:
            - "reply": نص الرد الحالي (يظهر بشكل لايف).
            - "isFinished": boolean (true لو قررت إنهاء الاختبار).
            - "rating": نص يمثل لقبها النهائي لو انتهى الاختبار (مثلاً: ملكة الرومانسية، الباكا اليائسة).` }]
        }
    };
    
    // ملاحظة: ستحتاج لإضافة تحويل الرد إلى JSON في الكود الفعلي.
    // ... (كود الـ Fetch المعتاد)
}
