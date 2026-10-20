import {useState} from 'react';
import {Outlet} from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
export default function MainLayout(){const [menu,setMenu]=useState(false);return <div className="app-shell"><Header onMenu={()=>setMenu(true)}/><div className="app-body"><Sidebar/>{menu&&<div className="mobile-drawer"><div className="drawer-backdrop" onClick={()=>setMenu(false)}></div><Sidebar mobile onNavigate={()=>setMenu(false)}/></div>}<main className="page-area"><Outlet/></main></div></div>}
