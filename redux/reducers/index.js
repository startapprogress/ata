import { combineReducers } from 'redux';
import configs from './configsReducer';
import tempState from "./tempState";
const rehydrated = (state = false , action) => {
    switch (action.type) {
        case "persist/REHYDRATE" :
            return true;
            break;
        default:
            return state;
    }
}

export default combineReducers({
    rehydrated,
    tempState,
    configs,
});
