// Script to initialize admin account and sample employees
(function() {
    // Function to hash password (same as in authModule.js)
    function simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = (hash << 5) - hash + str.charCodeAt(i);
        }
        return hash.toString(16);
    }

    // Add admin account
    function addAdminAccount() {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Check if admin already exists
        const adminExists = users.find(u => u.username === 'admin');
        if (!adminExists) {
            users.push({ username: 'admin', password: simpleHash('admin123') });
            localStorage.setItem('users', JSON.stringify(users));
            console.log('Admin account created successfully!');
        } else {
            console.log('Admin account already exists.');
        }
    }

    // Add sample employees
    function addSampleEmployees() {
        // Check if we already have employees
        const employees = JSON.parse(localStorage.getItem('employees') || '[]');
        
        // If we have less than 5 employees, add sample data
        if (employees.length < 5) {
            const sampleEmployees = [
                {
                    name: "Nguyễn Văn An",
                    email: "nguyenvanan@example.com",
                    phone: "0901234567",
                    address: "123 Đường ABC, Quận 1, TP.HCM",
                    departmentId: 1,
                    positionId: 1,
                    salary: 15000000,
                    bonus: 2000000,
                    deduction: 500000,
                    hireDate: "2023-01-15"
                },
                {
                    name: "Trần Thị Bình",
                    email: "tranthibinh@example.com",
                    phone: "0902345678",
                    address: "456 Đường XYZ, Quận 2, TP.HCM",
                    departmentId: 2,
                    positionId: 2,
                    salary: 12000000,
                    bonus: 1500000,
                    deduction: 300000,
                    hireDate: "2023-03-20"
                },
                {
                    name: "Lê Văn Cường",
                    email: "levancuong@example.com",
                    phone: "0903456789",
                    address: "789 Đường DEF, Quận 3, TP.HCM",
                    departmentId: 1,
                    positionId: 3,
                    salary: 18000000,
                    bonus: 2500000,
                    deduction: 700000,
                    hireDate: "2022-11-10"
                },
                {
                    name: "Phạm Thị Dung",
                    email: "phamthidung@example.com",
                    phone: "0904567890",
                    address: "321 Đường GHI, Quận 4, TP.HCM",
                    departmentId: 3,
                    positionId: 4,
                    salary: 10000000,
                    bonus: 1000000,
                    deduction: 200000,
                    hireDate: "2024-02-05"
                },
                {
                    name: "Hoàng Văn Em",
                    email: "hoangvanem@example.com",
                    phone: "0905678901",
                    address: "654 Đường JKL, Quận 5, TP.HCM",
                    departmentId: 2,
                    positionId: 5,
                    salary: 13000000,
                    bonus: 1800000,
                    deduction: 400000,
                    hireDate: "2023-07-12"
                },
                {
                    name: "Vũ Thị Hoa",
                    email: "vuthihoa@example.com",
                    phone: "0906789012",
                    address: "987 Đường MNO, Quận 6, TP.HCM",
                    departmentId: 1,
                    positionId: 2,
                    salary: 14000000,
                    bonus: 2200000,
                    deduction: 600000,
                    hireDate: "2023-05-18"
                },
                {
                    name: "Đỗ Văn Hải",
                    email: "dovanhai@example.com",
                    phone: "0907890123",
                    address: "147 Đường PQR, Quận 7, TP.HCM",
                    departmentId: 3,
                    positionId: 6,
                    salary: 11000000,
                    bonus: 1200000,
                    deduction: 350000,
                    hireDate: "2024-01-30"
                },
                {
                    name: "Ngô Thị Lan",
                    email: "ngothilan@example.com",
                    phone: "0908901234",
                    address: "258 Đường STU, Quận 8, TP.HCM",
                    departmentId: 2,
                    positionId: 4,
                    salary: 16000000,
                    bonus: 2800000,
                    deduction: 800000,
                    hireDate: "2022-09-22"
                },
                {
                    name: "Dương Văn Minh",
                    email: "duongvanminh@example.com",
                    phone: "0909012345",
                    address: "369 Đường VWX, Quận 9, TP.HCM",
                    departmentId: 1,
                    positionId: 5,
                    salary: 17000000,
                    bonus: 3000000,
                    deduction: 900000,
                    hireDate: "2023-04-14"
                },
                {
                    name: "Bùi Thị Ngọc",
                    email: "buithingoc@example.com",
                    phone: "0900123456",
                    address: "741 Đường YZ, Quận 10, TP.HCM",
                    departmentId: 3,
                    positionId: 3,
                    salary: 19000000,
                    bonus: 3500000,
                    deduction: 1000000,
                    hireDate: "2022-12-08"
                }
            ];

            // Add employees to the array
            sampleEmployees.forEach(emp => {
                // Generate ID
                emp.id = Math.max(...employees.map(e => e.id), 0) + 1;
                employees.push(emp);
            });

            // Save to localStorage
            localStorage.setItem('employees', JSON.stringify(employees, null, 2));
            console.log('Sample employees added successfully!');
        } else {
            console.log('Sample employees already exist.');
        }
    }

    // Add sample departments if they don't exist
    function addSampleDepartments() {
        const departments = JSON.parse(localStorage.getItem('departments') || '[]');
        
        if (departments.length === 0) {
            const sampleDepartments = [
                { id: 1, name: "Phòng Kỹ thuật" },
                { id: 2, name: "Phòng Kinh doanh" },
                { id: 3, name: "Phòng Nhân sự" }
            ];
            
            localStorage.setItem('departments', JSON.stringify(sampleDepartments, null, 2));
            console.log('Sample departments added successfully!');
        } else {
            console.log('Departments already exist.');
        }
    }

    // Add sample positions if they don't exist
    function addSamplePositions() {
        const positions = JSON.parse(localStorage.getItem('positions') || '[]');
        
        if (positions.length === 0) {
            const samplePositions = [
                { id: 1, title: "Giám đốc" },
                { id: 2, title: "Quản lý" },
                { id: 3, title: "Trưởng phòng" },
                { id: 4, title: "Nhân viên" },
                { id: 5, title: "Chuyên viên" },
                { id: 6, title: "Thực tập sinh" }
            ];
            
            localStorage.setItem('positions', JSON.stringify(samplePositions, null, 2));
            console.log('Sample positions added successfully!');
        } else {
            console.log('Positions already exist.');
        }
    }

    // Initialize data
    function initializeData() {
        addSampleDepartments();
        addSamplePositions();
        addAdminAccount();
        addSampleEmployees();
        console.log('Data initialization completed!');
    }

    // Run initialization
    initializeData();
})();