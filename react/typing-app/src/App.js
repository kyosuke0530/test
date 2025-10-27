import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const musicList = [
  { name: 'Song 1', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', bpm: 120 },
];

const WORD_POOL = ['hello', 'world', 'react', 'javascript', 'typing', 'game', 'code', 'beat', 'music', 'fast', 'flow'];
const WORD_LIFETIME = 3000; // 単語が生きてる時間（ミリ秒）

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  const [typedText, setTypedText] = useState('');
  const [score, setScore] = useState(0);
  const [activeWords, setActiveWords] = useState([]); // { text: 'word', id: 123, timestamp: Date.now() }
  const audioRef = useRef(null);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const selectSong = (songUrl, bpm) => {
    setCurrentSong({ url: songUrl, bpm });
    setTypedText('');
    setScore(0);
    setActiveWords([]);
    setIsPlaying(false);
  };

  const handleTyping = (e) => {
    const value = e.target.value.toLowerCase();
    setTypedText(value);

    const matchIndex = activeWords.findIndex((word) => word.text === value);

    if (matchIndex !== -1) {
      setScore((prev) => prev + 10);
      setActiveWords((prev) => prev.filter((_, i) => i !== matchIndex));
      setTypedText('');
    }
  };

  // ランダム単語を定期的に追加
  useEffect(() => {
    if (!isPlaying || !currentSong) return;

    const intervalSec = (240 / currentSong.bpm) * 1.5;
    const intervalId = setInterval(() => {
      const newWord = WORD_POOL[Math.floor(Math.random() * WORD_POOL.length)];
      const wordObj = { text: newWord, id: Date.now(), timestamp: Date.now() };
      setActiveWords((prev) => [...prev, wordObj]);
    }, intervalSec * 1000);

    return () => clearInterval(intervalId);
  }, [isPlaying, currentSong]);

  // 単語の消滅処理（時間が経ったら消える + ミス判定）
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      setActiveWords((prevWords) => {
        const filtered = prevWords.filter((word) => {
          const expired = now - word.timestamp > WORD_LIFETIME;
          if (expired) setScore((prev) => Math.max(0, prev - 5)); // ミスで減点
          return !expired;
        });
        return filtered;
      });
    }, 500);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="App">
      <h1>音ゲー風タイピング練習 🎧</h1>

      {currentSong ? (
        <>
          <audio ref={audioRef} src={currentSong.url} preload="auto" />
          <button onClick={togglePlay}>{isPlaying ? '⏸ 停止' : '▶️ 再生'}</button>

          <div className="typing-area">
            <input
              type="text"
              value={typedText}
              onChange={handleTyping}
              placeholder="ここにタイプ！"
              autoFocus
            />
          </div>

          <div className="score">
            <p>スコア: {score}</p>
          </div>

          <div className="word-display">
            {activeWords.map((word) => (
              <div key={word.id} className="word">{word.text}</div>
            ))}
          </div>
        </>
      ) : (
        <div>
          <h2>音楽を選んでください</h2>
          {musicList.map((music, index) => (
            <button key={index} onClick={() => selectSong(music.url, music.bpm)}>
              {music.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
