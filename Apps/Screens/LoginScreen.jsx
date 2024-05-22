import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import * as WebBrowser from 'expo-web-browser';
import { useOAuth } from '@clerk/clerk-expo';
import { useWarmUpBrowser } from '../../hooks/useWarmUpBrowser';
import { I18n } from 'i18n-js';
import { useSelector, useDispatch } from 'react-redux';


const translations = {
    en: {
        welcome: 'Join your local marketplace to trade, explore, and connect with ease. Buying and selling just got simpler and safer',
        getStarted: 'Get Started',
    },
    ar: {
        welcome: 'انضم إلى سوقك المحلي للتجارة والاستكشاف والتواصل بسهولة. أصبحت عمليات الشراء والبيع أبسط وأكثر أمانًا. ابدأ اليوم',
        getStarted: 'ابدأ',
    }
};

const i18n = new I18n(translations);

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
    useWarmUpBrowser();
    const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

    /**
     * Used to locatization
     */
    const language = useSelector((state) => state.language.language);
    const dispatch = useDispatch();
    const toggleLanguage = () => {
        dispatch({ type: 'TOGGLE_LANGUAGE' });
    };
    i18n.locale = language;

    const onPress = React.useCallback(async () => {
        try {
            const { createdSessionId, setActive } = await startOAuthFlow();
            if (createdSessionId) {
                setActive({ session: createdSessionId });
            }
        } catch (err) {
            console.error("OAuth error", err);
        }
    }, []);

    return (
        <View className="items-center mt-10">
            <TouchableOpacity onPress={toggleLanguage} className="absolute top-5 right-5  ">
                <Text className="text-black bg-gray-300 p-1 rounded-md">{language.startsWith('en') ? 'العربية' : 'English'}</Text>
            </TouchableOpacity>
            <Image source={require('./../../assets/images/loginVideo.gif')}
                className=" object-cover mt-20 rounded-xl "
            />
            <View className="p-8   bg-gray-300 flex h-full rounded-t-2xl shadow-md mt-5">
                <Text className="text-[18px] text-black text-center mt-6">{i18n.t('welcome')}</Text>
                <TouchableOpacity onPress={onPress} className="p-4 bg-white rounded-full mt-40">
                    <Text className="text-blue text-center text-[18px]">{i18n.t('getStarted')}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
