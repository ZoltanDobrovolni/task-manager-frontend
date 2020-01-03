
const taskForRescheduleReducerDefaultState = null;
const taskForRescheduleReducer = (state = taskForRescheduleReducerDefaultState, action) => {
    switch (action.type) {
        case 'SET_TASK_FOR_RESCHEDULE':
            return action.taskForReschedule;
        default:
            return state;
    }
};

export default taskForRescheduleReducer;
