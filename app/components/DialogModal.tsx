import React, { useEffect, useRef } from "react";

interface DialogModalProps {
  message: string;
  isOpen: boolean;
  onClose: () => void;
}

const DialogModal: React.FC<DialogModalProps> = ({
  message,
  isOpen,
  onClose,
}) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    if (isOpen && dialogRef.current) {
      dialogRef.current.showModal();

      // By default <dialog> HTML element closes on the press of the Esc key on keyboard
      // the code that follows is preventing that from happening

      // Add event listener to prevent default behavior on Esc key press
      const preventEscClose = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          event.preventDefault();
        }
      };

      // Cleanup function - called when the component is unmounted or when the effect dependencies change
      // removing all the resources previously set by the effect function (like the event listener here)
      dialogRef.current.addEventListener("keydown", preventEscClose);
      return () => {
        dialogRef.current?.removeEventListener("keydown", preventEscClose);
      };
    }
  }, [isOpen]);

  return (
    <dialog ref={dialogRef} className="modal">
      <div className="modal-box">
        <h3 className="text-lg font-bold">Response message</h3>
        <p className="py-4">{message}</p>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn focus:outline-none" onClick={onClose}>
              Close
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default DialogModal;
