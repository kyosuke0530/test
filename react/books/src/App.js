import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, doc, deleteDoc, onSnapshot, Timestamp, getDoc } from 'firebase/firestore';
import db from './firebaseConfig';
import { Html5QrcodeScanner } from 'html5-qrcode';

function BarcodeScanner({ onScan, onClose }) {
  useEffect(() => {
    const config = {
      fps: 10,
      qrbox: { width: 350, height: 100 },
      aspectRatio: 4 / 3,
      experimentalFeatures: {
        useBarCodeDetectorIfSupported: true,
      },
      videoConstraints: {
        facingMode: 'environment',
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }
    };

    const scanner = new Html5QrcodeScanner('reader', config);

    scanner.render(
      (decodedText) => {
        scanner.clear();
        onScan(decodedText);
        onClose();
      },
      (errorMessage) => {
        console.log(errorMessage);
      }
    );

    return () => {
      if (scanner) {
        scanner.clear();
      }
    };
  }, [onScan, onClose]);

  return <div id="reader" style={{ maxWidth: '100%' }} />;
}

function App() {
  const [isbn, setIsbn] = useState('');
  const [category, setCategory] = useState('');
  const [memo, setMemo] = useState('');
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('createdAt');
  const [editBookId, setEditBookId] = useState(null);
  const [editCategory, setEditCategory] = useState('');
  const [editMemo, setEditMemo] = useState('');
  const [editDueDate, setEditDueDate] = useState('');
  const [editHeight, setEditHeight] = useState('');
  const [showScanner, setShowScanner] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'books'), (snapshot) => {
      const booksList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setBooks(booksList);
    });
    return () => unsubscribe();
  }, []);

  const handleSearchAndRegister = async () => {
    setError(null);
    if (!isbn) {
      setError('ISBNを入力してください');
      return;
    }

    try {
      const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
      const data = await res.json();

      if (data.totalItems === 0) {
        setError('書籍が見つかりませんでした');
        return;
      }

      const info = data.items[0].volumeInfo;
      const dimensions = info?.dimensions || {};
      const heightStr = dimensions.height || '';

      const newBook = {
        isbn,
        title: info.title || 'タイトル不明',
        authors: info.authors?.join(', ') || '著者不明',
        image: info.imageLinks?.thumbnail || '',
        status: 'available',
        borrowedDate: null,
        dueDate: null,
        category: category || '未分類',
        memo: memo || '',
        height: heightStr,
        createdAt: Date.now(),
      };

      await addDoc(collection(db, 'books'), newBook);

      setIsbn('');
      setCategory('');
      setMemo('');
    } catch (err) {
      setError('エラーが発生しました');
    }
  };

  const sortedBooks = [...books].sort((a, b) => {
    switch (sortOption) {
      case 'title': return a.title.localeCompare(b.title);
      case 'status': return a.status.localeCompare(b.status);
      case 'createdAt':
      default: return b.createdAt - a.createdAt;
    }
  });

  const filteredBooks = sortedBooks.filter((book) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.authors.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleStatus = async (bookId) => {
    const bookRef = doc(db, 'books', bookId);
    const bookSnap = await getDoc(bookRef);
    const currentStatus = bookSnap.data().status;
    const newStatus = currentStatus === 'available' ? 'borrowed' : 'available';

    const updates = { status: newStatus };

    if (newStatus === 'borrowed') {
      updates.borrowedDate = Timestamp.now();
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14);
      updates.dueDate = Timestamp.fromDate(dueDate);
    } else {
      updates.borrowedDate = null;
      updates.dueDate = null;
    }

    await updateDoc(bookRef, updates);
  };

  const handleDelete = async (bookId) => {
    const bookRef = doc(db, 'books', bookId);
    await deleteDoc(bookRef);
  };

  const handleEdit = (book) => {
    setEditBookId(book.id);
    setEditCategory(book.category);
    setEditMemo(book.memo);
    setEditDueDate(book.dueDate ? book.dueDate.toDate().toISOString().split('T')[0] : '');
    setEditHeight(book.height || '');
  };

  const handleSaveEdit = async () => {
    setError(null);
  
    const bookRef = doc(db, 'books', editBookId);
  
    const updates = {
      category: editCategory || '',
      memo: editMemo || '',
      height: editHeight || '',
    };
  
    if (editDueDate) {
      updates.dueDate = Timestamp.fromDate(new Date(editDueDate));
    } else {
      updates.dueDate = null;
    }
  
    await updateDoc(bookRef, updates);
  
    setEditBookId(null);
    setEditCategory('');
    setEditMemo('');
    setEditDueDate('');
    setEditHeight('');
  };  

  return (
    <div style={{ padding: '2rem' }}>
      <h1><img src="/images/LIBRA-logo.png" alt="LIBRA-logo" width={'150px'} /></h1>
      <input type="text" placeholder="ISBN入力" value={isbn} onChange={(e) => setIsbn(e.target.value)} />
      <input type="text" placeholder="カテゴリ" value={category} onChange={(e) => setCategory(e.target.value)} style={{ marginLeft: '0.5rem' }} />
      <input type="text" placeholder="メモ" value={memo} onChange={(e) => setMemo(e.target.value)} style={{ marginLeft: '0.5rem', width: '200px' }} />
      <button onClick={handleSearchAndRegister} style={{ marginLeft: '0.5rem' }}>登録</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <hr />

      <input type="text" placeholder="タイトルまたは著者で検索" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ width: '98.5%', padding: '0.5rem', marginBottom: '1rem' }} />

      <div style={{ marginBottom: '1rem' }}>
        <label>並び替え: </label>
        <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
          <option value="createdAt">登録順（新しい順）</option>
          <option value="title">タイトル順</option>
          <option value="status">ステータス順</option>
        </select>
      </div>

      <button onClick={() => setShowScanner(true)}>バーコードスキャン</button>
      {showScanner && (
        <BarcodeScanner onScan={(scannedIsbn) => { setIsbn(scannedIsbn); setShowScanner(false); }} onClose={() => setShowScanner(false)} />
      )}

      <h2>登録済み書籍一覧</h2>
      {filteredBooks.map((book) => (
        <div key={book.id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '0.5rem', backgroundColor: book.status === 'available' ? '#e6ffe6' : '#ffe6e6' }}>
          <img src={book.image} alt={book.title} style={{ float: 'left', marginRight: '1rem', width: '100px' }} />
          <h3>{book.title}</h3>
          <p><strong>著者:</strong> {book.authors}</p>
          <p><strong>ISBN:</strong> {book.isbn}</p>
          <p><strong>カテゴリ:</strong> {book.category}</p>
          <p><strong>メモ:</strong> {book.memo}</p>
          <p><strong>高さ・または判型:</strong> {book.height || '不明'}</p>
          <p><strong>ステータス:</strong> {book.status === 'available' ? '返却済み' : '貸出中'}</p>
          <p><strong>貸出日:</strong> {book.borrowedDate ? book.borrowedDate.toDate().toLocaleDateString() : '-'}</p>
          <p><strong>返却予定日:</strong> {book.dueDate ? book.dueDate.toDate().toLocaleDateString() : '-'}</p>
          <button onClick={() => toggleStatus(book.id)}>{book.status === 'available' ? '貸出にする' : '返却する'}</button>
          <button onClick={() => handleDelete(book.id)} style={{ marginLeft: '1rem' }}>削除</button>
          <button onClick={() => handleEdit(book)} style={{ marginLeft: '1rem' }}>編集</button>

          {editBookId === book.id && (
            <div style={{ padding: '1rem', border: '1px dashed #888', marginTop: '1rem' }}>
              <h4>編集中: {book.title}</h4>
              <input type="text" value={editCategory} onChange={(e) => setEditCategory(e.target.value)} placeholder="カテゴリ" style={{ display: 'block', marginBottom: '0.5rem', width: '100%' }} />
              <textarea value={editMemo} onChange={(e) => setEditMemo(e.target.value)} placeholder="メモ" style={{ display: 'block', width: '100%', height: '80px', marginBottom: '0.5rem' }} />
              <input type="date" value={editDueDate} onChange={(e) => setEditDueDate(e.target.value)} style={{ display: 'block', marginBottom: '0.5rem' }} />
              <input type="text" value={editHeight} onChange={(e) => setEditHeight(e.target.value)} placeholder="高さ・または判型" style={{ display: 'block', marginBottom: '0.5rem', width: '100%' }} />
              <button onClick={handleSaveEdit}>保存</button>
              <button onClick={() => setEditBookId(null)} style={{ marginLeft: '1rem', backgroundColor: '#ddd' }}>保存せずに戻る</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default App;
