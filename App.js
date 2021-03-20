import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { FlatList, Platform, StatusBar, StyleSheet, Text, View } from 'react-native';
import 'react-native-url-polyfill/auto';

const Comments = ({entry}) => {
    const renderComments = (count) => {
        switch(count) {
            case 0  : return "no comments";
            case 1  : return "1 comment";
            default : return count + " comments";
        }
    };
    return <Text>{renderComments(entry.comments)}</Text>;
};

const Entry = ({entry}) => (
    <View style={styles.item}>
        <Text style={styles.storylink}>{entry.title}</Text>
        <Text style={styles.information}>
            {entry.username} | {entry.hostname} | <Comments entry={entry}/>
        </Text>
    </View>
);

export default function App() {
    const [entries, setEntries] = useState([]);
    useEffect(() => {
        axios.get('https://lobste.rs/hottest.json')
            .then(xs => setEntries(
                xs.data.map(function(x) {
                    let domain = (new URL(x.url));
                    console.log(x);
                    return {
                        key: x.short_id
                        , title: x.title
                        , hostname: domain.hostname
                        , username: x.submitter_user.username
                        , comments: x.comment_count
                    };
                })
            ))
            .catch(r => console.log(r))
            ;
    }, []);

    return (
        <View style={styles.container}>
        <FlatList
            data        = {entries}
            renderItem  = {({item}) => <Entry entry={item}/>}
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
        paddingTop      : Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 10,
        paddingLeft     : 10,
        paddingRight    : 10,
        paddingBottom   : 10,
    },
    storylink: {
        fontFamily  : 'sans-serif',
        fontSize    : 14,
    },
    information: {
        fontFamily  : 'sans-serif',
        fontSize    : 10,
        color       : "#828282"
    }
});
