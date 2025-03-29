window.onload = function () {
    const t1 = localStorage.getItem("writeButton");
    if (t1) {
        const t2 = JSON.parse(t1);
        const savedQuestionnaireData = localStorage.getItem(t2);
        if (savedQuestionnaireData) {
            // 将获取到的 JSON 格式字符串数据解析为 JavaScript 对象
            const questionnaireObj = JSON.parse(savedQuestionnaireData);
            const title = questionnaireObj.tittle;
            const questions = questionnaireObj.questions;
            let questionDetails = "";
            // 遍历问卷中的每一个问题
            questions.forEach((question, index) => {
                const questionType = question.type;
                const questionText = question.questionText;
                const questionOptions = question.questionOptions || [];
                
                questionDetails += `${index + 1}.<strong>${questionText}</strong></p>`;

                if (questionType ==='singleChoice') {
                    let optionLetter = 'A';
                    // 遍历单选题的每个选项
                    questionOptions.forEach((option) => {
                        questionDetails += `   <button class="radio-option" data-question="${index + 1}">  </button>${optionLetter}. ${option.text}<br>`;
                        optionLetter = String.fromCharCode(optionLetter.charCodeAt(0) + 1);
                    });
                    questionDetails += '<br>';
                } else if (questionType ==='multipleChoice') {
                    let optionLetter = 'A';
                    // 遍历多选题的每个选项
                    questionOptions.forEach((option) => {
                        questionDetails += `<button class="checkbox-option" data-question="${index + 1}"></button>${optionLetter}. ${option.text}<br>`;
                        optionLetter = String.fromCharCode(optionLetter.charCodeAt(0) + 1);
                    });
                    questionDetails += '<br>';
                } else {
                    const isMustAnswer = questionOptions[0].isMustAnswer;
                    questionDetails += `<span style="color: ${isMustAnswer? 'green' :'red'}">此题${isMustAnswer? '是' : '不是'}必填题</span><br>`;

                    // 如果是文本输入类型的问题，拼接文本输入框
                    questionDetails += `<textarea rows="1" cols="100" data-question="${index + 1}"></textarea><br>`;
                }
            });

            const Tittle = document.querySelector('.tittle');
            const Question = document.querySelector('.question');
            if (Tittle) {
                // 将问卷标题设置到页面的相应元素中
                Tittle.innerHTML = `<h2>${title}</h2>`;
            }
            // 将拼接好的问题详情添加到页面的问题展示区域
            Question.innerHTML += questionDetails;

            const radioButtons = document.querySelectorAll('.radio-option');
            radioButtons.forEach(button => {
            button.addEventListener('click', function () {
                // 当点击单选按钮时，清除其他单选按钮的背景色，并将其checked属性设为false
                radioButtons.forEach(otherButton => {
                    if (otherButton!== button) {
                        otherButton.style.backgroundColor = '';
                        otherButton.checked = false;
                    }
                });
                // 设置当前点击的单选按钮背景色为淡蓝色，并将其checked属性设为true
                button.style.backgroundColor = 'lightblue';
                button.checked = true;
                });
            });

            const checkboxButtons = document.querySelectorAll('.checkbox-option');
            checkboxButtons.forEach(button => {
                button.addEventListener('click', function () {
                    // 当点击多选按钮时，切换其背景色
                    if (button.style.backgroundColor === 'lightblue') {
                        button.style.backgroundColor = '';
                    } else {
                        button.style.backgroundColor = 'lightblue';
                    }
                });
            });

            const submitButton = document.getElementById('submitButton');
            submitButton.addEventListener('click', function () {
                //构建用于存储答案的 Map
                const answerMap = new Map();
                questions.forEach((question, index) => {
                    const questionType = question.type;
                    const questionOptions = question.questionOptions || [];
                    if (questionType ==='singleChoice') {
                        const selectedOption = Array.from(radioButtons).find(button => {
                            return button.style.backgroundColor === 'lightblue';
                        });
                        const selectedOptionLetter = String.fromCharCode(65 + Array.from(radioButtons).indexOf(selectedOption));
                        answerMap.set(index + 1, selectedOptionLetter);
                    } else if (questionType ==='multipleChoice') {
                        const selectedOptions = Array.from(checkboxButtons).filter(button => button.style.backgroundColor === 'lightblue');
                        let selectedOptionLetters = "";
                        selectedOptions.forEach(button => {
                            const optionLetter = String.fromCharCode(65 + Array.from(checkboxButtons).indexOf(button));
                            selectedOptionLetters += optionLetter;
                        });
                        answerMap.set(index + 1, selectedOptionLetters);
                    } else {
                        const textarea = document.querySelector(`textarea[data-question="${index + 1}"]`);
                        if (textarea.value === "") {
                            answerMap.set(index + 1, "未作答");
                        } else {
                            answerMap.set(index + 1, "已作答");
                        }
                    }
                });

                // 将答案Map转换为数组
                const answerArray = [];
                answerMap.forEach((value, key) => {
                    answerArray.push({ question: key, answer: value });
                });

                //存储到本地存储中
                let historyAnswers = JSON.parse(localStorage.getItem('historyAnswers')) || [];
                historyAnswers.push(answerArray);
                localStorage.setItem('historyAnswers', JSON.stringify(historyAnswers));

                // 调用函数显示自定义提示框
                showCustomAlert('问卷提交成功！');
            });
        } else {
            console.log('未找到保存的问卷数据');
        }

        const CloseButton = document.getElementById('close');
        const OK1 = document.getElementById('OK');
        const Dialog = document.getElementById('custom-alert');
        const Message = document.getElementById('message');
        const currentDate = new Date().toISOString().split('T')[0];

        function showCustomAlert(message) {
            Message.textContent = message; // 将 message 内容设置到 Message 元素中
            CloseButton.addEventListener('click', () => {
                Dialog.close();
            });
            OK1.addEventListener('click', () => {
                Dialog.close();
            });
            Dialog.showModal();
        }
    }
}
