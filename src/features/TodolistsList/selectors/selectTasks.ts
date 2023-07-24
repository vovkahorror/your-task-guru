import {AppRootStateType} from "../../../app/store";

export const selectTasks = (todolistId: string) => (state: AppRootStateType) => state.tasks[todolistId]