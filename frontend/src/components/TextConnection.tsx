import React from "react";

interface Props {
    wallet: any
}

const TextConnection: React.FC<Props> = ({wallet}) => {

    const walletAddress = wallet?.details.account ? wallet?.details.account : "";
    return (
        <div>
            <span className="text-connected">
                Connected: {walletAddress.substring(0, 6)}...{walletAddress.substring(38)}
            </span>
        </div>
    );
};

export default TextConnection;
