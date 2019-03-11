import React from 'react';
import {StyleSheet, Text, View, Button, AsyncStorage} from 'react-native';

// TODO add a "Description" field to store with each location
// TODO Show the current location on screen before committing the save
// TODO Button "View bookmarks" -> Have a ScrollView with a List and all bookmarks+descriptions
// TODO Give feedback on save/print errors
// TODO Allow 'email bookmarks'


export default class App extends React.Component {


    constructor(props) {
        super(props);
        this.sessionId = "l262ugnnqxb697uirehsml6aruh0lbug";
        this.saveGps = this.saveGps.bind(this);
        // this.asyncStorageKey = "gps-bookmarker-data"
    }

    async wipeBookmarks() {
        console.log('Wiping bookmarks.');

        // TODO sendHttpPostToRestApi(delete all bookmarks)
        // await AsyncStorage.setItem(this.asyncStorageKey, "");
    }


    createNewBookmark() {

    }


    getBookmarkList() {
        let url = "http://192.168.1.156:8000/api/bookmarks.json";
        // let url = 'https://api.coindesk.com/v1/bpi/currentprice/BTC.json';


        let response = fetch(url, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                //'Content-Type': 'application/json',
                Cookie: 'sessionid=' + this.sessionId
            }
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                return responseJson;
            })
            .catch((error) => {
                console.log(error);
                throw(error);
            });
    }

    saveGps() {
        navigator.geolocation.getCurrentPosition(async (loc) => {
                console.log('Storing location...');
                // TODO sendHttpPostToRstApi(loc)

                this.getBookmarkList()


            },
            (err) => {
                console.log('Error pulling GPS coordinates.');
                console.log(err);
                throw(err);
            },
            {enableHighAccuracy: true});
    }

    render() {
        return (
            <View style={styles.container}>
                <Button title="Save GPS location" onPress={this.saveGps}/>
                <Button title="Wipe all bookmarks" onPress={this.wipeBookmarks}/>
            </View>
        );
    }


}

const
    styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
        },
    });
