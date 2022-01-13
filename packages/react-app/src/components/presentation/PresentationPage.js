import React from 'react'
import PresentationCarousel from "./PresentationCarousel";
import Presentation from "./Presentation";
import Contact from "./Contact";
import Partenaire from "./Partenaire";

function PresentationPage() {
    return (
        <div>
            <PresentationCarousel/>
            <Contact/>
            <Presentation/>
            <Partenaire/>
        </div>
    )
}

export default PresentationPage;
