import React, { Component } from 'react';
import { connect } from "react-redux";
import { setTempState } from "./../../redux/actions/index";
import { View,Image as CImage } from "react-native";
import { CText as Text,CButton as Button } from "./../customComponents";
import { AirbnbRating } from 'react-native-ratings';
import { lang } from "./../../lang";
import EStyleSheet from "react-native-extended-stylesheet";
import { request,BASE_URL } from "./../../service";
const _ = require("lodash");

class Rate extends Component{
    state = {
        loading:false
    }
    rate = 0

    _rate = ()=>{
        const { RequestId } = this.props
        request("POST","/api/RateUserToServiceMan",{ Number:this.rate,RequestId },
            ()=>{ this.setState({ loading:true }) },
            (response)=>{
                this.setState({ loading:false },()=>{
                    if(response == "ok") this.props.setTempState({ state:"rate",value:null });
                })
            },
            ()=>{ this.setState({ loading:false }) }
        )
    }

    render(){
        const { loading } = this.state
        const { Image } = this.props
        return(
            <View style={{ backgroundColor:"white",padding:10,borderRadius:10 }}>
                <Text style={styles.title}>با تشکر از استفاده از این نرم‌افزار. میزان رضایت خود را از خدمت دهنده گزارش دهید.</Text>
                <CImage source={{uri:BASE_URL + `/Images/Service/Img/${Image}`}} style={styles.img}/>
                <AirbnbRating
                    type='star'
                    showRating={false}
                    size={40}
                    defaultRating={this.rate}
                    onFinishRating={e=> this.rate = e}
                />
                <View style={{ flexDirection:"row",marginTop:20 }}>
                    <Button title="ثبت امتیاز" loading={loading} onPress={this._rate} containerStyle={{ flex:1 }}/>
                    <Button title="بیخیال" onPress={()=> this.props.setTempState({ state:"rate",value:null })} containerStyle={{ backgroundColor:"white",borderColor:"#D82424",borderWidth:2 }} titleStyle={{ color:"#D82424" }}/>
                </View>
            </View>
        )
    }
}

const styles = EStyleSheet.create({
    title:{ fontSize:"16rem",color:"gray", },
    img:{  width:"100rem",height:"100rem",alignSelf:"center",margin:"5rem",borderRadius:"50rem" },
})

export default connect(null,{ setTempState })(Rate)