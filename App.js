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
    let path = (new URL(comment.url));
    return (
        <Link to={`${path.pathname}`}>
            <Text>{renderComments(comment.count)}</Text>
        </Link>
    );
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
        <View style={styles.content}>
        <FlatList
            data        = {entries}
            renderItem  = {({item}) => <Entry entry={item}/>}
        />
        </View>
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
        <View style={styles.content}>
        <FlatList
            data        = {entries}
            renderItem  = {({item}) => <Entry entry={item}/>}
        />
        </View>
    );
};

const PostComment = ({item}) => (
    <Text style={styles.postComment}>{item.comment}</Text>
);

const Post = ({match}) => {
    const [comments, setComments] = useState([]);
    useEffect(() => {
        axios.get(`https://lobste.rs/${match.url}.json`)
            .then(es => setComments(es.data.comments))
            .catch(r => console.log(r))
            ;
    }, []);

    return (
        <View style={styles.content}>
        <FlatList
            data            = {comments}
            renderItem      = {({item}) => <PostComment item={item}/>}
            keyExtractor    = {(item)   => item.short_url}
            />
        </View>
    );
};

export default function App() {
    return (
        <NativeRouter>
        <View style={styles.container}>
            <View style={styles.nav}>
                <Link style={styles.navItem} to="/">
                    <Text style={styles.navText}>Hottest</Text>
                </Link>
                <Link style={styles.navItem} to="/newest">
                    <Text style={styles.navText}>Newest</Text>
                </Link>
            </View>

            <Switch>
                <Route exact path="/" component={Hottest}/>
                <Route path="/newest" component={Newest}/>
                <Route path="/s/:id" component={Post}/>
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
        paddingTop      : StatusBar.currentHeight,
    },
    content: {
        flex            :  2,
        paddingTop      :  0,
        paddingLeft     : 10,
        paddingRight    : 10,
        paddingBottom   : 10,
    },
    information: {
        fontFamily  : 'sans-serif',
        fontSize    : 10,
        color       : '#828282'
    },
    nav: {
        backgroundColor : '#500000',
        flexDirection   : 'row',
        justifyContent  : 'space-around',
    },
    navItem: {
        alignItems  : 'center',
        flex        : 1,
        padding     : 10,
    },
    navText: {
        color: '#ffffff',
    },
    postComment: {
        color: '#828282',
    },
    story: {
        fontFamily  : 'sans-serif',
        fontSize    : 14,
    },
});
