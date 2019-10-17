import React, {Component} from 'react';
import { View,Dimensions,StatusBar,I18nManager,AsyncStorage,YellowBox } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { createAppContainer,createStackNavigator,createDrawerNavigator } from 'react-navigation';
import { connect , Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import storeMaker from './redux/store';
import RNRestart from "react-native-restart";
import TarikhteKhadamat  from './components/Drawer/TarikhteKhadamat'
import Contact from "./components/Drawer/Contact";
import Login from "./components/login/login";
import LogOut from './components/Drawer/LogOut'
import Splash from "./components/login/splash";
import MainCategorySelection from "./components/main/mainCategorySelection";
import SubCategorySelection from "./components/main/subCategorySelection";
import MapCenter from "./components/main/mapCenter";
import Log from "./components/main/log";
import Profile from "./components/Drawer/profile";
import Ghavanin from "./components/Drawer/Ghavanin";
import Dabarema from "./components/Drawer/Dabarema";
import Ata from './components/login/ata'
import { lang as langs } from "./lang";
import R from "reactotron-react-native";
if(__DEV__) {
  import('./ReactotronConfig').then(() => {})
}

YellowBox.ignoreWarnings([
  'Warning: isMounted(...) is deprecated', 'Module RCTImageLoader',
  'Module RNFetchBlob requires main queue setup',
]);
console.disableYellowBox = true;

EStyleSheet.build({
  $rem:Dimensions.get("window").width/380,
  // $outline: 1,
  $font:"IRANSansMobile",
  $grayColor:"#576d83",
  $lightGrayColor:"#b9c5d3",
  $lightBlueColor:"#4ba7fd",
  $violetColor:"#504de4"
});

const mainStack = createStackNavigator({
  Ata,
  splash:{
    screen:Splash
  },
  Login,
  MainCategorySelection,
  SubCategorySelection,
  MapCenter,
  Log,
  Ghavanin,
  Profile,
  Dabarema,
    TarikhteKhadamat,
  LogOut,
  Contact
},{
  defaultNavigationOptions: {
    header:null
  }
})

const Drawer  = createDrawerNavigator({
  mainStack:{
    screen:mainStack,
    navigationOptions:{
      drawerLabel:"اطا"
    }
  },
    tarikhtheKhadamat:{
    screen:TarikhteKhadamat,
      navigationOptions:{
      drawerLabel:"تاریخچه خدمات"
      }
    },
  profile:{
    screen:Profile,
    navigationOptions:{
      drawerLabel:"پروفایل"
    }
  },
  dabarema:{
    screen:Dabarema,
    navigationOptions:{
      drawerLabel:"درباره ما"
    }
  },
  contact:{
    screen:Contact,
    navigationOptions:{
      drawerLabel:"تماس با ما"
    }
  },
ghavanin:{
    screen:Ghavanin,
  navigationOptions:{
      drawerLabel:"قوانین"
  }
},
  logout:{
    screen:LogOut,
    navigationOptions:{
      drawerLabel:"خروج"
    }
  }



},{
  drawerPosition:"right",
   //contentComponent:Menu,
  drawerLockMode: 'locked-closed',

},{

})

const Stack = createStackNavigator({
  Drawer,
},{
  defaultNavigationOptions: {
    header:null
  },
})

const Router = connect()(createAppContainer(Stack))
const store = storeMaker();

export default class App extends Component{
  constructor(props){
    super(props)
    
  }
  
  componentDidMount = async ()=> {
    try {
        const lang  = await AsyncStorage.getItem("lang")
        const isRTL = await AsyncStorage.getItem("isRTL")

        if(lang === null){
          await AsyncStorage.setItem("lang","fa");
          await AsyncStorage.setItem("isRTL","true");
        }

        const language = await langs()
        if(language.isRTL && isRTL !== "true"){
          I18nManager.forceRTL(true);
          RNRestart.Restart();
        }
    } catch (e) {

    }

    setInterval(async ()=>{
      // const requests = store.store.getState().tempState.requests
      // if(requests.length>0){
      //   const isConnected = await checkInternetConnection();
      //   if(isConnected){
      //     requests[0]();
      //     store.store.dispatch(removeTempStateRequest());
      //   }
      // }
    },1000)
  }
  render() {
    return (
      
        <View style={{ flex:1,backgroundColor:"white" }}>
          <StatusBar translucent={false}/>
          <Provider store={store.store}>
            <PersistGate loading={null} persistor={store.persistor}>
              <Router/>
            </PersistGate>
          </Provider>
        </View>
      
    );
  }
}
export const myStore = store.store