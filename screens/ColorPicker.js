import React from "react";
import { Button, StyleSheet, View } from "react-native";
import { TriangleColorPicker, fromHsv } from "react-native-color-picker";

class ColorPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newColor: "pink"
    };
  }

  onColorChange(color, updateColorMap) {
    let newColor = fromHsv(color);
    this.setState({ newColor });
    updateColorMap(newColor);
  }

  render() {
    const { route, navigation } = this.props;
    const { updateColorMap, currentColor, uid } = route.params;
    return (
      <View style={styles.container}>
        <View style={{ flex: 1, padding: 45, backgroundColor: "#212021" }}>
          <Button
            title="Confirm"
            onPress={() => {
              this.props.navigation.navigate("Canvas", {
                newColor: this.state.newColor,
                uid: uid
              });
            }}
          />

          <TriangleColorPicker
            oldColor={currentColor}
            onColorChange={color => this.onColorChange(color, updateColorMap)}
            style={{ flex: 1 }}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 45,
    backgroundColor: "#212021"
  },
  touchable: {
    padding: 5
  },
  text: {
    color: "white"
  }
});

export default ColorPicker;
