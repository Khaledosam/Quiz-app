let countSpan = document.querySelector(".count span");
let questionArea = document.querySelector(".question-area");
let answerArea = document.querySelector(".answer-area");
let spanContainer = document.querySelector(".span-container");
let submitButton = document.querySelector(".submit-button");
let bullets = document.querySelector(".bullets");
let countdownn = document.querySelector(".count-down");
let ResultContainer = document.querySelector(".results");
console.log(ResultContainer);

let currentIndex = 0;
let therightanswer = 0;
let countDownInterval;

function question() {
  let myRequest = new XMLHttpRequest();
  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let qObject = JSON.parse(this.responseText);
      let qCount = qObject.length;

      //create question count span
      let countText = document.createTextNode(qCount);
      countSpan.appendChild(countText);
      // console.log(qCount);
      //create question
      getQuestion(qObject[currentIndex], qCount);
      countdown(5, qCount);
      // onclick
      submitButton.onclick = () => {
        let rightanswer = qObject[currentIndex].right_answer;
        currentIndex++;
        checkanswer(rightanswer, qCount);
        console.log(rightanswer);
        questionArea.innerHTML = "";
        answerArea.innerHTML = "";
        getQuestion(qObject[currentIndex], qCount);
        handlebullets(qCount);
        clearInterval(countDownInterval);
        countdown(5, qCount);
        showResult(qCount);
      };

      //create bullets
      for (let i = 0; i < qCount; i++) {
        let bulletSpan = document.createElement("span");
        spanContainer.appendChild(bulletSpan);
        if (i === 0) {
          bulletSpan.className = "on";
        }
      }
    }
  };
  myRequest.open("Get", "html_questions.json", true);
  myRequest.send();
}
question();

function getQuestion(obj, count) {
  if (currentIndex < count) {
    let qTitle = document.createElement("h2");
    let qText = document.createTextNode(obj["title"]);
    qTitle.appendChild(qText);
    questionArea.appendChild(qTitle);

    for (let i = 1; i <= 4; i++) {
      //create main div answer
      let mainDiv = document.createElement("div");
      mainDiv.className = "answer";
      answerArea.appendChild(mainDiv);
      //create input
      let inputRadio = document.createElement("input");
      inputRadio.name = "question";
      inputRadio.type = "radio";
      inputRadio.id = `answer_${i}`;
      inputRadio.dataset.answer = obj[`answer_${i}`];
      mainDiv.appendChild(inputRadio);
      //create label
      let label = document.createElement("label");
      label.htmlFor = `answer_${i}`;
      labelText = document.createTextNode(obj[`answer_${i}`]);
      label.appendChild(labelText);
      mainDiv.appendChild(label);
      //checked first input
      if (i === 1) {
        inputRadio.checked = true;
      }
    }
  }
}

function handlebullets(count) {
  let bulletsspans = document.querySelectorAll(".bullets .span-container span");
  let arraybullets = Array.from(bulletsspans);

  arraybullets.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "on";
    }
  });

  console.log(arraybullets);
}
function checkanswer(ranswer, count) {
  let answers = document.getElementsByName("question");
  let chosenanswer;
  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      chosenanswer = answers[i].dataset.answer;
      console.log(chosenanswer);
    }
    if (ranswer === chosenanswer) {
      therightanswer++;
    }
  }
}

function showResult(count) {
  let theresult;
  if (currentIndex === count) {
    questionArea.remove();
    answerArea.remove();
    submitButton.remove();
    bullets.remove();
  }
  if (therightanswer === count) {
    theresult = `<span class"perfect">perfect</span>,you answered all questions`;
  } else if (therightanswer > count / 2 && therightanswer < count) {
    theresult = `<span class"good">good</span>,you answered ${therightanswer} from${count}`;
  } else {
    theresult = `<span class"bad">bad</span>,you answered ${therightanswer} from${count}`;
  }
  ResultContainer.innerHTML = theresult;
}

function countdown(duration, count) {
  if (currentIndex < count) {
    let minites, seconds;
    countDownInterval = setInterval(() => {
      minites = parseInt(duration / 60);
      seconds = parseInt(duration % 60);
      minites = minites < 10 ? `0${minites}` : minites;
      seconds = seconds < 10 ? `0${seconds}` : seconds;
      if (--duration < 0) {
        clearInterval(countDownInterval);
        submitButton.onclick();
      }

      countdownn.innerHTML = `${minites}:${seconds}`;
    }, 1000);
  }
}
