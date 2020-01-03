import {combineReducers, createStore} from "redux";
import tasksReducer from "../reducers/tasks";
import taskForEditReducer from "../reducers/taskForEdit";
import loadingReducer from "../reducers/loading";
import taskForRescheduleReducer from "../reducers/taskForReschedule";

const configureStore = () => {
    return createStore(
        combineReducers({
                tasks: tasksReducer,
                taskForEdit: taskForEditReducer,
                taskForReschedule: taskForRescheduleReducer,
                loading: loadingReducer
            }
        )
    );
};

export default configureStore;
