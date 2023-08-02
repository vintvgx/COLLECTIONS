import { StyleSheet, Text, View, Image, Dimensions, SafeAreaView } from 'react-native'
import React from 'react'



const Loading = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Image 
        source={require('../../assets/logo_resized.png')}
        style={styles.logo}
      />
      <Image 
        source={require('../../assets/collections_nametag.png')}
        style={styles.collections_tag}
      />
    </SafeAreaView>
  )
}

export default Loading

const styles = StyleSheet.create({
    container: {
        display: 'block',
        backgroundColor: 'white',
        // flex: 1,
        justifyContent: 'center',
        alignSelf:'center',
        alignItems: 'center',     
        margin: 'auto',
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height , 
        
    },
    logo: {
        
        width: 100,
        height: 100,
        position: 'relative',
        top: 30
        
        
    },
    collections_tag: {
        // flex: 1,
        resizeMode: 'center',
       
    
        
    }
})