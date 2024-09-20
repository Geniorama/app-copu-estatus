"use client";

import type { ReactNode } from "react";

interface ModalProps {
  children: ReactNode;
  open: boolean;
  onClose: () => void;
}

export default function Modal({ children, open, onClose }: ModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="bg-black bg-opacity-80 fixed w-screen h-screen z-50 left-0 top-0 p-5 flex justify-center items-center">
      <div className="w-full max-w-xl">
        <div className="flex justify-end">
          <button onClick={onClose} className="text-2xl">x</button>
        </div>
        {children}
      </div>
    </div>
  );
}
