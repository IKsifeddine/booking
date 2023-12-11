import { SearchParams } from "@/app/search/page";
import { Result } from "@/typings";
import { link } from "fs";
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
        _items: {
          title: {
            _fns: [
              {
                _fn: "xpath_one",
                _args: [".//div[@data-testid='title']/text()"],
              },
            ],
          },
          description: {
            _fns: [
              {
                _fn: "xpath_one",
                _args: [".//h4[ontains(@class,'abf093bdfe e8f7c070a7')]"],
              },
            ],
          },

          booking_metadata: {
            _fns: [
              {
                _fn: "xpath_one",
                _args: [
                  ".//div[contains(@class,'c5ca594cb1 f19ed67e4b')]/div[contains(@class, 'abf093bdfef45d8e4c32')//text()]",
                ],
              },
            ],
          },

          link: {
            _fns: [
              {
                _fn: "xpath_one",
                _args: [".//a[ontains(@class, 'a78ca197d0')]/@href"],
              },
            ],
          },

          price: {
            _fns: [
              {
                _fn: "xpath_one",
                _args: [
                  `.//span[containes(@class,'f6431b446c fbfdc1165 e84eb96b1f')]/text()`,
                ],
              },
            ],
          },
          url: {
            _fns: [
              {
                _fn: "xpath_one",
                _args: [".//img/@src"],
              },
            ],
          },
          rating_word: {
            _fns: [
              {
                _fn: "xpath_one",
                _args: [
                  ".//div[@class='a3b872ab1 e6208ee469 cb2cbb3ccb']/text()",
                ],
              },
            ],
          },
          raiting_count: {
            _fns: [
              {
                _fn: "xpath_one",
                _args: [
                  ".//div[@class='abf093bdfe f45d8e4c32 d935416c47']/text()",
                ],
              },
            ],
          },
        },
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

  const response = await fetch("https://realtime.oxylab.io/v1/queries", {
    method: "POST",
    body: JSON.stringify(body),
    next: {
      revalidate: 60 * 60, //cache for 1 h
    },
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Basic" + Buffer.from(`${username}:${password}`).toString("base64"),
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.results.lenght === 0) return;
      const result: Result = data.results[0];
      return result;
    })
    .catch((err) => console.log(err));
  return response;
}
