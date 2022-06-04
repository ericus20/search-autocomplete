import Image from "next/image";
import React from "react";

export interface Show {
  show: {
    id: number;
    url: string;
    image: {
      medium: string;
    };
    name: string;
    rating: {
      average: any;
    };
  };
}

interface TvShowProps {
  url: string;
  thumbnailSrc: string;
  name: string;
  rating: any;
}

const TvShow: React.FC<TvShowProps> = ({ url, thumbnailSrc, name, rating }) => {
  return (
    // TvShowContainer
    <a href={url} target="_blank" rel="noopener noreferrer">
      <div className="w-full min-h-[6rem] flex border-solid border-b-2 border-b-[#d8d8d852] py-[0.4375rem] px-2 items-center">
        {/* Thumbnail */}
        <div className="w-auto h-full flex flex-[0.4]">
          {thumbnailSrc && (
            <Image
              src={thumbnailSrc}
              alt="Image"
              width={100}
              height={100}
              objectFit="contain"
            />
          )}
        </div>
        {/* Name */}
        <h3 className="text-base text-black ml-[0.625rem] flex flex-[2]">
          {name}
        </h3>
        {/* Rating */}
        <span className="text-[#a1a1a1] text-base flex flex-[0.2]">
          {rating || "N/A"}
        </span>
      </div>
    </a>
  );
};

export default TvShow;
