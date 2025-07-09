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
        });
    })
    .catch(function(error) {
        alert("データ取得に失敗しました。ネットワークを確認してください。");
        console.error("データ取得エラー:", error);
    });
});
