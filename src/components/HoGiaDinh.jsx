import { useState, useEffect } from 'react'
import { Typography, Spin, Row, Col, Space, Button } from 'antd'

const { Title } = Typography;
const HoGiaDinh = () => {
    const [danhsach, setDanhsach] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/db.json')
            .then(res => {
                if (!res.ok) {
                    throw new Error(`không lấy được dữ liệu: ${res.status}`);
                }
                return res.json();
            })
            .then(data => setDanhsach(data.nhanKhau))
            .catch(err => console.error('loi roi', err))
            .finally(() => {
                setLoading(false);
            });
    }, []);
    return (
        <div style={{ backgroundColor: 'white', borderRadius: '8px',padding: '20px' }}>
            <Title level={2}>Danh sách Hộ Gia Đình & Nhân Khẩu</Title>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <Spin size="large"></Spin>
                </div>
            ) : (
                <div style={{ marginTop:'20px'}}>
                    <Row style={{ fontWeight: 'bold', backgroundColor: 'white',borderBottom: '1px solid rgb(50, 50, 51)', padding: '20px 8px' }}>
                        <Col span={2}>Mã Hộ</Col>
                        <Col span={6}>Họ và Tên</Col>
                        <Col span={6}>CCCD/CMND</Col>
                        <Col span={3}>Giới tính</Col>
                        <Col span={3}>Diện</Col>
                        <Col span={2}>Chi tiết</Col>
                        <Col span={2}>Hành động</Col>
                    </Row>
                    {danhsach.map((nguoi, index) => (
                        <Row key={nguoi.id || index} style={{ padding: '20px 8px', borderBottom: '1px solid rgb(50, 50, 51)' }} >
                            <Col span={2}><b>{nguoi.maHo}</b></Col>
                            <Col span={6}><b>{nguoi.hoTen}</b></Col>
                            <Col span={6}><b>{nguoi.cccd}</b></Col>
                            <Col span={3}><b>{nguoi.gioiTinh}</b></Col>
                            <Col span={3}><b>{nguoi.dien}</b></Col>
                            <Col span={2}>
                            <Space>
                                <Button type="primary" size="small">Chi tiết</Button>
                            </Space>
                            </Col>
                            <Col span={2}>
                                <Space>
                                    <Button type="primary" size="small">Sửa</Button>
                                    <Button danger size="small">Xóa</Button>
                                </Space>
                            </Col>
                        </Row>
                    ))}
                </div>
            )}
        </div>
    );
}
export default HoGiaDinh;