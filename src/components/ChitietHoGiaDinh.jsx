import { useMemo, useState } from 'react';
import { Table, Typography, Button, Space } from 'antd';
import HeaderSearchIcon from './HeaderSearchIcon';

const { Title, Text } = Typography;

const ChitietHoGiaDinh = ({ onBack, maHo, tenAp, thanhVienHo, coQuyenQuanLy }) => {
    const [searchField, setSearchField] = useState('hoTen');
    const [searchKeyword, setSearchKeyword] = useState('');

    const tinhTuoi = (ngaySinh) => {
        if (!ngaySinh) return '';
        const parts = ngaySinh.split('/');
        if (parts.length !== 3) return '';
        const namSinh = Number.parseInt(parts[2], 10);
        const namHienTai = new Date().getFullYear();
        return namHienTai - namSinh;
    };

    const timKiemTheoCot = (field, keyword) => {
        setSearchField(field);
        setSearchKeyword(keyword);
    };

    const xoaTimKiemTheoCot = (field) => {
        setSearchField(field);
        setSearchKeyword('');
    };

    const cotChiTietHo = [
        {
            title: <HeaderSearchIcon label="Họ và Tên" field="hoTen" value={searchField === 'hoTen' ? searchKeyword : ''} onSearch={timKiemTheoCot} onClear={xoaTimKiemTheoCot} />,
            dataIndex: 'hoTen',
            key: 'hoTen'
        },
        {
            title: <HeaderSearchIcon label="Giới tính" field="gioiTinh" value={searchField === 'gioiTinh' ? searchKeyword : ''} onSearch={timKiemTheoCot} onClear={xoaTimKiemTheoCot} />,
            dataIndex: 'gioiTinh',
            key: 'gioiTinh'
        },
        {
            title: <HeaderSearchIcon label="Ngày sinh" field="ngaySinh" value={searchField === 'ngaySinh' ? searchKeyword : ''} onSearch={timKiemTheoCot} onClear={xoaTimKiemTheoCot} />,
            dataIndex: 'ngaySinh',
            key: 'ngaySinh'
        },
        {
            title: <HeaderSearchIcon label="Tuổi" field="tuoi" value={searchField === 'tuoi' ? searchKeyword : ''} onSearch={timKiemTheoCot} onClear={xoaTimKiemTheoCot} />,
            key: 'tuoi',
            render: (text, record) => tinhTuoi(record.ngaySinh)
        },
        {
            title: <HeaderSearchIcon label="CCCD" field="cccd" value={searchField === 'cccd' ? searchKeyword : ''} onSearch={timKiemTheoCot} onClear={xoaTimKiemTheoCot} />,
            dataIndex: 'cccd',
            key: 'cccd'
        },
        {
            title: <HeaderSearchIcon label="Quan hệ" field="quanHe" value={searchField === 'quanHe' ? searchKeyword : ''} onSearch={timKiemTheoCot} onClear={xoaTimKiemTheoCot} />,
            dataIndex: 'quanHe',
            key: 'quanHe'
        },
        {
            title: 'Hành động',
            key: 'hanhDong',
            render: () => (
                coQuyenQuanLy ? (
                    <Space>
                        <Button size="small">Sửa</Button>
                        <Button size="small" danger>Xóa</Button>
                    </Space>
                ) : (
                    <span style={{ color: '#9ca3af' }}>Không có quyền</span>
                )
            )
        }
    ];

    const thanhVienLoc = useMemo(() => {
        const tuKhoa = searchKeyword.trim().toLowerCase();
        if (!tuKhoa) return thanhVienHo;

        const layGiaTri = (nguoi) => {
            switch (searchField) {
                case 'hoTen': return nguoi.hoTen;
                case 'gioiTinh': return nguoi.gioiTinh;
                case 'ngaySinh': return nguoi.ngaySinh;
                case 'tuoi': return tinhTuoi(nguoi.ngaySinh);
                case 'cccd': return nguoi.cccd;
                case 'quanHe': return nguoi.quanHe;
                default: return '';
            }
        };

        return thanhVienHo.filter(nguoi => String(layGiaTri(nguoi) ?? '').toLowerCase().includes(tuKhoa));
    }, [searchField, searchKeyword, thanhVienHo]);

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                <div>
                    <Title level={3} style={{ marginBottom: 0 }}>Danh sách nhân khẩu</Title>
                    <Text type="secondary">Hộ: {maHo || ''} • Ấp: {tenAp || 'Chưa cập nhật'}</Text>
                </div>
                <Space>
                    {coQuyenQuanLy && <Button type="primary">Thêm</Button>}
                    <Button onClick={onBack}>Quay lại</Button>
                </Space>
            </div>
            <Table
                columns={cotChiTietHo}
                dataSource={thanhVienLoc}
                pagination={false}
                rowKey="id" // Thêm rowKey để Ant Design không báo lỗi thiếu key
                tableLayout="fixed"
                style={{ marginTop: '20px' }}
                scroll={{ x: 800 }}
            />
        </div>
    );
}

export default ChitietHoGiaDinh;