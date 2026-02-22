let userName = "";

// سحر اللمس
document.addEventListener('touchmove', createDust);
document.addEventListener('mousemove', createDust);

function createDust(e) {
    let x = e.touches ? e.touches[0].clientX : e.clientX;
    let y = e.touches ? e.touches[0].clientY : e.clientY;
    let dust = document.createElement('div');
    dust.className = 'magic-dust';
    dust.style.left = x + 'px'; dust.style.top = y + 'px';
    document.body.appendChild(dust);
    setTimeout(() => dust.remove(), 1000); 
}

// التنقل والاسم
function goTo(screenId) {
    document.querySelectorAll('.app-screen').forEach(s => { s.classList.remove('active'); s.classList.add('hidden-next'); });
    document.getElementById(screenId).classList.remove('hidden-next');
    document.getElementById(screenId).classList.add('active');
}

function saveName() {
    let input = document.getElementById('user-name-input').value.trim();
    if(input === "") { alert("اكتبي اسمك الأول عشان نتعرف 🤍"); return; }
    userName = input;
    document.getElementById('greeting-text').innerText = `أهلاً بيكي يا ${userName} ✨`;
    document.getElementById('lofi-radio').classList.remove('hidden-element');
    goTo('screen-mood');
}

// تغيير المود
function setMood(mood, moodText, themeClass) {
    document.getElementById('body-bg').className = themeClass;
    document.getElementById('hub-greeting').innerText = `أنا معاكي يا ${userName} 🤍`;
    document.getElementById('chat-header-title').innerText = `فضفضي يا ${userName}.. أنا سامعك`;
    goTo('screen-hub');

    let msg = "";
    if(mood === 'sad') msg = `عارف إنك "${moodText}"، وإن الدنيا ممكن تكون جاية عليكي حبتين يا ${userName}. بس أنا هنا عشان أسمعك وأشيل عنك.. خدي نفس عميق وكل حاجة هتتعدل.`;
    else if(mood === 'anxious') msg = `التفكير الكتير متعب، وعارف إنك "${moodText}". بس إنتِ قوية وعديتي بالأصعب يا ${userName}.. حطي همومك هنا وافصلي شوية.`;
    else msg = `إنتِ في مكانك الآمن يا ${userName}.. مساحة معمولة مخصوص عشان تدلعك وتسمعك من غير أي أحكام. ✨`;

    document.getElementById('mood-response').innerHTML = "";
    let iIdx = 0;
    function typeMood() {
        if(iIdx < msg.length) {
            document.getElementById('mood-response').innerHTML += msg.charAt(iIdx);
            iIdx++; setTimeout(typeMood, 40);
        }
    }
    setTimeout(typeMood, 500);
}

// صندوق حرق الزعل
function burnText() {
    let textarea = document.getElementById('burn-textarea');
    let btn = document.getElementById('burn-btn');
    let msg = document.getElementById('burn-msg');
    
    if(textarea.value.trim() === "") return;
    textarea.disabled = true; btn.classList.add('hidden-element'); textarea.classList.add('burn-animation');

    setTimeout(() => {
        textarea.value = ""; textarea.classList.remove('burn-animation'); textarea.disabled = false;
        msg.innerText = `تم تبخير كل الطاقة السلبية يا ${userName}! إنتِ أقوى من أي زعل 🦋✨`;
        msg.classList.remove('hidden-element');
        setTimeout(() => { msg.classList.add('hidden-element'); btn.classList.remove('hidden-element'); }, 4000);
    }, 2000);
}

// الشات المتصل بالذكاء الاصطناعي 🧠
function handleEnter(e) { if(e.key === 'Enter') sendMessage(); }

window.onload = () => {
    let history = document.getElementById('chat-history');
    history.innerHTML = `<div class="bot-msg">أهلاً بيكي.. المكان هنا سرك ومحدش هيحكم عليكي. إيه اللي مزعلك النهاردة؟</div>`;
}

async function sendMessage() {
    let inputField = document.getElementById('chat-input');
    let text = inputField.value.trim();
    if(!text) return;
    
    let history = document.getElementById('chat-history');
    let userDiv = document.createElement('div');
    userDiv.className = 'user-msg'; userDiv.innerText = text;
    history.appendChild(userDiv);
    inputField.value = ""; history.scrollTop = history.scrollHeight;
    inputField.disabled = true;

    let typingDiv = document.createElement('div');
    typingDiv.className = 'bot-msg'; typingDiv.innerText = "بيكتب...";
    history.appendChild(typingDiv); history.scrollTop = history.scrollHeight;

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text, userName: userName })
        });
        const data = await response.json();
        history.removeChild(typingDiv);
        showBotReply(data.reply);
    } catch (error) {
        history.removeChild(typingDiv);
        showBotReply("في مشكلة في الاتصال يا " + userName + "، خدي نفس عميق وجربي تاني 🤍");
    }
}

function showBotReply(responseText) {
    let history = document.getElementById('chat-history');
    let botDiv = document.createElement('div'); 
    botDiv.className = 'bot-msg'; 
    history.appendChild(botDiv);
    
    let charIdx = 0;
    function typeReply() {
        if(charIdx < responseText.length) {
            botDiv.innerHTML += responseText.charAt(charIdx); charIdx++;
            history.scrollTop = history.scrollHeight; setTimeout(typeReply, 30);
        } else {
            document.getElementById('chat-input').disabled = false;
            document.getElementById('chat-input').focus();
        }
    }
    typeReply();
}

// الراديو
let audio = document.getElementById('radio-audio');
let playing = false;
function toggleRadio() {
    if(playing) { audio.pause(); document.querySelector('.play-btn').innerText = "▶"; } 
    else { audio.play().catch(e => {}); document.querySelector('.play-btn').innerText = "⏸"; }
    playing = !playing;
}
function changeMusic() {
    let val = document.getElementById('music-select').value;
    let src = document.getElementById('audio-src');
    if(val === 'rain') src.src = "https://files.catbox.moe/rain.mp3"; 
    else if(val === 'piano') src.src = "https://files.catbox.moe/piano.mp3";
    else src.src = "https://files.catbox.moe/lofi.mp3";
    audio.load(); if(playing) audio.play();
}
