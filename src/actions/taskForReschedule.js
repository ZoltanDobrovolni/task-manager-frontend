
export const setTaskForReschedule = ({taskForReschedule = {}} = {}) => ({
    type: "SET_TASK_FOR_RESCHEDULE",
    taskForReschedule
});
