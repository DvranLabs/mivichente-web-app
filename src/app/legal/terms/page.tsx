import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Términos y Condiciones',
};

export default function TermsAndConditionsPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="prose prose-lg max-w-4xl mx-auto">
        <h1>Términos y Condiciones</h1>
        <p>
          <strong>Última actualización:</strong> 26 de noviembre de 2026
        </p>

        <p>
          Estos Términos y Condiciones (&quot;Términos&quot;) rigen tu acceso y
          uso de Vichente App (la &quot;Aplicación&quot;) en Android, en iPhone
          o en la web (app.vichente.com), y del sitio vichente.com. Al
          descargar, acceder o utilizar la Aplicación, aceptas estos Términos.
        </p>

        <h2>1. Qué es Vichente</h2>
        <p>
          Vichente App es un directorio de negocios locales: muestra datos
          como teléfonos, horarios, menús y ubicaciones a través de Google
          Maps. Algunos negocios también reciben pedidos desde la Aplicación,
          como se explica en la sección 2. Aceptas utilizar la Aplicación
          solo para fines lícitos y de acuerdo con estos Términos, sin mandar
          pedidos falsos ni datos de otra persona sin su permiso.
        </p>

        <h2>2. Cómo Funcionan los Pedidos</h2>
        <p>
          Cada negocio decide cómo recibe sus pedidos, y la Aplicación te
          indica cuál de estas dos formas aplica antes de que lo mandes:
        </p>
        <ul>
          <li>
            <strong>Pedidos que tú mandas por WhatsApp:</strong> la
            Aplicación arma un mensaje con tus productos y tus datos, y abre
            tu WhatsApp. El pedido le llega al negocio solo cuando tú mandas
            ese mensaje. A partir de ahí la conversación es entre tú y el
            negocio: Vichente no ve si lo mandaste ni lo que el negocio te
            responde.
          </li>
          <li>
            <strong>Pedidos con seguimiento en Vichente:</strong> en los
            restaurantes que ofrecen esta opción, mandas el pedido desde la
            Aplicación sin abrir tu WhatsApp. Vichente lo guarda y se lo envía
            al restaurante por WhatsApp desde su propio número, y en la
            Aplicación puedes consultar en qué estado va. Que el pedido se
            haya mandado no significa que el restaurante ya lo leyó ni que lo
            aceptó: hasta que lo acepte, aparece como &quot;Esperando al
            restaurante&quot;.
          </li>
        </ul>
        <p>
          Los productos, los precios, la disponibilidad y el costo de envío
          los define cada negocio. Antes de guardar un pedido con
          seguimiento, la Aplicación lo revisa contra el menú vigente del
          restaurante y te avisa si algo cambió. Si el costo de envío aparece
          como &quot;Por confirmar&quot;, el restaurante es quien te lo
          indica.
        </p>

        <h2>3. Estados de un Pedido con Seguimiento</h2>
        <p>
          Los estados los registra el restaurante, salvo la entrega, que
          también puedes confirmar tú. La Aplicación te los muestra tal como
          los recibe:
        </p>
        <ul>
          <li>
            <strong>Aceptado:</strong> el restaurante confirmó que va a
            preparar tu pedido.
          </li>
          <li>
            <strong>Rechazado:</strong> el restaurante no puede tomar tu
            pedido. No se te cobra nada; si quieres saber el motivo, habla
            directamente con él.
          </li>
          <li>
            <strong>En preparación:</strong> el restaurante está preparando
            tu pedido.
          </li>
          <li>
            <strong>En camino</strong> o <strong>Listo para recoger</strong>,
            si pasas por él: el restaurante lo despachó o ya lo tiene listo.
          </li>
          <li>
            <strong>Entregado</strong> o <strong>Recogido:</strong> el
            pedido llegó a tus manos. Puedes confirmarlo tú mismo en la
            Aplicación.
          </li>
        </ul>
        <p>
          El seguimiento informa el paso en el que va tu pedido. No muestra
          dónde está la persona que lo lleva ni garantiza una hora de
          entrega.
        </p>
        <p>
          Si pasan 15 minutos y el restaurante no ha confirmado tu pedido, la
          Aplicación te sugiere llamarle o escribirle. El pedido no se cancela
          solo: si el restaurante lo acepta más tarde, lo verás en la
          Aplicación. Si no pudimos hacerle llegar el pedido al restaurante,
          la Aplicación también te lo indica, y en ese caso el restaurante no
          sabe de él hasta que tú lo contactes.
        </p>

        <h2>4. Qué Hace Vichente y Qué Hace el Restaurante</h2>
        <p>
          <strong>Vichente</strong> muestra la información de los negocios,
          hace llegar tu pedido con seguimiento al restaurante y te muestra
          los estados que este registra. Vichente no vende los productos, no
          fija sus precios, no los prepara, no asigna repartidores ni cobra o
          procesa pagos. Sí responde de que la Aplicación tramite y muestre
          tu pedido como se describe en estos Términos.
        </p>
        <p>
          <strong>El restaurante</strong> es quien te vende. Le corresponden
          los productos y sus precios, la preparación, el cobro y la entrega,
          que hace con su propia gente o cuando pasas a recoger tu pedido.
        </p>
        <p>
          <strong>Pago:</strong> la Aplicación no te cobra nada. Pagas
          directamente al restaurante o a la persona que te lleva el pedido.
          El dato de &quot;¿Con cuánto vas a pagar?&quot; sirve solo para que
          te lleven o te tengan listo el cambio; no es un cargo.
        </p>

        <h2>5. Cambios, Cancelaciones y Problemas con un Pedido</h2>
        <p>
          La Aplicación no tiene una opción para modificar o cancelar un
          pedido que ya mandaste, ni para pedir una devolución. Para eso, y
          para cualquier problema con los productos, el cobro o la entrega
          (por ejemplo, si tu pedido no llega o llega incompleto), comunícate
          con el restaurante. En la pantalla de seguimiento encuentras su
          teléfono para llamarle o escribirle.
        </p>
        <p>
          Si el problema fue de la Aplicación (por ejemplo, un pedido que no
          se envió como lo armaste o un estado que no corresponde), escríbenos
          a{' '}
          <a href="mailto:vichenteapp@gmail.com">vichenteapp@gmail.com</a>{' '}
          con el nombre del negocio, la fecha del pedido y el teléfono que
          usaste.
        </p>
        <p>
          Que la Aplicación no tenga estas opciones no limita los derechos
          que te dan las leyes de protección al consumidor, incluida la
          posibilidad de acudir a la Procuraduría Federal del Consumidor
          (Profeco).
        </p>

        <h2>6. Información de los Negocios y de Terceros</h2>
        <p>
          La información de cada negocio la proporciona el propio negocio o
          la reunimos nosotros, y procuramos mantenerla al día, pero puede
          cambiar sin que nos enteremos de inmediato. Si encuentras un dato
          incorrecto, puedes reportarlo desde el perfil del negocio en la
          Aplicación.
        </p>
        <p>
          La Aplicación también usa servicios de terceros, como Google Maps y
          WhatsApp, cuyo funcionamiento no controlamos. El uso de los
          servicios de Google Maps está sujeto a los Términos de Servicio de
          Google Maps, que puedes revisar en{' '}
          <a
            href="https://www.google.com/intl/en_us/help/terms_maps/"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://www.google.com/intl/en_us/help/terms_maps/
          </a>
          .
        </p>

        <h2>7. Privacidad</h2>
        <p>
          Qué datos guardamos de tus pedidos, con quién se comparten, cuánto
          tiempo los conservamos y cómo pedir que los borremos se explica en
          la <Link href="/legal/privacy">Política de Privacidad</Link>.
        </p>

        <h2>8. Derechos de Propiedad Intelectual</h2>
        <p>
          La Aplicación y su contenido original, características y
          funcionalidad son y seguirán siendo propiedad exclusiva de
          dvran-company y sus licenciantes.
        </p>

        <h2>9. Suspensión del Acceso</h2>
        <p>
          Podemos suspender o terminar el acceso a la Aplicación de quien la
          use para fines ilícitos, mande pedidos falsos o incumpla estos
          Términos.
        </p>

        <h2>10. Limitación de Responsabilidad</h2>
        <p>
          En la máxima medida permitida por la ley aplicable, dvran-company y
          sus directores, empleados o afiliados no serán responsables de
          daños indirectos, incidentales, especiales, consecuentes o
          punitivos que resulten de tu acceso o uso de la Aplicación. Esta
          limitación no excluye la responsabilidad que la ley no permite
          excluir ni los derechos que te correspondan como consumidor.
        </p>

        <h2>11. Cambios a Estos Términos</h2>
        <p>
          Podemos actualizar estos Términos para reflejar cambios en la
          Aplicación. Publicaremos la nueva versión en esta página con su
          fecha de &quot;Última actualización&quot;. Los cambios no modifican
          las condiciones de un pedido que ya mandaste.
        </p>

        <h2>12. Contáctanos</h2>
        <p>
          Si tienes alguna pregunta sobre estos Términos, por favor contáctanos
          en:
          <br />
          <a href="mailto:vichenteapp@gmail.com">vichenteapp@gmail.com</a>
          <br />
          dvran-company
        </p>
      </div>
    </main>
  );
}
