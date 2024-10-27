import React from 'react';
import {BrowserRouter as Router, NavLink, Route, Routes} from 'react-router-dom';
import Collections from './Collections';
import TextConnection from "@/components/TextConnection";
import '../css/Menu.css';
import Marketplace from "./Marketplace";
import UserCards from './UserCards';

interface Props {
    wallet: any
}

const Menu: React.FC<Props> = ({wallet}) => {
    return (
        <Router>
            <nav className="links">
                <div>
                    <NavLink to="/" className={(navData) => navData.isActive ? "active" : ""}>COLLECTIONS</NavLink>
                </div>
                <div>
                    <NavLink to="/user" className={(navData) => navData.isActive ? "active" : ""}> USER CARDS </NavLink>
                </div>
                <div>
                    <NavLink to="/marketplace"
                             className={(navData) => navData.isActive ? "active" : ""}>MARKETPLACE</NavLink>
                </div>
                <TextConnection wallet={wallet}/>
            </nav>
            <Routes>
                <Route path="/" element={<Collections wallet={wallet}/>}/>
                <Route path="/marketplace" element={<Marketplace wallet={wallet}/>}/>
                <Route path="/user" element={<UserCards wallet={wallet}/>}/>

            </Routes>
        </Router>
    );
};

export default Menu;
