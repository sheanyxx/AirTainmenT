import React from 'react';
import { Platform, StyleSheet, Text, View, TouchableOpacity, ImageBackground} from 'react-native';
import Header from '../common/Header'
import { BarCodeScanner, Permissions } from 'expo';
import firebase, { database } from 'firebase'

class WelcomeScreen extends React.Component {
  state = {
    hasCameraPermission: null,
    sessionStarted: false,
    bar: 'Scan a BARcode to begin'
  };

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  buttonPress = () => {
    this.props.navigation.navigate('main')
  }

  _handleBarCodeRead = ({ type, data }) => {
    firebase.database().ref(data+"/userid").set("userid")
  };

  render() {
    const { hasCameraPermission } = this.state;

    if (hasCameraPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <ImageBackground 
            source={require('../assets/CityDimmed.jpg')}
            style={{ flex: 1, alignItems:'center'}}>
            <View style = {{width: '100%', opacity: .3}}>
             <Header headerText='Tainment' color= 'black' bar={this.state.bar}/>
            </View>
            <View style = {{width: 300, height: 300, margin: 60}}>
              <BarCodeScanner
                onBarCodeRead={this._handleBarCodeRead}
                style={StyleSheet.absoluteFill}
              />
            </View>
            {/* <View> */}
              <Text style={{color:'white',textAlign: 'center', fontWeight: '300',
                fontFamily: Platform.OS === 'android' ? 'sans-serif-light' : undefined,
                fontSize: 30}}> Scan QR Code </Text>
              <Text style={{color:'white', textAlign: 'center', fontWeight: '100', fontSize: 30}}> To connect to your screen </Text>
              <TouchableOpacity
                style = {styles.Button}
                onPress = {() => this.buttonPress()}
                activeOpacity = {0.6}
              >
                <Text style = {{color: 'white', alignSelf:'center', fontSize: 25, textAlign: 'center'}}>Manage Library</Text>
              </TouchableOpacity>
            <View style = {{position:'absolute', width:'100%', bottom: 0, left: 0}}>
              <View style = {{ height: 60, backgroundColor:'gray'}}>
                  <Text style={{width: '90%'}}>MusicTitle</Text>
                  <Text style ={{width:'10%'}}>Play</Text>
              </View>
            </View>
            {/* </View> */}
          </ImageBackground>
      );
    }
  }
}

const styles = StyleSheet.create({
  Button: {
    margin: 50,
    width: 300,
    height: 80,
    borderRadius: 40,
    display:'flex',
    justifyContent:'center',
    backgroundColor: '#085ff7'
  }
})
export default WelcomeScreen;