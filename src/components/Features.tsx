import React from "react";
import styled from "@emotion/styled";
import { UserGroupIcon, BuildingStorefrontIcon } from "./Icons";

const FeaturesSection = styled.section`
  padding: 5rem 0;
  background-color: white;
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

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
  max-width: 56rem;
  margin: 0 auto;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Card = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 0.75rem;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  border: 1px solid #f3f4f6;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-0.5rem);
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 4rem;
  width: 4rem;
  border-radius: 9999px;
  background-color: #dcfce7;
  margin-bottom: 1.5rem;
`;

const CardTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
`;

const CardText = styled.p`
  color: #4b5563;
`;

const StyledUserGroupIcon = styled(UserGroupIcon)`
  height: 2rem;
  width: 2rem;
  color: #16a34a;
`;

const StyledBuildingStorefrontIcon = styled(BuildingStorefrontIcon)`
  height: 2rem;
  width: 2rem;
  color: #16a34a;
`;

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}> = ({ icon, title, children }) => {
  return (
    <Card>
      <IconWrapper>{icon}</IconWrapper>
      <CardTitle>{title}</CardTitle>
      <CardText>{children}</CardText>
    </Card>
  );
};

const Features: React.FC = () => {
  return (
    <FeaturesSection id="negocios">
      <Container>
        <SectionHeader>
          <SectionTitle>Una plataforma para todos</SectionTitle>
          <SectionSubtitle>
            Conectamos a la comunidad de Durango de forma simple y directa.
          </SectionSubtitle>
        </SectionHeader>
        <FeaturesGrid>
          <FeatureCard icon={<StyledUserGroupIcon />} title="Para los Usuarios">
            Encuentra fácil y rápido lo que necesitas cerca de ti. Comida,
            servicios, tiendas y más, todo en un solo lugar y listos para
            recibir tu llamada.
          </FeatureCard>
          <FeatureCard
            icon={<StyledBuildingStorefrontIcon />}
            title="Para los Negocios"
          >
            Obtén mayor visibilidad y más llamadas de clientes locales de forma
            gratuita. Sé parte del directorio digital que tu ciudad necesita.
          </FeatureCard>
        </FeaturesGrid>
      </Container>
    </FeaturesSection>
  );
};

export default Features;
