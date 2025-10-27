import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // スタイルシートのインポート
import App from './App'; // アプリケーションのエントリーポイント（通常はAppコンポーネント）

// React 18以降では `createRoot` を使う
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />  {/* アプリケーションコンポーネント */}
  </React.StrictMode>
);
