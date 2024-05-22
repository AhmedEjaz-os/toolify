import { View, Text, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, getDocs, getFirestore, orderBy, query, where } from 'firebase/firestore'
import { app } from '../../firebaseConfig'
import LatestItemList from '../Components/HomeScreen/LatestItemList'
import { RefreshControl } from 'react-native';
import { I18n } from 'i18n-js';
import { useSelector } from 'react-redux';

const translations = {
  en: {
    explore: 'Explore More',
  },
  ar: {
    explore: 'استكشاف المزيد',
  },
};

const i18n = new I18n(translations);

export default function ExploreScreen() {
  const db = getFirestore(app)
  const [productList, setproductList] = useState([]);
  useEffect(() => {
    getAllProducts();
  }, [])

  /**
   * Used to locatization
   */
  const language = useSelector((state) => state.language.language);
  i18n.locale = language;

  /**
   * Used to get All Products
   */
  const getAllProducts = async () => {
    setproductList([]);
    const q = query(collection(db, 'UserPost'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    snapshot.forEach((doc) => {
      setproductList(productList => [...productList, doc.data()]);
    })
  }

  /**
   * Pull-to-refresh
   */
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await getAllProducts();
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  return (
    <ScrollView
      className="flex-1 p-1 px-5 bg-white mt-20"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text className="text-[27px] font-bold mt-20">{i18n.t('explore')}</Text>
      <View className="h-[1px] bg-gray-300 mx-5 my-5 "></View>
      <LatestItemList latestItemList={productList} />
    </ScrollView>
  )
}