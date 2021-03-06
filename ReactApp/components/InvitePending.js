import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, Dimensions, ScrollView, Animated} from 'react-native';
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

export default class InvitePending extends React.Component{
    constructor(prop){
        super(prop)
        this.state ={
            queryPendingList: null,
            queryPendingList2: null,
            queryUserList: null,
            last_view_time: "",
            onEndReachedCalledDuringMomentum : true,
            addedToList2: false,
            alreadyFetched1: false,
            flashGreen: '',
            // flashRed: '',
            styleMonth: ''
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

    async queryPending2(next_month){
        let that = this
        let leadsRef_Pending_month = db.ref('Pending/' + next_month)
        let res2 = await leadsRef_Pending_month.on('value', async function(snapshot){
            let m_test = next_month
            //console.log(m_test)
            
            let query_result = []
            let subresult2 = await snapshot.forEach( function(childSnapshot){
                let item2 = childSnapshot.toJSON()
                let key2 = childSnapshot.key;
                let obj2 = Object.assign(item2, {id: key2})
                query_result.push(obj2)
            })
            let last_view_time = ""
            if (query_result[query_result.length-1]!==undefined) {
                last_view_time = query_result[query_result.length-1]["time"]
            }
            that.setState({
                queryPendingList2: query_result,
                onEndReachedCalledDuringMomentum: true,
                addedToList2: true,
                last_view_time: last_view_time, 
                alreadyFetched1: false
            })
            
        })
    }
    async queryPending(current_month) {
        let that = this 
        let leadsRef_Pending_month = db.ref('Pending/' + current_month)
        let res = await leadsRef_Pending_month.on('value', async function(snapshot){
            let m_test = current_month
            //console.log(m_test)
            let query_result = []
            let subresult = await snapshot.forEach( function(childSnapshot){
                let item = childSnapshot.toJSON()
                let key = childSnapshot.key;
                let obj = Object.assign(item, {id: key})
                query_result.push(obj)
            })
            // var filtered_result = Array.from(new Set(query_result.map((item)=>item)))
            that.setState({
                queryPendingList: query_result,
                //last_view_time: query_result[query_result.length-1]["time"],
                alreadyFetched1: true,
                addedToList2: false,
                //queryPendingList2: null
            })
        })
    }

  
    findUser(array, id){
        return array.find(function(element){
            return element.id == id
        })
    }
    async handleAccept(inviter, invitePending){
            this.setState({flashGreen: invitePending.id})
            await leadsRef_Accepted.push(
                {
                    inviter: invitePending.inviter,
                    location: invitePending.location,
                    time: invitePending.time,
                    month: invitePending.month, 
                }
            )
            let leadsRef_Pending_month = db.ref("Pending/"+invitePending.month)
            await leadsRef_Pending_month.child(invitePending.id).remove()
        }

    async handleDecline(invitePending){
            // this.setState({flashRed: invitePending.id})
        
            let leadsRef_Pending_month = db.ref("Pending/"+invitePending.month)
            await leadsRef_Pending_month.child(invitePending.id).remove()
        }

    flashGreen(itemKey) {
        if (this.state.flashGreen === itemKey ) {
            return styles.cardContainer2
        }  
        // console.log("check")
        // console.log(itemKey)
        // console.log(this.state.flashRed)
        // if (this.state.flashRed === itemKey) {
        //     return styles.cardContainer3
        // }
         return  styles.cardContainer

    }
   
    // flashRed(itemKey) {
    //     return this.state.flashRed === itemKey ? styles.cardContainer3 : styles.cardContainer
    // }
    
    onViewableItemsChanged = ({viewableItems, changed}) =>{
        // console.log("Visible items are", viewableItems);
        // console.log("Changed in this iteration", changed);
        if (viewableItems!==undefined && viewableItems["0"]!==undefined){
            let viewing_month = viewableItems["0"]["item"]["month"]
            this.scrollToMonth(viewing_month)
        }
    }

    scrollToMonth(viewing_month) {
        let months = ["January", "February", "March", "April", "May", "June","July","August","September","October", "November", "December"]
        let numeric_month = months.indexOf(viewing_month)+1
        //console.log(numeric_month)
        this._scrollView.scrollTo({x: (numeric_month-1) * 41});
        console.log(viewing_month)
        this.setState({styleMonth: viewing_month})
    }

    monthStyle(viewing_month) {
        return this.state.styleMonth === viewing_month ? styles.month2 : styles.month
    }

    onEndReached=({distanceFromEnd}) =>{
        if(!this.state.onEndReachedCalledDuringMomentum ){
            // console.log("reached")
            // console.log(new Date(this.state.last_view_time).toLocaleString())
            let viewing = new Date(this.state.last_view_time)
            let month1 = new Date(viewing.getFullYear(), viewing.getMonth(), 1).toLocaleString("en-US", {month: "long"})
            let month2 = new Date(viewing.getFullYear(), viewing.getMonth()+1, 1).toLocaleString("en-US", {month: "long"})
            // console.log(month1)
            // console.log(month2)
            //this.setState({isLoading: true, isLoading2: true})
            if (!this.state.alreadyFetched1){
             this.queryPending(month1)
            }
            if (month2!==month1) {
                //console.log(month2)
            this.queryPending2(month2)
            }
        }
    }
    componentWillMount(){
            this.queryPending(new Date().toLocaleString("en-US", {month: "long"}))
            let viewing = new Date()
            this.queryPending2(new Date(viewing.getFullYear(), viewing.getMonth()+1, 1).toLocaleString("en-US", {month: "long"}))
            this.queryUsersTable()
    }


    keyExtractor(item){
        return item.id.toString()
    }

    renderRow({item}){
         if (this.findUser(this.state.queryUserList, item.inviter)!== undefined){
        var item_inviter = this.findUser(this.state.queryUserList, item.inviter)
        var the_time = new Date(item.time)
        var processed_time = the_time.toLocaleDateString() + ' '+the_time.toLocaleString("en-US", {hour: '2-digit', minute:'2-digit'})
        return(
            <View style={styles.rowContainer}>
                <View style={styles.podCastContainer}>
                 <View style={this.flashGreen(item.id)}>
            <TouchableOpacity onPress={() => (this.props.navigation.navigate('invitationDetail',{inviter:item_inviter,invitePending:item}))}>
            <View style={styles.top}>
            <Image style={styles.avatar} source={{uri: item_inviter.img}}/>
            <View style={{paddingLeft: 0.008 * windowWidth, flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start'}}>
                <Text style={{fontFamily: 'System', fontSize: 14, color: '#000000', letterSpacing:0, paddingBottom: 0.02 * windowWidth}}>{item_inviter.name}</Text>
                <Text style={{fontFamily: 'System', fontSize: 14, opacity: 0.5, color: '#000000', letterSpacing:0}}>{processed_time}</Text>
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
        if(this.state.queryPendingList != null  && this.state.queryUserList!=null){
        let pendingResultList = this.state.queryPendingList
        if (this.state.addedToList2 && this.state.queryPendingList2!==null && this.state.queryPendingList2[0]!==undefined){
            let m_test1 = new Date(this.state.queryPendingList[0]["time"]).toLocaleString("en-US", {month: "long"})
            let m_test2 = new Date(this.state.queryPendingList2[0]["time"]).toLocaleString("en-US", {month: "long"})
            if (m_test1 === m_test2 && this.state.queryPendingList.length==this.state.queryPendingList2.length + 1){
                let viewing = new Date(this.state.queryPendingList[0]["time"])
                this.queryPending(m_test1)
                this.queryPending2(new Date(viewing.getFullYear(), viewing.getMonth()+1, 1).toLocaleString("en-US", {month: "long"}))
            }
            else {
                pendingResultList = this.state.queryPendingList.concat(this.state.queryPendingList2)
            }
        }
        //console.log(pendingResultList)
        return(
            <View style={styles.container}>
                <LinearGradient 
                style={{width: windowWidth, height:  0.3 * windowHeight, flex: 1}}
                colors={['#FFFFFF', '#B0C4DE']}
                start={ [0, 1] }
                end={ [0, 0] }
                >

                <View style={[styles.container, {alignItems:'center'}]}>

                <ScrollView 
                horizontal={true}
                style={styles.calendar}
                showsHorizontalScrollIndicator={false}
                ref={view=>this._scrollView = view}
                >
                <Text style={this.monthStyle('January')}>January</Text>
                <Text style={this.monthStyle('February')}>February</Text>
                <Text style={this.monthStyle('March')}>March</Text>
                <Text style={this.monthStyle('April')}>April</Text> 
                <Text style={this.monthStyle('May')}>May</Text>
                <Text style={this.monthStyle('June')}>June</Text>
                <Text style={this.monthStyle('July')}>July</Text>
                <Text style={this.monthStyle('August')}>August</Text>
                <Text style={this.monthStyle('September')}>September</Text>
                <Text style={this.monthStyle('October')}>October</Text>
                <Text style={this.monthStyle('November')}>November</Text>
                <Text style={this.monthStyle('December')}>December</Text>
                </ScrollView>

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
                    onViewableItemsChanged={this.onViewableItemsChanged}
                    onEndReachedThreshold={0.1} 
                    onEndReached = {this.onEndReached.bind(this)}
                    onMomentumScrollBegin={()=>{this.setState({onEndReachedCalledDuringMomentum:false})}} 
                /> 
                </View>
                </View>

                </LinearGradient>
            </View>
        )
        }
        else{
            return(<View style={{flex:1}}/>)
        }
    }
}

const styles = StyleSheet.create(
    {
        container:{
            //flex: 0.84,
            flexWrap: 'wrap',
            flexDirection:'column',
            height:  0.31 * windowHeight,
            //backgroundColor: 'red'
        },
        calendar:{
            height: 0.04*windowHeight,
            width: windowWidth,
            //left: -0.4 * windowWidth,
            //backgroundColor: 'blue',
            borderWidth: 0.5,
            borderColor: '#D3D3D3',
            
            
        },
        month:{
            fontSize: 15,
            fontFamily: 'System',
            opacity: 0.4,
            color: '#000000',
            letterSpacing: 0,
            textAlign: 'center',
            paddingLeft: 0.08*windowWidth,
            paddingTop: 0.02*windowHeight
        },

        month2:{
            fontSize: 15,
            fontFamily: 'System',
            // opacity: 0.4,
            // color: '#000000',
            letterSpacing: 0,
            textAlign: 'center',
            paddingLeft: 0.08*windowWidth,
            paddingTop: 0.02*windowHeight
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
        },

        ScollablePodCasts:{
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
            borderColor: '#D3D3D3',
           
        },
        cardContainer2: {
            backgroundColor: '#90EE90',
            height: 0.22 * windowHeight, 
            width: 0.86 * windowWidth,
            flexDirection: 'column',
            borderRadius: 10,
            borderWidth: 0.5,
            borderColor: '#D3D3D3',
           
        },
        cardContainer3: {
            backgroundColor: 'red',
            height: 0.22 * windowHeight, 
            width: 0.86 * windowWidth,
            flexDirection: 'column',
            borderRadius: 10,
            borderWidth: 0.5,
            borderColor: '#D3D3D3',
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
            height: 0.1 * windowHeight,
        },
        bottomLeft:{
            width: 0.43 * windowWidth,
            height: 0.1 * windowHeight,
            borderRightWidth: 0.5,
            borderRightColor: '#D3D3D3',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
        },
        bottomRight: {
            width: 0.43 * windowWidth,
            height: 0.1 * windowHeight,
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