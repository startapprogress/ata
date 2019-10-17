import React, { Component } from 'react';
import { Platform,ActivityIndicator,View } from "react-native";
import {  Header, Left, Body, Right, Button, Icon } from 'native-base';
import { withNavigation } from 'react-navigation';
import EStyleSheet from "react-native-extended-stylesheet";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { CText as Text} from "./customComponents";
import styles from 'rn-sliding-up-panel/libs/styles';

class NavHeader extends Component{
    render() {
        const { showMenu,backDisabled,loading,title } = this.props
        if(!showMenu) return null

        return(
            <View style={style.header}>
                <View style={{ justifyContent:"center",alignItems:"center" }}>
                    <Button transparent onPress={this.props.navigation.toggleDrawer}><Icon name="menu" style={[style.icon]}/></Button>
                </View>

                <View style={{ flexDirection:"row",justifyContent:"center",alignItems:"center",flex:1 }}>
                    {loading && <ActivityIndicator color="white" style={{ marginHorizontal:10 }}/>}
                    <Text style={style.titleText}>{title}</Text>
                </View>

                <View style={{ justifyContent:"center",alignItems:"center" }}>
                    <Button transparent  onPress={()=> this.props.navigation.goBack()} disabled={backDisabled}><Icon name="arrow-back" style={[style.icon,backDisabled && {opacity:0}]}/></Button>
                </View>
            </View>
        )
    }
}
const style = EStyleSheet.create({
    header:{ backgroundColor:"$lightBlueColor",height:Platform.OS=="android" ? hp("10%"):hp("10%"),flexDirection:"row",zIndex: 100 },
    icon:{ fontSize:Platform.OS == "ios"? "35rem":"30rem",color:"white" },
    titleText:{ color:"white",fontSize:"17rem",textAlign:"center" }
})
export default withNavigation(NavHeader)
