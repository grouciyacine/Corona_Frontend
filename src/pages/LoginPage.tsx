import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { djangoAPI } from '../makeRequest'; // <-- Adjust path if needed
import { useDispatch } from 'react-redux';
import { setUser } from '../store/userSlice'; // Adjust path if needed

const inputVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

const buttonVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

const shakeAnimation = {
  x: [0, -10, 10, -10, 10, 0],
  transition: { duration: 0.4 },
};

const LoginPage = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    nomUtilisateur: '',
    motDePasse: '',
  });
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    try {
      const response = await djangoAPI.post('/login/', {
        nomUtilisateur: formData.nomUtilisateur,
        motDePasse: formData.motDePasse,
      });

      if (response.data.success) {
        const { role, id, nomUtilisateur } = response.data;
        dispatch(setUser({ nomUtilisateur, id, role }));
        navigate('/'); // Or navigate(`/dashboard/${role.toLowerCase()}`) for role-based routing
      } else {
        setError(true);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(true);
    }

    setLoading(false);
  };
  

  return (
    <div className="text-black min-h-screen bg-gradient-to-br from-[#FF6CAB] to-[#7366FF] flex items-center justify-center p-4">
      <motion.form
        onSubmit={handleSubmit}
        initial="hidden"
        animate="visible"
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">Connexion</h2>

        {["nomUtilisateur", "motDePasse"].map((field, i) => (
          <motion.div
            key={field}
            custom={i}
            variants={inputVariants}
            animate={error ? shakeAnimation : "visible"}
          >
            <label htmlFor={field} className="block text-gray-700 font-medium mb-1">
              {field === "nomUtilisateur" ? "Nom d'utilisateur" : "Mot de passe"}
            </label>
            <motion.input
              type={field === "motDePasse" ? "password" : "text"}
              name={field}
              value={formData[field as keyof typeof formData]}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#7366FF] focus:border-transparent"
            />
          </motion.div>
        ))}



        {error && <div className="text-red-600 text-center font-medium">Nom d'utilisateur ou mot de passe incorrect</div>}

        <motion.button
          type="submit"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          disabled={loading}
          className={`w-full py-3 rounded-xl text-white font-semibold text-lg transition-colors duration-300 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#7366FF] hover:bg-[#5a4ddb]'
            }`}
        >
          {loading ? 'Connexion...' : 'Se connecter'}
        </motion.button>
      </motion.form>
    </div>
  );
};

export default LoginPage;
