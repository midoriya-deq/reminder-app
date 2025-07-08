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

// リマインダーの表示と削除・編集機能
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

            // 編集ボタン
            const editBtn = document.createElement("button");
            editBtn.textContent = "編集";
            editBtn.addEventListener("click", function () {
    // 編集用の入力フォームを作成
    const messageInput = document.createElement("input");
    messageInput.type = "text";
    messageInput.value = reminder.message;
    messageInput.placeholder = "メッセージを編集";

    const timeInput = document.createElement("input");
    timeInput.type = "datetime-local";
    timeInput.value = new Date(reminder.time).toISOString().slice(0,16); // ISO形式に整える

    const saveBtn = document.createElement("button");
    saveBtn.textContent = "保存";

    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "キャンセル";

    // 既存表示をクリアして、編集UIを表示
    li.innerHTML = "";
    li.appendChild(messageInput);
    li.appendChild(timeInput);
    li.appendChild(saveBtn);
    li.appendChild(cancelBtn);

    saveBtn.addEventListener("click", function () {
        const updatedReminder = {
            message: messageInput.value,
            time: timeInput.value
        };

        fetch("/editReminder/" + reminder.id, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedReminder)
        })
        .then(res => res.json())
        .then(data => {
            alert(data.message);
            location.reload();
        })
        .catch(error => console.error("編集エラー:", error));
    });

    cancelBtn.addEventListener("click", function () {
        location.reload(); // キャンセル時は元に戻す
    });
});

            li.appendChild(deleteBtn);
            li.appendChild(editBtn);
            reminderList.appendChild(li);
        });
    })
    .catch(error => {
        alert("データ取得に失敗しました。ネットワークを確認してください。");
        console.error("データ取得エラー:", error);
    });
});

// WebSocketによるリアルタイム更新
socket.onmessage = function(event) {
    const reminders = JSON.parse(event.data);

    reminders.sort((a, b) => new Date(a.time) - new Date(b.time));

    const list = document.getElementById("reminderList");
    list.innerHTML = "";

    reminders.forEach(reminder => {
        const li = document.createElement("li");
        li.textContent = reminder.message + "（日付: " + new Date(reminder.time).toLocaleDateString() + "）";
        list.appendChild(li);
    });
};
