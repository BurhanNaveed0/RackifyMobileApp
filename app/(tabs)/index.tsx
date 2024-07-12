import { Image, StyleSheet, Platform , ScrollView, View, Text, TouchableOpacity, Alert} from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useEffect, useState } from 'react';
import { useGlobalContext } from '@/context/GlobalProvider';
import { notfound, path, loading } from '@/constants/images';
import { getStation, leaveStation } from '@/lib/appwrite';

export default function HomeScreen() {
  const { user } = useGlobalContext(); 
  const [ isSubmitting, setIsSubmitting ] = useState(false);
  const [ stationData, setStationData ] = useState({});

  useEffect( () => {
    const updateStationData = async () => {
        if(user != null) {
            await getStation(user.stationId)
              .then((response) => {
                if(response)
                  setStationData(response.documents[0]);
              }).catch((error) => {
                console.log(error);
              })
        }
      }

      const interval = setInterval(() => {
        updateStationData();
      }, 3000);

      return () => clearInterval(interval);
  }, [stationData]);

  const submit = async () => {
      setIsSubmitting(true);

      try {
          await leaveStation(user.accountId, user.stationId);
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
    >
        <View className="w-full items-center justify-start h-full bg-primary">

          <Text className='text-secondary-200 font-pbold text-3xl mt-16'>Dashboard</Text>

          { user != null && !user.occupying && 
            <>
              <Text className='text-white font-pregular text-xl text-center mt-5'> You are not using any bike racks currently </Text>
              <Image
                className='w-auto h-36 mt-5'
                source={notfound}
                resizeMode='contain'
              />

              <View>
                <Text className='text-white font-pregular text-xl text-center mt-10'>  
                  Find a rack near you on the {' '}
                  <Text className='text-secondary-200 font-pbold text-center'>Explore</Text> tab!  
                </Text>

                <Image
                          className="w-[100px] h-[15px] absolute bottom-4 -right-2"
                          source={path}
                          resizeMode='contain'
                  />
                </View>
            </>
          }

          { user != null && user.occupying && 
            <>
              <Text className='text-white font-pregular text-xl text-center mt-5'> You are currently using a rack!</Text>
              
              <Text className='text-secondary-100 font-pregular text-xl text-center mt-5'> Station ID: <Text className='text-white font-pregular text-xl'> {user.stationId} </Text> </Text>
              <Text className='text-secondary-100 font-pregular text-xl text-center mt-5'> Address: <Text className='text-white font-pregular text-xl'> {stationData.Address} </Text> </Text>
              <Text className='text-secondary-100 font-pregular text-xl text-center mt-5'> Longitude: <Text className='text-white font-pregular text-xl'> {stationData.Longitude} </Text> </Text>
              <Text className='text-secondary-100 font-pregular text-xl text-center mt-5'> Latitude: <Text className='text-white font-pregular text-xl'> {stationData.Latitude} </Text> </Text>

              <TouchableOpacity 
                    className="items-center justify-center mt-10 pt-3 pb-3 pr-5 pl-5 w-80 rounded-xl bg-red-600"
                    onPress={ () => { 
                        submit();
                    }}
                >   

                    { !isSubmitting && <Text className="text-grey font-semibold text-xl font-psemibold"> Leave </Text> }

                    { isSubmitting && 
                        <Image
                            source={ loading }
                            className='w-auto h-7'
                            resizeMode='contain'
                        />
                    }
              </TouchableOpacity>
            </>
          }


        </View>
    </ScrollView>
  );
}

