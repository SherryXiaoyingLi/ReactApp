import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, Dimensions} from 'react-native';
import { LinearGradient } from 'expo';
import firebase from '../constants/firebase'
//import 'firebase/firestore';
import utility from './language.utility'
//import { database } from 'firebase';


var windowWidth = Dimensions.get('window').width
var windowHeight = Dimensions.get('window').height
var db = firebase.database()
var leadsRef_Users = db.ref('UsersTable');
var leadsRef_Accepted = db.ref('Accepted/');
var leadsRef_Pending = db.ref('Pending')
var today = new Date()
var current_month = today.toLocaleString("en-US", {month: "long"})
var next_month = new Date(today.getFullYear(), today.getMonth()+1, 1).toLocaleString("en-US", {month: "long"})

export default class InvitePending extends React.Component{
    constructor(prop){
        super(prop)
        this.state ={
            queryPendingList: null,
            queryPendingList2: null,
            queryUserList: null,
        }
    }
    
    async queryUsersTable() {
        let that = this
        let res = await leadsRef_Users.on('value', async function(snapshot){
            let query_result = []
            var subresult = await snapshot.forEach( function(childSnapshot){
                var item = childSnapshot.toJSON()
                var key = childSnapshot.key;
                var obj = Object.assign(item, {id: key})
                query_result.push(obj)
               
            })
            that.setState({
                    queryUserList: query_result
                })
        })
    }

    async queryPending() {
        let that = this
        let res = await leadsRef_Pending.orderByChild('month').equalTo(current_month).on('value', async function(snapshot){
            let query_result = []
            var subresult = await snapshot.forEach( function(childSnapshot){
                var item = childSnapshot.toJSON()
                var key = childSnapshot.key;
                var obj = Object.assign(item, {id: key})
                query_result.push(obj)
               
            })
            // var filtered_result = Array.from(new Set(query_result.map((item)=>item)))
            that.setState({
                queryPendingList: query_result
            })
        })
    }

    async queryPending2(){
        let that = this
        let res2 = await leadsRef_Pending.orderByChild('month').equalTo(next_month).on('value', async function(snapshot){
            let query_result = []
            var subresult2 = await snapshot.forEach( function(childSnapshot){
                var item2 = childSnapshot.toJSON()
                var key2 = childSnapshot.key;
                var obj2 = Object.assign(item2, {id: key2})
                query_result.push(obj2)
            })
            // console.log(query_result)
            that.setState({
                queryPendingList2: query_result
            })
        })
    }


    findUser(array, id){
        return array.find(function(element){
            return element.id == id
        })
    }
    async handleAccept(inviter, invitePending){
            await leadsRef_Accepted.push(
                {
                    inviter: invitePending.inviter,
                    location: invitePending.location,
                    time: invitePending.time,
                    month: invitePending.month, 
                }
            )
            await leadsRef_Pending.child(invitePending.id).remove()
        }

    async handleDecline(invitePending){
        await leadsRef_Pending.child(invitePending.id).remove()
    }

    componentWillMount(){
            this.queryPending()
            this.queryUsersTable()
            this.queryPending2()
    }


    keyExtractor(item){
        return item.id.toString()
    }

