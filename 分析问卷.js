window.onload = function () {
    const t1 = localStorage.getItem("analyTittle");
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
                questionWrapper.style.padding = "15px 0";

                // **左侧：题目 + 选项**
                const questionDiv = document.createElement('div');
                questionDiv.style.width = "50%";
                questionDiv.innerHTML = `<p style="font-weight: bold; font-size: 16px;">${index + 1}. ${question.questionText}</p>`;

                let optionLetter = 'A';
                let optionLabels = [];
                let optionCounts = {};

                if (question.type === 'singleChoice' || question.type === 'multipleChoice') {
                    question.questionOptions?.forEach((option) => {
                        questionDiv.innerHTML += `<p>${optionLetter}. ${option.text}</p>`;
                        optionLabels.push(optionLetter);
                        optionCounts[optionLetter] = 0; // 初始化选项数量
                        optionLetter = String.fromCharCode(optionLetter.charCodeAt(0) + 1);
                    });
                }

                // **右侧：图表**
                const chartContainer = document.createElement('div');
                chartContainer.style.width = "50%";
                chartContainer.style.display = "flex";
                chartContainer.style.flexDirection = "column"; // **多选题要显示文本统计**
                chartContainer.style.alignItems = "center";

                const legendContainer = document.createElement('div'); // **用于标注选项颜色和次数**
                legendContainer.style.display = "flex";
                legendContainer.style.flexWrap = "wrap";
                legendContainer.style.justifyContent = "center";
                legendContainer.style.marginBottom = "10px";

                const canvas = document.createElement('canvas');
                chartContainer.appendChild(legendContainer);
                chartContainer.appendChild(canvas);
                questionWrapper.appendChild(questionDiv);
                questionWrapper.appendChild(chartContainer);
                questionContainer.appendChild(questionWrapper);

                const ctx = canvas.getContext('2d');
                canvas.width = 300;
                canvas.height = 250;

                const divider = document.createElement('hr');
                divider.style.border = "1px solid #ddd";
                divider.style.width = "100%";
                divider.style.margin = "15px 0";
                questionContainer.appendChild(divider);

                // **统计答案数据**
                if (question.type === 'singleChoice' || question.type === 'multipleChoice') {
                    historyAnswers.forEach(answerSet => {
                        const userAnswer = answerSet[index + 1];
                        if (userAnswer) {
                            if (question.type === 'multipleChoice') {
                                userAnswer.split(',').forEach(char => {
                                    if (optionCounts.hasOwnProperty(char)) {
                                        optionCounts[char]++;
                                    }
                                });
                            } else {
                                if (optionCounts.hasOwnProperty(userAnswer)) {
                                    optionCounts[userAnswer]++;
                                }
                            }
                        }
                    });
                }

                let labels = optionLabels;
                let dataValues = labels.map(letter => optionCounts[letter] || 0);
                let bgColor = ['rgba(13, 22, 107, 0.5)', 'rgba(73, 141, 187, 0.5)', 'rgba(105, 66, 177, 0.5)', 'rgba(123, 148, 39, 0.5)'];
                let chartType = 'bar';

                if (question.type === 'multipleChoice') {
                    // **多选题不显示 Y 轴，在旁边显示各选项的数量**
                    canvas.style.display = "none"; // **隐藏图表**
                    labels.forEach((letter, i) => {
                        let optionItem = document.createElement('p');
                        optionItem.style.color = bgColor[i];
                        optionItem.style.fontSize = "16px";
                        optionItem.style.margin = "0 10px";
                        optionItem.innerHTML = `${letter} 选项：${optionCounts[letter]} 次`;
                        legendContainer.appendChild(optionItem);
                    });
                } else if (question.type === 'inputText') {
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

                if (question.type !== 'multipleChoice') {
                    labels.forEach((letter, i) => {
                        let optionItem = document.createElement('p');
                        optionItem.style.color = bgColor[i];
                        optionItem.style.fontSize = "16px";
                        optionItem.style.margin = "0 10px";
                        optionItem.innerHTML = `${letter} 选项：${optionCounts[letter]} 次`;
                        legendContainer.appendChild(optionItem);
                    });

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
                            maintainAspectRatio: false,
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    ticks: {
                                        stepSize: 1,  // **Y 轴刻度强制为整数**
                                        callback: function(value) {
                                            return Number.isInteger(value) ? value : null;
                                        }
                                    }
                                }
                            }
                        }
                    });
                }
            });
        } else {
            console.log('未找到保存的问卷数据');
        }
    }
};
