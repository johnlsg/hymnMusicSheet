import {searchClient} from "./algoliaSearchClient";
import {Hits, InstantSearch, SearchBox} from 'react-instantsearch-hooks-web';

function Hit({hit}) {
  return (
    <a href={"hymn/" + hit.slug}>

      <article>
        <h1>{hit.hymnName}</h1>
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
