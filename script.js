const CORRECT_PASS = "2026"; 

const GAME_LEVELS = [
    { 
        question: "سؤالنا الأول يا ستي.. إمتى اتعرفنا على بعض أول مرة؟ فاكرة ولا نسيتي؟ 🙂", 
        answer: "سنتين", 
        memoryImage: "https://files.catbox.moe/w2e9j8.jpg" 
    },
    { 
        question: "ماشي يا ستي طلعتي شاطرة.. طب إيه أكتر حاجة أنا بحبها فيكي؟ ركزي 🙂", 
        answer: "ضحكتي", 
        memoryImage: "https://files.catbox.moe/5m9v3d.jpg"
    }
];

let currentLevel = localStorage.getItem('havenLevel') ? parseInt(localStorage.getItem('havenLevel')) : 0;
let isUnlocked = localStorage.getItem('havenUnlocked') === 'true';

window.onload = () => { if (isUnlocked) unlockUI(); };

function checkPassword() {
    let pass = document.getElementById('password-input').value;
    if (pass === CORRECT_PASS) {
        localStorage.setItem('havenUnlocked', 'true');
        unlockUI();
    } else {
        document.getElementById('pass-error').innerText = "الباسورد غلط يا حنين.. ركزي! 🙂";
    }
}

function unlockUI() {
    document.getElementById('lock-screen').classList.replace('active-screen', 'hidden-screen');
    document.getElementById('main-app').classList.replace('hidden-screen', 'active-screen');
    loadMemories();
    askCurrentQuestion();
}

function loadMemories() {
    let gallery = document.getElementById('memories-gallery');
    if (currentLevel > 0) {
        document.getElementById('gallery-empty').style.display = 'none';
        gallery.innerHTML = '';
        for (let i = 0; i < currentLevel; i++) {
            if(GAME_LEVELS[i]) gallery.innerHTML += `<img src="${GAME_LEVELS[i].memoryImage}" class="memory-img">`;
        }
    }
}

function askCurrentQuestion() {
    if (currentLevel >= GAME_LEVELS.length) {
        typeLiveText("خلصتي كل الأسئلة يا شطورة.. مفيش ذكريات تانية دلوقتي، بس أنا دايماً جنبك 🤍✨");
        return;
    }
    typeLiveText(GAME_LEVELS[currentLevel].question);
}

function handleEnter(e) { if (e.key === 'Enter' && !document.getElementById('send-btn').disabled) sendAnswer(); }

async function sendAnswer() {
    let inputField = document.getElementById('answer-input');
    let answerText = inputField.value.trim();
    if (!answerText) return;

    inputField.value = "";
    inputField.disabled = true;
    document.getElementById('send-btn').disabled = true;
    document.getElementById('ai-text').innerText = "بيشوف الإجابة...";

    let levelData = GAME_LEVELS[currentLevel];

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userAnswer: answerText, correctAnswer: levelData.answer, question: levelData.question })
        });
        const data = await response.json();
        let aiReply = data.reply;

        if (aiReply.includes("[صح]")) {
            aiReply = aiReply.replace("[صح]", "").trim();
            currentLevel++;
            localStorage.setItem('havenLevel', currentLevel);
            typeLiveText(aiReply, () => { setTimeout(askCurrentQuestion, 3000); loadMemories(); });
        } else {
            typeLiveText(aiReply, () => { 
                inputField.disabled = false; 
                document.getElementById('send-btn').disabled = false; 
                inputField.focus(); 
            });
        }
    } catch (e) {
        typeLiveText("النت علق للحظة.. قولي تاني كده؟ 🙂", () => { inputField.disabled = false; });
    }
}

function typeLiveText(text, callback) {
    let box = document.getElementById('ai-text');
    box.innerText = "";
    let i = 0;
    function type() {
        if (i < text.length) {
            box.innerText += text.charAt(i);
            i++;
            let speed = text.charAt(i-1) === '.' ? 350 : 35;
            setTimeout(type, speed);
        } else if(callback) callback();
    }
    type();
}

function resetGame() { if(confirm('تصفير الخزنة؟')) { localStorage.clear(); location.reload(); } }
