import React from 'react';
import '../css/Header.css';
import Menu from "@/components/Menu";

interface HeaderProps {
    wallet: any
}

const PageHeader: React.FC<HeaderProps> = ({wallet}) => {
    return (
        <div className="header">
            <header className="page-header">
                <div className="header-content"></div>
            </header>
            <div className="menu">
                <Menu wallet={wallet}/>
            </div>
        </div>

    );
};

export default PageHeader;
