import React from "react";
import styled from "@emotion/styled";
import { SearchIcon, ListBulletIcon, PhoneIcon } from "./Icons";

const HowItWorksSection = styled.section`
  padding: 5rem 0;
  background-color: #f9fafb;
`;

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const SectionTitle = styled.h2`
  font-size: 2.25rem;
  font-weight: 800;
`;

const SectionSubtitle = styled.p`
  margin-top: 0.75rem;
  max-width: 42rem;
  margin-left: auto;
  margin-right: auto;
  font-size: 1.125rem;
  color: #6b7281;
`;

const StepsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  max-width: 64rem;
  margin: 0 auto;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const StepContainer = styled.div``;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 4rem;
  width: 4rem;
  border-radius: 9999px;
  background-color: #dcfce7;
  color: #16a34a;
  margin-bottom: 1.5rem;
  margin-left: auto;
  margin-right: auto;
`;

const StepTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  text-align: center;
`;

const StepText = styled.p`
  color: #4b5563;
  text-align: center;
`;

const SizedSearchIcon = styled(SearchIcon)`
  width: 2rem;
  height: 2rem;
`;
const SizedListBulletIcon = styled(ListBulletIcon)`
  width: 2rem;
  height: 2rem;
`;
const SizedPhoneIcon = styled(PhoneIcon)`
  width: 2rem;
  height: 2rem;
`;

const Step: React.FC<{
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}> = ({ icon, title, children }) => {
  return (
    <StepContainer>
      <IconWrapper>{icon}</IconWrapper>
      <StepTitle>{title}</StepTitle>
      <StepText>{children}</StepText>
    </StepContainer>
  );
};

const HowItWorks: React.FC = () => {
  return (
    <HowItWorksSection id="how-it-works">
      <Container>
        <SectionHeader>
          <SectionTitle>Así de fácil funciona</SectionTitle>
          <SectionSubtitle>
            En tres sencillos pasos, conectas con lo que necesitas en Durango.
          </SectionSubtitle>
        </SectionHeader>
        <StepsGrid>
          <Step icon={<SizedSearchIcon />} title="1. Busca lo que necesitas">
            Usa nuestro directorio para encontrar restaurantes, servicios o
            tiendas cerca de ti.
          </Step>
          <Step icon={<SizedListBulletIcon />} title="2. Explora las opciones">
            Revisa la información de los negocios: qué ofrecen, sus horarios y
            ubicación.
          </Step>
          <Step icon={<SizedPhoneIcon />} title="3. Llama y pide">
            Contacta directamente al negocio con un solo clic para hacer tu
            pedido o consulta.
          </Step>
        </StepsGrid>
      </Container>
    </HowItWorksSection>
  );
};

export default HowItWorks;
