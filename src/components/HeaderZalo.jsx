import { Layout, Button, Space, Avatar, Typography,Grid} from 'antd'
import {UserOutlined} from '@ant-design/icons';

const {Text} = Typography;
const { Header } = Layout;
const { useBreakpoint } = Grid;
const HeaderZalo = () => {
  const screens = useBreakpoint();

  return (
    <Header style={{ backgroundColor: 'blue', display: 'flex', alignItems: 'center', justifyContent: 'space-between',padding: screens.xs ? '0 15px' : '0 50px'}}>
      <div style={{ fontWeight: 'bold', fontSize: screens.xs ? '18px' : '25px', color: 'white' }}>Zalo mini</div>
      <Space>
        {!screens.xs &&<Text style={{color: 'white'}}>Trưởng ấp</Text>}
        <Avatar icon={<UserOutlined></UserOutlined>}></Avatar>
        <Button type="primary">Đăng Nhập</Button>
      </Space>
    </Header>
  );
}
export default HeaderZalo;