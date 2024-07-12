import signin from "@/app/(auth)/sign-in";
import { Client, Databases, Account, ID, Query } from "react-native-appwrite";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

export const appwriteConfig = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.burbur.rackify',
    projectId: '66856fe800058a00c75b',
    databaseId: '668775ea000b042be15c',
    userCollectionId: '6687789a00010a95920d',
    stationCollectionId: '66877737001f9e330c28'
}

const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId) 
  .setPlatform(appwriteConfig.platform);


export const account = new Account(client);
export const databases = new Databases(client);

export const createUser = async (email : any, password : any, username : any) => {
    try {
        const uniqueId = ID.unique();

        const newAccount = await account.create(uniqueId, email, password, username);

        if(!newAccount) throw Error;

        await signIn(email, password);
        
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            uniqueId,
            {
                accountId: uniqueId,
                email,
                username,
            }
        );

        return newUser;
    } catch (error : any) {
        console.log(error);
        throw new Error(error);
    }
}

export const signIn = async (email : any, password : any) => {
    try {
        const session = await account.createEmailPasswordSession(email, password);

        return session;
    } catch (error : any) {
        throw new Error(error);
    }
}

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get(); 

        if (!currentAccount) throw Error();

        const currentUser = databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        );

        if (!currentUser) throw Error(); 

        return (await currentUser).documents[0];
    } catch (error) {
        console.log(error);
    }
}

export const getStationData = async () => {
    const stationData = databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.stationCollectionId,
    );

    if (!stationData) throw Error("Error retrieving station data");

    return stationData;
}


export const getStation = async ( stationId : any) => {
    const stationData = databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.stationCollectionId,
        [Query.equal('ID', stationId)]
    );

    if (!stationData) throw Error("Error retrieving station data");

    return stationData;
}

export const occupyStation = async ( userId : any, stationId : any ) => {
    // If the user is not --> occupy the station id given in the params
    await databases.updateDocument(
        appwriteConfig.databaseId, // databaseId
        appwriteConfig.stationCollectionId, // collectionId
        stationId, // documentId
        {
            Occupied: true,
            User: userId
        }, // data (optional)
    );

    // Set user to occupying and mark station ID
    await databases.updateDocument(
        appwriteConfig.databaseId, // databaseId
        appwriteConfig.userCollectionId, // collectionId
        userId, // documentId
        {
            occupying: true,
            stationId: stationId
        }, // data (optional)
    );
}

export const leaveStation = async ( userId : any, stationId : any ) => {

     // Set station to not occupying
     await databases.updateDocument(
        appwriteConfig.databaseId, // databaseId
        appwriteConfig.stationCollectionId, // collectionId
        stationId, // documentId
        {
            Occupied: false,
            User: null
        }, // data (optional)
    );

    // Set user to not occupying and mark station ID
    await databases.updateDocument(
        appwriteConfig.databaseId, // databaseId
        appwriteConfig.userCollectionId, // collectionId
        userId, // documentId
        {
            occupying: false,
            stationId: null
        }, // data (optional)
    );
}