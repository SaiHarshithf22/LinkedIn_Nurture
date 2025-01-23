const Modal = ({ title, content, modalRef }) => {
  const closeModal = () => {
    modalRef.current?.close();
    if (onClose) onClose();
  };

  return (
    <dialog
      ref={modalRef}
      style={{
        backgroundColor: "white",
        margin: "auto",
        width: "600px",
        border: "none",
        borderRadius: "8px",
        padding: "20px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
        color: "black",
      }}
    >
      <h2 style={{ margin: "0 0 10px", color: "black" }}>{title}</h2>
      <div style={{ margin: "10px 0 20px", color: "black" }}>{content}</div>
    </dialog>
  );
};

export default Modal;
