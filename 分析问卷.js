window.onload = function () {
    const t1 = localStorage.getItem("analyButton");
    if (t1) {
        const t2 = JSON.parse(t1);
        const historyAnswers = JSON.parse(localStorage.getItem('historyAnswers')) || [];

        const savedQuestionnaireData = localStorage.getItem(t2);
        if (savedQuestionnaireData) {
            const questionnaireObj = JSON.parse(savedQuestionnaireData);
            const title = questionnaireObj.tittle;
            const questions = questionnaireObj.questions;

            document.querySelector('.tittle').innerHTML = `<h2>${title}</h2>`;
            const questionContainer = document.querySelector('.question');

            questions.forEach((question, index) => {
                const questionWrapper = document.createElement('div');
                questionWrapper.classList.add('question-wrapper');
                questionWrapper.style.display = "flex";
                questionWrapper.style.alignItems = "center";
                questionWrapper.style.justifyContent = "space-between";
                questionWrapper.style.marginBottom = "20px";

                // 左侧题目部分
                const questionDiv = document.createElement('div');
                questionDiv.style.width = "50%";
                questionDiv.innerHTML = `<p><strong>${index + 1}. ${question.questionText}</strong></p>`;

                if (question.type === 'singleChoice' || question.type === 'multipleChoice') {
                    let optionLetter = 'A';
                    question.questionOptions.forEach(option => {
                        questionDiv.innerHTML += `<p>${optionLetter}. ${option.text}</p>`;
                        optionLetter = String.fromCharCode(optionLetter.charCodeAt(0) + 1);
                    });
                }

                // 右侧图表部分
                const chartContainer = document.createElement('div');
                chartContainer.style.width = "50%";
                const canvas = document.createElement('canvas');
                chartContainer.appendChild(canvas);
                questionWrapper.appendChild(questionDiv);
                questionWrapper.appendChild(chartContainer);
                questionContainer.appendChild(questionWrapper);

                const ctx = canvas.getContext('2d');
                canvas.width = 300;
                canvas.height = 250;

                // 统计数据
                const optionCounts = {};
                historyAnswers.forEach(answerSet => {
                    const userAnswer = answerSet[index + 1];

                    if (question.type === 'multipleChoice' && userAnswer !== "未作答") {
                        userAnswer.split(',').forEach(option => {
                            optionCounts[option] = (optionCounts[option] || 0) + 1;
                        });
                    } else if (question.type === 'singleChoice') {
                        optionCounts[userAnswer] = (optionCounts[userAnswer] || 0) + 1;
                    }
                });

                // 生成图表
                if (question.type === 'singleChoice' || question.type === 'multipleChoice') {
                    new Chart(canvas, {
                        type: question.type === 'singleChoice' ? 'bar' : 'pie',
                        data: {
                            labels: Object.keys(optionCounts),
                            datasets: [{
                                label: '选择次数',
                                data: Object.values(optionCounts),
                                backgroundColor: [
                                    'rgba(255, 99, 132, 0.5)',
                                    'rgba(54, 162, 235, 0.5)',
                                    'rgba(255, 206, 86, 0.5)',
                                    'rgba(75, 192, 192, 0.5)'
                                ],
                            }],
                        },
                        options: {
                            responsive: false,
                            maintainAspectRatio: false
                        }
                    });
                }

                // 处理文本题
                if (question.type === 'text') {
                    let textCounts = { '已作答': 0, '未作答': 0 };
                    historyAnswers.forEach(answerSet => {
                        const userAnswer = answerSet[index + 1];
                        if (userAnswer && userAnswer !== "未作答") {
                            textCounts['已作答']++;
                        } else {
                            textCounts['未作答']++;
                        }
                    });

                    new Chart(canvas, {
                        type: 'bar',
                        data: {
                            labels: Object.keys(textCounts),
                            datasets: [{
                                label: '回答情况',
                                data: Object.values(textCounts),
                                backgroundColor: ['rgba(75, 192, 192, 0.5)', 'rgba(255, 99, 132, 0.5)'],
                            }],
                        },
                        options: {
                            responsive: false,
                            maintainAspectRatio: false
                        }
                    });
                }
            });
        } else {
            console.log('未找到保存的问卷数据');
        }
    }
};
