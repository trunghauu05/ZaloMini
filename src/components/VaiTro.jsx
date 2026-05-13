import { useMemo, useState } from 'react';
import { Typography, Table, Button, Space, Modal, Form, Input, Popconfirm, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useVaiTro } from '../context/VaiTroContext';

const { Title, Text } = Typography;

const VaiTro = () => {
    const { vaiTro, vaiTroLabel } = useVaiTro();
    const coQuyenCRUD = vaiTro === 'ubnd_xa';
    const [danhSachVaiTro, setDanhSachVaiTro] = useState([
        { key: 'ubnd_xa', tenVaiTro: 'UBND xã', moTa: 'Xem toàn bộ ấp và toàn bộ hộ', nhomQuyen: 'Toàn quyền' },
        { key: 'truong_ap', tenVaiTro: 'Trưởng ấp', moTa: 'Chỉ xem hộ thuộc ấp được gán', nhomQuyen: 'Quản lý theo ấp' },
        { key: 'chi_bo', tenVaiTro: 'Bí thư chi bộ', moTa: 'Xem danh sách giống trưởng ấp', nhomQuyen: 'Xem theo ấp' },
        { key: 'to_truong', tenVaiTro: 'Tổ trưởng dân phố', moTa: 'Xem danh sách giống trưởng ấp', nhomQuyen: 'Xem theo ấp' },
    ]);
    const [modalOpen, setModalOpen] = useState(false);
    const [dangSua, setDangSua] = useState(null);
    const [form] = Form.useForm();

    const tongSoVaiTro = useMemo(() => danhSachVaiTro.length, [danhSachVaiTro]);

    const moModalThem = () => {
        setDangSua(null);
        form.resetFields();
        setModalOpen(true);
    };

    const moModalSua = (record) => {
        setDangSua(record);
        form.setFieldsValue({
            tenVaiTro: record.tenVaiTro,
            moTa: record.moTa,
            nhomQuyen: record.nhomQuyen,
        });
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
            key: dangSua?.key || values.tenVaiTro.toLowerCase().replace(/\s+/g, '_'),
            tenVaiTro: values.tenVaiTro.trim(),
            moTa: values.moTa.trim(),
            nhomQuyen: values.nhomQuyen.trim(),
        };

        setDanhSachVaiTro(prev => {
            if (dangSua) {
                return prev.map(item => item.key === dangSua.key ? payload : item);
            }

            if (prev.some(item => item.key === payload.key || item.tenVaiTro === payload.tenVaiTro)) {
                return prev;
            }

            return [...prev, payload];
        });

        dongModal();
    };

    const xuLyXoa = (record) => {
        setDanhSachVaiTro(prev => prev.filter(item => item.key !== record.key));
    };

    const cotDanhSach = [
        {
            title: 'Vai trò',
            dataIndex: 'tenVaiTro',
            key: 'tenVaiTro',
            render: (value) => <b>{value}</b>,
        },
        {
            title: 'Mô tả',
            dataIndex: 'moTa',
            key: 'moTa',
        },
        {
            title: 'Nhóm quyền',
            dataIndex: 'nhomQuyen',
            key: 'nhomQuyen',
            width: 180,
            render: (value) => <Tag color="blue">{value}</Tag>,
        },
        {
            title: 'Hành động',
            key: 'hanhDong',
            width: 180,
            render: (_, record) => (
                coQuyenCRUD ? (
                    <Space>
                        <Button size="small" type="primary" onClick={() => moModalSua(record)}>Sửa</Button>
                        <Popconfirm
                            title="Xóa vai trò"
                            description="Bạn chắc chắn muốn xóa vai trò này?"
                            okText="Xóa"
                            cancelText="Hủy"
                            onConfirm={() => xuLyXoa(record)}
                        >
                            <Button size="small" danger>Xóa</Button>
                        </Popconfirm>
                    </Space>
                ) : (
                    <span style={{ color: '#9ca3af' }}>Không có quyền</span>
                )
            ),
        },
    ];

    return (
        <div style={{ backgroundColor: 'white', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <div>
                    <Title level={2} style={{ marginBottom: 0 }}>Vai trò</Title>
                    <Text type="secondary">Danh sách 4 vai trò đang dùng trong hệ thống</Text>
                </div>
                {coQuyenCRUD && (
                    <Button type="primary" icon={<PlusOutlined />} onClick={moModalThem} style={{ backgroundColor: '#22c55e', borderColor: '#22c55e' }}>
                        Thêm
                    </Button>
                )}
            </div>

            <div style={{ marginTop: 8, marginBottom: 8, color: '#6b7280' }}>
                Vai trò hiện tại: <b>{vaiTroLabel}</b>
            </div>

            <div style={{ marginTop: 16, marginBottom: 16 }}>
                <Tag color="green">Tổng vai trò: {tongSoVaiTro}</Tag>
            </div>

            <Table
                rowKey="key"
                dataSource={danhSachVaiTro}
                columns={cotDanhSach}
                pagination={false}
                tableLayout="fixed"
                scroll={{ x: 700 }}
            />

            {coQuyenCRUD && (
                <Modal
                    title={dangSua ? 'Sửa vai trò' : 'Thêm vai trò'}
                    open={modalOpen}
                    onCancel={dongModal}
                    onOk={xuLyLuu}
                    okText={dangSua ? 'Lưu' : 'Thêm'}
                    cancelText="Hủy"
                    destroyOnClose
                >
                    <Form form={form} layout="vertical" preserve={false}>
                        <Form.Item
                            name="tenVaiTro"
                            label="Tên vai trò"
                            rules={[
                                { required: true, message: 'Vui lòng nhập tên vai trò' },
                                { whitespace: true, message: 'Tên vai trò không được để trống' },
                            ]}
                        >
                            <Input placeholder="Ví dụ: UBND xã" />
                        </Form.Item>
                        <Form.Item
                            name="moTa"
                            label="Mô tả"
                            rules={[
                                { required: true, message: 'Vui lòng nhập mô tả' },
                                { whitespace: true, message: 'Mô tả không được để trống' },
                            ]}
                        >
                            <Input.TextArea rows={3} placeholder="Mô tả phạm vi quyền" />
                        </Form.Item>
                        <Form.Item
                            name="nhomQuyen"
                            label="Nhóm quyền"
                            rules={[
                                { required: true, message: 'Vui lòng nhập nhóm quyền' },
                                { whitespace: true, message: 'Nhóm quyền không được để trống' },
                            ]}
                        >
                            <Input placeholder="Ví dụ: Xem theo ấp" />
                        </Form.Item>
                    </Form>
                </Modal>
            )}
        </div>
    );
};

export default VaiTro;
