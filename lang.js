import { AsyncStorage } from "react-native";

export const lang = async ()=>{
    try {
        const lang  = await AsyncStorage.getItem("lang")
        const strings = langs[lang || "fa"] 
        return strings
    } catch (error) {
        
    }
}

const langs = {
    fa:{
        isRTL:true,
        globals:{
            PRICE_UNIT:"تومان",
            SAVE:"ذخیره",
            ADDRESS:"آدرس",
        },

        login:{
            RECEIVE_CODE : "دریافت کد",
            CONFIRM_CODE : 'کد تایید',
            LOGIN : "ورود"
        },
        mainCategorySelection:{
            TITLE : "خدمات",
            NEXT_STEP : "مرحله بعد"
        },
        subCategorySelection:{
            TITLE : "خدمات",
            NEXT_STEP : "مرحله بعد"
        },
        mapCenter:{
            TITLE : "خدمت دهندگان",
            REQUEST: "درخواست",
            SEND_REQUEST : "ثبت درخواست"
        },
        log:{
            TITLE:"تاریخچه درخواستها"
        },
        settings:{
            TITLE:"پروفایل",
            NAME_PLACEHOLDER:"نام و نام خانوادگی"
        }
    }
}