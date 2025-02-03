import { Dialog, DialogContent } from "@mui/material";
import { FilledButton, OutlineButton } from "../Buttons/Buttons";
import { Close } from "@mui/icons-material";

const Modal = ({ title, content, modalRef }) => {
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

export const MaterialDialog = ({
  filterModal,
  handleFilterClose,
  children,
  handleApply,
  title,
  handleClearFilter,
}) => {
  return (
    <Dialog
      disableEscapeKeyDown
      open={filterModal}
      onClose={handleFilterClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogContent sx={{ padding: "32px" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            position: "relative",
          }}
        >
          <h2 style={{ marginBottom: "-16px" }}>{title}</h2>
          {children}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              width: "100%",
              gap: "16px",
            }}
          >
            <OutlineButton
              children="Clear Filter"
              onClick={handleClearFilter}
            />
            <FilledButton children="Apply filters" onClick={handleApply} />
          </div>
          <div
            style={{
              position: "absolute",
              right: -24,
              top: -24,
              cursor: "pointer",
            }}
            onClick={handleFilterClose}
          >
            <Close />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
