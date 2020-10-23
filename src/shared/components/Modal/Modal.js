import React from 'react';
import ReactDOM from 'react-dom';
import './Modal.css';
//importing transition
import Backdrop from "../BackDrop/Backdrop";
import { CSSTransition } from "react-transition-group";

const ModalOverlay = props => {
    const content = (
        <div className='modal'>
            <header className={`modal__header`}>
                <h2>{props.header}</h2>
            </header>
            <form onSubmit={ props.onSubmit ? props.onSubmit : (event => event.preventDefault())}
                  className='modalForm'>
                <div className={`modal__content ${props.contentClass}`}>
                    {props.children}
                </div>
                <footer className={`modal__footer ${props.footerClass}`}>
                    {props.footer}
                </footer>
            </form>
        </div>
    )
    return  ReactDOM.createPortal( content, document.getElementById('modal-hook'))
}

const Modal = (props) => {
    return (
        <React.Fragment>
            { props.show && <Backdrop onClick={props.onCancel}/>}
            <CSSTransition in={props.show}
                           unmountOnExit
                           mountOnEnter
                           timeout={200}
                           classNames='modal'>
                <ModalOverlay {...props} />
            </CSSTransition>
        </React.Fragment>
    );
};

export default Modal;
