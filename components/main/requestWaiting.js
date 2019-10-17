import React, { Component } from 'react';
import { View,Image } from "react-native";
import { connect } from "react-redux";
import EStyleSheet from "react-native-extended-stylesheet";
import { CButton  as Button,CText as Text } from "./../customComponents";
import { request } from "./../../service";

class RequestWaiting extends Component{
    _cancel = ()=>{
        const { RID,onClose } = this.props
        request("POST","/api/CancelRequetUserBeforeAccept",{RequestId:RID,Description:""},
            ()=>{},
            (response)=>{
                switch (response) {
                    case "ok":
                        onClose();
                        break;
                
                    default:
                        break;
                }
            },
            ()=>{}
        )
    }

    render() {
        const { onClose,acceptedRequest } = this.props
        if(acceptedRequest !== null){
            onClose && onClose();
        }
        return (
            <View style={{ flex:1 }}>
                <Image source={require("./../../assets/animation.gif")} style={{ flex:1 }} resizeMode="contain"/>

                <Button title="لغو" onPress={()=> this._cancel()}/>
            </View>
        );
    }
}

const styles = EStyleSheet.create({

})

const state = state=>({
    configs:state.configs,
    acceptedRequest:state.tempState.acceptedRequest
})
export default connect(state)(RequestWaiting)