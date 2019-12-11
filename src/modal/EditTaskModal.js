import React, {useState} from 'react';
import {Input, Modal} from "antd";

const EditTaskModal = ({isVisible, description, handleOnClickSave, handleOnClickCancel}) => {

    const [currentDescription , setDescription] = useState(description || "");

    const handleOnChangeInputField = (value) => {
        setDescription(value);
    };

    return (
        <>
            <Modal
                title="Basic Modal"
                visible={isVisible}
                onOk={() => handleOnClickSave(currentDescription)}
                onCancel={handleOnClickCancel}
                okText={"Save"}
            >
                <p>"Creating new task"</p>
                <Input
                    value={currentDescription}
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
