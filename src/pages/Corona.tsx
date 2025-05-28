import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { djangoAPI } from '../makeRequest';
import TextAnimation from '../components/TextAnimation';

interface PredictionResponse {
    prediction: number;
    probability: number;
    severity: string;
}

interface FormData {
    nom: string;
    prenom: string;
    adresse: string;
    date_naissance: string;
    Age: string;
    Sexe: string;
    Etat: string;
    EN: string;
    T: string;
    F: string;
    AST: string;
    A: string;
    C: string;
    Dys: string;
    SDRA: string;
    E: string;
    D: string;
    ANOS: string;
    AGU: string;
    DD: string;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, when: "beforeChildren" }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: 'spring', stiffness: 120 }
    }
};



const FieldExplanation = ({ children }: { children: React.ReactNode }) => (
    <span className="ml-1.5 cursor-help relative group inline-flex items-center">
        <svg
            className="w-4 h-4 text-[#7366FF] hover:text-[#FF6CAB] transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
        </svg>
        <div className="absolute hidden group-hover:block w-64 p-3 bg-white border border-gray-200 rounded-lg shadow-lg text-sm text-gray-600 z-50 -left-8 -top-12">
            {children}
        </div>
    </span>
);

const Crona: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        nom: '',
        prenom: '',
        adresse: '',
        date_naissance: '',
        Age: '',
        Sexe: '0',
        Etat: '0',
        EN: '',
        T: '',
        F: '1',
        AST: '0',
        A: '0',
        C: '0',
        Dys: '0',
        SDRA: '0',
        E: '0',
        D: '0',
        ANOS: '0',
        AGU: '0',
        DD: '1'
    });

    const [result, setResult] = useState<PredictionResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!formData.nom || !formData.prenom || !formData.adresse || !formData.date_naissance) {
            setError('Please fill all required personal information fields');
            setLoading(false);
            return;
        }

        try {
            const numericalFields = ['Age', 'Sexe', 'Etat', 'EN', 'T', 'F', 'AST',
                'A', 'C', 'Dys', 'SDRA', 'E', 'D', 'ANOS', 'AGU', 'DD'];

            const payload = Object.fromEntries(
                Object.entries(formData).map(([key, value]) => [
                    key,
                    numericalFields.includes(key) ? Number(value) : value
                ])
            );

            const response = await djangoAPI.post<PredictionResponse>('/predict/', payload);
            setResult(response.data);
        } catch (err: any) {
            setError(err.response?.data?.error || 'An error occurred during prediction');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b text-black from-blue-50 to-purple-50 py-12">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"
            >
                <motion.div
                    className="bg-white rounded-2xl shadow-2xl overflow-hidden"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="bg-gradient-to-r from-[#FF6CAB] to-[#7366FF] p-8 text-center">
                        <TextAnimation
                            text="COVID-19 Risk Assessment"
                            className="text-4xl font-bold text-white mb-2"
                        />
                        <p className="text-white/90 text-lg">Advanced Medical Evaluation System</p>
                    </div>

                    <div className="p-8 space-y-8">
                        <motion.form
                            onSubmit={handleSubmit}
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="space-y-8"
                        >
                            {/* Personal Information Section */}
                            <motion.div
                                variants={itemVariants}
                                className="bg-gray-50 p-6 rounded-xl border border-gray-200"
                            >
                                <div className="flex items-center mb-6">
                                    <div className="h-8 w-1 bg-[#FF6CAB] rounded-full mr-3" />
                                    <h2 className="text-2xl font-semibold text-gray-800">
                                        Patient Information
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {[
                                        { label: 'First Name (Prénom)', name: 'prenom', type: 'text' },
                                        { label: 'Last Name (Nom)', name: 'nom', type: 'text' },
                                        { label: 'Address (Adresse)', name: 'adresse', type: 'text' },
                                        { 
                                            label: 'Birth Date (Date de Naissance)', 
                                            name: 'date_naissance', 
                                            type: 'date',
                                            explanation: 'Patient date of birth in YYYY-MM-DD format'
                                        },
                                    ].map((field) => (
                                        <motion.div
                                            key={field.name}
                                            variants={itemVariants}
                                            className="space-y-1"
                                        >
                                            <label className="block text-sm font-medium text-gray-700  items-center">
                                                {field.label.split(' (')[0]}
                                                <FieldExplanation>
                                                    {field.explanation || `${field.label} information`}
                                                    {field.label.match(/\(.*?\)/) && (
                                                        <span className="block mt-2 text-xs italic">
                                                            {field.label.match(/\(.*?\)/)?.[0]}
                                                        </span>
                                                    )}
                                                </FieldExplanation>
                                            </label>
                                            <input
                                                type={field.type}
                                                name={field.name}
                                                value={formData[field.name as keyof FormData]}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#7366FF] focus:border-transparent"
                                                required
                                                max={field.type === 'date' ? new Date().toISOString().split('T')[0] : undefined}
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Demographic Data Section */}
                            <motion.div
                                variants={itemVariants}
                                className="bg-gray-50 p-6 rounded-xl border border-gray-200"
                            >
                                <div className="flex items-center mb-6">
                                    <div className="h-8 w-1 bg-[#7366FF] rounded-full mr-3" />
                                    <h2 className="text-2xl font-semibold text-gray-800">
                                        Demographic Data
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {[
                                        {
                                            label: 'Age',
                                            name: 'Age',
                                            type: 'number',
                                            explanation: '0: <15 years\n1: ≥15 years'
                                        },
                                        {
                                            label: 'Gender',
                                            name: 'Sexe',
                                            type: 'select',
                                            options: ['Female', 'Male'],
                                            explanation: 'Biological sex identification'
                                        },
                                        {
                                            label: 'Pregnancy Status',
                                            name: 'Etat',
                                            type: 'select',
                                            options: ['Not Pregnant', 'Pregnant'],
                                            explanation: 'Only applicable for female patients'
                                        },
                                    ].map((field) => (
                                        <motion.div
                                            key={field.name}
                                            variants={itemVariants}
                                            className="space-y-1"
                                        >
                                            <label className="block text-sm font-medium text-gray-700  items-center">
                                                {field.label}
                                                <FieldExplanation>
                                                    {field.explanation}
                                                </FieldExplanation>
                                            </label>
                                            {field.type === 'select' ? (
                                                <select
                                                    name={field.name}
                                                    value={formData[field.name as keyof FormData]}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#7366FF] focus:border-transparent"
                                                >
                                                    {field.options?.map((option, index) => (
                                                        <option key={option} value={index}>
                                                            {option}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <input
                                                    type={field.type}
                                                    name={field.name}
                                                    value={formData[field.name as keyof FormData]}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#7366FF] focus:border-transparent"
                                                    min="0"
                                                    max="1"
                                                />
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Clinical Parameters Section */}
                            <motion.div
                                variants={itemVariants}
                                className="bg-gray-50 p-6 rounded-xl border border-gray-200"
                            >
                                <div className="flex items-center mb-6">
                                    <div className="h-8 w-1 bg-[#FF6CAB] rounded-full mr-3" />
                                    <h2 className="text-2xl font-semibold text-gray-800">
                                        Clinical Parameters
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {[
                                        { 
                                            label: 'Nasal Discharge (EN)',
                                            name: 'EN',
                                            options: ['No', 'Yes'],
                                            explanation: 'Presence of rhinorrhea or nasal congestion'
                                        },
                                        {
                                            label: 'Cough Type (T)',
                                            name: 'T',
                                            options: ['Dry', 'Productive', 'None'],
                                            explanation: 'Characterization of cough nature\n0: Dry\n1: Productive\n2: None'
                                        },
                                        {
                                            label: 'Fever (F)',
                                            name: 'F',
                                            options: ['High (>38.5°C)', 'Low (≤38.5°C)'],
                                            explanation: 'Body temperature measurement'
                                        },
                                        {
                                            label: 'Fatigue (AST)',
                                            name: 'AST',
                                            options: ['No Fatigue', 'Persistent Fatigue'],
                                            explanation: 'Unexplained persistent tiredness'
                                        },
                                        {
                                            label: 'D-Dimer (DD)',
                                            name: 'DD',
                                            options: ['Normal (≤500 μg/L)', 'Elevated (>500 μg/L)'],
                                            explanation: 'Blood coagulation marker levels'
                                        },
                                    ].map((field) => (
                                        <motion.div
                                            key={field.name}
                                            variants={itemVariants}
                                            className="space-y-1"
                                        >
                                            <label className="block text-sm font-medium text-gray-700  items-center">
                                                {field.label.split(' (')[0]}
                                                <FieldExplanation>
                                                    {field.explanation}
                                                    <span className="block mt-2 text-xs italic">
                                                        {field.label.match(/\(.*?\)/)?.[0]}
                                                    </span>
                                                </FieldExplanation>
                                            </label>
                                            <select
                                                name={field.name}
                                                value={formData[field.name as keyof FormData]}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#7366FF] focus:border-transparent"
                                            >
                                                {field.options.map((option, index) => (
                                                    <option key={option} value={index}>  {/* Corrected line */}
                                                        {option}
                                                    </option>
                                                ))}
                                            </select>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Symptoms & Conditions Section */}
                            <motion.div
                                variants={itemVariants}
                                className="bg-gray-50 p-6 rounded-xl border border-gray-200"
                            >
                                <div className="flex items-center mb-6">
                                    <div className="h-8 w-1 bg-[#7366FF] rounded-full mr-3" />
                                    <h2 className="text-2xl font-semibold text-gray-800">
                                        Symptoms & Conditions
                                    </h2>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {[
                                        { 
                                            field: 'A', 
                                            label: 'Anorexia',
                                            explanation: 'Significant loss of appetite or reduced food intake'
                                        },
                                        { 
                                            field: 'C', 
                                            label: 'Myalgia',
                                            explanation: 'Muscle pain or body aches unrelated to physical activity'
                                        },
                                        { 
                                            field: 'Dys', 
                                            label: 'Dyspnea',
                                            explanation: 'Shortness of breath, typically appears 5-8 days after onset'
                                        },
                                        { 
                                            field: 'SDRA', 
                                            label: 'ARDS',
                                            explanation: 'Acute Respiratory Distress Syndrome - severe lung condition'
                                        },
                                        { 
                                            field: 'E', 
                                            label: 'Sputum',
                                            explanation: 'Phlegm production from respiratory tract'
                                        },
                                        { 
                                            field: 'D', 
                                            label: 'Diarrhea',
                                            explanation: 'Gastrointestinal symptom with loose stools'
                                        },
                                        { 
                                            field: 'ANOS', 
                                            label: 'Anosmia',
                                            explanation: 'Complete or partial loss of smell'
                                        },
                                        { 
                                            field: 'AGU', 
                                            label: 'Ageusia',
                                            explanation: 'Loss of taste function'
                                        },
                                    ].map(({ field, label, explanation }) => (
                                        <motion.label
                                            key={field}
                                            variants={itemVariants}
                                            className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-[#FF6CAB] transition-colors cursor-pointer"
                                            whileHover={{ y: -2 }}
                                        >
                                            <div className="relative">
                                                <input
                                                    type="checkbox"
                                                    name={field}
                                                    checked={formData[field as keyof typeof formData] === '1'}
                                                    onChange={(e) => setFormData(prev => ({
                                                        ...prev,
                                                        [field]: e.target.checked ? '1' : '0'
                                                    }))}
                                                    className="sr-only"
                                                />
                                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors
                                                    ${formData[field as keyof typeof formData] === '1'
                                                        ? 'bg-[#FF6CAB] border-[#FF6CAB]'
                                                        : 'bg-white border-gray-300'}`}
                                                >
                                                    <svg
                                                        className="w-3 h-3 text-white"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={3}
                                                            d="M5 13l4 4L19 7"
                                                        />
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="text-gray-700">{label}</span>
                                                <FieldExplanation>
                                                    {explanation}
                                                </FieldExplanation>
                                            </div>
                                        </motion.label>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Submit Section */}
                            <motion.div
                                variants={itemVariants}
                                className="pt-6"
                            >
                                <motion.button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-gradient-to-r from-[#FF6CAB] to-[#7366FF] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-shadow disabled:opacity-75"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center space-x-2">
                                            <motion.div
                                                className="w-5 h-5 border-2 border-white rounded-full"
                                                animate={{ rotate: 360 }}
                                                transition={{ repeat: Infinity, duration: 1 }}
                                            />
                                            <span>Processing Assessment...</span>
                                            </div>
                                    ) : (
                                        'Assess COVID-19 Risk'
                                    )}
                                </motion.button>

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200"
                                    >
                                        ⚠️ {error}
                                    </motion.div>
                                )}
                            </motion.div>
                        </motion.form>

                        {/* Result Section */}
                        {result && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-8 p-6 rounded-xl bg-gradient-to-r from-[#FF6CAB] to-[#7366FF] text-white"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4 border-r border-white/20 pr-8">
                                        <h2 className="text-3xl font-bold">Diagnostic Result</h2>
                                        <div className="flex items-center space-x-4">
                                            <div className={`text-5xl ${result.severity === 'High risk' ? 'animate-pulse' : ''}`}>
                                                {result.severity === 'High risk' ? '⚠️' : '✅'}
                                            </div>
                                            <div>
                                                <p className="text-4xl font-bold">{result.severity}</p>
                                                <p className="text-sm opacity-90">Confidence Level: {(result.probability * 100).toFixed(1)}%</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-4 pl-8">
                                        <h3 className="text-2xl font-semibold">Recommendations</h3>
                                        <ul className="space-y-3">
                                            {(result.severity === 'High risk' ? [
                                                '🚨Immediate medical consultation required',
                                                '🩺PCR test prioritization',
                                                '🏥Hospital admission evaluation',
                                                '📋24-hour monitoring advised'
                                            ] : [
                                                '🏠Home quarantine protocol',
                                                '🌡️Daily symptom tracking',
                                                '🩹Telemedicine follow-up',
                                                '📞Emergency contact setup'
                                            ]).map((item, index) => (
                                                <li key={index} className="flex items-center space-x-2">
                                                    <div className="w-2 h-2 bg-white rounded-full" />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Crona;