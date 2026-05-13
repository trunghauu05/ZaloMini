import { Layout, Button, Space, Avatar, Typography, Grid } from 'antd'
import {UserOutlined} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useVaiTro } from '../context/VaiTroContext';

const {Text} = Typography;
const { Header } = Layout;
const { useBreakpoint } = Grid;
const HeaderZalo = () => {
  const screens = useBreakpoint();
  const navigate = useNavigate();
  const { vaiTro, tenAp, vaiTroLabel } = useVaiTro();

  const xuLyDangXuat = () => {
    localStorage.removeItem('zalomini_logged_in');
    localStorage.removeItem('zalomini_active_account');
    localStorage.removeItem('zalomini_role');
    localStorage.removeItem('zalomini_tenAp');
    navigate('/dang-nhap', { replace: true });
  };

  return (
    <Header style={{ backgroundColor: 'blue', display: 'flex', alignItems: 'center', justifyContent: 'space-between',padding: screens.xs ? '0 15px' : '0 50px'}}>
      <div style={{ fontWeight: 'bold', fontSize: screens.xs ? '18px' : '25px', color: 'white' }}>Zalo mini</div>
      <Space>
        <Space direction="vertical" size={0} style={{ color: 'white', lineHeight: 1.2, textAlign: 'right' }}>
          <Text style={{ color: 'white', fontSize: screens.xs ? '12px' : '14px' }}>Vai trò: {vaiTroLabel}</Text>
          {vaiTro !== 'ubnd_xa' && (
            <Text style={{ color: 'white', fontSize: screens.xs ? '12px' : '14px' }}>Ấp phụ trách: {tenAp || ''}</Text>
          )}
        </Space>
        <Avatar icon={<UserOutlined></UserOutlined>}></Avatar>
        <Button type="primary" onClick={xuLyDangXuat}>Đăng xuất</Button>
      </Space>
    </Header>
  );
}
export default HeaderZalo;