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
          <strong>Última actualización:</strong> 26 de noviembre de 2026
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

        <h3>Pedidos</h3>
        <p>
          Algunos negocios aceptan pedidos desde la Aplicación. Hay dos
          formas de enviarlos, según el negocio:
        </p>
        <ul>
          <li>
            <strong>Pedidos que tú mandas por WhatsApp:</strong> la
            Aplicación arma un mensaje con los productos y los datos que
            escribas, y abre WhatsApp para que tú se lo mandes al negocio.
            En estos pedidos no guardamos tu nombre, teléfono, ubicación,
            indicaciones, referencias ni notas en nuestros servidores:
            permanecen en tu dispositivo mientras armas el pedido y salen
            en el mensaje que tú decides enviar.
          </li>
          <li>
            <strong>Pedidos con seguimiento en Vichente:</strong> en los
            restaurantes que ofrecen esta opción, mandas el pedido sin
            abrir tu WhatsApp y puedes consultar su estado en la Aplicación.
            Guardamos tu nombre, teléfono, los productos con sus opciones y
            notas, las cantidades, los importes, el costo de envío, las
            fechas, los estados y, si lo escribes, con cuánto vas a pagar.
            Para entrega a domicilio también guardamos el punto que marques
            en el mapa o las indicaciones de cómo llegar, y las referencias
            que escribas. Si pasas a recogerlo, no guardamos ubicación ni
            referencias de entrega. Usamos estos datos para tramitar el
            pedido y que el restaurante lo prepare y lo entregue. Tu
            teléfono también se usa para avisarte por WhatsApp cuando el
            restaurante acepta, rechaza o despacha tu pedido.
          </li>
          <li>
            <strong>Quién recibe el pedido:</strong> el negocio al que le
            pides, por medio de WhatsApp. En los pedidos con seguimiento,
            Vichente se lo envía desde su propio número mediante la
            plataforma WhatsApp Business de Meta. El restaurante y
            WhatsApp/Meta reciben el contenido del pedido y los datos de
            contacto y entrega incluidos en él. El restaurante puede
            compartir los datos necesarios con la persona que te lo lleva.
            El uso que esos terceros hagan de las copias que reciben se
            rige por sus propias políticas.
          </li>
          <li>
            <strong>Actividad del pedido:</strong> también registramos en
            qué paso vas (ver el menú, agregar un producto, empezar el
            pedido, abrir WhatsApp), cuántos productos lleva y el total,
            junto con el identificador aleatorio de dispositivo. Estos
            registros de actividad no incluyen lo que escribes en el
            formulario ni tu ubicación; son distintos del pedido con
            seguimiento que sí guardamos.
          </li>
        </ul>
        <p>
          <strong>Cuánto tiempo guardamos los datos del cliente:</strong> en
          los pedidos con seguimiento borramos tu nombre, teléfono,
          ubicación, indicaciones de cómo llegar, referencias, con cuánto
          pagas y las notas de cada producto a los 90 días del último cambio
          de estado. El plazo aplica tanto si el pedido se entrega o se
          rechaza como si se queda sin respuesta o no avanza. Si nunca cambió
          de estado, cuenta desde que se creó. La limpieza corre una vez al
          día, por lo que puede tardar hasta un día adicional.
        </p>
        <p>
          Conservamos los productos pedidos sin notas, los importes, el
          envío, las fechas y los estados para evaluar cómo funciona el
          servicio. También queda el identificador con el que puedes
          consultar el pedido desde tu dispositivo. Los datos borrados
          pueden permanecer hasta 30 días adicionales en copias de seguridad
          anteriores, que se eliminan al cumplir ese plazo. El borrado en
          Vichente no elimina las copias que ya recibieron el restaurante
          o WhatsApp/Meta.
        </p>

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
            precisa ponemos el punto de entrega en el mapa. Si mandas el
            pedido por tu WhatsApp, esa coordenada viaja en un enlace de
            Google Maps dentro del mensaje. En los pedidos con seguimiento
            la guardamos en Vichente y se la enviamos al restaurante por
            WhatsApp/Meta para que te lleve el pedido, con el plazo de
            conservación explicado arriba.
          </li>
        </ul>
        <p>
          Darnos acceso a la ubicación de tu dispositivo es opcional: si no
          lo das, puedes elegir tu municipio de una lista y marcar el punto
          de entrega a mano o escribir cómo llegar. Si mandas un pedido con
          seguimiento a domicilio, guardamos el punto o las indicaciones
          que hayas proporcionado aunque no hayas dado el permiso. Puedes
          quitar el permiso en cualquier momento desde la configuración de
          tu dispositivo.
        </p>

        <h3>Información Recopilada Automáticamente</h3>
        <ul>
          <li>
            <strong>Identificador aleatorio de dispositivo:</strong> Un
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
          <li>
            <strong>Datos técnicos de los mapas:</strong> el componente de
            Google Maps puede recopilar información del dispositivo y de
            sus propias solicitudes, identificadores, interacciones con el
            mapa y datos de fallos y rendimiento. Google los utiliza para
            prestar y mejorar sus servicios, conforme a su política de
            privacidad.
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
            Medir cuántas personas contactan o le piden a cada negocio. Los
            eventos de actividad no incluyen el contenido de los mensajes
            ni los datos de entrega.
          </li>
          <li>
            Tramitar los pedidos con seguimiento, comunicar sus estados en
            la Aplicación y por WhatsApp, y evaluar cómo funciona el servicio
            con los productos pedidos, importes, fechas y estados.
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
            información que incluyas le llega a ese negocio. En los pedidos
            con seguimiento Vichente envía los datos al restaurante por
            WhatsApp/Meta, como se explica en la sección de pedidos, y usa
            tu teléfono para los avisos de estado por ese mismo medio.
          </li>
          <li>
            <strong>Con Proveedores de Servicios:</strong> Guardamos la
            información en servidores de Supabase y las copias de seguridad
            de la base de datos en Cloudflare R2. El sitio y la versión web
            se sirven desde Vercel y Firebase Hosting. Para enviar los
            pedidos con seguimiento y los avisos por WhatsApp usamos la
            plataforma de Meta. Para los mapas y la ubicación usamos Google
            Maps; al usar esas funciones aplica la
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
            <strong>Pedidos y ubicación:</strong> si mandaste un pedido con
            seguimiento, puedes pedirnos por correo que borremos los datos
            de contacto y entrega, las indicaciones, con cuánto pagas y las
            notas que guardamos. Indica el negocio, la fecha del pedido y el
            teléfono que usaste para ayudarnos a localizarlo. Borrar los
            datos de la Aplicación en tu dispositivo no borra el pedido de
            nuestros servidores. Las copias de seguridad anteriores pueden
            conservar los datos hasta 30 días más. Si el pedido salió
            directamente de tu WhatsApp, no guardamos en nuestros servidores
            los datos de contacto y entrega ni las notas del pedido. Para
            borrar el mensaje o la copia del negocio, hazlo en WhatsApp o
            solicítaselo al negocio. El borrado en
            Vichente tampoco borra las copias de terceros de un pedido con
            seguimiento.
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
