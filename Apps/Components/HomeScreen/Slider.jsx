import { View, Text, FlatList, Image } from 'react-native'
import React from 'react'

export default function Slider({ sliderList }) {
    return (
        <View className="mt-5">
            <FlatList
                data={sliderList}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item, index }) => (
                    <View>
                        <Image source={{ uri: item?.image }}
                            className="h-[160px] w-[360px] mr-6 rounded-lg
                        object-cover"
                        />
                    </View>
                )}
            />
        </View>
    )
    
}