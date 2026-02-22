const API_URL = "/api/chat";
const CORRECT_PASS = "2026";

function unlockSite() {
    let pass = document.getElementById('password-input').value;
    if (pass === CORRECT_PASS) {
        document.getElementById('lock-screen').style.display = 'none';
        document.getElementById('story-content').style.display = 'block';
        window.scrollTo(0, 0);
        startAI();
    } else {
        document.getElementById('pass-error').innerText = "الباسورد غلط.. ركزي 🙂";
    }
}

function startAI() {
    typeText("ai-q1", "سؤالنا الأول يا ستي.. إمتى اتعرفنا على بعض أول مرة؟ فاكرة ولا كالعادة نسيتي؟ 🙂");
}

async function checkAI(level) {
    let input = document.getElementById('ans1');
    let text = input.value.trim();
    if (!text) return;

    input.disabled = true;
    document.getElementById('ai-q1').innerText = "بيشوف الهبد بتاعك...";

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                userAnswer: text, 
                correctAnswer: "سنتين", 
                question: "إمتى اتعرفنا؟" 
            })
        });
        const data = await res.json();
        let reply = data.reply;

        if (reply.includes("[صح]")) {
            typeText("ai-q1", reply.replace("[صح]", "") + " ✨.. كملي انزلي لتحت شوفي المفاجأة.");
            document.getElementById('gallery-section').classList.remove('locked');
            document.getElementById('final-section').classList.remove('locked');
        } else {
            typeText("ai-q1", reply, () => { input.disabled = false; input.focus(); });
        }
    } catch (e) {
        typeText("ai-q1", "في مشكلة في النت.. قولي تاني؟ 🙂");
        input.disabled = false;
    }
}

function typeText(id, text, callback) {
    let el = document.getElementById(id);
    el.innerText = "";
    let i = 0;
    function t() {
        if (i < text.length) {
            el.innerText += text.charAt(i);
            i++;
            setTimeout(t, 40);
        } else if (callback) callback();
    }
    t();
}
