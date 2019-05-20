import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  SectionList,
  SafeAreaView,
} from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

import countries from './countryCode.json';
const sectionMapArr = [
  ['A', 0],
  ['B', 1],
  ['C', 2],
  ['D', 3],
  ['E', 4],
  ['F', 5],
  ['G', 6],
  ['H', 7],
  ['I', 8],
  ['J', 9],
  ['K', 10],
  ['L', 11],
  ['M', 12],
  ['N', 13],
  ['O', 14],
  ['P', 15],
  ['Q', 16],
  ['R', 17],
  ['S', 18],
  ['T', 19],
  ['U', 20],
  ['V', 21],
  ['W', 22],
  ['X', 23],
  ['Y', 24],
  ['Z', 25],
];
export default class App extends React.Component {

  state = {
    select: 'no',
  };

  constructor(props) {
    super(props);
    this.ps = [];
    this.offsetY = 0;
    this.sectionlist = React.createRef();
  }

  render() {
    const { select, key, show, showX, showY = -1000 } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <SectionList
          ref={this.sectionlist}
          onLayout={({ nativeEvent: { layout: { y }, }, }) => {
            this.offsetY = y;
          }}
          onScrollToIndexFailed={() => {

          }}
          containerStyle={{ flex: 1, justifyContent: 'center' }}
          ItemSeparatorComponent={() => (<View style={{ borderBottomColor: '#F8F8F8', borderBottomWidth: 1, }} />)}
          renderItem={({ item, index, section }) => (
            <View style={styles.itemContainer}>
              <Text style={styles.itemText} key={index}>
                {item.countryName}
              </Text>
            </View>
          )}
          renderSectionHeader={({ section: { key } }) => (
            <View style={styles.headerContainer}>
              <Text style={styles.headerText}>{key}</Text>
            </View>
          )}
          sections={countries}
          keyExtractor={(item, index) => item + index}
        />
        <View
          style={{ width: 16, justifyContent: 'center', alignItems: 'center' }}
          onStartShouldSetResponder={() => true}
          onMoveShouldSetResponder={() => true}
          onResponderGrant={evt => {
            this.setState({
              show: true,
            });
          }}
          onResponderRelease={e => {
            this.setState({
              show: false,
            });
          }}
          onResponderReject={() => {
            console.log('onResponderReject');
          }}
          onResponderMove={({ nativeEvent: { pageX, pageY } }) => {
            const offsetY = pageY - this.offsetY;
            const find = this.ps.find(
              i => i.min < offsetY && i.max > offsetY
            );
            if (find) {
              const { key } = this.state;
              if (find.key !== key) {
                this.setState({
                  key: find.key,
                  showX: pageX,
                  showY: find.min,
                });
                this.sectionlist.current.scrollToLocation({
                  sectionIndex: find.index,
                  itemIndex: 0,
                  animated: false,
                });
                ReactNativeHapticFeedback.trigger('impactLight', {
                  enableVibrateFallback: true,
                  ignoreAndroidSystemSettings: false,
                });
              }
            }
          }}
        >
          {sectionMapArr.map((item, index) => {
            return (
              <Text
                key={index}
                onLayout={({
                  nativeEvent: {
                    layout: { x, y, width, height },
                  },
                }) => {
                  this.ps = this.ps.filter(i => i.key !== item[0]);
                  this.ps.push({
                    key: item[0],     // 对应的字母 A-Z
                    min: y,           // 字母顶部Y坐标
                    max: y + height,  // 字母底部Y坐标
                    index: item[1],   // 字母对应SectionList的index
                  });
                }}
              >
                {item[0]}
              </Text>
            );
          })}
          {show && (
              <View style={{
                position: 'absolute', left: -60, top: showY - 10,borderRadius: 20,width: 60, height: 40,
                flexDirection: 'row',
              }}>
                <View style={{
                  width: 40,
                  borderRadius: 20,
                  backgroundColor: '#999999',
                  alignItems: 'center',
                  justifyContent: 'center',
                  }}>
                  <Text style={{  fontSize: 30, color: '#FFFFFF',  }}>
                    {key}
                  </Text>
                </View>
                <View style={{
                  position: 'absolute', 
                  top: 3,
                  bottom: 3,
                  right: 0,
                  width: 30,
                  borderLeftColor: '#999999',
                  borderLeftWidth: 22,
                  borderTopColor: 'transparent',
                  borderTopWidth: 16,
                  borderBottomColor: 'transparent',
                  borderBottomWidth: 16,
                }}>

                </View>
              </View>
            )}
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
  },
  headerContainer: {
    padding: 5,
    backgroundColor: '#F8F8F8',
  },
  headerText: {
    fontWeight: 'bold',
  },
  itemContainer: {
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  itemText: {
    fontSize: 16,
  },
});
