import React from "react";
import styled from "@emotion/styled";
import Link from "next/link";

const Cta = styled.section`
  background-color: #15803d;
  padding: 4rem 0;

  @media (min-width: 640px) {
    padding: 5rem 0;
  }
`;

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const CtaContainer = styled.div`
  text-align: center;
`;

const Title = styled.h2`
  font-size: 1.875rem;
  font-weight: 800;
  color: white;

  @media (min-width: 640px) {
    font-size: 2.25rem;
  }
`;

const Subtitle = styled.p`
  margin-top: 1rem;
  font-size: 1.125rem;
  color: #dcfce7;
  max-width: 42rem;
  margin-left: auto;
  margin-right: auto;
`;

const ButtonWrapper = styled.div`
  margin-top: 2rem;
`;

const Button = styled(Link)`
  display: inline-block;
  background-color: white;
  color: #15803d;
  font-weight: 700;
  font-size: 1.125rem;
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  transition: all 0.3s ease;
  text-decoration: none;

  &:hover {
    background-color: #f0fdf4;
    transform: scale(1.05);
  }
`;

const CtaSection: React.FC = () => {
  return (
    <Cta id="cta">
      <Container>
        <CtaContainer>
          <Title>¿Tienes un negocio en Durango?</Title>
          <Subtitle>
            Únete a nuestra plataforma y llega a más clientes locales. El
            registro es rápido, fácil y completamente gratis.
          </Subtitle>
          <ButtonWrapper>
            <Button href="https://app.vichente.com/business-registration" target="_blank" rel="noopener noreferrer">¡Registrar mi negocio ahora!</Button>
          </ButtonWrapper>
        </CtaContainer>
      </Container>
    </Cta>
  );
};

export default CtaSection;
