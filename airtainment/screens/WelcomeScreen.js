import React from 'react'
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Image,
  Dimensions,
  TouchableWithoutFeedback
} from 'react-native'
import Header from '../common/Header'
import { BarCodeScanner, Permissions } from 'expo'
import firebase, { database } from 'firebase'
import { Ionicons } from '@expo/vector-icons'

class WelcomeScreen extends React.Component {
  state = {
    hasCameraPermission: null,
    sessionStarted: false,
    bar: 'Scan a BARcode to begin',
    imageUrl:'',
    title:''
  }

  async componentWillMount () {
    const { status } = await Permissions.askAsync(Permissions.CAMERA)
    this.setState({ hasCameraPermission: status === 'granted' })
  }

  componentDidMount = () => {
    firebase.database().ref('tablet/currentlyPlaying').on('value', (v) => {
      let data = v.val()
      this.setState({imageUrl:data.image, title:data.title, type: data.type, isPlaying: data.isPlaying})
    })
  }

  buttonPress = () => {
    this.props.navigation.navigate('main')
  }

  _handleBarCodeRead = ({ type, data }) => {
    if (data==="tablet"){
    firebase
      .database()
      .ref(data + '/userid')
      .set('userid')

    this.setState({sessionStarted: true})
    }
  }

  changePlayStatus = () => {
    firebase.database().ref('tablet/currentlyPlaying/isPlaying').set(!this.state.isPlaying)
  }

  resetApp = () => {
    firebase
    .database()
    .ref('tablet' + '/userid')
    .set('default')
    this.setState({sessionStarted: false})
    
  }

  render () {
    const { hasCameraPermission } = this.state

    if (hasCameraPermission === null) {
      return <Text>Requesting for camera permission</Text>
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>
    } else {
      return (
        <ImageBackground
          source={require('../assets/CityDimmed.jpg')}
          style={{ flex: 1, alignItems: 'center' }}
        >
          <View style={{ width: '100%' }}>
            <Header headerText='Airtainment'  bar={this.state.bar} />
          </View>
           { !this.state.sessionStarted ?
           <View>
           <View style={{ width: 300, height: 300, margin: 60 }}>
            <BarCodeScanner
              onBarCodeRead={this._handleBarCodeRead}
              style={StyleSheet.absoluteFill}
            />
          </View>
          <Text
            style={{
              color: 'white',
              textAlign: 'center',
              fontWeight: '300',
              fontFamily:
                Platform.OS === 'android' ? 'sans-serif-light' : undefined,
              fontSize: 30
            }}
          >
            {' '}
            Scan QR Code{' '}
          </Text>
          <Text
            style={{
              color: 'white',
              textAlign: 'center',
              fontWeight: '400',
              fontSize: 25
            }}
          >To connect to your screen
          </Text>
          </View>
          :
          <View>
            <View style = {{marginTop:100, marginBottom: 100}}>
            <View style ={{display:'flex', alignItems:'center'}}>
              <Image
                source={require('../assets/clearamericanairlines.png')}
                style={{ overflow:'visible', width:350, height:50}}
              />
            </View>
                <Text
                style={{
                  color: 'white',
                  textAlign: 'center',
                  fontWeight: '300',
                  fontFamily:
                    Platform.OS === 'android' ? 'sans-serif-light' : undefined,
                  fontSize: 20
                }}
              >Flight: 3452A</Text>
              <Text
                style={{
                  color: 'white',
                  textAlign: 'center',
                  fontWeight: '300',
                  fontFamily:
                    Platform.OS === 'android' ? 'sans-serif-light' : undefined,
                  fontSize: 20
                }}
              >Going to Laguardia Airport (LGA)</Text>
            </View>
            <Text
            style={{
              color: 'white',
              textAlign: 'center',
              fontWeight: '300',
              fontFamily:
                Platform.OS === 'android' ? 'sans-serif-light' : undefined,
              fontSize: 30
            }}
          >You have sucessfully logged in</Text>
            <Text
            style={{
              color: 'white',
              textAlign: 'center',
              fontWeight: '100',
              fontSize: 30
            }}
          >Enjoy your trip!{' '}
          </Text>
          </View>
          }
          <TouchableOpacity
            style={styles.Button}
            onPress={() => this.buttonPress()}
            onLongPress={() => this.resetApp()}
            activeOpacity={0.6}
          >
            <Text
              style={{
                color: 'white',
                alignSelf: 'center',
                fontSize: 25,
                fontWeight: 'bold',
                textAlign: 'center'
              }}
            >
              Manage Library
            </Text>
          </TouchableOpacity>
          {this.state.sessionStarted ?
            <View
              style={{ position: 'absolute', width: '100%', bottom: 0, left: 0 }}
            >
              <View
                style={{
                  height: 65,
                  display: 'flex',
                  flexDirection: 'row',
                  backgroundColor: 'gray'
                }}
              >
                <View
                  style={{ flex: 8, marginLeft: 10, flexDirection: 'column' }}
                >
                  <View
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      flexDirection: 'row'
                    }}
                  >
                    <Image
                      source={{uri: this.state.imageUrl}}
                      style={{
                        borderRadius: 25,
                        width: 50,
                        height: 50
                      }}
                    />
                    <Text style={{ fontSize: 18, marginLeft: 15 }}>{this.state.title}</Text>
                  </View>
                </View>
                {this.state.type == 'audio' ? <TouchableWithoutFeedback
                  style={{ flex: 1, alignSelf: 'center' }}
                  onPress={() => this.changePlayStatus()}
                >
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                      {this.state.isPlaying ? (
                        <Ionicons name='md-pause' size={32} color='black' />
                      ) : (
                        <Ionicons name='md-play' size={32} color='black' />
                      )}
                    </View>
                </TouchableWithoutFeedback> : null}
              </View>
            </View> : null }
        </ImageBackground>
      )
    }
  }
}

const styles = StyleSheet.create({
  Button: {
    margin: 50,
    width: 300,
    height: 80,
    borderRadius: 40,
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: '#6f79a8'
  }
})
export default WelcomeScreen
