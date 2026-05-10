import { Layout,Menu } from 'antd'
import { HomeOutlined, MessageOutlined, BarChartOutlined, ReadOutlined, CalendarOutlined } from '@ant-design/icons'

const { Sider } = Layout;
const SideBar = () => {
    const Items = [
        { key: '1', icon: <HomeOutlined></HomeOutlined>, label: 'Hộ Gia Đình & Nhân Khẩu' },
        { key: '2', icon: <MessageOutlined></MessageOutlined>, label: 'Điều Phối & Kiến Nghị' },
        { key: '3', icon: <BarChartOutlined></BarChartOutlined>, label: 'Nhiệm Vụ & Báo Cáo' },
        { key: '4', icon: <ReadOutlined></ReadOutlined>, label: 'Tin Tức' },
        { key: '5', icon: <CalendarOutlined></CalendarOutlined>, label: 'Lịch Sinh Hoạt' }
    ]
    return (
        <Sider width={250} breakpoint="lg" collapsedWidth="0">
            <Menu mode="inline" items={Items} style={{height:'100%'}}>
            </Menu>
        </Sider>
    );
}
export default SideBar;