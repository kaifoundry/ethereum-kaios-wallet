import React from 'react';
import NewUserCard from '../../components/NeWUserCard/NewUserCard';
import "./NewUser.scss";

const NewUser = () => {
    
  return (
    <div className='new-user-screen'>
        <div className="main-heading">New to <span className='brand-name'>Ethereum Wallet?</span></div>
        <NewUserCard
            heading="Yes, Let's get set up!"
            msg="*This will create a new wallet and Secret Recovery Phrase"
            navigation="/create-password/:false"
            btnName="Create Wallet"
            tabIndex={0}
        />
        <NewUserCard
            heading="No, I already have a Secret Recovery Phrase"
            msg="*Import your existing wallet using a secret Recovery Phrase"
            navigation="/create-password/:true"
            btnName="Import Wallet"
            tabIndex={1}
        />
    </div>
  )
}

export default NewUser