import { View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { app } from '../../firebaseConfig';
import { useUser } from '@clerk/clerk-expo';
import LatestItemList from '../Components/HomeScreen/LatestItemList';
import { useNavigation } from '@react-navigation/native';

export default function MyProducts() {
  const db = getFirestore(app);
  const { user } = useUser();
  const [productList, setProductList] = useState([]);
  const navigation = useNavigation();
  useEffect(() => {
    if (user) {
      getUserPost();
    }
  }, [user]);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', (e) => {
      getUserPost();
    });
    return unsubscribe;
  }, [navigation]);

  const getUserPost = async () => {
    const q = query(collection(db, 'UserPost'), where('userEmail', '==', user?.primaryEmailAddress?.emailAddress));
    const snapshot = await getDocs(q);
    const items = [];
    snapshot.forEach(doc => {
      items.push(doc.data());
    });
    setProductList(items);
  };

  return (
    <View className="flex-1 p-1 px-5 bg-white">
      <LatestItemList latestItemList={productList} />
    </View>
  );
}