    renderRow({item}){
         if (this.findUser(this.state.queryUserList, item.inviter)!== undefined){
        var item_inviter = this.findUser(this.state.queryUserList, item.inviter)
        return(
            <View style={styles.rowContainer}>
                <View style={styles.podCastContainer}>
                 <View style={styles.cardContainer}>
            <TouchableOpacity onPress={() => (this.props.navigation.navigate('invitationDetail',{inviter:item_inviter,invitePending:item}))}>
            <View style={styles.top}>
            <Image style={styles.avatar} source={{uri: 'https://facebook.github.io/react-native/docs/assets/favicon.png'}}/>
            <View style={{paddingLeft: 0.008 * windowWidth, flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start'}}>
                <Text style={{fontFamily: 'System', fontSize: 14, color: '#000000', letterSpacing:0, paddingBottom: 0.02 * windowWidth}}>{item_inviter.name}</Text>
                <Text style={{fontFamily: 'System', fontSize: 14, opacity: 0.5, color: '#000000', letterSpacing:0}}>{item.time}</Text>
            </View>
            </View>
            </TouchableOpacity>
            <View style={styles.bottom}>
            <TouchableOpacity onPress={() => this.handleDecline(item)}>
            <View style={styles.bottomLeft}>
                <Image style={styles.cross} source={require('../assets/Sliced/cross.png')}></Image>
                <Text style={{fontFamily: 'System',color: '#FF3B3B', fontSize:13, paddingLeft: 0.02 * windowWidth}}>{utility.t('decline')}</Text>
            </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.handleAccept(item_inviter, item)}>
            <View style={styles.bottomRight}>
                <Image style={styles.check} source={require('../assets/Sliced/check.png')}></Image>
                <Text style={{fontFamily: 'System',color: '#38D459', fontSize:13, paddingLeft: 0.02 * windowWidth}}>{utility.t('accept')}</Text>
            </View>
            </TouchableOpacity>
            </View>
            
            </View>

                </View> 
            </View>
        )
        }
    }

    render(){
        if(this.state.queryPendingList != null && this.state.queryPendingList2 != null && this.state.queryUserList!=null){
        let pendingResultList = this.state.queryPendingList.concat(this.state.queryPendingList2)
        return(
            <View style={styles.container}>
                <LinearGradient 
                style={{width: windowWidth, height:  0.3 * windowHeight, flex: 1}}
                colors={['#FFFFFF', '#B0C4DE']}
                start={ [0, 1] }
                end={ [0, 0] }
                >

                <View style={[styles.container, {alignItems:'center'}]}>
                <View style={[styles.titleSection, {left: -0.4 * windowWidth}]}>
                    <Text style={styles.title}> {utility.t('pending')}</Text>
                </View>
                <View style={{height: 0.22 * windowHeight, width: 0.92 * windowWidth, }}>
                 <FlatList 
                    style={styles.ScollablePodCasts}
                    data={pendingResultList}
                    extraData={this.state}
                    renderItem={this.renderRow.bind(this)}
                    keyExtractor={this.keyExtractor}
                    horizontal={true}
                /> 
                </View>
                </View>

                </LinearGradient>
            </View>
        )
        }else{
            return(<View style={{flex:1}}/>)
        }
    }
}

const styles = StyleSheet.create(
    {
        container:{
            flex: 0.84,
            flexWrap: 'wrap',
            flexDirection:'column',
            height:  0.3 * windowHeight,
        },
        titleSection:{
            height: 29,
            flexDirection:'row', 
            justifyContent: 'space-between',
            alignItems:'center',
            
        },
        title: {
            fontSize: 14,
            fontFamily: 'System',
            opacity: 0.8,
            color: '#000000',
            letterSpacing: 0,
            //padding: 18,
        },

        ScollablePodCasts:{
            // width: 0.92 * windowWidth, 
            // height: 0.22 * windowHeight,
            //backgroundColor: 'gray',
            
            },

        rowContainer:{
            flex: 1,
            flexDirection:'column', 
            justifyContent: 'space-evenly',
            alignItems: 'center',
            padding: 15,
        },

        podCastContainer:{
            flexDirection:'row', 
            justifyContent: 'space-between',
            alignItems: 'center',
        },

        podCastTile:{
            fontSize: 14,
            color: "#FFFFFF",
            letterSpacing: -0.15,
            textAlign: "left",
            paddingTop: 10
        }, 

        card: {
            backgroundColor: '#FFFFFF',
            height: 0.2 * windowHeight, 
            width: 0.86 * windowWidth,
        },

        cardContainer: {
            backgroundColor: '#FFFFFF',
            height: 0.22 * windowHeight, 
            width: 0.86 * windowWidth,
            flexDirection: 'column',
            borderRadius: 10,
            borderWidth: 0.5,
            borderColor: '#D3D3D3'
        },
        top: {
            width: 0.86 * windowWidth,
            height: 0.12 * windowHeight,
            borderBottomWidth: 0.5,
            borderBottomColor: '#D3D3D3',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-evenly'
        },
        bottom: {
            flexDirection: 'row',
            width: 0.86 * windowWidth,
            height: 0.08 * windowHeight,
        },
        bottomLeft:{
            width: 0.43 * windowWidth,
            height: 0.08 * windowHeight,
            borderRightWidth: 0.5,
            borderRightColor: '#D3D3D3',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
        },
        bottomRight: {
            width: 0.43 * windowWidth,
            height: 0.08 * windowHeight,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
           
        },
        cross:{
            width: 13,
            height: 13
        },
        check:{
            width: 13,
            height: 13
        },
        avatar:{
            borderWidth:1,
            borderColor:'rgba(0,0,0,0.2)',
            alignItems:'center',
            justifyContent:'center',
            width: 0.076 * windowHeight,
            height: 0.076 * windowHeight,
            backgroundColor:'#fff',
            borderRadius: 0.076 * windowHeight/2,
          }

    }
)