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
            const Question = document.querySelector('.question');
            
            questions.forEach((question, index) => {
                const questionDiv = document.createElement('div');
                questionDiv.classList.add('question-item');
                questionDiv.innerHTML = `<p><strong>${index + 1}. ${question.questionText}</strong></p>`;
                
                let optionLetter = 'A';
                question.questionOptions?.forEach((option) => {
                    questionDiv.innerHTML += `<p>${optionLetter}. ${option.text}</p>`;
                    optionLetter = String.fromCharCode(optionLetter.charCodeAt(0) + 1);
                });
                
                const chartContainer = document.createElement('div');
                chartContainer.classList.add('chart-container');
                const canvas = document.createElement('canvas');
                chartContainer.appendChild(canvas);
                questionDiv.appendChild(chartContainer);
                
                Question.appendChild(questionDiv);
                
                const ctx = canvas.getContext('2d');
                canvas.width = 250;
                canvas.height = 250;
                
                // 统计答案数据
                const optionCounts = {};
                historyAnswers.forEach(answerSet => {
                    const userAnswer = answerSet[index + 1];
                    if (userAnswer) {
                        if (question.type === 'multipleChoice') {
                            userAnswer.split(',').forEach(char => {
                                optionCounts[char] = (optionCounts[char] || 0) + 1;
                            });
                        } else {
                            optionCounts[userAnswer] = (optionCounts[userAnswer] || 0) + 1;
                        }
                    }
                });
                
                let chartType = 'bar';
                let labels = Object.keys(optionCounts);
                let dataValues = Object.values(optionCounts);
                let bgColor = ['rgba(13, 22, 107, 0.5)', 'rgba(73, 141, 187, 0.5)', 'rgba(105, 66, 177, 0.5)', 'rgba(123, 148, 39, 0.5)'];
                
                if (question.type === 'multipleChoice') {
                    chartType = 'pie';
                } else if (question.type === 'text') {
                    let textCounts = { '已作答': 0, '未作答': 0 };
                    historyAnswers.forEach(answerSet => {
                        const userAnswer = answerSet[index + 1];
                        if (userAnswer && userAnswer !== '未作答') {
                            textCounts['已作答']++;
                        } else {
                            textCounts['未作答']++;
                        }
                    });
                    labels = Object.keys(textCounts);
                    dataValues = Object.values(textCounts);
                    bgColor = ['rgba(255, 99, 132, 0.5)', 'rgba(54, 162, 235, 0.5)'];
                }
                
                new Chart(ctx, {
                    type: chartType,
                    data: {
                        labels: labels,
                        datasets: [{
                            label: '选择次数',
                            data: dataValues,
                            backgroundColor: bgColor,
                        }],
                    },
                    options: {
                        responsive: false,
                        maintainAspectRatio: false
                    }
                });
            });
        } else {
            console.log('未找到保存的问卷数据');
        }
    }
};
