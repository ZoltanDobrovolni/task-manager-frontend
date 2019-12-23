import React, {useState} from 'react';
import {DatePicker, Input, Modal} from "antd";
import moment from 'moment';

const EditTaskModal = ({isVisible, description, dueDate, handleOnClickSave, handleOnClickCancel}) => {

    const displayDateFormat = 'YYYY/MM/DD';
    const isoDateFormatFromDb = "YYYY-MM-DDTHH:mm:ss.sssZ";

    const [currentDescription , setDescription] = useState(description || "");
    const [currentDueDate, setCurrentDueDate] = useState(dueDate);

    const handleOnChangeInputField = (value) => {
        setDescription(value);
    };

    const handleOnClickOkInDatePicker = (value) => {
        setCurrentDueDate(value);
    }

    const defaultDateValue = currentDueDate === null ? null : moment(currentDueDate, isoDateFormatFromDb);

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
                <br/>
                <DatePicker
                    defaultValue={defaultDateValue}
                    format={displayDateFormat}
                    onChange={(value) => handleOnClickOkInDatePicker(value.toISOString())}
                />
            </Modal>
        </>
    );
};

export default EditTaskModal;
