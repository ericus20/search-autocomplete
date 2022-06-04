import React, { useEffect, useRef, useState } from "react";
import { IoClose, IoSearch } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { useClickOutside } from "react-click-outside-hook";
import MoonLoader from "react-spinners/MoonLoader";
import { useDebounce } from "../hooks/useDebounce";
import axios from "axios";
import TvShow, { Show } from "./TvShow";

const SearchBar = () => {
  const [isExpaded, setExpanded] = useState<boolean>(false);
  const [parentRef, isClickedOutside] = useClickOutside();
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setLoading] = useState<boolean>(false);
  const [tvShows, setTvShows] = useState<Show[]>([]);
  const [noTvShows, setNoTvShows] = useState<boolean>(false);

  const isEmpty = !tvShows || tvShows.length === 0;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (event.target.value.trim() === "") setNoTvShows(false);

    setSearchQuery(event.target.value);
  };

  const expandContainer = () => {
    setExpanded(true);
  };

  const collapseContainer = () => {
    setExpanded(false);
    setSearchQuery("");
    setLoading(false);
    setNoTvShows(false);
    setTvShows([]);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const variants = {
    expanded: {
      height: "20rem",
    },
    collapsed: {
      height: "3.8rem",
    },
  };

  const transition = { type: "spring", damping: 22, stiffness: 150 };

  useEffect(() => {
    if (isClickedOutside) {
      collapseContainer();
    }
  }, [isClickedOutside]);

  const prepareSearchQuery = (query: string) => {
    const url = `http://api.tvmaze.com/search/shows?q=${query}`;

    return encodeURI(url);
  };

  const searchTvShows = async () => {
    if (!searchQuery || searchQuery === "") {
      return;
    }

    setLoading(true);
    setNoTvShows(false);

    const URL = prepareSearchQuery(searchQuery);

    const response = await axios.get(URL).catch((err) => {
      console.log("Error: ", err);
    });

    if (response) {
      console.log("Response: ", response.data);
      if (response.data && response.data.length === 0) setNoTvShows(true);

      setTvShows(response.data);
    }

    setLoading(false);
  };

  useDebounce(searchQuery, 500, searchTvShows);

  return (
    <motion.div
      animate={isExpaded ? "expanded" : "collapsed"}
      variants={variants}
      transition={transition}
      ref={parentRef}
      className="flex flex-col w-[34rem] h-[3.8rem] bg-white rounded-md shadow-[0_2px_12px_3px_rgba(0,0,0,0.14)] overflow-hidden"
    >
      <div className="w-full min-h-[4rem] flex items-center relative px-4 py-1">
        {/* Seaarch Icon */}
        <span className="text-[#bebebe] text-2xl mr-2 mt-1 align-middle">
          <IoSearch />
        </span>

        {/* Input element */}
        <input
          type="text"
          ref={inputRef}
          value={searchQuery}
          onChange={handleChange}
          onFocus={expandContainer}
          placeholder="Serch for Series/Shows"
          className="w-full h-full outline-none border-none text-xl font-medium rounded-md bg-transparent focus:outline-none focus:placeholder:opacity-0 focus:placeholder:bg-[#bebebe] placeholder:transition-all duration-[250ms]"
        />

        <AnimatePresence>
          {/* Close icon */}
          {isExpaded && (
            <motion.span
              key="close-icon"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={collapseContainer}
              className="text-[#bebebe] text-2xl align-middle transition-all duration-200 cursor-pointer hover:bg-[#dfdfdf]"
            >
              <IoClose />
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      {/* Line Separator */}
      {isExpaded && (
        <span className="flex min-w-full min-h-[0.125rem] bg-[#d8d8d878]"></span>
      )}

      {/* Search Content */}
      <div className="w-full h-full flex flex-col p-4 overflow-y-auto">
        {/* Loading Wrapper */}
        {isLoading && (
          <div className="w-full h-full flex items-center justify-center">
            <MoonLoader loading color="#000" size={20} />
          </div>
        )}
        {!isLoading && isEmpty && !noTvShows && (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-[#a1a1a1] text-sm flex self-center justify-center">
              Start typing to Search
            </span>
          </div>
        )}
        {!isLoading && noTvShows && (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-[#a1a1a1] text-sm flex self-center justify-center">
              No Tv Shows or Series found!
            </span>
          </div>
        )}
        {!isLoading && !isEmpty && (
          <>
            {tvShows.map(({ show }) => (
              <TvShow
                key={show.id}
                url={show.url}
                thumbnailSrc={show.image && show.image.medium}
                name={show.name}
                rating={show.rating && show.rating.average}
              />
            ))}
          </>
        )}
      </div>
    </motion.div>
  );
};

export default SearchBar;
