const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

// Sample products data
const sampleProducts = [
  {
    name: 'Casque Bluetooth Premium',
    description: 'Casque sans fil avec qualité audio exceptionnelle et batterie 30h',
    price: 199.99,
    discount: 10,
    category: 'Électronique',
    stock: 50,
    image: 'https://via.placeholder.com/300?text=Casque+Bluetooth',
    color: 'Noir',
    sku: 'HEAD-BT-001',
    rating: 4.5,
    featured: true
  },
  {
    name: 'Smartwatch Ultra',
    description: 'Montre intelligente avec suivi santé complet',
    price: 249.99,
    discount: 15,
    category: 'Électronique',
    stock: 45,
    image: 'https://via.placeholder.com/300?text=Smartwatch',
    color: 'Argent',
    sku: 'SMART-001',
    rating: 4.7,
    featured: true
  },
  {
    name: 'T-shirt Premium Coton',
    description: 'T-shirt 100% coton bio, confortable et écologique',
    price: 49.99,
    discount: 20,
    category: 'Vêtements',
    stock: 200,
    image: 'https://via.placeholder.com/300?text=T-shirt',
    color: 'Vert',
    sku: 'TSHIRT-001',
    rating: 4.3,
    featured: true
  },
  {
    name: 'Jeans Classique',
    description: 'Jeans durable et élégant pour tous les styles',
    price: 79.99,
    discount: 0,
    category: 'Vêtements',
    stock: 150,
    image: 'https://via.placeholder.com/300?text=Jeans',
    color: 'Bleu',
    sku: 'JEANS-001',
    rating: 4.4,
    featured: false
  },
  {
    name: 'Sac à Dos Design',
    description: 'Sac à dos ergonomique avec compartiments intelligents',
    price: 89.99,
    discount: 5,
    category: 'Accessoires',
    stock: 80,
    image: 'https://via.placeholder.com/300?text=Sac+a+Dos',
    color: 'Gris',
    sku: 'BAG-001',
    rating: 4.6,
    featured: true
  },
  {
    name: 'Chaussures de Sport',
    description: 'Chaussures confortables pour le sport et la casual',
    price: 129.99,
    discount: 12,
    category: 'Accessoires',
    stock: 100,
    image: 'https://via.placeholder.com/300?text=Chaussures',
    color: 'Noir/Blanc',
    sku: 'SHOES-001',
    rating: 4.5,
    featured: false
  },
  {
    name: 'Lampe de Bureau LED',
    description: 'Lampe LED avec contrôle de luminosité et couleur',
    price: 59.99,
    discount: 25,
    category: 'Maison',
    stock: 60,
    image: 'https://via.placeholder.com/300?text=Lampe+LED',
    color: 'Blanc',
    sku: 'LAMP-001',
    rating: 4.4,
    featured: true
  },
  {
    name: 'Tapis Confortable',
    description: 'Tapis moelleux et durable pour le salon',
    price: 149.99,
    discount: 0,
    category: 'Maison',
    stock: 30,
    image: 'https://via.placeholder.com/300?text=Tapis',
    color: 'Beige',
    sku: 'CARPET-001',
    rating: 4.3,
    featured: false
  },
  {
    name: 'Coussin Premium',
    description: 'Coussin ergonomique pour confort optimal',
    price: 39.99,
    discount: 30,
    category: 'Maison',
    stock: 120,
    image: 'https://via.placeholder.com/300?text=Coussin',
    color: 'Gris',
    sku: 'PILLOW-001',
    rating: 4.2,
    featured: true
  },
  {
    name: 'Tablette Graphique',
    description: 'Tablette professionnelle pour designers et artistes',
    price: 349.99,
    discount: 8,
    category: 'Électronique',
    stock: 25,
    image: 'https://via.placeholder.com/300?text=Tablette',
    color: 'Noir',
    sku: 'TABLET-001',
    rating: 4.8,
    featured: true
  },
  {
    name: 'Caméra Webcam 4K',
    description: 'Webcam haute résolution pour streaming et vidéoconférence',
    price: 159.99,
    discount: 18,
    category: 'Électronique',
    stock: 40,
    image: 'https://via.placeholder.com/300?text=Webcam',
    color: 'Noir',
    sku: 'WEBCAM-001',
    rating: 4.6,
    featured: false
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connecté à MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Produits existants supprimés');

    // Insert sample products
    const insertedProducts = await Product.insertMany(sampleProducts);
    console.log(`${insertedProducts.length} produits insérés avec succès!`);

    await mongoose.disconnect();
    console.log('Déconnecté de MongoDB');
  } catch (error) {
    console.error('Erreur lors du seed:', error);
    process.exit(1);
  }
}

seedDatabase();
