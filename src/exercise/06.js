// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react';
import {useEffect, useState} from 'react';
import {ErrorBoundary} from 'react-error-boundary';
import {
  fetchPokemon,
  PokemonDataView,
  PokemonForm,
  PokemonInfoFallback,
} from '../pokemon';

function PokemonInfo({pokemonName}) {
  const [state, setState] = useState({
    status: pokemonName ? 'pending' : 'idle',
    pokemon: null,
    error: null,
  });

  useEffect(() => {
    if (!pokemonName) {
      return;
    }

    setState(s => {
      return {...s, status: 'pending'};
    });
    fetchPokemon(pokemonName)
      .then(pokemonData => {
        setState(s => {
          return {...s, status: 'resolved', pokemon: pokemonData};
        });
      })
      .catch(error => {
        setState(s => {
          return {...s, error: error, status: 'rejected'};
        });
      });
  }, [pokemonName]);

  if (state.status === 'idle') {
    return 'Submit a pokemon';
  } else if (state.status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />;
  } else if (state.status === 'rejected') {
    throw state.error;
  } else if (state.status === 'resolved') {
    return <PokemonDataView pokemon={state.pokemon} />;
  } else {
    throw new Error('status out of sync');
  }
}

function App() {
  const [pokemonName, setPokemonName] = useState('');

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName);
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary
          FallbackComponent={PokemonErrorFallback}
          resetKeys={[pokemonName]}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  );
}

function PokemonErrorFallback({error}) {
  return (
    <div role="alert">
      There was an error:{' '}
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
    </div>
  );
}

export default App;
