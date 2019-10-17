import React, { Component,PureComponent } from 'react';
import EStyleSheet from "react-native-extended-stylesheet";
import { Text,TouchableOpacity,View,Dimensions,BackHandler,TextInput,ActivityIndicator } from "react-native";
import ModalFilterPicker from 'react-native-modal-filter-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import SlidingUpPanel from 'rn-sliding-up-panel';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
const _ = require("lodash");

export class CTextInput extends PureComponent{
    render() {
        const { error } = this.props
        const styles = EStyleSheet.create({
            text:{
                fontFamily:"$font",
                textAlign:"right",
                fontSize:"15rem",
                color:"$lightGrayColor",
                borderColor:"$lightGrayColor",
                borderWidth:error? "3rem":"1rem",
                margin:"10rem",
                paddingHorizontal:"10rem",
                borderRadius:"10rem",
                paddingVertical:"5rem",
                // paddingTop:"15rem",//TODO: test it.
                textAlignVertical:'top'
            },
        })
        return <TextInput style={[styles.text,this.props.style]} {..._.omit(this.props,["style","children"])}/>
    }
}

export class CText extends PureComponent{
    render() {
        const styles = EStyleSheet.create({
            text:{
                fontFamily:"$font",
                textAlign:"left",
            },
        })
        return <Text style={[styles.text,this.props.style]} {..._.omit(this.props,["style","children"])}>{this.props.children}</Text>
    }
}

export class CButton extends PureComponent{
    render() {
        const { title,loading,children,containerStyle,titleStyle } = this.props
        const styles = EStyleSheet.create({
            container:{
                flexDirection:"row",
                justifyContent:"center",
                alignItems:"center",
                backgroundColor:"$lightBlueColor",
                margin:"10rem",
                borderRadius:"50rem",
                padding:"10rem"
            },
            title:{
                color:"white",
                fontSize:"16rem"
            }
        })
        return(
            <TouchableOpacity style={[styles.container,containerStyle]} activeOpacity={.6} {..._.omit(this.props,["style","children"])}>
                {loading && <ActivityIndicator color="white"/>}
                {title && !loading && <CText style={[styles.title,titleStyle]}>{title}</CText>}
                {!title && children}
            </TouchableOpacity>
        )
    }
}






export class Picker extends Component{
    state = {
        visible:false
    }
    render() {
        const { title,onSelect,options,showFilter,pickerTitle,style,pColor,selectedOption } = this.props
        const { visible } = this.state
        const size = 15
        const color = pColor || EStyleSheet.value("$mainColor")
        return (
            <TouchableOpacity
                style={[{ flexDirection:"row",padding:2,borderColor:color,borderWidth:1,borderRadius:4 },style && {...style}]}
                onPress={()=> this.setState({visible:true})}
            >
                <Icon name="sort-down" size={size} color={color} style={{ paddingHorizontal:5 }}/>
                <CText style={{ paddingHorizontal:10,fontSize:size,color:color }} numberOfLines={1}>{title}</CText>

                <ModalFilterPicker
                    title={pickerTitle}
                    visible={visible}
                    onSelect={item=> {
                        this.setState({visible:false})
                        onSelect && onSelect(item)
                    }}
                    onCancel={()=> this.setState({visible:false})}
                    options={options}
                    showFilter={showFilter}
                    cancelButtonText="لغو"
                    optionTextStyle={{fontSize:15,fontFamily:EStyleSheet.value("$font"),flex:1,textAlign:Platform.OS == "ios"? "left":"right"}}
                    selectedOption={selectedOption}
                    titleTextStyle={{fontFamily:EStyleSheet.value("$font"),textAlign:"right",color:"white",fontSize:20,padding:10}}
                    cancelButtonTextStyle={{fontFamily:EStyleSheet.value("$font"),textAlign:"right"}}
                    selectedOptionTextStyle={{textAlign:Platform.OS == "ios"? "left":"right",color,fontFamily:EStyleSheet.value("$font"),flex:1}}
                />
            </TouchableOpacity>
        );
    }
}

export class SlideUp extends Component{
  componentDidMount() {
      BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentWillUnmount() {
      BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton = ()=> {
    const { visible,onClose } = this.props
    if(visible) onClose();
    return visible;
  }
  render(){
    const { visible,children,onClose } = this.props
    return(
      <SlidingUpPanel
          visible={visible}
          onRequestClose={onClose}
          allowDragging={true}
          showBackdrop={true}
          backdropOpacity={.6}
          draggableRange={{
              top: Dimensions.get('window').height - 60,
              bottom: 0
          }}
      >
          {dragHandlers=>(
              <View style={{ flex:1,borderRadius:20,backgroundColor:"white",zIndex: 100 }}>
                  <View {...dragHandlers} style={{height:40,width:"100%"}}>
                      <TouchableOpacity onPress={onClose} style={{ width:"100%",justifyContent:"center",alignItems:"center" }}>
                          <Icon name="sort-down" color="green" size={30}/>
                      </TouchableOpacity>
                  </View>
                  <View style={{flex:1}}>
                    {children}
                  </View>
              </View>
          )}
      </SlidingUpPanel>
    )
  }
}
