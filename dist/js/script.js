"use strict";

const toDoform = document.querySelector(".to-do-form");
const toDoformBtn = document.querySelector(".to-do-form__btn");
const taskList = document.querySelector(".task-list");
let tasksArray = [];
let timerId = [];

// записує об'єкт завдання до масиву
const writeTaskToArray = (arr) => {

    let taskObject = {

        isChecked: false,
        isDeadloneMissed: false,
        startDate: Date.parse(new Date()),
        executionDate: "",
        timerId,

    };

    const formData = new FormData(toDoform);

    formData.forEach((value, key) => {

        if(value !== "" && value !== undefined && value !== false) {

            taskObject[key] = value;

        } 

    })

    arr.push(taskObject);
    
    localStorage.setItem("tasks", JSON.stringify(arr)); 

}

// розміщує згенеровану верстку на сторінці
const addTaskToTaskList = (arr) => {

    let listItem = "";

    arr.forEach((item) => {

        let deadineYear = new Date(item.deadline).getFullYear();
        let deadlineMonth = new Date(item.deadline).getMonth() >= 9 ? new Date(item.deadline).getMonth() + 1 : "0" + (new Date(item.deadline).getMonth() + 1);
        let deadlineDay = new Date(item.deadline).getDate() >= 10 ? new Date(item.deadline).getDate() : "0" + new Date(item.deadline).getDate();

        listItem += `
        <div class="task-list__item">
            <div class="complete-checkbox">
                <img class="complete-checkbox__img hide" src="icons/completed.png" alt="delete" width="15" height="15">               
            </div>
            <p class="task-list__item-text task-text">${item.task}</p>
            <div class="task-list__item-deadline">
                <span>task must be completed to</span><span class="task-deadline">${deadlineDay}.${deadlineMonth}.${deadineYear}</span>
                <img class="task-list__item-arrow" src="icons/forward.png" alt="delete" width="45" height="35"> 
            </div>
            <p class="task-list__item-completed hide"></p>
            <div class="timer">
                <span class="timer__item timer__days"></span>
                <span class="timer__item timer__hours"></span>
                <span class="timer__item timer__minutes"></span>
                <span class="timer__item timer__seconds"></span> 
                <span class="timer__missed-deadline">Deadline is missed </span>
                <img class="timer__item" src="icons/clock.png" alt="accept-mark" width="20" height="20">  
            </div>
            <div>
                <img class="task-list__item-btn accept hide" src="icons/check-mark.png" alt="accept-mark" width="25" height="25">                 
                <img class="task-list__item-btn edit" src="icons/edit.png" alt="edite" width="25" height="25">                 
                <img class="task-list__item-btn delete" src="icons/delete.png" alt="delete" width="25" height="25">               
            </div>
        </div>`  
    })

    taskList.innerHTML = listItem;

    let inputTask = document.getElementById("inputTask");
        inputTask.value = "";

    arr.forEach((item,i) => {

        if(item.isChecked) {

            let completeCheckboxesImg = document.querySelectorAll(".complete-checkbox__img");
            let tasklistItemCompleted = document.querySelectorAll(".task-list__item-completed");
            let taskListItemDeadline = document.querySelectorAll(".task-list__item-deadline");
            let timer = document.querySelectorAll(".timer");
            completeCheckboxesImg[i].classList.remove("hide");
            tasklistItemCompleted[i].classList.remove("hide");
            taskListItemDeadline[i].classList.add("hide");
            timer[i].classList.add("hide");
            tasklistItemCompleted[i].textContent = `completed ${tasksArray[i].executionDate}`;

        }

    })

    setTimer(arr);

}
//встановлює тамер та записує ідентифікатор таймера в масив timerId
const setTimer = (arr) => {
    
    let timerDays = document.querySelectorAll(".timer__days"),
        timerHours = document.querySelectorAll(".timer__hours"),
        timerMinutes = document.querySelectorAll(".timer__minutes"),
        // timerSeconds = document.querySelectorAll(".timer__seconds"),
        TimerMissedDeadline = document.querySelectorAll(".timer__missed-deadline"),
        timeInterval = setInterval(updateTimer, 60000);
        updateTimer();

        if (timerId.length < arr.length ) {

            timerId.push(timeInterval);
            localStorage.setItem("timerId", JSON.stringify(timerId)); 

        }

        function updateTimer() {

            arr.forEach((item, i) => {

                let t =  Date.parse(new Date(item.deadline)) - new Date(),
                    days = Math.floor(t / (1000 * 60 * 60 * 24)),
                    hours = Math.floor(t / (1000 * 60 * 60) % 24),
                    minutes = Math.floor(t / (1000 * 60) % 60);
                    // seconds = Math.floor(t / (1000) % 60);
                 
                    timerDays[i].innerHTML = `${days} ${days > 1 || days == 0 ? "days" : "day"}`;
                    timerHours[i].innerHTML = `${hours} ${hours > 1 ? "hours" : "hour"}`;
                    timerMinutes[i].innerHTML =`${minutes} ${minutes > 1 ? "minutes" : "minute"}`;
                    // timerSeconds[i].innerHTML = `${seconds} seconds`; 
                    timerDays[i].classList.remove("hide");
                    timerHours[i].classList.remove("hide");
                    timerMinutes[i].classList.remove("hide");
                    TimerMissedDeadline[i].classList.add("hide");
                
                if (t <= 0) {

                    clearInterval(timerId[i]);
                    timerId.splice(i, 1);
                    localStorage.setItem("timerId", JSON.stringify(timerId)); 
                    TimerMissedDeadline[i].classList.remove("hide");
                    timerDays[i].classList.add("hide");
                    timerHours[i].classList.add("hide");
                    timerMinutes[i].classList.add("hide");

                }

            })

        } 
}

