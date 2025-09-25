import React, { FC } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";

interface HeroSubProps {
  title: string;
  description: string;
  badge: string;
}

const HeroSub: FC<HeroSubProps> = ({ title, description, badge }) => {
  return (
    <>
      <section className="text-center bg-cover !pt-10 pb-10 relative overflow-x-hidden"></section>
    </>
  );
};

export default HeroSub;
