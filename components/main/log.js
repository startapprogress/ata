import React, { Component } from 'react';
import { FlatList,TouchableOpacity,View } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import { connect } from "react-redux";
import Container from "./../container";
import { request } from "./../../service";
import { lang } from "./../../lang";
import { CText as Text } from "./../customComponents";
import { EnToFa,ToPrice } from "./../../mixin";
import R from "reactotron-react-native";

class Item extends Component{
    
    render() {
        const { ServiceName,AppDate,ServiceMan,Price,Rate,Address } = this.props
        const { PRICE_UNIT } = this.props.strings
        return (
            <TouchableOpacity style={styles.itemContainer}>
                <View style={{ flexDirection:"row" }}>
                    <Text style={styles.serviceName}>{EnToFa(ServiceName)}</Text>
                    <Text style={styles.serviceMan}>{EnToFa(ServiceMan)}</Text>
                </View>
                <Text style={styles.price}>{`${EnToFa(ToPrice(Price))} ${PRICE_UNIT}`}</Text>
                <Text style={styles.address} numberOfLines={5}>{EnToFa(Address)}</Text>
            </TouchableOpacity>
        );
    }
}

class Log extends Component{
    state = {
        loading:false,
        list:[],
        strings:{}
    }

    async componentDidMount(){
        try {
            const langs = await lang()
            const strings = { 
                ...langs.log,
                ...langs.globals 
            };
            this.setState({ strings })
        } catch (error) {
            
        }
        this._getLogList()
    }

    _getLogList = ()=>{
        const { UserId } = this.props.configs
        request("POST","/api/Listuserservice",{userid:UserId},
            ()=>{ this.setState({ loading:true }) },
            (list)=>{
                this.setState({ loading:false,list })
            },
            ()=>{ this.setState({ loading:false }) },
        )
    }

    render() {
        const { loading,list } = this.state
        const { TITLE,PRICE_UNIT } = this.state.strings
        return (
            <Container showMenu title={TITLE}>
                <FlatList
                    data={list}
                    renderItem={({item})=> <Item { ...item } strings={{ PRICE_UNIT }}/>}
                    keyExtractor={(item)=> `${item.RequestId}`}
                    style={{ height: "100%" }}
                    contentContainerStyle={{ justifyContent:"flex-start",alignItems:"stretch",paddingBottom: 10 }}
                    onRefresh={this._getLogList}
                    refreshing={loading}
                    horizontal={false}
                    alwaysBounceVertical={true}
                />
            </Container>
        );
    }
}

const styles = EStyleSheet.create({
    itemContainer:{ margin:"10rem",marginVertical:0,marginTop:"10rem",backgroundColor:"$lightBlueColor",padding:"10rem",borderRadius:"5rem" },
    serviceName:{ color:"white",flex:1 },
    serviceMan:{ color:"white" },
    address:{ color:"white" },
    price:{ color:"white" }
})

const state = state=>({
    configs:state.configs
})
export default connect(state)(Log)