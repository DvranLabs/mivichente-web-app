import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidad',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="prose prose-lg max-w-4xl mx-auto">
        <h1>Política de Privacidad</h1>
        <p>
          <strong>Fecha de efectividad:</strong> [Fecha de Efectividad]
        </p>

        <p>
          Bienvenido a Vichente App (la &quot;Aplicación&quot;). Tu privacidad es
          importante para nosotros. Esta Política de Privacidad explica cómo
          recopilamos, usamos, divulgamos y protegemos tu información cuando
          utilizas nuestra aplicación móvil.
        </p>

        <h2>1. Información que Recopilamos</h2>
        <p>
          Podemos recopilar información sobre ti de varias maneras. La
          información que podemos recopilar a través de la Aplicación depende
          del contenido y los materiales que utilices, e incluye:
        </p>

        <h3>Información Recopilada Automáticamente</h3>
        <p>
          Cuando accedes a la Aplicación, podemos recopilar automáticamente
          cierta información, que incluye:
        </p>
        <ul>
          <li>
            <strong>Datos de Geolocalización:</strong> Podemos solicitar acceso o
            permiso para rastrear información basada en la ubicación de tu
            dispositivo móvil, ya sea de forma continua o mientras estás
            utilizando la Aplicación, para proporcionar servicios basados en la
            ubicación, como mostrarte negocios cercanos. Si deseas cambiar
            nuestros permisos de acceso, puedes hacerlo en la configuración de
            tu dispositivo.
          </li>
          <li>
            <strong>Datos de Uso:</strong> Recopilamos información sobre cómo
            interactúas con nuestra Aplicación, como las funciones que usas y
            las acciones que realizas.
          </li>
          <li>
            <strong>Información del Dispositivo:</strong> Información sobre tu
            dispositivo móvil, como el modelo de hardware, el sistema operativo
            y la versión.
          </li>
        </ul>

        <h2>2. Uso de Tu Información</h2>
        <p>
          Tener información precisa sobre ti nos permite ofrecerte una
          experiencia fluida, eficiente y personalizada. Específicamente,
          podemos usar la información recopilada sobre ti a través de la
          Aplicación para:
        </p>
        <ul>
          <li>
            Proporcionar y mejorar la funcionalidad de nuestro directorio de
            negocios.
          </li>
          <li>
            Aumentar la eficiencia y el funcionamiento de la Aplicación.
          </li>
          <li>
            Realizar análisis de datos para mejorar nuestro servicio.
          </li>
        </ul>

        <h2>3. Divulgación de Tu Información</h2>
        <p>
          No compartiremos tu información con terceros excepto en las
          siguientes situaciones:
        </p>
        <ul>
          <li>
            <strong>Con Proveedores de Servicios:</strong> Para proporcionar la
            funcionalidad de mapas y ubicación, utilizamos los servicios de
            Google Maps. Al utilizar estas funciones, estás sujeto a la
            Política de Privacidad de Google, que puedes consultar en{' '}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://policies.google.com/privacy
            </a>
            .
          </li>
          <li>
            <strong>Por Requerimiento Legal:</strong> Si creemos que la
            divulgación es necesaria para responder a un proceso legal, para
            investigar o remediar posibles violaciones de nuestras políticas, o
            para proteger los derechos, la propiedad y la seguridad de otros.
          </li>
        </ul>

        <h2>4. Seguridad de Tu Información</h2>
        <p>
          Utilizamos medidas de seguridad administrativas, técnicas y físicas
          para ayudar a proteger tu información personal. Si bien hemos tomado
          medidas razonables para asegurar la información personal que nos
          proporcionas, ten en cuenta que a pesar de nuestros esfuerzos, ninguna
          medida de seguridad es perfecta o impenetrable.
        </p>

        <h2>5. Privacidad de los Niños</h2>
        <p>
          Nuestra aplicación no está dirigida a niños menores de 13 años y no
          recopilamos conscientemente información de niños menores de 13 años.
        </p>

        <h2>6. Cambios a Esta Política de Privacidad</h2>
        <p>
          Podemos actualizar esta Política de Privacidad de vez en cuando. Te
          notificaremos cualquier cambio publicando la nueva Política de
          Privacidad en esta página.
        </p>

        <h2>7. Contáctanos</h2>
        <p>
          Si tienes preguntas o comentarios sobre esta Política de Privacidad,
          por favor contáctanos en:
          <br />
          [Tu Email de Contacto]
          <br />
          [Tu Nombre o Nombre de la Empresa]
        </p>
      </div>
    </main>
  );
}