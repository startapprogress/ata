import {View,Text,StyleSheet} from 'react-native'
import React,{Component} from 'react'
export default class Ata extends Component{
    componentDidMount(){
        setTimeout(()=>{
            this.props.navigation.navigate('splash')
        },2000)
    }
    render(){
        return(

                <View style={styles.Container}>
                    <Text style={styles.Text}>اپلیکیشن اطا</Text>
                </View>

        )
    }
}
const styles=StyleSheet.create({
    Container:{
        flex:1,
        justifyContent:"center",
        alignItems:"center"
    },
    Text:{
        fontSize:20,
        color:"black"
    }
})