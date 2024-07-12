import { View, Text, TextInput, ScrollView, Image, TouchableOpacity, Alert } from 'react-native'
import { router, Link } from 'expo-router'
import React, { useState } from 'react'
import { ID } from 'react-native-appwrite'
import { logo, loading } from '../../constants/images'
import FormField from '@/components/FormField'
import { createUser } from '../../lib/appwrite'

const signup = () => {
    const [form, setForm] = useState({
        "email": "",
        "username": "",
        "password": ""
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const submit = async () => {
        setIsSubmitting(true);

        if(form.email === "" || form.username === "" || form.password === "") {
            Alert.alert("Complete all fields!");
            setIsSubmitting(false);
            return;
        }

        try {
            const result = await createUser(form.email, form.password, form.username);
            
            // set result to global state using context

            Alert.alert("Sucess", "User signed in successfully");
            router.replace("(tabs)");
        } catch( error : any ) {
            Alert.alert("Error", error.message );
        } finally {
            setIsSubmitting(false);
        }
    }  

    return (
        <ScrollView
            contentContainerStyle={{
                height: "100%"
            }}
            className='bg-primary'
        >
            <View className="w-full items-left justify-start h-full">

                <View className='mt-20 relative flex-row'> 
                    <Image 
                        className="object-contain w-[115px] h-[80px]"
                        source={logo}
                        resizeMode='contain'
                    />
                    
                    <Text className="text-white text-2xl font-pbold mt-7">Rackify</Text>
                </View>

                <Text className="text-white text-xl font-psemibold mt-7 ml-5">Sign Up To Rackify</Text>

                <FormField 
                    title="Email"
                    value={form.email}
                    otherStyles="mt-7 ml-5"
                    handleChangeText={(e : any) => setForm({ ...form, email: e })}
                />


                <FormField 
                    title="Username"
                    value={form.username}
                    otherStyles="mt-7 ml-5"
                    handleChangeText={(e : any) => setForm({ ...form, username: e })}
                />

                <FormField 
                    title="Password"
                    value={form.password}
                    otherStyles="mt-7 ml-5"
                    handleChangeText={(e : any) => setForm({ ...form, password: e })}
                />

                
                <TouchableOpacity 
                    className="items-center justify-center mt-10 ml-5 pt-3 pb-3 pr-5 pl-5 w-80 rounded-xl bg-secondary"
                    onPress={ () => { 
                        if( !isSubmitting ) {
                            submit();
                        }
                    }}
                >   

                    { !isSubmitting && <Text className="text-grey font-semibold text-xl font-psemibold"> Sign Up </Text> }

                    { isSubmitting && 
                        <Image
                            source={ loading }
                            className='w-auto h-7'
                            resizeMode='contain'
                        />
                    }
                </TouchableOpacity>

                <Text className='text-white font-pregular text-sm mt-7 ml-14'> 
                    Already have an account? {' '}
                    
                    <Link href="/sign-in">
                        <Text className='text-secondary-100'> Sign In </Text>
                    </Link>
                </Text>

            </View>
        </ScrollView>
  )
}

export default signup