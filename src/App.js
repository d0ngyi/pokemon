import { useEffect, useState } from "react";
import "./style.css";
import { SyncLoader } from "react-spinners";
import ReactModal from "react-modal";
import { useInView } from "react-intersection-observer";

function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [detail, setDetail] = useState({});
  const [fetchNum, setFetchNum] = useState(1);

  async function fetchData() {
    let temple = [];
    for (let i = fetchNum; i < fetchNum + 12; i++) {
      // 1 ~ 21
      let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
      let data = await response.json();
      let pokemonData = {
        name: data.species.name,
        no: i,
        type: data.types.map((t) => t.type.name),
        height: data.height,
        weight: data.weight,
      };
      temple.push(pokemonData);
    }
    setFetchNum((prev) => prev + 12);
    setPokemonList((prevList) => [...prevList, ...temple]);
  }

  // 이 부분이 조금 이상한 것 같아
  useEffect(() => {
    setLoading(false);
  }, []);

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      fetchData();
    }
  }, [inView]);

  function errorImg(event, pokemon) {
    event.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.no}.png`;
  }

  function clickCard(pokemon) {
    setDetail(pokemon);
    setModal(true);
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
              <div
                key={pokemon.no}
                className="pokemon-card"
                onClick={() => clickCard(pokemon)}
              >
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
            <ReactModal
              isOpen={modal}
              className="modal-content"
              overlayClassName="modal-overlay"
            >
              <button onClick={() => setModal(false)}>X</button>
              {detail && (
                <>
                  <h1>{detail.name}</h1>
                  <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${detail.no}.png`}
                    alt={detail.name}
                  />
                  <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${detail.no}.png`}
                    alt={`${detail.name} back`}
                  />
                  {detail.type?.map((type) => (
                    <img
                      key={type}
                      className="type-img"
                      src={`${process.env.PUBLIC_URL}/type/${type}.png`}
                      alt={type}
                    />
                  ))}
                  <p>{`No. ${detail.no} Height: ${detail.height}  Weight: ${detail.weight}`}</p>
                </>
              )}
            </ReactModal>
          </div>
          <h3 ref={ref}>
            <SyncLoader />
          </h3>
        </div>
      )}
    </div>
  );
}

export default App;
