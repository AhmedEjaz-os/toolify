import { View, Text, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { collection, getDoc, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { app } from '../../firebaseConfig';
import LatestItemList from '../Components/HomeScreen/LatestItemList';
import { I18n } from 'i18n-js';
import { useSelector } from 'react-redux';

const translations = {
  en: {
    nopostfound: 'No Post Found',
  },
  ar: {
    nopostfound: 'لم يتم العثور على إعلانات',
  },
};

const i18n = new I18n(translations);

export default function ItemList() {
  const { params } = useRoute();
  const db = getFirestore(app);
  const [itemList, setItemList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (params && params.category) {
      getCategoryDocumentId();
    } else {
      console.log('The params object is missing or does not have a category property:', params);
    }
  }, [params]);

  const language = useSelector((state) => state.language.language);
  i18n.locale = language;

  const getCategoryDocumentId = async () => {
    if (!params || !params.category) {
      console.log('Invalid params:', params);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const categoryField = /[a-zA-Z]/.test(params.category) ? 'name_en' : 'name_ar';
      const categoryQuery = query(collection(db, 'Category'), where(categoryField, '==', params.category));
      const categorySnapshot = await getDocs(categoryQuery);
      const categories = categorySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const category = categories[0];
      if (category) {
        getItemListByCategory(category.id);
      } else {
        console.error('No matching category found for:', params.category);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching category document ID:', error);
      setLoading(false);
    }
  };

  const getItemListByCategory = async (categoryId) => {
    const q = query(collection(db, 'UserPost'), where('category', '==', categoryId));
    const snapshot = await getDocs(q);
    setLoading(false);
    snapshot.forEach(doc => {
      console.log(doc.data());
      setItemList(itemList => [...itemList, doc.data()]);
    });
  };

  return (
    <View className="p-2">
      {loading ? (
        <ActivityIndicator className="mt-24" size={'large'} color={'#3b82f6'} />
      ) : itemList?.length > 0 ? (
        <LatestItemList latestItemList={itemList} heading={''} />
      ) : (
        <Text className="p-5 text-[20px] mt-24 justify-center text-center text-gray-400">{i18n.t('nopostfound')}</Text>
      )}
    </View>
  );
}
