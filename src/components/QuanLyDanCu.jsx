import { useEffect, useMemo, useState } from 'react';
import { Typography, Table, Select, InputNumber, Space, Button, Checkbox } from 'antd';

const { Title } = Typography;

const QuanLyDanCu = () => {
    const [danhsach, setDanhsach] = useState([]);
    const [loading, setLoading] = useState(true);
    const [gioiTinhFilter, setGioiTinhFilter] = useState(null);
    const [dienFilter, setDienFilter] = useState(null);
    const [namTinhTuoi, setNamTinhTuoi] = useState(null);
    const [tuoiMin, setTuoiMin] = useState(null);
    const [tuoiMax, setTuoiMax] = useState(null);
    const [nvqsEnabled, setNvqsEnabled] = useState(false);

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

    const danhSachLoc = useMemo(() => {
        return danhsach.filter(item => {
            if (gioiTinhFilter && item.gioiTinh !== gioiTinhFilter) return false;
            if (dienFilter && item.dien !== dienFilter) return false;

            const tuoi = tinhTuoi(item.ngaySinh, namTinhTuoi);
            if (tuoiMin !== null && tuoi !== '' && tuoi < tuoiMin) return false;
            if (tuoiMax !== null && tuoi !== '' && tuoi > tuoiMax) return false;

            if (nvqsEnabled) {
                const namSinh = layNamSinh(item.ngaySinh);
                if (!namSinh) return false;
                const tuoiNvqs = tinhTuoi(item.ngaySinh, namTinhTuoi);
                if (item.gioiTinh !== 'Nam') return false;
                if (tuoiNvqs < 18 || tuoiNvqs > 27) return false;
            }

            return true;
        });
    }, [danhsach, gioiTinhFilter, dienFilter, namTinhTuoi, tuoiMin, tuoiMax, nvqsEnabled]);

    const cotDanhSach = [
        { title: 'Mã hộ', dataIndex: 'maHo', key: 'maHo', width: 90 },
        {
            title: 'Tên ấp',
            dataIndex: 'tenAp',
            key: 'tenAp',
            width: 140,
            render: (text) => text || 'Chưa cập nhật'
        },
        { title: 'Họ tên', dataIndex: 'hoTen', key: 'hoTen', width: 180 },
        { title: 'CCCD', dataIndex: 'cccd', key: 'cccd', width: 140 },
        { title: 'Ngày sinh', dataIndex: 'ngaySinh', key: 'ngaySinh', width: 120 },
        {
            title: 'Tuổi',
            key: 'tuoi',
            width: 70,
            render: (text, record) => tinhTuoi(record.ngaySinh, namTinhTuoi)
        },
        { title: 'Giới tính', dataIndex: 'gioiTinh', key: 'gioiTinh', width: 100 },
        { title: 'Diện', dataIndex: 'dien', key: 'dien', width: 160 },
        { title: 'SĐT', dataIndex: 'soDienThoai', key: 'soDienThoai', width: 120 },
        {
            title: 'Tình trạng cư trú',
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
                <Space>
                    <Checkbox checked={nvqsEnabled} onChange={event => setNvqsEnabled(event.target.checked)}>
                        NVQS
                    </Checkbox>
                </Space>
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
                    setNvqsEnabled(false);
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
                scroll={{ x: 1250 }}
                style={{ marginTop: '16px' }}
            />
        </div>
    );
};

export default QuanLyDanCu;
