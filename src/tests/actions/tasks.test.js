import {setTasks} from "../../actions/tasks";

test("Should setup default tasks", () => {
    const tasks = setTasks();
    expect(tasks).toEqual({
        tasks: [],
        "type": "SET_TASKS",
    });
});

test("Test set tasks", () => {
    const tasks = setTasks({
        tasks: [
            {one: "random"}
        ]
    });

    expect(tasks).toEqual({
        tasks: [
            {one: "random"}
        ],
        "type": "SET_TASKS",
    });
});
