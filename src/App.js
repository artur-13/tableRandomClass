import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';

import './App.css';
const apiUrl =
  'https://script.google.com/macros/s/AKfycbx3dycTBKZ6dZ9hr_-HzBDyD3rTspFkpYxAwkHaM56aTyrA13ZL_vsmidmUQ9PmCes/exec';

const App = () => {
  useEffect(() => {
    if (!localStorage.getItem('_pwd') || localStorage.getItem('_pwd') === 'null') {
      localStorage.setItem('_pwd', window.prompt('Введите пароль', ''));
    }
  }, []);
  const [value, setValue] = useState('');
  const [step, setStep] = useState(1);
  const [date, setDate] = useState('');
  const [result, setResult] = useState('');
  const back = () => {
    setStep(1);
    setValue('');
    setDate('');
    setResult('');
  };
  const submit = async () => {
    setDate(dayjs().locale('ru').format('DD MMMM YYYYг. HH:mm:ss'));
    setStep(2);
    const response = await fetch(apiUrl, { method: 'get', mode: 'cors' });
    const { data, count, letters } = await response.json();
    const countEachLetter = {};
    data.forEach((item) => {
      if (countEachLetter[item]) {
        countEachLetter[item] += 1;
      } else {
        countEachLetter[item] = 1;
      }
    });
    const availableLetters = [];
    letters.split('').forEach((letter) => {
      if (countEachLetter[letter] && countEachLetter[letter] < count) {
        availableLetters.push(letter);
      }
      if (!countEachLetter[letter]) {
        availableLetters.push(letter);
      }
    });
    if (availableLetters.length === 0) {
      alert('Нет доступных классов. Обратитесь к администратору');
      back();
      return;
    }
    const randomLetter = availableLetters[Math.floor(Math.random() * availableLetters.length)];
    const resultObject = { fio: value, target: randomLetter, password: localStorage.getItem('_pwd') };
    const searchParams = Object.keys(resultObject).map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(resultObject[key])}`).join('&');
    await fetch(apiUrl, {
      method: 'post',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: searchParams,
    })
    setResult(randomLetter);
    setStep(3);
  };

  return (
    <>
      {step === 1 && (
        <div className="container">
          <div className="title">Система случайного распределения первоклассников Кагальницкая СОШ</div>
          <div className="row">
            <input
              className="input"
              placeholder="Введите ФИО первоклассника"
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <button className="btn" type="button" onClick={submit}>
              ВЫПОЛНИТЬ
            </button>
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="loader-container">
          <div className="loader-title">Вычисление и отправка данных...</div>
          <div className="loader"></div>
        </div>
      )}
      {step === 3 && (
        <div className="container">
          <div className="result-text">
          Данные сохранены в базу данных.
          </div>
          <div className="result-date">
            {date}
          </div>
        <div className="result-title">
          {value}
        </div>
        <div className="result-title2">
          Результат: 1{result}
        </div>
        <button className="btn" type="button" onClick={window.print}>
          РАСПЕЧАТАТЬ РЕЗУЛЬТАТ
        </button>
        <button className="btn" type="button" onClick={back}>
          НАЗАД
        </button>
      </div>
      )}
    </>
  );
};

export default App;
