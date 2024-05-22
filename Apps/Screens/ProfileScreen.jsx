import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native'
import React from 'react';
import { useAuth, useUser } from '@clerk/clerk-expo'
import { useNavigation } from '@react-navigation/native'
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { I18n } from 'i18n-js';
import { useSelector, useDispatch } from 'react-redux';


const translations = {
  en: {
    myproduct: 'My Products',
    explore: 'Explore',
    logout: 'Logout',

  },
  ar: {
    myproduct: 'منتجاتي',
    explore: 'استكشف',
    logout: 'تسجيل خروج',

  },
};

const i18n = new I18n(translations);

export default function ProfileScreen() {
  const { user } = useUser();
  const navigation = useNavigation();
  const { isLoaded, signOut } = useAuth();

  /**
   * Used to localization 
   */
  const language = useSelector((state) => state.language.language);
  const dispatch = useDispatch();
  const toggleLanguage = () => {
    dispatch({ type: 'TOGGLE_LANGUAGE' });
  };
  i18n.locale = language;

  const menuList = [
    {
      id: 1,
      name: i18n.t('myproduct'),
      icon: 'my-library-books',
      path: 'my-product'
    },
    {
      id: 2,
      name: i18n.t('explore'),
      icon: 'search-web',
      path: 'explore'
    },
    {
      id: 3,
      name: language.startsWith('en') ? 'العربية' : 'English',
      icon: 'language',
      action: toggleLanguage,
    },
    {
      id: 4,
      name: i18n.t('logout'),
      icon: 'logout',
      action: signOut,
    }
  ];
  const onMenuPress = (item) => {
    if (item.name === 'Logout') {
      signOut();
      return;
    }
    if (item.action) {
      item.action();
    } else {
      item?.path ? navigation.navigate(item.path) : null;
    }
  };

  return (
    <View className="p-1 px-5 bg-white flex-1">
      <View className="items-center mt-20">
        <Image source={{ uri: user?.imageUrl }}
          className="w-[100px] h-[100px] rounded-full"
        />
        <Text className="font-bold text-[25px] mt-2">{user?.fullName}</Text>
        <Text className="text-[18px] mt-2 text-gray-500">{user?.primaryEmailAddress?.emailAddress}</Text>
      </View>
      <View className="h-[1px] bg-gray-300 mx-5 my-5 mt-10"></View>
      <FlatList
        data={menuList}
        style={{ marginTop: 20 }}
        renderItem={({ item, index }) => (
          <>
            {item.id === 4 && (
              <View className="h-[1px] bg-gray-300 my-5" />
            )}
            <TouchableOpacity
              onPress={() => onMenuPress(item)}
              className={`w-full p-1 border-[1px] items-center my-1 rounded-lg border-gray-200 ${item.id === 4 ? 'mt-5' : 'mb-5'}`}>
              {item.id === 3 ? (
                <FontAwesome name={item.icon} size={45} color="black" />
              ) : item.id === 2 ? (
                <MaterialCommunityIcons name={item.icon} size={45} color="black" />
              ) : item.id === 4 ? (
                <AntDesign name={item.icon} size={40} color="black" />
              ) : (
                typeof item.icon === 'string' ? (
                  <MaterialIcons name={item.icon} size={45} color="black" />
                ) : (
                  <Image source={item.icon} className="w-[50px] h-[50px]" />
                )
              )}
              <Text className="text-[12px] mt-2 text-black">{item.name}</Text>
            </TouchableOpacity>
          </>
        )}
        keyExtractor={item => item.id.toString()}
      />


    </View>
  );
}