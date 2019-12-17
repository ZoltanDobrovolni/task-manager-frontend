
const loadingReducer = (state = true, action) => {
    switch (action.type) {
        case 'LOADING_ON':
            return true;
        case 'LOADING_OFF':
            return  false;
        default:
            return state;
    }
};

export default loadingReducer;
