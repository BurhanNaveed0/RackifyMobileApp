import Ionicons from '@expo/vector-icons/Ionicons';
import { Image, View, ScrollView, Text, TouchableOpacity, Alert} from 'react-native';
import MapView, { Callout, Marker }  from 'react-native-maps'
import { getStationData, occupyStation } from '@/lib/appwrite';
import { useEffect, useState } from 'react';
import { logo } from '@/constants/images';
import { useGlobalContext } from '@/context/GlobalProvider';
import { leaveStation } from '@/lib/appwrite';

export default function TabTwoScreen() {
  const [ stationData, setStationData ] = useState<any[]>([]);
  const { user } = useGlobalContext(); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getStationData();
        setStationData(data.documents);
      } catch ( error ) {
        console.log(error);
      }
    }

    const interval = setInterval(() => {
      fetchData();
    }, 3000);

    return () => clearInterval(interval);
    
  }, [stationData]);

  const onRegionChange = ( region : any ) => {
    console.log(region);
  }

  const submit = async ( stationId : any) => {
    try {
        await occupyStation(user.accountId, stationId);
    } catch( error : any ) {
        Alert.alert("Error", error.message );
    } finally {
    }
  }  

  const showStationLocations = () => {
    return stationData.map((item, index) => {
      var color;

      if(item.Occupied) {
        if(user != null && item.User === user.accountId) {
          color = 'blue';
        } else {
          color = 'red';
        }
      }

      else {
        color = 'green';
      }

      //item.Occupied ? 'red' : 'green'

      return (
        <Marker
          key={item.ID}
          coordinate={{ "longitude": item.Longitude, "latitude": item.Latitude}}
          title={item.Address}
          description={"Station ID: " + item.ID}
          pinColor={color}
        >
          <Callout>
            <Text className='font-pbold text-center text-xl'> {item.Address} Station </Text> 

            { !item.Occupied && 
              <>
                <Text className='text-green-700 text-xl font-pregular text-center'> Station Available </Text>
                
                <TouchableOpacity 
                  className="items-center justify-center m-2 ml-5 pt-3 pb-3 pr-5 pl-5 w-80 rounded-xl bg-secondary"
                  onPress={ () => { 
                      submit(item.ID);
                      console.log(item.ID);
                  }}
                >   

                  <Text className="text-grey font-semibold text-xl font-psemibold"> Unlock </Text> 

                  </TouchableOpacity>
                </> 
            }

            { user != null && item.Occupied && item.User === user.accountId && <Text className='text-green-700 text-xl font-pregular text-center'> You are currently using this station </Text>}
            
            { user != null && item.Occupied && item.User != user.accountId && <Text className='text-red-800 text-xl font-pregular text-center'> Station in use </Text>}
          </Callout>
        </Marker>
      )
    })
  };

  return (
    <ScrollView
        contentContainerStyle={{
            height: "100%"
        }}
    >
        <View className="w-full items-center justify-center h-full bg-primary">
          <Text className='text-secondary-200 font-pbold text-3xl'>Explore</Text>
          <Text className='text-white font-pregular text-xl'>Find Racks Near You</Text>

          <MapView
            className='w-full h-3/4 mt-2'
            onRegionChange={ onRegionChange }
            initialRegion={{"latitude": 40.72978797248203, "latitudeDelta": 0.062074509562343394, "longitude": -74.17411061536927, "longitudeDelta": 0.045087461769441006}}
          >
            {showStationLocations()}
          </MapView>

        </View>
    </ScrollView>
  );
}

