import { useState, useEffect, useMemo } from 'react';
import { Typography, Spin, Row, Col, Space, Button, Tag, Empty } from 'antd';
import { PlusOutlined, EyeOutlined } from '@ant-design/icons';
import ChitietHoGiaDinh from './ChitietHoGiaDinh';
import HeaderSearchIcon from './HeaderSearchIcon';
import { useVaiTro } from '../context/VaiTroContext';

const { Title } = Typography;

const HoGiaDinh = () => {
    const [danhsach, setDanhsach] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalopen, setModalopen] = useState(false);
    const [nguoichon, setNguoichon] = useState(null);
    const [thanhVienHo, setThanhVienHo] = useState([]);
    const [searchField, setSearchField] = useState('maHo');
    const [searchKeyword, setSearchKeyword] = useState('');

    const { vaiTro, tenAp, vaiTroLabel } = useVaiTro();
    const coQuyenQuanLy = vaiTro === 'ubnd_xa' || vaiTro === 'truong_ap';

    useEffect(() => {
        fetch('/api/db.json')
            .then(res => {
                if (!res.ok) throw new Error(`không lấy được dữ liệu: ${res.status}`);
                return res.json();
            })
            .then(data => setDanhsach(data.nhanKhau || []))
            .catch(err => console.error('loi roi', err))
            .finally(() => setLoading(false));
    }, []);

    const danhSachCoTheXem = useMemo(() => {
        if (vaiTro === 'ubnd_xa') {
            return danhsach;
        }

        const tenApCanXem = tenAp.trim();
        if (!tenApCanXem) {
            return [];
        }

        return danhsach.filter(item => (item.tenAp || '').trim() === tenApCanXem);
    }, [danhsach, vaiTro, tenAp]);

    const danhsachhogiadinh = useMemo(() => {
        const ketQua = [];
        const cacmaho = [...new Set(danhSachCoTheXem.map(item => item.maHo))];

        cacmaho.forEach(ma => {
            const nguoicungho = danhSachCoTheXem.filter(n => n.maHo === ma);
            if (nguoicungho.length === 0) return;

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

            ketQua.push({
                ...chuhodaidien,
                soNhanKhau: nguoicungho.length,
                canhBao: canhbao,
            });
        });

        return ketQua;
    }, [danhSachCoTheXem]);

    const boLocTimKiem = useMemo(() => {
        const tuKhoa = searchKeyword.trim().toLowerCase();
        if (!tuKhoa) return danhsachhogiadinh;

        const layGiaTri = (nguoi) => {
            switch (searchField) {
                case 'maHo': return nguoi.maHo;
                case 'tenAp': return nguoi.tenAp;
                case 'hoTen': return nguoi.hoTen;
                case 'cccd': return nguoi.cccd;
                case 'soNhanKhau': return nguoi.soNhanKhau;
                case 'soDienThoai': return nguoi.soDienThoai;
                case 'gioiTinh': return nguoi.gioiTinh;
                case 'dien': return nguoi.dien;
                default: return '';
            }
        };

        return danhsachhogiadinh.filter(nguoi => String(layGiaTri(nguoi) ?? '').toLowerCase().includes(tuKhoa));
    }, [danhsachhogiadinh, searchField, searchKeyword]);

    const timKiemTheoCot = (field, keyword) => {
        setSearchField(field);
        setSearchKeyword(keyword);
    };

    const xoaTimKiemTheoCot = (field) => {
        setSearchField(field);
        setSearchKeyword('');
    };

    const xemChiTiet = (nguoi) => {
        if (!nguoi) return;

        setNguoichon(nguoi);
        const nhungNguoiCungHo = danhSachCoTheXem.filter(item => item.maHo === nguoi.maHo);

        const danhSachSapXep = [...nhungNguoiCungHo].sort((a, b) => {
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

    return (
        <div style={{ backgroundColor: 'white', borderRadius: '8px' }}>
            {modalopen ? (
                <ChitietHoGiaDinh
                    onBack={dongChiTiet}
                    maHo={nguoichon?.maHo}
                    tenAp={nguoichon?.tenAp}
                    thanhVienHo={thanhVienHo}
                    coQuyenQuanLy={coQuyenQuanLy}
                />
            ) : (
                <>
                    <Title level={2}>Danh sách Hộ Gia Đình & Nhân Khẩu</Title>
                    <div style={{ marginBottom: 16, color: '#6b7280' }}>
                        Vai trò hiện tại: <b>{vaiTroLabel}</b>{vaiTro !== 'ubnd_xa' ? ` • Ấp phụ trách: ${tenAp || 'Chưa gán'}` : ' • Xem toàn bộ ấp và hộ'}
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '50px' }}>
                            <Spin size="large"></Spin>
                        </div>
                    ) : (
                        <div style={{ marginTop: '20px' }}>
                            {coQuyenQuanLy && (
                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
                                    <Button type="primary" icon={<PlusOutlined />} style={{ backgroundColor: '#22c55e', borderColor: '#22c55e' }}>
                                        Thêm
                                    </Button>
                                </div>
                            )}

                            <div style={{ overflowX: 'auto' }}>
                                <div style={{ minWidth: '1450px' }} className="ho-gia-dinh-table">
                                    <Row style={{ fontWeight: 'bold', backgroundColor: 'white', borderBottom: '1px solid rgb(50, 50, 51)', padding: '20px 8px', gap: 0, alignItems: 'center' }}>
                                        <Col span={2}>
                                            <HeaderSearchIcon label="Mã Hộ" field="maHo" value={searchField === 'maHo' ? searchKeyword : ''} onSearch={timKiemTheoCot} onClear={xoaTimKiemTheoCot} />
                                        </Col>
                                        <Col span={3}>
                                            <HeaderSearchIcon label="Tên ấp" field="tenAp" value={searchField === 'tenAp' ? searchKeyword : ''} onSearch={timKiemTheoCot} onClear={xoaTimKiemTheoCot} />
                                        </Col>
                                        <Col span={4}>
                                            <HeaderSearchIcon label="Họ và Tên Chủ Hộ" field="hoTen" value={searchField === 'hoTen' ? searchKeyword : ''} onSearch={timKiemTheoCot} onClear={xoaTimKiemTheoCot} />
                                        </Col>
                                        <Col span={3}>
                                            <HeaderSearchIcon label="CCCD/CMND" field="cccd" value={searchField === 'cccd' ? searchKeyword : ''} onSearch={timKiemTheoCot} onClear={xoaTimKiemTheoCot} />
                                        </Col>
                                        <Col span={2}>
                                            <HeaderSearchIcon label="Nhân Khẩu" field="soNhanKhau" value={searchField === 'soNhanKhau' ? searchKeyword : ''} onSearch={timKiemTheoCot} onClear={xoaTimKiemTheoCot} />
                                        </Col>
                                        <Col span={2}>
                                            <HeaderSearchIcon label="Số Điện Thoại" field="soDienThoai" value={searchField === 'soDienThoai' ? searchKeyword : ''} onSearch={timKiemTheoCot} onClear={xoaTimKiemTheoCot} />
                                        </Col>
                                        <Col span={2}>
                                            <HeaderSearchIcon label="Giới tính" field="gioiTinh" value={searchField === 'gioiTinh' ? searchKeyword : ''} onSearch={timKiemTheoCot} onClear={xoaTimKiemTheoCot} />
                                        </Col>
                                        <Col span={3}>
                                            <HeaderSearchIcon label="Diện Chính Sách" field="dien" value={searchField === 'dien' ? searchKeyword : ''} onSearch={timKiemTheoCot} onClear={xoaTimKiemTheoCot} />
                                        </Col>
                                        <Col span={1}>Chi tiết</Col>
                                        <Col span={2}>Hành động</Col>
                                    </Row>

                                    {boLocTimKiem.length === 0 ? (
                                        <div style={{ padding: '24px 0' }}>
                                            <Empty description={vaiTro === 'ubnd_xa' ? 'Chưa có dữ liệu hộ gia đình' : 'Không có hộ gia đình thuộc ấp này'} />
                                        </div>
                                    ) : boLocTimKiem.map((nguoi, index) => {
                                        const soNhanKhau = nguoi.soNhanKhau;

                                        return (
                                            <Row key={nguoi.id || index} style={{ padding: '20px 8px', borderBottom: '1px solid rgb(50, 50, 51)', alignItems: 'center', gap: 0 }}>
                                                <Col span={2}>
                                                    <b>{nguoi.maHo}</b>
                                                    {nguoi.canhBao && (
                                                        <Tag color="error" style={{ marginTop: '4px', fontSize: '10px' }}>
                                                            {nguoi.canhBao}
                                                        </Tag>
                                                    )}
                                                </Col>
                                                <Col span={3}><b>{nguoi.tenAp || 'Chưa cập nhật'}</b></Col>
                                                <Col span={4}><b>{nguoi.hoTen}</b></Col>
                                                <Col span={3}><b>{nguoi.cccd}</b></Col>
                                                <Col span={2}><b>{soNhanKhau} người</b></Col>
                                                <Col span={2}><b>{nguoi.soDienThoai}</b></Col>
                                                <Col span={2}><b>{nguoi.gioiTinh}</b></Col>
                                                <Col span={3}><b>{nguoi.dien}</b></Col>
                                                <Col span={1} style={{ display: 'flex', justifyContent: 'center' }}>
                                                    <Space>
                                                        <Button type="primary" onClick={() => xemChiTiet(nguoi)} size="small" icon={<EyeOutlined />} />
                                                    </Space>
                                                </Col>
                                                <Col span={2} style={{ display: 'flex', justifyContent: 'center' }}>
                                                    <Space wrap style={{ justifyContent: 'center' }}>
                                                        {coQuyenQuanLy ? (
                                                            <>
                                                                <Button type="primary" size="small">Sửa</Button>
                                                                <Button danger size="small">Xóa</Button>
                                                            </>
                                                        ) : (
                                                            <span style={{ color: '#9ca3af' }}>Không có quyền</span>
                                                        )}
                                                    </Space>
                                                </Col>
                                            </Row>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default HoGiaDinh;