import React, { useState } from "react";
import styled from "@emotion/styled";
import Link from "next/link";
import { RocketIcon, MenuIcon, CloseIcon } from "./Icons";

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
  z-index: 51;
`;

const LogoText = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;

  @media (min-width: 768px) {
    font-size: 1.5rem;
  }
`;

const MobileMenuButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border: none;
  background: none;
  cursor: pointer;
  z-index: 101;
  color: #1f2937;
  position: relative;

  @media (min-width: 768px) {
    display: none;
  }
`;

const NavLinks = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  font-size: 1.25rem;
  transform: ${({ isOpen }) => (isOpen ? "translateX(0)" : "translateX(100%)")};
  transition: transform 0.3s ease-in-out;
  z-index: 99;
  visibility: ${({ isOpen }) => (isOpen ? "visible" : "hidden")};
  opacity: ${({ isOpen }) => (isOpen ? "1" : "0")};
  padding: 2rem;

  @media (min-width: 768px) {
    position: static;
    background: none;
    flex-direction: row;
    gap: 2rem;
    transform: none;
    font-size: 1rem;
    z-index: auto;
    visibility: visible;
    opacity: 1;
    padding: 0;
  }
`;

const NavLink = styled(Link)`
  color: #1f2937 !important;
  font-weight: 500;
  transition: color 0.2s ease-in-out;
  padding: 1rem;
  text-decoration: none;
  opacity: 1;

  &:hover {
    color: #16a34a !important;
  }

  &:visited {
    color: #1f2937 !important;
  }

  @media (min-width: 768px) {
    color: #4b5563 !important;
    padding: 0;

    &:visited {
      color: #4b5563 !important;
    }

    &:hover {
      color: #16a34a !important;
    }
  }
`;

const CtaButton = styled(Link)`
  background-color: #16a34a !important;
  color: white !important;
  font-weight: 600;
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  transition: background-color 0.2s ease-in-out;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  text-decoration: none;
  display: inline-block;
  border: none;
  opacity: 1;

  &:hover {
    background-color: #15803d !important;
    color: white !important;
  }

  &:focus {
    background-color: #16a34a !important;
    color: white !important;
  }

  &:visited {
    color: white !important;
  }

  @media (min-width: 768px) {
    padding: 0.5rem 1rem;
  }
`;

const StyledRocketIcon = styled(RocketIcon)`
  height: 1.75rem;
  width: 1.75rem;
  color: #16a34a;

  @media (min-width: 768px) {
    height: 2rem;
    width: 2rem;
  }
`;

const StyledMenuIcon = styled(MenuIcon)`
  height: 1.5rem;
  width: 1.5rem;
`;

const StyledCloseIcon = styled(CloseIcon)`
  height: 1.5rem;
  width: 1.5rem;
`;

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <StyledHeader>
      <HeaderContent>
        <LogoLink href="/" onClick={closeMenu}>
          <StyledRocketIcon />
          <LogoText>Vichente App</LogoText>
        </LogoLink>

        <MobileMenuButton onClick={toggleMenu}>
          {isMenuOpen ? <StyledCloseIcon /> : <StyledMenuIcon />}
        </MobileMenuButton>

        <NavLinks isOpen={isMenuOpen}>
          <NavLink href="#negocios" onClick={closeMenu}>
            Para Negocios
          </NavLink>
          <NavLink href="#download" onClick={closeMenu}>
            Descargar App
          </NavLink>
          <CtaButton href="#cta" onClick={closeMenu}>
            Registra tu Negocio
          </CtaButton>
        </NavLinks>
      </HeaderContent>
    </StyledHeader>
  );
};

export default Header;
