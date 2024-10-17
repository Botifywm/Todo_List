import { formatDate, startOfDay, startOfToday } from "date-fns";
import { allProjects } from "./project";
import { displayPage } from "./dynamicSwitch";
import ShortUniqueId from 'short-unique-id';
import { webStorage } from "./storage";


class Todo {
    constructor(title, notes, dueDate, priority, project, checklist, uuid) {
        this.title = title;
        this.notes = notes;
        this.dueDate = dueDate;
        this.priority = priority;
        this.project = project;
        this.checklist = checklist;
        this.uuid = uuid;
    }
}

let allTodos = [];

// generate unique id
const uid = new ShortUniqueId({ length: 10 });


function createTodo () {
    const titleInput = document.querySelector('.titleInput').value;
    const dueDate = document.querySelector('.dateInput').value;
    const priority = document.querySelector('.priorityInput').value;
    const todoNotes = document.querySelector('.areaInput').value;
    const projectKey = document.querySelector('.projectInput').value;;
    const checklist = false;
    const uuid = uid.rnd();
    const newTodo = new Todo(titleInput, todoNotes, dueDate, priority, projectKey, checklist, uuid);
    allTodos.push(newTodo);
    const {header, map} = displayPage(dueDate, projectKey);
    webStorage();
    
    return {titleInput, dueDate, priority, todoNotes, projectKey, uuid, header, map};
}


export {allTodos, createTodo};

