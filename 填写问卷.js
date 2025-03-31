window.onload = function () {
    const t1 = localStorage.getItem("writeTittle");
    if (t1) {
        const t2 = JSON.parse(t1);
        const savedQuestionnaireData = localStorage.getItem(t2);
        if (savedQuestionnaireData) {
            const questionnaireObj = JSON.parse(savedQuestionnaireData);
            const title = questionnaireObj.tittle;
            const questions = questionnaireObj.questions;
            const questionContainer = document.querySelector('.question');
            const titleElement = document.querySelector('.tittle');

            titleElement.innerHTML = `<h2>${title}</h2>`;
            renderQuestions(questions, questionContainer);
            setupQuestionEvents();
            setupSubmitButton(t2, questions);
        } else {
            console.log('未找到保存的问卷数据');
        }
    }

    function renderQuestions(questions, container) {
        let questionDetails = "";
        questions.forEach((question, index) => {
            const questionType = question.type;
            const questionText = question.questionText;
            const questionOptions = question.questionOptions || [];
            const isRequired = questionType === 'inputText' && question.questionOptions[0].isMustAnswer;

            questionDetails += `<p>${index + 1}.<strong>${questionText}</strong>`;

            if (isRequired) {
                questionDetails += '<span class="required-label" style="color: red; margin-left: 10px;">[必答]</span>';
            }

            questionDetails += '</p>';

            if (questionType === 'singleChoice') {
                let optionLetter = 'A';
                questionOptions.forEach((option, optIndex) => {
                    questionDetails += `<button class="radio-option" data-question="${index + 1}" data-option="${optIndex}"></button>${optionLetter}. ${option.text}<br>`;
                    optionLetter = String.fromCharCode(optionLetter.charCodeAt(0) + 1);
                });
                questionDetails += '<br>';
            } else if (questionType === 'multipleChoice') {
                let optionLetter = 'A';
                questionOptions.forEach((option, optIndex) => {
                    questionDetails += `<button class="checkbox-option" data-question="${index + 1}" data-option="${optIndex}"></button>${optionLetter}. ${option.text}<br>`;
                    optionLetter = String.fromCharCode(optionLetter.charCodeAt(0) + 1);
                });
                questionDetails += '<br>';
            } else {
                questionDetails += `<textarea rows="1" cols="100" class="text-answer" data-question="${index + 1}" ${isRequired ? 'required' : ''}></textarea><br>`;
            }
        });
        container.innerHTML = questionDetails;
    }

    function setupQuestionEvents() {
        document.querySelectorAll('.radio-option').forEach(button => {
            button.addEventListener('click', function () {
                const questionNumber = this.getAttribute('data-question');
                document.querySelectorAll(`.radio-option[data-question='${questionNumber}']`).forEach(otherButton => {
                    otherButton.style.backgroundColor = '';
                });
                this.style.backgroundColor = 'lightblue';
            });
        });

        document.querySelectorAll('.checkbox-option').forEach(button => {
            button.addEventListener('click', function () {
                this.style.backgroundColor = this.style.backgroundColor === 'lightblue' ? '' : 'lightblue';
            });
        });
    }

    function setupSubmitButton(questionnaireTitle, questions) {
        const submitButton = document.getElementById('submitButton');
        submitButton.addEventListener('click', function () {
            const answerMap = {};
            let allRequiredAnswered = true;

            questions.forEach((question, index) => {
                const questionType = question.type;
                const isRequired = questionType === 'inputText' && question.questionOptions[0].isMustAnswer;
                
                if (questionType === 'singleChoice') {
                    const selectedOption = document.querySelector(`.radio-option[data-question='${index + 1}'][style*='lightblue']`);
                    answerMap[index + 1] = selectedOption ? String.fromCharCode(65 + parseInt(selectedOption.getAttribute('data-option'))) : "未作答";
                } else if (questionType === 'multipleChoice') {
                    const selectedOptions = Array.from(document.querySelectorAll(`.checkbox-option[data-question='${index + 1}'][style*='lightblue']`));
                    answerMap[index + 1] = selectedOptions.length ? selectedOptions.map(btn => String.fromCharCode(65 + parseInt(btn.getAttribute('data-option')))).join(',') : "未作答";
                } else {
                    const textarea = document.querySelector(`textarea[data-question='${index + 1}']`);
                    answerMap[index + 1] = textarea.value.trim() || "未作答";

                    if (isRequired && answerMap[index + 1] === "未作答") {
                        allRequiredAnswered = false;
                    }
                }
            });

            if (!allRequiredAnswered) {
                showCustomAlert('请回答所有必填问题！');
                return;
            }

            let historyAnswers = JSON.parse(localStorage.getItem(`historyAnswers_${questionnaireTitle}`)) || [];
            historyAnswers.push(answerMap);
            localStorage.setItem(`historyAnswers_${questionnaireTitle}`, JSON.stringify(historyAnswers));

            showCustomAlert('问卷提交成功！', () => {
                window.location.href = "index.html";
            });
        });
    }

    function showCustomAlert(message, callback) {
        const Dialog = document.getElementById('custom-alert');
        document.getElementById('message').textContent = message;
        document.getElementById('close').addEventListener('click', () => Dialog.close());
        document.getElementById('OK').addEventListener('click', () => {
            Dialog.close();
            if (callback) callback();
        });
        Dialog.showModal();
    }
};
