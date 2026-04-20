const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');

const app = express();
app.use(cors());
app.use(express.json()); // Để đọc dữ liệu JSON từ Frontend gửi lên

// API dự đoán bệnh tim
app.post('/api/predict', (req, res) => {
    const medicalData = req.body; 
    // Dữ liệu ví dụ: { age: 50, sex: 1, cp: 2, thalach: 150, ... }

    // Chuyển object dữ liệu thành chuỗi JSON để truyền cho Python
    const inputJson = JSON.stringify(medicalData);

    // Gọi script Python
    // Lưu ý: Đảm bảo máy tính đã cài Python và các thư viện pandas, scikit-learn
    const pythonProcess = spawn('python', ['predict.py', inputJson]);

    let result = '';

    // Nhận kết quả từ Python in ra
    pythonProcess.stdout.on('data', (data) => {
        result += data.toString();
    });

    // Bắt lỗi nếu có
    pythonProcess.stderr.on('data', (data) => {
        console.error(`Lỗi Python: ${data}`);
    });

    // Khi Python chạy xong, trả kết quả về cho người dùng (Frontend)
    pythonProcess.on('close', (code) => {
        if (code === 0) {
            res.json({ success: true, prediction: result.trim() });
        } else {
            res.status(500).json({ success: false, message: 'Lỗi khi dự đoán' });
        }
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});