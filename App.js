import React from 'react';
import {StyleSheet, Text, View, Button, TextInput} from 'react-native';
import {createBottomTabNavigator, createAppContainer} from 'react-navigation';

// TODO Store session securely with https://github.com/oblador/react-native-keychain
// TODO Add ListView/ScrollView to review all created bookmarks
// TODO add a "Description" field to store with each location
// TODO Show the current location on screen before committing the save
// TODO Button "View bookmarks" -> Have a ScrollView with a List and all bookmarks+descriptions
// TODO Give feedback on save/print errors
// TODO Allow 'email bookmarks'
// TODO Create a new tab with a list of all the current bookmarks

let baseUrl = "http://192.168.1.156:8000/api/";


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});


class MainScreen extends React.Component {

    constructor(props) {
        super(props);
        this.saveBookmark = this.saveBookmark.bind(this);
        this.listBookmarks = this.listBookmarks.bind(this);
        this.state = {'currentMessage': 'GPS coordinate not yet saved.'}
    }

    createNewBookmark(loc) {
        let url = baseUrl + "bookmarks.json";

        fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                lat: loc.coords.latitude,
                lon: loc.coords.longitude,
                alt: loc.coords.altitude
            }),
            credentials: 'same-origin',
        }).then((response) => {
            if (response.status === 403) {
                console.log('Authentication error...');
                this.setState({currentMessage: 'Authentication error.'});
            }
            return response.json()
        }).then((responseJson) => {
            console.log(responseJson);

            return responseJson;
        }).catch((error) => {
            let message = 'Error saving new bookmark.';
            this.setState({'currentMessage': message + "\n" + error});
            console.log(error);
        });
    }

    getBookmarkList() {
        let url = baseUrl + "bookmarks.json";

        fetch(url, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            },
            credentials: 'same-origin'
        }).then((response) => {
            if (response.status === 403) {
                console.log('Authentication error...');
                this.setState({currentMessage: 'Authentication error.'});
            }
            return response.json();
        }).then((responseJson) => {
            console.log(responseJson);
            return responseJson;
        }).catch((error) => {
            console.log(error);
            throw(error);
        });
    }

    saveBookmark() {
        navigator.geolocation.getCurrentPosition(async (loc) => {
                this.setState({'currentMessage': 'Saving location...'});
                console.log('Storing location...');
                this.createNewBookmark(loc);
                this.setState({'currentMessage': 'Done saving location.'});
            },
            (err) => {
                let message = 'Error pulling GPS coordinates.';
                this.setState({'currentMessage': message});
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
                <Button title="Save GPS location" onPress={this.saveBookmark}/>
                <Button title="List all bookmarks" onPress={this.listBookmarks}/>
            </View>
        );
    }
}


class LoginScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUsername: '',
            password: '',
            currentMessage: 'Not logged in.'
        };
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
    }

    logout() {
        fetch(baseUrl + 'logout', {
            method: 'GET',
            credentials: 'same-origin',
        }).then((response) => {
            this.setState({currentMessage: 'Now logged out.'});
            console.log(response);
        }).catch((error) => {
            console.log('Error logging out.');
            console.log(error);
            this.setState({currentMessage: 'Error logging out...'})
        })
    }


    login() {
        this.setState(prevState => ({
            currentMessage: 'Logging in...'
        }));
        console.log('STate:::');
        console.log(this.state);

        let formData = new FormData();
        formData.append('username', this.state.currentUsername);
        formData.append('password', this.state.password);
        let url = baseUrl + 'login/';

        fetch(url, {
            method: 'POST',
            body: formData,
            credentials: 'same-origin',
        }).then((response) => {
            if (response.status === 200) {
                this.setState({currentMessage: 'Now logged in'});
                console.log(response);
            } else {
                throw("Error logging in.")
            }
        }).catch((error) => {
            console.log(error);
            this.setState({currentMessage: 'Error logging in...Check credentials'})
        })
    }

    render() {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text>Enter Username:</Text>
                <TextInput
                    onChangeText={(text) => this.setState({currentUsername: text})}>
                    {this.state.currentUsername}
                </TextInput>
                <Text>Enter Password:</Text>
                <TextInput
                    onChangeText={(text) => this.setState({password: text})}>
                    {this.state.password}
                </TextInput>
                <Button onPress={this.login} title="Login"/>
                <Text>{this.state.currentMessage}</Text>
                <Button onPress={this.logout} title="Logout"/>
            </View>
        );
    }
}

const TabNavigator = createBottomTabNavigator({
    Bookmark: MainScreen,
    Login: LoginScreen,
});

export default createAppContainer(TabNavigator);
