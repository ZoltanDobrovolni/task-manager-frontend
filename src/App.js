import React, {useEffect, useState} from 'react';
import 'antd/dist/antd.css';
import axios from 'axios';
import {Divider, Dropdown, Icon, Layout, Menu, Spin, Table} from "antd";

const {Content} = Layout;


function App() {
    const baseUrl = 'http://localhost:3002'; // todo configba
    const [loading, setLoading] = useState(true);
    const [tasks, setTasks] = useState([]);

    const getTasks = async () => {
        try {
            const tasks = await axios.get(baseUrl + '/tasks');
            const tasksWithKey = tasks.data.map(item => {
                return {key: item._id, ...item}
            })
            console.log(tasksWithKey);

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

    const menu = (
        <Menu>
            <Menu.Item>Action 1</Menu.Item>
            <Menu.Item>Action 2</Menu.Item>
        </Menu>
    );

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
        <a onClick={() => handleOnClickDelete(record._id)}>Delete</a>
        <Divider type="vertical"/>

        <a className="ant-dropdown-link">


                     <Dropdown overlay={menu}>
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
                {loading ?
                    <Spin tip="Loading..."/>
                    :
                    <Table dataSource={tasks} columns={columns}/>

                }
            </Content>
        </>
    );
}

export default App;
