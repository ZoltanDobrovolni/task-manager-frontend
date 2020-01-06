import React, {useEffect} from 'react';
import 'antd/dist/antd.css';
import axios from 'axios';
import {Button, Checkbox, Dropdown, Icon, Layout, Menu, Table} from "antd";
import {setTaskForEdit} from "./actions/taskForEdit";
import {setTasks} from "./actions/tasks";
import {loadingOff, loadingOn} from "./actions/loading";
import {connect} from "react-redux";
import EditTaskModal from "./components/modal/EditTaskModal";
import moment from "moment";
import {setTaskForReschedule} from "./actions/taskForReschedule";
import Divider from "antd/es/divider";
import RescheduleTaskModal from "./components/modal/RescheduleTaskModal";

const {Content} = Layout;

function App({tasks, taskForEdit, taskForReschedule, loading, dispatch}) {

    const displayDateFormat = 'YYYY/MM/DD';
    const isoDateFormatFromDb = "YYYY-MM-DDTHH:mm:ss.sssZ";

    // const baseUrl = 'http://localhost:3002'; // todo configba
    const baseUrl = ' https://ftv5pqhqie.execute-api.eu-central-1.amazonaws.com/dev'; // todo configba

    useEffect(() => {
        fetchAndSetTasks();
    }, []);

    async function fetchAndSetTasks() {
        try {
            const tasks = await axios.get(baseUrl + '/tasks');

            dispatch(setTasks({tasks: tasks.data}));
            dispatch(loadingOff());
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
                tasks: tasks.filter((item) => item.id !== id)
            }));
            dispatch(loadingOff())
        } catch (e) {
            dispatch(loadingOff());
            console.error(e);
            alert(e);
        }
    };

    const handleOnClickReschedule = (id) => {
        dispatch(setTaskForReschedule({
            taskForReschedule: tasks.find(task => task.id === id)
        }));
    };

    const handleOnClickEdit = (id) => {
        dispatch(setTaskForEdit({
            taskForEdit: tasks.find((task) => task.id === id)
        }))
    };

    const handleOnClickSaveTaskModal = async (description, dueDate) => {
        dispatch(loadingOn());
        if (typeof taskForEdit.id === "undefined") {
            try {
                const newTask = await saveNewTask(description, dueDate);
                dispatch(loadingOff());
                dispatch(setTasks({tasks: [...tasks, {key: newTask.data.id, ...newTask.data}]}));
                dispatch(setTaskForEdit({taskForEdit: null}));
            } catch (err) {
                dispatch(loadingOff());
                dispatch(setTaskForEdit({taskForEdit: null}));
                throw new Error(`Something happened while saving task. [${err}]`);
            }
        } else {
            try {
                const result = await updateTask({...taskForEdit, description, dueDate})
                const newTasks = tasks.map(task => {
                    if (task.id === taskForEdit.id) {
                        return result.data;
                    }
                    return task;
                });
                dispatch(setTasks({tasks: newTasks}));
                dispatch(loadingOff());
                dispatch(setTaskForEdit({taskForEdit: null}));

            } catch (err) {
                dispatch(loadingOff());
                dispatch(setTaskForEdit({taskForEdit: null}));
                throw new Error(`Something happened while updating task. [${err}]`);
            }

        }
    };

    const handleOnClickSaveRescheduleModal = async (dueDate) => {
        dispatch(loadingOn());
        try {
            const result = await updateTask({...taskForReschedule, dueDate})
            const newTasks = tasks.map(task => {
                if (task.id === taskForReschedule.id) {
                    return result.data;
                }
                return task;
            });
            dispatch(setTasks({tasks: newTasks}));
            dispatch(loadingOff());
            dispatch(setTaskForReschedule({taskForReschedule: null}));

        } catch (err) {
            dispatch(loadingOff());
            dispatch(setTaskForReschedule({taskForReschedule: null}));
            throw new Error(`Something happened while updating task. [${err}]`);
        }
    };

    async function saveNewTask(description, dueDate) {
        return axios({
            method: "POST",
            url: `${baseUrl}/tasks`,
            data: {...taskForEdit, description, dueDate}
        });
    }

    function updateTask(taskForEdit) {
        return axios({
            method: "PATCH",
            url: `${baseUrl}/tasks/${taskForEdit.id}`,
            data: taskForEdit
        });
    }

    const handleOnClickCloseTaskModal = () => {
        dispatch(setTaskForEdit({taskForEdit: null}));
    };

    const handleOnClickCloseRescheduleModal = () => {
        dispatch(setTaskForReschedule({taskForReschedule: null}));
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
            if (task.id === updatedTask.id) {
                return {
                    ...task,
                    ...updatedTask
                }
            } else {
                return task;
            }
        });
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
            title: 'Due Date',
            dataIndex: 'dueDate',
            key: 'dueDate',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <span>
                    <a onClick={() => handleOnClickReschedule(record.id)}>Reschedule</a>
                    <Divider type="vertical"/>

                    <a className="ant-dropdown-link">
                         <Dropdown overlay={menu(record.id)}>
                          <a>
                            More <Icon type="down"/>
                          </a>
                         </Dropdown>
                    </a>
                </span>
            ),
        },
    ];

    const tasksWithFormattedDate = tasks.map(task => ({
        ...task,
        dueDate: task.dueDate === null ? '' : moment(task.dueDate, isoDateFormatFromDb).format(displayDateFormat)
    }));
    return (
        <Content style={{margin: '24px 16px 0', overflow: 'initial'}}>
            {taskForEdit !== null &&
            <EditTaskModal
                handleOnClickCancel={handleOnClickCloseTaskModal}
                handleOnClickSave={handleOnClickSaveTaskModal}
                isVisible={taskForEdit !== null}
                description={taskForEdit.description || ""}
                dueDate={taskForEdit.dueDate || null}
            />
            }
            {taskForReschedule !== null &&
            <RescheduleTaskModal
                handleOnClickCancel={handleOnClickCloseRescheduleModal}
                handleOnClickSave={handleOnClickSaveRescheduleModal}
                isVisible={taskForReschedule !== null}
                dueDate={taskForReschedule.dueDate || null}
            />
            }

            <Button type="primary" onClick={handleOnClickAddTask}>
                Add task
            </Button>
            <Table dataSource={tasksWithFormattedDate} columns={columns} loading={loading}/>
        </Content>
    );
}

const mapStateToProps = (state) => ({
    tasks: state.tasks,
    taskForEdit: state.taskForEdit,
    taskForReschedule: state.taskForReschedule,
    loading: state.loading
});

export default connect(mapStateToProps)(App);
