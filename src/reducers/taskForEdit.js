
const taskForEditReducerDefaultState = null;
const taskForEditReducer = (state = taskForEditReducerDefaultState, action) => {
    switch (action.type) {
        case 'SET_TASK_FOR_EDIT':
            return action.taskForEdit;
        default:
            return state;
    }
};

export default taskForEditReducer;
