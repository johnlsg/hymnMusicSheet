import {searchClient} from "./algoliaSearchClient";
import {Hits, InstantSearch, SearchBox} from 'react-instantsearch-hooks-web';
import abcjs from "abcjs";

function parseLyrics(musicABC) {

  let lyrics = musicABC.split("\n")
    .filter((x) => {
      return x.startsWith("w:")
    })
    .map((x) => {
      return x.substr("2")
    })
    .reduce((acc, curr) => {
      return acc + " " + curr
    }, "");
  return lyrics;
}

function Hit({hit}) {
  let lyrics = parseLyrics(hit.musicABC)
    .replaceAll("-", "")
    .replaceAll("_", "")
    .substr(0, 150) + "..."
  return (
    <a style={{textDecoration: "none", color: "inherit"}} href={"hymn/" + hit.slug}>

      <article>
        <h1>{hit.hymnName}</h1>
        <p>{lyrics}</p>
      </article>
    </a>
  );
}

export default function SearchPage(props) {

  return (
    <InstantSearch searchClient={searchClient} indexName="hymns">
      <SearchBox/>
      <Hits hitComponent={Hit}/>
    </InstantSearch>
  );
}
