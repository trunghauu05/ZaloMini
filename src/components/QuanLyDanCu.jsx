import { useEffect, useMemo, useState } from 'react';
import { Typography, Table, Select, InputNumber, Space, Button } from 'antd';
import { useVaiTro } from '../context/VaiTroContext';
import HeaderSearchIcon from './HeaderSearchIcon';

const { Title } = Typography;

const QuanLyDanCu = () => {
    const [danhsach, setDanhsach] = useState([]);
    const [loading, setLoading] = useState(true);
    const { vaiTro, tenAp, vaiTroLabel } = useVaiTro();
    const [gioiTinhFilter, setGioiTinhFilter] = useState(null);
    const [dienFilter, setDienFilter] = useState(null);
    const [namTinhTuoi, setNamTinhTuoi] = useState(null);
    const [tuoiMin, setTuoiMin] = useState(null);
    const [tuoiMax, setTuoiMax] = useState(null);
    const [searchField, setSearchField] = useState('maHo');
    const [searchKeyword, setSearchKeyword] = useState('');

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

    const layNamSinh = (ngaySinh) => {
        if (!ngaySinh) return null;
        const parts = ngaySinh.split('/');
        if (parts.length !== 3) return null;
        const namSinh = Number.parseInt(parts[2], 10);
        return Number.isFinite(namSinh) ? namSinh : null;
    };

    const tinhTuoi = (ngaySinh, namTinh) => {
        if (!ngaySinh) return '';
        const namSinh = layNamSinh(ngaySinh);
        if (!namSinh) return '';
        const namThamChieu = namTinh || new Date().getFullYear();
        return namThamChieu - namSinh;
    };

    const dienOptions = useMemo(() => {
        return [...new Set(danhsach.map(item => item.dien).filter(Boolean))];
    }, [danhsach]);

    const danhSachTheoVaiTro = useMemo(() => {
        if (vaiTro === 'ubnd_xa') {
            return danhsach;
        }

        const tenApCanXem = tenAp.trim();
        if (!tenApCanXem) {
            return [];
        }

        return danhsach.filter(item => (item.tenAp || '').trim() === tenApCanXem);
    }, [danhsach, vaiTro, tenAp]);

    const danhSachLoc = useMemo(() => {
        const danhSachSauTimKiem = danhSachTheoVaiTro.filter(item => {
            const layGiaTri = () => {
                switch (searchField) {
                    case 'maHo': return item.maHo;
                    case 'tenAp': return item.tenAp;
                    case 'hoTen': return item.hoTen;
                    case 'cccd': return item.cccd;
                    case 'ngaySinh': return item.ngaySinh;
                    case 'tuoi': return tinhTuoi(item.ngaySinh, namTinhTuoi);
                    case 'gioiTinh': return item.gioiTinh;
                    case 'dien': return item.dien;
                    case 'soDienThoai': return item.soDienThoai;
                    case 'tinhTrang': return item.tinhTrang;
                    default: return '';
                }
            };

            const tuKhoa = searchKeyword.trim().toLowerCase();
            if (tuKhoa && !String(layGiaTri() ?? '').toLowerCase().includes(tuKhoa)) return false;

            if (gioiTinhFilter && item.gioiTinh !== gioiTinhFilter) return false;
            if (dienFilter && item.dien !== dienFilter) return false;

            const tuoi = tinhTuoi(item.ngaySinh, namTinhTuoi);
            if (tuoiMin !== null && tuoi !== '' && tuoi < tuoiMin) return false;
            if (tuoiMax !== null && tuoi !== '' && tuoi > tuoiMax) return false;

            return true;
        });
        return danhSachSauTimKiem;
    }, [danhSachTheoVaiTro, gioiTinhFilter, dienFilter, namTinhTuoi, tuoiMin, tuoiMax, searchField, searchKeyword]);

    const timKiemTheoCot = (field, keyword) => {
        setSearchField(field);
        setSearchKeyword(keyword);
    };

    const xoaTimKiemTheoCot = (field) => {
        setSearchField(field);
        setSearchKeyword('');
    };

    const cotDanhSach = [
        { title: <HeaderSearchIcon label="Mã hộ" field="maHo" value={searchField === 'maHo' ? searchKeyword : ''} onSearch={timKiemTheoCot} onClear={xoaTimKiemTheoCot} />, dataIndex: 'maHo', key: 'maHo', width: 90 },
        {
            title: <HeaderSearchIcon label="Tên ấp" field="tenAp" value={searchField === 'tenAp' ? searchKeyword : ''} onSearch={timKiemTheoCot} onClear={xoaTimKiemTheoCot} />,
            dataIndex: 'tenAp',
            key: 'tenAp',
            width: 140,
            render: (text) => text || 'Chưa cập nhật'
        },
        { title: <HeaderSearchIcon label="Họ tên" field="hoTen" value={searchField === 'hoTen' ? searchKeyword : ''} onSearch={timKiemTheoCot} onClear={xoaTimKiemTheoCot} />, dataIndex: 'hoTen', key: 'hoTen', width: 180 },
        { title: <HeaderSearchIcon label="CCCD" field="cccd" value={searchField === 'cccd' ? searchKeyword : ''} onSearch={timKiemTheoCot} onClear={xoaTimKiemTheoCot} />, dataIndex: 'cccd', key: 'cccd', width: 140 },
        { title: <HeaderSearchIcon label="Ngày sinh" field="ngaySinh" value={searchField === 'ngaySinh' ? searchKeyword : ''} onSearch={timKiemTheoCot} onClear={xoaTimKiemTheoCot} />, dataIndex: 'ngaySinh', key: 'ngaySinh', width: 120 },
        {
            title: <HeaderSearchIcon label="Tuổi" field="tuoi" value={searchField === 'tuoi' ? searchKeyword : ''} onSearch={timKiemTheoCot} onClear={xoaTimKiemTheoCot} />,
            key: 'tuoi',
            width: 70,
            render: (text, record) => tinhTuoi(record.ngaySinh, namTinhTuoi)
        },
        { title: <HeaderSearchIcon label="Giới tính" field="gioiTinh" value={searchField === 'gioiTinh' ? searchKeyword : ''} onSearch={timKiemTheoCot} onClear={xoaTimKiemTheoCot} />, dataIndex: 'gioiTinh', key: 'gioiTinh', width: 100 },
        { title: <HeaderSearchIcon label="Diện" field="dien" value={searchField === 'dien' ? searchKeyword : ''} onSearch={timKiemTheoCot} onClear={xoaTimKiemTheoCot} />, dataIndex: 'dien', key: 'dien', width: 160 },
        { title: <HeaderSearchIcon label="SĐT" field="soDienThoai" value={searchField === 'soDienThoai' ? searchKeyword : ''} onSearch={timKiemTheoCot} onClear={xoaTimKiemTheoCot} />, dataIndex: 'soDienThoai', key: 'soDienThoai', width: 120 },
        {
            title: <HeaderSearchIcon label="Tình trạng cư trú" field="tinhTrang" value={searchField === 'tinhTrang' ? searchKeyword : ''} onSearch={timKiemTheoCot} onClear={xoaTimKiemTheoCot} />,
            dataIndex: 'tinhTrang',
            key: 'tinhTrang',
            width: 150,
            render: (text) => (
                <Select defaultValue={text || 'Thường trú'} style={{ width: 140 }}>
                    <Select.Option value="Thường trú">Thường trú</Select.Option>
                    <Select.Option value="Chuyển đến">Chuyển đến</Select.Option>
                    <Select.Option value="Chuyển đi">Chuyển đi</Select.Option>
                </Select>
            )
        }
    ];

    return (
        <div style={{ backgroundColor: 'white', borderRadius: '8px' }}>
            <Title level={2}>Quản lí dân cư</Title>
            <div style={{ marginBottom: 16, color: '#6b7280' }}>
                Vai trò hiện tại: <b>{vaiTroLabel}</b>{vaiTro !== 'ubnd_xa' ? ` • Ấp phụ trách: ${tenAp || 'Chưa gán'}` : ' • Xem toàn bộ xã'}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', marginTop: '8px' }}>
                <span style={{ fontWeight: 600 }}>Bộ lọc:</span>
                <Select
                    placeholder="Giới tính"
                    allowClear
                    style={{ width: 140 }}
                    value={gioiTinhFilter}
                    onChange={value => setGioiTinhFilter(value || null)}
                >
                    <Select.Option value="Nam">Nam</Select.Option>
                    <Select.Option value="Nữ">Nữ</Select.Option>
                </Select>
                <Space>
                    <InputNumber
                        placeholder="Tuổi từ"
                        min={0}
                        style={{ width: 110 }}
                        value={tuoiMin}
                        onChange={value => setTuoiMin(value ?? null)}
                    />
                    <InputNumber
                        placeholder="Đến"
                        min={0}
                        style={{ width: 90 }}
                        value={tuoiMax}
                        onChange={value => setTuoiMax(value ?? null)}
                    />
                </Space>
                <InputNumber
                    placeholder="Năm tính tuổi"
                    min={1900}
                    max={2100}
                    style={{ width: 120 }}
                    value={namTinhTuoi}
                    onChange={value => setNamTinhTuoi(value ?? null)}
                />
                <Select
                    placeholder="Diện"
                    allowClear
                    style={{ minWidth: 180 }}
                    value={dienFilter}
                    onChange={value => setDienFilter(value || null)}
                    options={dienOptions.map(dien => ({ label: dien, value: dien }))}
                />
                <Button onClick={() => {
                    setGioiTinhFilter(null);
                    setDienFilter(null);
                    setNamTinhTuoi(null);
                    setTuoiMin(null);
                    setTuoiMax(null);
                }}>
                    Xóa lọc
                </Button>
            </div>
            <Table
                columns={cotDanhSach}
                dataSource={danhSachLoc}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
                tableLayout="fixed"
                scroll={{ x: 1250 }}
                style={{ marginTop: '16px' }}
            />
        </div>
    );
};

export default QuanLyDanCu;
