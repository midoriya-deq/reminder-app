document.getElementById("reminderForm").addEventListener("submit", function (event) {
    event.preventDefault(); // ページのリロードを防ぐ
// test
    const message = document.getElementById("message").value;
    const time = document.getElementById("time").value;

    const newReminder = { message, time };

    // サーバーにデータを送信
    fetch("/addReminder", {
    // fetch("http://127.0.0.1:8080/addReminder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReminder)
    })
    .then(response => response.json())
    .then(data => {
        alert("リマインダーが追加されました！");
        location.reload(); // ページを更新して新しいリマインダーを表示
    })
    .catch(error => console.error("エラー:", error));
});

// document.addEventListener("DOMContentLoaded", function () {
//   const reminderList = document.getElementById("reminderList");

//   // AjaxでJSONデータを取得
//   fetch("reminders.json")
//     .then(response => response.json())
//     .then(data => {
//     　data.sort((a, b) => {
//     　　return (a.time > b.time) ? 1 : -1;
//     　})
//       data.forEach(reminder => {
//         const li = document.createElement("li");
//         li.textContent = `${reminder.message} - ${new Date(reminder.time).toLocaleString()}`;
//         reminderList.appendChild(li);
//       });
//     })
//     .catch(error => console.error("データの取得に失敗しました:", error));
// });

document.addEventListener("DOMContentLoaded", function () {
    var reminderList = document.getElementById("reminderList");

    fetch("reminders.json")
    .then(response => response.json())
    .then(data => {
        data.sort((a, b) => new Date(a.time) - new Date(b.time));

        data.forEach(function(reminder) {
            var li = document.createElement("li");
            li.textContent = reminder.message + " - " + new Date(reminder.time).toLocaleString();

            // 🔘 削除ボタンの追加
            var deleteBtn = document.createElement("button");
            deleteBtn.textContent = "削除";
            deleteBtn.addEventListener("click", function () {
                fetch("/deleteReminder/" + reminder.id, {
                    method: "DELETE"
                })
                .then(res => res.json())
                .then(data => {
                    alert(data.message);
                    location.reload(); // 表示更新
                })
                .catch(error => console.error("削除エラー:", error));
            });

            li.appendChild(deleteBtn);
            reminderList.appendChild(li);
        });
    })
    .catch(function(error) {
        alert("データの取得に失敗しました。ネットワークを確認してください。");
        console.error("データの取得に失敗しました:", error);
    });
});
