import React from 'react';
import {createDrawerNavigator, createSwitchNavigator, createStackNavigator,createAppContainer} from 'react-navigation'
import HomeScreen from './components/HomeScreen';
import Splash from './components/Splash'
import Login from './components/Login'
import event from './components/EventDetail'
import create from './components/CreateEvent'
import create2 from './components/CreateEvent2'
import testScreen from './components/testscreen'
import invitePending from './components/InvitePending'
import invitation from './components/InvitationsDetail'
import write from './components/writeTable'
//import testscreen from './components/testscreen'
import { Facebook } from 'expo';

const homeStack = createDrawerNavigator(
  {
    homeScreen: HomeScreen,
    invitationDetail:invitation,
    createEvent:create, 
    createEvent2:create2,
    eventDetail: event,
  }) 
const authStack = createDrawerNavigator({login: Login})
const testStack = createDrawerNavigator({test:event})
const writeStack = createDrawerNavigator({writeTable: write})

const createEventStack = createDrawerNavigator(
  {
    createEvent:create, 
    createEvent2:create2,
  }
)

const AppContainer = createAppContainer(
  createSwitchNavigator({
    spl: Splash,
    home: homeStack,
    auth: authStack,
    test: createEventStack,
    
    w: writeStack
    
  },
  {
    //initialRouteName: 'spl'
    initialRouteName: 'home'
    //initialRouteName: 'w'
  }
  ))



 export default AppContainer;



