import { useMemo, useState } from 'react';
import { Typography, Table, Button, Space, Modal, Form, Input, Select, Popconfirm, Tag, Alert } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useVaiTro, vaiTroOptions, getVaiTroLabel } from '../context/VaiTroContext';

const { Title, Text } = Typography;

const QuanLyTaiKhoan = () => {
    const { vaiTro, vaiTroLabel } = useVaiTro();
    const coQuyenQuanLy = vaiTro === 'ubnd_xa';
    const [danhSachTaiKhoan, setDanhSachTaiKhoan] = useState([
        { key: 'tk-01', hoTen: 'Nguyễn Văn A', soDienThoai: '0901123456', matKhau: '123456', tenDangNhap: 'truongap_thoihoa', vaiTro: 'truong_ap', tenAp: 'Ấp Thới Hòa', trangThai: 'Đang hoạt động' },
        { key: 'tk-02', hoTen: 'Lê Văn C', soDienThoai: '0934456789', matKhau: '123456', tenDangNhap: 'truongap_thanhloc', vaiTro: 'truong_ap', tenAp: 'Ấp Thạnh Lộc', trangThai: 'Đang hoạt động' },
        { key: 'tk-03', hoTen: 'Phạm Thị D', soDienThoai: '0945567890', matKhau: '123456', tenDangNhap: 'truongap_thanhtrung', vaiTro: 'chi_bo', tenAp: 'Ấp Thạnh Trung', trangThai: 'Đang hoạt động' },
    ]);
    const [modalOpen, setModalOpen] = useState(false);
    const [dangSua, setDangSua] = useState(null);
    const [form] = Form.useForm();

    const tongSoTaiKhoan = useMemo(() => danhSachTaiKhoan.length, [danhSachTaiKhoan]);

    if (!coQuyenQuanLy) {
        return (
            <div style={{ backgroundColor: 'white', borderRadius: '8px' }}>
                <Title level={2}>Quản lí tài khoản</Title>
                <Alert
                    type="warning"
                    showIcon
                    message="Không có quyền truy cập"
                    description={`Vai trò ${vaiTroLabel} không được xem trang quản lí tài khoản.`}
                />
            </div>
        );
    }

    const moModalThem = () => {
        setDangSua(null);
        form.resetFields();
        form.setFieldsValue({ vaiTro: 'ubnd_xa', trangThai: 'Đang hoạt động' });
        setModalOpen(true);
    };

    const moModalSua = (record) => {
        setDangSua(record);
        form.setFieldsValue(record);
        setModalOpen(true);
    };

    const dongModal = () => {
        setModalOpen(false);
        setDangSua(null);
        form.resetFields();
    };

    const xuLyLuu = async () => {
        const values = await form.validateFields();
        const payload = {
            key: dangSua?.key || `tk-${Date.now()}`,
            hoTen: values.hoTen.trim(),
            soDienThoai: values.soDienThoai.trim(),
            matKhau: values.matKhau,
            tenDangNhap: values.tenDangNhap.trim(),
            vaiTro: values.vaiTro,
            tenAp: values.vaiTro === 'ubnd_xa' ? '' : values.tenAp.trim(),
            trangThai: values.trangThai,
        };

        setDanhSachTaiKhoan(prev => {
            if (dangSua) {
                return prev.map(item => item.key === dangSua.key ? payload : item);
            }

            return [...prev, payload];
        });

        dongModal();
    };

    const xuLyXoa = (record) => {
        setDanhSachTaiKhoan(prev => prev.filter(item => item.key !== record.key));
    };

    const cotDanhSach = [
        { title: 'Họ và tên', dataIndex: 'hoTen', key: 'hoTen' },
        { title: 'Số điện thoại', dataIndex: 'soDienThoai', key: 'soDienThoai', width: 130 },
        { title: 'Mật khẩu', dataIndex: 'matKhau', key: 'matKhau', width: 110 },
        { title: 'Vai trò', dataIndex: 'vaiTro', key: 'vaiTro', width: 140, render: (value) => <Tag color="blue">{getVaiTroLabel(value)}</Tag> },
        { title: 'Ấp phụ trách', dataIndex: 'tenAp', key: 'tenAp', render: (value) => value || '—' },
        { title: 'Trạng thái', dataIndex: 'trangThai', key: 'trangThai', width: 140, render: (value) => <Tag color={value === 'Đang hoạt động' ? 'green' : 'red'}>{value}</Tag> },
        {
            title: 'Hành động',
            key: 'hanhDong',
            width: 180,
            render: (_, record) => (
                <Space>
                    <Button size="small" type="primary" onClick={() => moModalSua(record)}>Sửa</Button>
                    <Popconfirm
                        title="Xóa tài khoản"
                        description="Bạn chắc chắn muốn xóa tài khoản này?"
                        okText="Xóa"
                        cancelText="Hủy"
                        onConfirm={() => xuLyXoa(record)}
                    >
                        <Button size="small" danger>Xóa</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ backgroundColor: 'white', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <div>
                    <Title level={2} style={{ marginBottom: 0 }}>Quản lí tài khoản</Title>
                    <Text type="secondary">Danh sách tài khoản trưởng ấp do UBND xã tạo</Text>
                </div>
                <Button type="primary" icon={<PlusOutlined />} onClick={moModalThem} style={{ backgroundColor: '#22c55e', borderColor: '#22c55e' }}>
                    Thêm
                </Button>
            </div>

            <div style={{ marginTop: 16, marginBottom: 16 }}>
                <Tag color="green">Tổng tài khoản: {tongSoTaiKhoan}</Tag>
                <Tag color="blue" style={{ marginLeft: 8 }}>UBND xã có toàn quyền quản lý</Tag>
            </div>

            <Table
                rowKey="key"
                dataSource={danhSachTaiKhoan}
                columns={cotDanhSach}
                pagination={{ pageSize: 10 }}
                tableLayout="fixed"
                scroll={{ x: 900 }}
            />

            <Modal
                title={dangSua ? 'Sửa tài khoản' : 'Thêm tài khoản'}
                open={modalOpen}
                onCancel={dongModal}
                onOk={xuLyLuu}
                okText={dangSua ? 'Lưu' : 'Thêm'}
                cancelText="Hủy"
                destroyOnClose
            >
                <Form form={form} layout="vertical" preserve={false}>
                    <Form.Item
                        name="hoTen"
                        label="Họ và tên"
                        rules={[
                            { required: true, message: 'Vui lòng nhập họ và tên' },
                            { whitespace: true, message: 'Họ và tên không được để trống' },
                        ]}
                    >
                        <Input placeholder="Ví dụ: Nguyễn Văn A" />
                    </Form.Item>
                    <Form.Item
                        name="soDienThoai"
                        label="Số điện thoại"
                        rules={[
                            { required: true, message: 'Vui lòng nhập số điện thoại' },
                            { pattern: /^[0-9]{9,11}$/, message: 'Số điện thoại phải có 9 - 11 chữ số' },
                        ]}
                    >
                        <Input placeholder="Ví dụ: 0901123456" />
                    </Form.Item>
                    <Form.Item
                        name="matKhau"
                        label="Mật khẩu"
                        rules={[
                            { required: true, message: 'Vui lòng nhập mật khẩu' },
                            { whitespace: false, message: 'Mật khẩu không được để trống' },
                        ]}
                    >
                        <Input.Password placeholder="Nhập mật khẩu" />
                    </Form.Item>
                    <Form.Item
                        name="tenDangNhap"
                        label="Tên đăng nhập"
                        rules={[
                            { required: true, message: 'Vui lòng nhập tên đăng nhập' },
                            { whitespace: true, message: 'Tên đăng nhập không được để trống' },
                        ]}
                    >
                        <Input placeholder="Ví dụ: truongap_thoihoa" />
                    </Form.Item>
                    <Form.Item
                        name="vaiTro"
                        label="Vai trò"
                        rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
                    >
                        <Select
                            options={vaiTroOptions.map(option => ({ label: option.label, value: option.value }))}
                            onChange={(value) => {
                                if (value === 'ubnd_xa') {
                                    form.setFieldsValue({ tenAp: '' });
                                }
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        noStyle
                        shouldUpdate={(prevValues, currentValues) => prevValues.vaiTro !== currentValues.vaiTro}
                    >
                        {({ getFieldValue }) =>
                            getFieldValue('vaiTro') !== 'ubnd_xa' ? (
                                <Form.Item
                                    name="tenAp"
                                    label="Ấp phụ trách"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập ấp phụ trách' },
                                        { whitespace: true, message: 'Ấp phụ trách không được để trống' },
                                    ]}
                                >
                                    <Input placeholder="Ví dụ: Ấp Thới Hòa" />
                                </Form.Item>
                            ) : null
                        }
                    </Form.Item>
                    <Form.Item
                        name="trangThai"
                        label="Trạng thái"
                        rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
                    >
                        <Select
                            options={[
                                { label: 'Đang hoạt động', value: 'Đang hoạt động' },
                                { label: 'Khóa', value: 'Khóa' },
                            ]}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default QuanLyTaiKhoan;
