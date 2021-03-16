import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

export default function App() {
    const [entries, setEntries] = useState([{key: 'a'}, {key: 'b'}]);
    useEffect(() => {
        axios.get('https://lobste.rs/hottest.json')
            .then(xs => setEntries(
                xs.data.map(x => ({key: x.short_id, title: x.title}))
            ))
            .catch(r => console.log(r))
            ;
    }, []);

    return (
        <View style={styles.container}>
        <FlatList
            data        = {entries}
            renderItem  = {({item}) => <Text>{item.title}</Text>}
        />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor : '#fafafa',
        alignItems      : 'center',
        justifyContent  : 'center',
    },
});
