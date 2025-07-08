// リマインダーの追加フォーム送信処理
document.getElementById("reminderForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const message = document.getElementById("message").value;
    const time = document.getElementById("time").value;

    const newReminder = { message, time };

    fetch("/addReminder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReminder)
    })
    .then(res => res.json())
    .then(data => {
        alert("リマインダーが追加されました！ 内容: " + JSON.stringify(data));
        location.reload(); // 更新
    })
    .catch(error => {
        console.error("追加エラー:", error);
    });
});

// リマインダーの表示と削除
document.addEventListener("DOMContentLoaded", function () {
    const reminderList = document.getElementById("reminderList");
    
    fetch("reminders.json")
    .then(response => response.json())
    .then(data => {
        data.sort((a, b) => new Date(a.time) - new Date(b.time));

        data.forEach(reminder => {
            const li = document.createElement("li");
            li.textContent = reminder.message + " - " + new Date(reminder.time).toLocaleString();

            // 削除ボタン
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "削除";
            deleteBtn.addEventListener("click", function () {
                fetch("/deleteReminder/" + reminder.id, {
                    method: "DELETE"
                })
                .then(res => res.json())
                .then(data => {
                    alert(data.message);
                    location.reload();
                })
                .catch(error => console.error("削除エラー:", error));
            });

            li.appendChild(deleteBtn);
            reminderList.appendChild(li);

            // 通知許可をリクエスト
            if (Notification.permission !== "granted") {
                Notification.requestPermission();
            }
            // 通知チェック：1秒おき
            setInterval(() => {
                const now = new Date();
                // ローカル保存や前回通知済みの記録（通知の重複防止用）
                const notifiedIds = JSON.parse(localStorage.getItem("notifiedIds") || "[]");
                
                fetch("reminders.json")
                .then(res => res.json())
                .then(reminders => {
                    reminders.forEach(reminder => {
                        const reminderTime = new Date(reminder.time);
                        const timeDiff = reminderTime - now;
                        
                        // 通知時間が±10秒以内かつ未通知なら通知する
                        if (
                            Math.abs(timeDiff) < 10 * 1000 &&
                            !notifiedIds.includes(reminder.id)
                        ) {
                            if (Notification.permission === "granted") {
                                new Notification("リマインダー", {
                                    body: reminder.message,
                                    icon: "https://cdn-icons-png.flaticon.com/512/565/565547.png", // お好みで
                                    });
                    // 通知済みに追加
                    notifiedIds.push(reminder.id);
                    localStorage.setItem("notifiedIds", JSON.stringify(notifiedIds));
                }
            }
        });
    })
    .catch(err => {
        console.error("通知チェックエラー:", err);
    });
}, 1000); // 1秒ごとにチェック

        });
    })
    .catch(function(error) {
        alert("データ取得に失敗しました。ネットワークを確認してください。");
        console.error("データ取得エラー:", error);
    });
});

// WebSocketによるリアルタイム更新
// socket.onmessage = function(event) {
    
//     const reminders = JSON.parse(event.data);

//     reminders.sort((a, b) => new Date(a.time) - new Date(b.time));

//     const list = document.getElementById("reminderList");
//     list.innerHTML = "";

//     reminders.forEach(reminder => {
//         const li = document.createElement("li");
//         li.textContent = reminder.message + "（日付: " + new Date(reminder.time).toLocaleDateString() + "）";
//         list.appendChild(li);
//     });
// };