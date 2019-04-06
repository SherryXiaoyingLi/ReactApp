import React from 'react';
import {createDrawerNavigator, createSwitchNavigator, createStackNavigator,createAppContainer} from 'react-navigation'
import HomeScreen from './components/HomeScreen';
import Splash from './components/Splash'
import Login from './components/Login'
import event from './components/EventDetail'
import create from './components/CreateEvent'
import create2 from './components/CreateEvent2'
import testScreen from './components/testscreen'
import cardHori from './components/CardHori'
import invitePending from './components/InvitePending'
import invitation from './components/InvitationsDetail'
//import testscreen from './components/testscreen'
import { Facebook } from 'expo';

const homeStack = createDrawerNavigator(
  {homeSreen: HomeScreen,
    invitationDetail:invitation,
    createEvent:create, 
    createEvent2:create2,
    eventDetail: event
  }) 
const authStack = createDrawerNavigator({login: Login})
<<<<<<< HEAD
=======
const createEventStack = createDrawerNavigator(
  {
    createEvent:create, 
    createEvent2:create2,
  }
)
>>>>>>> 75d181c46007e72b5f451dc6dbf14933ae9345be

const AppContainer = createAppContainer(
  createSwitchNavigator({
    spl: Splash,
    home: homeStack,
    auth: authStack,
    
    
  },
  {
    // initialRouteName: 'createEvent2'
<<<<<<< HEAD
    initialRouteName: 'home'
=======
    initialRouteName: 'spl'
>>>>>>> 75d181c46007e72b5f451dc6dbf14933ae9345be
  }
  ))



 export default AppContainer;



