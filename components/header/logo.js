import React from 'react'
import {StyleSheet, Text} from 'react-native';

import { Image } from 'react-native'

import { Colors, Fonts, Sizes } from '../../styles'

// insert image file as logo
const Logo = () => {
//  return  <Text/>
  return <Image
            source={require('../../assets/inprove_logo_transparent.png')}
            style={styles.logo}
          />
}


const styles = StyleSheet.create({
  logo: {
    width: 200,
    height: 50,
  },
})

export default Logo
