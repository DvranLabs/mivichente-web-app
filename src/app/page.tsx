"use client";

import React from "react";
import { Global, css } from "@emotion/react";
import styled from "@emotion/styled";

import Header from "../components/Header";
import Hero from "../components/Hero";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";
import AppDownload from "../components/AppDownload";
import CtaSection from "../components/CtaSection";
import Footer from "../components/Footer";

const GlobalStyles = () => (
  <Global
    styles={css`
      *,
      *::before,
      *::after {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      html {
        scroll-behavior: smooth;
      }

      body {
        font-family: "Inter", sans-serif;
        background-color: #f9fafb;
        color: #1f2937;
        line-height: 1.5;
        -webkit-font-smoothing: antialiased;
      }

      a {
        color: inherit;
        text-decoration: none;
      }

      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        color: #11182c;
      }
    `}
  />
);

const AppWrapper = styled.div`
  min-height: 100vh;
`;

export default function HomePage() {
  return (
    <AppWrapper>
      <GlobalStyles />
      <Header />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <AppDownload />
        <CtaSection />
      </main>
      <Footer />
    </AppWrapper>
  );
}
