import { View, Text, Image, TextInput } from 'react-native'
import React from 'react'
import { useUser } from '@clerk/clerk-expo'
import { EvilIcons } from '@expo/vector-icons';

export default function Header() {
    const { user } = useUser();

    return (
        <View>
            {/* User Info Section  */}
            <View className="flex flex-row items-center  gap-3 mt-20">
                <Image source={{ uri: user?.imageUrl }}
                    className="rounded-full w-12 h-12 left-3 "
                />
                <View>

                    <Text className="text-[20px] font-bold left-2">{user?.fullName}</Text>
                </View>
            </View>
            {/* Search bar  */}
            <View className="p-[9px] px-5 flex flex-row 
                            items-center  bg-blue-50 mt-5 rounded-full 
                            border-[1px] border-gray-300">
                <EvilIcons name="search" size={24} color="black" />
                <TextInput placeholder='search'
                    className="ml-2 text-[16px]"
                    onChangeText={(value) => console.log(value)}
                />
            </View>
        </View>
    )
}