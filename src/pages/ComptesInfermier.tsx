import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { djangoAPI } from '../makeRequest';

type Infirmier = {
  id: number;
  nomUtilisateur: string;
  email: string;
  password: string;
};

const ComptesInfermier = () => {
  const [infirmiers, setInfirmiers] = useState<Infirmier[]>([]);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({ nom: '', password: '' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [currentInfirmier, setCurrentInfirmier] = useState<Infirmier | null>(null);

  const makeRequest = async (
    method: 'get' | 'post' | 'put' | 'delete',
    url: string,
    data: any = null
  ) => {
    try {
      const response = await djangoAPI({ method, url, data });
      return response.data;
    } catch (error) {
      console.error('Request failed:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchInfirmiers = async () => {
      const data = await makeRequest('get', '/infirmiers/');
      if (data) setInfirmiers(data);
    };
    fetchInfirmiers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId !== null && currentInfirmier) {
      // Update mode: Update both name and password
      // Use existing values if fields are empty
      const payload = {
        nomUtilisateur: formData.nom.trim() || currentInfirmier.nomUtilisateur,
        password: formData.password.trim() || currentInfirmier.password,
      };
      
      const updated = await makeRequest('put', `/infirmiers/${editingId}/modifier/`, payload);
      if (updated) {
        setInfirmiers(prev =>
          prev.map(inf => 
            inf.id === editingId ? { 
              ...inf, 
              nomUtilisateur: payload.nomUtilisateur,
              password: payload.password
            } : inf
          )
        );
        setEditingId(null);
        setCurrentInfirmier(null);
        setFormData({ nom: '', password: '' });
      }
    } else {
      // Create mode: Require both fields
      if (!formData.nom.trim() || !formData.password.trim()) return;
      
      const payload = {
        nomUtilisateur: formData.nom,
        password: formData.password,
        email: `${formData.nom.replace(/\s+/g, '').toLowerCase()}@infirmier.com`
      };
      
      const created = await makeRequest('post', '/infirmiers/creer/', payload);
      if (created) {
        setInfirmiers(prev => [...prev, created]);
        setFormData({ nom: '', password: '' });
      }
    }
  };

  const handleEdit = (id: number) => {
    const infirmier = infirmiers.find(inf => inf.id === id);
    if (infirmier) {
      setCurrentInfirmier(infirmier);
      setFormData({
        nom: infirmier.nomUtilisateur,
        password: '' // Never show actual password
      });
      setEditingId(id);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm('Êtes-vous sûr de vouloir supprimer cet infirmier ?');
    if (!confirmDelete) return;

    const deleted = await makeRequest('delete', `/infirmiers/${id}/supprimer/`);
    if (deleted !== null) {
      setInfirmiers(prev => prev.filter(inf => inf.id !== id));
    }
  };

  const filteredInfirmiers = infirmiers.filter(inf =>
    `${inf.nomUtilisateur || ''}`.toLowerCase().includes(search.toLowerCase())
  );

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
            placeholder={editingId ? "Nom (laisser vide pour garder actuel)" : "Nom"}
            value={formData.nom}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#7366FF]"
            required={!editingId}
          />
          
          <input
            type="password"
            name="password"
            placeholder={editingId ? "Mot de passe" : "Mot de passe"}
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#7366FF]"
            required={!editingId}
          />
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            type="submit"
            disabled={
              editingId 
                ? false // Always enabled in edit mode since we keep existing values
                : !formData.nom.trim() || !formData.password.trim()
            }
            className={`${
              editingId 
                ? 'bg-[#7366FF] hover:bg-[#5e53d4]'
                : !formData.nom.trim() || !formData.password.trim()
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#7366FF] hover:bg-[#5e53d4]'
            } text-white px-6 py-2 rounded-lg font-semibold`}
          >
            {editingId ? 'Modifier' : 'Créer'}
          </motion.button>
        </form>

        <input
          type="text"
          placeholder="Recherche par nom"
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
                <p className="font-semibold text-lg text-gray-700">{inf.nomUtilisateur}</p>
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