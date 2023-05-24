import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'


//*  FOR DEVELOPING & TESTING / ALLOWING TO NAVIGATE FREELY SCREEN TO SCREEN 

const Menu = () => {
  return (
    <View>
      <Text>NAVIGATION</Text>
      <TouchableOpacity
            onPress={() => {
                //go to this page
            }}
        >
        <Text>REGISTER</Text>
      </TouchableOpacity>
      <TouchableOpacity
            onPress={() => {
                //go to this page
            }}
        >
        <Text>HOME</Text>
      </TouchableOpacity>
      <TouchableOpacity
            onPress={() => {
                //go to this page
            }}
        >
        <Text>+1</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Menu

const styles = StyleSheet.create({})