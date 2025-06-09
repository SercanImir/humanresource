import React from "react";
import {Navbar} from "./Navbar.tsx";
import HeroSection from "./HeroSection.tsx";
import {ReferencesSection} from "./ReferencesSection.tsx";
import CommentSection from "./CommentSection.tsx";
import {Footer} from "./Footer.tsx";
import {FeaturesSection} from "./FeaturesSection.tsx";



export const HomePage: React.FC = () => (
    <>
            <Navbar/>
            <HeroSection/>
            <ReferencesSection/>
            <CommentSection/>
            <FeaturesSection/>
            <Footer/>


    </>
);