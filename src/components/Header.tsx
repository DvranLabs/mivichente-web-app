import React from "react";
import styled from "@emotion/styled";
import Link from "next/link";
import Image from "next/image";

const StyledHeader = styled.header`
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  padding: 0.75rem 0;
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;

  @media (min-width: 768px) {
    padding: 0 1.5rem;
  }
`;

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
`;

const LogoText = styled.span`
  display: none;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;

  @media (min-width: 768px) {
    display: block;
    font-size: 1.5rem;
  }
`;

const LogoImage = styled(Image)`
  border-radius: 0.25rem;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const NavLink = styled(Link)`
  color: #4b5563;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s ease-in-out;

  &:hover {
    color: #16a34a;
  }

  @media (max-width: 767px) {
    display: none;
  }
`;

const CtaButton = styled(Link)`
  background-color: #16a34a;
  color: white;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: background-color 0.2s ease-in-out;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  text-decoration: none;

  &:hover {
    background-color: #15803d;
  }
`;

const MobileCtaButton = styled(Link)`
  background-color: #16a34a;
  color: white;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: background-color 0.2s ease-in-out;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  text-decoration: none;
  font-size: 0.875rem;

  &:hover {
    background-color: #15803d;
  }

  @media (min-width: 768px) {
    display: none;
  }
`;

const Header: React.FC = () => {
  return (
    <StyledHeader>
      <HeaderContent>
        <LogoLink href="/">
          <LogoImage
            src="/logo-vichenteapp-48.png"
            alt="Vichente App Logo"
            width={40}
            height={40}
          />
          <LogoText>Vichente App</LogoText>
        </LogoLink>

        <Nav>
          <NavLink href="https://app.vichente.com" target="_blank" rel="noopener noreferrer">
            Para Negocios
          </NavLink>
          <CtaButton href="https://app.vichente.com" target="_blank" rel="noopener noreferrer">
            Registra tu Negocio
          </CtaButton>
        </Nav>
      </HeaderContent>
    </StyledHeader>
  );
};

export default Header;