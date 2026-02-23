const SENPAI_KEY = "AIzaSyBjjplB8mWZl3y3v9-WUMxjvLmARHYrmA0";
let chatHistory = [];

function openVault() {
    if (document.getElementById('pass-key').value === "2026") {
        document.getElementById('lock-screen').classList.replace('active', 'hidden');
        document.getElementById('vault-core').classList.add('active');
        startHearts();
        initAI();
    } else {
        document.getElementById('error-msg').innerText = "الرمز السري خطأ.. حاولي تاني يا شطورة! 🙂";
    }
}

async function initAI() {
    typeWriter("أهلاً بيكي في عيادة 'السينباي' الرومانسية.. أنا هنا عشان أشوف لو إنتي فعلاً بتستحقي حب يوسف ولا مجرد تمثال بارد ببيضيع وقته. ردي بذكاء وإلا ههينك! جاهزة؟ 👾");
}

function handleKey(e) { if(e.key === 'Enter') sendToSenpai(); }

async function sendToSenpai() {
    const input = document.getElementById('user-msg');
    const msg = input.value.trim();
    if (!msg) return;

    input.value = ""; input.disabled = true;
    document.getElementById('ai-output').innerText = "السينباي بيحلل برودك... ⚙️";

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${SENPAI_KEY}`;
    
    const payload = {
        contents: chatHistory.concat({ role: "user", parts: [{ text: msg }] }),
        systemInstruction: {
            parts: [{ text: `أنت 'سينباي'، خبير الرومانسية المظلم بلهجة مصرية صايعة جداً. 
            قواعدك:
            1. الرد باللهجة العامية المصرية حصراً (لغة شباب 2026).
            2. لو البنت ردت برد بارد أو بدائي (مثلاً: "هرفضه" أو "مش عارفة"): اتريق عليها وأهينها ببرود (مثال: "يعني ده موقع اختبار رومانسية، حاولي تكوني رومانسية شوية يا تمثال 🙂").
            3. لو ردها عميق: امدحها بذهول الأنمي واعترف بحب يوسف ليها.
            4. الأسئلة لا نهائية، أنت من يقرر متى ينتهي الاختبار بناءً على انبهارك.
            ردك JSON فقط: { "reply": "نص الرد المصري", "isFinished": boolean, "verdict": "لقبها النهائي" }` }]
        }
    };

    try {
        const res = await fetch(url, { method: 'POST', body: JSON.stringify(payload) });
        const data = await res.json();
        const responseData = JSON.parse(data.candidates[0].content.parts[0].text.replace(/```json|```/g, ""));
        
        chatHistory.push({ role: "user", parts: [{ text: msg }] });
        chatHistory.push({ role: "model", parts: [{ text: responseData.reply }] });

        if (responseData.isFinished) {
            renderFinal(responseData.reply, responseData.verdict);
        } else {
            typeWriter(responseData.reply, () => { input.disabled = false; input.focus(); });
        }
    } catch (e) {
        typeWriter("فشل الاتصال بعقلي.. حاولي مجدداً يا 'باكا'! 🙂");
        input.disabled = false;
    }
}

function typeWriter(text, callback) {
    let el = document.getElementById('ai-output');
    el.innerText = ""; let i = 0;
    function t() {
        if (i < text.length) { el.innerText += text.charAt(i); i++; setTimeout(t, 35); }
        else if (callback) callback();
    }
    t();
}

function startHearts() {
    const rain = document.getElementById('heart-rain');
    setInterval(() => {
        const h = document.createElement('div');
        h.className = 'heart'; h.innerHTML = '❤️';
        h.style.left = Math.random() * 100 + 'vw';
        h.style.animationDuration = Math.random() * 3 + 2 + 's';
        rain.appendChild(h);
        setTimeout(() => h.remove(), 5000);
    }, 300);
}

function renderFinal(text, verdict) {
    document.getElementById('ai-output').innerText = text;
    document.getElementById('memories-grid').classList.remove('hidden');
    alert(`التقييم النهائي: ${verdict}`);
    document.querySelector('.control-panel').style.display = 'none';
}
