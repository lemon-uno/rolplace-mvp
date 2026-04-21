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
  Img,
} from '@react-email/components';

interface TomaAutoEmailProps {
  vehicleTitle: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  tradeInMake: string;
  tradeInModel: string;
  tradeInYear: string;
  tradeInTransmission: string;
  tradeInMileage: string;
  tradeInExteriorColor: string;
  tradeInInteriorColor: string;
  paintCondition: string;
  interiorCondition: string;
  engineCondition: string;
  transmissionCondition: string;
  additionalNotes: string;
  photoUrls: string[];
}

export default function TomaAutoEmail({
  vehicleTitle = 'Vehículo',
  contactName = 'Interesado',
  contactPhone = '',
  contactEmail = '',
  tradeInMake = '',
  tradeInModel = '',
  tradeInYear = '',
  tradeInTransmission = '',
  tradeInMileage = '',
  tradeInExteriorColor = '',
  tradeInInteriorColor = '',
  paintCondition = '',
  interiorCondition = '',
  engineCondition = '',
  transmissionCondition = '',
  additionalNotes = '',
  photoUrls = [],
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
            <InfoRow label="Marca" value={tradeInMake} />
            <InfoRow label="Modelo" value={tradeInModel} />
            <InfoRow label="Año" value={tradeInYear} />
            {tradeInTransmission && <InfoRow label="Transmisión" value={tradeInTransmission} />}
            {tradeInMileage && <InfoRow label="Kilometraje" value={`${tradeInMileage} km`} />}
            {tradeInExteriorColor && <InfoRow label="Color Exterior" value={tradeInExteriorColor} />}
            {tradeInInteriorColor && <InfoRow label="Color Interior" value={tradeInInteriorColor} />}
          </Section>

          <Section style={section}>
            <Text style={sectionTitle}>Estado del vehículo</Text>
            <Hr style={sectionDivider} />
            <InfoRow label="Pintura" value={paintCondition} />
            <InfoRow label="Interiores" value={interiorCondition} />
            <InfoRow label="Motor" value={engineCondition} />
            <InfoRow label="Transmisión" value={transmissionCondition} />
          </Section>

          <Section style={section}>
            <Text style={sectionTitle}>Datos de contacto</Text>
            <Hr style={sectionDivider} />
            <InfoRow label="Nombre" value={contactName} />
            <InfoRow label="Teléfono" value={contactPhone} />
            <InfoRow label="Email" value={contactEmail} />
          </Section>

          {photoUrls.length > 0 && (
            <Section style={section}>
              <Text style={sectionTitle}>Fotos del vehículo ({photoUrls.length})</Text>
              <Hr style={sectionDivider} />
              {photoUrls.map((url, i) => (
                <Row key={i} style={{ marginBottom: '8px' }}>
                  <Column>
                    <Img src={url} alt={`Foto ${i + 1}`} style={photoImg} />
                  </Column>
                </Row>
              ))}
            </Section>
          )}

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

const photoImg: React.CSSProperties = {
  maxWidth: '100%',
  borderRadius: '8px',
  marginBottom: '8px',
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
