import React, { Component } from 'react';
import { connect } from "react-redux";
import { View,TouchableWithoutFeedback,Keyboard,SafeAreaView,Modal } from "react-native";
import RNModal from "react-native-modal";
import NavHeader from "./header";
import EStyleSheet from "react-native-extended-stylesheet";
import RequestAccepted from './main/requestAccepted';
import Rate from "./main/rate";
const _ = require("lodash");

class Container extends Component{
    render() {
        const { showMenu,tempState } = this.props
        const styles = EStyleSheet.create({
            lightBlueColorBG:{ backgroundColor:"$lightBlueColor" },
            innerContainer:{ flex:1,backgroundColor:"white",borderTopRightRadius:showMenu? "20rem":0,borderTopLeftRadius:showMenu? "20rem":0,...this.props.style }
        })
        return (
            <TouchableWithoutFeedback style={{ flex:1 }} onPress={Keyboard.dismiss}>
                <View style={{flex:1}}>
                    <NavHeader {..._.omit(this.props,["children","style"])}/>

                    <View style={{ flex:1,...styles.lightBlueColorBG }}>
                        <View style={styles.innerContainer}>
                            {this.props.children}
                        </View>
                    </View>

                    <Modal visible={tempState.acceptedRequest != null}>
                        <RequestAccepted/>
                    </Modal>

                    <RNModal 
                        isVisible={tempState.rate != null}
                        backdropOpacity={.8}
                    >
                        <Rate {...tempState.rate}/>
                    </RNModal>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}
const state = state=>({
    tempState:state.tempState
})
export default connect(state)(Container)
