import { useEffect, useState } from "react";
import "./style.css";
import { SyncLoader } from "react-spinners";

function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const pokemonPromises = Array.from({ length: 1025 }, (_, i) =>
          fetch(`https://pokeapi.co/api/v2/pokemon/${i + 1}`).then((res) =>
            res.json()
          )
        );

        const results = await Promise.all(pokemonPromises);

        const pokemonData = results.map((data, index) => ({
          name: data.species.name,
          no: index + 1,
          type: data.types.map((t) => t.type.name),
        }));

        setPokemonList(pokemonData);
      } catch (error) {
        console.error("데이터 로딩 오류:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  function errorImg(event, pokemon) {
    event.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.no}.png`;
  }

  return (
    <div>
      {loading ? (
        <div>
          <h2>이미지 로딩중입니다.</h2>
          <SyncLoader />
        </div>
      ) : (
        <div className="container">
          <h1 className="title">Pokemon List</h1>
          <div className="pokemon-grid">
            {pokemonList.map((pokemon) => (
              <div key={pokemon.no} className="pokemon-card">
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${pokemon.no}.gif`}
                  alt={pokemon.name}
                  onError={(e) => errorImg(e, pokemon)}
                  className="pokemon-img"
                />
                <p className="pokemon-name">{pokemon.name}</p>
                <p className="pokemon-number">No. {pokemon.no}</p>
                {pokemon.type.map((type) => (
                  <img
                    key={type}
                    className="type-img"
                    src={`${process.env.PUBLIC_URL}/type/${type}.png`}
                    alt={type}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
