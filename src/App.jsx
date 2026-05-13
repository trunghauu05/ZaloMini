import { Layout } from 'antd'
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import './App.css'
import HeaderZalo from './components/HeaderZalo'
import SideBar from './components/SideBar'
import HoGiaDinh from './components/HoGiaDinh'
import QuanLyDanCu from './components/QuanLyDanCu'
import QuanLyAp from './components/QuanLyAp'
import VaiTro from './components/VaiTro'
import QuanLyTaiKhoan from './components/QuanLyTaiKhoan'
import DangNhap from './components/DangNhap'
import { VaiTroProvider } from './context/VaiTroContext'

const {Content} = Layout;

const AUTH_KEY = 'zalomini_logged_in';

const daDangNhap = () => localStorage.getItem(AUTH_KEY) === '1';

const MainLayout = () => {
    if (!daDangNhap()) {
        return <Navigate to="/dang-nhap" replace />;
    }

    return (
        <Layout style={{minHeight: "100vh"}}>
            <HeaderZalo></HeaderZalo>
            <Layout>
                <SideBar></SideBar>
                <Content style={{padding:'20px', backgroundColor:'white',overflowX: 'hidden'}}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

function Zalo() {
    return (
        <VaiTroProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Navigate to="/dang-nhap" replace />} />
                    <Route path="/dang-nhap" element={<DangNhap />} />
                    <Route path="/trang-chu" element={<MainLayout />}>
                        <Route index element={<HoGiaDinh />} />
                        <Route path="quan-ly-dan-cu" element={<QuanLyDanCu />} />
                        <Route path="quan-ly-ap" element={<QuanLyAp />} />
                        <Route path="vai-tro" element={<VaiTro />} />
                        <Route path="quan-ly-tai-khoan" element={<QuanLyTaiKhoan />} />
                        <Route path="*" element={<Navigate to="/trang-chu" replace />} />
                    </Route>
                    <Route path="/quan-ly-dan-cu" element={<Navigate to="/trang-chu/quan-ly-dan-cu" replace />} />
                    <Route path="/quan-ly-ap" element={<Navigate to="/trang-chu/quan-ly-ap" replace />} />
                    <Route path="/vai-tro" element={<Navigate to="/trang-chu/vai-tro" replace />} />
                    <Route path="/quan-ly-tai-khoan" element={<Navigate to="/trang-chu/quan-ly-tai-khoan" replace />} />
                    <Route path="*" element={<Navigate to="/dang-nhap" replace />} />
                </Routes>
            </BrowserRouter>
        </VaiTroProvider>
    );
}
export default Zalo;