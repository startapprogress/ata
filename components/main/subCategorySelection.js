import React, {Component,PureComponent} from 'react';
import { View,TouchableOpacity,FlatList,Image as CImage } from "react-native";
import { request,BASE_URL } from "./../../service";
import { CText as Text,CButton as Button } from "./../customComponents";
import { EnToFa,ToPrice } from "./../../mixin";
import Container from "./../container";
import EStyleSheet from "react-native-extended-stylesheet";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { lang } from "./../../lang";
const _ = require("lodash");

class Item extends PureComponent{
    render() {
        const { CategoryId,Name,Image,price,onPress,selectedItem } = this.props
        return (
            <TouchableOpacity activeOpacity={.8} onPress={()=> onPress(CategoryId)} style={[styles.itemContainer,styles.shadow]}>
                <View style={styles.selectBtnOuter}>{selectedItem == CategoryId && <View style={styles.selectBtnInner}/>}</View>
                <CImage source={{ uri: BASE_URL + `/Images/Category/Img/${Image}`}} style={styles.itemImage}/>
                
                <View style={{ flex:1,flexDirection:"column",alignItems:"flex-start",padding:10 }}>
                    <Text style={styles.itemName} numberOfLines={1}>{EnToFa(Name)}</Text>
                    <Text style={styles.itemName}>{`هزینه: ${EnToFa(ToPrice(price))} ریال`}</Text>
                </View>
            </TouchableOpacity>
        );
    }    
}

class SubCategorySelection extends Component{
    constructor(props){
        super(props);
        this.state = {
            loading:false,
            list:[],
            selectedItem:null,
            strings:{}
        }
    }
    

    async componentDidMount(){
        try {
            const langs = await lang()
            const strings = { 
                ...langs.subCategorySelection,
                ...langs.globals 
            };
            this.setState({ strings })
        } catch (error) {
            
        }

        this._getList();
    }

    _getList = ()=>{
        const categoryid = this.props.navigation.getParam("categoryid",0);
        if(categoryid == 0) return

        request("POST","/api/ShowServicById",{categoryid},
            ()=>{ this.setState({ loading:true }) },
            list=>{
                this.setState({ loading:false,list })
            },
            ()=>{ this.setState({ loading:false }) },
        )
    }

    _selectItem = selectedItem => this.setState({ selectedItem })

    render() {
        const { list,loading,selectedItem } = this.state
        const { TITLE,NEXT_STEP } = this.state.strings
        return (
            <Container showMenu style={{ flex:1,justifyContent:"center" }} title={TITLE}>
                <FlatList
                    data={list}
                    renderItem={({item})=> <Item { ...item } selectedItem={selectedItem} onPress={this._selectItem}/>}
                    keyExtractor={(item)=> item.CategoryId}
                    style={{ height: "100%" }}
                    contentContainerStyle={{ justifyContent:"flex-start",alignItems:"stretch",paddingBottom: 10 }}
                    onRefresh={this._getList}
                    refreshing={loading}
                    horizontal={false}
                    alwaysBounceVertical={true}
                />

                {selectedItem && <Button title={NEXT_STEP} onPress={()=> this.props.navigation.navigate("MapCenter",{item:_.filter(list,l=> l.CategoryId == selectedItem)[0]})}/>}
            </Container>
        );
    }
} 

const styles = EStyleSheet.create({
    shadow:{
        elevation:8,
        shadowColor:"$lightBlueColor",
        shadowOffset:{width: 0,height: 0},
        shadowOpacity:.5,
        shadowRadius:5,
    },
    itemContainer:{ flex:1,flexDirection:"row",backgroundColor:"white",margin:wp("2.5%"),borderRadius:"10rem",overflow:"hidden" },
    itemName:{ color:"gray", },
    itemImage:{ width:wp("25%"),height:wp("25%") },

    selectBtnOuter:{ width:"20rem",height:"20rem",backgroundColor:"white",borderRadius:"10rem",borderColor:"$lightBlueColor",
                     borderWidth:"2rem",justifyContent:"center",alignItems:"center",margin:10,position:"absolute",top:0,right:0,zIndex:100 
    },
    selectBtnInner:{ width:"10rem",height:"10rem",backgroundColor:"$lightBlueColor",borderRadius:"5rem", }
})

export default SubCategorySelection