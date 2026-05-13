import { Layout,Menu } from 'antd'
import { HomeOutlined, MessageOutlined, BarChartOutlined, ReadOutlined, CalendarOutlined, UserOutlined, TeamOutlined, ApartmentOutlined, SafetyOutlined } from '@ant-design/icons'
import { Link, useLocation } from 'react-router-dom'

const { Sider } = Layout;
const SideBar = () => {
    const location = useLocation();
    const selectedKey = location.pathname === '/quan-ly-dan-cu'
        ? '2'
        : location.pathname === '/quan-ly-ap'
            ? '3-1'
            : location.pathname === '/vai-tro'
                ? '3-2'
                : location.pathname === '/quan-ly-tai-khoan'
                    ? '3-3'
                    : '1';
    const Items = [
        { key: '1', icon: <HomeOutlined></HomeOutlined>, label: <Link to="/">Hộ Gia Đình & Nhân Khẩu</Link> },
        { key: '2', icon: <UserOutlined></UserOutlined>, label: <Link to="/quan-ly-dan-cu">Quản lí dân cư</Link> },
        {
            key: '3',
            icon: <TeamOutlined></TeamOutlined>,
            label: 'Quản lí người dùng',
            children: [
                { key: '3-1', icon: <ApartmentOutlined></ApartmentOutlined>, label: <Link to="/quan-ly-ap">Quản lí ấp</Link> },
                { key: '3-2', icon: <SafetyOutlined></SafetyOutlined>, label: <Link to="/vai-tro">Vai trò</Link> },
                { key: '3-3', icon: <UserOutlined></UserOutlined>, label: <Link to="/quan-ly-tai-khoan">Quản lí tài khoản</Link> }
            ]
        },
        { key: '4', icon: <MessageOutlined></MessageOutlined>, label: 'Điều Phối & Kiến Nghị' },
        { key: '5', icon: <BarChartOutlined></BarChartOutlined>, label: 'Nhiệm Vụ & Báo Cáo' },
        { key: '6', icon: <ReadOutlined></ReadOutlined>, label: 'Tin Tức' },
        { key: '7', icon: <CalendarOutlined></CalendarOutlined>, label: 'Lịch Sinh Hoạt' }
    ]
    return (
        <Sider width={250} breakpoint="lg" collapsedWidth="0">
            <Menu mode="inline" items={Items} selectedKeys={[selectedKey]} defaultOpenKeys={['3']} style={{height:'100%'}}>
            </Menu>
        </Sider>
    );
}
export default SideBar;