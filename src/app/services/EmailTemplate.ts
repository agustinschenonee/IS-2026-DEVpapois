// Genera el HTML de los mails de notificación de reservas.
// Recibe los datos del turno y devuelve un email prolijo con tabla de detalles.

interface DatosReserva {
    nombreUsuario: string;
    nombreRecurso: string;
    fecha: string;
    horaInicio: string;
    horaFin: string;
    accion: 'reservada' | 'cancelada';
}

export function generarHtmlReserva(datos: DatosReserva): string {
    const { nombreUsuario, nombreRecurso, fecha, horaInicio, horaFin, accion } = datos;

    const esCancelacion = accion === 'cancelada';
    const colorAccion = esCancelacion ? '#dc2626' : '#16a34a';
    const tituloAccion = esCancelacion ? 'Reserva cancelada' : 'Reserva confirmada';
    const fechaFormateada = new Date(fecha + 'T00:00:00').toLocaleDateString('es-AR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return `
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
</head>
<body style="margin:0; padding:0; background-color:#f4f4f7; font-family: Arial, Helvetica, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f7; padding: 32px 0;">
    <tr>
      <td align="center">
        <table width="500" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background-color:#1e293b; padding: 24px 32px;">
              <span style="color:#ffffff; font-size: 20px; font-weight: bold;">DevPapois Coworking</span>
            </td>
          </tr>

          <!-- Banda de estado -->
          <tr>
            <td style="background-color:${colorAccion}; padding: 14px 32px;">
              <span style="color:#ffffff; font-size: 16px; font-weight: bold;">${tituloAccion}</span>
            </td>
          </tr>

          <!-- Cuerpo -->
          <tr>
            <td style="padding: 28px 32px;">
              <p style="font-size: 15px; color:#1e293b; margin: 0 0 20px 0;">
                Hola ${nombreUsuario}, te confirmamos que tu reserva fue <strong>${accion}</strong>. Estos son los detalles:
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin-bottom: 8px;">
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color:#64748b; font-size: 14px; width: 40%;">Espacio</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color:#1e293b; font-size: 14px; font-weight: bold;">${nombreRecurso}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color:#64748b; font-size: 14px;">Fecha</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color:#1e293b; font-size: 14px; font-weight: bold; text-transform: capitalize;">${fechaFormateada}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color:#64748b; font-size: 14px;">Horario</td>
                  <td style="padding: 10px 0; color:#1e293b; font-size: 14px; font-weight: bold;">${horaInicio} a ${horaFin}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 18px 32px; background-color:#f8fafc; border-top: 1px solid #e5e7eb;">
              <span style="font-size: 12px; color:#94a3b8;">Este es un mensaje automático de DevPapois Coworking. No respondas a este email.</span>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim();
}