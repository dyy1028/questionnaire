// 点击事件，改变标题输入框背景颜色
const inputBox = document.querySelector('.tittle');
inputBox.addEventListener('click', function () {
    inputBox.style.backgroundColor = 'yellow';
});
inputBox.addEventListener('blur', function () {
    inputBox.style.backgroundColor = 'rgb(208, 233, 204)';
});

// 添加问题按钮点击事件
const addButton = document.querySelector('.addQuest');
const QuestStyle = document.querySelector('.QuestStyle');
addButton.addEventListener('click', function () {
    addButton.style.display = 'none';
    QuestStyle.style.display = 'flex';
});

// 截止日期和发布按钮
const deadlineInput = document.getElementById('deadline');
const publishButton = document.getElementById('publishButton');
const currentDate = new Date().toISOString().split('T')[0];
deadlineInput.setAttribute('min', currentDate);

// 保存按钮
const saveButton = document.getElementById('saveButton');
saveButton.addEventListener('click', saveQuestionnaire);
publishButton.addEventListener('click', publishQuestionaire);

// 当单选题按钮被点击
const SingleButton = document.querySelector('.Single');
SingleButton.addEventListener('click', function () {
    const TiHao = document.querySelectorAll('.AllQuest').length + 1;
    const newQuest = createQuestion(TiHao, 'singleChoice');
    const add = newQuest.querySelector('.addOption');
    add.addEventListener('click', function () {
        addOption(newQuest, 'radio');
    });
    setupQuestionButtons(newQuest, TiHao);
    const containBox = document.querySelector('.contain');
    containBox.appendChild(newQuest);
});

// 当多选题按钮被点击
const DuoButton = document.querySelector('.Duoxuan');
DuoButton.addEventListener('click', function () {
    const TiHao = document.querySelectorAll('.AllQuest').length + 1;
    const newQuest = createQuestion(TiHao, 'multipleChoice');
    const add = newQuest.querySelector('.addOption');
    add.addEventListener('click', function () {
        addOption(newQuest, 'checkbox');
    });
    setupQuestionButtons(newQuest, TiHao);
    const containBox = document.querySelector('.contain');
    containBox.appendChild(newQuest);
});

// 当文本题按钮被点击
const TxtButton = document.querySelector('.Txt');
TxtButton.addEventListener('click', function () {
    const TiHao = document.querySelectorAll('.AllQuest').length + 1;
    const newQuest = createQuestion(TiHao, 'inputText');
    setupQuestionButtons(newQuest, TiHao);
    const containBox = document.querySelector('.contain');
    containBox.appendChild(newQuest);
});


function createQuestion(tihao, questionType) {
    const newQuest = document.createElement('div');
    newQuest.className = 'AllQuest';
    newQuest.id = `question-${tihao}`;

    // 创建题号和输入框的盒子
    const tittle = document.createElement('div');
    tittle.className = 'Question';
    tittle.style.display = 'flex';
    tittle.style.alignItems = 'center';

    tittle.innerHTML = `<span class="question-number">${tihao}.</span>`;

    // 创建文本框，用于输入题目
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = '输入题目';
    input.className = 'inputTiMu';
    input.id = questionType;
    tittle.appendChild(input);

    if (questionType === 'inputText') {
        // 此题是否必答
        const checkboxDiv = document.createElement('div');
        checkboxDiv.className = 'checkbox_div';
        checkboxDiv.style.marginLeft = '10px'; // 右侧间距

        const MustInput = document.createElement('input');
        MustInput.type = 'checkbox';
        MustInput.id = `must-answer-${tihao}`;

        const label = document.createElement('label');
        label.textContent = '此题是否必答';
        label.setAttribute('for', `must-answer-${tihao}`);

        checkboxDiv.appendChild(MustInput);
        checkboxDiv.appendChild(label);
        tittle.appendChild(checkboxDiv);
    }

    newQuest.appendChild(tittle);

    if (questionType !== 'inputText') {
        // 创建添加选项按钮
        const add = document.createElement('button');
        add.className = 'addOption';
        add.textContent = '添加选项';
        tittle.appendChild(add);
    }

    return newQuest;
}

