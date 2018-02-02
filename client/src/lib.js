import firebase from 'firebase'

var config = {
  apiKey: "AIzaSyAuw9V6-MqS46qmb7425FAphN_lYo9qRTA",
  authDomain: "wayfare-8e106.firebaseapp.com",
  projectId: "wayfare-8e106"
};

firebase.initializeApp(config);

export const googleProvider = new firebase.auth.GoogleAuthProvider();
export const facebookProvider = new firebase.auth.FacebookAuthProvider();
export default firebase;