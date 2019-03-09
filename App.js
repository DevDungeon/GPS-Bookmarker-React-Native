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
        this.saveGps = this.saveGps.bind(this);
        this.asyncStorageKey = "gps-bookmarker-data"
    }

    async wipeBookmarks() {
        console.log('Wiping bookmarks.');
        await AsyncStorage.setItem(this.asyncStorageKey, "");
    }

    saveGps() {
        navigator.geolocation.getCurrentPosition(async (loc) => {
                let data = await AsyncStorage.getItem(this.asyncStorageKey, () => {
                });
                try {
                    if (data === null) {
                        data = Array();
                    } else {
                        data = JSON.parse(data);
                    }
                    data.push(loc);
                    await AsyncStorage.setItem(this.asyncStorageKey, JSON.stringify(data));
                } catch (err) {
                    console.log("Error setting bookmark data..." + err)
                }
            },
            (err) => {
                console.log('Error pulling GPS coordinates.');
                console.log(err)
            },
            {enableHighAccuracy: true})
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
