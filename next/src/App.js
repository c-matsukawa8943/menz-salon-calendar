import './App.css';
import { db } from '../../src/libs/firebase';
import { useState, useEffect } from 'react';
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import Login from '../../src/app/login/page';

function App() {
  // const[posts, setPosts] = useState([]);

  // useEffect(() => {
  //   const postRef = collection(db, "posts");
  //   getDocs(postRef).then((snapshot) => {
  //     setPosts(snapshot.docs.map((doc) => ({
  //       ...doc.data(),
  //     })));

  //     onSnapshot(postRef, (post) => {
  //       setPosts(post.docs.map((doc) => ({
  //         ...doc.data(),
  //       })));
  //     });
  //   });
  // }, []);

  return (
    <div className="App">
      <Login />
      {/*
      {posts.map((post) => (
        <div key={post.id}>
          <h1>{post.title}</h1>
          <p>{post.text}</p>
        </div>
      ))}
      */}
    </div>
  );
}

export default App;
