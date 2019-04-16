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
  ['B', 20],
  ['C', 47],
  ['D', 51],
  ['E', 59],
  ['F', 64],
  ['G', 78],
  ['H', 93],
  ['I', 104],
  ['J', 106],
  ['K', 119],
  ['L', 132],
  ['M', 146],
  ['N', 176],
  ['O', 191],
  ['P', 193],
  ['Q', 198],
  ['R', 200],
  ['S', 205],
  ['T', 233],
  ['U', 247],
  ['V', 249],
  ['W', 251],
  ['X', 262],
  ['Y', 272],
  ['Z', 288],
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
    const { select, key, show, showX, showY } = this.state;
    return (
      <SafeAreaView
        style={styles.container}
        onLayout={({
          nativeEvent: {
            layout: { x, y, width, height },
          },
        }) => {
          console.log(x, y, width, height);
          this.offsetY = y;
        }}>
        <View
          style={{ flex: 1, flexDirection: 'row' }}
          onLayout={({
            nativeEvent: {
              layout: { x, y, width, height },
            },
          }) => {
            console.log(x, y, width, height);
            this.offsetY = y;
          }}>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <SectionList
              ref={this.sectionlist}
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
              console.log(pageY, locationY)
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
                    itemIndex: find.index,
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
              <Text style={{ position: 'absolute', left: -30, top: showY }}>
                {key}
              </Text>
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
