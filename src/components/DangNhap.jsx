import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Col, Form, Input, Row, Typography, message } from 'antd';
import { useVaiTro } from '../context/VaiTroContext';

const { Title, Text } = Typography;
const AUTH_KEY = 'zalomini_logged_in';
const ACCOUNT_STORAGE_KEY = 'zalomini_active_account';

const DangNhap = () => {
    const navigate = useNavigate();
    const { setVaiTro, setTenAp } = useVaiTro();
    const [dangXuLy, setDangXuLy] = useState(false);

    useEffect(() => {
        if (localStorage.getItem(AUTH_KEY) === '1') {
            navigate('/trang-chu', { replace: true });
        }
    }, [navigate]);

    const xuLyDangNhap = async (values) => {
        setDangXuLy(true);

        try {
            const response = await fetch('/api/db.json');
            if (!response.ok) {
                throw new Error(`không lấy được dữ liệu: ${response.status}`);
            }

            const data = await response.json();
            const taiKhoanHopLe = (data.taiKhoan || []).find(item => (
                item.soDienThoai === values.soDienThoai && item.matKhau === values.matKhau
            ));

            if (!taiKhoanHopLe) {
                message.error('Số điện thoại hoặc mật khẩu không đúng');
                return;
            }

            localStorage.setItem(AUTH_KEY, '1');
            localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify({
                id: taiKhoanHopLe.id,
                hoTen: taiKhoanHopLe.hoTen,
                soDienThoai: taiKhoanHopLe.soDienThoai,
                vaiTro: taiKhoanHopLe.vaiTro || 'ubnd_xa',
                tenAp: taiKhoanHopLe.tenAp || '',
            }));
            setVaiTro(taiKhoanHopLe.vaiTro || 'ubnd_xa');
            setTenAp(taiKhoanHopLe.tenAp || '');
            message.success(`Đăng nhập thành công với số điện thoại ${values.soDienThoai}`);
            navigate('/trang-chu', { replace: true });
        } catch (error) {
            message.error('Không thể đăng nhập lúc này');
        } finally {
            setDangXuLy(false);
        }
    };

    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
                background: 'radial-gradient(circle at top, #e0f2fe 0%, #f8fafc 35%, #ffffff 100%)',
            }}
        >
            <Row gutter={[24, 24]} style={{ width: '100%', maxWidth: 1100, alignItems: 'center' }}>
                <Col xs={24} lg={12}>
                    <div style={{ paddingRight: 24 }}>
                        <Text style={{ color: '#16a34a', fontWeight: 700, letterSpacing: '0.08em' }}>ZALO MINI</Text>
                        <Title level={1} style={{ marginTop: 8, marginBottom: 12 }}>
                            Đăng nhập để quản lý dữ liệu theo vai trò
                        </Title>
                        <Text type="secondary" style={{ fontSize: 16, lineHeight: 1.7 }}>
                            Sử dụng số điện thoại và mật khẩu để vào hệ thống. Sau khi đăng nhập, bạn sẽ được chuyển đến màn hình quản trị tương ứng.
                        </Text>
                    </div>
                </Col>
                <Col xs={24} lg={12}>
                    <Card
                        bordered={false}
                        style={{
                            borderRadius: 24,
                            boxShadow: '0 24px 80px rgba(15, 23, 42, 0.12)',
                        }}
                    >
                        <Title level={3} style={{ marginTop: 0 }}>
                            Đăng nhập
                        </Title>
                        <Form layout="vertical" onFinish={xuLyDangNhap} requiredMark={false}>
                            <Form.Item
                                label="Số điện thoại"
                                name="soDienThoai"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập số điện thoại' },
                                    { pattern: /^[0-9]{9,11}$/, message: 'Số điện thoại phải có 9 - 11 chữ số' },
                                ]}
                            >
                                <Input size="large" placeholder="Ví dụ: 0901123456" />
                            </Form.Item>
                            <Form.Item
                                label="Mật khẩu"
                                name="matKhau"
                                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
                            >
                                <Input.Password size="large" placeholder="Nhập mật khẩu" />
                            </Form.Item>
                            <Button
                                htmlType="submit"
                                type="primary"
                                size="large"
                                block
                                loading={dangXuLy}
                                style={{ backgroundColor: '#16a34a', borderColor: '#16a34a' }}
                            >
                                Đăng nhập
                            </Button>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default DangNhap;