const express = require('express');
const cors = require('cors');
const { resolve } = require('path');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

let db;

(async () => {
  db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database,
  });
})();

// Exercise 1: Get All Restaurants

async function allRestaurants() {
  let query = 'SELECT * FROM restaurants';
  let result = await db.all(query, []);
  return { restaurants: result };
}

app.get('/restaurants', async (req, res) => {
  try {
    let result = await allRestaurants();

    if (result.restaurants.length === 0) {
      return res.status(404).json({ message: 'restaurants not found' });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Exercise 2: Get Restaurant by ID

async function fetchRestaurantsByID(id) {
  let query = 'SELECT * FROM restaurants WHERE id=?';
  let result = await db.get(query, [id]);
  return { restaurants: result };
}
app.get('/restaurants/details/:id', async (req, res) => {
  let id = req.params.id;
  try {
    let result = await fetchRestaurantsByID(id);

    if (result.restaurants === undefined) {
      return res
        .status(404)
        .json({ message: `No restaurants found with the id ${id} !` });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

// Exercise 3: Get Restaurants by Cuisine

async function FetchRestaurantsByCuisine(cuisine) {
  let query = 'SELECT * FROM restaurants WHERE cuisine = ?';
  let responce = await db.all(query, [cuisine]);
  return { restaurants: responce };
}
app.get('/restaurants/cuisine/:cuisine', async (req, res) => {
  let cuisine = req.params.cuisine;
  try {
    let result = await FetchRestaurantsByCuisine(cuisine);
    if (result.restaurants.length === 0) {
      return res
        .status(404)
        .json({ message: ' No cuisine restaurants Fond for this ' + cuisine });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Exercise 4: Get Restaurants by Filter

async function filterByVegOutDoorSeatingLuxury(
  isVeg,
  hasOutdoorSeating,
  isLuxury
) {
  let query =
    'SELECT * FROM restaurants WHERE isVeg = ? AND hasOutdoorSeating = ? AND isLuxury = ?';
  let responce = await db.all(query, [isVeg, hasOutdoorSeating, isLuxury]);
  return { restaurants: responce };
}

app.get('/restaurants/filter', async (req, res) => {
  let isVeg = req.query.isVeg;
  let hasOutdoorSeating = req.query.hasOutdoorSeating;
  let isLuxury = req.query.isLuxury;

  try {
    let result = await filterByVegOutDoorSeatingLuxury(
      isVeg,
      hasOutdoorSeating,
      isLuxury
    );

    if (result.restaurants.length === 0) {
      return res.status(404).json({ message: 'restaurants Not Found' });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Exercise 5: Get Restaurants Sorted by Rating

async function sortByRating() {
  let query = 'SELECT * FROM restaurants ORDER BY rating DESC';
  let response = await db.all(query, []);
  return { restaurants: response };
}
app.get('/restaurants/sort-by-rating', async (req, res) => {
  try {
    let result = await sortByRating();
    if (result.restaurants.length === 0) {
      return res.status(404).json({ message: 'restaurants Not Found' });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Exercise 6: Get All Dishes

async function fetchByDishes() {
  let query = 'SELECT *  FROM dishes ';
  let response = await db.all(query, []);
  return { dish: response };
}

app.get('/dishes', async (req, res) => {
  try {
    let result = await fetchByDishes();
    if (result.dishes.length === 0) {
      return res.status(404).json({ message: 'dishes Not Found' });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Exercise 7: Get Dish by ID

async function fetchById(id) {
  let query = 'SELECT *  FROM dishes WHERE id = ? ';
  let response = await db.get(query, [id]);
  return { dishes: response };
}

app.get('/dishes/details/:id', async (req, res) => {
  let id = req.params.id;
  try {
    let result = await fetchById(id);
    if (result.dishes === undefined) {
      return res.status(404).json({ message: 'dishes Not Found' });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Exercise 8: Get Dishes by Filter

async function filterDishes(isVeg) {
  let query = 'SELECT * FROM dishes WHERE isVeg=?';
  let result = await db.all(query, [isVeg]);
  return { dishes: result };
}
app.get('/dishes/filter', async (req, res) => {
  let isVeg = req.query.isVeg;
  try {
    let result = await filterDishes(isVeg);
    if (result.dishes.length === 0) {
      return res.status(404).json({
        message: `No dishes found which are Veg!`,
      });
    }
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

// Exercise 9: Get Dishes Sorted by Price

async function sortDishesByPrice() {
  let query = 'SELECT * FROM dishes ORDER BY price ASC';
  let result = await db.all(query, []);
  return { dishes: result };
}

app.get('/dishes/sort-by-price', async (req, res) => {
  try {
    let result = await sortDishesByPrice();
    if (result.dishes.length === 0) {
      return res.status(404).json({
        message: `No dishes found!`,
      });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
