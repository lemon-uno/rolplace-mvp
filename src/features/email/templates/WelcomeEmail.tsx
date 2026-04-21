import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Link,
  Preview,
  Hr,
} from '@react-email/components';

interface WelcomeEmailProps {
  userName: string;
  appName: string;
  loginUrl: string;
}

export default function WelcomeEmail({
  userName = 'Usuario',
  appName = 'Rolplace',
  loginUrl = 'http://localhost:3000/login',
}: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Bienvenido a {appName} — Tu marketplace de autos</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={headerText}>{appName}</Text>
          </Section>

          <Section style={content}>
            <Text style={heading}>Bienvenido, {userName}</Text>
            <Text style={paragraph}>
              Tu cuenta esta lista. Ya puedes publicar autos, contactar vendedores y encontrar tu proximo vehiculo.
            </Text>

            <Section style={buttonContainer}>
              <Link href={loginUrl} style={button}>
                Acceder a {appName}
              </Link>
            </Section>
          </Section>

          <Hr style={divider} />

          <Section style={footer}>
            <Text style={footerText}>
              Recibiste este email porque creaste una cuenta en {appName}.
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
  backgroundColor: '#09090b',
  padding: '24px 32px',
  borderRadius: '12px 12px 0 0',
  textAlign: 'center' as const,
};

const headerText: React.CSSProperties = {
  color: '#f4f4f5',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: 0,
};

const content: React.CSSProperties = {
  backgroundColor: '#18181b',
  padding: '32px',
};

const heading: React.CSSProperties = {
  color: '#f4f4f5',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 16px 0',
};

const paragraph: React.CSSProperties = {
  color: '#a1a1aa',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 24px 0',
};

const buttonContainer: React.CSSProperties = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button: React.CSSProperties = {
  backgroundColor: '#683ACC',
  color: '#ffffff',
  padding: '12px 32px',
  borderRadius: '8px',
  textDecoration: 'none',
  fontSize: '16px',
  fontWeight: 'bold',
};

const divider: React.CSSProperties = {
  borderColor: '#27272a',
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
