import { useState } from 'react';
import { Select, Modal, Table, Tag } from 'antd';

// Nhận nguyên cái kho 'danhsach' từ HoGiaDinh truyền sang
const BoLoc = ({ danhsach }) => {
    const [modalLocOpen, setModalLocOpen] = useState(false);
    const [danhSachLoc, setDanhSachLoc] = useState([]);
    const [tieuDeLoc, setTieuDeLoc] = useState('');

    // State này dùng để điều khiển cái chữ hiển thị trên ô Select
    const [giaTriChon, setGiaTriChon] = useState(null);

    // Hàm tính tuổi
    const tinhTuoi = (ngaySinh) => {
        if (!ngaySinh) return 0;
        const parts = ngaySinh.split('/');
        if (parts.length !== 3) return 0;

        const namSinh = parseInt(parts[2], 10);
        const namHienTai = new Date().getFullYear();
        return namHienTai - namSinh;
    };


    const handleChonBoLoc = (giaTri) => {
        setGiaTriChon(giaTri);
        if (!giaTri) return;

        let ketQua = [];
        let tieuDe = "";

        if (giaTri === 'nguoi_cao_tuoi') {
            ketQua = danhsach.filter(n => tinhTuoi(n.ngaySinh) >= 60);
            tieuDe = "Danh sách Người cao tuổi (Nhận quà/Trợ cấp)";
        } else if (giaTri === 'nvqs') {
            ketQua = danhsach.filter(n =>
                n.gioiTinh === 'Nam' &&
                tinhTuoi(n.ngaySinh) >= 18 &&
                tinhTuoi(n.ngaySinh) <= 27
            );
            tieuDe = "Danh sách Nam thanh niên gọi khám NVQS";
        } else if (giaTri === 'ho_ngheo') {
            ketQua = danhsach.filter(n => n.dien?.trim().toLowerCase() === 'hộ nghèo');
            tieuDe = "Danh sách Nhân khẩu thuộc Hộ nghèo";
        } else if (giaTri === 'can_ngheo') {
            ketQua = danhsach.filter(n => n.dien?.trim().toLowerCase() === 'cận nghèo');
            tieuDe = "Danh sách Nhân khẩu thuộc Cận Nghèo";
        }
        else if (giaTri === 'gia_dinh_van_hoa') {
            ketQua = danhsach.filter(n => n.dien?.trim().toLowerCase() === 'gia đình văn hóa');
            tieuDe = "Danh sách Nhân khẩu thuộc Gia Đình Văn Hóa";
        }
        setDanhSachLoc(ketQua);
        setTieuDeLoc(tieuDe);
        setModalLocOpen(true);
    };

    // Hàm đóng Modal và Reset Dropdown
    const dongModalLoc = () => {
        setModalLocOpen(false);
        setGiaTriChon(null); // Reset ô Select về chữ "-- Chọn diện cần lọc --"
    };

    // Cột hiển thị của bảng trong Modal
    const cotBoLoc = [
        { title: 'Mã Hộ', dataIndex: 'maHo', key: 'maHo', width: 100 },
        { title: 'Họ và Tên', dataIndex: 'hoTen', key: 'hoTen' },
        { title: 'Giới tính', dataIndex: 'gioiTinh', key: 'gioiTinh', width: 100 },
        { title: 'Ngày sinh', dataIndex: 'ngaySinh', key: 'ngaySinh' },
        {
            title: 'Tuổi',
            key: 'tuoi',
            render: (text, record) => <Tag color="blue">{tinhTuoi(record.ngaySinh)} tuổi</Tag>
        },
        { title: 'Diện', dataIndex: 'dien', key: 'dien' },
    ];

    return (
        <div style={{ marginBottom: '20px' }}>
            <span style={{ fontWeight: 'bold', marginRight: '10px' }}>Trích xuất danh sách:</span>
            <Select
                value={giaTriChon}
                placeholder="-- Chọn diện cần lọc --"
                style={{ width: 300 }}
                onChange={handleChonBoLoc}
                allowClear
            >
                <Select.Option value="nguoi_cao_tuoi">Người cao tuổi (Từ 60 tuổi trở lên)</Select.Option>
                <Select.Option value="nvqs">Nghĩa vụ quân sự (Nam, 18 - 27 tuổi)</Select.Option>
                <Select.Option value="ho_ngheo">Hộ nghèo</Select.Option>
                <Select.Option value="can_ngheo">Cận Nghèo</Select.Option>
                <Select.Option value="gia_dinh_van_hoa">Gia Đình Văn Hóa</Select.Option>
            </Select>

            <Modal
                title={tieuDeLoc}
                open={modalLocOpen}
                onCancel={dongModalLoc} // Gọi hàm đóng để vừa tắt vừa reset select
                footer={null}
                width={800}
            >
                <Table
                    dataSource={danhSachLoc}
                    columns={cotBoLoc}
                    rowKey="id"
                    pagination={{ pageSize: 5 }}
                    style={{ marginTop: '10px' }}
                />
            </Modal>
        </div>
    );
};

export default BoLoc;