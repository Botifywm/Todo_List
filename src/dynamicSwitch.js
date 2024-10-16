import { isToday } from "date-fns";
import { displayTask } from "./displayTask";
import { allTodos } from "./todos";

function displayPage(date, projectKey) {
    let header = 'All';
    let map = displayTask;
    const dueDateBool = isToday(date);
    if (projectKey === 'General'){
        if (dueDateBool) {
            header = 'Today';
        }
    }
    else {
        header = projectKey;
        map = allTodos;
    }
    return {header, map};
}

export {displayPage};