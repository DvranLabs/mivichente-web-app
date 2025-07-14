import React from "react";
import styled from "@emotion/styled";
import Link from "next/link";
import { RocketIcon } from "./Icons";

const StyledFooter = styled.footer`
  background-color: #1f2937;
  color: white;
  padding: 2rem 0;
`;

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const FooterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    margin-bottom: 0;
  }
`;

const LogoText = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  justify-content: center;

  @media (min-width: 768px) {
    margin-bottom: 0;
  }
`;

const FooterLink = styled(Link)`
  color: #9ca3af;
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.2s ease;

  &:hover {
    color: white;
  }
`;

const CopyrightContainer = styled.div`
  text-align: center;

  @media (min-width: 768px) {
    text-align: right;
  }
`;

const CopyrightText = styled.p`
  font-size: 0.875rem;
  color: #9ca3af;
`;

const MadeInText = styled.p`
  font-size: 0.75rem;
  color: #6b7281;
  margin-top: 0.25rem;
`;

const StyledRocketIcon = styled(RocketIcon)`
  height: 1.75rem;
  width: 1.75rem;
  color: #22c55e;
`;

const Footer: React.FC = () => {
  return (
    <StyledFooter>
      <Container>
        <FooterContainer>
          <LogoContainer>
            <StyledRocketIcon />
            <LogoText>Vichente App</LogoText>
          </LogoContainer>
          <FooterLinks>
            <FooterLink href="/legal/terms">Términos y Condiciones</FooterLink>
            <FooterLink href="/legal/privacy">
              Política de Privacidad
            </FooterLink>
            <FooterLink href="mailto:contact@vichenteapp.com">
              Contacto
            </FooterLink>
          </FooterLinks>
          <CopyrightContainer>
            <CopyrightText>
              &copy; {new Date().getFullYear()} Vichente App. Todos los derechos
              reservados.
            </CopyrightText>
            <MadeInText>Hecho con ♥ en Durango.</MadeInText>
          </CopyrightContainer>
        </FooterContainer>
      </Container>
    </StyledFooter>
  );
};

export default Footer;
