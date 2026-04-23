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
} from '@react-email/components';

interface ContactEmailProps {
  vehicleTitle: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  preferredContact: string;
  message: string;
}

export default function ContactEmail({
  vehicleTitle = 'Vehículo',
  contactName = 'Interesado',
  contactPhone = '',
  contactEmail = '',
  preferredContact = 'whatsapp',
  message = '',
}: ContactEmailProps) {
  const contactLabel: Record<string, string> = {
    whatsapp: 'WhatsApp',
    phone: 'Llamada',
    email: 'Email',
  };

  return (
    <Html>
      <Head />
      <Preview>Nuevo contacto sobre: {vehicleTitle}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={headerText}>ROLPLACE</Text>
            <Text style={headerSubtext}>Nuevo Contacto</Text>
          </Section>

          <Section style={content}>
            <Text style={heading}>INTERESADO EN:</Text>
            <Text style={vehicleName}>{vehicleTitle}</Text>
          </Section>

          <Section style={section}>
            <Text style={sectionTitle}>Datos del interesado</Text>
            <Hr style={sectionDivider} />
            <InfoRow label="Nombre" value={contactName} />
            <InfoRow label="Teléfono" value={contactPhone} />
            <InfoRow label="Email" value={contactEmail} />
            <InfoRow label="Contacto por" value={contactLabel[preferredContact] || preferredContact} />
          </Section>

          {message && (
            <Section style={section}>
              <Text style={sectionTitle}>Mensaje</Text>
              <Hr style={sectionDivider} />
              <Text style={notes}>{message}</Text>
            </Section>
          )}

          <Section style={footer}>
            <Text style={footerText}>
              Recibiste este mensaje a través de Rolplace.
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

const notes: React.CSSProperties = {
  color: '#a1a1aa',
  fontSize: '13px',
  lineHeight: '1.6',
  margin: 0,
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
