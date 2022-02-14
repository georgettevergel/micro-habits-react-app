import React, { Component } from "react";
import { Text, View, StyleSheet, Image } from "react-native";

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    flex: 1
  },
  slidePhoto: {
    // opacity: state.imageOpacity,
    flex: 1,
    width: 1300,
    minWidth: 200,
    height: 700,
    minHeight: 500
  }
});

class SlidePhoto extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: ["Goal-Oriented.jpg", "Habits-Set.jpg", "You-Can.jpg"],
      imageOpacity: 0,
      currentImage: 0
    };
  }

  componentDidMount() {
    this.imageFadeIn();
    this.switchImage();
  }

  imageFadeOut() {
    let imageOpacity = this.state.imageOpacity;
    if (imageOpacity > 0) {
      this.setState(
        {
          imageOpacity: imageOpacity - 0.01
        },
        () => {
          setTimeout(() => {
            this.imageFadeOut();
          }, 10);
        }
      );
    }
  }

  imageFadeIn() {
    let imageOpacity = this.state.imageOpacity;
    if (imageOpacity < 1) {
      this.setState(
        {
          imageOpacity: imageOpacity + 0.01
        },
        () => {
          setTimeout(() => {
            this.imageFadeIn();
          }, 20);
        }
      );
    }
  }

  switchImage() {
    let { images } = this.state;
    setInterval(() => {
      // 6 sec wait for next image
      this.imageFadeOut();
      setTimeout(() => {
        // 0.5 Sec wait after image stats to fade
        this.setState(
          {
            currentImage:
              this.state.currentImage < images.length - 1
                ? this.state.currentImage + 1
                : 0,
            imageOpacity: 0
          },
          () => {
            setTimeout(() => {
              // 0.1 sec wait before fade in new image
              this.imageFadeIn();
            }, 100);
          }
        );
      }, 500);
    }, 6000);
  }

  render() {
    let state = this.state;
    return (
      <View style={styles.container}>
        <Image source={state.images[state.currentImage]} style={styles.slidePhoto} />
      </View>
    );
  }
}
export default SlidePhoto;
