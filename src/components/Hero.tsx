import React from "react";
import styled from "@emotion/styled";

const HeroSection = styled.section`
  background-color: #f0fdf4;
  padding: 5rem 0;
  @media (min-width: 640px) {
    padding: 6rem 0;
  }
  @media (min-width: 768px) {
    padding: 8rem 0;
  }
`;

const HeroContainer = styled.div`
  text-align: center;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const Headline = styled.h1`
  font-size: 2.25rem;
  font-weight: 800;
  line-height: 1.1;
  color: #11182c;
  @media (min-width: 768px) {
    font-size: 3.75rem;
  }
`;

const Highlight = styled.span`
  color: #16a34a;
`;

const Subheadline = styled.p`
  margin-top: 1rem;
  max-width: 42rem;
  margin-left: auto;
  margin-right: auto;
  font-size: 1.125rem;
  color: #4b5563;
  @media (min-width: 768px) {
    font-size: 1.25rem;
  }
`;

const CtaWrapper = styled.div`
  margin-top: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;

  @media (min-width: 640px) {
    flex-direction: row;
    justify-content: center;
    gap: 1.5rem;
  }
`;

const CtaButton = styled.a`
  display: inline-block;
  background-color: #16a34a;
  color: white;
  font-weight: 600;
  font-size: 1.125rem;
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  transition: all 0.2s ease-in-out;
  text-decoration: none;

  &:hover {
    background-color: #15803d;
  }
`;

const SecondaryButton = styled.a`
  display: inline-block;
  background-color: transparent;
  color: #16a34a;
  font-weight: 600;
  font-size: 1.125rem;
  padding: 1rem 2rem;
  border: 2px solid #16a34a;
  border-radius: 0.5rem;
  transition: all 0.2s ease-in-out;
  text-decoration: none;

  &:hover {
    background-color: #16a34a;
    color: white;
  }
`;

const Hero: React.FC = () => {
  return (
    <HeroSection>
      <HeroContainer>
        <Headline>
          Lo mejor de Durango, <Highlight>a una llamada.</Highlight>
        </Headline>
        <Subheadline>
          Encuentra comida, mandados y servicios locales al instante. Apoya el
          comercio de tu ciudad con Vichente App.
        </Subheadline>
        <CtaWrapper>
          <CtaButton href="https://app.vichente.com" target="_blank" rel="noopener noreferrer">Entrar</CtaButton>
          <SecondaryButton href="#how-it-works">Descubre cómo funciona</SecondaryButton>
        </CtaWrapper>
      </HeroContainer>
    </HeroSection>
  );
};

export default Hero;
