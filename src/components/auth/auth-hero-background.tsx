"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";

// Catálogo com as novas artes oficiais enviadas em alta resolução (Void/Dark Fantasy)
const curatedArtworks: string[] = [
  "/auth-art/login-background/auth-new-01.jpg",
  "/auth-art/login-background/auth-new-02.jpg",
  "/auth-art/login-background/auth-new-03.jpg",
  "/auth-art/login-background/auth-new-04.jpg",
];

export function AuthHeroBackground() {
  const [selectedArt, setSelectedArt] = useState<string>(curatedArtworks[0]);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * curatedArtworks.length);
    setSelectedArt(curatedArtworks[randomIndex]);
  }, []);

  return (
    <div className="fixed inset-0 z-0 w-full h-full overflow-hidden bg-[#070312]">
      <Image
        src={selectedArt}
        alt="YGGNAROK Authentication Background"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center transition-opacity duration-700 ease-in-out"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#06030e]/20 via-[#090416]/55 to-[#05020f]/95 z-10 pointer-events-none" />
    </div>
  );
}

export default AuthHeroBackground;
