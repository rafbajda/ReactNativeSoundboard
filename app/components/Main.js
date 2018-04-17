import React, { Component } from 'react';
import {dataArray} from './Data';
import styles from '../styles/MainStyle'
import SoundRow from './SoundRow';
import Face from './Face';
import {
    ActivityIndicator,
    Image,
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
var RNFS = require('react-native-fs');

export default class Main extends Component {
    constructor(props){
        super(props);
        this.state = {
            currentPerson : "all",
            stateLoading : true,
        };
    }
    componentWillMount(){
        this.deleteAssets();
        RNFS.exists(RNFS.DocumentDirectoryPath + "/RCUsounds")
    .then( (exists) => {
        if (exists) {
            this.setState({stateLoading: false});
        } else {       
            this.moveAssets();
            this.setState({stateLoading: false});       
        }
    });
    }   
    moveAssets(){
         this.makeSkeleton();
         this.copyAssets();
         this.deleteAssets();         
    }
    deleteAssets(){ 
        
    }
    makeSkeleton(){
        let mainDir = RNFS.DocumentDirectoryPath + "/RCUsounds";
        dataArray.map((val) => {
            let temp = mainDir + "/" + val.type;
            RNFS.mkdir(temp);
        })
    }
    copyAssets(){
        dataArray.map((val) => {
            val.sounds.map((snd) => {
            let temp = "rcusounds/" + val.type + "/" + snd;
            let dest = RNFS.DocumentDirectoryPath + "/RCUsounds/" + val.type + "/" + snd;
            RNFS.copyFileAssets(temp, dest).then(function(res){
                console.log(res)
            },function(error){
                console.log(error)
            })           
        })
     })
    }

    getResponse(result){        
        this.setState({currentPerson: result});
    }
    render() {             

        if(this.state.stateLoading) 
        return(
            <View style = {styles.container}>
                <Text style = {styles.loading}> Loading DATA... </Text>
                <View style = {styles.loadingAnimation}>
                    <ActivityIndicator size = {250} color = 'red' />   
                </View>
                <View style = {styles.footerLoading}>
                   <Image style={styles.ImgFooter}
                    source = {require('../../android/app/src/main/assets/rcuimages/samplefooter.jpg')}
                    />
                </View>              
                
            </View>            
        )
        return (
            <View style={styles.container}>
                <View>
                    <ScrollView horizontal = {true} style={styles.header}>
                        <Face callback={this.getResponse.bind(this)}></Face>
                    </ScrollView>
                </View>
                <View style={styles.scrollContainer}>
                    <ScrollView >
                        <SoundRow person = {this.state.currentPerson}></SoundRow>
                    </ScrollView> 
                </View>
                <View style={styles.footer}> 
                    <Image style={styles.ImgFooter}
                    source = {require('../../android/app/src/main/assets/rcuimages/samplefooter.jpg')}
                    />
                </View>
            </View>
        );
    }          
}
