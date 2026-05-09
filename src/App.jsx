import { Layout } from 'antd'
import HeaderZalo from './components/HeaderZalo'
import SideBar from './components/SideBar'
import HoGiaDinh from './components/HoGiaDinh'

const {Content} = Layout;
function Zalo() {
    return (
        <Layout style={{minHeight: "100vh"}}>
            <HeaderZalo></HeaderZalo>
            <Layout>
                <SideBar></SideBar>
                <Content style={{padding:'50px', backgroundColor:'white'}}>
                    <HoGiaDinh></HoGiaDinh>
                </Content>
            </Layout>
        </Layout>
    );
}
export default Zalo;