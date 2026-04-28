import React, { useState, useEffect } from 'react';
import { Avatar, Stack, IconButton, Tooltip } from '@mui/material';
import {
  HomeOutlined,
  RoomOutlined,
  GrassOutlined,
  Inventory2Outlined,
  AccountBalanceWalletOutlined,
  BarChartOutlined,
  DescriptionOutlined,
  SettingsOutlined,
  WbSunnyOutlined,
  NightlightOutlined,
  AccountCircleOutlined,
  AdminPanelSettings,

} from '@mui/icons-material';
import styles from '../../contexts/styles/BarSide.module.css';
import { useNavigate, useLocation } from 'react-router-dom';
import WaterIcon from '@mui/icons-material/Water';
import { useAuth } from "../../contexts/AuthContext"
import CompostIcon from '@mui/icons-material/Compost';
import { fetchUserById } from '../../services/api';
import { useTheme } from '../../contexts/ThemeContext';
import LogoutIcon from '@mui/icons-material/Logout';
const routeMap = {
  'Utilisateur': '/user',
  'Fermes': '/farm',
  'Tableau de bord': '/board',
  'Cultures': '/informationsProduit',
  'Irrigation': '/irrigation',
  'Fertilisation': '/fertilisation',
  'Recommandations': '/recommandation',
  'Rapports': '/report',
  'Paramètres': '/setting',
  'Admin': '/admin',
};


const BarSide = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode } = useTheme();
  const { logout } = useAuth();
  const currentPath = location.pathname;
  const currentLabel = Object.keys(routeMap).find(label => routeMap[label] === currentPath);

  const getActiveItem = (path) => {
    if (path.startsWith('/user')) return 'Utilisateur';
    if (path.startsWith('/board')) return 'Tableau de bord';
    if (path === '/') return 'Fermes';
    if (path.startsWith('/informationsProduit')) return 'Cultures';
    // if (path.startsWith('/irrigation')) return 'Irrigation';
    // if (path.startsWith('/fertilisation')) return 'Fertilisation';
    if (path.startsWith('/recommandation')) return 'Recommandations';
    if (path.startsWith('/report')) return 'Rapports';
    if (path.startsWith('/setting')) return 'Paramètres';
    if (path.startsWith('/admin')) return 'Admin';
    return 'Fermes'; // fallback
  };

  const activeItem = getActiveItem(location.pathname);
  const [user, setUser] = useState({});
  const [error, setError] = useState(null);
  const loadData = async () => {
    const user_Id = localStorage.getItem('userId');
    //const userId="688c8e69740a34910a1029fa";
    if (!user_Id) {
      setError("Aucun ID utilisateur trouvé");
      return;
    }

    try {
      const userData = await fetchUserById(user_Id);
      //const userData =await fetchUserById("688c8e69740a34910a1029fa");
      // Mettre à jour formData avec les infos de l'utilisateur
      setUser({
        id: localStorage.getItem('userId') || '',
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        age: userData.age?.toString() || '',
        address: userData.address || '',
        id: userData._id || '',
        email: userData.email || '',
        phone: userData.phone || '',
        location: userData.location || '',
        createdAt: userData.createdAt || "2023-07-30T12:00:00Z",
        userRole:userData.userRole || 'USER'
      });
    } catch (err) {
      setError(err.message || "Erreur lors du chargement de l'utilisateur");
    }
  };
  useEffect(() => {
    loadData();
  }, []);


  const nom = user.firstName;
  const email = user.email;

  const items = user.userRole=="USER"?[
    { icon: <AccountCircleOutlined />, label: 'Utilisateur' },
    { icon: <HomeOutlined />, label: 'Tableau de bord' },
    { icon: <RoomOutlined />, label: 'Fermes' },
    { icon: <GrassOutlined />, label: 'Cultures' },
    // { icon: <WaterIcon />, label: 'Irrigation' },
    // { icon: <CompostIcon />, label: 'Fertilisation' },
    { icon: <BarChartOutlined />, label: 'Recommandations' },
    { icon: <DescriptionOutlined />, label: 'Rapports' },
    { icon: <SettingsOutlined />, label: 'Paramètres' },
  ]:[
    { icon: <AccountCircleOutlined />, label: 'Utilisateur' },
    { icon: <HomeOutlined />, label: 'Tableau de bord' },
    { icon: <RoomOutlined />, label: 'Fermes' },
    { icon: <GrassOutlined />, label: 'Cultures' },
    // { icon: <WaterIcon />, label: 'Irrigation' },
    // { icon: <CompostIcon />, label: 'Fertilisation' },
    { icon: <BarChartOutlined />, label: 'Recommandations' },
    { icon: <DescriptionOutlined />, label: 'Rapports' },
    { icon: <SettingsOutlined />, label: 'Paramètres' },
    { icon: <AdminPanelSettings/>, label: 'Admin'}
  ];


  const handleItemClick = (label) => {
    const path = routeMap[label];
    if (path) navigate(path);
    else console.log("Pas de route définie pour :", label);
  };



  return (
    <div className={`${styles.sidebar} ${darkMode ? styles.dark : ''}`}>
      <div className={styles.sidebarlogo}>
        <span className={styles.logoicon}>🌿</span>
        <h3>E-FARM</h3>
      </div>

      <div className={styles.sidebarcontent}>
        {items.map((item, index) => (
          <div
            key={index}
            className={`${styles.sidebaritem} ${activeItem === item.label ? styles.active : ''}`}
            onClick={() => handleItemClick(item.label)}
          >
            <div className={styles.sidebaricon}>{item.icon}</div>
            <span>{item.label}</span>
          </div>
        ))}
        <div onClick={logout} className={`${styles.sidebaritem}`}>
          <div className={styles.sidebaricon}>
            <LogoutIcon  style={{ cursor: "pointer" }} />
          </div>
          <span>Déconnexion</span>
        </div>
      </div>

      <div className={styles.sidebarfooter}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Avatar>
            <AccountCircleOutlined />
          </Avatar>
          <div className={styles.userinfo}>
            <p className={styles.username}>{nom}</p>
            <p className={styles.useremail}>{email}</p>
          </div>
        </Stack>
      </div>
    </div>
  );
};

export default BarSide;
