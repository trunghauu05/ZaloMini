import { Modal, Table, Select } from 'antd';

const ChitietHoGiaDinh = ({ open, onClose, maHo, thanhVienHo }) => {
    const cotChiTietHo = [
        { title: 'Họ và Tên', dataIndex: 'hoTen', key: 'hoTen'},
        { title: 'Giới tính', dataIndex: 'gioiTinh', key: 'gioiTinh' },
        { title: 'Ngày sinh', dataIndex: 'ngaySinh', key: 'ngaySinh' },
        { title: 'CCCD', dataIndex: 'cccd', key: 'cccd' },
        { title: 'Quan hệ', dataIndex: 'quanHe', key: 'quanHe' },
        {
            title: 'Tình trạng cư trú',
            dataIndex: 'tinhTrang',
            key: 'tinhTrang',
            render: (text) => (
                <Select defaultValue={text || "Thường trú"} style={{ width: 130 }}>
                    <Select.Option value="Thường trú">Thường trú</Select.Option>
                    <Select.Option value="Tạm trú">Tạm trú</Select.Option>
                    <Select.Option value="Tạm vắng">Tạm vắng</Select.Option>
                </Select>
            )
        }
    ];

    return (
        <Modal
            title={`Danh sách nhân khẩu - Hộ: ${maHo || ''}`}
            open={open}
            onCancel={onClose}
            footer={null}
            width={900}
        >
            <Table
                columns={cotChiTietHo}
                dataSource={thanhVienHo}
                pagination={false}
                rowKey="id" // Thêm rowKey để Ant Design không báo lỗi thiếu key
                style={{ marginTop: '20px' }}
            />
        </Modal>
    );
}

export default ChitietHoGiaDinh;