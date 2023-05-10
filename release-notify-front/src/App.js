import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebase-config';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  onAuthStateChanged,
} from 'firebase/auth';

const App = () => {
  console.log(process.env);
  console.log(firebaseConfig);
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const [token, setToken] = useState('');
  const login = async (e) => {
    e.preventDefault();
    const provider = new GoogleAuthProvider();
    await signInWithRedirect(auth, provider);
  };

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const token = await user.getIdToken(false);
      setToken(token);
    } else {
      setToken('');
    }
  });

  return ( 
    <div className='mt-4 w-4/5 mx-auto'>
    <div className='w-full mt-2'>
    <h1 className='text-3xl font-bold'>Release Notify</h1>
    </div>
    <div className='w-full mt-2'>
    { 
      !token ? 
      <div>
      <button className='px-4 py-2 border rounded hover:bg-gray-200' onClick={login}>Google Login</button>
      </div>
      : <div>{token}</div>
    }
    </div>
    </div>
  )
}

export default App;
