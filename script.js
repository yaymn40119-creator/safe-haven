// باسورد الدخول للموقع
const CORRECT_PASS = "2026"; 

// الأسئلة والأجوبة التجريبية (تقدر تغيرها براحتك بعدين)
const GAME_LEVELS = [
    { 
        question: "سؤالنا الأول يا ستي.. إمتى اتعرفنا على بعض أول مرة؟ فكرا ولا نسيتي؟ 🙂", 
        answer: "سنتين", 
        memoryImage: "https://files.catbox.moe/w2e9j8.jpg" // لينك صورة عشوائية تظهر لما تجاوب صح
    },
    { 
        question: "ماشي يا ستي طلعتي شاطرة في الأولى.. طب إيه أكتر حاجة أنا بحبها فيكي؟", 
        answer: "ضحكتي", 
        memoryImage: "https://files.catbox.moe/5m9v3d.jpg"
    },
    { 
        question: "طب سؤال أخير بقى عشان نقفل الخزنة.. أنا بحبك قد إيه؟", 
        answer: "قد الدنيا", 
        memoryImage: "https://files.catbox.moe/q9a8z7.jpg"
    }
];

let currentLevel = localStorage.getItem('havenLevel') ? parseInt(localStorage.getItem('havenLevel')) : 0;
let isUnlocked = localStorage.getItem('havenUnlocked') === 'true';

window.onload = () => {
    if (isUnlocked) {
        unlockUI();
    }
};

function checkPassword() {
    let pass = document.getElementById('password-input').value;
    if (pass === CORRECT_PASS) {
        localStorage.setItem('havenUnlocked', 'true');
        unlockUI();
    } else {
        document.getElementById('pass-error').innerText = "الباسورد غلط يا حنين، ركزي! 🙂";
    }
}

function unlockUI() {
    document.getElementById('lock-screen').classList.replace('active-screen', 'hidden-screen');
    document.getElementById('main-app').classList.replace('hidden-screen', 'active-screen');
    loadMemories();
    askCurrentQuestion();
}

// تحميل الذكريات اللي كسبتها قبل كده
function loadMemories() {
    let gallery = document.getElementById('memories-gallery');
    if (currentLevel > 0) {
        document.getElementById('gallery-empty').style.display = 'none';
        gallery.innerHTML = '';
        for (let i = 0; i < currentLevel; i++) {
            if(GAME_LEVELS[i]) {
                gallery.innerHTML += `<img src="${GAME_LEVELS[i].memoryImage}" class="memory-img">`;
            }
        }
    }
}

// الذكاء الاصطناعي بيكتب السؤال
function askCurrentQuestion() {
    if (currentLevel >= GAME_LEVELS.length) {
        typeLiveText("كده إنتي نجحتي في كل الاختبارات وفتحتيلك كل الذكريات.. بحبك يا حنين 🤍✨");
        return;
    }
    let qText = GAME_LEVELS[currentLevel].question;
    typeLiveText(qText);
}

function handleEnter(e) { if (e.key === 'Enter' && !document.getElementById('send-btn').disabled) sendAnswer(); }

async function sendAnswer() {
    let inputField = document.getElementById('answer-input');
    let btn = document.getElementById('send-btn');
    let answerText = inputField.value.trim();
    if (!answerText) return;

    inputField.value = "";
    inputField.disabled = true;
    btn.disabled = true;
    
    // يوسف (الذكاء الاصطناعي) بيفكر في الرد
    document.getElementById('ai-text').innerText = "بيشوف الإجابة...";

    let levelData = GAME_LEVELS[currentLevel];

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                userAnswer: answerText, 
                correctAnswer: levelData.answer,
                question: levelData.question
            })
        });
        const data = await response.json();
        let aiReply = data.reply;

        // بنشوف لو الذكاء الاصطناعي اقتنع إن الإجابة صح (بيبعت كلمة [صح] في أخر كلامه)
        if (aiReply.includes("[صح]")) {
            aiReply = aiReply.replace("[صح]", "").trim(); // بنشيل الكلمة السرية عشان متظهرش
            currentLevel++;
            localStorage.setItem('havenLevel', currentLevel);
            loadMemories();
            typeLiveText(aiReply, () => {
                setTimeout(askCurrentQuestion, 3000); // يسأل السؤال اللي بعده بعد 3 ثواني
            });
        } else {
            // لو جاوبت غلط، هيكتبلها الرد المستفز ويرجع يفتح الإدخال تاني
            typeLiveText(aiReply, () => {
                inputField.disabled = false;
                btn.disabled = false;
                inputField.focus();
            });
        }

    } catch (e) {
        typeLiveText("النت علق للحظة.. قولي تاني كده؟", () => {
            inputField.disabled = false;
            btn.disabled = false;
        });
    }
}

// سحر الـ Live Typing المطور
function typeLiveText(text, callback) {
    let box = document.getElementById('ai-text');
    box.innerText = "";
    let i = 0;
    function type() {
        if (i < text.length) {
            box.innerText += text.charAt(i);
            i++;
            setTimeout(type, 30); // سرعة الكتابة
        } else {
            let inputField = document.getElementById('answer-input');
            let btn = document.getElementById('send-btn');
            // لو لسه في أسئلة، يفتح الإدخال لحنين
            if(currentLevel < GAME_LEVELS.length) {
                inputField.disabled = false;
                btn.disabled = false;
                inputField.focus();
            }
            if(callback) callback();
        }
    }
    type();
}

function resetGame() {
    if(confirm('عايز تصفر الخزنة وترجعها من الصفر؟ (عشان تجرب إنت)')) {
        localStorage.removeItem('havenLevel');
        localStorage.removeItem('havenUnlocked');
        location.reload();
    }
}
