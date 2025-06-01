import type React from "react";
import styled from "@emotion/styled/macro";
import ReactModal from "react-modal2";
import { Global, css } from "@emotion/react";

import theme from "../styles/theme.ts";

const StyledModal = css`
  .modal {
    position: relative;
    width: 90%;
    height: 95%;
    margin: 0;
    padding: 2.5rem;
    background-color: #fff;
    border-radius: 0.3rem;
    box-shadow: 0 0 2.5rem rgba(0, 0, 0, 0.5);
    max-width: 700px;
    top: 50%;
    left: 50%;
    text-align: left;
    transform: translate3d(-50%, -50%, 0);
    ${theme.mq.small} {
      height: auto;
      width: 80%;
    }
    & > div {
      overflow-y: auto;
      height: 100%;
    }
  }
  .modal__backdrop {
    background-color: rgba(0, 0, 0, 0.7);
    top: 0;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
  }
`;

const StyledCloseButton = styled("button")`
  position: fixed;
  top: 1rem;
  right: 1rem;
  border: none;
  padding: 0;
  font-size: 1.5rem;
  background: none;
`;

ReactModal.getApplicationElement = () => document.getElementById("root");

interface Props {
	isModalOpen?: boolean;
	onClose: () => void;
	children: React.ReactElement;
}

const Modal = ({ isModalOpen, onClose, children }: Props) => {
	if (!isModalOpen) {
		return null;
	}
	return (
		<ReactModal
			backdropClassName="modal__backdrop"
			modalClassName="modal"
			onClose={onClose}
		>
			<Global styles={StyledModal} />
			<StyledCloseButton onClick={onClose}>×</StyledCloseButton>
			<div>{children}</div>
		</ReactModal>
	);
};

export default Modal;
