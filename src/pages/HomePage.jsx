import React from 'react'
import Header from '../components/Layout/Header'
import Hero from '../components/Route/Hero/Hero'
import BestDeals from '../components/Route/BestDeals.jsx/BestDeals'
import Events from '../components/Events/Events'
import FeaturedProduct from '../components/Route/FeaturedProduct/FeaturedProduct'
import Footer from '../components/Layout/Footer'
import Categories from '../components/Route/Categories/Categories'
import Banner from '../components/Route/Banner.jsx/Banner'

const HomePage = () => {
  return (
    <div>
        <Header />
        <Hero />
        <Categories />
        <BestDeals /> 
        <Banner />
        <FeaturedProduct />   
        <Footer />
    </div>
  )
}

export default HomePage