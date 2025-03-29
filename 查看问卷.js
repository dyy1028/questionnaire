window.onload = function (){
    const t1 = localStorage.getItem("viewTittle");
    if (t1) {
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
                questionDetails += `${index + 1}.<strong>${questionText}</strong>`;
                // 新增代码，处理文本题是否必填信息展示
                if (questionType === "inputText") {
                    const isMustAnswer = questionOptions[0].isMustAnswer;
                    questionDetails += `<span style="color: ${isMustAnswer? 'green' :'red'}">此题${isMustAnswer? '是' : '不是'}必填题</span><br>`;
                }
                if (questionOptions.length > 0) {
                    let optionLetter = 'A';
                    questionOptions.forEach((option) => {
                        if (questionType ==='singleChoice') {
                            questionDetails += `<br>   <button class="radio-option">  </button>${optionLetter}. ${option.text}<br>`;
                        } else if (questionType ==='multipleChoice') {
                            questionDetails += `<br><button class="checkbox-option"></button>${optionLetter}. ${option.text}<br>`;
                        }
                        optionLetter = String.fromCharCode(optionLetter.charCodeAt(0) + 1);
                    });
                    questionDetails += '<br>';
                }
        
                
        
            });
            // 获取展示信息的div元素
            const Tittle = document.querySelector('.tittle');
            const Question = document.querySelector('.question');
            // Tittle.textContent=tittle;
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
                button.classList.toggle('checked');
                button.style.backgroundColor = button.classList.contains('checked')? 'lightblue' : '';
            });
        });
    }
};

