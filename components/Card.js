import React, { Component } from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components/native";
import Icon from "react-native-vector-icons/Ionicons";
import { getDate } from "../util";
import LikeIcon from "../assets/like";
import CommentIcon from "../assets/comment";
import MoreIcon from "../assets/more";
import PixelArt from "./PixelArt";
import { firebase } from "../firebase/config";

import {
  Text,
  StyleSheet,
  View,
  TextInput,
  Image,
  FlatList,
  Pressable,
  Alert
} from "react-native";
import {
  TouchableOpacity,
  TouchableWithoutFeedback
} from "react-native-gesture-handler";

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  margin: 5px 0 0 0;
  align-items: center;
  flex: 1;
`;

const Wrapper = styled.Pressable`
  border-radius: 8px;
  padding: 5px 20px 5px 20px;
  margin-bottom: 10px;
  align-items: flex-start;
  justify-content: space-around;
`;

const TopRow = styled.View`
  flex-direction: row;
  margin-bottom: 5px;
  align-items: center;
  justify-content: center;
`;
const IconLabel = styled.Text`
  font-size: 14px;
  margin-left: 5px;
  font-weight: 500;
  margin-right: 10px;
`;

const Title = styled.Text`
  font-size: 15px;
  font-weight: 400;
`;

const UserName = styled.Text`
  margin-left: 10px;
  font-size: 14px;
  font-weight: 500;
`;

const TimeLabel = styled.Text`
  font-size: 13px;
  font-weight: 400;
  color: #8a8a8a;
  margin-top: 6px;
  margin-bottom: 10px;
`;

const Item = ({
  title,
  id,
  likesCount,
  commentsCount,
  backgroundColor,
  report,
  author
}) => {};

const imagesRef = firebase.firestore().collection("images");
const usersRef = firebase.firestore().collection("users");

export default class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // title: this.props.title,
      // id: this.props.id,
      likesCount: this.props.likesCount,
      // commentsCount: this.props.commentsCount,
      // backgroundColor: this.props.backgroundColor,
      // report: this.props.report,
      // author: this.props.author,
      islike: false,
      userName: "Visitor",
      userId: this.props.item.userID === undefined ? 0 : this.props.item.userID,
      url: "https://picsum.photos/id/125/250/250",
      publishTime:
        !this.props.publishTime == null && !this.props.publishTime === undefined
          ? this.props.publishTime.toDate()
          : new Date()
    };
  }

  static defaultProps = {};

  componentDidMount() {
    usersRef.where("id", "==", this.state.userId).onSnapshot(
      querySnapshot => {
        //const newEntities = [];
        querySnapshot.forEach(doc => {
          this.setState({ userName: doc.data().fullName, url: doc.data().url });
        });
        console.log(this.state.userName);
        // this.setState({
        //   published: newEntities,
        // });
      },
      error => {
        console.log(error);
      }
    );
  }

  pressLike = () => {
    this.setState({
      islike: !this.state.islike,
      likesCount: this.state.islike
        ? this.state.likesCount - 1
        : this.state.likesCount + 1
    });
    if (this.state.islike !== true) {
      imagesRef.doc(this.props.id).update({
        likes: this.state.likesCount + 1
      });
    }
    this.props.onChangeLike(
      this.props.item,
      this.state.islike,
      this.state.likesCount
    );
  };
  render() {
    return (
      <Wrapper
        onPress={() => {
          this.props.viewDetail(
            this.props.item,
            this.state.islike,
            this.state.likesCount
          );
        }}
        style={styles.item}
      >
        <TopRow>
          <Row>
            <Image
              source={{
                uri: this.state.url
              }}
              style={{
                width: 30,
                height: 30,
                borderRadius: 15
              }}
            />
            <UserName>{this.state.userName}</UserName>
          </Row>
          <MoreIcon width={25} height={25} />
        </TopRow>

        <Row>
          <PixelArt
            size={340}
            backgroundColor={this.props.backgroundColor}
            data={this.props.data}
          />
        </Row>

        <Row>
          <Pressable onPress={e => this.pressLike()}>
            {this.state.islike ? (
              <Icon name="heart" size={25} color="tomato" />
            ) : (
              <Icon name="heart-outline" size={25} />
            )}
          </Pressable>
          <IconLabel>{this.state.likesCount} likes</IconLabel>
          <CommentIcon width={25} height={25} />
          <IconLabel>{this.props.commentsCount} comments</IconLabel>
        </Row>
        <Row>
          <Title>{this.props.title}</Title>
        </Row>
        <Row>
          {/* <TimeLabel>
            {new Date(this.props.publishTime).toLocaleDateString()}
          </TimeLabel> */}
          <TimeLabel>{getDate(this.state.publishTime)}</TimeLabel>
        </Row>
      </Wrapper>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: "white",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16
  },
  title: {
    fontSize: 32
  }
});
