// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Show } from "../../components/TvShow";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Show[]>
) {
  const { searchQuery } = req.query;

  const URL = prepareSearchQuery(searchQuery?.toString());

  const data = await fetch(URL)
    .then((response) => response.json())
    .catch((err) => {
      console.log("Error: ", err);
    });

  res.status(200).json(data);
}

const prepareSearchQuery = (query: string) => {
  const url = `http://api.tvmaze.com/search/shows?q=${query}`;

  return encodeURI(url);
};
