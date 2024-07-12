import { View, Text, TextInput, ScrollView, Image, TouchableOpacity, Alert } from 'react-native'
import { router, Link } from 'expo-router'
import React, {useState } from 'react'
import { logo, loading } from '../../constants/images'
import { account, signIn } from '../../lib/appwrite'
import FormField from '@/components/FormField'

const signin = () => {
    const [form, setForm] = useState({
        "email": "",
        "username": "",
        "password": ""
    })

    const [isSubmitting, setIsSubmitting] = useState(false);

    const submit = async () => {
        if(form.email === "" || form.password === "") {
            Alert.alert("Complete all fields!");
        }

        try {
            const result = await signIn(form.email, form.password);
            
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

                <Text className="text-white text-xl font-psemibold mt-7 ml-5">Sign In To Rackify</Text>

                <FormField 
                    title="Email"
                    value={form.email}
                    otherStyles="mt-7 ml-5"
                    handleChangeText={(e : any) => setForm({ ...form, email: e })}
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
                        if(!isSubmitting) {
                            submit();
                        }
                    }}
                >   
                    { !isSubmitting && <Text className="text-grey font-semibold text-xl font-psemibold"> Sign In </Text> }

                    { isSubmitting && 
                        <Image
                            source={ loading }
                            className='w-auto h-7'
                            resizeMode='contain'
                        />
                    }

                </TouchableOpacity>

                <Text className='text-white font-pregular text-sm mt-7 ml-14'> 
                    Dont have an account? {' '}

                    <Link href="/sign-up ">
                        <Text className='text-secondary-100'> Sign Up </Text>
                    </Link>
                </Text>

            </View>
        </ScrollView>
    )
}

export default signin 