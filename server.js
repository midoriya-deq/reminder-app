const express = require("express");
const fs = require("fs");
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static("public"));

// JSONファイルを取得
app.get("/reminders.json", (req, res) => {
    res.sendFile(__dirname + "/reminders.json");
});

// 新しいリマインダーを追加
app.post("/addReminder", (req, res) => {
    const newReminder = req.body;

    fs.readFile("reminders.json", "utf8", (err, data) => {
        if (err) {
            console.error("ファイルの読み込みエラー:", err);
            return res.status(500).json({ error: "データの取得に失敗しました" });
        }

        let reminders = [];
        try {
            reminders = JSON.parse(data);
        } catch (parseError) {
            console.error("JSON解析エラー:", parseError);
            return res.status(500).json({ error: "データの形式が不正です" });
        }

        reminders.push(newReminder);

        fs.writeFile("reminders.json", JSON.stringify(reminders, null, 2), (writeErr) => {
            if (writeErr) {
                console.error("ファイル書き込みエラー:", writeErr);
                return res.status(500).json({ error: "データの保存に失敗しました" });
            }

            res.json({ message: "リマインダー追加成功！" });
        });
    });
});

app.listen(port, () => {
    console.log(`サーバーが http://localhost:${port} で起動しました`);
});