function setupQuestionButtons(questionDiv, tihao) {
    // 创建上移、下移、复用、删除按钮
    const ButtonDiv = document.createElement('div');
    ButtonDiv.className = 'ButtonDiv';

    const upMove = document.createElement('button');
    upMove.textContent = '上移';
    upMove.className = 'up';
    if (tihao === 1) {
        upMove.disabled = true;
    }

    const downMove = document.createElement('button');
    downMove.textContent = '下移';
    downMove.className = 'down';

    const reuse = document.createElement('button');
    reuse.textContent = '复用';
    reuse.className = 'reuse';

    const deleteButton = document.createElement('button');
    deleteButton.textContent = '删除';
    deleteButton.className = 'delete';

    ButtonDiv.appendChild(upMove);
    ButtonDiv.appendChild(downMove);
    ButtonDiv.appendChild(reuse);
    ButtonDiv.appendChild(deleteButton);
    questionDiv.appendChild(ButtonDiv);

    // 为上移按钮添加点击事件
    upMove.addEventListener('click', function () {
        const prevQuestion = questionDiv.previousElementSibling;
        if (prevQuestion) {
            const containBox = document.querySelector('.contain');
            containBox.insertBefore(questionDiv, prevQuestion);
            updateQuestionNumbers();
        }
    });

    // 为下移按钮添加点击事件
    downMove.addEventListener('click', function () {
        const nextQuestion = questionDiv.nextElementSibling;
        if (nextQuestion) {
            const containBox = document.querySelector('.contain');
            containBox.insertBefore(nextQuestion, questionDiv);
            updateQuestionNumbers();
        }
    });

    // 为复用按钮添加点击事件
    reuse.addEventListener('click', function () {
        const newTiHao = getNextQuestionNumber();
        // 复制题目内容，不包含按钮
        const newQuest = createQuestion(newTiHao, questionDiv.querySelector('.inputTiMu').id);
        const originalInput = questionDiv.querySelector('.inputTiMu');
        const newInput = newQuest.querySelector('.inputTiMu');
        newInput.value = originalInput.value;

        const originalOptions = questionDiv.querySelectorAll('.optionDiv');
        const buttonDiv = newQuest.querySelector('.ButtonDiv');
        originalOptions.forEach((originalOption, index) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'optionDiv';

            const input = document.createElement('input');
            input.type = originalOption.querySelector('input').type;
            input.name = `option-${newQuest.id}`;
            input.value = String.fromCharCode(index + 65);

            const label = document.createElement('label');
            label.textContent = String.fromCharCode(index + 65) + '.';

            const optionInput = document.createElement('input');
            optionInput.type = 'text';
            optionInput.className = 'optionInput';
            optionInput.value = originalOption.querySelector('.optionInput').value;

            const deleteButton = document.createElement('button');
            deleteButton.textContent = '删除';
            deleteButton.className = 'deleteButton';

            optionDiv.appendChild(input);
            optionDiv.appendChild(label);
            optionDiv.appendChild(optionInput);
            optionDiv.appendChild(deleteButton);

            newQuest.insertBefore(optionDiv, buttonDiv);

            // 为当前题目下新添加的删除按钮添加点击事件监听器，点击时删除对应的选项盒子
            deleteButton.addEventListener('click', function () {
                const parentBox = this.parentNode;
                parentBox.remove();
            });
        });

        // 复制文本题必答状态
        if (questionDiv.querySelector('.checkbox_div')) {
            const originalCheckbox = questionDiv.querySelector('.checkbox_div input[type="checkbox"]');
            const newCheckbox = newQuest.querySelector('.checkbox_div input[type="checkbox"]');
            newCheckbox.checked = originalCheckbox.checked;
        }

        const containBox = document.querySelector('.contain');
        containBox.insertBefore(newQuest, questionDiv.nextElementSibling);
        setupQuestionButtons(newQuest, newTiHao);
        updateQuestionNumbers();
    });

    // 为删除按钮添加点击事件
    deleteButton.addEventListener('click', function () {
        questionDiv.remove();
        updateQuestionNumbers();
    });
}

function addOption(questionDiv, inputType) {
    // 获取该题目下已有的选项数量，根据数量确定下一个选项字母
    const options = questionDiv.querySelectorAll(`input[type="${inputType}"]`);

    const optionDiv = document.createElement('div');
    optionDiv.className = 'optionDiv';

    const input = document.createElement('input');
    input.type = inputType;
    input.name = `option-${questionDiv.id}`;
    input.value = String.fromCharCode(options.length + 65);

    const label = document.createElement('label');
    label.textContent = String.fromCharCode(options.length + 65) + '.';

    const optionInput = document.createElement('input');
    optionInput.type = 'text';
    optionInput.className = 'optionInput';

    const deleteButton = document.createElement('button');
    deleteButton.textContent = '删除';
    deleteButton.className = 'deleteButton';

    optionDiv.appendChild(input);
    optionDiv.appendChild(label);
    optionDiv.appendChild(optionInput);
    optionDiv.appendChild(deleteButton);

    const buttonDiv = questionDiv.querySelector('.ButtonDiv');
    questionDiv.insertBefore(optionDiv, buttonDiv);

    // 为当前题目下新添加的删除按钮添加点击事件监听器，点击时删除对应的选项盒子
    deleteButton.addEventListener('click', function () {
        const parentBox = this.parentNode;
        parentBox.remove();
    });
}

