import { fetchResults } from "@/lib/fetchResults";
import { notFound } from "next/navigation";
import React from "react";

export type SearchParams = {
  url: URL;
  group_adults: string;
  group_children: string;
  no_rooms: string;
  checkin: string;
  checkout: string;
};

type Props = {
  searchParams: SearchParams; // Use ":" for typing instead of "="
};

async function SearchPage({ searchParams }: Props) {
  if (!searchParams.url) return notFound();
  const results = await fetchResults(searchParams);
  //   if(!results) return <div>No results...</div>
  return <div>page</div>;
}

export default SearchPage; // Capitalize component name (Page) for convention
