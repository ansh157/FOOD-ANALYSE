const express = require('express');
const multer = require('multer');
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });
// already knowns foods calories that are common
const knownFoods = {
  burger: { calories: 540, protein: 28, carbs: 45, fat: 28 },
  pizza: { calories: 610, protein: 26, carbs: 58, fat: 32 },
  salad: { calories: 200, protein: 5, carbs: 18, fat: 12 },
  pasta: { calories: 550, protein: 18, carbs: 70, fat: 20 },
  sushi: { calories: 320, protein: 14, carbs: 42, fat: 10 },
  steak: { calories: 680, protein: 52, carbs: 4, fat: 46 }
};

function normalizeText(text) {
  return text.toLowerCase().replace(/[^a-z0-9 ]/g, ' ');
}

function estimateNutrition(menuText, imageUploaded) {
  const normalized = normalizeText(menuText || '');
  const items = [];

  Object.keys(knownFoods).forEach((food) => {
    if (normalized.includes(food)) {
      items.push({
        name: food.charAt(0).toUpperCase() + food.slice(1),
        ...knownFoods[food],
        source: 'menu text'
      });
    }
  });

  if (items.length === 0) {
    if (imageUploaded) {
      items.push({
        name: 'Sample meal',
        calories: 620,
        protein: 30,
        carbs: 65,
        fat: 28,
        source: 'image placeholder'
      });
    } else {
      items.push({
        name: 'Mixed menu estimate',
        calories: 520,
        protein: 22,
        carbs: 50,
        fat: 24,
        source: 'text fallback'
      });
    }
  }

  const totals = items.reduce(
    (acc, item) => {
      acc.calories += item.calories;
      acc.protein += item.protein;
      acc.carbs += item.carbs;
      acc.fat += item.fat;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return { items, totals };
}

router.post('/', upload.single('photo'), (req, res) => {
  const menuText = req.body.menuText || '';
  const file = req.file;
  const analysis = estimateNutrition(menuText, Boolean(file));

  res.json({
    success: true,
    analysis,
    message: file
      ? 'Uploaded image analyzed as a placeholder. Replace with a real image recognition API for production.'
      : 'Menu text analyzed using sample nutrition values.'
  });
});

module.exports = router;
