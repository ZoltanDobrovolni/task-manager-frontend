import React, {useState} from 'react';
import {DatePicker, Input, Modal} from "antd";
import moment from 'moment';

const EditTaskModal = ({isVisible, description, dueDate, handleOnClickSave, handleOnClickCancel}) => {

    const dateFormat = 'YYYY/MM/DD';

    const [currentDescription , setDescription] = useState(description || "");
    const [currentDueDate, setCurrentDueDate] = useState(dueDate);

    const handleOnChangeInputField = (value) => {
        setDescription(value);
    };

    const handleOnClickOkInDatePicker = (value) => {
        console.log("value datepicker", value); // todo delete
        setCurrentDueDate(value);
    }


    return (
        <>
            <Modal
                title="Basic Modal"
                visible={isVisible}
                onOk={() => handleOnClickSave(currentDescription, currentDueDate)}
                onCancel={handleOnClickCancel}
                okText={"Save"}
            >
                <p>"Creating new task"</p>
                <Input
                    value={currentDescription}
                    placeholder="Your task description"
                    autoFocus
                    onChange={event => {
                        handleOnChangeInputField(event.target.value)
                    }}
                />
                <br />
                <DatePicker
                    defaultValue={moment(currentDueDate, dateFormat)}
                    format={dateFormat}
                    onChange={(value) => handleOnClickOkInDatePicker(value.toISOString())}
                />
            </Modal>
        </>
    );
};

export default EditTaskModal;
