import { Layout, Button, Space, Avatar, Typography} from 'antd'
import {UserOutlined} from '@ant-design/icons';

const {Text} = Typography;
const { Header } = Layout;
const HeaderZalo = () => {

  return (
    <Header style={{ backgroundColor: 'blue', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ fontWeight: 'bold', fontSize: '25px', color: 'white' }}>Zalo mini</div>
      <Space>
        <Text style={{color: 'white'}}>Trưởng ấp</Text>
        <Avatar icon={<UserOutlined></UserOutlined>}></Avatar>
        <Button type="primary">Đăng Nhập</Button>
      </Space>
      
    </Header>
  );
}
export default HeaderZalo;