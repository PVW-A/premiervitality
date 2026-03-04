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

interface EmailChangeEmailProps {
  siteName: string
  email: string
  newEmail: string
  confirmationUrl: string
}

export const EmailChangeEmail = ({
  siteName,
  email,
  newEmail,
  confirmationUrl,
}: EmailChangeEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Confirm your email change — Premier Vitality</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={monogram}>PV</Text>
        <Hr style={divider} />
        <Heading style={h1}>Confirm Email Change</Heading>
        <Text style={text}>
          You requested to update your Premier Vitality email from{' '}
          <Link href={`mailto:${email}`} style={link}>
            {email}
          </Link>{' '}
          to{' '}
          <Link href={`mailto:${newEmail}`} style={link}>
            {newEmail}
          </Link>
          .
        </Text>
        <Text style={text}>
          Confirm this change by clicking below:
        </Text>
        <Button style={button} href={confirmationUrl}>
          Confirm Email Change
        </Button>
        <Text style={footer}>
          If you didn't request this change, please secure your account
          immediately.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default EmailChangeEmail

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
