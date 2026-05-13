import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const ROLE_STORAGE_KEY = 'zalomini_role';
const AP_STORAGE_KEY = 'zalomini_tenAp';
const ACCOUNT_STORAGE_KEY = 'zalomini_active_account';

const VAI_TRO_MAC_DINH = 'ubnd_xa';

const VaiTroContext = createContext(null);

export const vaiTroOptions = [
    { value: 'ubnd_xa', label: 'UBND xã' },
    { value: 'truong_ap', label: 'Trưởng ấp' },
    { value: 'chi_bo', label: 'Chi bộ' },
    { value: 'to_truong', label: 'Tổ trưởng' },
];

export const getVaiTroLabel = (vaiTro) => {
    return vaiTroOptions.find(option => option.value === vaiTro)?.label || 'UBND xã';
};

export const VaiTroProvider = ({ children }) => {
    const taiKhoanHienTai = useMemo(() => {
        try {
            return JSON.parse(localStorage.getItem(ACCOUNT_STORAGE_KEY) || 'null');
        } catch {
            return null;
        }
    }, []);

    const [vaiTro, setVaiTroState] = useState(() => taiKhoanHienTai?.vaiTro || localStorage.getItem(ROLE_STORAGE_KEY) || VAI_TRO_MAC_DINH);
    const [tenAp, setTenApState] = useState(() => taiKhoanHienTai?.tenAp || localStorage.getItem(AP_STORAGE_KEY) || '');

    useEffect(() => {
        localStorage.setItem(ROLE_STORAGE_KEY, vaiTro);
    }, [vaiTro]);

    useEffect(() => {
        localStorage.setItem(AP_STORAGE_KEY, tenAp);
    }, [tenAp]);

    useEffect(() => {
        localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify({
            vaiTro,
            tenAp,
        }));
    }, [vaiTro, tenAp]);

    const value = useMemo(() => ({
        vaiTro,
        tenAp,
        setVaiTro: setVaiTroState,
        setTenAp: setTenApState,
        vaiTroLabel: getVaiTroLabel(vaiTro),
    }), [vaiTro, tenAp]);

    return <VaiTroContext.Provider value={value}>{children}</VaiTroContext.Provider>;
};

export const useVaiTro = () => {
    const context = useContext(VaiTroContext);
    if (!context) {
        throw new Error('useVaiTro phải được dùng bên trong VaiTroProvider');
    }
    return context;
};
