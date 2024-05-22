import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Alert, ActivityIndicator, KeyboardAvoidingView, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { app } from '../../firebaseConfig';
import { Formik } from 'formik';
import { Picker } from '@react-native-picker/picker'
import * as ImagePicker from 'expo-image-picker';
import { getFirestore, getDocs, collection, addDoc, } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage"
import { useUser } from '@clerk/clerk-expo';
import { MaterialIcons } from '@expo/vector-icons';
import { I18n } from 'i18n-js';
import { useSelector } from 'react-redux';

const translations = {
  en: {
    addNewPost: 'Add New Post',
    titlePlaceholder: 'Title*',
    descriptionPlaceholder: 'Description',
    pricePlaceholder: 'Price',
    addressPlaceholder: 'Address',
    submitButton: 'Submit',
    loadingText: 'Loading...',
    successMessage: 'Post Added Successfully',
  },
  ar: {
    addNewPost: 'أضف إعلان جديدة',
    titlePlaceholder: 'العنوان*',
    descriptionPlaceholder: 'الوصف',
    pricePlaceholder: 'السعر',
    addressPlaceholder: 'العنوان',
    submitButton: 'إرسال',
    loadingText: 'جار التحميل...',
    successMessage: 'تم إضافة المنشور بنجاح',
  },
};

const i18n = new I18n(translations);

export default function AddPostScreen() {
  const [image, setImage] = useState(null);
  const db = getFirestore(app);
  const storage = getStorage();
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const [categoryList, setCategoryList] = useState([]);

  useEffect(() => {
    getCategoryList();
  }, [])

  //Used to localization
  const language = useSelector((state) => state.language.language);
  i18n.locale = language;

  //Used to get Category List
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
    });
  };

  //Used to Pick Image from Gallary
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });
    console.log(result);
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  const cancelImage = () => {
    setImage(null);
  };

  //Save Form data to firebase
  const onSubmitMethod = async (values, resetForm) => {
    setLoading(true);
    let imageUrl = image;
    try {
      if (image) {
        const resp = await fetch(image);
        const blob = await resp.blob();
        const storageRef = ref(storage, `communityPost/${Date.now()}.jpg`);
        const snapshot = await uploadBytes(storageRef, blob);
        imageUrl = await getDownloadURL(snapshot.ref);
      }
      const newPost = {
        ...values,
        image: imageUrl,
        userName: user.fullName,
        userEmail: user.primaryEmailAddress.emailAddress,
        userImage: user.imageUrl,
        createdAt: Date.now()
      };
      const docRef = await addDoc(collection(db, "UserPost"), newPost);
      if (docRef.id) {
        Alert.alert(i18n.t('successMessage'));
        resetForm(); 
        setImage(null); 
      }
    } catch (error) {
      console.error("Error adding document: ", error);
      Alert.alert('Error', 'There was an issue adding the post.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <KeyboardAvoidingView className="flex-1 p-1 px-5 bg-white">
      <ScrollView className="p-1 mt-20 bg-white">
        <Text className="text-[27px] font-bold">{i18n.t('addNewPost')}</Text>
        <View className="h-[1px] bg-gray-300 mx-5 my-5 "></View>
        <Formik
          initialValues={{ title: '', desc: '', address: '', price: '', image: '', userName: '', userEmail: '', userImage: '', createdAt: Date.now() }}
          onSubmit={(values, { resetForm }) => onSubmitMethod(values, resetForm)}
          validate={(values) => {
            const errors = {}
            if (!values.title) {
              console.log("Title not Present");
              errors.name = "Title Must be there"
            }
            return errors
          }}
        >
          {({ handleChange, handleSubmit, values, setFieldValue }) => (
            <View>
              <TextInput
                style={styles.input}
                placeholder={i18n.t('titlePlaceholder')}
                value={values?.title}
                onChangeText={handleChange('title')}
              />
              <TextInput
                style={styles.input}
                placeholder={i18n.t('descriptionPlaceholder')}
                value={values?.desc}
                numberOfLines={5}
                onChangeText={handleChange('desc')}
              />
              <TextInput
                style={styles.input}
                placeholder={i18n.t('pricePlaceholder')}
                value={values?.price}
                keyboardType='number-pad'
                onChangeText={handleChange('price')}
              />
              <TextInput
                style={styles.input}
                placeholder={i18n.t('addressPlaceholder')}
                value={values?.address}
                onChangeText={handleChange('address')}
              />
              {/* Category List Dropdown  */}
              <View style={{ borderWidth: 1, borderRadius: 10, marginTop: 15 }}>
                <Picker
                  selectedValue={values?.category}
                  className="border-2"
                  onValueChange={itemValue => setFieldValue('category', itemValue)}
                >
                  {categoryList.length > 0 && categoryList.map((item, index) => (
                    <Picker.Item
                      key={index}
                      label={language === 'en' ? item.name_en : item.name_ar}
                      value={item.id}
                    />
                  ))}
                </Picker>
              </View>
              {/* Pick Image*/}
              <TouchableOpacity className="mt-10" onPress={pickImage}>
                {image ? (
                  <View>
                    <Image source={{ uri: image }} style={{ width: 320, height: 100, borderRadius: 15 }} />
                    <TouchableOpacity onPress={cancelImage} style={{ position: 'absolute', right: 0, top: 0 }}>
                      <MaterialIcons name="cancel" size={30} color="black" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <MaterialIcons name="add-a-photo" size={30} color="black" />
                )}
              </TouchableOpacity>
              {/* Handle Submit*/}
              <TouchableOpacity onPress={handleSubmit}
                style={{ backgroundColor: loading ? '#ccc' : '#dedde6', }}
                disabled={loading}
                className="p-4 bg-gray-300 rounded-full mt-10">
                {loading ?
                  <ActivityIndicator color='#fff' />
                  :
                  <Text className="text-black text-center text-[16px]">{i18n.t('submitButton')}</Text>
                }
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    paddingTop: 15,
    marginTop: 10, marginBottom: 5,
    paddingHorizontal: 17,
    textAlignVertical: 'top',
    fontSize: 17
  }
})