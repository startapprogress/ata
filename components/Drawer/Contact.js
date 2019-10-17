import React,{Component} from 'react'
import {connect} from 'react-redux'
import {View,Text,TextInput} from 'react-native'
class Contact extends Component{
    render(){
        return(
           <View>
               <TextInput placeHolder='شماره تلفن ثابت'/>
               <TextInput placeHolder=''/>
           </View>
        )
    }
}
export default connect()(Contact)