const ACCESS_CODE = "2026";
let conversation = [];

function startSystem() {
    if (document.getElementById('pass-input').value === ACCESS_CODE) {
        document.getElementById('lock-screen').classList.add('hidden');
        document.getElementById('app').classList.remove('hidden');
        wakeUpSenpai();
    } else {
        document.getElementById('error-msg').innerText = "تم رفض الوصول.. الرمز غير صحيح.";
    }
}

async function wakeUpSenpai() {
    typeWriter("أهلاً بكِ في نظام 'السينباي' المتطور.. أنا هنا لأختبر عمق مشاعرك بذكاء. لا تتوقعي أسئلة سهلة، ولا تتوقعي رقة مفرطة. هل نبدأ الاختبار أم ستبكين الآن؟ 👾");
}

function handleKey(e) { if(e.key === 'Enter') sendToSenpai(); }

async function sendToSenpai() {
    const input = document.getElementById('user-input');
    const msg = input.value.trim();
    if (!msg) return;

    input.value = "";
    input.disabled = true;
    document.getElementById('ai-text').innerText = "جاري تحليل الرد المتواضع... ⚙️";

    try {
        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: msg, history: conversation })
        });
        const data = await res.json();
        
        conversation.push({ role: "user", text: msg });
        conversation.push({ role: "model", text: data.reply });

        if (data.isFinished) {
            showFinalVerdict(data.reply, data.verdictType);
        } else {
            typeWriter(data.reply, () => { input.disabled = false; input.focus(); });
        }
    } catch (e) {
        typeWriter("حدث خطأ في مصفوفة البيانات.. حاولي مجدداً.");
        input.disabled = false;
    }
}

function typeWriter(text, callback) {
    let el = document.getElementById('ai-text');
    el.innerText = "";
    let i = 0;
    function t() {
        if (i < text.length) {
            el.innerText += text.charAt(i);
            i++;
            setTimeout(t, 35);
        } else if (callback) callback();
    }
    t();
}

function showFinalVerdict(text, type) {
    document.getElementById('ai-text').innerText = text;
    document.getElementById('final-verdict').classList.remove('hidden');
    document.getElementById('result-title').innerText = `اللقب النهائي: ${type}`;
    
    // صورة ميمز أنمي بناءً على اللقب
    const isBaka = type.includes("باكا") || type.includes("يائسة");
    document.getElementById('result-img').src = isBaka 
        ? "https://media.giphy.com/media/UQP2h8Q7g37hI1J5yP/giphy.gif" 
        : "https://media.giphy.com/media/L95W4wv8nnb9K/giphy.gif";
        
    document.querySelector('.control-center').style.display = 'none';
}
