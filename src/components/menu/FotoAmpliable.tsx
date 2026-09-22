"use client";

import { useRef } from "react";
import styles from "./menu.module.css";

interface Props {
  src: string;
  alt: string;
  prioridad: boolean;
}

export default function FotoAmpliable({ src, alt, prioridad }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  function abrir() {
    dialogRef.current?.showModal();
  }

  function cerrar() {
    dialogRef.current?.close();
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={styles.imageButton}
        aria-label={`Ver foto completa de ${alt}`}
        aria-haspopup="dialog"
        onClick={abrir}
      >
        {/* <img> y no next/image a propósito: un host de imagen que no esté en
            next.config no debe tirar la página completa del menú. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={styles.cardImage}
          src={src}
          alt={alt}
          loading={prioridad ? "eager" : "lazy"}
          decoding="async"
        />
      </button>

      <dialog
        ref={dialogRef}
        className={styles.imageDialog}
        aria-label={`Foto completa de ${alt}`}
        onClose={() => triggerRef.current?.focus({ preventScroll: true })}
        onClick={(event) => {
          if (event.target === event.currentTarget) cerrar();
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={styles.fullImage} src={src} alt={alt} decoding="async" />
        <button
          type="button"
          className={styles.closeImageButton}
          aria-label="Cerrar foto"
          onClick={cerrar}
        >
          ×
        </button>
      </dialog>
    </>
  );
}
