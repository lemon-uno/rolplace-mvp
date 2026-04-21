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

interface TomaAutoEmailProps {
  vehicleTitle: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  tradeInMake: string;
  tradeInModel: string;
  tradeInYear: string;
  tradeInVersion: string;
  tradeInColor: string;
  tradeInMileage: string;
  paintCondition: string;
  interiorCondition: string;
  engineCondition: string;
  transmissionCondition: string;
  additionalNotes: string;
}

export default function TomaAutoEmail({
  vehicleTitle = 'Vehículo',
  contactName = 'Interesado',
  contactPhone = '',
  contactEmail = '',
  tradeInMake = '',
  tradeInModel = '',
  tradeInYear = '',
  tradeInVersion = '',
  tradeInColor = '',
  tradeInMileage = '',
  paintCondition = '',
  interiorCondition = '',
  engineCondition = '',
  transmissionCondition = '',
  additionalNotes = '',
}: TomaAutoEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Solicitud de toma de auto para: {vehicleTitle}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={headerText}>ROLPLACE</Text>
            <Text style={headerSubtext}>Solicitud de Toma de Auto</Text>
          </Section>

          <Section style={content}>
            <Text style={heading}>TOMA DE AUTO A CUENTA DE:</Text>
            <Text style={vehicleName}>{vehicleTitle}</Text>
          </Section>

          <Section style={section}>
            <Text style={sectionTitle}>Auto que ofrecen a cuenta</Text>
            <Hr style={sectionDivider} />
            <Row style={infoRow}>
              <Column style={labelCol}><Text style={label}>Marca</Text></Column>
              <Column style={valueCol}><Text style={value}>{tradeInMake || '—'}</Text></Column>
            </Row>
            <Row style={infoRow}>
              <Column style={labelCol}><Text style={label}>Modelo</Text></Column>
              <Column style={valueCol}><Text style={value}>{tradeInModel || '—'}</Text></Column>
            </Row>
            <Row style={infoRow}>
              <Column style={labelCol}><Text style={label}>Año</Text></Column>
              <Column style={valueCol}><Text style={value}>{tradeInYear || '—'}</Text></Column>
            </Row>
            {tradeInVersion && (
              <Row style={infoRow}>
                <Column style={labelCol}><Text style={label}>Versión</Text></Column>
                <Column style={valueCol}><Text style={value}>{tradeInVersion}</Text></Column>
              </Row>
            )}
            {tradeInColor && (
              <Row style={infoRow}>
                <Column style={labelCol}><Text style={label}>Color</Text></Column>
                <Column style={valueCol}><Text style={value}>{tradeInColor}</Text></Column>
              </Row>
            )}
            {tradeInMileage && (
              <Row style={infoRow}>
                <Column style={labelCol}><Text style={label}>Kilometraje</Text></Column>
                <Column style={valueCol}><Text style={value}>{tradeInMileage} km</Text></Column>
              </Row>
            )}
          </Section>

          <Section style={section}>
            <Text style={sectionTitle}>Estado del vehículo</Text>
            <Hr style={sectionDivider} />
            <Row style={infoRow}>
              <Column style={labelCol}><Text style={label}>Pintura</Text></Column>
              <Column style={valueCol}><Text style={value}>{paintCondition || '—'}</Text></Column>
            </Row>
            <Row style={infoRow}>
              <Column style={labelCol}><Text style={label}>Interiores</Text></Column>
              <Column style={valueCol}><Text style={value}>{interiorCondition || '—'}</Text></Column>
            </Row>
            <Row style={infoRow}>
              <Column style={labelCol}><Text style={label}>Motor</Text></Column>
              <Column style={valueCol}><Text style={value}>{engineCondition || '—'}</Text></Column>
            </Row>
            <Row style={infoRow}>
              <Column style={labelCol}><Text style={label}>Transmisión</Text></Column>
              <Column style={valueCol}><Text style={value}>{transmissionCondition || '—'}</Text></Column>
            </Row>
          </Section>

          <Section style={section}>
            <Text style={sectionTitle}>Datos de contacto</Text>
            <Hr style={sectionDivider} />
            <Row style={infoRow}>
              <Column style={labelCol}><Text style={label}>Nombre</Text></Column>
              <Column style={valueCol}><Text style={value}>{contactName}</Text></Column>
            </Row>
            <Row style={infoRow}>
              <Column style={labelCol}><Text style={label}>Teléfono</Text></Column>
              <Column style={valueCol}><Text style={value}>{contactPhone || '—'}</Text></Column>
            </Row>
            <Row style={infoRow}>
              <Column style={labelCol}><Text style={label}>Email</Text></Column>
              <Column style={valueCol}><Text style={value}>{contactEmail || '—'}</Text></Column>
            </Row>
          </Section>

          {additionalNotes && (
            <Section style={section}>
              <Text style={sectionTitle}>Notas adicionales</Text>
              <Hr style={sectionDivider} />
              <Text style={notes}>{additionalNotes}</Text>
            </Section>
          )}

          <Section style={footer}>
            <Text style={footerText}>
              Recibiste esta solicitud a través de Rolplace.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
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

const label: React.CSSProperties = {
  color: '#71717a',
  fontSize: '13px',
  margin: 0,
};

const value: React.CSSProperties = {
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
