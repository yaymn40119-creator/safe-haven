let currentStage = 1;
let finalVerdictText = "";

function nextStage(stageNum) {
    document.getElementById(`stage-${currentStage}`).classList.replace('active-stage', 'hidden-stage');
    document.getElementById(`stage-${stageNum}`).classList.replace('hidden-stage', 'active-stage');
    currentStage = stageNum;
}

async function submitToAI(stageNum, scenario) {
    let input = document.getElementById(`ans-${stageNum}`);
    let text = input.value.trim();
    if (!text) return;

    input.disabled = true;
    let replyBox = document.getElementById(`ai-reply-${stageNum}`);
    replyBox.innerText = "سينباي يحلل ردك... 👾";

    try {
        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userAnswer: text, scenario: scenario })
        });
        const data = await res.json();
        let reply = data.reply;

        // لو ده آخر سؤال، بنحفظ النتيجة للآخر
        if (stageNum === 3) {
             finalVerdictText = reply;
             typeLive(replyBox, "أوه.. فهمت شخصيتك. تعالي شوفي النتيجة النهائية! ➡️", () => {
                 setTimeout(() => {
                     showFinalResult();
                 }, 2000);
             });
        } else {
            typeLive(replyBox, reply + " (اضغطي عشان تكملي) ➡️", () => {
                replyBox.onclick = () => nextStage(stageNum + 1);
            });
        }

    } catch (e) {
        replyBox.innerText = "حدث خطأ في الاتصال بالخادم.. حاولي مرة أخرى.";
        input.disabled = false;
    }
}

function showFinalResult() {
    nextStage('final');
    document.getElementById('final-score').innerText = finalVerdictText;
}

function typeLive(element, text, callback) {
    element.innerText = "";
    let i = 0;
    function t() {
        if (i < text.length) {
            element.innerText += text.charAt(i);
            i++;
            setTimeout(t, 40);
        } else if (callback) callback();
    }
    t();
}
