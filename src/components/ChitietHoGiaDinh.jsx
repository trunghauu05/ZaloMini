import { Table, Typography, Button, Space } from 'antd';

const { Title, Text } = Typography;

const ChitietHoGiaDinh = ({ onBack, maHo, tenAp, thanhVienHo }) => {
    const tinhTuoi = (ngaySinh) => {
        if (!ngaySinh) return '';
        const parts = ngaySinh.split('/');
        if (parts.length !== 3) return '';
        const namSinh = Number.parseInt(parts[2], 10);
        const namHienTai = new Date().getFullYear();
        return namHienTai - namSinh;
    };

    const cotChiTietHo = [
        { title: 'Họ và Tên', dataIndex: 'hoTen', key: 'hoTen'},
        { title: 'Giới tính', dataIndex: 'gioiTinh', key: 'gioiTinh' },
        { title: 'Ngày sinh', dataIndex: 'ngaySinh', key: 'ngaySinh' },
        {
            title: 'Tuổi',
            key: 'tuoi',
            render: (text, record) => tinhTuoi(record.ngaySinh)
        },
        { title: 'CCCD', dataIndex: 'cccd', key: 'cccd' },
        { title: 'Quan hệ', dataIndex: 'quanHe', key: 'quanHe' },
        {
            title: 'Hành động',
            key: 'hanhDong',
            render: () => (
                <Space>
                    <Button size="small">Sửa</Button>
                    <Button size="small" danger>Xóa</Button>
                </Space>
            )
        }
    ];

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                <div>
                    <Title level={3} style={{ marginBottom: 0 }}>Danh sách nhân khẩu</Title>
                    <Text type="secondary">Hộ: {maHo || ''} • Ấp: {tenAp || 'Chưa cập nhật'}</Text>
                </div>
                <Space>
                    <Button type="primary">Thêm</Button>
                    <Button onClick={onBack}>Quay lại</Button>
                </Space>
            </div>
            <Table
                columns={cotChiTietHo}
                dataSource={thanhVienHo}
                pagination={false}
                rowKey="id" // Thêm rowKey để Ant Design không báo lỗi thiếu key
                style={{ marginTop: '20px' }}
                scroll={{ x: 800 }}
            />
        </div>
    );
}

export default ChitietHoGiaDinh;