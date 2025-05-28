import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaEdit, FaTrash } from 'react-icons/fa';

const ComptesInfermier = () => {
  const [infirmiers, setInfirmiers] = useState([
    { id: 1, nom: 'Amine B.', email: 'amine@example.com', password: 'pass123' },
    { id: 2, nom: 'Sara K.', email: 'sara@example.com', password: 'password' },
  ]);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({ nom: '', email: '', password: '' });
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setInfirmiers(prev =>
        prev.map(inf =>
          inf.id === editingId ? { ...inf, ...formData } : inf
        )
      );
      setEditingId(null);
    } else {
      setInfirmiers(prev => [
        ...prev,
        { id: Date.now(), ...formData },
      ]);
    }
    setFormData({ nom: '', email: '', password: '' });
  };

  const handleEdit = (id: number) => {
    const infirmier = infirmiers.find(inf => inf.id === id);
    if (infirmier) {
      setFormData({ nom: infirmier.nom, email: infirmier.email, password: infirmier.password });
      setEditingId(id);
    }
  };

  const handleDelete = (id: number) => {
    setInfirmiers(prev => prev.filter(inf => inf.id !== id));
  };

  const filteredInfirmiers = infirmiers.filter(inf =>
    inf.nom.toLowerCase().includes(search.toLowerCase()) ||
    inf.email.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (
      formData.nom.trim() === '' &&
      formData.email.trim() === '' &&
      formData.password.trim() === ''
    ) {
      setEditingId(null);
    }
  }, [formData]);

  return (
    <div className="text-black min-h-screen p-6 bg-gradient-to-br from-blue-50 to-purple-100">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white max-w-4xl mx-auto p-6 rounded-xl shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-4 text-[#7366FF]">Gérer les comptes infirmiers</h2>

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <input
            type="text"
            name="nom"
            placeholder="Nom"
            value={formData.nom}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#7366FF]"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#7366FF]"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#7366FF]"
            required
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            type="submit"
            disabled={
              !formData.nom.trim() ||
              !formData.email.trim() ||
              !formData.password.trim()
            }
            className={`${
              !formData.nom.trim() ||
              !formData.email.trim() ||
              !formData.password.trim()
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#7366FF] hover:bg-[#5e53d4]'
            } text-white px-6 py-2 rounded-lg font-semibold`}
          >
            {editingId ? 'Modifier' : 'Créer'}
          </motion.button>
        </form>

        <input
          type="text"
          placeholder="Recherche par nom ou email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mb-4 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#7366FF]"
        />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          className="space-y-3"
        >
          {filteredInfirmiers.map(inf => (
            <motion.div
              key={inf.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="bg-gray-100 p-4 rounded-lg flex items-center justify-between shadow-md"
            >
              <div>
                <p className="font-semibold text-lg text-gray-700">{inf.nom}</p>
                <p className="text-sm text-gray-500">{inf.email}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleEdit(inf.id)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(inf.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <FaTrash />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ComptesInfermier;
