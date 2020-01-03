import {orderAndAddKey} from "../taskFunctions";

const tasksReducerDefaultState = [];
const tasksReducer = (state = tasksReducerDefaultState, action) => {
    switch (action.type) {
        case 'SET_TASKS':
            return orderAndAddKey(action.tasks);
        default:
            return state;
    }

};

export default tasksReducer;
