import axios from 'axios';
import React, { useState, useEffect } from 'react';
import {
    FlatList
    , Linking
    , Platform
    , StatusBar
    , StyleSheet
    , Text
    , TouchableOpacity
    , View
} from 'react-native';
import { Link, NativeRouter, Route, Switch } from 'react-router-native';
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

const Story = ({story}) => (
    <TouchableOpacity onPress={() => Linking.openURL(story.url)}>
        <Text style={styles.story}>{story.title}</Text>
    </TouchableOpacity>
);

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

const processEntry = (x) => {
    let hostname = '';
    if (x.url != '') {
        let domain  = (new URL(x.url));
        hostname    = domain.hostname;
    }
    let story       = {title: x.title, url: x.url};
    let comments    = {count: x.comment_count, url: x.comments_url};
    return {
        key         : x.short_id
        , story     : story
        , hostname  : hostname
        , username  : x.submitter_user.username
        , comments  : comments
    };
};

const Hottest = () => {
    const [entries, setEntries] = useState([]);
    useEffect(() => {
        axios.get('https://lobste.rs/hottest.json')
            .then(es => setEntries(es.data.map(processEntry)))
            .catch(r => console.log(r))
            ;
    }, []);

    return (
        <FlatList
            data        = {entries}
            renderItem  = {({item}) => <Entry entry={item}/>}
        />
    );
};

const Newest = () => {
    const [entries, setEntries] = useState([]);
    useEffect(() => {
        axios.get('https://lobste.rs/newest.json')
            .then(es => setEntries(es.data.map(processEntry)))
            .catch(r => console.log(r))
            ;
    }, []);

    return (
        <FlatList
            data        = {entries}
            renderItem  = {({item}) => <Entry entry={item}/>}
        />
    );
};

export default function App() {
    return (
        <NativeRouter>
        <View style={styles.container}>
            <View>
                <Link to="/"><Text>Hottest</Text></Link>
                <Link to="/newest"><Text>Newest</Text></Link>
            </View>

            <Switch>
                <Route exact path="/" component={Hottest}/>
                <Route path="/newest" component={Newest}/>
            </Switch>
        </View>
        </NativeRouter>
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
