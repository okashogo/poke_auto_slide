import React, { useEffect, useState } from 'react';
import { csvString } from './pokemon_data';

const PokemonSlider = () => {
  const [pokemonData, setPokemonData] = useState<any[]>([]);

  const [currentNumber, setCurrentNumber] = useState(
    Math.floor(Math.random() * 1025) + 1
  );
  const [inputCurrentNumber, setInputCurrentNumber] = useState<number | null>(
    null
  );
  const [intervalTime, setIntervalTime] = useState(3000); // 初期インターバル3秒

  // 指定のポケモン番号の前後7体分の番号を取得
  const getAdjacentNumbers = (number: number) => {
    return Array.from({ length: 7 }, (_, index) => {
      let offsetNumber = (number + index - 2) % 1025;
      return offsetNumber > 0 ? offsetNumber : offsetNumber + 1025;
    });
  };

  const [visiblePokemon, setVisiblePokemon] = useState(
    getAdjacentNumbers(currentNumber)
  );

  // 3秒ごとに番号を更新
  useEffect(() => {
    const headers = csvString.split(','); // ヘッダー行を取得

    const data = [];
    for (let i = 0; i < 1025; i++) {
      data.push({
        No: parseInt(headers[i * 3]),
        name: headers[i * 3 + 1],
        gogen: headers[i * 3 + 2],
      });
    }
    setPokemonData(data);
  }, []);

  // インターバル管理用のeffect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNumber((prevNumber) =>
        prevNumber < 1025 ? prevNumber + 1 : 1
      );
    }, intervalTime);
    return () => clearInterval(interval); // インターバルをクリーンアップ
  }, [intervalTime]);

  // currentNumberが変わったらvisiblePokemonを更新
  useEffect(() => {
    setVisiblePokemon(getAdjacentNumbers(currentNumber));
  }, [currentNumber]);

  return (
    <div className="flex gap-4 flex-col items-center justify-center">
      <label className="flex items-center justify-center gap-2 mt-4">
        スライド間隔（ミリ秒）:
        <select
          className="border border-gray-300 rounded-md p-1"
          onChange={(e) => setIntervalTime(parseInt(e.target.value))}
          value={intervalTime}
        >
          <option value={1000}>1秒</option>
          <option value={2000}>2秒</option>
          <option value={3000}>3秒</option>
          <option value={5000}>5秒</option>
          <option value={10000}>10秒</option>
          <option value={15000}>15秒</option>
        </select>
      </label>
      <div className="flex items-center justify-center gap-4">
        <p>ポケモンNo.</p>
        <input
          type="number"
          className="border border-gray-300 rounded-md p-1"
          value={inputCurrentNumber ?? ''}
          onChange={(e) => setInputCurrentNumber(parseInt(e.target.value))}
        />
        <button
          className="w-[100px] p-2 border border-gray-300 rounded-md bg-blue-500 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500"
          disabled={!inputCurrentNumber}
          onClick={() => {
            if (inputCurrentNumber) setCurrentNumber(inputCurrentNumber);
          }}
        >
          設定
        </button>
      </div>
      <div className="pokemon-slider flex flex-col items-center justify-center">
        {visiblePokemon.map((number) => (
          <div key={number} className="pokemon flex items-center">
            <img
              src={`https://all-pokemon-ierukana.com/img/pokemon/${number.toString().padStart(3, '0')}.png`}
              alt={`Pokemon ${number}`}
              className="w-[150px]"
            />
            <div className="flex flex-col items-center w-[100px]">
              <p
                className={`${
                  currentNumber === number ? 'text-blue-500 font-bold' : ''
                } text-center`}
              >
                {pokemonData[number - 1]?.name}
              </p>
              <p
                className={`${
                  currentNumber === number ? 'text-blue-500 font-bold' : ''
                } text-center`}
              >
                No. {number}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PokemonSlider;
