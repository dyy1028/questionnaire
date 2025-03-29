window.onload = function () {
    const t1 = localStorage.getItem("publicTittle");
    if(t1) {
        const t2 = JSON.parse(t1);
        const savedQuestionnaireData = localStorage.getItem(t2);
        if (savedQuestionnaireData) {
        // 将获取到的JSON字符串解析为JavaScript对象
        const questionnaireObj = JSON.parse(savedQuestionnaireData);
        // 获取问卷标题
        const title = questionnaireObj.tittle;
        // 获取题目数组
        const questions = questionnaireObj.questions;
        // 可以进一步遍历题目数组获取每个题目的具体信息，比如题目类型、题目文本、选项等
        let questionDetails = "";
        questions.forEach((question, index) => {
            const questionType = question.type;
            const questionText = question.questionText;
            const questionOptions = question.questionOptions;
            questionDetails += `${index + 1}.<strong>${questionText}</strong></p >`;

            if (questionType === "inputText") {
                const isMustAnswer = questionOptions[0].isMustAnswer;
                questionDetails += `<span style="color: ${isMustAnswer? 'green' :'red'}">此题${isMustAnswer? '是' : '不是'}必填题</span><br>`;
            }

            if (questionOptions.length > 0) {
            let optionLetter = 'A';
            questionOptions.forEach((option) => {
                if (questionType ==='singleChoice') {
                    questionDetails += `   <button class="radio-option">  </button>${optionLetter}. ${option.text}<br>`;
                } else if (questionType ==='multipleChoice') {
                    questionDetails += `<button class="checkbox-option"></button>${optionLetter}. ${option.text}<br>`;
                }
                optionLetter = String.fromCharCode(optionLetter.charCodeAt(0) + 1);
            });
            questionDetails += '<br>';
        }
        });

        // 获取展示信息的div元素
        const Tittle = document.querySelector('.tittle');
        const Question = document.querySelector('.question');
        //Tittle.textContent=tittle;
        if (Tittle) {
            Tittle.innerHTML = `<h2>${title}</h2>`;
        }
        Question.innerHTML += questionDetails;
        // 为单选按钮添加点击事件，实现单选逻辑（简单示例，可按需完善）
        const radioButtons = document.querySelectorAll('.radio-option');
        radioButtons.forEach(button => {
            button.addEventListener('click', function () {
                radioButtons.forEach(otherButton => {
                    if (otherButton!== button) {
                        otherButton.style.backgroundColor = '';
                    }
                });
                button.style.backgroundColor = 'lightblue';
            });
        });
        } else {
        console.log('未找到保存的问卷数据');
        }

        // 为多选按钮添加点击事件，实现多选逻辑（简单示例，可按需完善）
        const checkboxButtons = document.querySelectorAll('.checkbox-option');
        checkboxButtons.forEach(button => {
            button.addEventListener('click', function () {
                if (button.style.backgroundColor === 'lightblue') {
                    button.style.backgroundColor = '';
                } else {
                    button.style.backgroundColor = 'lightblue';
                }
            });
        });

        //截止日期和发布按钮
        const deadlineInput = document.getElementById('deadline');
        const publishButton = document.getElementById('publishButton');
        //提示框
        const CloseButton = document.getElementById('close');
        const OK1 = document.getElementById('OK');
        const Dialog = document.getElementById('custom-alert');
        const Message = document.getElementById('message');
        const currentDate = new Date().toISOString().split('T')[0];

        deadlineInput.setAttribute('min', currentDate);
        publishButton.addEventListener('click', publishQuestionaire);

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


        //当点击“发布问卷”时，如果截止日期早于当前日期或为空，则需要提示修改截止日期
        function publishQuestionaire() {
            const tittle = document.querySelector('.tittle').value;
            const deadline = deadlineInput.value;
            if (!deadline || deadline < currentDate) {
                showCustomAlert('问卷保存失败！截止日期不能早于当前日期或为空');
                return;
            }
            const isoString = new Date;
            const chinaTime = new Date(isoString.getTime() - 8 * 60 * 60 * 1000);
            const dateObj = new Date(chinaTime);
            const year = dateObj.getFullYear();
            const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
            const day = dateObj.getDate().toString().padStart(2, '0');
            const hours = dateObj.getHours().toString().padStart(2, '0');
            const minutes = dateObj.getMinutes().toString().padStart(2, '0');
            const seconds = dateObj.getSeconds().toString().padStart(2, '0');
            const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
            const savedQuestionnaireData = localStorage.getItem(`${tittle}`);
            if (savedQuestionnaireData) {
                // 将获取到的JSON字符串解析为JavaScript对象
                const questionnaireObj = JSON.parse(savedQuestionnaireData);
                // 添加发布时间和发布状态属性到原对象
                questionnaireObj.publishTime = formattedDate;
                questionnaireObj.publishStatus = "发布中";
                localStorage.setItem(`${tittle}`, JSON.stringify(questionnaireObj));
                
            }
            showCustomAlert('问卷已发布状态为“发布中”！');
        }
    }
}