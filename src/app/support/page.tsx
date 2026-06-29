import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Soporte — Vichente App',
};

export default function SupportPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="prose prose-lg max-w-2xl mx-auto">
        <h1>Soporte</h1>
        <p>
          ¿Tienes alguna pregunta, encontraste un error o quieres que agreguemos
          tu negocio al directorio? Escríbenos.
        </p>

        <h2>Contacto</h2>
        <ul>
          <li>
            <strong>Instagram:</strong>{' '}
            <a
              href="https://instagram.com/vichenteapp"
              target="_blank"
              rel="noopener noreferrer"
            >
              @vichenteapp
            </a>
          </li>
          <li>
            <strong>Correo:</strong>{' '}
            <a href="mailto:dvrancorp@gmail.com">dvrancorp@gmail.com</a>
          </li>
        </ul>

        <p>
          Respondemos lo antes posible. Tiempo de respuesta habitual: 1–2 días hábiles.
        </p>
      </div>
    </main>
  );
}
