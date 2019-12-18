import React, {useEffect} from 'react';
import 'antd/dist/antd.css';
import axios from 'axios';
import {Button, Checkbox, Divider, Dropdown, Icon, Layout, Menu, Table} from "antd";
import {setTaskForEdit} from "./actions/taskForEdit";
import {setTasks} from "./actions/tasks";
import {loadingOff, loadingOn} from "./actions/loading";
import {connect} from "react-redux";
import EditTaskModal from "./components/modal/EditTaskModal";

const {Content} = Layout;

function App({tasks, taskForEdit, loading, dispatch}) {
    const baseUrl = 'http://localhost:3002'; // todo configba

    useEffect(() => {

        getTasks();

    }, []);


    const getTasks = async () => {
        try {
            const tasks = await axios.get(baseUrl + '/tasks');
            const tasksWithKey = tasks.data.map(item => ({
                key: item._id,
                ...item
            }));

            console.log("tasks", tasksWithKey); // todo delete

            dispatch(setTasks({tasks: tasksWithKey}))
            dispatch(loadingOff())
        } catch (error) {
            alert(error);
            dispatch(loadingOff())
        }

    };

    const handleOnClickAddTask = () => {
        dispatch(setTaskForEdit({taskForEdit: {}}));
    };

    const handleOnClickDelete = async (id) => {
        dispatch(loadingOn());
        try {
            await axios.delete(baseUrl + `/tasks/${id}`);
            dispatch(setTasks({
                tasks: tasks.filter((item) => item._id !== id)
            }));
            dispatch(loadingOff())
        } catch (e) {
            dispatch(loadingOff());
            console.error(e);
            alert(e);
        }
    };

    const handleOnClickReschedule = (id) => {
        console.log("onClick Reschedule", id); // todo delete
    };

    const handleOnClickEdit = (id) => {
        console.log("task to edit", tasks.find((task) => task._id === id));
        dispatch(setTaskForEdit({
            taskForEdit: tasks.find((task) => task._id === id)
        }))
    };

    const handleOnClickSaveTaskModal = (description) => {
        if (typeof taskForEdit._id === "undefined") {
            saveNewTask(description);
        } else {
            dispatch(setTaskForEdit({taskForEdit: null}));
            dispatch(loadingOff());

            updateTask({...taskForEdit, description})
                .then(result => {
                    const newTasks = tasks.filter(task => task._id !== taskForEdit._id);
                    newTasks.push(result.data);
                    dispatch(setTasks({tasks: newTasks}));
                })
                .catch(err => {
                    throw new Error(`Something happened while updating task. [${err}]`);
                });
        }
    };

    function saveNewTask(description) {
        axios({
            method: "POST",
            url: `${baseUrl}/tasks`,
            data: {...taskForEdit, description}
        })
            .then(result => {
                dispatch(setTaskForEdit({taskForEdit: null}));
                dispatch(setTasks({tasks: [...tasks, {key: result.data._id, ...result.data}]}));
            })
            .catch(err => {
                throw new Error(`Something happened while saving task. [${err}]`);
            })
    }

    function updateTask(taskForEdit) {
        return axios({
            method: "PATCH",
            url: `${baseUrl}/tasks/${taskForEdit._id}`,
            data: taskForEdit
        });
    }


    const handleOnClickCloseTaskModal = () => {
        dispatch(setTaskForEdit({taskForEdit: null}));
    };

    const handleOnChangeCheckbox = async (taskForEdit) => {
        try {
            const result = await updateTask({...taskForEdit, isCompleted: !taskForEdit.isCompleted});
            dispatch(setTasks({tasks: getUpdateTasksArray(result.data)}));
        } catch (e) {
            throw new Error(`Something happened while updating task. [${e}]`);
        }
    };

    const getUpdateTasksArray = (updatedTask) => {
        return tasks.map(task => {
            if (task._id === updatedTask._id) {
                return {
                    ...task,
                    ...updatedTask
                }
            } else {
                return task;
            }
        });
    };

    const toggleIsCompletedKeyInTasks = (taskId) => {
        return tasks.map(task => {
            if (task._id === taskId) {
                return {
                    ...task,
                    isCompleted: !task.isCompleted
                }
            } else {
                return task;
            }
        });
    }




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
            title: 'Completed',
            key: 'completed',
            render: (text, record) => (
                <span>
                    <Checkbox
                        onChange={() => handleOnChangeCheckbox(record)}
                        checked={record.isCompleted}
                    />
                </span>
            ),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
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
            <Content style={{margin: '24px 16px 0', overflow: 'initial'}}>
                {taskForEdit !== null &&
                <EditTaskModal handleOnClickCancel={handleOnClickCloseTaskModal}
                               handleOnClickSave={handleOnClickSaveTaskModal}
                               isVisible={taskForEdit !== null}
                               description={taskForEdit.description || ""}/>
                }
                <Button type="primary" onClick={handleOnClickAddTask}>
                    Add task
                </Button>
                <Table dataSource={tasks} columns={columns} loading={loading}/>
            </Content>
    );
}

const mapStateToProps = (state) => ({
    tasks: state.tasks,
    taskForEdit: state.taskForEdit,
    loading: state.loading
});

export default connect(mapStateToProps)(App);
