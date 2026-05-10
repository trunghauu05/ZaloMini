import { useState, useEffect } from 'react';
import { Typography, Spin, Row, Col, Space, Button, Tag } from 'antd';
import BoLoc from './BoLoc';
import ChitietHoGiaDinh from './ChitietHoGiaDinh';

const { Title } = Typography;

const HoGiaDinh = () => {
    const [danhsach, setDanhsach] = useState([]);
    const [loading, setLoading] = useState(true);

    const [modalopen, setModalopen] = useState(false);
    const [nguoichon, setNguoichon] = useState(null);
    const [thanhVienHo, setThanhVienHo] = useState([]);

    useEffect(() => {
        fetch('/api/db.json')
            .then(res => {
                if (!res.ok) throw new Error(`không lấy được dữ liệu: ${res.status}`);
                return res.json();
            })
            .then(data => setDanhsach(data.nhanKhau))
            .catch(err => console.error('loi roi', err))
            .finally(() => setLoading(false));
    }, []);

    const xemChiTiet = (nguoi) => {
        setNguoichon(nguoi);
        const nhungNguoiCungHo = danhsach.filter(item => item.maHo === nguoi.maHo);

        // Ép Chủ hộ lên đầu
        const danhSachSapXep = nhungNguoiCungHo.sort((a, b) => {
            if (a.quanHe === 'Chủ hộ') return -1;
            if (b.quanHe === 'Chủ hộ') return 1;
            return 0;
        });

        setThanhVienHo(danhSachSapXep);
        setModalopen(true);
    };

    const dongChiTiet = () => {
        setModalopen(false);
        setNguoichon(null);
        setThanhVienHo([]);
    };


    const danhsachhogiadinh = [];
    const cacmaho = [...new Set(danhsach.map(item => item.maHo))];

    cacmaho.forEach(ma => {
        const nguoicungho = danhsach.filter(n => n.maHo === ma);
        const cacchuho = nguoicungho.filter(n => n.quanHe === 'Chủ hộ');

        let chuhodaidien;
        let canhbao = null;


        if (cacchuho.length > 1) {
            chuhodaidien = cacchuho[0];
            canhbao = `Có ${cacchuho.length} Chủ hộ`;
        } else if (cacchuho.length === 1) {
            chuhodaidien = cacchuho[0];

        } else {
            chuhodaidien = nguoicungho[0];
            canhbao = 'Chưa có Chủ hộ';
        }
        danhsachhogiadinh.push({
            ...chuhodaidien, soNhanKhau: nguoicungho.length, canhBao: canhbao
        })
    });

    return (
        <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px' }}>
            <Title level={2}>Danh sách Hộ Gia Đình & Nhân Khẩu</Title>
            <BoLoc danhsach={danhsach} />
            {loading ? (
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <Spin size="large"></Spin>
                </div>
            ) : (
                <div style={{ marginTop: '20px' }}>
                    <Row style={{ fontWeight: 'bold', backgroundColor: 'white', borderBottom: '1px solid rgb(50, 50, 51)', padding: '20px 8px' }}>
                        <Col span={3}>Mã Hộ</Col>
                        <Col span={4}>Họ và Tên Chủ Hộ</Col>
                        <Col span={3}>CCCD/CMND</Col>
                        <Col span={2}>Nhân Khẩu</Col>
                        <Col span={3}>Số Điện Thoại</Col>
                        <Col span={2}>Giới tính</Col>
                        <Col span={3}>Diện Chính Sách</Col>
                        <Col span={2}>Chi tiết</Col>
                        <Col span={2}>Hành động</Col>
                    </Row>

                    {danhsachhogiadinh.map((nguoi, index) => {
                        const soNhanKhau = danhsach.filter(item => item.maHo === nguoi.maHo).length;
                        return (
                            <Row key={nguoi.id || index} style={{ padding: '20px 8px', borderBottom: '1px solid rgb(50, 50, 51)', alignItems: 'center' }} >
                                <Col span={3}><b>{nguoi.maHo}</b>
                                    {nguoi.canhBao && (
                                        <Tag color="error" style={{ marginTop: '4px', fontSize: '10px' }}>
                                            {nguoi.canhBao}
                                        </Tag>
                                    )}
                                </Col>
                                <Col span={4}><b>{nguoi.hoTen}</b></Col>
                                <Col span={3}><b>{nguoi.cccd}</b></Col>
                                <Col span={2}><b>{soNhanKhau} người</b></Col>
                                <Col span={3}><b>{nguoi.soDienThoai}</b></Col>
                                <Col span={2}><b>{nguoi.gioiTinh}</b></Col>
                                <Col span={3}><b>{nguoi.dien}</b></Col>
                                <Col span={2}>
                                    <Space>
                                        <Button type="primary" onClick={() => xemChiTiet(nguoi)} size="small">Chi tiết</Button>
                                    </Space>
                                </Col>
                                <Col span={2}>
                                    <Space>
                                        <Button type="primary" size="small">Sửa</Button>
                                        <Button danger size="small">Xóa</Button>
                                    </Space>
                                </Col>
                            </Row>
                        );
                    })}
                </div>
            )}
            <ChitietHoGiaDinh
                open={modalopen}
                onClose={dongChiTiet}
                maHo={nguoichon?.maHo}
                thanhVienHo={thanhVienHo}
            />
        </div>
    );
}

export default HoGiaDinh;