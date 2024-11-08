const express = require('express');
const cors = require('cors');
const reportRoute = require('./Routes/reportRoute'); // Đường dẫn đến file reportRoute.js

const app = express();
const port = process.env.PORT || 5000;

// Cấu hình CORS (nếu cần thiết)
app.use(cors());

// Sử dụng route cho báo cáo
app.use('/api', reportRoute);

// Khởi động server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
