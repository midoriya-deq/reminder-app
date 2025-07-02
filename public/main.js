document.getElementById("reminderForm").addEventListener("submit", function (event) {
    event.preventDefault(); // ページのリロードを防ぐ
// test
    const message = document.getElementById("message").value;
    const time = document.getElementById("time").value;

    const newReminder = { message, time };

    // サーバーにデータを送信
    // fetch("/addReminder", {
    fetch("http://127.0.0.1:8080/addReminder", {
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

document.addEventListener("DOMContentLoaded", function () {
  const reminderList = document.getElementById("reminderList");

  // AjaxでJSONデータを取得
  fetch("reminders.json")
    .then(response => response.json())
    .then(data => {
      data.forEach(reminder => {
        const li = document.createElement("li");
        li.textContent = `${reminder.message} - ${new Date(reminder.time).toLocaleString()}`;
        reminderList.appendChild(li);
      });
    })
    .catch(error => console.error("データの取得に失敗しました:", error));
});
