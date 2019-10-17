import React, { Component } from 'react';
import { View,TouchableOpacity,Image as CImage,ScrollView,Modal } from "react-native";
import { connect } from "react-redux";
import { request,BASE_URL } from "./../../service";
import { CText as Text,CButton as Button,CTextInput as TextInput } from "./../customComponents";
import { EnToFa,ReverseGeocoding } from "./../../mixin";
import EStyleSheet from "react-native-extended-stylesheet";
import MapView,{ Marker,AnimatedRegion, Animated } from 'react-native-maps';
import Permissions from 'react-native-permissions';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Container from "./../container";
import RequestWaiting from './requestWaiting';
import RNModal from "react-native-modal";
import { lang } from "./../../lang";
import R from "reactotron-react-native"
const _ = require("lodash");

class Center extends Component{
    render() {
        const { ServiceId,CenterName,Image,onPress,selectedItem } = this.props
        return (
            <TouchableOpacity style={[styles.centerContainer,styles.shadow]} activeOpacity={.7} onPress={onPress}>
                <CImage source={{uri:BASE_URL + `/Images/Service/Img/${Image}`}} style={[styles.centerImage,{opacity:selectedItem == ServiceId? 1:.7}]} resizeMode="contain"/>
                <Text style={selectedItem != ServiceId? styles.centerName : [styles.centerName,styles.selectedCenterName]}>{EnToFa(CenterName)}</Text>
            </TouchableOpacity>
        );
    }
}

class MapCenter extends Component{
    constructor(props){
        super(props);
        this.state = {
            region: new AnimatedRegion({
                latitude: 35.7501503,
                longitude: 51.3674984,
                latitudeDelta: 0.0111,
                longitudeDelta: 0.0111
            }),
            
            list:[],
            loading:false,
            selectedItem:null,
            selectedLocation:null,
    
            sendRequestModalVisible:false,
            sendRequestLoading:false,
            address:"",
            requestWaitingModal:false,
            strings:{}
        }

        this.item = this.props.navigation.getParam("item",{});
        this.RID = null
    }

    async componentDidMount(){
        try {
            const langs = await lang()
            const strings = { 
                ...langs.mapCenter,
                ...langs.globals 
            };
            this.setState({ strings })
        } catch (error) {
            
        }

        this._getLocation();
    }
    
    _getLocation = ()=>{
        const _get = ()=>{
            this.setState({ locationLoading:true,locationErr:false })
            navigator.geolocation.getCurrentPosition(
                position => {
                    const { latitude,longitude } = position.coords;
                    this.setState({ 
                        region: new AnimatedRegion({
                            // latitude,
                            // longitude,
                            latitude: 35.7501503,
                            longitude: 51.3674984,
                            latitudeDelta: 0.0111,
                            longitudeDelta: 0.0111
                        }),
                    });
                    this._updateMarkedLocation({latitude: 35.7501503,
                        longitude: 51.3674984})
                },
                (err)=> {
                    setTimeout(()=> _get(),1000);
                    this.setState({ locationErr:true,locationLoading:false })
                }
            )
        }


        Permissions.check('location').then(response => {
            if(response == "denied"){
              this.setState({ locationPermissionErr:true })
              return
            }
            else if(response != "authorized"){
              Permissions.request('location').then(response => {
                
              }).catch(err=> alert(err))
            }else{
                _get();
            }
        }).catch((err) => {})
    }

    _itemPressed = center => {
        const { selectedItem } = this.state
        const { Lat,Long,ServiceId } = center
        this.setState({ 
            region: new AnimatedRegion({
                latitude: Lat,
                longitude: Long,
                latitudeDelta: 0.0111,
                longitudeDelta: 0.0111
            }),
            selectedItem:selectedItem == ServiceId ? null : ServiceId 
        });
    }

    _updateMarkedLocation = LatLong => {
        this.setState({ 
            selectedLocation:LatLong,
            region:new AnimatedRegion({
                ...LatLong,
                latitudeDelta: 0.0111,
                longitudeDelta: 0.0111
            }),
            
        },this._getList)

        ReverseGeocoding(LatLong,
            (data)=>{ 
                if(data.status == "OK" && data.results.length > 0){
                    const address = data.results[0].formatted_address;
                    this.setState({ address })
                }
            },
            ()=>{}
        )
    }

    _getList = ()=>{
        const { latitude,longitude } = this.state.selectedLocation
        request("POST","/api/ListServiceMan",{Lat:latitude,Long:longitude,ParentCategory:this.item.CategoryId},
            ()=>{ this.setState({loading:true}) },
            (list)=>{ this.setState({ loading:false,list }) },
            ()=>{ this.setState({loading:false}) },
        )
    }

