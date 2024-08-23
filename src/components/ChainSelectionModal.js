import React from 'react';

const Modal = ({ isOpen, onClose, walletTypes, onSelectWallet }) => {
  if (!isOpen) return null;

  return (
    <div className="modal__overlay">
      <div className="modal__content">
        <h2 className="modal__title">Select Wallet Type</h2>
        <ul className="modal__list">
          {walletTypes?.map((wallet, index) => (
            <li
              key={index}
              className="modal__listItem"
              onClick={() => onSelectWallet(wallet)}
            >
              {wallet}
            </li>
          ))}
        </ul>
        <button className="modal__closeButton" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Modal;
