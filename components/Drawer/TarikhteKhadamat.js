import React,{Component} from 'react'
import {Text,View,Alert} from "react-native";
import {connect} from 'react-redux'
import Axios from  'axios';
class TarikhteKhadamat extends Component {
    componentDidMount() {
        const _call = async ({baseURL = "api/Listuserservice/userid"}) => {
            const data = await Axios.post({
                baseURl: baseURL,
            }).catch({
                    response: {_call},
                }
            ).catch(err => {
                throw err
            })
            return data
        }
    }
        render()
        {
            return (
                <View>

                </View>
            )
        }

}
export default connect()(TarikhteKhadamat)