window.onload = function (){
    const t1 = localStorage.getItem("analyButton");
    if (t1) {
        const t2 = JSON.parse(t1);
        // 从本地存储获取历史答案数据
        const historyAnswers = JSON.parse(localStorage.getItem('historyAnswers')) || [];

        if (historyAnswers.length > 0) {
            // 用于统计第一题选项选择次数的对象
            let optionCounts = {
                A: 0,
                B: 0,
            };
            historyAnswers.forEach(answerSet => {
                const firstQuestionAnswer = answerSet.find(a => a.question === 1)?.answer;
                if (firstQuestionAnswer) {
                    for (let char of firstQuestionAnswer) {
                        optionCounts[char]++;
                    }
                }
            });
            
            const container = document.getElementById('bar - chart - container');
            const canvas = document.createElement('canvas');
            container.appendChild(canvas);
            const ctx = canvas.getContext('2d');
            canvas.width = 300;
            canvas.height = 200;

            // 定义条形图的属性
            const barWidth = 100;
            const barSpacing = 20;
            const x = (canvas.width - (barWidth * Object.keys(optionCounts).length + barSpacing * (Object.keys(optionCounts).length - 1))) / 2;
            const y = canvas.height - 50;
            const barHeightScale = 20;

            // 绘制条形图前先写上“第1题”
            ctx.fillStyle = 'black';
            ctx.font = '16px Arial';
            ctx.fillText("第1题", x , y - 100);

            // 绘制条形图
            Object.keys(optionCounts).forEach((option, index) => {
            const barHeight = optionCounts[option] * barHeightScale;
            ctx.fillStyle = 'blue';
            ctx.fillRect(x + (barWidth + barSpacing) * index, y - barHeight, barWidth, barHeight);
                
            ctx.fillStyle = 'black';
            ctx.font = '16px Arial';
            ctx.fillText(option, x + (barWidth + barSpacing) * index + barWidth / 2 - 5, y + 20);
            ctx.fillText(optionCounts[option].toString(), x + (barWidth + barSpacing) * index + barWidth / 2 - 5, y - barHeight - 10);
            });
        }

        const savedQuestionnaireData = localStorage.getItem(t2);
        if (savedQuestionnaireData) {
            const questionnaireObj = JSON.parse(savedQuestionnaireData);
            const title = questionnaireObj.tittle;
            const questions = questionnaireObj.questions;

            // 展示问卷题目信息
            const questionDetails = [];
            questions.forEach((question, index) => {
                const questionType = question.type;
                const questionText = question.questionText;
                const questionOptions = question.questionOptions;
                questionDetails.push(`${index + 1}.<strong>${questionText}</strong></p >`);
                if(questionType==='singleChoice' || questionType==='multipleChoice') {
                    if (questionOptions) {
                        let optionLetter = 'A';
                        questionOptions.forEach((option) => {
                            const buttonClass = question.type ==='singleChoice'? 'radio-option' : 'checkbox-option';
                            questionDetails.push(`<button class="${buttonClass}"></button>${optionLetter}. ${option.text}<br>`);
                            optionLetter = String.fromCharCode(optionLetter.charCodeAt(0) + 1);
                        });
                        questionDetails.push('<br>');
                    }
                }
            });

            const Tittle = document.querySelector('.tittle');
            const Question = document.querySelector('.question');
            if (Tittle) {
                Tittle.innerHTML = `<h2>${title}</h2>`;
            }
            Question.innerHTML += questionDetails.join('');

            // 为单选和多选按钮添加点击事件
            const radioButtons = document.querySelectorAll('.radio-option');
            const checkboxButtons = document.querySelectorAll('.checkbox-option');
            const handleButtonClick = (button, otherButtons) => {
                otherButtons.forEach(otherButton => {
                    if (otherButton!== button) {
                        otherButton.style.backgroundColor = '';
                    }
                });
                button.style.backgroundColor = 'lightblue';
            };
            radioButtons.forEach(button => {
                button.addEventListener('click', () => handleButtonClick(button, radioButtons));
            });
            checkboxButtons.forEach(button => {
                button.addEventListener('click', () => {
                    if (button.style.backgroundColor === 'lightblue') {
                        button.style.backgroundColor = '';
                    } else {
                        button.style.backgroundColor = 'lightblue';
                    }
                });
            });

            // 处理多选题统计和绘制扇形图（假设已有 historyAnswers 且长度大于 0）
            if (historyAnswers.length > 0) {
                const optionCountsArray = [];
                questions.forEach(question => {
                    const optionCounts = {};
                    if (question.type ==='multipleChoice') {
                        historyAnswers.forEach(answerSet => {
                            const questionAnswer = answerSet.find(a => a.question === questions.indexOf(question) + 1)?.answer;
                            if (questionAnswer) {
                                for (let char of questionAnswer) {
                                    optionCounts[char] = (optionCounts[char] || 0) + 1;
                                }
                            }
                        });
                    }
                    optionCountsArray.push(optionCounts);
                });

                const container = document.getElementById('bar - chart - container');
                questions.forEach((question, index) => {
                    if (question.type ==='multipleChoice') {
                        const canvas = document.createElement('canvas');
                        container.appendChild(canvas);
                        const ctx = canvas.getContext('2d');
                        canvas.width = 250;
                        canvas.height = 250;

                        // 在扇形图前添加题目序号
                        ctx.fillStyle = 'black';
                        ctx.font = '16px Arial';
                        ctx.fillText(`第2题`, 10, 25);

                        const optionCounts = optionCountsArray[index];
                        const labels = [];
                        const data = [];
                        
                        Object.keys(optionCounts).forEach(option => {
                            labels.push(option);
                            data.push(optionCounts[option]);
                        });

                        new Chart(canvas, {
                            type: 'pie',
                            data: {
                                labels: labels,
                                datasets: [{
                                    label: '选项选择次数',
                                    data: data,
                                    backgroundColor: [
                                        'rgba(13, 22, 107, 0.2)',
                                        'rgba(73, 141, 187, 0.2)',
                                        'rgba(105, 66, 177, 0.2)',
                                        'rgba(123, 148, 39, 0.2)',
                                        'rgba(153, 102, 255, 0.2)',
                                        'rgba(255, 159, 64, 0.2)'
                                    ]
                                }]
                            },
                            options: {
                                responsive: false,
                                maintainAspectRatio: false
                            }
                        });
                    }
                });
            }
        } else {
            console.log('未找到保存的问卷数据');
        }

        if (historyAnswers.length > 0) {
            // 用于统计第三题作答次数的对象
            let optionCounts = {
                已作答: 0,
                未作答: 0,
            };
            historyAnswers.forEach(answerSet => {
                const thirdQuestionAnswer = answerSet.find(a => a.question === 3)?.answer;
                if (thirdQuestionAnswer) {
                    if(thirdQuestionAnswer==="已作答") {
                        optionCounts.已作答++;
                    }
                    else if(thirdQuestionAnswer==="未作答") {
                        optionCounts.未作答++;
                    }
                }
            });

            const container = document.getElementById('bar - chart - container');
            const canvas = document.createElement('canvas');
            container.appendChild(canvas);
            const ctx = canvas.getContext('2d');
            canvas.width = 300;
            canvas.height = 200;

            // 定义条形图的属性
            const barWidth = 100;
            const barSpacing = 20;
            const x = (canvas.width - (barWidth * Object.keys(optionCounts).length + barSpacing * (Object.keys(optionCounts).length - 1))) / 2;
            const y = canvas.height - 50;
            const barHeightScale = 20;

            // 绘制条形图前先写上“第3题”
            ctx.fillStyle = 'black';
            ctx.font = '16px Arial';
            ctx.fillText("第3题", x , y - 100);

            // 绘制条形图
            Object.keys(optionCounts).forEach((option, index) => {
                const barHeight = optionCounts[option] * barHeightScale;
                ctx.fillStyle = 'blue';
                ctx.fillRect(x + (barWidth + barSpacing) * index, y - barHeight, barWidth, barHeight);
                ctx.fillStyle = 'black';
                ctx.font = '16px Arial';
                ctx.fillText(option, x + (barWidth + barSpacing) * index + barWidth / 2 - 5, y + 20);
                ctx.fillText(optionCounts[option].toString(), x + (barWidth + barSpacing) * index + barWidth / 2 - 5, y - barHeight - 10);
            });
        }
    }
}
