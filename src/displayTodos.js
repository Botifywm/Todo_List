import { allProjects } from "./project";
import { allTodos } from "./todos";
import { format, isPast, isToday, isTomorrow, isYesterday } from "date-fns";
import { createEditForm } from "./editForm";
import { dropDownProjectFn } from "./project";
import { displayTask, filterTasks } from "./displayTask";

function displayTodos(array, header) {
    const todosDisplay = document.querySelector('.todoList');
    const menuTitle = document.querySelector('.menuTitle');
    menuTitle.textContent = header;
    todosDisplay.innerHTML = "";

    // select the right fn to extract the relevant list of todos
    let allTodosFiltered = filterTasks().projectTasks(header);
    if(!Array.isArray(array)){
        allTodosFiltered = array.get(header)();
    }

    allTodosFiltered.forEach((obj) => {
        let title = obj.title;
        let notes = obj.notes;
        let dueDate = obj.dueDate;
        let priority = obj.priority;
        const project = obj.project;
        let checklist = obj.checklist;
        const uuid = obj.uuid;

        // check if dates are today or yesterday or tomorrow
        dueDate = checkDate(dueDate);

        // setting up the DOM selectors

        // wrapper for each item 
        const outerWrapper = document.createElement('div');
        outerWrapper.classList.add('outerWrapper');
        outerWrapper.classList.add(`${uuid}`);

        const wrapper = document.createElement('div');
        wrapper.classList.add('wrapperTodo');
        // wrapper.setAttribute('id', uuid);

        // sectioning the different parts for interface
        const titleNcheckboxSec = document.createElement('div');
        titleNcheckboxSec.classList.add('titleNcheckboxSec');

        // content to display in each wrapper
        const checklistDOM = document.createElement('button');
        checklistDOM.classList.add('checklist');
        checklistDOM.classList.add(`${priority}`);
        checklistDOM.setAttribute('role', 'checkbox');
        checklistDOM.setAttribute('aria-checked', checklist? 'true' : 'false');

        titleNcheckboxSec.appendChild(checklistDOM);
        
        const titleDOM = document.createElement('div');
        titleDOM.classList.add('title');
        titleDOM.textContent = title;

        const projectDOM = document.createElement('span');
        projectDOM.classList.add('project');
        projectDOM.textContent = " " + project;
        titleDOM.appendChild(projectDOM);
        titleNcheckboxSec.appendChild(titleDOM);

        const editDOM = document.createElement('div');
        editDOM.setAttribute('class', 'editLogo');
        editDOM.setAttribute('id', uuid);
        editDOM.innerHTML = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 7L7 7M20 7L11 7" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"></path> <path d="M20 17H17M4 17L13 17" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"></path> <path d="M4 12H7L20 12" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"></path> </g></svg>`;
        
        titleNcheckboxSec.appendChild(editDOM);
        wrapper.append(titleNcheckboxSec);

        const notesDOM = document.createElement('div');
        notesDOM.classList.add('notes');
        notesDOM.textContent = notes;
        wrapper.append(notesDOM)

        const dueDateDOM = document.createElement('div');
        dueDateDOM.innerHTML = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M3 10C3 8.11438 3 7.17157 3.58579 6.58579C4.17157 6 5.11438 6 7 6H17C18.8856 6 19.8284 6 20.4142 6.58579C21 7.17157 21 8.11438 21 10V11H3V10Z" stroke="#ff8364" stroke-opacity="0.24" stroke-width="1.2"></path> <rect x="3" y="6" width="18" height="15" rx="2" stroke="#ff8364" stroke-width="1.2"></rect> <path d="M7 3L7 8" stroke="#ff8364" stroke-width="1.2" stroke-linecap="round"></path> <path d="M17 3L17 8" stroke="#ff8364" stroke-width="1.2" stroke-linecap="round"></path> </g></svg>`;
        dueDateDOM.classList.add('dueDateWrapper');
        const due = document.createElement('div');
        due.classList.add('dueDate');
        due.textContent = dueDate;
        dueDateDOM.appendChild(due);

        wrapper.appendChild(dueDateDOM);

        // insertion into container
        outerWrapper.appendChild(wrapper);
        todosDisplay.appendChild(outerWrapper);
    })
}


function checkDate (dueDate) {
    let formattedDate = format(dueDate, "dd/MM/yyyy");
    const boolToday = isToday(dueDate);
    const boolTmr = isTomorrow(dueDate);
    const boolYtd = isYesterday(dueDate);
    boolToday ? formattedDate = "Today" : 
    boolTmr ? formattedDate = "Tomorrow" : 
    boolYtd ? formattedDate = "Yesterday": formattedDate;
    
    return formattedDate
}

function restrictDisplay(menuTitle) {
    const editDOM = document.querySelectorAll('.editLogo');
    const addIcon = document.querySelector('#addIcon');
    const checklist = document.querySelectorAll('.checklist');
    if (menuTitle === 'Completed') {
        if (editDOM) {
            editDOM.forEach((edit) => {
                edit.classList.add('completeHidden');
            })
            checklist.forEach((check) => {
                check.disabled=true;
            })
        }
        addIcon.setAttribute('class', 'completeHidden');
    }
    else {
        if(editDOM){
            editDOM.forEach((edit) => {
                edit.classList.remove('completeHidden');
            })
        }
        if (addIcon) {
            addIcon.classList.remove('completeHidden');
        }
    }
}

function presetSelection(menuTitle) {
    let projectHeader = "General";
    if(allProjects.includes(menuTitle)){
        projectHeader = menuTitle;
    }
    return projectHeader;
}

export {displayTodos, restrictDisplay, presetSelection};