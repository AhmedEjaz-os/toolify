import { View, Text, Image, ScrollView, Linking, Share, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useUser } from '@clerk/clerk-expo';
import { collection, deleteDoc, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { app } from '../../firebaseConfig';
import { I18n } from 'i18n-js';
import { useSelector, useDispatch } from 'react-redux';
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';

const translations = {
    en: {
        des: 'Description:',
        delete: 'Delete',
        send: 'Send Message',
        confirmDeleteTitle: 'Do you want to Delete?',
        confirmDeleteMessage: 'Are you sure you want to delete this post?',
        confirm: 'Yes',
        cancel: 'Cancel',
        emailSubject: 'Regarding ',
        emailBody: 'Hi ',
        emailInterest: 'I am interested in this product',
    },
    ar: {
        des: 'الوصف:',
        delete: 'حذف',
        send: 'أرسل رسالة',
        confirmDeleteTitle: 'هل تريد الحذف؟',
        confirmDeleteMessage: 'هل أنت متأكد أنك تريد حذف هذا المنشور؟',
        confirm: 'نعم',
        cancel: 'إلغاء',
        emailSubject: 'بخصوص ',
        emailBody: 'مرحبا ',
        emailInterest: 'أنا مهتم بالمنتج',
    }
};

const i18n = new I18n(translations);

export default function ProductDetail({ navigation }) {
    const { params } = useRoute();
    const [product, setProduct] = useState([]);
    const { user } = useUser();
    const db = getFirestore(app);
    const nav = useNavigation();
    useEffect(() => {
        params && setProduct(params.product);
        shareButton();
    }, [params, navigation])

    const shareButton = () => {
        navigation.setOptions({
            headerRight: () => (
                <Entypo name="share-alternative" size={24}
                    onPress={() => shareProduct()}
                    color="white"
                    style={{ marginRight: 30 }} />
            ),
        });
    }

    /**
     * Used to localization 
     */
    const language = useSelector((state) => state.language.language);
    i18n.locale = language;

    /**
     * Used to Share Product
     */
    const shareProduct = async () => {
        const content = {
            message: product?.title + "\n" + product?.desc,
        }
        Share.share(content).then(resp => {
            console.log(resp);
        }, (error) => {
            console.log(error);
        })
    }

    /**
     * Used to send Messaege 
     */
    const sendEmailMessage = () => {
        const subject = i18n.t('emailSubject') + product.title;
        const body = `${i18n.t('emailBody')}${product.userName}\n${i18n.t('emailInterest')}`;
        Linking.openURL(`mailto:${product.userEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    };

    /**
 * Used to delete post 
 */
    const deleteUserPost = () => {
        Alert.alert(
            i18n.t('confirmDeleteTitle'), // Title
            i18n.t('confirmDeleteMessage'), // Message
            [
                {
                    text: i18n.t('confirm'), // Yes button
                    onPress: () => deleteFromFirestore()
                },
                {
                    text: i18n.t('cancel'), // Cancel button
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
            ]
        );
    }

    const deleteFromFirestore = async () => {
        console.log('Deleted');
        const q = query(collection(db, 'UserPost'), where('title', '==', product.title))
        const snapshot = await getDocs(q);
        snapshot.forEach(doc => {
            deleteDoc(doc.ref).then(resp => {
                console.log("Deleted the Doc...");
                nav.goBack();
            })
        })
    }

    return (
        <ScrollView className="bg-white">
            <Image source={{ uri: product.image }}
                className="h-[320px] w-full"
            />
            <View className="m-5">
                <Text className="text-[24px] font-bold">{product?.title}</Text>
                <View className="h-[1px] bg-gray-300 my-5"></View>
                <Text className="mt-5 font-bold text-[20px]">{i18n.t('des')}</Text>
                <Text className="mt-2 text-[17px] text-gray-500">{product?.desc}</Text>
                <View className="h-[1px] bg-gray-300 mx-5 my-5 mt-20"></View>
            </View>

            {/* User Info  */}
            <View className="p-3 flex flex-row items-center gap-3 mt-5">
                <Image source={{ uri: product.userImage }}
                    className="w-12 h-12 rounded-full"
                />
                <View >
                    <Text className="font-bold text-[18px]">{product.userName}</Text>
                    <Text className="text-gray-500">{product.userEmail}</Text>
                </View>
            </View>
            {user?.primaryEmailAddress.emailAddress == product.userEmail ?
                <TouchableOpacity
                    onPress={() => deleteUserPost()}
                    className="flex-row justify-center items-center bg-blue-50 rounded-full p-4 m-2 mt-20">
                    <AntDesign name="delete" size={24} color="black" />
                    <Text className="text-center text-balck">{i18n.t('delete')}</Text>
                </TouchableOpacity>
                :
                <TouchableOpacity
                    onPress={() => sendEmailMessage()}
                    className="flex-row justify-center items-center bg-blue-50 rounded-full p-4 m-2 mt-20">
                    <Feather name="send" size={24} color="black" />
                    <Text className="text-center text-black">{i18n.t('send')}</Text>
                </TouchableOpacity>
            }
        </ScrollView>
    )
}