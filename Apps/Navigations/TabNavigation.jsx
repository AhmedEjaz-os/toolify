import { View, Text } from 'react-native'
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AddPostScreen from '../Screens/AddPostScreen';
import HomeScreeStackNav from '../Navigations/HomeScreeStackNav';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import ExploreScreenStackNav from './ExploreScreenStackNav';
import ProfileScreenStackNav from './ProfileScreenStackNav';
import { I18n } from 'i18n-js';
import { useSelector } from 'react-redux';


const Tab = createBottomTabNavigator();

const translations = {
  en: {
    home: 'Home',
    explore: 'Explore',
    add: 'Add',
    profile: 'Profile',
  },
  ar: {
    home: 'الرئيسية',
    explore: 'استكشف',
    add: 'اضف',
    profile: 'الملف الشخصي',
  }
};

const i18n = new I18n(translations);

export default function TabNavigation() {

  const language = useSelector((state) => state.language.language);
  i18n.locale = language;

  return (
    <Tab.Navigator screenOptions={{
      headerShown: false,
    }}>
      <Tab.Screen name='home-nav' component={HomeScreeStackNav}
        options={{
          tabBarLabel: ({ color }) => (
            <Text style={{ color: color, fontSize: 11, marginBottom: 2 }}>{translations[language].home}</Text>
          ),
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="home" size={24} color="black" />
          )
        }}
      />
      <Tab.Screen name='explore' component={ExploreScreenStackNav}
        options={{
          tabBarLabel: ({ color }) => (
            <Text style={{ color: color, fontSize: 11, marginBottom: 2 }}>{translations[language].explore}</Text>
          ),
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="search1" size={24} color="black" />
          )
        }} />
      <Tab.Screen name='addpost' component={AddPostScreen}
        options={{
          tabBarLabel: ({ color }) => (
            <Text style={{ color: color, fontSize: 11, marginBottom: 2 }}>{translations[language].add}</Text>
          ),
          tabBarIcon: ({ color, size }) => (
            <FontAwesome6 name="add" size={24} color="black" />
          )
        }} />
      <Tab.Screen name='profile' component={ProfileScreenStackNav}
        options={{
          tabBarLabel: ({ color }) => (
            <Text style={{ color: color, fontSize: 11, marginBottom: 2 }}>{translations[language].profile}</Text>
          ),
          tabBarIcon: ({ color, size }) => (
            <FontAwesome6 name="user" size={20} color="black" />
          )
        }} />
    </Tab.Navigator>
  )
}