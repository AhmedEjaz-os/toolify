import { ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../Components/HomeScreen/Header'
import Slider from '../Components/HomeScreen/Slider'
import { collection, getDocs, getFirestore, orderBy } from 'firebase/firestore';
import { app } from '../../firebaseConfig';
import Categories from '../Components/HomeScreen/Categories';
import LatestItemList from '../Components/HomeScreen/LatestItemList';
import { RefreshControl } from 'react-native';
import { useSelector } from 'react-redux';


export default function HomeScreen() {
  const db = getFirestore(app);
  const [sliderList, setSliderList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [latestItemList, setLatestItemList] = useState([]);
  useEffect(() => {
    getSliders();
    getCategoryList();
    getLatestItemList();
  }, [])

  /**
   * Used to locatization
   */
  const currentLanguage = useSelector((state) => state.language.language);

  /**
   * Used to Get Sliders for Home Screen
   */
  const getSliders = async () => {
    setSliderList([])
    const querySnapshot = await getDocs(collection(db, "Sliders"));
    querySnapshot.forEach((doc) => {
      setSliderList(sliderList => [...sliderList, doc.data()]);
    });
  }

  /**
   * Used to get Category List
   */
  const getCategoryList = async () => {
    setCategoryList([]);
    const querySnapshot = await getDocs(collection(db, 'Category'));
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const categoryItem = {
        id: doc.id,
        name_en: data.name_en,
        name_ar: data.name_ar,
        icon: data.icon
      };
      setCategoryList(categoryList => [...categoryList, categoryItem]);
      console.log("Category List:", categoryList);

    });
  };

  /**
 * Used to get Latest List
 */
  const getLatestItemList = async () => {
    setLatestItemList([]);
    const querySnapShot = await getDocs(collection(db, 'UserPost'), orderBy('createdAt', 'desc'));
    querySnapShot.forEach((doc) => {
      console.log("Docs", doc.data())
      setLatestItemList(latestItemList => [...latestItemList, doc.data()]);
    })
  }

  /**
 * Pull-to-refresh
 */
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        getSliders(),
        getCategoryList(),
        getLatestItemList(),
      ]);
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  return (
    <ScrollView
      className="p-1 px-6 bg-white"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Header />
      <Slider sliderList={sliderList} />
      <Categories categoryList={categoryList} language={currentLanguage} />
      <LatestItemList latestItemList={latestItemList}
        heading={'Latest Items'}
      />
    </ScrollView>
  )
}