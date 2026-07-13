"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { NegocioEncontrado } from "../../app/actions/buscar";

// Puente entre el buscador y el formulario: si el dueño encuentra su negocio en
// el directorio, el form baja ya prellenado y cambia de "regístralo" a
// "corrige lo que esté mal". Envuelve toda la página para que las dos secciones
// (separadas por otras) compartan estado.

interface Ctx {
  negocio: NegocioEncontrado | null;
  seleccionar: (n: NegocioEncontrado | null) => void;
}

const NegocioCtx = createContext<Ctx>({ negocio: null, seleccionar: () => {} });

export function NegocioProvider({ children }: { children: ReactNode }) {
  const [negocio, setNegocio] = useState<NegocioEncontrado | null>(null);
  return (
    <NegocioCtx.Provider value={{ negocio, seleccionar: setNegocio }}>
      {children}
    </NegocioCtx.Provider>
  );
}

export function useNegocioSeleccionado() {
  return useContext(NegocioCtx);
}
