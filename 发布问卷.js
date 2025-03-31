window.onload = function () {
    const t1 = localStorage.getItem("publicTittle");
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
                const questionOptions = question.questionOptions;
                questionDetails += `${index + 1}.<strong>${questionText}</strong></p >`;

                if (questionType === "inputText") {
                    const isMustAnswer = questionOptions[0].isMustAnswer;
                    questionDetails += `<span style="color: ${isMustAnswer ? 'green' : 'red'}">此题${isMustAnswer ? '是' : '不是'}必填题</span><br>`;
                }

                if (questionOptions.length > 0) {
                    let optionLetter = 'A';
                    questionOptions.forEach((option) => {
                        if (questionType === 'singleChoice') {
                            questionDetails += `   <button class="radio-option">  </button>${optionLetter}. ${option.text}<br>`;
                        } else if (questionType === 'multipleChoice') {
                            questionDetails += `<button class="checkbox-option"></button>${optionLetter}. ${option.text}<br>`;
                        }
                        optionLetter = String.fromCharCode(optionLetter.charCodeAt(0) + 1);
                    });
                    questionDetails += '<br>';
                }
            });

            const Tittle = document.querySelector('.tittle');
            const Question = document.querySelector('.question');

            if (Tittle) {
                Tittle.innerHTML = `<h2>${title}</h2>`;
            }
            Question.innerHTML += questionDetails;

            const radioButtons = document.querySelectorAll('.radio-option');
            radioButtons.forEach(button => {
                button.addEventListener('click', function () {
                    radioButtons.forEach(otherButton => {
                        if (otherButton !== button) {
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

            const deadlineInput = document.getElementById('deadline');
            const publishButton = document.getElementById('publishButton');
            const CloseButton = document.getElementById('close');
            const OK1 = document.getElementById('OK');
            const Dialog = document.getElementById('custom-alert');
            const Message = document.getElementById('message');
            const currentDate = new Date().toISOString().split('T')[0];

            deadlineInput.setAttribute('min', currentDate);
            publishButton.addEventListener('click', publishQuestionaire);

            function showCustomAlert(message) {
                Message.textContent = message;
                CloseButton.addEventListener('click', () => {
                    Dialog.close();
                });
                OK1.addEventListener('click', () => {
                    Dialog.close();
                });
                Dialog.showModal();
            }

            function publishQuestionaire() {
                const titleElement = document.querySelector('.tittle h2');  // 确保获取的是标题文本
                const tittle = titleElement ? titleElement.innerText : null;
                const deadline = deadlineInput.value;
                
                if (!tittle) {
                    showCustomAlert('问卷标题获取失败！');
                    return;
                }

                if (!deadline || deadline < currentDate) {
                    showCustomAlert('问卷保存失败！截止日期不能早于当前日期或为空');
                    return;
                }

                const dateObj = new Date();
                const year = dateObj.getFullYear();
                const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
                const day = dateObj.getDate().toString().padStart(2, '0');
                const hours = dateObj.getHours().toString().padStart(2, '0');
                const minutes = dateObj.getMinutes().toString().padStart(2, '0');
                const seconds = dateObj.getSeconds().toString().padStart(2, '0');
                const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

                const savedQuestionnaireData = localStorage.getItem(tittle);
                if (savedQuestionnaireData) {
                    const questionnaireObj = JSON.parse(savedQuestionnaireData);
                    questionnaireObj.publishTime = formattedDate;
                    questionnaireObj.publishStatus = "发布中";

                    // 更新本地存储
                    localStorage.setItem(tittle, JSON.stringify(questionnaireObj));
                    localStorage.setItem("publicTittle", JSON.stringify(tittle));
                }

                showCustomAlert('问卷已发布，状态为“发布中”！');
            }
        } else {
            console.log('未找到保存的问卷数据');
        }
    }
};
