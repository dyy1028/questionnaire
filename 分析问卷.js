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
                        optionCounts[optionLetter] = 0; // 先初始化选项数量为 0
                        optionLetter = String.fromCharCode(optionLetter.charCodeAt(0) + 1);
                    });
                }

                // **右侧：图表**
                const chartContainer = document.createElement('div');
                chartContainer.style.width = "50%";
                chartContainer.style.display = "flex";
                chartContainer.style.justifyContent = "center";
                chartContainer.style.alignItems = "center";

                const canvas = document.createElement('canvas');
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
                                    let trimmedChar = char.trim();
                                    if (optionCounts.hasOwnProperty(trimmedChar)) {
                                        optionCounts[trimmedChar]++;
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
                let dataValues = labels.map(option => optionCounts[option] || 0);
                let bgColor = [
                    'rgba(13, 22, 107, 0.5)',
                    'rgba(73, 141, 187, 0.5)',
                    'rgba(105, 66, 177, 0.5)',
                    'rgba(123, 148, 39, 0.5)',
                    'rgba(255, 159, 64, 0.5)',
                    'rgba(255, 99, 132, 0.5)'
                ];
                let chartType = question.type === 'multipleChoice' ? 'pie' : 'bar';

                if (question.type === 'inputText') {
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
                    chartType = 'bar';
                }

                // **渲染图表**
                new Chart(ctx, {
                    type: chartType,
                    data: {
                        labels: labels,
                        datasets: [{
                            data: dataValues,
                            backgroundColor: bgColor,
                        }],
                    },
                    options: {
                        responsive: false,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { display: question.type === 'multipleChoice' }, // 只有多选题显示图例
                            tooltip: { enabled: true },
                        },
                        scales: question.type === 'multipleChoice' ? {} : { // **多选题不显示坐标轴**
                            x: { display: true },
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    stepSize: 1,
                                    callback: function(value) {
                                        return Number.isInteger(value) ? value : null;
                                    }
                                }
                            }
                        },
                        animation: {
                            animateRotate: true,
                            animateScale: true
                        }
                    }
                });

                // **在条形图的每个条柱上方标注选项次数**
                if (question.type === 'singleChoice' || question.type === 'inputText') {
                    setTimeout(() => {
                        const chartInstance = Chart.getChart(canvas);
                        const ctx = chartInstance.ctx;
                        ctx.font = "14px Arial";
                        ctx.fillStyle = "#000";
                        ctx.textAlign = "center";

                        chartInstance.data.datasets[0].data.forEach((value, i) => {
                            const meta = chartInstance.getDatasetMeta(0);
                            if (meta.data[i]) {
                                const bar = meta.data[i];
                                const x = bar.x;
                                const y = bar.y - 10;
                                ctx.fillText(value, x, y);
                            }
                        });
                    }, 500);
                }
            });
        } else {
            console.log('未找到保存的问卷数据');
        }
    }
};
