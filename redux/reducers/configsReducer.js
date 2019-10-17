import {
    SET_CONFIGS,RESET_CONFIG
} from "../actions/type";

const initialState = { PID:"",Name:"" }

export default configs = (state = initialState , action = {}) => {
    switch (action.type) {
        case SET_CONFIGS:
            const { configs } = action;
            return {
                ...state,
                ...configs
            }
        case RESET_CONFIG:
            return {}
        default:
            return state;
    }
}
