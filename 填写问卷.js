window.onload = function () {
    const t1 = localStorage.getItem("writeButton");
    if (t1) {
        const t2 = JSON.parse(t1);
        const savedQuestionnaireData = localStorage.getItem(t2);
        if (savedQuestionnaireData) {
            const questionnaireObj = JSON.parse(savedQuestionnaireData);
            const title = questionnaireObj.tittle;
            const questions = questionnaireObj.questions;
            let questionDetails = "";

            questions.forEach((question, index) => {
                const questionType = question.type;
                const questionText = question.questionText;
                const questionOptions = question.questionOptions || [];

                questionDetails += `<p>${index + 1}. <strong>${questionText}</strong></p>`;

                if (questionType === 'singleChoice') {
                    let optionLetter = 'A';
                    questionOptions.forEach((option, optionIndex) => {
                        questionDetails += `
                            <input type="radio" name="question_${index}" value="${optionLetter}" id="q${index}_${optionIndex}">
                            <label for="q${index}_${optionIndex}">${optionLetter}. ${option.text}</label><br>
                        `;
                        optionLetter = String.fromCharCode(optionLetter.charCodeAt(0) + 1);
                    });
                    questionDetails += '<br>';
                } else if (questionType === 'multipleChoice') {
                    let optionLetter = 'A';
                    questionOptions.forEach((option, optionIndex) => {
                        questionDetails += `
                            <input type="checkbox" name="question_${index}" value="${optionLetter}" id="q${index}_${optionIndex}">
                            <label for="q${index}_${optionIndex}">${optionLetter}. ${option.text}</label><br>
                        `;
                        optionLetter = String.fromCharCode(optionLetter.charCodeAt(0) + 1);
                    });
                    questionDetails += '<br>';
                } else {
                    const isMustAnswer = questionOptions[0]?.isMustAnswer || false;
                    questionDetails += `<span style="color: ${isMustAnswer ? 'green' : 'red'}">此题${isMustAnswer ? '是' : '不是'}必填题</span><br>`;
                    questionDetails += `<textarea rows="1" cols="100" data-question="${index + 1}"></textarea><br>`;
                }
            });

            document.querySelector('.tittle').innerHTML = `<h2>${title}</h2>`;
            document.querySelector('.question').innerHTML += questionDetails;

            document.getElementById('submitButton').addEventListener('click', function () {
                const answerMap = new Map();

                questions.forEach((question, index) => {
                    const questionType = question.type;
                    if (questionType === 'singleChoice') {
                        const selectedOption = document.querySelector(`input[name="question_${index}"]:checked`);
                        answerMap.set(index + 1, selectedOption ? selectedOption.value : "未作答");
                    } else if (questionType === 'multipleChoice') {
                        const selectedOptions = document.querySelectorAll(`input[name="question_${index}"]:checked`);
                        let selectedValues = Array.from(selectedOptions).map(opt => opt.value).join(", ");
                        answerMap.set(index + 1, selectedValues || "未作答");
                    } else {
                        const textarea = document.querySelector(`textarea[data-question="${index + 1}"]`);
                        answerMap.set(index + 1, textarea.value.trim() ? textarea.value : "未作答");
                    }
                });

                const answerArray = [];
                answerMap.forEach((value, key) => {
                    answerArray.push({ question: key, answer: value });
                });

                let historyAnswers = JSON.parse(localStorage.getItem('historyAnswers')) || [];
                historyAnswers.push(answerArray);
                localStorage.setItem('historyAnswers', JSON.stringify(historyAnswers));

                showCustomAlert('问卷提交成功！');
            });
        }
    }

    function showCustomAlert(message) {
        document.getElementById('message').textContent = message;
        document.getElementById('custom-alert').showModal();
        document.getElementById('close').addEventListener('click', () => document.getElementById('custom-alert').close());
        document.getElementById('OK').addEventListener('click', () => document.getElementById('custom-alert').close());
    }
};
