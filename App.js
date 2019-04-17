import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  SectionList,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Vibration,
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
    this.sectionlist = React.createRef();
    this.offsetY = 0;
  }
  render() {
    const { select, key, show, showX, showY = -1000 } = this.state;
    return (
      <SafeAreaView
        style={styles.container}
      >
        <View
          style={{ flex: 1, flexDirection: 'row' }}
          onLayout={({
            nativeEvent: {
              layout: { x, y, width, height },
            },
          }) => {
            this.offsetY = y;
          }}>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <SectionList
              ref={this.sectionlist}
              ItemSeparatorComponent={() => (<View style={{borderBottomColor: '#F8F8F8',borderBottomWidth: 1,}} />)}
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
          </View>
          <View
            style={{ width: 16, justifyContent: 'center' }}
            onStartShouldSetResponder={evt => true}
            onMoveShouldSetResponder={() => true}
            onResponderGrant={evt => {
              this.setState({
                show: true,
              });
              // console.log('show');
            }}
            onResponderRelease={e => {
              this.setState({
                show: false,
              });
              // console.log('hide');
            }}
            onResponderReject={() => {
              console.log('onResponderReject');
            }}
            onResponderMove={({ nativeEvent: { pageX, pageY, locationY } }) => {
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
            }}>
            {sectionMapArr.map((item, index) => {
              return (
                <Text
                  key={index}
                  onLayout={({
                    nativeEvent: {
                      layout: { x, y, width, height },
                    },
                  }) => {
                    // console.log(item[0], x, y, width, height);
                    this.ps = this.ps.filter(i => i.key !== item[0]);
                    this.ps.push({
                      key: item[0],
                      min: y,
                      max: y + height,
                      index: item[1],
                    });
                  }}>
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
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#FFFFFF',
    // padding: 8,
    // flexDirection: 'row',
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
