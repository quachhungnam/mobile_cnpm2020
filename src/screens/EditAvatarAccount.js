import React, { Component } from 'react';
import {
  Dimensions,
  Alert,
  Text,
  View,
  TouchableHighlight,
  FlatList,
  ScrollView,
  Image,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

export default class EditAvatarAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
    };
    this.openImagePicker = this.openImagePicker.bind(this);
  }

  openImagePicker() {
    const newData = this.state.images;
    ImagePicker.openPicker({
      //multiple: true,
      mediaType: 'photo',
    }).then(images1 => {
      let item = {
        width: images1.width,
        height: images1.height,
        uri: images1.path,
        id: Date.now(),
      };
      newData.push(item);
      this.setState({ images: newData });
      console.log(this.state.images);
    });
  }

  render() {
    var width1 = Dimensions.get('window').width;
    let a = <View />;
    if (this.state.images.length != 0) {
      a = (
        <Image
          style={{ width: 100, height: 70 }}
          source={{ uri: this.state.images[0] }}
        />
      );
    }
    return (
      <ScrollView style={{ backgroundColor: '#fff' }}>
        <FlatList
          data={this.state.images}
          renderItem={({ item, index }) => {
            return (
              <TouchableHighlight
                onLongPress={() => {
                  Alert.alert(
                    'Thông báo',
                    'Bạn có chắc chắn muốn xóa ảnh này?',
                    [
                      { text: 'Không', onPress: () => { }, style: 'cancel' },
                      {
                        text: 'có',
                        onPress: () => {
                          const newData = this.state.images;
                          for (var i = 0; i < newData.length; i++) {
                            if (newData[i].id == item.id) {
                              newData.splice(i, 1);
                            }
                          }
                          this.setState({ images: newData });
                        },
                        style: 'cancel',
                      },
                    ],
                  );
                }}
                style={{
                  marginBottom: 10,
                  marginTop: 10,
                  marginLeft: 10,
                  marginRight: 10,
                }}>
                <Image
                  resizeMode="cover"
                  style={{
                    overflow: 'visible',
                    height: (item.height * 1 * width1) / item.width,
                    width: 0.95 * width1,
                  }}
                  source={{ uri: item.uri }}
                />
              </TouchableHighlight>
            );
          }}
        />
        <TouchableHighlight
          underlayColor={'#ffceb56e'}
          disabled={this.state.images.length == 1 ? true : false}
          style={{
            marginBottom: 10,
            marginTop: 10,
            marginLeft: 10,
            marginRight: 10,
            paddingTop: 10,
            paddingBottom: 10,
            backgroundColor: '#ffceb5',
            borderRadius: 8,
          }}
          onPress={this.openImagePicker}>
          <Text style={{ textAlign: 'center' }}>Chọn ảnh</Text>
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor={'#ffceb56e'}
          disabled={this.state.images.length == 0 ? true : false}
          style={{
            marginBottom: 10,
            marginTop: 10,
            marginLeft: 10,
            marginRight: 10,
            paddingTop: 10,
            paddingBottom: 10,
            backgroundColor: '#ffceb5',
            borderRadius: 8,
          }}
          onPress={() => {
            //alert(JSON.stringify(this.getMyStringValue()));
            this.getMyStringValue();
          }}>
          <Text style={{ textAlign: 'center' }}>Cập nhật</Text>
        </TouchableHighlight>
        {/* <TouchableHighlight
                        disabled={this.state.images.length == 0 ? true : false}
                        style={{marginBottom: 10, marginTop: 10, marginLeft: 10, marginRight: 10, paddingTop: 5, paddingBottom: 5, backgroundColor: 'lightblue', borderRadius: 10}}
                        onPress={() => {
                            this.setStringValue();
                        }}
                    >
                    <Text style={{textAlign: 'center'}}>Đăng bài1</Text>
                </TouchableHighlight>  */}
      </ScrollView>
    );
  }
}