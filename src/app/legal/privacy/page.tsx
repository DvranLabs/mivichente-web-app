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
          <strong>Fecha de efectividad:</strong> 21 de julio de 2026
        </p>

        <p>
          Bienvenido a Vichente App (la &quot;Aplicación&quot;). Tu privacidad es
          importante para nosotros. Esta Política de Privacidad explica cómo
          recopilamos, usamos, divulgamos y protegemos tu información cuando
          utilizas nuestra aplicación móvil.
        </p>

        <h2>1. Información que Recopilamos</h2>
        <p>
          Vichente App es un directorio de negocios locales. No requiere
          crear una cuenta ni iniciar sesión para usarse. La información que
          recopilamos depende de cómo interactúes con la Aplicación:
        </p>

        <h3>Información que Nos Proporcionas</h3>
        <p>
          Solo recopilamos datos que nos proporcionas directamente al usar
          funciones específicas:
        </p>
        <ul>
          <li>
            <strong>Registro de negocio:</strong> Si solicitas que tu
            negocio aparezca en el directorio, recopilamos el nombre,
            teléfono, dirección y demás información del negocio que nos
            envías para publicarlo.
          </li>
          <li>
            <strong>Reportar información incorrecta:</strong> Si reportas
            que el perfil de un negocio tiene datos desactualizados,
            recopilamos el motivo que selecciones y la nota opcional que
            escribas.
          </li>
        </ul>

        <h3>Información Recopilada Automáticamente</h3>
        <ul>
          <li>
            <strong>Datos de uso:</strong> Qué buscas dentro de la
            Aplicación y cuántos resultados obtienes, para saber qué
            negocios faltan en el directorio y mejorar la búsqueda.
          </li>
          <li>
            <strong>Identificador anónimo de dispositivo:</strong> Un
            identificador aleatorio generado y guardado únicamente en tu
            dispositivo (no está ligado a tu nombre, correo ni ninguna otra
            información personal). Se usa junto con los datos de uso y los
            reportes de información incorrecta para distinguir actividad de
            distintos dispositivos y evitar reportes repetidos o abusivos.
          </li>
          <li>
            <strong>Información del dispositivo:</strong> Modelo de
            hardware, sistema operativo y versión.
          </li>
        </ul>
        <p>
          <strong>Favoritos:</strong> Los negocios que marcas como favoritos
          se guardan únicamente en tu dispositivo (almacenamiento local), no
          en nuestros servidores.
        </p>

        <h2>2. Uso de Tu Información</h2>
        <p>
          Usamos la información que recopilamos para:
        </p>
        <ul>
          <li>
            Publicar y mantener actualizada la ficha de un negocio en el
            directorio.
          </li>
          <li>
            Revisar y corregir información incorrecta reportada sobre un
            negocio.
          </li>
          <li>
            Entender qué buscan las personas en el directorio y qué
            negocios faltan por agregar.
          </li>
          <li>
            Detectar y filtrar reportes repetidos o abusivos provenientes de
            un mismo dispositivo.
          </li>
          <li>
            Mantener y mejorar el funcionamiento de la Aplicación.
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
          vichenteapp@gmail.com
          <br />
          dvran-company
        </p>
      </div>
    </main>
  );
}