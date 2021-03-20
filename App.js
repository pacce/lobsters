import axios from 'axios';
import React, { useState, useEffect } from 'react';
import {
    FlatList
    , Linking
    , Platform
    , StatusBar
    , StyleSheet
    , Text
    , View
} from 'react-native';
import 'react-native-url-polyfill/auto';

const Comment = ({comment}) => {
    const renderComments = (count) => {
        switch(count) {
            case 0  : return "no comments";
            case 1  : return "1 comment";
            default : return count + " comments";
        }
    };
    return <Text>{renderComments(comment.count)}</Text>;
};

const Story = ({story}) => {
    const open = (url) => Linking.openURL(url);
    return <Text style={styles.story} onPress={() => open(story.url)}>{story.title}</Text>;
};

const Entry = ({entry}) => (
    <View style={styles.item}>
        <Story story={entry.story}/>
        <Text style={styles.information}>
            {entry.username}
            {" | "} {entry.hostname}
            {" | "} <Comment comment={entry.comments}/>
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
                    let story       = {title: x.title, url: x.url};
                    let comments    = {count: x.comment_count, url: x.comments_url};
                    return {
                        key: x.short_id
                        , story     : story
                        , hostname  : domain.hostname
                        , username  : x.submitter_user.username
                        , comments  : comments
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
    story: {
        fontFamily  : 'sans-serif',
        fontSize    : 14,
    },
    information: {
        fontFamily  : 'sans-serif',
        fontSize    : 10,
        color       : "#828282"
    }
});
