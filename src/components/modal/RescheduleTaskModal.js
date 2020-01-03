import React, {useState} from 'react';
import {DatePicker, Modal} from "antd";
import moment from 'moment';

const RescheduleTaskModal = ({isVisible, dueDate, handleOnClickSave, handleOnClickCancel}) => {

    const displayDateFormat = 'YYYY/MM/DD';
    const isoDateFormatFromDb = "YYYY-MM-DDTHH:mm:ss.sssZ";

    const [currentDueDate, setCurrentDueDate] = useState(dueDate);

    const handleOnClickOkInDatePicker = (value) => {
        setCurrentDueDate(value);
    }

    const defaultDateValue = currentDueDate === null ? null : moment(currentDueDate, isoDateFormatFromDb);

    return (
        <>
            <Modal
                title="Reschedule"
                visible={isVisible}
                onOk={() => handleOnClickSave(currentDueDate)}
                onCancel={handleOnClickCancel}
                okText={"Save"}
            >
                <p>"Reschedule task"</p>
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

export default RescheduleTaskModal;
