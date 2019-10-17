import {
    SET_TEMP_STATE,SET_TEMP_STATE_REQUEST,REMOVE_TEMP_STATE_REQUEST
} from "../actions/type";

export default tempState = (state = { requests:[],acceptedRequest:null } , action = {}) => {
    switch (action.type) {
        case SET_TEMP_STATE:
            return {
                ...state,
                [action.state]:action.value
            }
            break;
        case SET_TEMP_STATE_REQUEST:
            return {
                ...state,
                requests:[...state.requests,action.value]
            }
            break;
        case REMOVE_TEMP_STATE_REQUEST:
          state.requests.splice(0,1)
          return {
            ...state,
            request:[...state.requests]
          }
        default:
            return state;
            break;
    }
}
