// stylesCard.js
// This file is the keeper of styles for the bottom NavBar and for the Gradient Cards
import { StyleSheet } from 'react-native';

export const containerStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export const tabBarStyles = StyleSheet.create({
    tabBarLight: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        elevation: 0,
        backgroundColor: 'white',
        height: 60,
        alignItems: 'center',
    },
    tabBarDark: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        elevation: 0,
        backgroundColor: '#2e2e3b',
        height: 60,
        alignItems: 'center',
    },
});

export const middleButtonStyles = StyleSheet.create({
    MiddleButtonContainer: {
        position: 'absolute',
        top: -30,
        left: '50%',
        marginLeft: -30,
        width: 60,
        height: 60,
    },
    customButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#00D6FC',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,
        shadowColor: '#00D6FC',
        shadowOpacity: 0.4,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 4,
    },
});

export const iconStyles = StyleSheet.create({
    iconStyle: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
    },
});

//_+_+_+_+_+_+_+_+_+_+_+_+_Card Settings_+_+_+_+_+_+_+_+_+_+_+_+
export const cardStyles = StyleSheet.create({
    cardContainer: {
    // borderRadius: 20,
    // // overflow: 'hidden',
    // padding: 10,
    // width: deviceWidth * 1,
    // Shadow for iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 20,

        // For android
        elevation: 10,
    },
    gradientBackground: {
        padding: 5,
        alignItems: 'center',
        width: '95%',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    cardImage: {
        width: '95%',
        height: 200,
    },
    cardText: {
        marginTop: 10,
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
    },
    cardButton: {
        marginTop: 10,
        padding: 10,
        borderRadius: 20,
        borderWidth: 1,
        alignSelf: 'stretch',
        fontWeight: 'bold',
        backgroundColor: '#FFFFFF',
    },
    buttonText: {
        textAlign: 'center',
        color: '#00D6FC',
    },
});
