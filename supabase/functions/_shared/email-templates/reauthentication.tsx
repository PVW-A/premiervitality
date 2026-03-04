/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface ReauthenticationEmailProps {
  token: string
}

export const ReauthenticationEmail = ({ token }: ReauthenticationEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your verification code — Premier Vitality</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={monogram}>PV</Text>
        <Hr style={divider} />
        <Heading style={h1}>Verification Code</Heading>
        <Text style={text}>
          Use the code below to confirm your identity:
        </Text>
        <Text style={codeStyle}>{token}</Text>
        <Text style={footer}>
          This code will expire shortly. If you didn't request this, you can
          safely ignore this email.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default ReauthenticationEmail

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
const codeStyle = {
  fontFamily: "'Courier New', Courier, monospace",
  fontSize: '28px',
  fontWeight: 'bold' as const,
  color: '#1A2332',
  letterSpacing: '4px',
  margin: '0 0 30px',
}
const footer = {
  fontSize: '12px',
  color: '#9CA3AF',
  margin: '32px 0 0',
  lineHeight: '1.5',
}
