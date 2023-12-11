import { SearchParams } from "@/app/search/page";
import { url } from "inspector";
import { parse } from "path";
import { title } from "process";
import { render } from "react-dom";

export async function fetchResults(searchParams: SearchParams) {
  const username = process.env.OXYLAB_USERNAME;
  const password = process.env.OXYLAB_PASSWORD;

  const url = new URL(searchParams.url);

  Object.keys(searchParams).forEach((key) => {
    if (key === "url" || key === "location") return;
    const value = searchParams[key as keyof SearchParams];
    if (typeof value === "string") {
      url.searchParams.append(key, value);
    }
  });

  console.log("scripting url>>> ", url.href);

  const body = {
    source: "universal",
    url: url.href,
    parse: true,
    render: "html",
    parsing_instructions: {
      listings: {
        _fns: [
          {
            _fn: "xpath",
            _args: ["//div[@data-testid='property-card-container']"],
          },
        ],
        _items:{
            title:{
                _fns: [
                    {
                      _fn: "xpath_one",
                      _args: ["//div[@data-testid='title']/text()"],
                    },
                  ],

            }
        }
      },


      total_listings: {
        _fns: [
          {
            _fn: "xpath_one",
            _args: [".//h1/text()"],
          },
        ],
      },
    },
  };
}
