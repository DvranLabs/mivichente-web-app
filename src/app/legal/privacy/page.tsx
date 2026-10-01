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
          <strong>Última actualización:</strong> 1 de octubre de 2026
        </p>

        <p>
          Bienvenido a Vichente App (la &quot;Aplicación&quot;). Tu privacidad es
          importante para nosotros. Esta Política de Privacidad explica qué
          información recopilamos, para qué la usamos y con quién se comparte
          cuando usas la Aplicación en Android, en iPhone o en la web
          (app.vichente.com), y cuando usas el sitio vichente.com.
        </p>

        <h2>1. Información que Recopilamos</h2>
        <p>
          Vichente App es un directorio de negocios locales. No requiere
          crear una cuenta ni iniciar sesión para usarse. La información que
          recopilamos depende de cómo interactúes con la Aplicación:
        </p>

        <h3>Información que Nos Proporcionas</h3>
        <ul>
          <li>
            <strong>Registro de negocio:</strong> Si solicitas que tu
            negocio aparezca en el directorio, recopilamos los datos del
            negocio que nos envías (nombre, descripción, teléfono,
            dirección, municipio, giro, horarios, redes sociales y fotos) y
            los datos de la persona de contacto: su nombre y, si lo
            escribe, su teléfono. Los datos del negocio se publican en el
            directorio, y los de la persona de contacto los usamos para
            comunicarnos con ella.
          </li>
          <li>
            <strong>Reportar información incorrecta:</strong> Si reportas
            que el perfil de un negocio tiene datos desactualizados,
            recopilamos el motivo que selecciones y la nota opcional que
            escribas.
          </li>
        </ul>

        <h3>Pedidos por WhatsApp</h3>
        <p>
          Algunos negocios aceptan pedidos desde la Aplicación. Para armar tu
          pedido escribes tu nombre, tu teléfono, las referencias de tu
          domicilio, una nota opcional y con cuánto vas a pagar, y marcas
          en un mapa a dónde te lo llevan. Con eso la Aplicación arma un
          mensaje y abre WhatsApp para que tú se lo mandes al negocio.
        </p>
        <ul>
          <li>
            <strong>No guardamos esos datos.</strong> Se quedan en tu
            dispositivo mientras armas el pedido y salen únicamente en el
            mensaje que tú decides enviar. No llegan a nuestros servidores.
          </li>
          <li>
            <strong>Quién los recibe:</strong> el negocio al que le mandas el
            mensaje, por medio de WhatsApp. A partir de ahí, el uso que el
            negocio y WhatsApp hagan de esa información se rige por sus
            propias políticas.
          </li>
          <li>
            <strong>Lo que sí registramos del pedido:</strong> en qué paso
            del pedido vas (ver el menú, agregar un producto, empezar el
            pedido, abrir WhatsApp), cuántos productos lleva y el total,
            junto con el identificador anónimo de dispositivo. No
            registramos lo que escribes en el formulario ni tu ubicación.
          </li>
        </ul>

        <h3>Ubicación</h3>
        <p>
          La Aplicación solo pide acceso a tu ubicación cuando tú tocas el
          botón de ubicación, nunca al abrirla. Se usa en dos lugares:
        </p>
        <ul>
          <li>
            <strong>Elegir tu municipio:</strong> con tu ubicación
            detectamos en qué municipio estás. Solo guardamos en tu
            dispositivo el nombre del municipio; la posición se descarta.
          </li>
          <li>
            <strong>Marcar a dónde va tu pedido:</strong> con tu ubicación
            precisa ponemos el punto de entrega en el mapa. Esa coordenada
            viaja dentro de un enlace de Google Maps en el mensaje de
            WhatsApp que le mandas al negocio, para que te lleven el pedido.
          </li>
        </ul>
        <p>
          No guardamos tu ubicación en nuestros servidores. Darnos acceso es
          opcional: si no lo das, puedes elegir tu municipio de una lista y
          mover el mapa a mano. Puedes quitar el permiso en cualquier momento
          desde la configuración de tu dispositivo.
        </p>

        <h3>Información Recopilada Automáticamente</h3>
        <ul>
          <li>
            <strong>Identificador anónimo de dispositivo:</strong> Un
            identificador aleatorio que la Aplicación genera y guarda en tu
            dispositivo. No está ligado a tu nombre, teléfono, correo ni a
            ningún otro dato personal. Lo usamos para distinguir la actividad
            de distintos dispositivos y evitar reportes repetidos o abusivos.
            Puedes cambiarlo por uno nuevo cuando quieras; la sección 5
            explica cómo.
          </li>
          <li>
            <strong>Datos de uso:</strong> Junto con ese identificador
            registramos qué buscas dentro de la Aplicación y cuántos
            resultados obtienes, qué negocio abres desde una búsqueda, cuándo
            tocas llamar, WhatsApp o el mapa de un negocio, y los pasos del
            pedido descritos arriba. Sirve para saber qué negocios faltan en
            el directorio, mejorar la búsqueda y medir si la Aplicación les
            sirve a los negocios.
          </li>
          <li>
            <strong>Visitas desde códigos QR:</strong> Cuando abres la página
            de un negocio en vichente.com escaneando un código QR o desde un
            enlace, registramos de qué código o enlace llegaste y el
            identificador del navegador que envía tu dispositivo (user
            agent), que indica el tipo de navegador y de sistema operativo.
          </li>
          <li>
            <strong>Contactos desde vichente.com:</strong> El sitio guarda en
            tu navegador su propio identificador aleatorio y, junto con él,
            registra cuándo tocas llamar o WhatsApp en la página de un
            negocio.
          </li>
          <li>
            <strong>Registros técnicos:</strong> Como cualquier servicio en
            internet, nuestros servidores y los de nuestros proveedores
            registran datos técnicos de cada conexión, como la dirección IP,
            para operar y proteger el servicio.
          </li>
        </ul>
        <p>
          <strong>Favoritos y negocios recientes:</strong> Los negocios que
          marcas como favoritos y los que viste hace poco se guardan
          únicamente en tu dispositivo, no en nuestros servidores.
        </p>

        <h2>2. Uso de Tu Información</h2>
        <p>Usamos la información que recopilamos para:</p>
        <ul>
          <li>
            Publicar y mantener actualizada la ficha de un negocio en el
            directorio, y comunicarnos con la persona que lo registró.
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
            Medir cuántas personas contactan o le piden a cada negocio,
            sin conocer el contenido de esos contactos o pedidos.
          </li>
          <li>
            Detectar y filtrar reportes repetidos o abusivos provenientes de
            un mismo dispositivo.
          </li>
          <li>Mantener y mejorar el funcionamiento de la Aplicación.</li>
        </ul>
        <p>
          No vendemos tu información ni la usamos para mostrarte publicidad.
        </p>

        <h2>3. Divulgación de Tu Información</h2>
        <p>
          No compartimos tu información con terceros excepto en las
          siguientes situaciones:
        </p>
        <ul>
          <li>
            <strong>Cuando tú lo decides:</strong> Al mandar un pedido o
            escribirle a un negocio por WhatsApp, o al llamarle, la
            información que incluyas le llega a ese negocio por medio de
            WhatsApp o de tu teléfono.
          </li>
          <li>
            <strong>Con Proveedores de Servicios:</strong> Guardamos la
            información en servidores de Supabase, y el sitio y la versión
            web se sirven desde Vercel y Firebase Hosting. Para los mapas y la
            ubicación usamos Google Maps; al usar esas funciones aplica la
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
          La información viaja cifrada entre la Aplicación y nuestros
          servidores, y usamos medidas de seguridad administrativas y
          técnicas razonables para protegerla. Aun así, ninguna medida de
          seguridad es perfecta o impenetrable.
        </p>

        <h2>5. Tus Derechos y Cómo Borrar Tus Datos</h2>
        <p>
          Puedes pedirnos acceder, corregir o borrar tu información, u
          oponerte a su uso, escribiendo a{' '}
          <a href="mailto:vichenteapp@gmail.com">vichenteapp@gmail.com</a>.
        </p>
        <ul>
          <li>
            <strong>Si registraste un negocio:</strong> escríbenos con el
            nombre del negocio y el teléfono que nos diste, y
            corregimos o borramos los datos del registro y de la persona de
            contacto. Si lo pides, también retiramos la ficha del directorio.
          </li>
          <li>
            <strong>Actividad de uso:</strong> como el identificador de
            dispositivo es aleatorio y no está ligado a ti, no podemos saber
            qué actividad es tuya por tu nombre o tu teléfono. Para cortar el
            vínculo con tu actividad anterior, en Android borra los datos de
            la Aplicación desde la configuración del dispositivo; en iPhone,
            desinstálala. En la web, borra los datos del sitio en tu
            navegador. Así se genera un identificador nuevo.
          </li>
          <li>
            <strong>Pedidos y ubicación:</strong> no hay nada que borrar de
            nuestro lado, porque no los guardamos. Para borrar un pedido ya
            enviado, hazlo en tu WhatsApp o pídeselo al negocio.
          </li>
        </ul>

        <h2>6. Privacidad de los Niños</h2>
        <p>
          Nuestra aplicación no está dirigida a niños menores de 13 años y no
          recopilamos conscientemente información de niños menores de 13 años.
        </p>

        <h2>7. Cambios a Esta Política de Privacidad</h2>
        <p>
          Podemos actualizar esta Política de Privacidad de vez en cuando. Te
          avisaremos de cualquier cambio publicando la nueva versión en esta
          página y actualizando la fecha de &quot;Última actualización&quot;.
        </p>

        <h2>8. Contáctanos</h2>
        <p>
          Si tienes preguntas o comentarios sobre esta Política de Privacidad,
          por favor contáctanos en:
          <br />
          <a href="mailto:vichenteapp@gmail.com">vichenteapp@gmail.com</a>
          <br />
          dvran-company
        </p>
      </div>
    </main>
  );
}
