import { allTodos } from "./todos";
import {isPast, isToday } from "date-fns";

function filterTasks () {
    const allTask = () => allTodos.filter((obj) => obj.checklist === false);
    const todayTask = () => allTodos.filter((obj) => isToday(obj.dueDate) && obj.checklist === false);
    const overdueTask = () => allTodos.filter((obj) => isPast(obj.dueDate) && !isToday(obj.dueDate) && obj.checklist === false);
    const completedTasks = () => allTodos.filter((obj) => obj.checklist === true);
    const projectTasks = (header) => allTodos.filter((obj) => obj.project === header && obj.checklist === false);

    return {allTask, todayTask, overdueTask, completedTasks, projectTasks}

}


let displayTask = new Map();
displayTask.set('All', filterTasks().allTask);
displayTask.set('Today', filterTasks().todayTask);
displayTask.set('Overdue', filterTasks().overdueTask);
displayTask.set('Completed', filterTasks().completedTasks);

export {displayTask, filterTasks};

