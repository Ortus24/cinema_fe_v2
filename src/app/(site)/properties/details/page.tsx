import HeroSub from "@/components/shared/HeroSub";
import PropertiesListing from "@/components/Properties/PropertyList";
import React from "react";
import { Metadata } from "next";
import Properties from "@/components/Home/Properties";
import CinemaListing from "@/components/Home/Cinema";
import MovieBooking from "@/components/Home/Properties/Card/MovieDetailCard";
export const metadata: Metadata = {
  title: "Property List | Homely",
};

const page = () => {
  return (
    <>
      <HeroSub
        title="Discover inspiring designed homes."
        description="Experience elegance and comfort with our exclusive luxury  villas, designed for sophisticated living."
        badge="Properties"
      />
      <MovieBooking />
    </>
  );
};

export default page;
