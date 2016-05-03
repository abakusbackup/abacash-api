module.exports = [
    {
        model: 'User',
        data: {
            email: 'test@abakus.no',
            name: 'Test Bruker',
            isAdmin: false,
            // Password: test
            hash: '$2a$10$Gm09SZEHzdqx4eBV06nNheenfKpw3R1rXrMzmYfjX/.9UFPHnaAn6'
        }
    },
    {
        model: 'User',
        data: {
            email: 'backup@abakus.no',
            name: 'Backup bruker',
            isAdmin: true,
            // Password: test
            hash: '$2a$10$Gm09SZEHzdqx4eBV06nNheenfKpw3R1rXrMzmYfjX/.9UFPHnaAn6'
        }
    }
];
