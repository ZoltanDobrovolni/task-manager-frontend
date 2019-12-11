import React, {useEffect, useState} from 'react';
import 'antd/dist/antd.css';
import axios from 'axios';
import {Button, Divider, Dropdown, Icon, Layout, Menu, Table} from "antd";
import EditTaskModal from "./modal/EditTaskModal";

const {Content} = Layout;


function App() {
    const baseUrl = 'http://localhost:3002'; // todo configba
    const [loading, setLoading] = useState(true);
    const [tasks, setTasks] = useState([]);
    const [taskForEdit, setTaskForEdit] = useState(null);

    const getTasks = async () => {
        try {
            const tasks = await axios.get(baseUrl + '/tasks');
            const tasksWithKey = tasks.data.map(item => {
                return {key: item._id, ...item}
            })
            console.log(tasksWithKey);  //  todo delete

            setTasks(tasksWithKey);
            setLoading(false);
        } catch (error) {
            alert(error);
            setLoading(false);
        }

    };

    useEffect(() => {
        getTasks();
    }, []);

    const handleOnClickAddTask = () => {
        setTaskForEdit({});
    };

    const handleOnClickDelete = async (id) => {
        setLoading(true);
        try {
            await axios.delete(baseUrl + `/tasks/${id}`);
            setTasks(tasks.filter((item) => item._id !== id))
            setLoading(false);
        } catch (e) {
            setLoading(false);
            console.error(e);
            alert(e);
        }
    };

    const handleOnClickReschedule = (id) => {
        console.log("onClick Resch", id); // todo delete
    };

    const handleOnClickEdit = (id) => {
        setTaskForEdit(tasks.find((task) => task._id === id))
    };

    const handleOnClickSaveTaskModal = async (description) => {
        const url = `${baseUrl}/tasks`;
        await axios({
            method: "POST",
            url: url,
            data: {description, ...taskForEdit}
        })
            .then(result => {
                setTaskForEdit(null);
                setTasks([...tasks, result.data])
            })
            .catch(err => {
                throw new Error(`Something happened while saving task. [${err}]`);
            })

    };

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

    console.log("taskForEdit", taskForEdit); // todo delete


    return (
        <>
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
        </>
    );
}

export default App;
