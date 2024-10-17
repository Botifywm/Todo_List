import { parseISO } from "date-fns";
import { displayTask } from "./displayTask";
import { displayTodos } from "./displayTodos";
import { allTodos } from "./todos";
import { webStorage } from "./storage";

class Project {
    constructor(projectTitle, todoList = []) {
        this.projectTitle = projectTitle;
        this.todoList = todoList;
    }
}

let allProjects = [];

function createProjectFn() {
    const projectTitleInput = document.querySelector('#ProjectTitleInput').value;
    allProjects.push(projectTitleInput);
    
    projectLabelsFn();
    dropDownProjectFn();
    displayTodos(allTodos, projectTitleInput);
}

function dropDownProjectFn() {
    const projectSeg = document.querySelector('.projectsSeg');
    projectSeg.innerHTML = "";    

    allProjects.forEach((item) => {
        const projKey = document.createElement('option');
        projKey.setAttribute('value', item);
        projKey.textContent = item;
        projectSeg.appendChild(projKey);
    })
    return projectSeg;
}

function projectLabelsFn() {
    const projectLabels = document.querySelector('.projectLabels');
    projectLabels.innerHTML = "";  

    allProjects.forEach((item) => {
        const projectLabel = document.createElement('div');
        projectLabel.setAttribute('class', 'projLabel');

        // projSelector to wrap the svg and label text together - excluding the count and edit btn
        const projSelector = document.createElement('div');
        projSelector.setAttribute('class', 'projSelector');

        const svg = document.createElement('div');
        svg.innerHTML = `<svg viewBox="0 0 48.00 48.00" xmlns="http://www.w3.org/2000/svg" fill="#000000" stroke="#000000" stroke-width="2.64"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><defs><style>.a{fill:none;stroke:#b5b5b5;stroke-linecap:round;stroke-linejoin:round;}</style></defs><path class="a" d="M41.6783,13.0436H24.77c-1.9628-.1072-5.9311-4.2372-8.1881-4.2372H6.6806V8.8046A2.1762,2.1762,0,0,0,4.5,10.9763v7.3063h39V14.8652A1.8217,1.8217,0,0,0,41.6783,13.0436Z"></path><path class="a" d="M43.5,18.2826H4.5V37.0165a2.1762,2.1762,0,0,0,2.1735,2.1789H41.3194A2.1762,2.1762,0,0,0,43.5,37.0237V18.2826Z"></path></g></svg>`;
        svg.setAttribute('class', 'svgProj');
        projSelector.appendChild(svg);

        const projLabelText = document.createElement('div');
        projLabelText.setAttribute('class', 'projLabelText');

        const projName = document.createElement('div');
        projName.setAttribute('class', 'projName');
        projName.textContent = item;
        projLabelText.appendChild(projName);

        const projRename = document.createElement('div');
        projRename.setAttribute('class', 'projRename');
        projLabelText.appendChild(projRename);


        projSelector.appendChild(projLabelText);

        projectLabel.appendChild(projSelector);

        // ProAttribute section - count and edit btn 
        const projAttribute = document.createElement('div');
        projAttribute.setAttribute('class', 'projAttribute');

        const projLen = document.createElement('span');
        projLen.setAttribute('class', 'count');
        projLen.textContent = "0";

        const projEditBtn = document.createElement('span');
        projEditBtn.innerHTML = `<svg viewBox="0 -0.5 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>edit_fill [#00aaa01480]</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-59.000000, -400.000000)" fill="#00aaa0"> <g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M3,260 L24,260 L24,258.010742 L3,258.010742 L3,260 Z M13.3341,254.032226 L9.3,254.032226 L9.3,249.950269 L19.63095,240 L24,244.115775 L13.3341,254.032226 Z" id="edit_fill-[#00aaa01480]"> </path> </g> </g> </g> </g></svg>`
        projEditBtn.setAttribute('class', 'projEditBtn');
        
        projAttribute.appendChild(projLen);
        projAttribute.appendChild(projEditBtn);
        projectLabel.appendChild(projAttribute);

        // Dropdown from projAttribute when edit btn is clicked
        const projEditOptions = document.createElement('div');
        projEditOptions.setAttribute('class', 'projEditOptions');
        
        const renameProj = document.createElement('div');
        renameProj.setAttribute('class', 'rename');
        renameProj.innerText = "Rename"
        projEditOptions.appendChild(renameProj);

        const delProj = document.createElement('div');
        delProj.setAttribute('class', 'delete');
        delProj.innerText = "Delete";
        projEditOptions.appendChild(delProj);

        projAttribute.appendChild(projEditOptions);

        // All the DOM addeventListeners

        projEditBtn.addEventListener('click', () => {
            const checkShowEdit = document.querySelector('.showEditOpt');
            const renameProjForm = document.querySelector('.renameProjForm'); 
            const placeHolder = document.querySelector('#placeHolder');
            
            if (renameProjForm.closest('.projRename')){
                console.log("true")
                placeHolder.appendChild(renameProjForm);
                const hiddenRenameForm = document.querySelector('.hiddenRenameForm');
                hiddenRenameForm.classList.remove('hiddenRenameForm');
                return
            }

            if (checkShowEdit && checkShowEdit !== projEditOptions) {
                checkShowEdit.classList.remove('showEditOpt');
                projEditOptions.classList.add('showEditOpt');  
            }
            else {
                projEditOptions.classList.toggle('showEditOpt');
            }
        })

        projSelector.addEventListener('click', () => {
            displayTodos(allTodos, item);
        })

        renameProj.addEventListener('click', () => {
            const renameProjForm = document.querySelector('.renameProjForm');
            const newName = document.querySelector('.renameProjInput');
            newName.value = projName.textContent;
            projRename.appendChild(renameProjForm);
            projRename.style.display = 'grid';
            projName.classList.add('hiddenRenameForm');
            projEditOptions.classList.remove('showEditOpt');
        })

        delProj.addEventListener('click', ()=> {
            deleteP(projName);
            dropDownProjectFn();
            projectLabel.remove();
            displayTodos(displayTask, "All");
            console.log(allTodos)
        })

        projectLabels.appendChild(projectLabel);
    })

}

function renameP(projName) {
    const newName = document.querySelector('.renameProjInput').value;
    let renamed = projName.textContent;
    const object = allTodos.find((obj) => obj.project === renamed);
    let prevNameIndex = allProjects.findIndex((project) => project === renamed);
   
    if (prevNameIndex !== -1) {
        allProjects[prevNameIndex] = newName
        projName.textContent = newName;
    }
    if (object) {
        object.project = newName;
    }

    return {newName}
}

function deleteP(projName) {
    const index = allProjects.indexOf(projName.textContent);
    allProjects.splice(index, 1);
    allTodos.splice(0, allTodos.length, ...allTodos.filter((obj) => obj.project !== projName.textContent));
}




export {allProjects, createProjectFn, dropDownProjectFn, renameP};