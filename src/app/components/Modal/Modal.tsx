"use client";

import type { ReactNode } from "react";
import { useState, useEffect } from "react";

interface ModalProps {
  children: ReactNode;
  open: boolean;
}

export default function Modal({ children, open }: ModalProps) {
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (open) {
      setOpenModal(true);
    } else {
      setOpenModal(false);
    }
  }, [open]);

  if (!openModal) {
    return;
  }

  const handleClose = () => {
    setOpenModal(false)
  }

  return (
    <div className=" bg-black bg-opacity-80 fixed w-screen h-screen z-50 left-0 top-0 p-5 flex justify-center items-center">
      <div className="w-full max-w-md">
        <div className="flex justify-end">
          <button onClick={handleClose} className="text-2xl">x</button>
        </div>
        {children}
      </div>
    </div>
  );
}
