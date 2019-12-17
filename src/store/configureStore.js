import {combineReducers, createStore} from "redux";
import tasksReducer from "../reducers/tasks";
import taskForEditReducer from "../reducers/taskForEdit";
import loadingReducer from "../reducers/loading";

const configureStore = () => {
    return createStore(
        combineReducers({
                tasks: tasksReducer,
                taskForEdit: taskForEditReducer,
                loading: loadingReducer
            }
        )
    );
};

export default configureStore;
