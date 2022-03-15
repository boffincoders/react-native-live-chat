import {ToastAndroid} from 'react-native';
export const CustomToast = ({message}) => {
  return ToastAndroid.showWithGravityAndOffset(
    message,
    ToastAndroid.LONG,
    ToastAndroid.BOTTOM,
    25,
    50,
  );
};
