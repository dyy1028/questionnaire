window.onload = function () {
    const localStorageKeys = Object.keys(localStorage);
    const listContainer = document.getElementById('mylist');
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    const selectAllText = document.querySelector('#selectAllText');
    const deleteButton = document.querySelector('.delete-survey-button');
    const addQuestionnaireContainer2 = document.getElementById('addQuestionnaireContainer2');

    const filteredKeys = localStorageKeys.filter(key => ![
        "analyButton", "editTittle", "historyAnswers", "publicTittle", "viewTittle", "writeButton", "writeTittle", "analyTittle", "editButton"
    ].includes(key));

    let hasSurvey = false;

    filteredKeys.forEach(key => {
        const questionnaireData = localStorage.getItem(key);
        if (questionnaireData) {
            if (questionnaireData.startsWith('{') && questionnaireData.endsWith('}')) {
                try {
                    const parsedData = JSON.parse(questionnaireData);
                    const surveyListItem = createSurveyListItem(parsedData);
                    listContainer.appendChild(surveyListItem);
                    hasSurvey = true;
                } catch (e) {
                    console.error(`Error parsing data for key: ${key}. Invalid JSON format.`, e);
                }
            } else {
                console.error(`Data for key ${key} in localStorage is not a valid JSON string`);
            }
        }
    });

    if (!hasSurvey) {
        selectAllCheckbox.style.display = 'none';
        selectAllText.style.display = 'none';
        deleteButton.style.display = 'none';
        addQuestionnaireContainer2.style.display = 'block';
    } else {
        addQuestionnaireContainer2.style.display = 'none';
    }

    setupButtonEvents();
    setupDeleteButton();
    setupSelectAllCheckbox();
};

function formatDate(dateString) {
    if (!dateString) return "";
    return dateString.split(" ")[0];
}

// 创建问卷列表项的函数
function createSurveyListItem(parsedData) {
    const surveyListItem = document.createElement('li');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('survey-checkbox');
    surveyListItem.appendChild(checkbox);

    const surveyTitleElement = document.createElement('div');
    surveyTitleElement.classList.add('survey-create-title');
    surveyTitleElement.innerText = parsedData.tittle;
    surveyListItem.appendChild(surveyTitleElement);

    const surveyCreateTimeElement = document.createElement('div');
    surveyCreateTimeElement.classList.add('survey-create-time');
    surveyCreateTimeElement.innerText = formatDate(parsedData.savatime);
    surveyListItem.appendChild(surveyCreateTimeElement);

    if (parsedData.publishTime && parsedData.publishTime.trim() !== "") {
        const surveyPublishTimeElement = document.createElement('div');
        surveyPublishTimeElement.classList.add('survey-publish-time');
        surveyPublishTimeElement.innerText = formatDate(parsedData.publishTime);
        surveyListItem.appendChild(surveyPublishTimeElement);
    }

    if (parsedData.deadline && parsedData.deadline.trim() !== "") {
        const surveyDeadlineElement = document.createElement('div');
        surveyDeadlineElement.classList.add('survey-deadline');
        surveyDeadlineElement.innerText = parsedData.deadline;
        surveyListItem.appendChild(surveyDeadlineElement);
    }

    const surveyPublishElement = document.createElement('div');
    surveyPublishElement.classList.add('survey-publish-status');
    surveyPublishElement.innerText = parsedData.publishStatus ? parsedData.publishStatus : '未发布';
    surveyListItem.appendChild(surveyPublishElement);

    const buttonContainer = document.createElement('div');
    buttonContainer.id = 'buttonContainer';
    createFunctionButtons(buttonContainer, parsedData.tittle);
    surveyListItem.appendChild(buttonContainer);

    return surveyListItem;
}


// 为各个操作按钮添加事件监听器
function setupButtonEvents() {
    setupButtonEvent(".view-questionnaire-button", "viewTittle", "查看问卷.html");
    setupButtonEvent(".publi-questionnaire-button", "publicTittle", "发布问卷.html");
    setupButtonEvent(".edit-questionnaire-button", "editTittle", "编辑问卷.html");
    setupButtonEvent(".creat-questionnaire-button", "writeTittle", "填写问卷.html");
    setupButtonEvent(".analy-questionnaire-button", "analyTittle", "分析问卷.html");
}

