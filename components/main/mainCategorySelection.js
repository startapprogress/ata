import React, {Component,PureComponent} from 'react';
import { View,TouchableOpacity,FlatList,Image as CImage } from "react-native";
import { request,BASE_URL } from "./../../service";
import { CText as Text,CButton as Button } from "./../customComponents";
import { EnToFa } from "./../../mixin";
import Container from "./../container";
import EStyleSheet from "react-native-extended-stylesheet";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { lang } from "./../../lang";
import { init } from "./../../notificationHandler";

class Item extends PureComponent{
    render() {
        const { categoryId,name,Image,onPress,selectedItem } = this.props
        return (
            <TouchableOpacity activeOpacity={.8} onPress={()=> onPress(categoryId)} style={[styles.itemContainer,styles.shadow]}>
                <View style={styles.selectBtnOuter}>{selectedItem == categoryId && <View style={styles.selectBtnInner}/>}</View>

                <CImage source={{ uri: BASE_URL + `/Images/Category/Img/${Image}`}} style={styles.itemImage}/>
                <Text style={styles.itemName} numberOfLines={1}>{EnToFa(name)}</Text>
            </TouchableOpacity>
        );
    }    
}

class MainCategorySelection extends Component{
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
        init();
        try {
            const langs = await lang()
            const strings = { 
                ...langs.mainCategorySelection,
                ...langs.globals 
            };
            this.setState({ strings })
        } catch (error) {
            
        }

        this._getList();
    }

    _getList = ()=>{
        request("POST","/api/ListCategoryServic",{},
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
            <Container showMenu title={TITLE} backDisabled>
                <FlatList
                    data={list}
                    renderItem={({item})=> <Item { ...item } selectedItem={selectedItem} onPress={this._selectItem}/>}
                    keyExtractor={(item)=> item.categoryId}
                    numColumns={2}
                    style={{ height: "100%" }}
                    contentContainerStyle={{ justifyContent:"flex-start",alignItems:"stretch",paddingBottom: 10 }}
                    onRefresh={this._getList}
                    refreshing={loading}
                    horizontal={false}
                    alwaysBounceVertical={true}
                />

                {selectedItem && <Button title={NEXT_STEP} onPress={()=> this.props.navigation.navigate("SubCategorySelection",{categoryid:selectedItem})}/>}
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
    itemContainer:{ width:wp("45%"),height:wp("45%"),backgroundColor:"white",margin:wp("2.5%"),borderRadius:"10rem",justifyContent:"center",alignItems:"center" },
    itemName:{ textAlign:"center",color:"gray",marginTop:10 },
    itemImage:{ width:wp("25%"),height:wp("25%") },

    selectBtnOuter:{ width:"20rem",height:"20rem",backgroundColor:"white",borderRadius:"10rem",borderColor:"$lightBlueColor",
                     borderWidth:"2rem",justifyContent:"center",alignItems:"center",margin:10,position:"absolute",top:0,left:0,zIndex:100 
    },
    selectBtnInner:{ width:"10rem",height:"10rem",backgroundColor:"$lightBlueColor",borderRadius:"5rem", }
})

export default MainCategorySelection