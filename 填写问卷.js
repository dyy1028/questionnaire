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
                
                questionDetails += `<p>${index + 1}.<strong>${questionText}</strong></p>`;

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
                    questionDetails += `<textarea rows="1" cols="100" data-question="${index + 1}"></textarea><br>`;
                }
            });

            document.querySelector('.tittle').innerHTML = `<h2>${title}</h2>`;
            document.querySelector('.question').innerHTML += questionDetails;

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

            document.getElementById('submitButton').addEventListener('click', function () {
                const answerMap = {};
                
                questions.forEach((question, index) => {
                    const questionType = question.type;
                    if (questionType === 'singleChoice') {
                        const selectedOption = document.querySelector(`.radio-option[data-question='${index + 1}'][style*='lightblue']`);
                        answerMap[index + 1] = selectedOption ? String.fromCharCode(65 + parseInt(selectedOption.getAttribute('data-option'))) : "未作答";
                    } else if (questionType === 'multipleChoice') {
                        const selectedOptions = Array.from(document.querySelectorAll(`.checkbox-option[data-question='${index + 1}'][style*='lightblue']`));
                        answerMap[index + 1] = selectedOptions.length ? selectedOptions.map(btn => String.fromCharCode(65 + parseInt(btn.getAttribute('data-option')))).join(',') : "未作答";
                    } else {
                        const textarea = document.querySelector(`textarea[data-question='${index + 1}']`);
                        answerMap[index + 1] = textarea.value.trim() || "未作答";
                    }
                });

                let historyAnswers = JSON.parse(localStorage.getItem('historyAnswers')) || [];
                historyAnswers.push(answerMap);
                localStorage.setItem('historyAnswers', JSON.stringify(historyAnswers));

                showCustomAlert('问卷提交成功！');
            });
        } else {
            console.log('未找到保存的问卷数据');
        }
    }

    function showCustomAlert(message) {
        const Dialog = document.getElementById('custom-alert');
        document.getElementById('message').textContent = message;
        document.getElementById('close').addEventListener('click', () => Dialog.close());
        document.getElementById('OK').addEventListener('click', () => Dialog.close());
        Dialog.showModal();
    }
};
