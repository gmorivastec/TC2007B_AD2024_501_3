
// THINGS TO DO 
// create project 
// npx @react-native-community/cli@latest init FirebaseNative


// install dependencies
// npm install --save @react-native-firebase/app
// npm install --save @react-native-firebase/auth
// npm install --save @react-native-firebase/firestore
// npm install --save @react-native-firebase/storage

// follow instructions on setup from 
// https://rnfirebase.io/

// run your app:
// npx react-native start

import React, { useState, useEffect } from 'react';

import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';

import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';



function App(): React.JSX.Element {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [imageURL, setImageURL] = useState("");

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(user => {
      console.log("****** USER STATUS: " + user);
    });

    // when on unmount is invoked on this component
    // any methods returned on useEffect will be invoked
    // as part of the component's cleanup
    return subscriber;
  }, []);

  useEffect(() => {
    // storage stuff
    storage()
    .ref("puppy1.jpg")
    .getDownloadURL()
    .then(url => {
      console.log(url);
      setImageURL(url);
    });
  }, []);
  
  
  return (
    <SafeAreaView>
      <TextInput 
        placeholder='email'
        onChangeText={text => {
          setEmail(text);
        }}
      />
      <TextInput 
        placeholder='password'
        secureTextEntry={true}
        onChangeText={text => {
          setPassword(text);
        }}
      />
      <Button 
        title="Sign up"
        onPress={() => {
          auth()
          .createUserWithEmailAndPassword(email, password)
          .then((userCredential : FirebaseAuthTypes.UserCredential) => {
            console.log("user created successfully! " + userCredential.user.email);
          })
          .catch(error => {
            console.log(error.code);
          });
        }}
      />
      <Button 
        title="Sign in"
        onPress={() => {
          auth().signInWithEmailAndPassword(email, password)
          .then(() => {
            console.log("SIGNED IN!");
          })
          .catch(error => {
            console.log(error);
          });
        }}
      />
      <Button 
        title="Sign out"
        onPress={() => {
          auth().signOut();
        }}
      />
      <TextInput 
        placeholder='name'
        onChangeText={text => {
          setName(text);
        }}
      /> 
      <TextInput
        placeholder='breed'
        onChangeText={text => {
          setBreed(text);
        }}
      />

      <Button 
        title="Add New"
        onPress={() => {
          firestore()
          .collection("perritos")
          .add(
            {
              breed: breed,
              name: name
            }
          ).then(newDoc => {
            console.log("ADDED NEW DOC: " + newDoc.id);
          });
        }}
      /> 
      <Button 
        title="Get All"
        onPress={() => {
          firestore()
          .collection("perritos")
          .get()
          .then(querySnapshot => {
            console.log("************ GETTING ALL");
            // traverse through results 
            querySnapshot.forEach(currentDoc => {
              console.log(currentDoc.data());
            });
          });
        }}
      /> 
      <Button 
        title="Query"
        onPress={() => {
          firestore()
          .collection("perritos")
          .where("breed", "==", "Labrador")
          .get()
          .then(querySnapshot => {
            console.log("**************** QUERY");
            querySnapshot.forEach(currentDoc => {
              console.log(currentDoc.data());
            });
          });
        }}
      /> 
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
