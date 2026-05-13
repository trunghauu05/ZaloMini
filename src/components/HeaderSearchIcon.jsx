import { useEffect, useState } from 'react';
import { Button, Input, Popover, Space, Typography } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Text } = Typography;

const HeaderSearchIcon = ({
    label,
    field,
    value,
    onSearch,
    onClear,
}) => {
    const [open, setOpen] = useState(false);
    const [keyword, setKeyword] = useState(value || '');

    useEffect(() => {
        if (open) {
            setKeyword(value || '');
        }
    }, [open, value]);

    const xacNhan = () => {
        onSearch(field, keyword.trim());
        setOpen(false);
    };

    const lamMoi = () => {
        setKeyword('');
        onClear(field);
        setOpen(false);
    };

    const noiDung = (
        <div style={{ width: 300 }}>
            <Text strong style={{ display: 'block', marginBottom: 12 }}>
                Tìm kiếm theo "{label}"
            </Text>
            <Input
                value={keyword}
                onChange={event => setKeyword(event.target.value)}
                placeholder="Nhập nội dung"
                allowClear
                onPressEnter={xacNhan}
            />
            <Space style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between' }}>
                <Button type="primary" onClick={xacNhan} style={{ minWidth: 86 }}>
                    Tìm
                </Button>
                <Button onClick={lamMoi} style={{ minWidth: 86 }}>
                    Làm mới
                </Button>
                <Button onClick={() => setOpen(false)} style={{ minWidth: 70 }}>
                    Đóng
                </Button>
            </Space>
        </div>
    );

    return (
        <Space size={6} align="center" style={{ width: '100%', justifyContent: 'space-between' }}>
            <span>{label}</span>
            <Popover
                trigger="click"
                placement="bottomRight"
                open={open}
                onOpenChange={setOpen}
                content={noiDung}
            >
                <Button type="text" size="small" icon={<SearchOutlined />} style={{ color: '#166534' }} />
            </Popover>
        </Space>
    );
};

export default HeaderSearchIcon;