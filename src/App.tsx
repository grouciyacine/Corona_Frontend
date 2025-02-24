import TextAnimation from './components/TextAnimation';
import Navbar from './components/Navbar';
import { motion } from 'framer-motion'
import Button from './components/Button';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';

export default function App() {
  return (
    <div className='flex flex-col w-full h-full justify-start items-center relative'>
      <Navbar />
      <div className='m-15'>
        <TextAnimation className='text-7xl mt-10' text='Welcome to ViroVision' />
      </div>
      <motion.article
  className="p-8 max-w-4xl mx-6 lg:mx-auto text-gray-200 bg-black/30 backdrop-blur-sm rounded-2xl border border-white/10 shadow-xl"
  initial={{ x: "-100vw", opacity: 0, scale: 0.95 }}
  animate={{ x: 0, opacity: 1, scale: 1 }}
  transition={{ 
    duration: 0.8, 
    ease: [0.17, 0.67, 0.32, 0.98],
    delay: 0.2
  }}
  whileHover={{ scale: 1.005 }}
>
  {[
    "Bienvenue sur notre site, une plateforme de pointe conçue pour exploiter la puissance de l'apprentissage automatique au service de la santé publique. Notre système utilise des techniques avancées de régression par forêts pour détecter et analyser les tendances liées au coronavirus (COVID-19). En traitant d'énormes quantités de données, notre modèle peut identifier les premiers signes avant-coureurs d'une éventuelle flambée et prévoir la propagation du virus dans différentes régions.",
    
    "Notre mission est d'offrir aux professionnels de la santé, aux chercheurs et à l'ensemble de la communauté des informations exploitables pour une meilleure prise de décision. Que vous souhaitiez mieux comprendre la dynamique du COVID-19 ou obtenir un appui basé sur l'analyse des données, nos tableaux de bord interactifs et nos mises à jour en temps réel vous offrent une vue claire et concise des tendances actuelles et des prévisions.",
    
    "Explorez notre plateforme pour découvrir comment la technologie et la science des données se conjuguent pour contribuer à la lutte contre la pandémie, vous permettant ainsi de rester informé et préparé en ces temps difficiles."
  ].map((paragraph, index) => (
    <motion.div
      key={index}
      className="mb-6 text-lg leading-relaxed tracking-wide"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 + index * 0.15 }}
    >
      {paragraph}
    </motion.div>
  ))}
</motion.article>
      <Button text='Get Started' />
      <HeroSection/>
      <Footer/>
    </div>
  );
}



