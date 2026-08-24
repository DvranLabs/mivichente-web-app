"use client";

import { logContact } from "../app/actions/log-contact";
import { getOrCreateDeviceId } from "../lib/device-id";

interface ContactLinkProps {
  href: string;
  businessId: string;
  channel: "call" | "whatsapp";
  style: React.CSSProperties;
  children: React.ReactNode;
}

// Envuelve el <a> de tel:/wa.me sin bloquear la navegación: el registro es
// fire-and-forget, el navegador sigue el href igual que antes de instrumentar.
export default function ContactLink({ href, businessId, channel, style, children }: ContactLinkProps) {
  return (
    <a
      href={href}
      style={style}
      onClick={() => {
        void logContact(businessId, channel, getOrCreateDeviceId());
      }}
    >
      {children}
    </a>
  );
}
