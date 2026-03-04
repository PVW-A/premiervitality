/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface SignupEmailProps {
  siteName: string
  siteUrl: string
  recipient: string
  confirmationUrl: string
}

export const SignupEmail = ({
  siteName,
  siteUrl,
  recipient,
  confirmationUrl,
}: SignupEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Verify your email — Premier Vitality</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={monogram}>PV</Text>
        <Hr style={divider} />
        <Heading style={h1}>Welcome to Premier Vitality</Heading>
        <Text style={text}>
          You're one step away from accessing your personalized peptide protocols
          and clinical concierge care.
        </Text>
        <Text style={text}>
          Verify your email address (
          <Link href={`mailto:${recipient}`} style={link}>
            {recipient}
          </Link>
          ) to activate your account:
        </Text>
        <Button style={button} href={confirmationUrl}>
          Verify Email
        </Button>
        <Text style={footer}>
          If you didn't create an account with Premier Vitality, you can safely
          ignore this email.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default SignupEmail

const main = {
  backgroundColor: '#ffffff',
  fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
}
const container = {
  padding: '40px 32px',
  maxWidth: '480px',
  margin: '0 auto',
}
const monogram = {
  fontFamily: "'Georgia', 'Times New Roman', serif",
  fontSize: '28px',
  fontWeight: '300' as const,
  fontStyle: 'italic' as const,
  color: '#C6A96B',
  letterSpacing: '-2px',
  margin: '0 0 16px',
}
const divider = {
  borderColor: '#C6A96B',
  borderWidth: '0.5px',
  margin: '0 0 28px',
  opacity: 0.4,
}
const h1 = {
  fontFamily: "'Georgia', 'Times New Roman', serif",
  fontSize: '24px',
  fontWeight: '300' as const,
  color: '#1A2332',
  margin: '0 0 20px',
  letterSpacing: '0.5px',
}
const text = {
  fontSize: '14px',
  color: '#6B7280',
  lineHeight: '1.6',
  margin: '0 0 20px',
}
const link = { color: '#C6A96B', textDecoration: 'underline' }
const button = {
  backgroundColor: '#1A2332',
  color: '#C6A96B',
  fontSize: '13px',
  fontWeight: '500' as const,
  letterSpacing: '1.5px',
  textTransform: 'uppercase' as const,
  borderRadius: '0px',
  padding: '14px 28px',
  textDecoration: 'none',
}
const footer = {
  fontSize: '12px',
  color: '#9CA3AF',
  margin: '32px 0 0',
  lineHeight: '1.5',
}
