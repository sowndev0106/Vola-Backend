// Import the functions you need from the SDKs you need
import { initializeApp } from "@firebase/app";
import { getAnalytics } from "@firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDJXAaSJfOoMpd7GWcAPhzl10mdFbaOedE",
  authDomain: "volo-3be7c.firebaseapp.com",
  projectId: "volo-3be7c",
  storageBucket: "volo-3be7c.appspot.com",
  messagingSenderId: "345645422283",
  appId: "1:345645422283:web:2eec4b856f01a720ebad4e",
  measurementId: "G-KXD575GJZ4",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// export const analytics = getAnalytics(app);
