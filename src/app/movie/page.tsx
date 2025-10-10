"use client";
import HeroSub from "@/components/shared/HeroSub";
import React, { useEffect, useState } from "react";

export default function MovieDetail() {
  return (
    <>
      <HeroSub
        title="Residential Homes."
        description="Experience elegance and comfort with our exclusive luxury  villas, designed for sophisticated living."
        badge="Properties"
      />
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Video + Poster */}
        <div className="relative w-full h-[500px] rounded-xl overflow-hidden shadow-md">
          <video
            className="absolute inset-0 w-full h-full object-cover z-0"
            src="https://cinema-minio.onrender.com/cinema-bucket/movie/conan/541eae8d-85db-4a10-8656-9625f5f53cb8-conantrailer.mp4"
            title="Trailer phim"
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="absolute inset-0 bg-black/10 z-10"></div>
          <div className="absolute bottom-4 left-4 w-40 h-56 rounded-lg overflow-hidden shadow-lg z-20 border-2 border-white">
            <img
              src="/images/categories/conan.jpg"
              alt="Poster phim"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute bottom-4 left-48 text-white z-20">
            <h2 className="text-2xl font-bold">Thám Tử Lừng Danh Conan</h2>
            <p className="text-white/80">
              Dư Ảnh Của Độc Nhãn – Khởi chiếu 25/07/2025
            </p>
          </div>
        </div>

        {/* Mô tả phim */}
      </div>
    </>
  );
}
