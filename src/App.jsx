import { Layout } from 'antd'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import HeaderZalo from './components/HeaderZalo'
import SideBar from './components/SideBar'
import HoGiaDinh from './components/HoGiaDinh'
import QuanLyDanCu from './components/QuanLyDanCu'
import QuanLyAp from './components/QuanLyAp'
import VaiTro from './components/VaiTro'
import QuanLyTaiKhoan from './components/QuanLyTaiKhoan'

const {Content} = Layout;
function Zalo() {
    return (
        <BrowserRouter>
            <Layout style={{minHeight: "100vh"}}>
                <HeaderZalo></HeaderZalo>
                <Layout>
                    <SideBar></SideBar>
                    <Content style={{padding:'20px', backgroundColor:'white',overflowX: 'hidden'}}>
                        <Routes>
                            <Route path="/" element={<HoGiaDinh></HoGiaDinh>} />
                            <Route path="/quan-ly-dan-cu" element={<QuanLyDanCu></QuanLyDanCu>} />
                            <Route path="/quan-ly-ap" element={<QuanLyAp></QuanLyAp>} />
                            <Route path="/vai-tro" element={<VaiTro></VaiTro>} />
                            <Route path="/quan-ly-tai-khoan" element={<QuanLyTaiKhoan></QuanLyTaiKhoan>} />
                        </Routes>
                    </Content>
                </Layout>
            </Layout>
        </BrowserRouter>
    );
}
export default Zalo;