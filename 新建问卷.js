const inputBox = document.querySelector('.tittle');

// 点击事件  
inputBox.addEventListener('click', function () {
    // 改变背景颜色  
    inputBox.style.backgroundColor = 'yellow'; // 可以根据需要选择其它颜色  
});

// 可以选择在失去焦点时恢复背景颜色  
inputBox.addEventListener('blur', function () {
    inputBox.style.backgroundColor = 'rgb(208, 233, 204)'; // 恢复默认背景颜色  
});
const addButton = document.querySelector('.addQuest');
const QuestStyle = document.querySelector('.QuestStyle');
addButton.addEventListener('click', function () {
    //添加问题的按钮被点击时题目类型弹出来
    addButton.style.display = 'none';
    QuestStyle.style.display = 'flex';
});


//截止日期和发布按钮
const deadlineInput = document.getElementById('deadline');
const publishButton = document.getElementById('publishButton');
const currentDate = new Date().toISOString().split('T')[0];
deadlineInput.setAttribute('min', currentDate);

//保存按钮
const saveButton = document.getElementById('saveButton');
saveButton.addEventListener('click', saveQuestionnaire);
publishButton.addEventListener('click', publishQuestionaire);


let TiHao = 0; //记录题号
//当单选题按钮被点击
const containBox = document.querySelector('.contain');
const SingleButton = document.querySelector('.Single');

// 为添加单选题按钮添加点击事件监听器
SingleButton.addEventListener('click', function () {
    TiHao++;
    const newQuest = createQuestion('singleChoice', '输入题目');
    newQuest.id = TiHao;
    const add = newQuest.querySelector('.addOption');
    add.addEventListener('click', function () {
        addOption(newQuest, false);
    });
    handleButtonEvents(newQuest);
    containBox.appendChild(newQuest);
});

//当多选题按钮被点击
const DuoButton = document.querySelector('.Duoxuan');
DuoButton.addEventListener('click', function () {
    TiHao++;
    const newQuest = createQuestion('multipleChoice', '输入题目');
    const add = newQuest.querySelector('.addOption');
    add.addEventListener('click', function () {
        addOption(newQuest, true);
    });
    handleButtonEvents(newQuest);
    containBox.appendChild(newQuest);
});

//当文本题按钮被点击
const TxtButton = document.querySelector('.Txt');
TxtButton.addEventListener('click', function () {
    TiHao++;
    const newQuest = createQuestion('inputText', '输入题目');

    const checkbox = document.createElement('div');
    checkbox.className = 'checkbox_div';

    //此题是否必答
    const MustInput = document.createElement('input');
    MustInput.type = 'checkbox';
    const label = document.createElement('label');
    label.textContent = '此题是否必答'
    const textInput = newQuest.querySelector('.inputTiMu');
    MustInput.addEventListener('change', function () {
        if (this.checked) {
            textInput.required = true;
        } else {
            textInput.required = false;
        }
    });
    checkbox.appendChild(MustInput);
    checkbox.appendChild(label);
    const tittle = newQuest.querySelector('.Question');
    tittle.appendChild(checkbox);

    const answerText = document.createElement('input');
    answerText.type = 'text';
    answerText.className = 'answerText';
    newQuest.insertBefore(answerText, newQuest.querySelector('.ButtonDiv'));

    handleButtonEvents(newQuest);
    containBox.appendChild(newQuest);
});

