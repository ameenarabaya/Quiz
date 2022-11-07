let countspan = document.querySelector(".count span");
let bulletspan = document.querySelector(".bullets .spans");
let Qplace = document.querySelector(".quiz-area");
let answerplace = document.querySelector('.answer-area');
let submitbutton = document.querySelector(".submit-button");
let bullets = document.querySelector(".bullets");
let resultcontainer = document.querySelector(".result");
let countdownele = document.querySelector(".count-down");

let currentindex = 0;
let rightAnswer = 0;
let countinterval;
function getQuestion() {
    let myrequest = new XMLHttpRequest();
    myrequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let questionsobject = JSON.parse(this.responseText);
            let questioncount = questionsobject.length;
            creatbullets(questioncount);
            AddQuestionData(questionsobject[currentindex], questioncount);
            countdown(10, questioncount);
            submitbutton.onclick = () => {
                // get right answer
                let theRightAnswer = questionsobject[currentindex].right_answer;
                //   console.log(theRightAnswer);
                currentindex++;
                checkanswer(theRightAnswer, questioncount);
                Qplace.innerHTML = "";
                answerplace.innerHTML = "";

                AddQuestionData(questionsobject[currentindex], questioncount);
                clearInterval(countinterval);

                Handlebullets();

                countdown(10, questioncount);
                showresult(questioncount);
            }
        }
    }
    myrequest.open("Get", "html-question.json", true);
    myrequest.send();
}
getQuestion();

function creatbullets(num) {
    countspan.innerHTML = num;
    for (let i = 0; i < num; i++) {
        let span = document.createElement("span");
        if (i === 0) {
            span.className = "on";
        }
        bulletspan.appendChild(span);
    }
};


function AddQuestionData(obj, count) {
    if (currentindex < count) {
        //creat H2 item
        let questiontitle = document.createElement("h2");
        questiontitle.textContent = obj["title"];
        Qplace.appendChild(questiontitle);
        for (let i = 1; i <= 4; i++) {
            let maindiv = document.createElement("div");
            maindiv.className = "answer";
            let radioinput = document.createElement("input");
            // add type + name + id + data-attribute
            radioinput.name = "Question";
            radioinput.type = "radio";
            radioinput.id = `answer_${i}`;
            radioinput.dataset.answer = obj[`answer_${i}`];
            if (i === 1) {
                radioinput.checked = true;
            }
            let thelabel = document.createElement("label");
            thelabel.htmlFor = `answer_${i}`;
            let thelabeltext = document.createTextNode(obj[`answer_${i}`]);
            thelabel.appendChild(thelabeltext);
            maindiv.appendChild(radioinput);
            maindiv.appendChild(thelabel);
            answerplace.appendChild(maindiv);
        }
    }
};
function checkanswer(rAnswer, count) {
    let answers = document.getElementsByName("Question");
    let theChosenAnswer;
    for (let i = 0; i < answers.length; i++) {
        if (answers[i].checked) {
            theChosenAnswer = answers[i].dataset.answer;
        }
    }
    if (rAnswer === theChosenAnswer) {
        rightAnswer++;
    }
};
function Handlebullets() {
    let allbullets = document.querySelectorAll(".bullets .spans span");
    let arrayspan = Array.from(allbullets);
    arrayspan.forEach((span, index) => {
        if (currentindex === index)
            span.className = "on";
    })
};
function showresult(count) {
    let theresult;
    if (currentindex === count) {
        Qplace.remove();
        answerplace.remove();
        submitbutton.remove();
        bullets.remove();

        if (rightAnswer > (count / 2) && rightAnswer < count) {
            theresult = `<span class="good">Good</span> , ${rightAnswer} from ${count} Is Right`;
        } else if (rightAnswer === count) {
            theresult = `<span class="perfect">perfect</span> , ALL answer is Right`;
        } else {
            theresult = `<span class="bad">bad</span> , ${rightAnswer} from ${count} Is Right`;
        }
        resultcontainer.innerHTML = theresult;
        resultcontainer.style.padding = "10px";
        resultcontainer.style.backgroundColor = "white";
        resultcontainer.style.marginTop = "10px";
    }
}

function countdown(duration, count) {
    if (currentindex < count) {
        let minutes, seconds;
        countinterval = setInterval(function () {
            countdownele.style.color = "black";
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);
            minutes = minutes < 10 ? `0${minutes}` : minutes;
            seconds = seconds < 10 ? `0${seconds}` : seconds;
            countdownele.innerHTML = `${minutes}:${seconds}`;
            if (--duration < 0) {
                clearInterval(countinterval);
                submitbutton.click();
            }
            if (seconds <= 05) {
                countdownele.style.color = "red";
            }
        }, 1000)
    }
}