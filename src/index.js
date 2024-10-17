import { displayTask } from "./displayTask";
import { displayTodos, restrictDisplay, presetSelection } from "./displayTodos";
import { displayPage } from "./dynamicSwitch";
import { allProjects, createProjectFn, dropDownProjectFn, renameP } from "./project";
import "./style.css";
import { allTodos, createTodo } from "./todos";
import { formatDate, startOfDay, startOfToday } from "date-fns";
import { createEditForm, presetEditForm, removeActiveEdit } from "./editForm";
import { countList } from "./taskCounter";
import { webStorage } from "./storage";

// PLACEHOLDER FOR FORM IN HTML
const placeHolder = document.querySelector('#placeHolder')

// MENU ADD TASK FORM
const createTaskMenu = document.querySelector('.menuLogo');
const formContainerMenu = document.querySelector('.formMenu');

// MAIN CONTENT ADD TASK FORM
const date = document.querySelector('.dateInput');
const formContainerMain = document.querySelector('.formMain');
const createTask = document.querySelector('#addIcon');
const closeForm = document.querySelector('.closeForm');
const addTodoForm = document.querySelector('.addTodoForm');
const all = document.querySelector('.all');
const today = document.querySelector('.today');
const overdue = document.querySelector('.overdue');
const completed = document.querySelector('.completed');
const titleInput = document.querySelector('.titleInput');

// PROJECT-RELATED SELECTORS
const createProject = document.querySelector('#createProject');
const projectDialog = document.querySelector('#projectDialog');
const ProjectTitleInput = document.querySelector('#ProjectTitleInput');
const projectInputOption = document.querySelector('.projectInput');
const cancelProject = document.querySelector('#cancelProj');
const projectLabels = document.querySelector('.projectLabels');

const renameProjForm = document.querySelector('.renameProjForm');

// DISPLAY TODO LIST
const todoList = document.querySelector('.todoList');
const menuTitle = document.querySelector('.menuTitle');

// COUNT TRACKER
let allCount = document.querySelector('.all .count');
let todayCount = document.querySelector('.today .count');
let overdueCount = document.querySelector('.overdue .count');
let completedCount = document.querySelector('.completed .count');

// Set All as the default page
displayTodos(displayTask, "All");

document.addEventListener('DOMContentLoaded', function(){
    const observer = new MutationObserver(() => {
        restrictDisplay(menuTitle.textContent);
        projectInputOption.value = presetSelection(menuTitle.textContent);
    })
    observer.observe(menuTitle, {childList: true})

    const observerTwo = new MutationObserver(() => {
        // FOR CHECKLIST
        todoList.querySelectorAll('.checklist').forEach(checklist => {
            checklist.addEventListener('click', (e) => {
                const checkbox = e.target.closest('.checklist');
                if (checkbox) {
                    const editLogo = checkbox.parentElement.querySelector('.editLogo');
                    const activeObjGeneral = allTodos.find((obj) => obj.uuid === editLogo.id);
        
                    checkbox.setAttribute('aria-checked', 'true');
                    activeObjGeneral.checklist = true;
                    displayTodos(displayPage(activeObjGeneral.dueDate, activeObjGeneral.project).map, menuTitle.textContent)
                }
            })
        })

        // FOR COUNTING LIST
        const track = countList().countTracker;
        console.log("count")
        allCount.textContent = track.get('All');
        todayCount.textContent = track.get('Today');
        overdueCount.textContent = track.get('Overdue');
        completedCount.textContent = track.get('Completed');

        const allProjectList = document.querySelectorAll('.projLabel .count');
        allProjectList.forEach((projCount, index) => {
            projCount.textContent = track.get(allProjects[index]);
        })
    })
    observerTwo.observe(todoList, {childList:true});
    observerTwo.observe(projectLabels, {childList:true});
})

createTaskMenu.addEventListener('click', () => {
    const today = formatDate(startOfToday(), 'yyyy-MM-dd')
    date.setAttribute('min', today);
    // projectInputOption.value = presetSelection(menuTitle.textContent);
    formContainerMenu.appendChild(addTodoForm);
    addTodoForm.style.display = "grid";
    if (menuTitle.textContent === "Today") {
        date.value = today;
    }
    titleInput.focus();
})

