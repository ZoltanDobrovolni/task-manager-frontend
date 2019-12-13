import React, {useEffect} from 'react';
import 'antd/dist/antd.css';
import axios from 'axios';
import {Button, Divider, Dropdown, Icon, Layout, Menu} from "antd";
import {combineReducers, createStore} from 'redux';

const {Content} = Layout;

function App() {
    const baseUrl = 'http://localhost:3002'; // todo configba
    // const [loading, setLoading] = useState(true);
    // const [tasks, setTasks] = useState([]);
    // const [taskForEdit, setTaskForEdit] = useState(null);

    const setTasks = ({tasks = []} = {}) => ({
        type: "SET_TASKS",
        tasks
    });

    const setTaskForEdit = ({taskForEdit = {}} = {}) => ({
        type: "SET_TASK_FOR_EDIT",
        taskForEdit
    });



    const tasksReducerDefaultState = [];
    const tasksReducer = (state = tasksReducerDefaultState, action) => {
        switch (action.type) {
            case 'SET_TASKS':
                return action.tasks;
            default:
                return state;
        }

    };

    const taskForEditReducerDefaultState = {};
    const taskforEditReducer = (state = taskForEditReducerDefaultState, action) => {
        switch (action.type) {
            case 'SET_TASK_FOR_EDIT':
                return action.taskForEdit;
            default:
                return state;
        }

    };

    const loadingReducer = (state = true, action) => {
        switch (action.type) {
            case 'LOADING_ON':
                return true;
            case 'LOADING_OFF':
                return  false;
            default:
                return state;
        }
    };


    useEffect(() => {
        // getTasks();
        const store = createStore(
            combineReducers({
                    tasks: tasksReducer,
                    loading: loadingReducer,
                    taskForEdit: taskforEditReducer
                }
            )
        );


        store.subscribe(() => {
            console.log(JSON.stringify(store.getState()));
        });

        store.dispatch(setTaskForEdit({taskForEdit: {name: "blabal"}}));

        store.dispatch(setTasks({tasks: []}));
        store.dispatch(setTasks({tasks: ["asdfasdf"]}));

        setTimeout(() => {
            store.dispatch({
                type: 'LOADING_OFF'
            });
            console.log(store.getState());
        }, 1000)

    });


    const getTasks = async () => {
        try {
            const tasks = await axios.get(baseUrl + '/tasks');
            const tasksWithKey = tasks.data.map(item => {
                return {key: item._id, ...item}
            })

            setTasks(tasksWithKey);
            // setLoading(false);
        } catch (error) {
            alert(error);
            // setLoading(false);
        }

    };

    const handleOnClickAddTask = () => {
        setTaskForEdit({});
    };

    const handleOnClickDelete = async (id) => {
        // setLoading(true);
        // try {
        //     await axios.delete(baseUrl + `/tasks/${id}`);
        //     setTasks(tasks.filter((item) => item._id !== id))
        //     setLoading(false);
        // } catch (e) {
        //     setLoading(false);
        //     console.error(e);
        //     alert(e);
        // }
    };

    const handleOnClickReschedule = (id) => {
        console.log("onClick Reschedule", id); // todo delete
    };

    const handleOnClickEdit = (id) => {
        // console.log("task to edit", tasks.find((task) => task._id === id));
        // setTaskForEdit(tasks.find((task) => task._id === id))
    };

    const handleOnClickSaveTaskModal = (description) => {
        // if (typeof taskForEdit._id === "undefined") {
        //     saveNewTask(description);
        // } else {
        //     updateTask(description);
        // }
    };

    function saveNewTask(description) {
        // axios({
        //     method: "POST",
        //     url: `${baseUrl}/tasks`,
        //     data: {...taskForEdit, description}
        // })
        //     .then(result => {
        //         setTaskForEdit(null);
        //         setTasks([...tasks, result.data])
        //     })
        //     .catch(err => {
        //         throw new Error(`Something happened while saving task. [${err}]`);
        //     })
    }

    function updateTask(description) {
        // axios({
        //     method: "PATCH",
        //     url: `${baseUrl}/tasks/${taskForEdit._id}`,
        //     data: {...taskForEdit, description}
        // })
        //     .then(result => {
        //         const newTasks = tasks.filter(task => task._id !== taskForEdit._id);
        //         newTasks.push(result.data);
        //         setTasks(newTasks);
        //         setTaskForEdit(null);
        //     })
        //     .catch(err => {
        //         throw new Error(`Something happened while updating task. [${err}]`);
        //     })
    }


    const handleOnClickCloseTaskModal = () => {
        setTaskForEdit(null);
    };

    const menu = (taskId) => {
        return (
            <Menu>
                <Menu.Item onClick={() => handleOnClickEdit(taskId)}>Edit</Menu.Item>
                <Menu.Item onClick={() => handleOnClickDelete(taskId)}>Delete</Menu.Item>
            </Menu>
        );
    };

    const columns = [
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Completed',
            dataIndex: 'isCompleted',
            key: 'isCompleted',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <span>
                    <a onClick={() => handleOnClickReschedule(record._id)}>Reschedule</a>
                    <Divider type="vertical"/>

                    <a className="ant-dropdown-link">
                         <Dropdown overlay={menu(record._id)}>
                          <a>
                            More <Icon type="down"/>
                          </a>
                         </Dropdown>
                    </a>
                </span>
            ),
        },
    ];


    return (
        <>
            <Content style={{margin: '24px 16px 0', overflow: 'initial'}}>
                {/*{taskForEdit !== null &&*/}
                {/*<EditTaskModal handleOnClickCancel={handleOnClickCloseTaskModal}*/}
                {/*               handleOnClickSave={handleOnClickSaveTaskModal}*/}
                {/*               isVisible={taskForEdit !== null}*/}
                {/*               description={taskForEdit.description || ""}/>*/}
                {/*}*/}
                <Button type="primary" onClick={handleOnClickAddTask}>
                    Add task
                </Button>
                {/*<Table dataSource={tasks} columns={columns} loading={loading}/>*/}
            </Content>
        </>
    );
}

export default App;
