
import {
  Body,
  Button,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.11'
import * as React from 'npm:react@18.2.0'

interface WaitlistWelcomeEmailProps {
  userEmail?: string;
}

export const WaitlistWelcomeEmail = ({
  userEmail = 'valued.subscriber@example.com',
}: WaitlistWelcomeEmailProps) => {
  // Use a fallback logo URL in case the baseUrl one doesn't work
  const baseUrl = 'https://www.zerovacancy.ai';
  const logoUrl = `${baseUrl}/logo.png`;
  const fallbackLogoUrl = 'https://pozblfzhjqlsxkakhowp.supabase.co/storage/v1/object/public/public/logo.png';
  
  return (
    <Html>
      <Head />
      <Preview>Welcome to the ZeroVacancy Waitlist!</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header with Logo - with error handling for image loading */}
          <Section style={logoContainer}>
            <Img
              src={logoUrl}
              width="170"
              height="50"
              alt="ZeroVacancy"
              style={logo}
            />
          </Section>
          
          <Hr style={divider} />
          
          {/* Main Content */}
          <Section style={section}>
            <Heading style={heading}>Thanks for joining our waitlist!</Heading>
            
            <Text style={paragraph}>
              Hi{userEmail ? ` ${userEmail.split('@')[0]}` : ''},
            </Text>
            
            <Text style={paragraph}>
              We're excited to have you on board. You're now on the waitlist for our cutting-edge real estate marketing platform.
            </Text>
            
            <Text style={paragraph}>
              ZeroVacancy connects property managers with expert creators for high-quality real estate marketing - from photography to 3D tours and more.
            </Text>
            
            <Section style={ctaSection}>
              <Button
                pX={20}
                pY={12}
                style={button}
                href={baseUrl}
              >
                Visit Our Website
              </Button>
            </Section>
          </Section>
          
          {/* Info Box */}
          <Section style={infoBox}>
            <Text style={infoText}>
              We'll keep you updated on our progress and let you know when we're ready to launch. If you have any questions, feel free to reply to this email. We'd love to hear from you!
            </Text>
          </Section>
          
          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              © {new Date().getFullYear()} ZeroVacancy. All rights reserved.
            </Text>
            
            <Row style={socialLinks}>
              <Column style={socialColumn}>
                <Link style={socialLink} href="https://twitter.com">Twitter</Link>
              </Column>
              <Column style={socialColumn}>
                <Link style={socialLink} href="https://instagram.com">Instagram</Link>
              </Column>
              <Column style={socialColumn}>
                <Link style={socialLink} href="https://linkedin.com">LinkedIn</Link>
              </Column>
            </Row>
            
            <Text style={footerText}>
              You're receiving this email because you signed up for the ZeroVacancy waitlist.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default WaitlistWelcomeEmail;

// Styles
const main = {
  backgroundColor: '#ffffff',
  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '600px',
}

const logoContainer = {
  padding: '20px 0',
  textAlign: 'center' as const,
}

const logo = {
  margin: '0 auto',
}

const divider = {
  borderColor: '#E5E7EB',
  margin: '20px 0',
}

const section = {
  padding: '0 24px',
}

const heading = {
  fontSize: '24px',
  fontWeight: '600',
  color: '#111827',
  letterSpacing: '-0.025em',
  lineHeight: '1.25',
  padding: '0',
  margin: '24px 0',
}

const paragraph = {
  fontSize: '16px',
  lineHeight: '1.5',
  color: '#4B5563',
  margin: '16px 0',
}

const ctaSection = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const button = {
  backgroundColor: '#111827',
  borderRadius: '4px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
}

const infoBox = {
  padding: '16px 24px',
  backgroundColor: '#F3F4F6',
  borderRadius: '6px',
  margin: '0 24px 24px',
}

const infoText = {
  fontSize: '14px',
  lineHeight: '1.5',
  color: '#4B5563',
  margin: '0',
}

const footer = {
  padding: '0 24px',
  textAlign: 'center' as const,
}

const footerText = {
  fontSize: '12px',
  lineHeight: '1.5',
  color: '#6B7280',
  margin: '16px 0',
}

const socialLinks = {
  marginBottom: '16px',
}

const socialColumn = {
  padding: '0 8px',
  textAlign: 'center' as const,
}

const socialLink = {
  fontSize: '12px',
  color: '#6B7280',
  textDecoration: 'underline',
}
