import { useEffect, useMemo, useState } from 'react';
import { Typography, Table, Button, Space, Modal, Form, Input, Popconfirm, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useVaiTro } from '../context/VaiTroContext';

const { Title, Text } = Typography;

const QuanLyAp = () => {
    const { vaiTro, vaiTroLabel } = useVaiTro();
    const coQuyenCRUD = vaiTro === 'ubnd_xa';
    const [loading, setLoading] = useState(true);
    const [danhSachAp, setDanhSachAp] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [dangSua, setDangSua] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        fetch('/api/db.json')
            .then(res => {
                if (!res.ok) throw new Error(`không lấy được dữ liệu: ${res.status}`);
                return res.json();
            })
            .then(data => {
                const nhanKhau = data.nhanKhau || [];
                const tongHop = new Map();

                nhanKhau.forEach(item => {
                    const tenAp = (item.tenAp || '').trim();
                    if (!tenAp) return;

                    const hienTai = tongHop.get(tenAp) || {
                        key: tenAp,
                        tenAp,
                        soHo: new Set(),
                        soNhanKhau: 0,
                    };

                    hienTai.soHo.add(item.maHo);
                    hienTai.soNhanKhau += 1;
                    tongHop.set(tenAp, hienTai);
                });

                setDanhSachAp(
                    [...tongHop.values()].map(item => ({
                        ...item,
                        soHo: item.soHo.size,
                    })).sort((a, b) => a.tenAp.localeCompare(b.tenAp, 'vi'))
                );
            })
            .catch(err => console.error('khong lay duoc du lieu ấp', err))
            .finally(() => setLoading(false));
    }, []);

    const tongSoHo = useMemo(() => danhSachAp.reduce((tong, item) => tong + item.soHo, 0), [danhSachAp]);
    const tongSoNhanKhau = useMemo(() => danhSachAp.reduce((tong, item) => tong + item.soNhanKhau, 0), [danhSachAp]);

    const moModalThem = () => {
        setDangSua(null);
        form.resetFields();
        setModalOpen(true);
    };

    const moModalSua = (record) => {
        setDangSua(record);
        form.setFieldsValue({ tenAp: record.tenAp });
        setModalOpen(true);
    };

    const dongModal = () => {
        setModalOpen(false);
        setDangSua(null);
        form.resetFields();
    };

    const xuLyLuu = async () => {
        const values = await form.validateFields();
        const tenApMoi = values.tenAp.trim();

        if (dangSua) {
            setDanhSachAp(prev => prev.map(item => item.key === dangSua.key ? { ...item, tenAp: tenApMoi, key: tenApMoi } : item).sort((a, b) => a.tenAp.localeCompare(b.tenAp, 'vi')));
        } else {
            setDanhSachAp(prev => {
                if (prev.some(item => item.tenAp === tenApMoi)) {
                    return prev;
                }

                return [...prev, {
                    key: tenApMoi,
                    tenAp: tenApMoi,
                    soHo: 0,
                    soNhanKhau: 0,
                }].sort((a, b) => a.tenAp.localeCompare(b.tenAp, 'vi'));
            });
        }

        dongModal();
    };

    const xuLyXoa = (record) => {
        setDanhSachAp(prev => prev.filter(item => item.key !== record.key));
    };

    const cotDanhSach = [
        { title: 'Tên ấp', dataIndex: 'tenAp', key: 'tenAp' },
        {
            title: 'Số hộ',
            dataIndex: 'soHo',
            key: 'soHo',
            width: 120,
            render: (value) => <Tag color="blue">{value} hộ</Tag>,
        },
        {
            title: 'Nhân khẩu',
            dataIndex: 'soNhanKhau',
            key: 'soNhanKhau',
            width: 140,
            render: (value) => <Tag color="green">{value} người</Tag>,
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
                            title="Xóa ấp"
                            description="Bạn chắc chắn muốn xóa ấp này?"
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
                    <Title level={2} style={{ marginBottom: 0 }}>Quản lí ấp</Title>
                    <Text type="secondary">Danh sách các ấp đang có trong hệ thống</Text>
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

            <div style={{ marginTop: 16, marginBottom: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Tag color="blue">Tổng ấp: {danhSachAp.length}</Tag>
                <Tag color="green">Tổng hộ: {tongSoHo}</Tag>
                <Tag color="gold">Tổng nhân khẩu: {tongSoNhanKhau}</Tag>
            </div>

            <Table
                rowKey="key"
                loading={loading}
                dataSource={danhSachAp}
                columns={cotDanhSach}
                pagination={{ pageSize: 10 }}
                tableLayout="fixed"
                scroll={{ x: 700 }}
            />

            {coQuyenCRUD && (
                <Modal
                    title={dangSua ? 'Sửa ấp' : 'Thêm ấp'}
                    open={modalOpen}
                    onCancel={dongModal}
                    onOk={xuLyLuu}
                    okText={dangSua ? 'Lưu' : 'Thêm'}
                    cancelText="Hủy"
                    destroyOnClose
                >
                    <Form form={form} layout="vertical" preserve={false}>
                        <Form.Item
                            name="tenAp"
                            label="Tên ấp"
                            rules={[
                                { required: true, message: 'Vui lòng nhập tên ấp' },
                                { whitespace: true, message: 'Tên ấp không được để trống' },
                            ]}
                        >
                            <Input placeholder="Ví dụ: Ấp Thới Hòa" />
                        </Form.Item>
                    </Form>
                </Modal>
            )}
        </div>
    );
};

export default QuanLyAp;
