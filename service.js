const _ = require("lodash");
export const BASE_URL = "http://www.tebpasand.ir";
// import { checkInternetConnection } from 'react-native-offline';
import { myStore as store } from "./App";
// import { setTempStateRequest } from "./redux/actions/index";

export const request = async (method, url, data, startCB, successCB, errorCB) => {
    const sendRequest = () => {
        startCB && startCB();

        fetch(BASE_URL + url, {
                method: method,
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json; charset=utf-8"
                },
        })
        .then(response => response.json())
        .then(result => {
            successCB && successCB(result);
        })
        .catch(err => {
            errorCB && errorCB();
        })
    }
    sendRequest();
    // const isConnected = await checkInternetConnection();
    // if(isConnected){
    //   sendRequest();
    // }else{
    //   store.dispatch(setTempStateRequest(sendRequest))
    // }
}
