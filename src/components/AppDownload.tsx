import React from "react";
import styled from "@emotion/styled";
import { SmartphoneIcon, GlobeIcon } from "./Icons";

const AppDownloadSection = styled.section`
  background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
  padding: 4rem 0;
  position: relative;
  overflow: hidden;

  @media (min-width: 640px) {
    padding: 5rem 0;
  }
`;

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  align-items: center;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const TextContent = styled.div`
  text-align: center;

  @media (min-width: 768px) {
    text-align: left;
  }
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 800;
  color: white;
  margin-bottom: 1rem;

  @media (min-width: 640px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.125rem;
  color: #dcfce7;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;

  @media (min-width: 768px) {
    align-items: flex-start;
  }

  @media (min-width: 640px) {
    flex-direction: row;
    gap: 1.5rem;
  }
`;

const WebAppButton = styled.a`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background-color: white;
  color: #1f2937;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px -8px rgb(0 0 0 / 0.3);
    background-color: #f9fafb;
  }
`;

const ComingSoonButton = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 600;
  border: 1px solid rgba(255, 255, 255, 0.3);
  opacity: 0.8;
`;

const ButtonText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.2;
`;

const ButtonSubtext = styled.span`
  font-size: 0.75rem;
  font-weight: 400;
  opacity: 0.8;
`;

const ButtonMaintext = styled.span`
  font-size: 1rem;
  font-weight: 600;
`;

const PhoneVisual = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const PhoneFrame = styled.div`
  background: linear-gradient(145deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 2rem;
  padding: 1.5rem;
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1),
    0 10px 10px -5px rgb(0 0 0 / 0.04);
  transform: rotate(-5deg);

  @media (min-width: 768px) {
    transform: rotate(5deg);
  }
`;

const PhoneScreen = styled.div`
  background: #1f2937;
  border-radius: 1.5rem;
  padding: 2rem 1.5rem;
  color: white;
  width: 200px;
  height: 350px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const AppIcon = styled.div`
  background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
  border-radius: 1rem;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const AppName = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const AppTagline = styled.p`
  font-size: 0.875rem;
  opacity: 0.8;
  line-height: 1.4;
`;

const StyledGlobeIcon = styled(GlobeIcon)`
  height: 1.5rem;
  width: 1.5rem;
`;

const StyledSmartphoneIcon = styled(SmartphoneIcon)`
  height: 2rem;
  width: 2rem;
  color: white;
`;

const StyledSmartphoneIconApp = styled(SmartphoneIcon)`
  height: 1.5rem;
  width: 1.5rem;
  color: white;
`;

const AppDownload: React.FC = () => {
  return (
    <AppDownloadSection id="download">
      <Container>
        <ContentWrapper>
          <TextContent>
            <Title>¡Entra a Vichente App!</Title>
            <Subtitle>
              Tu app web está lista. Encuentra negocios, haz pedidos
              y conecta con tu ciudad desde cualquier dispositivo.
            </Subtitle>
            <ButtonsWrapper>
              <WebAppButton
                href="https://app.vichente.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <StyledGlobeIcon />
                <ButtonText>
                  <ButtonSubtext>Entrar ahora</ButtonSubtext>
                  <ButtonMaintext>Abrir App Web</ButtonMaintext>
                </ButtonText>
              </WebAppButton>
              <ComingSoonButton>
                <StyledSmartphoneIconApp />
                <ButtonText>
                  <ButtonSubtext>Próximamente</ButtonSubtext>
                  <ButtonMaintext>Apps Móviles</ButtonMaintext>
                </ButtonText>
              </ComingSoonButton>
            </ButtonsWrapper>
          </TextContent>

          <PhoneVisual>
            <PhoneFrame>
              <PhoneScreen>
                <AppIcon>
                  <StyledSmartphoneIcon />
                </AppIcon>
                <AppName>Vichente App</AppName>
                <AppTagline>Tu ciudad al alcance de tu mano</AppTagline>
              </PhoneScreen>
            </PhoneFrame>
          </PhoneVisual>
        </ContentWrapper>
      </Container>
    </AppDownloadSection>
  );
};

export default AppDownload;
