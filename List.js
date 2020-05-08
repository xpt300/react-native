import React, { Component } from 'react';
import { StyleSheet, Image, FlatList } from 'react-native';
import images from './img/index.js';

const itemWidth = 114.5;

const Container = props => {
  return <Image
    style={styles.image}
    source={props.src}/>
} 

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPosition: 0,
      scrolling: false,
      momentumScrolling: false,
    };
  }

  componentDidMount() {
    this.startScroll();
  }

    // Clear interval when user closes
    componentWillUnmount() {
      clearInterval(this.activeInterval);
    }
  
    startScroll() {
      this.activeInterval = setInterval(this.scrolling, 32);
    }
  
    clearScrolling() {
      if (this.activeInterval) {
        clearInterval(this.activeInterval);
        this.activeInterval = null;
      }
    }
  
    scrolling = () => {
      // Start scrolling if there's more than one stock to display
      let {currentPosition} = this.state;
      if (currentPosition < 0) {
        currentPosition = 0;
      }
      if (images.length > 5) {
        // Increment position with each new interval
        const position = currentPosition + 0.5;
        this.ticker.scrollToOffset({offset: position, animated: false});
        // After position passes this value, snaps back to beginning
        const maxOffset = images.length * itemWidth;
        // Set animation to repeat at end of scroll
        if (currentPosition > maxOffset) {
          const offset = currentPosition - maxOffset;
          this.ticker.scrollToOffset({
            offset,
            animated: false,
          });
          this.setState({currentPosition: offset});
        } else {
          this.setState({currentPosition: position});
        }
      }
    };
  
    onMomentumScrollBegin = () => {
      this.setState({
        momentumScrolling: true,
      });
      this.clearScrolling();
    };
  
    onMomentumScrollEnd = (event) => {
      const {momentumScrolling} = this.state;
      if (momentumScrolling) {
        this.setState({
          momentumScrolling: false,
          currentPosition: event.nativeEvent.contentOffset.x,
        });
        this.startScroll();
      }
    };
  
    onScrollBegin = () => {
      this.setState({
        scrolling: true,
      });
      this.clearScrolling();
    };
  
    onScrollEnd = (event) => {
      this.setState({
        scrolling: false,
        currentPosition: event.nativeEvent.contentOffset.x,
      });
      this.startScroll();
    };
  
    onTouchBegin = () => {
      this.clearScrolling();
    };
  
    onTouchEnd = () => {
      const {scrolling} = this.state;
      if (!scrolling) {
        this.startScroll();
      }
    }

  getWrappedData = () => {
    const overlappingNo = this.getOverlappingNo();
    return {
      data: [...images, ...images.slice(0, overlappingNo)],
    };
  };

  getOverlappingNo = () => {
    let overlappingNo = 10;
    if (images.length < 10) {
      overlappingNo = images.length;
    }
    return overlappingNo;
  };

  render() {
    const {data} = this.getWrappedData();
    return (
      <FlatList
        data={data}
        ref={(ref) => {
          this.ticker = ref;
        }}
        getItemLayout={(_, index) => ({
          length: images.length,
          offset: itemWidth * index,
          index,
        })}
        onTouchStart={this.onTouchBegin}
        onTouchEnd={this.onTouchEnd}
        onScrollBeginDrag={this.onScrollBegin}
        onScrollEndDrag={this.onScrollEnd}
        onMomentumScrollBegin={this.onMomentumScrollBegin}
        onMomentumScrollEnd={this.onMomentumScrollEnd}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => item.key + index}
        renderItem={({item}) => {
          return <Container src={item.src}/>
        }}
      />
    )
  }
}

const styles = StyleSheet.create({
  image: {
    margin: 20,
    width: 75,
    height: 75,
  }
});

export default List