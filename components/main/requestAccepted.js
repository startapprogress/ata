import React, { Component } from 'react';
import { View } from "react-native";
import { setTempState } from "./../../redux/actions/index";
import { connect } from "react-redux";
import EStyleSheet from "react-native-extended-stylesheet";
import { CButton  as Button,CText as Text } from "./../customComponents";
import { request } from "./../../service";

class RequestAccepted extends Component{
    _cancel = ()=>{
        const { RequestId } = this.props.tempState.acceptedRequest
        const { onClose } = this.props
        request("POST","/api/CancelRequetUser",{FinalId:RequestId,Description:""},
            ()=>{},
            (response)=>{
                switch (response) {
                    case "ok":
                        onClose && onClose();
                        this.props.setTempState({state:"acceptedRequest",value:null})
                        break;
                
                    default:
                        break;
                }
            },
            ()=>{}
        )
    }

    render() {
        return (
            <View style={{ flex:1 }}>
                <Text>تایید شد</Text>
                <Button title="لغو" onPress={()=> this._cancel()}/>
            </View>
        );
    }
}

const styles = EStyleSheet.create({

})

const state = state=>({
    configs:state.configs,
    tempState:state.tempState
})

export default connect(state,{setTempState})(RequestAccepted)