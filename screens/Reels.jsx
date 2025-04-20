import React, { useRef, useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Dimensions, FlatList, ActivityIndicator, StatusBar } from 'react-native';
import { Video } from 'expo-av';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useGetAllReelsQuery } from '../API/Reels';
import ManImg from '../assets/images/avatars/man.png';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height, width } = Dimensions.get('window');

const Reels = ({ navigation }) => {
  const { data: reelsData } = useGetAllReelsQuery();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);
  const flatListRef = useRef(null);
  const videoRefs = useRef([]);
  const insets = useSafeAreaInsets();

  const handleSellerPress = (seller) => {
    navigation.navigate('ShowSellerInfo', { 
      item: {
        id: seller.id,
        first_name: seller.first_name,
        last_name: seller.last_name,
        seller_logo: seller.seller_logo,
        location: seller.location,
        average_rating: seller.average_rating,
        seller_banner: seller.seller_banner
      }
    });
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const newIndex = viewableItems[0].index || 0;
      setCurrentIndex(newIndex);
      
      videoRefs.current.forEach((ref, index) => {
        if (ref && index !== newIndex) {
          ref.pauseAsync();
          ref.setPositionAsync(0);
        }
      });
      
      if (videoRefs.current[newIndex]) {
        videoRefs.current[newIndex].playAsync().catch(e => console.log("Play error:", e));
      }
    }
  }).current;

  const renderItem = ({ item, index }) => (
    <View style={[styles.videoContainer, { height: height + insets.top }]}>
      <Video
        ref={ref => (videoRefs.current[index] = ref)}
        source={{ uri: item.reel }}
        style={[styles.video, { marginTop: -insets.top }]}
        resizeMode="cover"
        isLooping
        shouldPlay={index === currentIndex}
        onPlaybackStatusUpdate={status => setIsBuffering(status.isBuffering)}
        onError={error => console.log("Video error:", error)}
      />
      
      {isBuffering && (
        <View style={styles.loadingIndicator}>
          <ActivityIndicator size="large" color="white" />
        </View>
      )}
      
      <TouchableOpacity 
        style={[styles.backButton, { top: insets.top + 20 }]}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-right" size={30} color="white" />
      </TouchableOpacity>
      
      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={styles.sellerInfo}
          onPress={() => handleSellerPress(item.seller)}
        >
          <Image 
            source={item.seller.seller_logo 
              ? { uri: `https://leen-app.com/public/${item.seller.seller_logo}` } 
              : ManImg} 
            style={styles.sellerImage} 
          />
          <View>
            <Text style={styles.sellerName}>
              {item.seller.first_name} {item.seller.last_name}
            </Text>
            <View style={styles.ratingContainer}>
              <Icon name="star" size={16} color="#F98600" />
              <Text style={styles.ratingText}>
                {item.seller.average_rating.toFixed(1)}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        {item.description && (
          <Text style={styles.description}>
            {item.description}
          </Text>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar 
        barStyle="light-content" 
        translucent 
        backgroundColor="transparent" 
      />
      {reelsData?.data ? (
        <FlatList
          ref={flatListRef}
          data={reelsData.data}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
          initialNumToRender={1}
          maxToRenderPerBatch={1}
          windowSize={3}
          removeClippedSubviews
          snapToInterval={height}
          snapToAlignment="start"
          decelerationRate="fast"
          getItemLayout={(_, index) => ({
            length: height,
            offset: height * index,
            index,
          })}
        />
      ) : (
        <Text style={styles.loadingText}>Loading reels...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  videoContainer: {
    width: width,
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  backButton: {
    position: 'absolute',
    right: 20,
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 25,
    padding: 10,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    zIndex: 1,
  },
  sellerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sellerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    borderWidth: 2,
    borderColor: 'white',
  },
  sellerName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    color: 'white',
    fontSize: 14,
    marginLeft: 5,
  },
  description: {
    color: 'white',
    fontSize: 14,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 8,
  },
  loadingText: {
    color: 'white',
    textAlign: 'center',
    marginTop: '50%',
  },
  loadingIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
    zIndex: 1,
  },
});

export default Reels;