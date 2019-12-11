import React, {useState} from 'react';
import {Input, Modal} from "antd";

const EditTaskModal = ({isVisible, inputDescription, handleOnClickSave, handleOnClickCancel}) => {

    const [description , setDescription] = useState(inputDescription || "");

    const handleOnChangeInputField = (value) => {
        setDescription(value);
    };

    return (
        <>
            <Modal
                title="Basic Modal"
                visible={isVisible}
                onOk={() => handleOnClickSave(description)}
                onCancel={handleOnClickCancel}
                okText={"Save"}
            >
                <p>"Creating new task"</p>
                <Input
                    value={description}
                    placeholder="Your task description"
                    onChange={event => {
                        handleOnChangeInputField(event.target.value)
                    }}
                />
            </Modal>
        </>
    );
};

export default EditTaskModal;
