import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Preview,
  Hr,
  Row,
  Column,
  Button,
} from '@react-email/components';

interface CitaEmailProps {
  vehicleTitle: string;
  fecha: string;
  hora: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  whatsappLink: string;
}

export default function CitaEmail({
  vehicleTitle = 'Vehículo',
  fecha = '',
  hora = '',
  contactName = '',
  contactEmail = '',
  contactPhone = '',
  whatsappLink = '#',
}: CitaEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Nueva cita agendada para: {vehicleTitle}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={headerText}>ROLPLACE</Text>
            <Text style={headerSubtext}>Nueva Cita Agendada</Text>
          </Section>

          <Section style={content}>
            <Text style={heading}>CITA PARA CONOCER:</Text>
            <Text style={vehicleName}>{vehicleTitle}</Text>
          </Section>

          <Section style={section}>
            <Text style={sectionTitle}>Fecha y hora</Text>
            <Hr style={sectionDivider} />
            <InfoRow label="Día" value={fecha} />
            <InfoRow label="Hora" value={hora} />
          </Section>

          <Section style={section}>
            <Text style={sectionTitle}>Datos del interesado</Text>
            <Hr style={sectionDivider} />
            <InfoRow label="Nombre" value={contactName} />
            <InfoRow label="Email" value={contactEmail} />
            <InfoRow label="Celular" value={contactPhone} />
          </Section>

          <Section style={{ backgroundColor: '#18181b', padding: '24px 32px', textAlign: 'center' as const }}>
            <Text style={{ color: '#f4f4f5', fontSize: '14px', margin: '0 0 16px 0' }}>
              Confirma la cita por WhatsApp con un clic:
            </Text>
            <Button href={whatsappLink} style={waButton}>
              Confirmar por WhatsApp
            </Button>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              Recibiste esta solicitud de cita a través de Rolplace.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <Row style={infoRow}>
      <Column style={labelCol}><Text style={labelStyle}>{label}</Text></Column>
      <Column style={valueCol}><Text style={valueStyle}>{value || '—'}</Text></Column>
    </Row>
  );
}

const main: React.CSSProperties = {
  backgroundColor: '#0f0f13',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container: React.CSSProperties = {
  maxWidth: '560px',
  margin: '40px auto',
};

const header: React.CSSProperties = {
  backgroundColor: '#1b2064',
  padding: '24px 32px',
  borderRadius: '12px 12px 0 0',
  textAlign: 'center' as const,
};

const headerText: React.CSSProperties = {
  color: '#ffffff',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 4px 0',
};

const headerSubtext: React.CSSProperties = {
  color: '#a5b4fc',
  fontSize: '13px',
  margin: 0,
};

const content: React.CSSProperties = {
  backgroundColor: '#18181b',
  padding: '24px 32px',
};

const heading: React.CSSProperties = {
  color: '#215add',
  fontSize: '13px',
  fontWeight: 'bold',
  letterSpacing: '1px',
  margin: '0 0 4px 0',
};

const vehicleName: React.CSSProperties = {
  color: '#f4f4f5',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: 0,
};

const section: React.CSSProperties = {
  backgroundColor: '#18181b',
  padding: '16px 32px',
};

const sectionTitle: React.CSSProperties = {
  color: '#f4f4f5',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '0 0 4px 0',
};

const sectionDivider: React.CSSProperties = {
  borderColor: '#27272a',
  margin: '0 0 12px 0',
};

const infoRow: React.CSSProperties = {
  marginBottom: '4px',
};

const labelCol: React.CSSProperties = {
  width: '120px',
  verticalAlign: 'top' as const,
};

const valueCol: React.CSSProperties = {
  verticalAlign: 'top' as const,
};

const labelStyle: React.CSSProperties = {
  color: '#71717a',
  fontSize: '13px',
  margin: 0,
};

const valueStyle: React.CSSProperties = {
  color: '#f4f4f5',
  fontSize: '13px',
  margin: 0,
};

const waButton: React.CSSProperties = {
  backgroundColor: '#25D366',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: 'bold',
  padding: '12px 32px',
  borderRadius: '8px',
  textDecoration: 'none',
  display: 'inline-block',
};

const footer: React.CSSProperties = {
  backgroundColor: '#09090b',
  padding: '16px 32px',
  borderRadius: '0 0 12px 12px',
};

const footerText: React.CSSProperties = {
  color: '#71717a',
  fontSize: '12px',
  textAlign: 'center' as const,
  margin: 0,
};