//видаляє завдання
const removeTaskItem = (e, arr) => {

    if (e.target && e.target.classList.contains("delete")) {

        let listItemBtnDelete = document.querySelectorAll(".delete");

        listItemBtnDelete.forEach((item, i) => {
            
            if (item === e.target) {
                arr.splice(i, 1);
                localStorage.setItem("tasks", JSON.stringify(arr));
                addTaskToTaskList(arr);
                clearInterval(timerId[i]);
                timerId.splice(i, 1);
                localStorage.setItem("timerId", JSON.stringify(timerId)); 
            }

        })

    }

}

//якщо в localStorage є попередні таски копіює їх та виводить на сторінку
const copyLocalStorageToArray = () => {

    let localStorageCopyArray = [...JSON.parse(localStorage.getItem("tasks"))];
    let localStorageCopyTimerId = [...JSON.parse(localStorage.getItem("timerId"))];

    if (localStorageCopyArray.length > 0) {
        tasksArray = [...localStorageCopyArray];
        timerId = [...localStorageCopyTimerId];
        addTaskToTaskList(tasksArray);  
    }

}

copyLocalStorageToArray();

// дозволяє редагувати завдання та кінцеву дату виконання завдання. 
const editeTask = (e, arr) => {

    if (e.target && e.target.classList.contains("edit")) {

        let listItemBtnEdit = document.querySelectorAll(".edit");
        let listItemText = document.querySelectorAll(".task-text")
        let listItemAccept = document.querySelectorAll(".accept");
        let deadlineTask = document.querySelectorAll(".task-deadline");
        let listItemArrow = document.querySelectorAll(".task-list__item-arrow");

        listItemBtnEdit.forEach((item, i) => {

            if (item === e.target) {
                listItemText[i].setAttribute("contenteditable", "true");
                deadlineTask[i].setAttribute("contenteditable", "true");
                deadlineTask[i].classList.toggle("distinct");
                listItemText[i].classList.toggle("distinct");
                item.classList.add("hide");
                listItemAccept[i].classList.remove("hide");
                listItemArrow[i].classList.toggle("hide");
                listItemText[i].focus();
            }

        })

    } else if (e.target && e.target.classList.contains("accept")) {

        let listItemBtnEdit = document.querySelectorAll(".edit");
        let listItemText = document.querySelectorAll(".task-text")
        let listItemAccept = document.querySelectorAll(".accept");
        let deadlineTask = document.querySelectorAll(".task-deadline");
        let listItemArrow = document.querySelectorAll(".task-list__item-arrow");

        listItemAccept.forEach((item, i) => {

            if (item === e.target) {
                listItemText[i].setAttribute("contenteditable", "false");
                deadlineTask[i].setAttribute("contenteditable", "false");
                deadlineTask[i].classList.toggle("distinct");
                listItemText[i].classList.toggle("distinct");
                item.classList.add("hide");
                listItemBtnEdit[i].classList.remove("hide");
                listItemArrow[i].classList.toggle("hide");
                arr[i].task = listItemText[i].textContent;
                arr[i].deadline = deadlineTask[i].textContent.split(".").reverse().join().replace(/,/g, "-");
                localStorage.setItem("tasks", JSON.stringify(arr)); 
                setTimer(arr);  
            }

        })
        
    }

}
// реалізує функціонал "виконаного завдання"
const completedTask = (e, arr) => {

    if (e.target && e.target.classList.contains("complete-checkbox")) {

        let completeCheckboxes = document.querySelectorAll(".complete-checkbox");
        let completeCheckboxesImg = document.querySelectorAll(".complete-checkbox__img");
        let taskListItemDeadline = document.querySelectorAll(".task-list__item-deadline");
        let tasklistItemCompleted = document.querySelectorAll(".task-list__item-completed");
        let timer = document.querySelectorAll(".timer");

        completeCheckboxes.forEach((item, i) => {

            if (e.target === item) {

                completeCheckboxesImg[i].classList.toggle("hide");
                taskListItemDeadline[i].classList.toggle("hide");
                tasklistItemCompleted[i].classList.toggle("hide");
                timer[i].classList.toggle("hide");
                arr[i].isChecked = !arr[i].isChecked;
                localStorage.setItem("tasks", JSON.stringify(arr));
                arr[i].executionDate = `${new Date().getDate() > 10 ? new Date().getDate() : "0" + new Date().getDate()}.${new Date().getMonth() > 10 ? new Date().getMonth() : "0" + (new Date().getMonth() + 1)}.${new Date().getFullYear()}`
                tasklistItemCompleted[i].textContent = `completed ${arr[i].executionDate}`;

            }

        })   

    } else if (e.target && e.target.classList.contains("complete-checkbox__img")) {
        
        let completeCheckboxesImg = document.querySelectorAll(".complete-checkbox__img");
        let timer = document.querySelectorAll(".timer");
        let taskListItemDeadline = document.querySelectorAll(".task-list__item-deadline");
        let tasklistItemCompleted = document.querySelectorAll(".task-list__item-completed");

        completeCheckboxesImg.forEach((item, i) => {

            if (e.target === item) {

                item.classList.toggle("hide");
                taskListItemDeadline[i].classList.toggle("hide");
                tasklistItemCompleted[i].classList.toggle("hide");
                timer[i].classList.toggle("hide");
                arr[i].isChecked = !arr[i].isChecked;
                localStorage.setItem("tasks", JSON.stringify(arr));
                arr[i].executionDate = `${new Date().getDate() > 10 ? new Date().getDate() : "0" + new Date().getDate()}.${new Date().getMonth() > 10 ? new Date().getMonth() : "0" + (new Date().getMonth() + 1)}.${new Date().getFullYear()}`
                tasklistItemCompleted[i].textContent = `completed ${arr[i].executionDate}`;

            }

        })  

    }  

}


toDoformBtn.addEventListener("click", (e) => {

    e.preventDefault();
    let inpiteDeadline = document.querySelector("#deadline");
    let inpiteTask = document.querySelector("#inputTask");

    if (inpiteTask.value == "") {

        alert("You have to write your task");

    } else if ( inpiteDeadline.value == "") {

        alert("You have to fill a deadline");

    } else {

        writeTaskToArray(tasksArray);
        addTaskToTaskList(tasksArray);

    }

})


taskList.addEventListener("click", (e) => {

    removeTaskItem(e, tasksArray);
    editeTask(e, tasksArray);
    completedTask(e, tasksArray);

})

