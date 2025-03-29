window.onload = function() {
    // 获取localStorage中所有的键
    var localStorageKeys = Object.keys(localStorage);
    const ListContainer = document.getElementById('mylist');
    
    // 遍历localStorage的键，生成问卷列表项
for (var i = 0; i < localStorageKeys.length; i++) {
    var key = localStorageKeys[i];
    if(key==="historyAnswers"|| key==="viewTittle"||key==="publicTittle"||key==="editButton"||key==="writeButton"||key==="analyButton"||key==="publish")
        {
            continue;
        }
    else{
        const questionnaireData = localStorage.getItem(key);
    if (questionnaireData) {
        
        // 尝试解析问卷数据为JSON对象
        try {
            const parsedData = JSON.parse(questionnaireData);
            // 动态创建问卷列表项
            const surveyListItem = document.createElement('li');
            // 创建复选框元素，用于选择问卷
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.classList.add('survey-checkbox');
            surveyListItem.appendChild(checkbox);
            // 创建标题元素，显示问卷标题
            const surveyTitleElement = document.createElement('div');
            surveyTitleElement.classList.add('survey-create-title');
            surveyTitleElement.innerText = parsedData.tittle;
            surveyListItem.appendChild(surveyTitleElement);
            // 创建创建时间元素，显示问卷创建时间
            const surveyCreateTimeElement = document.createElement('div');
            surveyCreateTimeElement.classList.add('survey-create-time');
            surveyCreateTimeElement.innerText = parsedData.savatime;
            surveyListItem.appendChild(surveyCreateTimeElement);
            // 创建发布状态元素，显示问卷发布状态
            const surveyPublishElement = document.createElement('div');
            surveyPublishElement.classList.add('survey-publish-status');
            surveyPublishElement.innerText = parsedData.publishStatus? parsedData.publishStatus : '未发布';
            surveyListItem.appendChild(surveyPublishElement);
            // 创建发布问卷按钮，点击后跳转到查看问卷页面
            const publiButton = document.createElement('button');
            publiButton.classList.add('publi-questionnaire-button');
            publiButton.innerText = '发布问卷';
            surveyListItem.appendChild(publiButton);
            // 创建编辑问卷按钮，点击后跳转到查看问卷页面
            const EditButton = document.createElement('button');
            EditButton.classList.add('edit-questionnaire-button');
            EditButton.innerText = '编辑问卷';
            surveyListItem.appendChild(EditButton);
            // 创建删除问卷按钮，点击后跳转到查看问卷页面
            // const deletButton = document.createElement('button');
            // deletButton.classList.add('delete-questionnaire-button');
            // deletButton.innerText = '删除问卷';
            // surveyListItem.appendChild(deletButton);

             const buttonContainer = document.createElement('div');
             buttonContainer.id = 'buttonContainer';
             surveyListItem.appendChild(buttonContainer);
            // 动态创建功能按钮并添加到按钮容器
             createFunctionButtons(buttonContainer);
            //创建查看问卷按钮，点击后跳转到查看问卷页面
            const viewQuestionnaireButton = document.createElement('button');
            viewQuestionnaireButton.classList.add('view-questionnaire-button');
            viewQuestionnaireButton.innerText = '查看问卷';
            surveyListItem.appendChild(viewQuestionnaireButton);
            //创建填写问卷按钮，点击后跳转到查看问卷页面
            const createWriteButton = document.createElement('button');
            createWriteButton.classList.add('creat-questionnaire-button');
            createWriteButton.innerText = '填写问卷';
            surveyListItem.appendChild(createWriteButton);
            //创建分析问卷按钮，点击后跳转到查看问卷页面
            const analyButton = document.createElement('button');
            analyButton.classList.add('analy-questionnaire-button');
            analyButton.innerText = '分析问卷';
            surveyListItem.appendChild(analyButton);

            // 创建按钮容器，用于存放功能按钮
            //const buttonContainer = document.createElement('div');
            // buttonContainer.id = 'buttonContainer';
            // surveyListItem.appendChild(buttonContainer);
            // 动态创建功能按钮并添加到按钮容器
            // createFunctionButtons(buttonContainer);
            // 创建查看问卷按钮，点击后跳转到查看问卷页面
            // 将列表项添加到列表容器中
            ListContainer.appendChild(surveyListItem);
        } catch (e) {
            console.error(`Error parsing data for key: ${key}. Invalid JSON format.`, e);
        }
    }
    }
}

// 点击查看问卷，将相应的标题名称保存到浏览器本地
var viewButton = document.querySelectorAll(".view-questionnaire-button");
viewButton.forEach(function(button){
    button.addEventListener("click",function(){
        // 获取当前点击按钮所在问卷列表项中展示标题的元素（此处需确保选择器准确对应前面创建的标题元素）
        const viewTittle = this.parentNode.parentNode.querySelector('.survey-create-title').textContent;
        // 尝试将获取到的标题以JSON字符串形式保存到本地存储中，键名为"viewTittle"，若保存出现异常则捕获并记录错误信息
        try {
            localStorage.setItem("viewTittle", JSON.stringify(viewTittle));
        } catch (error) {
            console.error("保存查看问卷标题到本地存储时出错：", error);
        }

        window.location.href="查看问卷.html";
    });
});

// 点击发布问卷，将相应的标题名称保存到浏览器本地
var publicButton = document.querySelectorAll(".publi-questionnaire-button");
publicButton.forEach(function(button){
    button.addEventListener("click",function(){
        // 获取当前点击按钮所在问卷列表项中展示标题的元素（此处需确保选择器准确对应前面创建的标题元素）
        const publicTittle = this.parentNode.parentNode.querySelector('.survey-create-title').textContent;
        // 尝试将获取到的标题以JSON字符串形式保存到本地存储中，键名为"viewTittle"，若保存出现异常则捕获并记录错误信息
        try {
            localStorage.setItem("publicTittle", JSON.stringify(publicTittle));
        } catch (error) {
            console.error("保存查看问卷标题到本地存储时出错：", error);
        }

        window.location.href="发布问卷.html";
    });
});

// 点击编辑问卷，将相应的标题名称保存到浏览器本地
var editButton = document.querySelectorAll(".edit-questionnaire-button");
editButton.forEach(function(button){
    button.addEventListener("click",function(){
        // 获取当前点击按钮所在问卷列表项中展示标题的元素（此处需确保选择器准确对应前面创建的标题元素）
        const editButton = this.parentNode.parentNode.querySelector('.survey-create-title').textContent;
        // 尝试将获取到的标题以JSON字符串形式保存到本地存储中，键名为"viewTittle"，若保存出现异常则捕获并记录错误信息
        try {
            localStorage.setItem("editButton", JSON.stringify(editButton));
        } catch (error) {
            console.error("保存查看问卷标题到本地存储时出错：", error);
        }

        window.location.href="编辑问卷.html";
    });
});
// 点击填写问卷，将相应的标题名称保存到浏览器本地
var writeButton = document.querySelectorAll(".creat-questionnaire-button");
writeButton.forEach(function(button){
    button.addEventListener("click",function(){
        // 获取当前点击按钮所在问卷列表项中展示标题的元素（此处需确保选择器准确对应前面创建的标题元素）
        const writeButton = this.parentNode.parentNode.querySelector('.survey-create-title').textContent;
        // 尝试将获取到的标题以JSON字符串形式保存到本地存储中，键名为"viewTittle"，若保存出现异常则捕获并记录错误信息
        try {
            localStorage.setItem("writeButton", JSON.stringify(writeButton));
        } catch (error) {
            console.error("保存查看问卷标题到本地存储时出错：", error);
        }

        window.location.href="填写问卷.html";
    });
});
// 点击分析问卷，将相应的标题名称保存到浏览器本地
var analyButton = document.querySelectorAll(".analy-questionnaire-button");
analyButton.forEach(function(button){
    button.addEventListener("click",function(){
        // 获取当前点击按钮所在问卷列表项中展示标题的元素（此处需确保选择器准确对应前面创建的标题元素）
        const analyButton = this.parentNode.parentNode.querySelector('.survey-create-title').textContent;
        // 尝试将获取到的标题以JSON字符串形式保存到本地存储中，键名为"viewTittle"，若保存出现异常则捕获并记录错误信息
        try {
            localStorage.setItem("analyButton", JSON.stringify(analyButton));
        } catch (error) {
            console.error("保存查看问卷标题到本地存储时出错：", error);
        }

        window.location.href="分析问卷.html";
    });
   
});

    // 获取删除按钮和所有复选框
    const deleteButton = document.querySelector('.delete-survey-button');
    const selectItems = document.querySelectorAll('.survey-checkbox');

    // 获取存放问卷信息的容器（假设类名为survey-container）
    const surveyContainer = document.querySelector('.survey-container');

    deleteButton.addEventListener('click', function () {
        let selectedItems = [];
        Array.from(selectItems).forEach((item) => {
            if (item.checked) {
                selectedItems.push(item.parentNode);
            }
        });
        if (selectedItems.length === 0) {
            alert('请至少选择一项');
            return;
        }
        let confirmationMessage = `是否删除勾选的${selectedItems.length}个问卷？`;
        let confirmation = confirm(confirmationMessage);
        if (confirmation) {
            selectedItems.forEach((item) => {
                const key = item.querySelector('.survey-create-title').textContent;
                localStorage.removeItem(key);
                item.remove();
            });

            // 如果surveyContainer存在且没有子元素，则移除surveyContainer
            if (surveyContainer && surveyContainer.children.length === 0) {
                surveyContainer.remove();
            }
        }
    });


    // 全选复选框逻辑
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    selectAllCheckbox.addEventListener('click', function() {
        const allCheckboxes = document.querySelectorAll('.survey-checkbox');
        allCheckboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
        });
    });
}


function createDeleteButton(buttonContainer) {
    const deleteButton = document.createElement('button');
    deleteButton.innerText = '删除问卷';
    deleteButton.addEventListener('click', function() {
        console.log('删除问卷');
        // 弹出确认框
        const confirmation = confirm('您确定要删除这个问卷吗？');
        // 如果用户确认删除，则执行删除操作
        if (confirmation) {
            const surveyEntry = this.parentNode.parentNode;
            const key = surveyEntry.querySelector('.survey-create-title').textContent;
            localStorage.removeItem(key); // 从localStorage中移除数据
            surveyEntry.remove();
        }
    });
    deleteButton.classList.add('hover-effect');
    buttonContainer.appendChild(deleteButton);
}



function createFunctionButtons(buttonContainer) {
      createDeleteButton(buttonContainer);
}