    _sendRequest = ()=>{
        const { selectedLocation,address,selectedItem } = this.state;
        const { latitude,longitude } = selectedLocation
        const { PhoneNumber,PID } = this.props.configs
        const obj = {Location:address,Lat:latitude,Long:longitude,UserPhone:PhoneNumber,CategoryServiceId:this.item.CategoryId,P_ID:PID,Price:0,ServiceId:selectedItem}
        request("POST",`/api/${selectedItem?"RequestServiceForSpicialServiceMan":"RequestService"}`,obj,
            ()=>{ this.setState({ sendRequestLoading:true }) },
            (response)=>{
                this.RID = response
                this.setState({ sendRequestLoading:false,sendRequestModalVisible:false,requestWaitingModal:true })
            },
            ()=>{ this.setState({ sendRequestLoading:false }) },
        )
    }
    
    render() {
        const { 
            region,list,loading,selectedItem,selectedLocation,address,
            sendRequestModalVisible,sendRequestLoading,requestWaitingModal
        } = this.state
        const { TITLE,REQUEST,SEND_REQUEST,ADDRESS } = this.state.strings
        return (
            <Container showMenu={true} title={TITLE} loading={loading}>
                <View style={styles.container}>
                    <Animated
                        initialRegion={region}
                        region={region}
                        style={{ flex:1 }}
                        showsUserLocation
                        onLongPress={e=> this._updateMarkedLocation(e.nativeEvent.coordinate)}
                    >
                        {_.map(list,center=> <Marker coordinate={{ latitude: center.Lat ,longitude: center.Long }} key={center.ServiceId} title={center.centerName}/> )}
                        {selectedLocation && 
                            <Marker 
                                coordinate={{ latitude: selectedLocation.latitude ,longitude: selectedLocation.longitude }} 
                                key={"000"} 
                                draggable 
                                onDragEnd={e=> this._updateMarkedLocation(e.nativeEvent.coordinate)}
                                pinColor="#4ba7fd"
                            />
                        }
                    </Animated>

                    <View style={styles.btnPanel}>
                        <ScrollView horizontal>
                            {_.map(list,(center,index)=> <Center selectedItem={selectedItem} key={index} {...center} onPress={()=> this._itemPressed(center)}/>)}
                        </ScrollView>

                        <Button title={REQUEST} onPress={()=> this.setState({ sendRequestModalVisible:true })}/>
                    </View>
                </View>

                <RNModal 
                    isVisible={sendRequestModalVisible}
                    onBackButtonPress={()=> this.setState({ sendRequestModalVisible:false })}
                    onBackdropPress={()=> this.setState({ sendRequestModalVisible:false })}
                >
                    <View style={styles.modalContainer}>
                        <TextInput multiline numberOfLines={2} value={address} placeholder={ADDRESS} onChangeText={address=> this.setState({ address })}/>
                        <Button title={SEND_REQUEST} loading={sendRequestLoading} containerStyle={{ borderRadius:5 }} onPress={this._sendRequest}/>
                    </View>
                </RNModal>

                <Modal visible={requestWaitingModal} animationType="slide" onRequestClose={()=> this.setState({ requestWaitingModal:false })}>
                    <RequestWaiting onClose={()=> this.setState({ requestWaitingModal:false })} RID={this.RID}/>
                </Modal>
            </Container>
        );
    }
}

const styles = EStyleSheet.create({
    shadow:{
        elevation:5,
        shadowColor:"$lightBlueColor",
        shadowOffset:{width: 0,height: 0},
        shadowOpacity:.5,
        shadowRadius:5,
    },
    container:{ flex:1,overflow:"hidden",borderTopRightRadius:"20rem",borderTopLeftRadius:"20rem" },

    btnPanel:{ position:"absolute",bottom:"10rem",right:"5rem",left:"5rem",height:"185rem" },
    centerContainer:{ width:"100rem",height:"110rem",backgroundColor:"white",justifyContent:"center",alignItems:"center",marginHorizontal:"5rem",borderRadius:"5rem" },
    centerImage:{ width:"75rem",height:"75rem",borderRadius:"5rem" },
    centerName:{ textAlign:"center",fontSize:"13rem" },
    selectedCenterName:{ fontSize:"14rem",color:"$lightBlueColor" },

    modalContainer:{ backgroundColor:"white",padding:"19rem",borderRadius:"10rem" }
})

const state = state=>({
    configs:state.configs,
})

export default connect(state)(MapCenter)