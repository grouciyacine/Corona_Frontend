import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Admin = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-8 flex items-center justify-center">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                {/* Manage Infirmier Accounts Card */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                    className="relative group"
                >
                    <Link
                        to="/admin/comptes"
                        className="block h-full w-full rounded-2xl shadow-xl overflow-hidden"
                    >
                        <div className="bg-white h-full p-8 flex flex-col items-center justify-center text-center">
                            <div className="mb-4 text-6xl">👨‍⚕️</div>
                            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-[#FF6CAB] to-[#7366FF] bg-clip-text text-transparent">
                                Gérer Comptes Infirmiers
                            </h2>
                            <p className="text-gray-600">
                                Ajouter, modifier, supprimer les comptes infirmiers et effectuer des recherches
                            </p>
                            <motion.div
                                className="absolute inset-0 border-2 border-transparent group-hover:border-[#FF6CAB] rounded-2xl"
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                    </Link>
                </motion.div>

                {/* Consultation History Card */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    whileHover={{ scale: 1.05 }}
                    className="relative group"
                >
                    <Link
                        to="/admin/historiques"
                        className="block h-full w-full rounded-2xl shadow-xl overflow-hidden"
                    >
                        <div className="bg-white h-full p-8 flex flex-col items-center justify-center text-center">
                            <div className="mb-4 text-6xl">📜</div>
                            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-[#7366FF] to-[#FF6CAB] bg-clip-text text-transparent">
                                Consultation des Historiques
                            </h2>
                            <p className="text-gray-600">
                                Accédez aux historiques des consultations et effectuez des recherches avancées
                            </p>
                            <motion.div
                                className="absolute inset-0 border-2 border-transparent group-hover:border-[#7366FF] rounded-2xl"
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                    </Link>
                </motion.div>
            </div>
        </div>
    );
};

export default Admin;
