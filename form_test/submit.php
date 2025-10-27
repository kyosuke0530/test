<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "sample_db";

// MySQL接続を作成
$conn = new mysqli($servername, $username, $password, $dbname);

// 接続チェック
if ($conn->connect_error) {
    die("接続失敗: " . $conn->connect_error);
}

// POSTリクエストのデータを取得
$name = $_POST['name'];
$email = $_POST['email'];

// データベースにデータを挿入
$sql = "INSERT INTO users (name, email) VALUES ('$name', '$email')";

if ($conn->query($sql) === TRUE) {
    echo "新しいレコードが正常に作成されました。<br>";
    echo "<a href='list.php'>ユーザー一覧を見る</a>";
} else {
    echo "エラー: " . $sql . "<br>" . $conn->error;
}

// MySQL接続を閉じる
$conn->close();
?>