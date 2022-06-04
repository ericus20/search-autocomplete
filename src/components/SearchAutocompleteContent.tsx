import MoonLoader from "react-spinners/MoonLoader";
import TvShow, { Show } from "./TvShow";

interface SearchAutocompleteContentProps {
  isLoading: boolean;
  noTvShows: boolean;
  tvShows: Show[];
}

const SearchAutocompleteContent: React.FC<SearchAutocompleteContentProps> = ({
  isLoading,
  noTvShows,
  tvShows,
}) => {
  const isEmpty = !tvShows || tvShows.length === 0;

  return (
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
  );
};

export default SearchAutocompleteContent;
