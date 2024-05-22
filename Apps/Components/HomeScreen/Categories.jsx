import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { I18n } from 'i18n-js';
import { useSelector } from 'react-redux';

const translations = {
  en: {
    categories: 'Categories',

  },
  ar: {
    categories: 'فئات',

  },
};

const i18n = new I18n(translations);

export default function Categories({ categoryList }) {
  const navigation = useNavigation();

  const language = useSelector((state) => state.language.language);
  i18n.locale = language;

  return (
    <View className="mt-3">
      <Text className="font-bold text-[20px]">{i18n.t('categories')}</Text>
      <FlatList
        data={categoryList}
        numColumns={4}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('item-list', {
              category: language === 'en' ? item.name_en : item.name_ar
            })}
            className="flex-1 items-center justify-center mt-10 ">
            <Image source={{ uri: item.icon }} className="w-[35px] h-[30px]" />
            <Text className="text-[12px] mt-1">
              {language === 'en' ? item.name_en : item.name_ar}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  )
}