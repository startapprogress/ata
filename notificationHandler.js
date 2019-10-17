import { DeviceEventEmitter } from "react-native";
import { myStore as store } from "./App";
import { setConfigs,setTempState } from "./redux/actions/index";
import { request } from "./service";
import Pushe from 'react-native-pushe';
import R from "reactotron-react-native";
const _ = require("lodash");

export const init = ()=>{
    Pushe.initialize(true);
    Pushe.getPusheId(savePID);
    DeviceEventEmitter.addListener('NewMessage',e => routing(JSON.parse(e)));
}

export const savePID = (newPID)=>{
    const { PID,UserId } = store.getState().configs
    R.log(newPID)
    if(newPID != PID){
        request("POST","/api/jsonCreateUserPid",{ userid:UserId,PID:newPID },
            ()=>{},
            (res)=>{
                R.log(res);
                store.dispatch(setConfigs({ PID:newPID }));
            },
            ()=>{}
        )
    }
}

export const routing = (json)=>{
    R.log(json);
    const data = _.omit(json,["Type","types"])
    const { Category,RequestId,SericeManName,Address,Price,PhoneNumber,Image } = data
    switch (json.Type) {
        case "ACCEPT_REQUEST":
            store.dispatch(setTempState({state:"acceptedRequest",value:data}))
            break;

        case "CANCEL_REQUEST":
            store.dispatch(setTempState({state:"acceptedRequest",value:null}))
            break;

        case "FINISH_SERVICE":
            const acceptedRequest = store.getState().tempState.acceptedRequest
            store.dispatch(setTempState({ state:"rate",value: acceptedRequest }));
            store.dispatch(setTempState({ state:"acceptedRequest",value:null }));
            break;
        default:
            break;
    }
}