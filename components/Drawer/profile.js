import React, { Component } from 'react';
import { View } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import { connect } from "react-redux";
import { setConfigs } from "../../redux/actions";
import Container from "../container";
import { request } from "../../service";
import { lang } from "../../lang";
import { CText as Text,CTextInput as TextInput,CButton as Button } from "../customComponents";
import { EnToFa } from "../../mixin";
import R from "reactotron-react-native";

class Profile extends Component{
    state = {
        name:"",
        saveLoading:false,

        strings:{}
    }

    async componentDidMount(){
        const { Name } = this.props.configs
        try {
            const langs = await lang()
            const strings = { 
                ...langs.settings,
                ...langs.globals 
            };
            this.setState({ strings,name:Name })
        } catch (error) {
            
        }
    }

    _save = ()=>{
        const { name } = this.state
        const { UserId } = this.props.configs
        request("POST","/api/EditUserInfo",{Name:name,UserId},
            ()=>{ this.setState({ saveLoading:true }) },
            ()=>{
                this.setState({ saveLoading:false });
                this.props.setConfigs({ Name:name });
            },
            ()=>{ this.setState({ saveLoading:false }) },
        )
    }
    
    render() {
        const { name,saveLoading } = this.state
        const { TITLE,NAME_PLACEHOLDER,SAVE } = this.state.strings
        return (
            <Container showMenu title={TITLE}>
                <TextInput placeholder={NAME_PLACEHOLDER} value={name} onChangeText={e=> this.setState({ name:e })} style={{ textAlign:"center" }}/>
                <Button title={SAVE} onPress={this._save} loading={saveLoading} />
            </Container>
        );
    }
}

const state = state=>({
    configs:state.configs
})
export default connect(state,{ setConfigs })(Profile)