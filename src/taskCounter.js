import { allTodos } from "./todos";
import { allProjects } from "./project";
import { filterTasks } from "./displayTask";

function countList() {
    const countTracker = new Map();
    const allLength = filterTasks().allTask().length;
    const todayLength = filterTasks().todayTask().length;
    const overdueLength = filterTasks().overdueTask().length;
    const completedLength = filterTasks().completedTasks().length;
    countTracker.set('All', allLength);
    countTracker.set('Today', todayLength);
    countTracker.set('Overdue', overdueLength);
    countTracker.set('Completed', completedLength);

    allProjects.forEach((project) => {
        const projectLength = filterTasks().projectTasks(project).length;
        countTracker.set(project, projectLength);
    })

    return {countTracker};
}

export {countList};