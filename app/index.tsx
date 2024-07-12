import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView} from 'react-native'
import { ThemedText } from '@/components/ThemedText'
import { Link, Redirect, router } from 'expo-router'
import React from 'react'

import { logo, path } from "../constants/images";
import { useGlobalContext } from '@/context/GlobalProvider';

const Onboarding = () => {
    const { isLoading, isLoggedIn } = useGlobalContext();

    if (!isLoading && isLoggedIn) return <Redirect href="(tabs)"/> 

    return (

    <ScrollView
        contentContainerStyle={{
            height: "100%"
        }}
    >
        <View className="w-full items-center justify-center h-full bg-primary">
            <Image 
                className="object-contain w-full h-40"
                source={logo}
                resizeMode='contain'
            />
            
            <View className='relative'>
                <Text className="text-secondary-200 text-3xl font-pbold text-center">Rackify</Text>
                <Text className="text-white text-xl text-center mt-4">  
                    Stop your bike anytime, anywhere {'\n'} with { ' ' }
                    <Text className='text-secondary-200 font-pbold'>Rackify</Text>
                </Text>

                <Image
                        className="w-[100px] h-[15px] absolute -bottom-3 right-20"
                        source={path}
                        resizeMode='contain'
                />
            </View> 

            <TouchableOpacity 
                className="items-center justify-center m-10 pt-3 pb-3 pr-5 pl-5 w-5/6 rounded-xl bg-secondary"
                onPress={ () => {
                    router.replace('sign-up');
                }}
            >
                <Text className="text-grey font-semibold text-xl font-psemibold"> Create a profile! </Text>
            </TouchableOpacity>
        </View>
    </ScrollView>
  )
}

export default Onboarding