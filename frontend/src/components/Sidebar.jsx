import {NavLink} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';
import Icon from './Icon';

const candidate=[['/dashboard','home','Home'],['/jobs','briefcase','Jobs'],['/applications','file','My Applications'],['/resume','file','My Resume'],['/profile','user','Profile'],['/settings','settings','Settings']];

const admin=[
  ['/admin','chart','Dashboard'],
  ['/admin/users','users','Users Management'],
  ['/admin/jobs','briefcase','Job Management'],
  ['/admin/applications','file','Application Management'],
  ['/admin/activity','activity','Activity Log'],
  ['/admin/settings','settings','Settings']
];

export default function Sidebar({mobile=false,onNavigate}){
 const {user}=useAuth(); const isAdmin=user?.role==='admin'; const items=isAdmin?admin:candidate;
 
 return (
   <aside className={`sidebar ${mobile?'sidebar-mobile':''}`}>
     <div className="sidebar-section">
       {isAdmin?<small>ADMIN PORTAL</small>:<small>CANDIDATE PORTAL</small>}
       {items.map(([to,icon,label])=>(
         <NavLink 
           key={to} 
           to={to} 
           end={to==='/dashboard'||to==='/admin'} 
           onClick={onNavigate} 
           className={({isActive})=>`nav-item ${isActive?'active':''}`}
         >
           <Icon name={icon}/>
           <span>{label}</span>
         </NavLink>
       ))}
     </div>
     <div className="sidebar-motto">
       <div className="leaf-art"><i></i><i></i><i></i><i></i></div>
       <b>{isAdmin?'Manage the future':'Build your future'}</b>
       <span>{isAdmin?'with every action.':'one application at a time.'}</span>
     </div>
   </aside>
 );
}