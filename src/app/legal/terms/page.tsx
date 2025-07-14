import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Términos y Condiciones',
};

export default function TermsAndConditionsPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="prose prose-lg max-w-4xl mx-auto">
        <h1>Términos y Condiciones</h1>
        <p>
          <strong>Fecha de efectividad:</strong> [Fecha de Efectividad]
        </p>

        <p>
          Estos Términos y Condiciones (&quot;Términos&quot;) rigen tu acceso y uso de la
          aplicación móvil [Nombre de la App] (la &quot;Aplicación&quot;). Al descargar,
          acceder o utilizar la Aplicación, aceptas estar sujeto a estos
          Términos.
        </p>

        <h2>1. Uso de la Aplicación</h2>
        <p>
          [Nombre de la App] te proporciona un directorio de negocios que
          incluye información como números de teléfono y ubicaciones a través
          de Google Maps. Aceptas utilizar la Aplicación solo para fines lícitos
          y de acuerdo con estos Términos.
        </p>

        <h2>2. Derechos de Propiedad Intelectual</h2>
        <p>
          La Aplicación y su contenido original, características y
          funcionalidad son y seguirán siendo propiedad exclusiva de [Tu Nombre
          o Nombre de la Empresa] y sus licenciantes.
        </p>

        <h2>3. Contenido de Terceros</h2>
        <p>
          La Aplicación puede mostrar, incluir o poner a disposición contenido
          de terceros (incluidos datos, información, aplicaciones y otros
          servicios de productos) o proporcionar enlaces a sitios web o
          servicios de terceros (&quot;Contenido de Terceros&quot;).
        </p>
        <p>
          Reconoces y aceptas que Vichente App no será responsable de
          ningún Contenido de Terceros, incluida su precisión, integridad,
          puntualidad, validez, cumplimiento de derechos de autor, legalidad,
          decencia, calidad o cualquier otro aspecto del mismo. El uso de los
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

        <h2>4. Terminación</h2>
        <p>
          Podemos suspender o terminar tu acceso a la Aplicación de inmediato,
          sin previo aviso ni responsabilidad, por cualquier motivo, incluido,
          entre otros, si incumples estos Térmenos.
        </p>

        <h2>5. Limitación de Responsabilidad</h2>
        <p>
          En la máxima medida permitida por la ley aplicable, en ningún caso
          [Tu Nombre o Nombre de la Empresa] o sus directores, empleados o
          afiliados serán responsables de ningún daño indirecto, incidental,
          especial, consecuente o punitivo que resulte de tu acceso o uso de la
          Aplicación.
        </p>

        <h2>6. Cambios a Estos Términos</h2>
        <p>
          Nos reservamos el derecho, a nuestra sola discreción, de modificar o
          reemplazar estos Términos en cualquier momento. Te notificaremos
          cualquier cambio actualizando la fecha de &quot;Última actualización&quot; de
          estos Términos.
        </p>

        <h2>7. Contáctanos</h2>
        <p>
          Si tienes alguna pregunta sobre estos Términos, por favor contáctanos
          en:
          <br />
          [Tu Email de Contacto]
          <br />
          [Tu Nombre o Nombre de la Empresa]
        </p>
      </div>
    </main>
  );
}