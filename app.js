const express = require('express');
const axios = require('axios');
const bcrypt = require('bcrypt');
const app = express();
const db = require('./database');
const { formatPrice, formatVolume, formatChange, formatMarketCap } = require('./public/js/info');

const apiKey = '945778fb-7d96-4e54-bdb1-617128eaac0d';
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', async (req, res) => {
  try {
    const symbols = ['DAI', 'USDC', 'USDT', 'FDUSD', 'BUSD', 'TUSD'];
    const promises = symbols.map(symbol => {
      return axios.get(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${symbol}`, {
        headers: {
          'X-CMC_PRO_API_KEY': apiKey,
          'Content-Type': 'application/json'
        }
      });
    });

    const responses = await Promise.all(promises);

    const coinData = responses.map(response => {
      const coinInfo = response.data.data[Object.keys(response.data.data)[0]];
      const volumeChange24h = coinInfo.quote.USD.volume_change_24h;

      return {
        name: coinInfo.name,
        symbol: coinInfo.symbol,
        price: formatPrice(coinInfo.quote.USD.price),
        volume_24h: formatVolume(coinInfo.quote.USD.volume_24h),
        volume_change_24h: formatChange(volumeChange24h),
        percent_change_24h: formatChange(coinInfo.quote.USD.percent_change_24h),
        market_cap: formatMarketCap(coinInfo.quote.USD.market_cap)
      };
    });

    db.query('SELECT * FROM news LEFT JOIN stable_coins ON news.coin_id = stable_coins.coin_id WHERE news.coin_id = "1"', (err, daiNewsResults) => {
      if (err) {
        console.error('Coins extraction error: ' + err);
        res.status(500).send('Coins extraction error');
        return;
      }

      db.query('SELECT * FROM users', (err, usersResults) => {
        if (err) {
          console.error('Coins extraction error: ' + err);
          res.status(500).send('Coins extraction error');
          return;
        }

        db.query('SELECT * FROM news LEFT JOIN stable_coins ON news.coin_id = stable_coins.coin_id WHERE news.coin_id = "2"', (err, usdcNewsResults) => {
          if (err) {
            console.error('Coins extraction error: ' + err);
            res.status(500).send('Coins extraction error');
            return;
          }

          db.query('SELECT * FROM news LEFT JOIN stable_coins ON news.coin_id = stable_coins.coin_id WHERE news.coin_id = "3"', (err, usdtNewsResults) => {
            if (err) {
              console.error('Coins extraction error: ' + err);
              res.status(500).send('Coins extraction error');
              return;
            }

            db.query('SELECT * FROM coin_table', (err, coinComparisonResults) => {
              if (err) {
                console.error('Coin comparison extraction error: ' + err);
                res.status(500).send('Coin comparison extraction error');
                return;
              }

              db.query('SELECT coin_id FROM contracts', (err, contractsNames) => {
                if (err) {
                  console.error('Contracts extraction error: ' + err);
                  res.status(500).send('Contracts extraction error');
                  return;
                }

                db.query('SELECT * FROM contracts LEFT JOIN stable_coins ON contracts.coin_id = stable_coins.coin_id LEFT JOIN coin_types ON contracts.type_id = coin_types.type_id WHERE contracts.coin_id = "1"', (err, daiContractsResults) => {
                  if (err) {
                    console.error('Contracts extraction error: ' + err);
                    res.status(500).send('Contracts extraction error');
                    return;
                  }

                  db.query('SELECT * FROM contracts LEFT JOIN stable_coins ON contracts.coin_id = stable_coins.coin_id LEFT JOIN coin_types ON contracts.type_id = coin_types.type_id WHERE contracts.coin_id = "2"', (err, usdcContractsResults) => {
                    if (err) {
                      console.error('Contracts extraction error: ' + err);
                      res.status(500).send('Contracts extraction error');
                      return;
                    }

                    db.query('SELECT * FROM contracts LEFT JOIN stable_coins ON contracts.coin_id = stable_coins.coin_id LEFT JOIN coin_types ON contracts.type_id = coin_types.type_id WHERE contracts.coin_id = "3"', (err, usdtContractsResults) => {
                      if (err) {
                        console.error('Contracts extraction error: ' + err);
                        res.status(500).send('Contracts extraction error');
                        return;
                      }

                      db.query('SELECT * FROM contracts LEFT JOIN stable_coins ON contracts.coin_id = stable_coins.coin_id LEFT JOIN coin_types ON contracts.type_id = coin_types.type_id WHERE contracts.coin_id = "4"', (err, fdusdContractsResults) => {
                        if (err) {
                          console.error('Contracts extraction error: ' + err);
                          res.status(500).send('Contracts extraction error');
                          return;
                        }

                        db.query('SELECT * FROM contracts LEFT JOIN stable_coins ON contracts.coin_id = stable_coins.coin_id LEFT JOIN coin_types ON contracts.type_id = coin_types.type_id WHERE contracts.coin_id = "5"', (err, busdContractsResults) => {
                          if (err) {
                            console.error('Contracts extraction error: ' + err);
                            res.status(500).send('Contracts extraction error');
                            return;
                          }

                          db.query('SELECT * FROM contracts LEFT JOIN stable_coins ON contracts.coin_id = stable_coins.coin_id LEFT JOIN coin_types ON contracts.type_id = coin_types.type_id WHERE contracts.coin_id = "6"', (err, tusdContractsResults) => {
                            if (err) {
                              console.error('Contracts extraction error: ' + err);
                              res.status(500).send('Contracts extraction error');
                              return;
                            }

                      res.render('index', { coinComparison: coinComparisonResults, users: usersResults, dainews: daiNewsResults, usdtnews: usdtNewsResults, usdcnews: usdcNewsResults, daiContracts: daiContractsResults, usdcContracts: usdcContractsResults, usdtContracts: usdtContractsResults, fdusdContracts: fdusdContractsResults, busdContracts: busdContractsResults, tusdContracts: tusdContractsResults, contractNames: contractsNames, coinData });
                    });
                  });
                  });
                  });
                  });
                });

              });
            });
          });
        });
      });
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  }
});

app.get('/api/:coiname', (req, res) => {
  const coinName = req.params.coiname;

  // Assuming 'name' is the column in stable_coins table that you want to match with
  db.query('SELECT * FROM stable_coins WHERE name = ?', [coinName], (err, stableCoinResults) => {
    if (err) {
      console.error('Stable coin extraction error: ' + err);
      res.status(500).json({ error: 'Stable coin extraction error' });
      return;
    }

    if (stableCoinResults.length === 0) {
      res.status(404).json({ error: 'Stable coin not found' });
      return;
    }

    const coinId = stableCoinResults[0].coin_id;

    // Update the query to match 'coin_id' with 'id'
    db.query('SELECT * FROM coin_table WHERE coin_id = ?', [coinId], (err, coinResults) => {
      if (err) {
        console.error('Coin data extraction error: ' + err);
        res.status(500).json({ error: 'Coin data extraction error' });
        return;
      }

      res.json({ coinData: coinResults });
    });
  });
});



app.get('/news', (req, res) => {
  db.query('SELECT * FROM news LEFT JOIN stable_coins ON news.coin_id = stable_coins.coin_id WHERE news.coin_id = "1"', (err, daiNewsResults) => {
    if (err) {
      console.error('Coins extraction error: ' + err);
      res.status(500).send('Coins extraction error');
      return;
    }

    db.query('SELECT * FROM users', (err, usersResults) => {
      if (err) {
        console.error('Coins extraction error: ' + err);
        res.status(500).send('Coins extraction error');
        return;
      }

      db.query('SELECT * FROM news LEFT JOIN stable_coins ON news.coin_id = stable_coins.coin_id WHERE news.coin_id = "2"', (err, usdcNewsResults) => {
        if (err) {
          console.error('Coins extraction error: ' + err);
          res.status(500).send('Coins extraction error');
          return;
        }

        db.query('SELECT * FROM news LEFT JOIN stable_coins ON news.coin_id = stable_coins.coin_id WHERE news.coin_id = "3"', (err, usdtNewsResults) => {
          if (err) {
            console.error('Coins extraction error: ' + err);
            res.status(500).send('Coins extraction error');
            return;
          }

          res.render('news', { users: usersResults, dainews: daiNewsResults, usdtnews: usdtNewsResults, usdcnews: usdcNewsResults });
        });
      });
    });
  });
});

app.get('/chart', (req, res) => {

      res.render('chart');
});


app.post('/signup', (req, res) => {
  const { username, password } = req.body;
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      console.error('Hashing error: ', err);
      res.status(500).send('Error while hashing password');
      return;
    }
    db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], (err, result) => {
      if (err) {
        console.error('Signup error: ', err);
        res.status(500).send('Signup error');
        return;
      }
      res.redirect('/'); // Ana sayfaya yönlendirme
    });
  });
});

// Signin endpoint'i
app.post('/signin', (req, res) => {
  const { username, password } = req.body;
  db.query('SELECT * FROM users WHERE username = ?', [username], (err, result) => {
    if (err) {
      console.error('Signin error: ', err);
      res.status(500).send('Signin error');
      return;
    }
    if (result.length > 0) {
      bcrypt.compare(password, result[0].password, (err, bcryptResult) => {
        if (bcryptResult) {
          db.query('INSERT INTO user_logs (user_id, login_time) VALUES (?, NOW())', [result[0].id], (err, logResult) => {
            if (err) {
              console.error('User log error: ', err);
            }
            res.redirect('/'); // Ana sayfaya yönlendirme
          });
        } else {
          res.status(401).send('Invalid credentials');
        }
      });
    } else {
      res.status(401).send('Invalid credentials');
    }
  });
});

// Logout endpoint'i
app.post('/logout', (req, res) => {
  // Oturumu sonlandırma işlemi...
  res.redirect('/signin'); // Signin sayfasına yönlendirme
});

// Singin sayfası için route
app.get('/signin', (req, res) => {
  res.render('signin'); // signin.ejs dosyasını render et
});

// Signup sayfası için route
app.get('/signup', (req, res) => {
  res.render('signup'); // signup.ejs dosyasını render et
});

app.use((req, res, next) => {
  res.status(404).send('Sorry, page not found!');
});

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`);
});
