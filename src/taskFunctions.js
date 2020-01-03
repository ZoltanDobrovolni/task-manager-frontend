const compareTaskFunction = (a, b) => {
    if (a.isCompleted === b.isCompleted ) {
        const aDateObject = new Date(a.dueDate);
        const bDateObject = new Date(b.dueDate);
        return aDateObject.getTime() - bDateObject.getTime()
    } else if (b.isCompleted) {
        return -1;
    }
};

export const orderAndAddKey = (tasks) => {
    const tasksWithKey = tasks.map(item => ({
        key: item._id,
        ...item
    }));

    tasksWithKey.sort(compareTaskFunction);

    return tasksWithKey;
};

