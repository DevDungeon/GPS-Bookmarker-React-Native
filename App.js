import React from 'react';
import {StyleSheet, Text, View, Button, AsyncStorage} from 'react-native';

// TODO Store session securely with https://github.com/oblador/react-native-keychain
// TODO Add ListView/ScrollView to review all created bookmarks
// TODO add a "Description" field to store with each location
// TODO Show the current location on screen before committing the save
// TODO Button "View bookmarks" -> Have a ScrollView with a List and all bookmarks+descriptions
// TODO Give feedback on save/print errors
// TODO Allow 'email bookmarks'


export default class App extends React.Component {


    constructor(props) {
        super(props);

        // TODO Add login and store session
        this.sessionId = "l2d2ugnnqxb69ddddirehsml6aruh0lbug";

        this.saveGps = this.saveGps.bind(this);
        this.listBookmarks = this.listBookmarks.bind(this);
        // this.asyncStorageKey = "gps-bookmarker-data"
        this.state = {'currentMessage': 'GPS coordinate not yet saved.',
        'currentUsername': 'N/A'}
    }


    createNewBookmark(loc) {
        let url = "http://192.168.1.156:8000/api/bookmarks.json";
        // let url = 'https://api.coindesk.com/v1/bpi/currentprice/BTC.json';

        console.log(loc);
        let response = fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Cookie: 'sessionid=' + this.sessionId,
            },
            body: JSON.stringify({
                lat: loc.coords.latitude,
                lon: loc.coords.longitude,
                alt: loc.coords.altitude
            })
        })
            .then((response) => {
                if (response.status === 403) {
                    console.log('Authentication error...');
                    this.setState({currentMessage: 'Authentication error.'});
                }
                return response.json()
            })
            .then((responseJson) => {
                console.log(responseJson);

                return responseJson;
            })
            .catch((error) => {
                let message = 'Error saving new bookmark.';
                this.setState({'currentMessage': message + "\n" + error});
                console.log(error);
                //throw(error);
            });
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
            .then((response) => {
                if (response.status === 403) {
                    console.log('Authentication error...');
                    this.setState({currentMessage: 'Authentication error.'});
                }
                return response.json();
            })
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

                this.setState({'currentMessage': 'Saving location...'});
                console.log('Storing location...');
                this.createNewBookmark(loc);
                this.setState({'currentMessage': 'Done saving location.'});
            },
            (err) => {
                let message = 'Error pulling GPS coordinates.';
                this.setState({'currentMessage': message});
                console.log(message);
                console.log(err);
                throw(err);
            },
            {enableHighAccuracy: true});
    }

    listBookmarks() {
        let data = this.getBookmarkList();
        console.log(data);
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>{this.state.currentMessage}</Text>
                <Button title="Save GPS location" onPress={this.saveGps}/>
                <Button title="List all bookmarks" onPress={this.listBookmarks}/>
                <Text>Logged in as: {this.state.currentUsername}</Text>
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
