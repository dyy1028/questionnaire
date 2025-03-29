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
                
                questionDetails += `${index + 1}.<strong>${questionText}</strong></p>`;

                if (questionType === 'singleChoice') {
                    let optionLetter = 'A';
                    questionOptions.forEach((option, optionIndex) => {
                        questionDetails += `<button class="radio-option" data-question="${index + 1}" data-option="${optionIndex}"></button>${optionLetter}. ${option.text}<br>`;
                        optionLetter = String.fromCharCode(optionLetter.charCodeAt(0) + 1);
                    });
                    questionDetails += '<br>';
                } else if (questionType === 'multipleChoice') {
                    let optionLetter = 'A';
                    questionOptions.forEach((option, optionIndex) => {
                        questionDetails += `<button class="checkbox-option" data-question="${index + 1}" data-option="${optionIndex}"></button>${optionLetter}. ${option.text}<br>`;
                        optionLetter = String.fromCharCode(optionLetter.charCodeAt(0) + 1);
                    });
                    questionDetails += '<br>';
                } else {
                    questionDetails += `<textarea rows="1" cols="100" data-question="${index + 1}"></textarea><br>`;
                }
            });

            document.querySelector('.tittle').innerHTML = `<h2>${title}</h2>`;
            document.querySelector('.question').innerHTML += questionDetails;

            const radioButtons = document.querySelectorAll('.radio-option');
            radioButtons.forEach(button => {
                button.addEventListener('click', function () {
                    const questionNumber = button.getAttribute("data-question");
                    radioButtons.forEach(otherButton => {
                        if (otherButton.getAttribute("data-question") === questionNumber) {
                            otherButton.style.backgroundColor = '';
                        }
                    });
                    button.style.backgroundColor = 'lightblue';
                });
            });

            const checkboxButtons = document.querySelectorAll('.checkbox-option');
            checkboxButtons.forEach(button => {
                button.addEventListener('click', function () {
                    button.style.backgroundColor = button.style.backgroundColor === 'lightblue' ? '' : 'lightblue';
                });
            });

            document.getElementById('submitButton').addEventListener('click', function () {
                const answerMap = new Map();
                
                questions.forEach((question, index) => {
                    const questionNumber = index + 1;
                    if (question.type === 'singleChoice') {
                        const selectedOption = document.querySelector(`.radio-option[data-question="${questionNumber}"][style*='lightblue']`);
                        if (selectedOption) {
                            const optionIndex = selectedOption.getAttribute("data-option");
                            answerMap.set(questionNumber, String.fromCharCode(65 + parseInt(optionIndex)));
                        } else {
                            answerMap.set(questionNumber, "未作答");
                        }
                    } else if (question.type === 'multipleChoice') {
                        const selectedOptions = document.querySelectorAll(`.checkbox-option[data-question="${questionNumber}"][style*='lightblue']`);
                        let selectedOptionLetters = Array.from(selectedOptions).map(button => {
                            return String.fromCharCode(65 + parseInt(button.getAttribute("data-option")));
                        }).join('');
                        answerMap.set(questionNumber, selectedOptionLetters || "未作答");
                    } else {
                        const textarea = document.querySelector(`textarea[data-question="${questionNumber}"]`);
                        answerMap.set(questionNumber, textarea.value.trim() || "未作答");
                    }
                });
                
                const answerArray = Array.from(answerMap, ([question, answer]) => ({ question, answer }));
                let historyAnswers = JSON.parse(localStorage.getItem('historyAnswers')) || [];
                historyAnswers.push(answerArray);
                localStorage.setItem('historyAnswers', JSON.stringify(historyAnswers));
                showCustomAlert('问卷提交成功！');
            });
        } else {
            console.log('未找到保存的问卷数据');
        }

        const Dialog = document.getElementById('custom-alert');
        const Message = document.getElementById('message');
        
        function showCustomAlert(message) {
            Message.textContent = message;
            Dialog.showModal();
            document.getElementById('close').addEventListener('click', () => Dialog.close());
            document.getElementById('OK').addEventListener('click', () => Dialog.close());
        }
    }
}
