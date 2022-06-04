import React, { useEffect, useRef, useState } from "react";
import { IoClose, IoSearch } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { useClickOutside } from "react-click-outside-hook";
import { Show } from "./TvShow";
import SearchAutocompleteContent from "./SearchAutocompleteContent";
import useDebounce from "../hooks/useDebounce";

const SearchBar = () => {
  const [isExpaded, setExpanded] = useState<boolean>(false);
  const [parentRef, isClickedOutside] = useClickOutside();
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setLoading] = useState<boolean>(false);
  const [tvShows, setTvShows] = useState<Show[]>([]);
  const [noTvShows, setNoTvShows] = useState<boolean>(false);
  const debouncedValue = useDebounce<string>(searchQuery);

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

  // Fetch API
  useEffect(() => {
    const searchTvShows = async () => {
      if (!debouncedValue || debouncedValue === "") {
        return;
      }

      setLoading(true);
      setNoTvShows(false);

      const data = await fetch(`/api/shows?searchQuery=${debouncedValue}`).then(
        (response) => response.json()
      );

      if (data) {
        if (data.length === 0) {
          setNoTvShows(true);
        }

        setTvShows(data);
      }

      setLoading(false);
    };
    // Do fetch here...
    searchTvShows();
    // Triggers when "debouncedValue" changes
  }, [debouncedValue]);

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
      <SearchAutocompleteContent
        isLoading={isLoading}
        noTvShows={noTvShows}
        tvShows={tvShows}
      />
    </motion.div>
  );
};

export default SearchBar;
