const CORRECT_PASS = "2026";
let conversationHistory = []; // ذاكرة الجلسة

function checkGate() {
    if (document.getElementById('password-input').value === CORRECT_PASS) {
        document.getElementById('lock-screen').classList.add('hidden');
        document.getElementById('app').classList.remove('hidden');
        startEngine();
    } else {
        document.getElementById('error-msg').innerText = "الرمز السري غير صحيح.. تم رفض الدخول.";
    }
}

async function startEngine() {
    typeLive("أهلاً بكي في اختبار الرومانسية.. أنا سينباي، سأختبر اليوم مدى جودة مشاعرك. هل أنتي جاهزة لبدء الاختبار أم ستنسحبين الآن؟");
}

function handleKey(e) { if(e.key === 'Enter') processStep(); }

async function processStep() {
    const inputField = document.getElementById('user-input');
    const userText = inputField.value.trim();
    if (!userText) return;

    inputField.value = "";
    inputField.disabled = true;
    document.getElementById('main-text').innerText = "سينباي يحلل كلماتك... 👾";

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                userText: userText, 
                history: conversationHistory 
            })
        });
        const data = await response.json();
        
        // تحديث الذاكرة
        conversationHistory.push({ role: "user", content: userText });
        conversationHistory.push({ role: "assistant", content: data.reply });

        // التحقق من انتهاء الاختبار
        if (data.isFinished) {
            handleFinalResult(data.reply, data.rating);
        } else {
            typeLive(data.reply, () => { inputField.disabled = false; inputField.focus(); });
        }
    } catch (e) {
        typeLive("حدث خلل في مصفوفة البيانات.. قولي مرة أخرى.");
        inputField.disabled = false;
    }
}

function typeLive(text, callback) {
    let box = document.getElementById('main-text');
    box.innerText = "";
    let i = 0;
    function t() {
        if (i < text.length) {
            box.innerText += text.charAt(i);
            i++;
            setTimeout(t, 35);
        } else if (callback) callback();
    }
    t();
}

function handleFinalResult(verdict, rating) {
    document.getElementById('main-text').innerText = verdict;
    document.getElementById('result-display').classList.remove('hidden');
    document.getElementById('final-title').innerText = `تقييمك النهائي: ${rating}`;
    
    // جلب صورة أنمي عشوائية بناءً على التقييم
    const imgUrl = rating.includes("يائسة") ? "https://files.catbox.moe/mzhwlv.jpg" : "https://files.catbox.moe/6v7f5n.jpg";
    document.getElementById('final-anime-img').src = imgUrl;
    document.querySelector('.control-panel').style.display = 'none';
}
