import { dropDownProjectFn } from "./project";

function createEditForm() {
    const template = document.createElement('template');
    template.innerHTML = `<form action="#" class="editForm">
            <div class="priorityList">
                <input class="pList nil" type="radio" value="nil" name="pList" title="No Priority">
                <input class="pList low" type="radio" value="low" name="pList" title="Low Priority">
                <input class="pList med" type="radio" value="med" name="pList" title="Medium Priority">
                <input class="pList high" type="radio" value="high" name="pList" title="High Priority">
            </div>
            <div class="editCtrl">
                <input class="nameEdit" type="text" placeholder="Task Name" autofocus>
                <textarea class="noteEdit" placeholder="Notes"></textarea>
                <input class="dateEdit" type="date" required>
                <select class="projectEdit">
                    <option value="General">General</option>
                    <optgroup label="Projects" class="projectsSegEdit"></optgroup>
                </select>
                <div class="editAction">
                    <button type="submit" class="saveEdit">Save</button>
                    <button class="delete">Delete Task</button>
                    <button class="cancelEdit">Cancel</button>
                </div>
            </div>
        </form>`;

    return template.content.cloneNode(true);
}


function removeActiveEdit() {
    const activeCheck = document.querySelector('.active');
    if (activeCheck) {
        const editFormExists = document.querySelector('.editForm');
        const wrapperEditing = document.querySelector('.editing');
        wrapperEditing.style.display = "grid";
        activeCheck.classList.remove('active');
        wrapperEditing.classList.remove('editing');
        editFormExists.remove();
    }
}

function presetEditForm(outerWrapper, priority, title, notes, dueDate, project) {
    const editForm = createEditForm();
    outerWrapper.appendChild(editForm);
    const checkPriority = document.querySelector(`.pList.${priority}`);
    checkPriority.checked = true;
    const newName = document.querySelector('.nameEdit');
    newName.value = title;
    const newNotes = document.querySelector('.noteEdit');
    newNotes.value = notes;
    const newDate = document.querySelector('.dateEdit');
    newDate.value = dueDate;
    const projectEdit = document.querySelector('.projectEdit');
    const newProject = document.querySelector('.projectsSegEdit');
    // projectEdit.addEventListener('click', () => {
    //     newProject.innerHTML = dropDownProjectFn().innerHTML;
    // })
    newProject.innerHTML = dropDownProjectFn().innerHTML;
    projectEdit.value = project;

    return {newName, newNotes, newDate, projectEdit}
}


export {createEditForm, removeActiveEdit, presetEditForm};