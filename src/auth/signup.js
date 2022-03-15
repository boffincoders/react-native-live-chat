import {useNavigation} from '@react-navigation/native';
import {Formik} from 'formik';
import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {CustomToast} from '../components/customToast';
import {GetFirebaseAuth, GetFireStoreApp} from '../utils/firebaseMethods';
let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const navigation = useNavigation();
  return (
    // <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    <View style={styles.container}>
      <View style={styles.bigCircle}></View>
      <View style={styles.smallCircle}></View>
      <View style={styles.centerizedView}>
        <Formik
          initialValues={{email: '', password: '', name: ''}}
          onSubmit={async values => {
            if (values.email === '' || !reg.test(values.email)) {
              CustomToast({
                message:
                  'Email is required and please enter valid email address',
              });
            } else if (values.password === '') {
              CustomToast({
                message: 'Password is required',
              });
            } else if (values.name === '') {
              CustomToast({
                message: 'Name is required',
              });
            } else {
              setLoading(true);
              const response =
                await GetFirebaseAuth.createUserWithEmailAndPassword(
                  values.email,
                  values.password,
                );
              if (response.user) {
                const user = response.user._user;
                GetFireStoreApp.collection('Users').doc(user.uid).set({
                  uid: user.uid,
                  email: values.email,
                  name: values.name,
                });
                CustomToast({
                  message: 'Signup successfully',
                });
              }
            }
            setLoading(false);
          }}
          component={({
            handleSubmit,
            values,
            handleChange,
            setFieldValue,
            handleBlur,
          }) => (
            <View style={styles.authBox}>
              <View style={styles.logoBox}>
                <FontAwesome
                  color="#fff"
                  name="comments"
                  type="font-awesome"
                  size={50}
                />
              </View>
              <Text style={styles.loginTitleText}>Create Account</Text>
              <View style={styles.hr}></View>

              <View style={styles.inputBox}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.input}
                  autoCapitalize={false}
                  onChangeText={text => setFieldValue('email', text)}
                  keyboardType="email-address"
                  textContentType="emailAddress"
                />
              </View>
              <View style={styles.inputBox}>
                <Text style={styles.inputLabel}>Name</Text>
                <TextInput
                  style={styles.input}
                  autoCapitalize={false}
                  value={values.name}
                  onChangeText={text => setFieldValue('name', text)}
                  keyboardType="default"
                  textContentType="givenName"
                />
              </View>
              <View style={styles.inputBox}>
                <Text style={styles.inputLabel}>Password</Text>
                <TextInput
                  style={styles.input}
                  autoCapitalize={false}
                  onChangeText={text => setFieldValue('password', text)}
                  secureTextEntry={true}
                  textContentType="password"
                />
              </View>
              <TouchableOpacity
                disabled={loading}
                style={[
                  styles.loginButton,
                  {backgroundColor: loading ? '#D3D3D3' : '#ff7979'},
                ]}
                onPress={handleSubmit}>
                {loading ? (
                  <ActivityIndicator color={'#ff7979'} size={20} />
                ) : (
                  <Text style={styles.loginButtonText}>Sign up</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('login')}>
                <Text style={styles.registerText}>
                  Already have an account? Login
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </View>
    // </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  bigCircle: {
    width: Dimensions.get('window').height * 0.7,
    height: Dimensions.get('window').height * 0.7,
    backgroundColor: '#ff6b81',
    borderRadius: 1000,
    position: 'absolute',
    right: Dimensions.get('window').width * 0.25,
    top: -50,
  },
  smallCircle: {
    width: Dimensions.get('window').height * 0.4,
    height: Dimensions.get('window').height * 0.4,
    backgroundColor: '#ff7979',
    borderRadius: 1000,
    position: 'absolute',
    bottom: Dimensions.get('window').width * -0.2,
    right: Dimensions.get('window').width * -0.3,
  },
  centerizedView: {
    width: '100%',
    top: '15%',
  },
  authBox: {
    width: '80%',
    backgroundColor: '#fafafa',
    borderRadius: 20,
    alignSelf: 'center',
    paddingHorizontal: 14,
    paddingBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoBox: {
    width: 100,
    height: 100,
    backgroundColor: '#eb4d4b',
    borderRadius: 1000,
    alignSelf: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    top: -50,
    marginBottom: -50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  loginTitleText: {
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 10,
  },
  hr: {
    width: '100%',
    height: 0.5,
    backgroundColor: '#444',
    marginTop: 6,
  },
  inputBox: {
    marginTop: 10,
  },
  inputLabel: {
    fontSize: 18,
    marginBottom: 6,
  },
  input: {
    width: '100%',
    height: 40,
    backgroundColor: '#dfe4ea',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'white',
    paddingHorizontal: 10,
  },
  loginButton: {
    backgroundColor: '#ff4757',
    marginTop: 10,
    paddingVertical: 10,
    borderRadius: 4,
  },
  loginButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  registerText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  forgotPasswordText: {
    textAlign: 'center',
    marginTop: 12,
    fontSize: 16,
  },
});

export default SignUp;