// 通用的按钮事件设置函数
function setupButtonEvent(selector, storageKey, targetPage) {
    const buttons = document.querySelectorAll(selector);
    buttons.forEach(button => {
        button.addEventListener("click", function () {
            const title = this.parentNode.parentNode.querySelector('.survey-create-title').textContent;
            saveTitleAndNavigate(storageKey, title, targetPage);
        });
    });
}

// 保存标题到 localStorage 并跳转到目标页面
function saveTitleAndNavigate(key, title, targetPage) {
    try {
        localStorage.setItem(key, JSON.stringify(title));
        window.location.href = targetPage;
    } catch (error) {
        console.error(`保存 ${key} 标题到本地存储时出错：`, error);
        alert("操作失败，请重试");
    }
}

// 处理删除按钮点击事件
function setupDeleteButton() {
    const deleteButton = document.querySelector('.delete-survey-button');
    const selectItems = document.querySelectorAll('.survey-checkbox');
    const surveyContainer = document.querySelector('.survey-container');
    const addQuestionnaireContainer2 = document.getElementById('addQuestionnaireContainer2');

    deleteButton.addEventListener('click', function () {
        const selectedItems = Array.from(selectItems).filter(item => item.checked).map(item => item.parentNode);
        if (selectedItems.length === 0) {
            alert('请至少选择一项');
            return;
        }
        const confirmation = confirm(`是否删除勾选的${selectedItems.length}个问卷？`);
        if (confirmation) {
            selectedItems.forEach(item => {
                const key = item.querySelector('.survey-create-title').textContent;
                localStorage.removeItem(key);
                item.remove();
            });
            // 删除操作后，再次检查问卷数量，更新按钮显示状态
            const remainingItems = document.querySelectorAll('#mylist li');
            const selectAllCheckbox = document.getElementById('selectAllCheckbox');
            const selectAllText = document.querySelector('#selectAllText');
            const deleteButton = document.querySelector('.delete-survey-button');
            if (remainingItems.length === 0) {
                selectAllCheckbox.style.display = 'none';
                selectAllText.style.display = 'none';
                deleteButton.style.display = 'none';
                addQuestionnaireContainer2.style.display = 'block';
            } else {
                addQuestionnaireContainer2.style.display = 'none';
            }
            if (surveyContainer && surveyContainer.children.length === 0) {
                surveyContainer.remove();
            }
        }
    });
}

// 处理全选复选框点击事件
function setupSelectAllCheckbox() {
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    selectAllCheckbox.addEventListener('click', function () {
        const allCheckboxes = document.querySelectorAll('.survey-checkbox');
        allCheckboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
        });
    });
}

// 创建功能按钮的函数
function createFunctionButtons(buttonContainer, key) {
    createDeleteButton(buttonContainer, key);

    const viewButton = createButton("查看问卷", "view-questionnaire-button");
    buttonContainer.appendChild(viewButton);

    const createWriteButton = createButton("填写问卷", "creat-questionnaire-button");
    buttonContainer.appendChild(createWriteButton);

    const analyButton = createButton("分析问卷", "analy-questionnaire-button");
    // 减小分析按钮的右边距
    buttonContainer.appendChild(analyButton);

    const publiButton = createButton("发布问卷", "publi-questionnaire-button");
    buttonContainer.appendChild(publiButton);

    const editButton = createButton("编辑问卷", "edit-questionnaire-button");
    buttonContainer.appendChild(editButton);
}

// 创建按钮的辅助函数
function createButton(text, className) {
    const button = document.createElement('button');
    button.classList.add(className);
    button.innerText = text;
    return button;
}

// 创建删除按钮的函数
function createDeleteButton(buttonContainer, key) {
    const deleteButton = document.createElement('button');
    deleteButton.innerText = '删除问卷';
    deleteButton.addEventListener('click', function () {
        const confirmation = confirm('您确定要删除这个问卷吗？');
        if (confirmation) {
            const surveyEntry = this.parentNode.parentNode;
            localStorage.removeItem(key);
            surveyEntry.remove();
        }
    });
    deleteButton.classList.add('hover-effect');
    buttonContainer.appendChild(deleteButton);
}