createTask.addEventListener('click', () => {
    const today = formatDate(startOfToday(), 'yyyy-MM-dd')
    date.setAttribute('min', today);
    // projectInputOption.value = presetSelection(menuTitle.textContent);
    formContainerMain.appendChild(addTodoForm);
    addTodoForm.style.display = "grid";
    if (menuTitle.textContent === "Today") {
        date.value = today;
    }
    titleInput.focus();
})

closeForm.addEventListener('click', (e) => {
    e.preventDefault();
    addTodoForm.reset();
    placeHolder.appendChild(addTodoForm);
    addTodoForm.style.display = "none";
})

addTodoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const viewTodo = createTodo();
    addTodoForm.style.display = "none";
    placeHolder.appendChild(addTodoForm);
    displayTodos(viewTodo.map, viewTodo.header);
    addTodoForm.reset();
    
    todoList.addEventListener('click', (e) => {
        if (e.target.closest('.editLogo')) {
            const editLogo = e.target.closest('.editLogo');
            const outerWrapper = editLogo.closest('.outerWrapper');
            const wrapper = outerWrapper.querySelector('.wrapperTodo');
            const activeObjGeneral = allTodos.find((obj) => obj.uuid === editLogo.id);
            removeActiveEdit();

            editLogo.classList.add('active');
            if (editLogo.classList.contains('active')){
                wrapper.style.display = "none";
                wrapper.classList.add('editing');
                const presets = presetEditForm(outerWrapper, activeObjGeneral.priority, activeObjGeneral.title, activeObjGeneral.notes, activeObjGeneral.dueDate, activeObjGeneral.project);
                const saveEdit = document.querySelector('.saveEdit')
                saveEdit.addEventListener('click', (e) => {
                    e.preventDefault();
                    const selectedPriority = document.querySelector('input[name="pList"]:checked')
                    activeObjGeneral.title = presets.newName.value; 
                    activeObjGeneral.notes = presets.newNotes.value;
                    activeObjGeneral.priority = selectedPriority.value;
                    activeObjGeneral.dueDate = presets.newDate.value;
                    activeObjGeneral.project = presets.projectEdit.value;
                    removeActiveEdit();
                    displayTodos(displayPage(activeObjGeneral.dueDate, activeObjGeneral.project).map , displayPage(activeObjGeneral.dueDate, activeObjGeneral.project).header)
                })

                const deleteEdit = document.querySelector('.delete')
                deleteEdit.addEventListener('click', (e) => {
                    e.preventDefault();
                    // const toDel = allTodos.find((obj) => obj.uuid === elementId);
                    const index = allTodos.indexOf(activeObjGeneral);
                    allTodos.splice(index, 1);
                    // displayTodos(displayTask, displayPage(activeObjGeneral.dueDate, activeObjGeneral.project).header)
                    displayTodos(displayPage(activeObjGeneral.dueDate, activeObjGeneral.project).map, menuTitle.textContent);

                })

                const cancelEdit = document.querySelector('.cancelEdit')
                cancelEdit.addEventListener('click', (e) => {
                    e.preventDefault();
                    removeActiveEdit();
                })
            }
        }
        
    })

})


all.addEventListener('click', () => {
    displayTodos(displayTask, "All");
})

today.addEventListener('click', () => {
    displayTodos(displayTask, "Today");
})

overdue.addEventListener('click', () => {
    displayTodos(displayTask, "Overdue");
})

completed.addEventListener('click', () => {
    displayTodos(displayTask, "Completed");
    restrictDisplay(menuTitle.textContent);
})


createProject.addEventListener('click', () => {
    projectDialog.style.display = "grid";
    ProjectTitleInput.focus();
    projectDialog.reset();
})

projectDialog.addEventListener('submit', (e) => {
    e.preventDefault();
    placeHolder.appendChild(renameProjForm);
    createProjectFn();
    projectDialog.style.display = "none";
    webStorage();
})

cancelProject.addEventListener('click', (e) => {
    e.preventDefault();
    projectDialog.style.display = "none";
})

renameProjForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const preProjName = document.querySelector('.hiddenRenameForm');
    const newName = renameP(preProjName).newName;
    placeHolder.appendChild(renameProjForm);
    preProjName.classList.remove('hiddenRenameForm');
    dropDownProjectFn();
    displayTodos(allTodos, newName);
})