function createQuestion(type, placeholder) {
    const newQuest = document.createElement('div');
    newQuest.className = 'AllQuest';

    // 创建文本框  
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = placeholder;
    input.className = 'inputTiMu';
    input.id = type;

    //创建题号和输入框的盒子
    const tittle = document.createElement('div');
    tittle.className = 'Question';

    tittle.innerText = (document.querySelectorAll('.AllQuest').length + 1) + '.';
    tittle.appendChild(input);

    // 创建按钮  
    const add = document.createElement('button');
    add.className = 'addOption';
    add.textContent = '添加选项';

    tittle.appendChild(add);
    newQuest.appendChild(tittle);

    //创建上移、下移、复用、删除按钮
    const ButtonDiv = document.createElement('div');
    ButtonDiv.className = 'ButtonDiv';

    const upMove = document.createElement('button');
    upMove.textContent = '上移';
    upMove.className = 'up';
    if (document.querySelectorAll('.AllQuest').length === 1) {
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
    newQuest.appendChild(ButtonDiv);

    return newQuest;
}

function addOption(questionDiv, isMultiple) {
    const optionsContainer = questionDiv.querySelector('.options-container');
    if (!optionsContainer) {
        const container = document.createElement('div');
        container.className = 'options-container';
        questionDiv.insertBefore(container, questionDiv.querySelector('.ButtonDiv'));
    }

    const options = questionDiv.querySelectorAll('.optionDiv');
    const optionDiv = document.createElement('div');
    optionDiv.className = 'optionDiv';

    const inputType = isMultiple ? 'checkbox' : 'radio';
    const radio = document.createElement('input');
    radio.type = inputType;
    radio.name = `option-${questionDiv.id}`;
    radio.value = String.fromCharCode(options.length + 65);

    const label = document.createElement('label');
    label.textContent = String.fromCharCode(options.length + 65) + '.';

    const optionInput = document.createElement('input');
    optionInput.type = 'text';
    optionInput.className = 'optionInput';

    const deleteButton = document.createElement('button');
    deleteButton.textContent = '删除';
    deleteButton.className = 'deleteButton';
    deleteButton.addEventListener('click', function () {
        optionDiv.remove();
    });

    optionDiv.appendChild(radio);
    optionDiv.appendChild(label);
    optionDiv.appendChild(optionInput);
    optionDiv.appendChild(deleteButton);
    optionsContainer.appendChild(optionDiv);
}

// 统一按钮事件处理
function handleButtonEvents(questionDiv) {
    const upMove = questionDiv.querySelector('.up');
    const downMove = questionDiv.querySelector('.down');
    const reuse = questionDiv.querySelector('.reuse');
    const deleteButton = questionDiv.querySelector('.delete');

    upMove.addEventListener('click', function () {
        const prevQuestion = questionDiv.previousElementSibling;
        if (prevQuestion) {
            containBox.insertBefore(questionDiv, prevQuestion);
            if (prevQuestion.querySelector('.up')) {
                prevQuestion.querySelector('.up').disabled = false;
            }
            reNumberQuestions();
        }
    });

    downMove.addEventListener('click', function () {
        const nextQuestion = questionDiv.nextElementSibling;
        if (nextQuestion) {
            containBox.insertBefore(nextQuestion, questionDiv);
            reNumberQuestions();
        }
    });

    reuse.addEventListener('click', function () {
        const clonedQuest = questionDiv.cloneNode(true);
        handleButtonEvents(clonedQuest);
        clonedQuest.querySelectorAll('.optionDiv').forEach(option => {
            option.querySelector('input').value = '';
        });
        containBox.insertBefore(clonedQuest, questionDiv.nextElementSibling);
        reNumberQuestions();
    });

    deleteButton.addEventListener('click', function () {
        questionDiv.remove();
        reNumberQuestions();
    });
}


//保存问卷
function saveQuestionnaire() {
    // 问卷大题目
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
            //获得此问题是否必答复选框状态
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
        deadline: deadlineInput.value,
        savatime: formattedDate
    };
    localStorage.setItem(`${tittle}`, JSON.stringify(questionnaireData));
    showCustomAlert('问卷已成功保存');
}


//当点击“发布问卷”时，如果截止日期早于当前日期或为空，则需要提示修改截止日期
function publishQuestionaire() {
    const tittle = document.querySelector('.tittle').value;
    const deadline = deadlineInput.value;
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
    const savedQuestionnaireData = localStorage.getItem(`${tittle}`);
    if (savedQuestionnaireData) {
        // 将获取到的JSON字符串解析为JavaScript对象
        const questionnaireObj = JSON.parse(savedQuestionnaireData);
        // 添加发布时间和发布状态属性到原对象
        questionnaireObj.publishTime = formattedDate;
        questionnaireObj.publishStatus = "发布中";
        localStorage.setItem(`${tittle}`, JSON.stringify(questionnaireObj));
        showCustomAlert('问卷已发布状态为“发布中”！');
    }
}


//提示框
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

// 新增重新编号函数
function reNumberQuestions() {
    const questions = document.querySelectorAll('.AllQuest');
    questions.forEach((question, index) => {
        const questionNumber = index + 1;
        question.querySelector('.Question').textContent = `${questionNumber}.`;
    });
    TiHao = questions.length; // 更新全局变量
}
    
