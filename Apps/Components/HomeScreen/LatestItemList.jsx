import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import PostItem from './PostItem'
import { I18n } from 'i18n-js';
import { useSelector, useDispatch } from 'react-redux';

const translations = {
  en: {
    latestitem: 'Latest Items',

  },
  ar: {
    latestitem: 'أحدث العناصر',

  }
};

const i18n = new I18n(translations);

export default function LatestItemList({ latestItemList }) {

  const language = useSelector((state) => state.language.language);
  i18n.locale = language;

  return (
    <View className="mt-5">
      <Text className="font-bold text-[20px]">{i18n.t('latestitem')}</Text>
      <FlatList className="mt-5"
        data={latestItemList}
        numColumns={2}
        renderItem={({ item }) => (
          <PostItem item={item} />
        )}
      />
    </View>
  )
}