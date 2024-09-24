import React from 'react';

const TropicalFusionTruck = () => {
  return (
    <div className="App">
      <div className="Header">
        <img src="/assets/haiti-moulin-sur-mer.webp" alt="Tropical beach" className="header-image" />
      </div>
      <h1 className="title">Tropical Fusion Truck</h1>
      <div className="container">
        <FoodCard
          image="/assets/beef-tassot.webp"
          title="Tassot with plantains, pikliz, and avocado"
          cuisine="Haitian"
          link="https://www.savorythoughts.com/haitian-tasso"
        />
        <FoodCard
          image="/assets/12DJONDJONrex-jtlb-superJumbo.jpg"
          title="Diri Djon Djon"
          cuisine="Haitian"
          link="https://www.blackfoodie.co/recipe/djon-djon-haitian-mushroom-rice/"
        />
        <FoodCard
          image="/assets/bon-griot.webp"
          title="Griot"
          cuisine="Haitian"
           link="https://cooking.nytimes.com/recipes/1017276-haitian-pork-griot"
        />
        
         <FoodCard
          image="/assets/haitian-mac-and-cheese-9960.jpg"
          title="Mac and Cheese"
          cuisine="Haitian"
          link="https://travelfoodatlas.com/makawoni-au-graten-haitian-mac-and-cheese-recipe"
        />
         <FoodCard
          image="/assets/patties.jpg"
          title="Pate"
          cuisine="Haitian"
          link="http://www.suzonspice.com/patteacute.html"
        />
         <FoodCard
          image="/assets/dous-makos.jpg"
          title="Dous Makos"
          cuisine="Haitian"
          link="https://haitiancooking.com/recipe/dous-makos-haitian-fudge/"
        />
         <FoodCard
          image="/assets/beignets.jpg"
          title="Benyen"
          cuisine="Haitian"
          link="https://loveforhaitianfood.com/recipe/haitian-benyen-beignets-de-carnaval/?v=0b3b97fa6688"
        />
         <FoodCard
          image="/assets/fresco.jpg"
          title="Fresko"
          cuisine="Haitian"
          link="https://tchakayiti.com/home/haitian-fresco-lakay/"
        />
         <FoodCard
          image="/assets/ju-sitron.jpg"
          title="Ju Sitron"
          cuisine="Haitian"
          link="https://www.savorythoughts.com/jus-de-citron-haitian-lemonade/"
        />
         <FoodCard
          image="/assets/couronnes.jpg"
          title="Couronne"
          cuisine="Haitian"
          link="https://haiprodistribution.com/product/cola-couronne-fruit-champage/"
        />
      </div>
    </div>
  );
};

const FoodCard = ({ image, title, cuisine, link }) => {
  return (
    <div className="food-card">
        <div className='image-container'>
      <img src={image} alt={title} className="food-image" />
      </div>
      <h3>{title}</h3>
      <h4>{cuisine}</h4>
      <button className="more-button" onClick={() => window.location.href = link}>More</button>
    </div>
  );
};

export default TropicalFusionTruck;
/* feat: Add Tropical Fusion Truck component with food card listings

- Implemented the TropicalFusionTruck component to showcase a selection of Haitian dishes.
- Each dish is represented by a FoodCard component, which includes an image, title, cuisine type, and a button linking to the recipe.
- Added links to various Haitian recipes to provide users with easy access to cooking instructions.
- Included images for each dish to enhance the visual appeal of the application.

Added description of the website in README
Removed py file that was for testing purposes to setup conda
Testing 1.1 the gif link
 */ 