function updateQuestionNumbers() {
    const questions = document.querySelectorAll('.AllQuest');
    questions.forEach((question, index) => {
        const questionNumber = question.querySelector('.question-number');
        questionNumber.textContent = `${index + 1}.`;
        question.id = `question-${index + 1}`;
        const upButton = question.querySelector('.up');
        if (index === 0) {
            upButton.disabled = true;
        } else {
            upButton.disabled = false;
        }
    });
}

function getNextQuestionNumber() {
    const questions = document.querySelectorAll('.AllQuest');
    return questions.length + 1;
}

// 保存问卷
function saveQuestionnaire() {
    const tittle = document.querySelector('.tittle').value;
    let questions = [];

    const newQuests = document.querySelectorAll('.AllQuest');
    newQuests.forEach((newQuest) => {
        const questionType = newQuest.querySelector('.inputTiMu').id;
        const questionText = newQuest.querySelector('.inputTiMu').value;

        // 为每个题目创建独立的选项数组，用于存储该题目的选项信息
        let questionOptions = [];
        if (questionType === "singleChoice" || questionType === "multipleChoice") {
            const optionDivs2 = newQuest.querySelectorAll('.optionDiv');
            optionDivs2.forEach((optionDiv) => {
                const optionText = optionDiv.querySelector('.optionInput').value;
                questionOptions.push({
                    text: optionText
                });
            });
        } else {
            // 获得此问题是否必答复选框状态
            const mustAnswerCheckbox = newQuest.querySelector('.checkbox_div input[type="checkbox"]');
            const isMustAnswer = mustAnswerCheckbox? mustAnswerCheckbox.checked : false;
            questionOptions.push({
                isMustAnswer: isMustAnswer
            });
        }
        questions.push({
            type: questionType,
            questionText: questionText,
            questionOptions
        });
    });

    if (!tittle || questions.length === 0) {
        showCustomAlert('问卷保存失败！请检查问卷/问题/选项是否为空');
        return;
    }

    const isoString = new Date();
    const chinaTime = new Date(isoString.getTime() - 8 * 60 * 60 * 1000);
    const dateObj = new Date(chinaTime);
    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObj.getDate().toString().padStart(2, '0');
    const hours = dateObj.getHours().toString().padStart(2, '0');
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    const seconds = dateObj.getSeconds().toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    const questionnaireData = {
        tittle: tittle,
        questions,
        deadline: document.getElementById('deadline').value,
        savatime: formattedDate
    };

    const originalTitle = JSON.parse(localStorage.getItem("editTittle"));
    if (originalTitle) {
        localStorage.removeItem(originalTitle);
    }
    localStorage.setItem(tittle, JSON.stringify(questionnaireData));
    localStorage.setItem("editTittle", JSON.stringify(tittle));
    showCustomAlert('问卷已成功保存');
}

// 当点击“发布问卷”时，如果截止日期早于当前日期或为空，则需要提示修改截止日期
function publishQuestionaire() {
    const tittle = document.querySelector('.tittle').value;
    const deadline = document.getElementById('deadline').value;
    const currentDate = new Date().toISOString().split('T')[0];
    if (!deadline || deadline < currentDate) {
        showCustomAlert('问卷保存失败！截止日期不能早于当前日期或为空');
        return;
    }
    saveQuestionnaire();
    const isoString = new Date();
    const chinaTime = new Date(isoString.getTime() - 8 * 60 * 60 * 1000);
    const dateObj = new Date(chinaTime);
    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObj.getDate().toString().padStart(2, '0');
    const hours = dateObj.getHours().toString().padStart(2, '0');
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    const seconds = dateObj.getSeconds().toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    const savedQuestionnaireData = localStorage.getItem(tittle);
    if (savedQuestionnaireData) {
        // 将获取到的JSON字符串解析为JavaScript对象
        const questionnaireObj = JSON.parse(savedQuestionnaireData);
        // 添加发布时间和发布状态属性到原对象
        questionnaireObj.publishTime = formattedDate;
        questionnaireObj.publishStatus = "发布中";
        localStorage.setItem(tittle, JSON.stringify(questionnaireObj));
        showCustomAlert('问卷已发布,状态为“发布中”！');
    }
    OK1.addEventListener('click', () => {
        window.location.href = 'index.html';  // Redirect to index.html
    });
}

// 提示框
const CloseButton = document.getElementById('close');
const OK1 = document.getElementById('OK');
const Dialog = document.getElementById('custom-alert');
const Message = document.getElementById('message');

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
