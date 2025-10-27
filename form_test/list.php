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

// データベースからデータを取得
$sql = "SELECT id, name, email, created_at FROM users";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // 出力データの各行を表示
    echo "<table border='1'><tr><th>ID</th><th>名前</th><th>メールアドレス</th><th>登録日時</th></tr>";
    while($row = $result->fetch_assoc()) {
        echo "<tr><td>" . $row["id"]. "</td><td>" . $row["name"]. "</td><td>" . $row["email"]. "</td><td>" . $row["created_at"]. "</td></tr>";
    }
    echo "</table>";
} else {
    echo "0 件の結果";
}

// MySQL接続を閉じる
$conn->close();
?>