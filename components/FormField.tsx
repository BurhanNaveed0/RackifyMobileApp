import { View, Text, TextInput, Image, TouchableOpacity} from 'react-native'
import React, { useState } from 'react'
import { eyehide, eye} from '@/constants/images'


const FormField = ( { title, value, placeholder, handleChangeText, otherStyles } : 
                    {title: any, value: any, placeholder: any, handleChangeText: any, otherStyles: any} ) => {

    const [ isHiding, setHiding ] = useState(true);

    const toggleHide = () => {
        setHiding(!isHiding);
    }

    return (
    <View className={otherStyles}>
        <Text className="text-white text-lg font-pregular "> {title} </Text>  
        <TextInput 
            className="w-80 h-14 bg-gray-600 rounded-xl mt-2 pl-4"
            value={value}
            placeholder={placeholder}
            onChangeText={handleChangeText}
            secureTextEntry={(title === "Password") ? isHiding : false}
        >

        </TextInput>
        
        { title === "Password"  && 
            <TouchableOpacity
                onPress={ toggleHide }
            >
                <Image
                    source={isHiding ? eye : eyehide}
                    className="w-10 h-10 absolute bottom-2 right-16"
                    resizeMode='contain'
                />
            </TouchableOpacity>
        }
    </View>
    )
}

export default FormField