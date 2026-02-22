const CORRECT_PASS = "2026";

function unlockExperience() {
    let pass = document.getElementById('password-input').value;
    if (pass === CORRECT_PASS) {
        document.getElementById('lock-screen').classList.add('hidden');
        document.getElementById('story-content').classList.remove('hidden');
        document.getElementById('bg-music').play().catch(()=>{}); // تشغيل المزيكا
        startStoryAI();
    } else {
        document.getElementById('pass-error').innerText = "الباسورد غلط.. ركزي يا حنين 🙂";
    }
}

function startStoryAI() {
    typeLive("ai-text", "سؤالنا الأول يا ستي.. إمتى اتعرفنا على بعض أول مرة؟ فاكرة ولا كالعادة نسيتي؟ 🙂");
}

async function checkAnswer() {
    let input = document.getElementById('ans-input');
    let text = input.value.trim();
    if (!text) return;

    input.disabled = true;
    document.getElementById('send-btn').disabled = true;
    document.getElementById('ai-text').innerText = "بيشوف الهبد بتاعك...";

    try {
        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userAnswer: text, correctAnswer: "سنتين", question: "إمتى اتعرفنا؟" })
        });
        const data = await res.json();
        let reply = data.reply;

        if (reply.includes("[صح]")) {
            typeLive("ai-text", reply.replace("[صح]", "") + " ✨.. انزلي شوفي الصور اللي فتحتلك!", () => {
                document.getElementById('gallery-section').classList.remove('locked');
            });
        } else {
            typeLive("ai-text", reply, () => { 
                input.disabled = false; 
                document.getElementById('send-btn').disabled = false;
                input.focus();
            });
        }
    } catch (e) {
        typeLive("ai-text", "النت علق للحظة.. قولي تاني؟ 🙂", () => { input.disabled = false; });
    }
}

function typeLive(id, text, callback) {
    let el = document.getElementById(id);
    el.innerText = "";
    let i = 0;
    function t() {
        if (i < text.length) {
            el.innerText += text.charAt(i);
            i++;
            setTimeout(t, 40);
        } else {
            document.getElementById('ans-input').disabled = false;
            document.getElementById('send-btn').disabled = false;
            if (callback) callback();
        }
    }
    t();
}
