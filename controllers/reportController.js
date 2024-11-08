const axios = require('axios');
const ExcelJS = require('exceljs');

// Hàm để lấy dữ liệu từ các API
async function fetchDataFromApis() {
    try {
        const tripData = await axios.get('https://api-flutter-hyll.onrender.com/trips');
        const userData = await axios.get('https://api-flutter-hyll.onrender.com/user');
        const addressData = await axios.get('https://api-flutter-hyll.onrender.com/address');
        const categoryData = await axios.get('http://localhost:5000/categories');
        const productData = await axios.get('http://localhost:5000/products');
        const orderData = await axios.get('http://localhost:5000/orders');

        return {
            trips: tripData.data,
            users: userData.data,
            addresses: addressData.data,
            categories: categoryData.data,
            products: productData.data,
            orders: orderData.data
        };
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu từ API:", error);
        throw error;
    }
}

// Hàm tạo file Excel từ dữ liệu đã lấy
async function generateExcelReport(req, res) {
    try {
        const { trips, users, addresses, categories, products, orders } = await fetchDataFromApis();

        const workbook = new ExcelJS.Workbook();
        const tripSheet = workbook.addWorksheet('Trips');
        const userSheet = workbook.addWorksheet('Users');
        const addressSheet = workbook.addWorksheet('Addresses');
        const categorySheet = workbook.addWorksheet('Categories');
        const productSheet = workbook.addWorksheet('Products');
        const orderSheet = workbook.addWorksheet('Orders');

        // Cấu trúc các cột cho bảng 'Trips'
        tripSheet.columns = [
            { header: 'Location Name', key: 'name', width: 20 },
            { header: 'Image URL', key: 'imageURL', width: 30 },
            { header: 'Trip Name', key: 'tripName', width: 20 },
            { header: 'Date', key: 'date', width: 15 },
            { header: 'Time', key: 'time', width: 15 },
            { header: 'Guide', key: 'guide', width: 20 },
            { header: 'Action Detail', key: 'actions.Detail', width: 20 },
            { header: 'Action Chat', key: 'actions.Chat', width: 20 },
            { header: 'Action Pay', key: 'actions.Pay', width: 20 },
        ];

        // Cấu trúc các cột cho bảng 'Users'
        userSheet.columns = [
            { header: 'First Name', key: 'firstName', width: 15 },
            { header: 'Last Name', key: 'lastName', width: 15 },
            { header: 'Country', key: 'country', width: 20 },
            { header: 'Email', key: 'email', width: 25 },
            { header: 'Password', key: 'password', width: 20 },
            { header: 'Role', key: 'role', width: 15 },
        ];

        // Cấu trúc các cột cho bảng 'Addresses'
        addressSheet.columns = [
            { header: 'City Name', key: 'name', width: 20 },
            { header: 'Avatar URL', key: 'avatar', width: 30 },
            { header: 'City', key: 'city', width: 20 },
            { header: 'City Image URL', key: 'imagecity', width: 30 },
            { header: 'Note', key: 'note', width: 25 },
            { header: 'ID', key: 'id', width: 15 },
        ];

        // Cấu trúc các cột cho bảng 'Categories'
        categorySheet.columns = [
            { header: 'Category Name', key: 'name', width: 20 },
            { header: 'Description', key: 'description', width: 30 },
        ];

        // Cấu trúc các cột cho bảng 'Products'
        productSheet.columns = [
            { header: 'Product Name', key: 'name', width: 20 },
            { header: 'Image URL', key: 'image', width: 30 },
            { header: 'Price', key: 'price', width: 15 },
            { header: 'Description', key: 'description', width: 30 },
        ];

        // Cấu trúc các cột cho bảng 'Orders'
        orderSheet.columns = [
            { header: 'Full Name', key: 'fullName', width: 20 },
            { header: 'Email', key: 'email', width: 25 },
            { header: 'Phone Number', key: 'phoneNumber', width: 15 },
            { header: 'Number of People', key: 'numberOfPeople', width: 15 },
            { header: 'Order Date', key: 'orderDate', width: 20 },
            { header: 'Status', key: 'status', width: 15 },
            { header: 'User Image URL', key: 'imageUrlUser', width: 30 },
            { header: 'Trip Image URL', key: 'imageUrlTrip', width: 30 },
        ];

        // Thêm dữ liệu vào các sheet
        trips.forEach(trip => {
            tripSheet.addRow({
                name: trip.name,
                imageURL: trip.imageURL,
                tripName: trip.trip.tripName,
                date: trip.trip.date,
                time: trip.trip.time,
                guide: trip.trip.guide,
                'actions.Detail': trip.trip.actions.Detail,
                'actions.Chat': trip.trip.actions.Chat,
                'actions.Pay': trip.trip.actions.Pay
            });
        });

        users.forEach(user => {
            userSheet.addRow(user);
        });

        addresses.forEach(address => {
            addressSheet.addRow(address);
        });

        categories.forEach(category => {
            categorySheet.addRow(category);
        });

        products.forEach(product => {
            productSheet.addRow(product);
        });

        orders.forEach(order => {
            orderSheet.addRow(order);
        });

        // Thiết lập kiểu phản hồi là file Excel
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=report.xlsx');

        // Xuất file Excel
        await workbook.xlsx.write(res);
        res.status(200).end();
    } catch (error) {
        res.status(500).send("Có lỗi xảy ra khi tạo báo cáo.");
    }
}

module.exports = { generateExcelReport };
