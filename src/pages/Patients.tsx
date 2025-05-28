import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { djangoAPI } from '../makeRequest';

interface Patient {
    nom: string;
    prenom: string;
    adresse: string;
    date_naissance: string;
    Age: number;
    Sexe: number;
    Etat: number;
    EN: number;
    T: number;
    F: number;
    AST: number;
    A: number;
    C: number;
    Dys: number;
    SDRA: number;
    E: number;
    D: number;
    ANOS: number;
    AGU: number;
    DD: number;
    severity: string;
}

interface Consultation {
    date: string;
    doctor: string;
    notes: string;
}

const Patients = () => {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchNom, setSearchNom] = useState('');
    const [searchPrenom, setSearchPrenom] = useState('');
    const [searchDate, setSearchDate] = useState('');
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [consultations, setConsultations] = useState<Consultation[]>([]);

    // Mock consultation history
    const mockConsultationHistory: Consultation[] = [
        { date: '2025-05-01', doctor: 'Dr. Smith', notes: 'Routine check-up, no issues.' },
        { date: '2025-04-15', doctor: 'Dr. Johnson', notes: 'Complained of fatigue, prescribed vitamins.' },
        { date: '2025-03-10', doctor: 'Dr. Brown', notes: 'Follow-up for previous condition, improving well.' },
    ];

    const fieldMappings: { [key: string]: { [key: number]: string } } = {
        Sexe: { 1: 'Male', 0: 'Female' },
        Etat: { 0: 'Not Pregnant', 1: 'Pregnant' },
        EN: { 0: 'No', 1: 'Yes' },
        T: { 0: 'Dry', 1: 'Productive', 2: 'None' },
        F: { 1: 'High (>38.5)', 2: 'Low (≤38.5)' },
        AST: { 0: 'No Fatigue', 1: 'Persistent Fatigue' },
        DD: { 1: 'Elevated', 2: 'Normal' },
        A: { 0: 'No', 1: 'Yes' },
        C: { 0: 'No', 1: 'Yes' },
        Dys: { 0: 'No', 1: 'Yes' },
        SDRA: { 0: 'No', 1: 'Yes' },
        E: { 0: 'No', 1: 'Yes' },
        D: { 0: 'No', 1: 'Yes' },
        ANOS: { 0: 'No', 1: 'Yes' },
        AGU: { 0: 'No', 1: 'Yes' },
    };

    const fetchPatients = async (params?: { nom?: string; prenom?: string; date_naissance?: string }) => {
        setLoading(true);
        setError('');
        try {
            let url = '/patients/';
            if (params && (params.nom || params.prenom || params.date_naissance)) {
                const query = new URLSearchParams();
                if (params.nom) query.append('nom', params.nom);
                if (params.prenom) query.append('prenom', params.prenom);
                if (params.date_naissance) query.append('date_naissance', params.date_naissance);
                url = `/search-patient/?${query.toString()}`;
            }
            const response = await djangoAPI.get<Patient[]>(url);
            setPatients(response.data);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to fetch patients');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchPatients({ nom: searchNom, prenom: searchPrenom, date_naissance: searchDate });
    };

    const handlePatientClick = (patient: Patient) => {
        setSelectedPatient(patient);
        setConsultations(mockConsultationHistory); // Use mock data for consultation history
    };

    const getFieldValue = (field: string, value: number) => {
        return fieldMappings[field]?.[value] ?? value;
    };

    return (
        <div className="text-black min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-lg overflow-hidden"
                >
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                            <h1 className="text-2xl font-bold text-gray-800">Patient Records</h1>
                            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                                <input
                                    type="text"
                                    placeholder="Nom"
                                    value={searchNom}
                                    onChange={e => setSearchNom(e.target.value)}
                                    className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="text"
                                    placeholder="Prenom"
                                    value={searchPrenom}
                                    onChange={e => setSearchPrenom(e.target.value)}
                                    className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="date"
                                    placeholder="Date de naissance"
                                    value={searchDate}
                                    onChange={e => setSearchDate(e.target.value)}
                                    className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                >
                                    Search
                                </button>
                            </form>
                        </div>
                    </div>

                    {loading ? (
                        <div className="h-64 flex items-center justify-center">
                            <motion.div
                                className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1 }}
                            />
                        </div>
                    ) : error ? (
                        <div className="p-6 text-red-600">{error}</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {[ 'Name','DOB','Address','Gender','Pregnancy','Nasal Discharge','Cough','Fever','Fatigue','Anorexia','Myalgia','Dyspnea','ARDS','Sputum','Diarrhea','Anosmia','Ageusia','D-Dimer','Severity' ].map(header => (
                                            <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    <AnimatePresence>
                                        {patients.map(patient => (
                                            <motion.tr
                                                key={`${patient.nom}-${patient.prenom}-${patient.date_naissance}`}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="hover:bg-gray-50 transition-colors cursor-pointer"
                                                onClick={() => handlePatientClick(patient)}
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">{patient.prenom} {patient.nom}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{new Date(patient.date_naissance).toLocaleDateString()}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{patient.adresse}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{getFieldValue('Sexe', patient.Sexe)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {patient.Sexe === 0 ? getFieldValue('Etat', patient.Etat) : '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">{getFieldValue('EN', patient.EN)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{getFieldValue('T', patient.T)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{getFieldValue('F', patient.F)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{getFieldValue('AST', patient.AST)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{getFieldValue('A', patient.A)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{getFieldValue('C', patient.C)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{getFieldValue('Dys', patient.Dys)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{getFieldValue('SDRA', patient.SDRA)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{getFieldValue('E', patient.E)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{getFieldValue('D', patient.D)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{getFieldValue('ANOS', patient.ANOS)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{getFieldValue('AGU', patient.AGU)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{getFieldValue('DD', patient.DD)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${patient.severity === 'High risk' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                                        {patient.severity}
                                                    </span>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>
                    )}
                </motion.div>

                {/* Consultation History Modal */}
                {selectedPatient && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    >
                        <div className="bg-white rounded-lg shadow-lg w-3/4 max-w-4xl p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">Consultation History for {selectedPatient.prenom} {selectedPatient.nom}</h2>
                                <button
                                    onClick={() => setSelectedPatient(null)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    ✖
                                </button>
                            </div>
                            <ul className="space-y-4">
                                {consultations.map((consultation, index) => (
                                    <li key={index} className="p-4 border rounded-lg">
                                        <p><strong>Date:</strong> {consultation.date}</p>
                                        <p><strong>Doctor:</strong> {consultation.doctor}</p>
                                        <p><strong>Notes:</strong> {consultation.notes}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Patients;