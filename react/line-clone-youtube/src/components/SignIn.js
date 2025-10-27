import { Button } from '@mui/material';
import React from 'react';
import firebase from "firebase/compat/app";
import { auth } from '../firebase';

function SignIn() {
  async function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();

    // アカウント選択画面を毎回表示
    provider.setCustomParameters({
      prompt: 'select_account'
    });

    try {
      // 現在のユーザーをサインアウトしてからログイン
      await auth.signOut();
      await auth.signInWithPopup(provider);
    } catch (error) {
      console.error("ログインエラー:", error);
    }
  }

  return (
    <div>
      <Button onClick={signInWithGoogle}>グーグルでログインする</Button>
    </div>
  );
}

export default SignIn;
