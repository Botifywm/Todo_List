import { allProjects } from "./project";
import { allTodos } from "./todos";


function webStorage() {
    localStorage.setItem("allTodos", JSON.stringify(allTodos));
    localStorage.setItem("allProjects", JSON.stringify(allProjects));
    let allTodoSession = JSON.parse(localStorage.getItem('allTodos'));
    let allProjectSession = JSON.parse(localStorage.getItem('allProjects'));

    return {allTodoSession, allProjectSession}
}

export {webStorage}